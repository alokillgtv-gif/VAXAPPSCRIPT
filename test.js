    // ============================================================
    // UTILITIES
    // ============================================================
    function escapeHtml(text) {
        if (typeof text !== 'string') return String(text);
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function scrollToLine(line, col) {
        const editor = window.__labJsEditor;
        if (!editor) return;
        const line1 = Math.max(1, line);
        const col1 = Math.max(1, col || 1);

        if (typeof editor.setCursor === 'function') {
            editor.setCursor(line1 - 1, col1 - 1);
            editor.scrollIntoView({ line: line1 - 1, ch: col1 - 1 }, 120);
            editor.focus();
            if (editor.addLineClass) {
                if (window.__labLastErrorLineHandle) {
                    try {
                        editor.removeLineClass(window.__labLastErrorLineHandle, 'background', 'lab-error-line');
                    } catch (e) {}
                }
                const handle = editor.addLineClass(line1 - 1, 'background', 'lab-error-line');
                window.__labLastErrorLineHandle = handle;
                setTimeout(function() {
                    if (window.__labLastErrorLineHandle === handle) {
                        try {
                            editor.removeLineClass(handle, 'background', 'lab-error-line');
                        } catch (e) {}
                        window.__labLastErrorLineHandle = null;
                    }
                }, 3000);
            }
            return;
        }

        // CodeMirror 6 fallback
        if (editor.dispatch && editor.state && editor.state.doc) {
            const doc = editor.state.doc;
            if (line1 <= doc.lines) {
                const pos = doc.line(line1).from + (col1 - 1);
                editor.dispatch({ selection: { anchor: pos }, scrollIntoView: true });
                editor.focus();
            }
        }
    }


    // ============================================================
    // ERROR EXPERT
    // ============================================================
    const LabErrorExpert = {
        PATTERNS: [
            {
                id: 'REF_NOT_DEFINED',
                test: /(\w+)\s+is not defined/,
                translate: function(m) { return 'Lỗi tham chiếu: Biến/hàm "' + m[1] + '" chưa được định nghĩa.'; },
                suggest: function(m, line, code) {
                    var h = [
                        '• Kiểm tra xem bạn đã khai báo "' + m[1] + '" bằng let/const/var chưa.',
                        '• Kiểm tra chính tả: JS phân biệt chữ hoa/thường (VD: myVar ≠ myvar).'
                    ];
                    if (code && /document\.|window\./.test(code)) {
                        h.push('• Nếu là DOM API, đảm bảo code chạy sau khi HTML đã render.');
                    }
                    return h.join('\n');
                }
            },
            {
                id: 'TYPE_CANNOT_READ',
                test: /Cannot read propert(?:y|ies)\s+'([^']+)'(?:\s+of\s+(\S+))?/,
                translate: function(m) {
                    var target = m[2] || 'null / undefined';
                    return 'Lỗi kiểu dữ liệu: Không thể đọc thuộc tính "' + m[1] + '" của ' + target + '.';
                },
                suggest: function(m, line) {
                    return [
                        '• Kiểm tra đối tượng ở dòng ' + line + ' có bị null/undefined không.',
                        '• Thêm kiểm tra an toàn: if (obj && obj.' + m[1] + ') { ... }',
                        '• Dùng optional chaining: obj?.' + m[1]
                    ].join('\n');
                }
            },
            {
                id: 'TYPE_NOT_A_FUNCTION',
                test: /(\S+)\s+is not a function/,
                translate: function(m) { return 'Lỗi kiểu dữ liệu: "' + m[1] + '" không phải là hàm.'; },
                suggest: function(m, line) {
                    var h = [
                        '• Kiểm tra kiểu dữ liệu của "' + m[1] + '" tại dòng ' + line + '.',
                        '• Có thể bạn gọi .map()/.filter() trên giá trị không phải Array.',
                        '• Đảm bảo biến trỏ đến một hàm, không phải undefined/null.'
                    ];
                    if (m[1] === 'undefined') {
                        h.push('• Lỗi này thường xảy ra khi tên hàm bị gõ sai hoặc chưa được định nghĩa.');
                    }
                    return h.join('\n');
                }
            },
            {
                id: 'SYNTAX_UNEXPECTED_TOKEN',
                test: /Unexpected token\s*(.+)/,
                translate: function(m) {
                    var t = (m[1] || '').trim();
                    if (t === '}' || t === ']' || t === ')') return 'Lỗi cú pháp: Thừa dấu đóng ' + t + ' hoặc thiếu dấu mở tương ứng.';
                    if (t === '{' || t === '[' || t === '(') return 'Lỗi cú pháp: Thiếu dấu đóng tương ứng với ' + t + '.';
                    return 'Lỗi cú pháp: Ký tự "' + t + '" ở vị trí không hợp lệ.';
                },
                suggest: function(m, line) {
                    return [
                        '• Kiểm tra dấu chấm phẩy (;) hoặc dấu phẩy (,) có thể bị thiếu ở dòng trước dòng ' + line + '.',
                        '• Kiểm tra dấu nháy đơn/kép/backtick có khớp nhau không.',
                        '• Kiểm tra cặp ngoặc nhọn/vuông/tròn có khớp không.'
                    ].join('\n');
                }
            },
            {
                id: 'SYNTAX_MISSING_INIT',
                test: /Missing initializer in (const|let|var) declaration/,
                translate: function(m) { return 'Lỗi cú pháp: Thiếu giá trị khởi tạo khi khai báo "' + m[1] + '".'; },
                suggest: function(m) {
                    if (m[1] === 'const') {
                        return '• Biến const BẮT BUỘC phải gán giá trị ngay.\n• Sai: const x; x = 5;\n• Đúng: const x = 5;';
                    }
                    return '• Hãy gán giá trị mặc định: ' + m[1] + ' x = 0;';
                }
            },
            {
                id: 'SYNTAX_UNEXPECTED_ID',
                test: /Unexpected identifier/,
                translate: function() { return 'Lỗi cú pháp: Từ khóa/tên biến không mong đợi ở vị trí này.'; },
                suggest: function(m, line) {
                    return [
                        '• Kiểm tra dòng ' + line + ' hoặc dòng trên có thiếu dấu chấm phẩy (;) không.',
                        '• Kiểm tra dấu nháy trong chuỗi có khớp nhau không.',
                        '• Nếu dùng object nhiều dòng, đảm bảo không thừa dấu phẩy ở cuối.'
                    ].join('\n');
                }
            },
            {
                id: 'SYNTAX_MISSING_BEFORE_BODY',
                test: /missing \{ before function body/,
                translate: function() { return 'Lỗi cú pháp: Thiếu dấu mở ngoặc nhọn { trước thân hàm.'; },
                suggest: function(m, line) {
                    return [
                        '• Kiểm tra khai báo hàm tại dòng ' + line + ': function tênHàm() { ... }',
                        '• Nếu dùng arrow function (=>), đảm bảo cú pháp: const fn = () => { ... };'
                    ].join('\n');
                }
            },
            {
                id: 'RANGE_STACK',
                test: /Maximum call stack size exceeded/,
                translate: function() { return 'Lỗi tràn stack: Đệ quy vô hạn hoặc vòng lặp quá sâu.'; },
                suggest: function() {
                    return [
                        '• Kiểm tra điều kiện dừng (base case) của hàm đệ quy.',
                        '• Kiểm tra hai hàm có gọi lẫn nhau tạo vòng lặp vô hạn không.'
                    ].join('\n');
                }
            },
            {
                id: 'TYPE_CONST_ASSIGN',
                test: /Assignment to constant variable/,
                translate: function() { return 'Lỗi gán biến: Cố gắng thay đổi giá trị const.'; },
                suggest: function() {
                    return [
                        '• Biến const không thể gán lại.',
                        '• Nếu cần thay đổi, đổi const → let.'
                    ].join('\n');
                }
            },
            {
                id: 'TYPE_NULLISH',
                test: /Cannot read propert(?:y|ies)\s+'([^']+)'\s+of\s+(null|undefined)/,
                translate: function(m) { return 'Lỗi Null/Undefined: Không thể đọc "' + m[1] + '" trên giá trị ' + m[2] + '.'; },
                suggest: function(m, line) {
                    return [
                        '• Dòng ' + line + ' đang truy cập thuộc tính trên giá trị ' + m[2] + '.',
                        '• Thêm kiểm tra: if (obj != null) { obj.' + m[1] + ' }',
                        '• Dùng || gán mặc định: const el = document.getElementById("x") || {}.'
                    ].join('\n');
                }
            },
            {
                id: 'SYNTAX_ILLEGAL_RETURN',
                test: /Illegal return statement/,
                translate: function() { return 'Lỗi cú pháp: return không hợp lệ ở ngoài hàm.'; },
                suggest: function() {
                    return [
                        '• return chỉ dùng bên trong thân hàm.',
                        '• Nếu muốn dừng script sớm, bọc code trong IIFE: (function() { ... return; })();'
                    ].join('\n');
                }
            }
        ],

        analyze: function(err, sourceCode) {
            var msg = err.message || '';
            for (var i = 0; i < this.PATTERNS.length; i++) {
                var p = this.PATTERNS[i];
                var m = msg.match(p.test);
                if (m) {
                    return {
                        id: p.id,
                        title: p.translate(m, err),
                        original: msg,
                        suggestion: p.suggest(m, null, sourceCode)
                    };
                }
            }
            return {
                id: 'UNKNOWN',
                title: 'Lỗi ' + (err.name || 'Không xác định'),
                original: msg,
                suggestion: '• Kiểm tra cú pháp và logic tại dòng báo lỗi.\n• Đảm bảo biến/hàm đã được định nghĩa.'
            };
        }
    };


    // ============================================================
    // RENDER LOG ENTRY
    // ============================================================
    function renderLogEntry(analysis, userLine, userCol) {
        var html =
            '<div class="lab-log-entry lab-log-error">' +
                '<div class="lab-log-header">' +
                    '<span class="lab-log-badge">🔴</span>' +
                    '<span class="lab-log-title">' + escapeHtml(analysis.title) + '</span>' +
                '</div>' +
                '<div class="lab-log-location" data-line="' + userLine + '" data-col="' + (userCol || 1) + '" title="Click để nhảy đến vị trí lỗi">' +
                    '📍 <span class="lab-log-line">Dòng ' + userLine + (userCol ? ', Cột ' + userCol : '') + '</span>' +
                    '<span class="lab-log-hint">(click để nhảy đến)</span>' +
                '</div>' +
                '<div class="lab-log-original">📝 ' + escapeHtml(analysis.original) + '</div>' +
                '<div class="lab-log-suggestion">' +
                    '💡 <pre style="white-space:pre-wrap;margin:0;font-family:inherit;">' + escapeHtml(analysis.suggestion) + '</pre>' +
                '</div>' +
            '</div>';

        var $entry = $(html);
        $entry.find('.lab-log-location').on('click', function() {
            scrollToLine(
                parseInt($(this).attr('data-line'), 10),
                parseInt($(this).attr('data-col'), 10)
            );
        });
        return $entry;
    }


    // ============================================================
    // MAIN ENGINE
    // ============================================================
    window.executeJsEngine = function() {
        var userCode = window.__labJsEditor ? window.__labJsEditor.getValue() : '';
        if (!userCode || !userCode.trim()) return;

        var $consoleBox = $('#labConsoleLogBody');
        $consoleBox.removeClass('flash-success flash-error');

        // Tạo sourceURL duy nhất để stack trace hiển thị đúng tên
        var sourceUrl = 'lab_script_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);

        // Wrapper: IIFE cho phép return, giữ scope sạch
        // Dòng 1: (function() {
        // Dòng 2: userCode dòng 1
        // Dòng 3: userCode dòng 2
        // ...
        // Dòng cuối: })();
        // Dòng sau: //# sourceURL=...
        // OFFSET = 1 (chỉ 1 dòng prefix trước userCode)
        var PREFIX = '(function() {\n';
        var SUFFIX = '\n})();\n//# sourceURL=' + sourceUrl;
        var LINE_OFFSET = 1;

        var wrapped = PREFIX + userCode + SUFFIX;

        try {
            // eval chạy trong local scope, IIFE giữ scope sạch
            eval(wrapped);
        } catch (err) {
            // Trích xuất dòng/cột từ stack trace
            var rawLine = 1, rawCol = 1;
            var stack = err.stack || '';
            var regex = new RegExp(sourceUrl + ':(\\d+):(\\d+)');
            var m = stack.match(regex);
            if (m) {
                rawLine = parseInt(m[1], 10);
                rawCol = parseInt(m[2], 10);
            }
            // Nếu stack không có sourceURL, thử parse generic
            if (!m) {
                var generic = stack.match(/:(\d+):(\d+)/);
                if (generic) {
                    rawLine = parseInt(generic[1], 10);
                    rawCol = parseInt(generic[2], 10);
                }
            }

            var userLine = Math.max(1, rawLine - LINE_OFFSET);

            var analysis = LabErrorExpert.analyze(err, userCode);
            var $entry = renderLogEntry(analysis, userLine, rawCol);
            $consoleBox.append($entry);
            $consoleBox.addClass('flash-error');
            scrollToLine(userLine, rawCol);
            return;
        }

        // Thành công
        $consoleBox.addClass('flash-success');
        if (typeof window.__labAppendLog === 'function') {
            window.__labAppendLog('✅ Thực thi thành công', 'success');
        }
    };


    // ============================================================
    // CSS INJECT (một lần)
    // ============================================================
    if (!document.getElementById('lab-engine-styles')) {
        var style = document.createElement('style');
        style.id = 'lab-engine-styles';
        style.textContent =
            '.lab-log-entry { padding: 10px 12px; margin: 6px 0; border-radius: 6px; font-family: "Segoe UI", Consolas, monospace; font-size: 13px; line-height: 1.5; background: #2a0a0a; border: 1px solid #5c1a1a; color: #ffcccc; }' +
            '.lab-log-header { font-weight: 700; font-size: 14px; margin-bottom: 6px; color: #ff6b6b; }' +
            '.lab-log-location { cursor: pointer; color: #ffd93d; margin-bottom: 4px; user-select: none; display: inline-block; padding: 2px 6px; border-radius: 4px; transition: background 0.15s; }' +
            '.lab-log-location:hover { background: rgba(255, 217, 61, 0.15); text-decoration: underline; }' +
            '.lab-log-line { font-weight: 600; font-family: Consolas, monospace; }' +
            '.lab-log-hint { opacity: 0.65; font-size: 0.85em; margin-left: 6px; }' +
            '.lab-log-original { color: #ff9999; margin-bottom: 6px; font-style: italic; }' +
            '.lab-log-suggestion { color: #a8e6cf; padding: 6px 8px; background: rgba(0,0,0,0.2); border-radius: 4px; }' +
            '.lab-log-suggestion pre { color: #a8e6cf; }' +
            '.lab-error-line { background: rgba(255, 0, 0, 0.12) !important; }';
        document.head.appendChild(style);
    }

