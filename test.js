
        //[UPDATE 2.0] Inject CSS for HTML Source Viewer Modal
        const htmlSourceStyle = document.createElement('style');
        htmlSourceStyle.id = 'lab-html-source-viewer-styles';
        htmlSourceStyle.textContent = `
            #labHtmlSourceModal {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.92); z-index: 2147483647;
                display: none; flex-direction: column;
                font-family: 'Segoe UI', sans-serif;
            }
            #labHtmlSourceModal.lab-html-modal-active { display: flex !important; }
            .lab-html-modal-header {
                background: #151515; border-bottom: 2px solid #3498db;
                padding: 8px 14px; display: flex; align-items: center; gap: 10px;
                flex-shrink: 0; height: 48px;
            }
            .lab-html-modal-title { color: #3498db; font-weight: bold; font-size: 14px; white-space: nowrap; }
            .lab-html-search-wrap { display: flex; align-items: center; gap: 6px; flex: 1; max-width: 600px; }
            .lab-html-search-input {
                background: #1a1a1a; border: 1px solid #333; color: #fff;
                padding: 4px 8px; border-radius: 3px; font-size: 13px; flex: 1; outline: none;
            }
            .lab-html-search-input:focus { border-color: #3498db; }
            .lab-html-search-btn {
                background: #34495e; color: #fff; border: none;
                padding: 4px 10px; font-size: 12px; border-radius: 3px; cursor: pointer;
            }
            .lab-html-search-btn:hover { background: #4e6a85; }
            .lab-html-search-btn.btn-danger { background: #c0392b; }
            .lab-html-search-btn.btn-danger:hover { background: #e74c3c; }
            .lab-html-search-count { color: #aaa; font-size: 12px; min-width: 80px; text-align: center; }
            .lab-html-modal-body { display: flex; flex: 1; overflow: hidden; position: relative; }
            .lab-html-editor-wrap { flex: 1; display: flex; flex-direction: column; overflow: hidden; transition: flex 0.3s ease; }
            .lab-html-editor-wrap.sidebar-open { flex: 0 0 70% !important; }
            .lab-html-sidebar {
                flex: 0 0 0%; background: #1a1a1a; border-left: 2px solid #252525;
                display: flex; flex-direction: column; overflow: hidden; transition: flex 0.3s ease;
            }
            .lab-html-sidebar.sidebar-open { flex: 0 0 30% !important; }
            .lab-html-sidebar-header {
                background: #252525; padding: 8px 10px; color: #aaa;
                font-size: 12px; font-weight: bold; border-bottom: 1px solid #333;
                display: flex; justify-content: space-between; align-items: center;
            }
            .lab-html-sidebar-list { flex: 1; overflow-y: auto; padding: 4px; }
            .lab-html-match-item {
                padding: 5px 8px; color: #ccc; font-size: 12px; cursor: pointer;
                border-bottom: 1px solid #252525; font-family: 'Consolas', monospace;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .lab-html-match-item:hover { background: #252525; }
            .lab-html-match-item.active-match { background: #3498db !important; color: #fff; }
            .lab-html-match-item .match-num { color: #e67e22; font-weight: bold; margin-right: 6px; }
            .lab-html-toast {
                position: fixed; background: rgba(46, 204, 113, 0.95); color: #fff;
                padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;
                pointer-events: none; z-index: 2147483648; box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                opacity: 0; transition: opacity 0.3s ease; max-width: 300px; word-break: break-all;
            }
            .lab-html-toast.show { opacity: 1; }
            .lab-html-search-highlight { background: rgba(230, 126, 34, 0.6) !important; }
            .lab-html-editor-wrap .CodeMirror { font-size: 15px !important; }
        `;
        document.head.appendChild(htmlSourceStyle);
        //[UPDATE 2.0] END CSS injection
        
        //[UPDATE 2.0] Full-screen HTML Source Viewer Feature
        (function initHtmlSourceViewer() {
            // Inject Modal HTML
            const modalHtml = `
                <div id="labHtmlSourceModal">
                    <div class="lab-html-modal-header">
                        <span class="lab-html-modal-title">📄 Xem Mã Nguồn Gốc</span>
                        <div class="lab-html-search-wrap">
                            <input type="text" class="lab-html-search-input" id="labHtmlSearchInput" placeholder="Tìm kiếm...">
                            <button class="lab-html-search-btn" id="labHtmlSearchPrev">▲ Trước</button>
                            <button class="lab-html-search-btn" id="labHtmlSearchNext">▼ Sau</button>
                            <span class="lab-html-search-count" id="labHtmlSearchCount">0/0</span>
                        </div>
                        <button class="lab-html-search-btn" id="labHtmlToggleSidebar" title="Bật/Tắt Kết quả">📋</button>
                        <button class="lab-html-search-btn btn-danger" id="labHtmlCloseModal" title="Đóng (ESC)">✕</button>
                    </div>
                    <div class="lab-html-modal-body">
                        <div class="lab-html-editor-wrap" id="labHtmlEditorWrap">
                            <textarea id="labHtmlSourceTextarea"></textarea>
                        </div>
                        <div class="lab-html-sidebar" id="labHtmlSidebar">
                            <div class="lab-html-sidebar-header">
                                <span>Kết quả tìm kiếm</span>
                                <span id="labHtmlTotalMatches">0 kết quả</span>
                            </div>
                            <div class="lab-html-sidebar-list" id="labHtmlSidebarList"></div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHtml);

            // Add button to restore group
            const $viewSourceBtn = $('<button class="lab-mini-btn" id="labBtnViewSource" title="Xem Mã Nguồn Gốc" style="margin-right:4px;">📄</button>');
            $('#labRestoreGroupButtons').append($viewSourceBtn);

            // Modal elements
            const $modal = $('#labHtmlSourceModal');
            const $editorWrap = $('#labHtmlEditorWrap');
            const $sidebar = $('#labHtmlSidebar');
            const $sidebarList = $('#labHtmlSidebarList');
            const $searchInput = $('#labHtmlSearchInput');
            const $searchCount = $('#labHtmlSearchCount');
            const $totalMatches = $('#labHtmlTotalMatches');
            const $searchPrev = $('#labHtmlSearchPrev');
            const $searchNext = $('#labHtmlSearchNext');
            const $toggleSidebar = $('#labHtmlToggleSidebar');
            const $closeModal = $('#labHtmlCloseModal');

            let htmlSourceEditor = null;
            let currentHtmlSource = '';
            let parsedHtmlDocument = null;
            let searchMatches = [];
            let currentMatchIndex = -1;
            let sidebarOpen = false;
            let isUserSelecting = false;

            // Initialize CodeMirror
            const textarea = document.getElementById('labHtmlSourceTextarea');
            if (!textarea) return;

            htmlSourceEditor = CodeMirror.fromTextArea(textarea, {
                mode: 'htmlmixed',
                theme: 'dracula',
                lineNumbers: true,
                lineWrapping: true,
                readOnly: false,
                tabSize: 2,
                indentUnit: 2
            });

            // Set font size to ~15px
            $(htmlSourceEditor.getWrapperElement()).css('font-size', '15px');

            // Fetch and open source
            $viewSourceBtn.on('click', function(e) {
                e.stopPropagation();
                fetch(window.location.href)
                    .then(response => response.text())
                    .then(html => {
                        console.log("Original HTML source fetched successfully:", html);
                        currentHtmlSource = html;
                        htmlSourceEditor.setValue(html);
                        parsedHtmlDocument = new DOMParser().parseFromString(html, 'text/html');
                        $modal.addClass('lab-html-modal-active');
                        setTimeout(() => htmlSourceEditor.refresh(), 50);
                    })
                    .catch(err => {
                        console.error('Failed to fetch HTML source:', err);
                        if (typeof window.__labAppendLog === 'function') {
                            window.__labAppendLog('❌ Không thể tải mã nguồn HTML: ' + err.message, 'error');
                        }
                    });
            });

            // Close modal
            function closeModal() {
                $modal.removeClass('lab-html-modal-active');
                clearSearch();
            }
            $closeModal.on('click', closeModal);
            $(document).on('keydown.htmlSourceModal', function(e) {
                if (e.key === 'Escape' && $modal.hasClass('lab-html-modal-active')) {
                    closeModal();
                }
            });

            // Search functionality
            function clearSearch() {
                searchMatches = [];
                currentMatchIndex = -1;
                $searchCount.text('0/0');
                $totalMatches.text('0 kết quả');
                $sidebarList.empty();
                htmlSourceEditor.operation(() => {
                    htmlSourceEditor.getAllMarks().forEach(mark => mark.clear());
                });
            }

            function performSearch() {
                clearSearch();
                const query = $searchInput.val().trim();
                if (!query || query.length < 1) return;

                const cursor = htmlSourceEditor.getSearchCursor(query, { line: 0, ch: 0 }, { caseFold: true });
                let matchIndex = 0;

                htmlSourceEditor.operation(() => {
                    while (cursor.findNext()) {
                        matchIndex++;
                        const from = cursor.from();
                        const to = cursor.to();
                        const mark = htmlSourceEditor.markText(from, to, {
                            className: 'lab-html-search-highlight',
                            attributes: { 'data-match-index': matchIndex - 1 }
                        });
                        searchMatches.push({ from, to, mark, index: matchIndex });
                    }
                });

                $totalMatches.text(searchMatches.length + ' kết quả');
                $searchCount.text('0/' + searchMatches.length);

                // Populate sidebar
                $sidebarList.empty();
                searchMatches.forEach((match, idx) => {
                    const lineText = htmlSourceEditor.getLine(match.from.line).trim().substring(0, 80);
                    const $item = $('<div class="lab-html-match-item"></div>')
                        .html('<span class="match-num">#' + (idx + 1) + '</span>' + $('<div>').text(lineText).html())
                        .on('click', function() {
                            jumpToMatch(idx);
                        });
                    $sidebarList.append($item);
                });

                if (searchMatches.length > 0) {
                    jumpToMatch(0);
                    if (!sidebarOpen) toggleSidebar(true);
                }
            }

            function jumpToMatch(index) {
                if (searchMatches.length === 0) return;
                if (index < 0) index = searchMatches.length - 1;
                if (index >= searchMatches.length) index = 0;
                currentMatchIndex = index;

                const match = searchMatches[index];
                htmlSourceEditor.setSelection(match.from, match.to);
                htmlSourceEditor.scrollIntoView({ from: match.from, to: match.to }, 100);

                $searchCount.text((index + 1) + '/' + searchMatches.length);

                // Update sidebar active state
                $sidebarList.find('.lab-html-match-item').removeClass('active-match');
                const $activeItem = $sidebarList.find('.lab-html-match-item').eq(index);
                $activeItem.addClass('active-match');
                if ($activeItem.length) {
                    $activeItem[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }

            $searchInput.on('input', function() {
                performSearch();
            });

            $searchPrev.on('click', function(e) {
                e.stopPropagation();
                if (searchMatches.length === 0) performSearch();
                else jumpToMatch(currentMatchIndex - 1);
            });

            $searchNext.on('click', function(e) {
                e.stopPropagation();
                if (searchMatches.length === 0) performSearch();
                else jumpToMatch(currentMatchIndex + 1);
            });

            $searchInput.on('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchMatches.length === 0) performSearch();
                    else jumpToMatch(currentMatchIndex + 1);
                }
            });

            // Sidebar toggle
            function toggleSidebar(force) {
                if (typeof force !== 'undefined') sidebarOpen = force;
                else sidebarOpen = !sidebarOpen;
                $editorWrap.toggleClass('sidebar-open', sidebarOpen);
                $sidebar.toggleClass('sidebar-open', sidebarOpen);
                setTimeout(() => htmlSourceEditor.refresh(), 350);
            }

            $toggleSidebar.on('click', function(e) {
                e.stopPropagation();
                toggleSidebar();
            });

            // Smart Click-to-Copy & DOM Tree Integration
            $(htmlSourceEditor.getWrapperElement()).on('mousedown', function() {
                isUserSelecting = false;
            }).on('mouseup', function() {
                const sel = htmlSourceEditor.getSelection();
                if (sel && sel.length > 0) isUserSelecting = true;
            });

            $(htmlSourceEditor.getWrapperElement()).on('click', function(e) {
                if (isUserSelecting) return;
                
                const pos = htmlSourceEditor.coordsChar({ left: e.clientX, top: e.clientY });
                if (!pos) return;
                
                const token = htmlSourceEditor.getTokenAt(pos);
                if (!token || !token.string) return;
                
                const tokenString = token.string;
                const tokenType = token.type || '';
                let copyText = null;
                
                // Check if it's a string (attribute value)
                if (tokenType.indexOf('string') !== -1) {
                    copyText = tokenString.replace(/^["']|["']$/g, '');
                }
                // Check if it's an attribute name
                else if (tokenType.indexOf('attribute') !== -1) {
                    const tagName = findTagNameAtLine(htmlSourceEditor, pos.line);
                    const attrValue = findAttrValueOnLine(htmlSourceEditor.getLine(pos.line), tokenString);
                    if (tagName && attrValue !== undefined) {
                        copyText = tagName + '[' + tokenString + '="' + attrValue + '"]';
                    } else {
                        copyText = tokenString;
                    }
                }
                // Check if it's a tag name (not brackets)
                else if ((tokenType.indexOf('tag') !== -1) && /^[a-zA-Z][a-zA-Z0-9]*$/.test(tokenString)) {
                    const nearbyAttr = findNearbyAttribute(htmlSourceEditor.getLine(pos.line), pos.ch);
                    if (nearbyAttr) {
                        copyText = tokenString + '[' + nearbyAttr.name + '="' + nearbyAttr.value + '"]';
                    } else {
                        copyText = tokenString;
                    }
                    
                    // DOM Tree Integration: send element to DOM Tree Lab Panel
                    const element = findElementInParsedDoc(tokenString, pos.line);
                    if (element && typeof loadElementToTreeMain === 'function') {
                        loadElementToTreeMain(element);
                        $('#labFamilyTreeBar').css('display', 'flex');
                    }
                }
                // Otherwise, it's text content
                else {
                    copyText = tokenString;
                }
                
                if (copyText && copyText.trim()) {
                    copyToClipboardWithToast(copyText.trim(), e.clientX, e.clientY);
                }
            });

            // Helper: find tag name on current or nearby lines
            function findTagNameAtLine(cm, lineNum) {
                const line = cm.getLine(lineNum);
                const match = line.match(/<(\w+)/);
                if (match) return match[1];
                for (let i = lineNum - 1; i >= Math.max(0, lineNum - 5); i--) {
                    const m = cm.getLine(i).match(/<(\w+)/);
                    if (m) return m[1];
                }
                return null;
            }

            // Helper: find attribute value on line
            function findAttrValueOnLine(line, attrName) {
    // Sử dụng dấu gạch chéo ngược kép \\s để escape trong chuỗi string
    const regex = new RegExp(attrName + '\\s*=\\s*["\']([^"\']*)["\']');
    const match = line.match(regex);
    return match ? match[1] : '';
}

            // Helper: find nearby attribute on same line
            function findNearbyAttribute(line, cursorCh) {
                const attrs = line.matchAll(/(\w+)\s*=\s*["']([^"']*)["']/g);
                let closest = null;
                let closestDist = Infinity;
                for (const m of attrs) {
                    const dist = Math.abs(m.index - cursorCh);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closest = { name: m[1], value: m[2] };
                    }
                }
                return closest;
            }

            // Helper: find element in parsed document by tag name and approximate position
            function findElementInParsedDoc(tagName, lineNum) {
                if (!parsedHtmlDocument || !currentHtmlSource) return null;
                const allElements = Array.from(parsedHtmlDocument.querySelectorAll(tagName));
                if (allElements.length === 0) return null;
                if (allElements.length === 1) return allElements[0];
                
                // Count occurrences of this tag before the given line
                const lines = currentHtmlSource.split('\n');
                let occurrenceCount = 0;
                for (let i = 0; i <= lineNum && i < lines.length; i++) {
                    const regex = new RegExp('<' + tagName + '(?:\s|>|/)', 'gi');
                    const matches = lines[i].match(regex);
                    if (matches) occurrenceCount += matches.length;
                }
                
                if (occurrenceCount > 0 && occurrenceCount <= allElements.length) {
                    return allElements[occurrenceCount - 1];
                }
                return allElements[0];
            }

            // Toast notification
            function copyToClipboardWithToast(text, x, y) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
                } else {
                    fallbackCopy(text);
                }

                const displayText = text.length > 40 ? text.substring(0, 37) + '...' : text;
                const $toast = $('<div class="lab-html-toast"></div>').text('Đã sao chép: ' + displayText);
                $('body').append($toast);
                $toast.css({ left: (x + 10) + 'px', top: (y + 10) + 'px' });
                requestAnimationFrame(() => $toast.addClass('show'));
                setTimeout(() => {
                    $toast.removeClass('show');
                    setTimeout(() => $toast.remove(), 300);
                }, 3000);
            }

            function fallbackCopy(text) {
                const $temp = $('<textarea>').val(text).appendTo('body').select();
                document.execCommand('copy');
                $temp.remove();
            }

            // Prevent modal clicks from bubbling to document
            $modal.on('click', function(e) {
                e.stopPropagation();
            });
        })();
        //[UPDATE 2.0] END Full-screen HTML Source Viewer Feature