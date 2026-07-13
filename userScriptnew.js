// ### BLOCK START: UserScript Header & IIFE Start
// ==UserScript==
// @name         Web Interactive Lab & Inspector Dashboard PRO v16.3 (Stable Patch)
// @namespace    http://tampermonkey.net/
// @version      16.3
// @description  Hồi sinh Click chuột Phải soi DOM trong Hard-Sandbox. Tự động lưu trạng thái. Tích hợp Pro CodeEditor Engine & Sub-Panel Splitter + Fix UI/Draggable.
// @author       Gemini
// @match        *://*/*
//@run-at       document-start
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/javascript-hint.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/css-hint.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/closebrackets.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        window.outerHTML = document.getElementsByTagName("html")[0].outerHTML;
        if (window.self !== window.top) return;
// END BLOCK: UserScript Header & IIFE Start

        // ### BLOCK START: CSS Injection (High-Contrast Engine & CodeMirror)
        // ==========================================
        // 1. KHỞI TẠO VÀ NHÚNG CSS (HIGH-CONTRAST ENGINE STYLES & CODEMIRROR)
        // ==========================================
        const styleElement = document.createElement('style');
        styleElement.id = 'interactive-dashboard-styles-v15-0';
        styleElement.innerHTML = `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.css');

        #panelConsole.lab-panel.lab-v163-floating-console.lab-panel-hidden {
            display: none!important;
        }
            .lab-editor-container, .lab-editor-container, #labTreeDomBody, #labConsoleLogBody { text-align: left; }
            .activeMode { background: black!important; color: white!important; border: 1px solid red; }
            html, body { overscroll-behavior-y: contain !important; }

            /* Nút FAB (Nút nổi) để mở Dashboard */
            .lab-fab-wrapper:hover { opacity: 1; }
            .lab-fab-wrapper {
                opacity: 0.2; position: fixed !important; bottom: 20px !important; right: 50px !important;
                z-index: 2147483647 !important; display: flex !important; pointer-events: auto !important;
            }
            .lab-fab-main {
                width: 44px; height: 44px; border-radius: 50%; background-color: #3498db; color: white;
                border: none; font-size: 22px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                display: flex; align-items: center; justify-content: center;
            }

            /* Container chính của Dashboard */
            .lab-dashboard-container {
                position: fixed; background: #111111; z-index: 2147483646; box-shadow: 0 0 25px rgba(0,0,0,0.6);
                display: none; flex-direction: column; font-family: 'Segoe UI', sans-serif; box-sizing: border-box; overflow: hidden;
            }
            .lab-dashboard-container * { box-sizing: border-box; }

            /* Thanh công cụ (Restore Bar) */
            .lab-restore-bar {
                background: #151515; padding: 4px 10px; display: flex; gap: 8px; border-bottom: 1px solid #252525;
                font-size: 11px; color: #aaa; align-items: center; height: 38px; flex-shrink: 0; width: 100%;
            }
            .lab-restore-group { display: flex; gap: 5px; align-items: center; border-right: 1px solid #333; padding-right: 8px; }

            /* Chế độ hiển thị màn hình (Ngang / Dọc) */
            .lab-dashboard-container.mode-horizontal { bottom: 5px; left: 0; width: 100vw; height: 45vh; border-top: 3px solid #3498db; }

            .lab-dashboard-container.mode-vertical-right { top: 0; right: 0; height: 100vh !important; width: 35vw; border-left: 3px solid #2ecc71; }
            .lab-dashboard-container.mode-vertical-left { top: 0; left: 0; height: 100vh !important; width: 35vw; border-right: 3px solid #2ecc71; }
            .lab-dashboard-container.lab-vertical-panel-fullscreen { width: 100vw !important; }

            /* Grid Layout quản lý các Panel */
            .lab-layout-engine { display: grid; flex: 1; min-height: 0; width: 100%; padding: 4px; gap: 6px; background: #111; overflow: hidden; }
            .lab-dashboard-container.mode-horizontal .lab-layout-engine { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
            .lab-dashboard-container[class*="mode-vertical-"] .lab-layout-engine { grid-template-columns: 1fr !important; grid-template-rows: repeat(4, 1fr); }
            .lab-layout-engine.has-maximized { grid-template-columns: 1fr !important; grid-template-rows: 1fr !important; }
            .lab-layout-engine.has-maximized .lab-panel:not(.lab-panel-maximized):not(.lab-v163-floating-console) { display: none } /* [UPDATE] Fix console display */
            .lab-layout-engine.has-maximized.lab-sub-panel-active {
    display: block!important
}
            /* Cấu trúc các Panel bên trong Dashboard */
            .lab-panel { display: flex; flex-direction: column; background: #1e1e1e; border: 1px solid #252525; border-radius: 4px; overflow: hidden; position: relative; }
            .lab-panel.lab-panel-hidden { display: none !important; }
            .lab-panel.lab-panel-maximized { display: flex !important; width: 100%; height: 100% !important; } /* [UPDATE] Bỏ width 100% !important để JS linh hoạt tính toán margin */
            .lab-panel-header { background: #252525; padding: 6px 8px; display: flex; justify-content: space-between; align-items: center; color: #aaa; font-size: 11px; font-weight: bold; border-bottom: 1px solid #151515; flex-shrink: 0; user-select: none; cursor: default; } /* [UPDATE] Thêm cursor cho header */
            .lab-panel-title { color: #3498db; }
            .lab-panel-actions { display: flex; gap: 4px; align-items: center; }

            /* Nút chức năng thu nhỏ */
            .lab-mini-btn { background: #34495e; color: #fff; border: none; padding: 2px 6px; font-size: 11px; border-radius: 3px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; }
            .lab-mini-btn:hover { background: #4e6a85; }
            .lab-mini-btn.btn-danger { background: #c0392b; }
            .lab-mini-btn.btn-danger:hover { background: #e74c3c; }
            .lab-mini-btn.btn-success { background: #27ae60; }
            .lab-mini-btn.btn-success:hover { background: #2ecc71; }
            .lab-mini-btn.active-max { background: #e67e22 !important; }

            .lab-panel-body { flex: 1; overflow: auto; padding: 4px; position: relative; display: flex; flex-direction: column; background: #1e1e1e; min-height: 0; }

            /* Khu vực Editor (Soạn thảo mã) */
            .lab-editor-container { position: relative; flex: 1; width: 100%; height: 100%; background: #1a1a1a; border-radius: 4px; border: 1px solid #333; overflow: hidden; display: flex; flex-direction: column; }

            /* CodeMirror Override Styles cho khớp với giao diện Lab */
            .CodeMirror { flex: 1; width: 100% !important; height: 100% !important; font-family: 'Consolas', 'Consolas', monospace !important; font-size: 13px !important; line-height: 1.5 !important; background: #1a1a1a !important; }
            .CodeMirror-gutters { background: #151515 !important; border-right: 1px solid #333 !important; }
            .CodeMirror-hints { z-index: 2147483647 !important; font-family: 'Consolas', monospace !important; font-size: 12px !important; background: #252525 !important; border: 1px solid #3498db !important; box-shadow: 0 8px 20px rgba(0,0,0,0.8) !important; }
            .CodeMirror-hint { color: #f8f8f2 !important; padding: 4px 8px !important; }
            .CodeMirror-hint-active { background: #3498db !important; color: #fff !important; }

            /* Giao diện Console Output */
            .lab-console-output { flex: 1; background: #0d0d0d; border: 1px solid #333; border-radius: 4px; overflow: auto; font-family: 'Consolas', monospace; font-size: 12px; padding: 6px; display: flex; flex-direction: column; }
            .lab-log-item { margin-bottom: 4px; padding: 2px 4px; border-bottom: 1px solid #1a1a1a; white-space: pre-wrap; word-break: break-all; flex-shrink: 0; }
            .lab-log-error { color: #ff6b6b; background: rgba(255,107,107,0.1); }
            .lab-log-return { color: #f1c40f; font-weight: bold; }

            @keyframes labFlashSuccess { 0% { background-color: rgba(39, 174, 96, 0.4); } 100% { background-color: #0d0d0d; } }
            @keyframes labFlashError { 0% { background-color: rgba(192, 41, 43, 0.4); } 100% { background-color: #0d0d0d; } }
            .flash-success { animation: labFlashSuccess 0.8s ease-out; }
            .flash-error { animation: labFlashError 0.8s ease-out; }

            /* Giao diện cây DOM và Object */
            .tree-node, .obj-tree-node { font-family: 'Consolas', monospace; font-size: 11px; line-height: 1.4; margin-left: 12px; position: relative; }
            .tree-toggle, .obj-tree-toggle { cursor: pointer; color: #888; display: inline-block; width: 10px; margin-left: -12px; user-select: none; font-size: 10px; }
            .tree-toggle.collapsed, .obj-tree-toggle.collapsed { transform: rotate(-90deg); display: inline-block; }
            .tree-children.hidden, .obj-tree-children.hidden { display: none; }

            .html-bracket { color: #808080; }
            .html-tag { color: #5db0d7; font-weight: bold; }
            .html-attr { color: #9bbbdc; }
            .html-val { color: #f29766; }
            .html-text { color: #ffffff; }

            .obj-key { color: #ff79c6; font-weight: bold; }
            .obj-string { color: #50fa7b; }
            .obj-number { color: #ffb86c; }
            .obj-boolean { color: #bd93f9; font-style: italic; }
            .obj-null { color: #6272a4; }
            .obj-meta { color: #666; font-size: 10px; }
            #panelSnifferLab.lab-sub-select {
                display: none;
            }
            .lab-family-tree-bar { display: flex; gap: 4px; background: #151515; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px; border-bottom: 1px solid #252525; }
            .lab-geo-btn { padding: 2px 6px; border: none; font-size: 11px; font-weight: bold; color: #fff; border-radius: 3px; cursor: pointer; }

            .lab-inspect-child { outline: 2px dashed #e74c3c !important; outline-offset: 2px; position: relative; }
            .lab-inspect-child::before { content: ""; position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(231, 76, 60, 0.15) !important; pointer-events: none; z-index: 2147483640; }
            .lab-inspect-parent { outline: 2px dashed #2ecc71 !important; outline-offset: 4px; }
            .lab-inspect-grand { outline: 2px dashed #3498db !important; outline-offset: 6px; }

            .lab-pinned-child { outline: 2px solid #e74c3c !important; outline-offset: 2px; position: relative; }
            .lab-pinned-child::before { content: ""; position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(231, 76, 60, 0.25) !important; pointer-events: none; z-index: 2147483640; }
            .lab-pinned-parent { outline: 2px solid #2ecc71 !important; outline-offset: 4px; }
            .lab-pinned-grand { outline: 2px solid #3498db !important; outline-offset: 6px; }

            #labSandboxIframe { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; background: #ffffff; z-index: 10; display: none; }
            body.lab-active-sandbox-mode > *:not(#labMainDashboard):not(.lab-fab-wrapper):not(#labSandboxIframe) { display: none !important; }

            .lab-resizer { position: absolute; background: transparent; z-index: 10; transition: background 0.2s; }
            .lab-resizer:hover { background: rgba(52, 152, 219, 0.5) !important; }
            .lab-resizer.resizer-x { top: 0; right: -4px; width: 7px; height: 100%; cursor: col-resize; }
            .lab-resizer.resizer-y { bottom: -4px; left: 0; height: 7px; width: 100%; cursor: row-resize; }

            .lab-layout-engine.is-custom-resized { display: flex !important; flex-wrap: wrap !important; align-content: flex-start; }
            .lab-dashboard-container.mode-horizontal .lab-layout-engine.is-custom-resized .lab-panel:not(.lab-draggable-panel) { width: calc(50%-3px); height: calc(50%-3px); }
            .lab-dashboard-container[class*="mode-vertical-"] .lab-layout-engine.is-custom-resized .lab-panel:not(.lab-draggable-panel) { width: 100% !important; height: calc(25%-5px); }

            .mode-vertical-right #labRestoreGroupButtons, .mode-vertical-left #labRestoreGroupButtons { flex: 1 1 100%; }

            .header-get { display: none; }
            .lab-sniffer-item:hover p { display: block; }

            .lab-inspect-great-grand { outline: 2px dashed #9b59b6 !important; outline-offset: 8px; }
            .lab-inspect-great-great-grand { outline: 2px dashed #f1c40f !important; outline-offset: 10px; }
            .lab-inspect-ancestors { outline: 2px dashed #e67e22 !important; outline-offset: 12px; }

            .lab-pinned-great-grand { outline: 2px solid #9b59b6 !important; outline-offset: 8px; }
            .lab-pinned-great-great-grand { outline: 2px solid #f1c40f !important; outline-offset: 10px; }
            .lab-pinned-ancestors { outline: 2px solid #e67e22 !important; outline-offset: 12px; }

            /* Lớp đánh dấu thêm (7-10) */
            .lab-inspect-layer7 { outline: 2px dashed #d35400 !important; outline-offset: 14px; }
            .lab-inspect-layer8 { outline: 2px dashed #c0392b !important; outline-offset: 16px; }
            .lab-inspect-layer9 { outline: 2px dashed #16a085 !important; outline-offset: 18px; }
            .lab-inspect-layer10 { outline: 2px dashed #8e44ad !important; outline-offset: 20px; }

            .lab-pinned-layer7 { outline: 2px solid #d35400 !important; outline-offset: 14px; }
            .lab-pinned-layer8 { outline: 2px solid #c0392b !important; outline-offset: 16px; }
            .lab-pinned-layer9 { outline: 2px solid #16a085 !important; outline-offset: 18px; }
            .lab-pinned-layer10 { outline: 2px solid #8e44ad !important; outline-offset: 20px; }

.mode-vertical-right .lab-panel-title, #panelConsole.lab-panel-header span,.mode-vertical-left .lab-panel-title,.mode-vertical-right #panelConsole span,.mode-vertical-left #panelConsole span,#panelSnifferLab select {DISPLAY: NONE;}

            /* [UPDATE] Scrollbar to gấp 3 & khóa web */
         .lab-dashboard-container:not(.lab-fullscreen-mode) #panelConsole.lab-v163-floating-console{    height: calc(65vh-120px) !important;
    top: auto !important;
    bottom: 0;}

    /* 1. Định nghĩa lại độ rộng/cao cho các thanh cuộn của CodeMirror */
.CodeMirror-vscrollbar {
    width: 9px !important; /* Tăng từ 9px lên 15px hoặc tùy bạn chọn */
}
.CodeMirror-hscrollbar {
    height: 9px !important;
}

/* 2. Custom giao diện thanh cuộn chuẩn Webkit cho CodeMirror */
.CodeMirror-vscrollbar::-webkit-scrollbar,
.CodeMirror-hscrollbar::-webkit-scrollbar {
    width: 9px !important;
    height: 9px !important;
}

.CodeMirror-vscrollbar::-webkit-scrollbar-thumb,
.CodeMirror-hscrollbar::-webkit-scrollbar-thumb {
    background: #555 !important;
    border-radius: 4px;
}

.CodeMirror-vscrollbar::-webkit-scrollbar-track,
.CodeMirror-hscrollbar::-webkit-scrollbar-track {
    background: #1a1a1a !important;
}
/* Áp dụng cho thanh cuộn dọc */
.CodeMirror-vscrollbar::-webkit-scrollbar-thumb {
    background: #555 !important;
    border-radius: 4px;
    /* --- THÊM DÒNG NÀY --- */
    min-height: 30px !important; /* Dù dữ liệu dài cỡ nào, cục kéo cũng phải dài tối thiểu 40px */
}

/* Áp dụng cho thanh cuộn ngang */
.CodeMirror-hscrollbar::-webkit-scrollbar-thumb {
    background: #555 !important;
    border-radius: 4px;
    /* --- THÊM DÒNG NÀY --- */
    min-width: 30px !important;  /* Dù code dòng dài cỡ nào, cục kéo ngang cũng phải dài tối thiểu 40px */
}

/* ==========================================
   1. ĐỊNH NGHĨA KÍCH THƯỚC & MÀU NỀN THANH CUỘN
   ========================================== */
.lab-panel-body::-webkit-scrollbar,
.lab-console-output::-webkit-scrollbar,
#labSnifferBody::-webkit-scrollbar,#labTreeDomBody::-webkit-scrollbar {
    width: 9px !important;
    height: 9px !important;
}

.lab-panel-body::-webkit-scrollbar-track,
.lab-console-output::-webkit-scrollbar-track,
#labSnifferBody::-webkit-scrollbar-track,#labTreeDomBody::-webkit-scrollbar-track {
    background: #1a1a1a !important;
}

/* ==========================================
   2. CẤU HÌNH CỤC KÉO (THUMB) & KHÓA CHIỀU DÀI TỐI THIỂU
   ========================================== */
.lab-panel-body::-webkit-scrollbar-thumb,
.lab-console-output::-webkit-scrollbar-thumb,
#labSnifferBody::-webkit-scrollbar-thumb,#labTreeDomBody::-webkit-scrollbar-thumb {
    background: #555 !important;
    border-radius: 4px;

    /* Khống chế không cho cục kéo bị thu nhỏ quá mức khi dữ liệu dài */
    min-height: 30px !important; /* Áp dụng cho cuộn dọc */
    min-width: 30px !important;  /* Áp dụng cho cuộn ngang */
}
            body.lab-fullscreen-locked { overflow: hidden !important; }
            .lab-draggable-panel { box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important; border: 2px solid #e74c3c !important; }
.lab-dashboard-container:not(.lab-fullscreen-mode) #panelConsole.lab-v163-floating-console{    height: calc(65vh-120px) !important;
    top: auto !important;
    bottom: 0;}
#panelConsole.lab-panel.lab-panel-maximized.lab-panel-hidden {display: none!important;}
.lab-tree-sync-highlight {
    background-color: rgba(46, 204, 113, 0.4) !important;
    outline: 2 px dashed #e74c3c!important;
    outline-offset: 2 px;
}
.lab-cm-error-line { background-color: rgba(231, 76, 60, 0.3)!important; }
.lab-error-line-link: hover {color: #fff!important;text-decoration: none!important; }
/* Lớp phủ chặn click quảng cáo */
.lab-overlay-blocker {
        position: fixed;
        top: 0;left: 0;width: 100 % ;height: 100 % ;
        z-index: 999999;
        background: transparent;
        pointer-events: none; /* Mặc định trong suốt để thao tác bình thường */
        display: none;
    }
    .lab-overlay-blocker.active {
        display: block;
        pointer-events: all; /* Khi bật, nó sẽ chặn mọi click vào trang web */
    }
    .lab-dashboard-container.mode-horizontal.lab-fullscreen-mode { height: 85vh!important; }
        `;
        document.head.appendChild(styleElement);

        const originalBodyStyle = { width: $('html').css('width'), overflowX: $('html').css('overflow-x') };
        // END BLOCK: CSS Injection (High-Contrast Engine & CodeMirror)

        // ### BLOCK START: HTML Dashboard Structure
        // ==========================================
        // 2. KHỞI TẠO CẤU TRÚC HTML DASHBOARD
        // ==========================================
        const dashboardHtml = `
            <div class="lab-fab-wrapper"><button class="lab-fab-main" id="labFabBtn" title="Chuột trái: Đóng/Mở | Click Phải x1: Xuống đáy | Click Phải x2: Lên đỉnh">+</button></div>

            <div class="lab-dashboard-container mode-horizontal" id="labMainDashboard">
                <div class="lab-restore-bar" id="labRestoreBar">
                    <div class="lab-restore-group">
                        <button class="lab-mini-btn btn-success" id="labBtnToggleOrientation" title="Đổi chiều dọc/ngang">🔄</button>
                        <button class="lab-mini-btn" id="labBtnLeftRight" style="display:none;" title="Chuyển trái/phải">➡️ </button>
                        <button class="lab-mini-btn" id="labBtnMaximizeDashboard" title="Phóng to Dashboard">⚙️ </button>
                        <button class="lab-mini-btn" id="labBtnResetLayout" title="Khôi phục kích thước gốc" style="background:#f39c12;">🔄</button>
                    </div>
                    <div class="lab-restore-group sanbox-group">
                        <span style="color:#e67e22; font-weight:bold;"></span>
                        <button class="lab-mini-btn" id="labBtnSourceSandbox" style="background:#8e44ad;" title="Bật/Tắt Sandbox">📦</button>
                    </div>
                    <div class="lab-restore-group" id="labRestoreGroupButtons">
                        <span></span>
                        <button class="lab-mini-btn btn-success lab-btn-restore" data-target="#panelTreeDom" style="display:none;">Tree Dom</button>
                        <button class="lab-mini-btn btn-success lab-btn-restore" data-target="#panelCss" style="display:none;">CSS Live</button>
                        <button class="lab-mini-btn btn-success lab-btn-restore" data-target="#panelJs" style="display:none;">JS jQuery</button>
                        <button class="lab-mini-btn btn-success lab-btn-restore" data-target="#panelConsole" style="display:none;">Console</button>
                    </div>
                </div>

                <div class="lab-layout-engine" id="labLayoutEngine">
                    <div class="lab-panel" id="panelTreeDom">
                        <div class="lab-panel-header">
                            <span class="lab-panel-title">[ TREE DOM LAB ]</span>
                            <input type="text" id="labMiniTreeSearch" placeholder="🔍 Tìm trong cây..." style="background:#111; border:1px solid #333; color:#fff; padding:2px 6px; font-size:10px; margin-left:10px; border-radius:3px; outline:none; width:120px;">
                            <div class="lab-panel-actions">
                                <button class="lab-mini-btn lab-btn-max" data-target="#panelTreeDom">🔲 </button>
                                <button class="lab-mini-btn lab-btn-toggle" data-target="#panelTreeDom">Ẩn</button>
                            </div>
                        </div>
                        <div class="lab-panel-body">
                            <div class="lab-family-tree-bar" id="labFamilyTreeBar" style="display:none; flex-wrap: wrap; align-items: center;">
                                <button class="lab-geo-btn" id="geoBtnTarget" style="background:#e74c3c; margin-bottom:2px;">Lớp 1</button>
                                <button class="lab-geo-btn" id="geoBtnParent" style="background:#2ecc71; margin-bottom:2px;">Lớp 2</button>
                                <button class="lab-geo-btn" id="geoBtnGrand" style="background:#3498db; margin-bottom:2px;">Lớp 3</button>
                                <button class="lab-geo-btn" id="geoBtnGreatGrand" style="background:#9b59b6; margin-bottom:2px;">Lớp 4</button>
                                <button class="lab-geo-btn" id="geoBtnGreatGreatGrand" style="background:#f1c40f; color:#000; margin-bottom:2px;">Lớp 5</button>
                                <button class="lab-geo-btn" id="geoBtnAncestors" style="background:#e67e22; margin-bottom:2px;">Lớp 6</button>
                                <button class="lab-geo-btn" id="geoBtnLayer7" style="background:#d35400; margin-bottom:2px;">Lớp 7</button>
                                <button class="lab-geo-btn" id="geoBtnLayer8" style="background:#c0392b; margin-bottom:2px;">Lớp 8</button>
                                <button class="lab-geo-btn" id="geoBtnLayer9" style="background:#16a085; margin-bottom:2px;">Lớp 9</button>
                                <button class="lab-geo-btn" id="geoBtnLayer10" style="background:#8e44ad; margin-bottom:2px;">Lớp 10</button>
                                <button class="lab-geo-btn" id="geoBtnReverseDown" style="background:#00cec9; color:#000; margin-bottom:2px; margin-left:4px; border: 1px solid #fff;" title="Đảo chiều: Đi xuống lớp con liền kề">⬇️ </button>
                            </div>
                            <div id="labTreeDomBody" style="background:#151515; color:#abb2bf; padding:6px; flex:1; overflow:auto; border-radius:4px; font-size:11px;">
                                <span style="color:#666; font-style:italic;"></span>
                            </div>
                        </div>
                    </div>

                    <div class="lab-panel" id="panelCss">
                        <div class="lab-panel-header">
                            <span class="lab-panel-title">MÃ CSS INTERACTIVE (LIVE)</span>
                            <div class="lab-panel-actions">
                                <button class="lab-mini-btn lab-btn-max" data-target="#panelCss">🔲 </button>
                                <button class="lab-mini-btn btn-danger" id="labBtnClearCss">Xóa</button>
                                <button class="lab-mini-btn lab-btn-toggle" data-target="#panelCss">Ẩn</button>
                            </div>
                        </div>
                        <div class="lab-panel-body">
                            <div class="lab-editor-container">
                                <textarea id="labCssInput" placeholder="/* Viết CSS tại đây... */"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="lab-panel" id="panelJs">
                        <div class="lab-panel-header">
                            <span class="lab-panel-title">MÃ JS JQUERY (PRO EDITOR)</span>
                            <div class="lab-panel-actions">
                                <select class="lab-select-size lab-font-size" title="Tăng size font">
                                    <option value="13">13px</option>
                                    <option value="15">15px</option>
                                    <option value="16">16px</option>
                                    <option value="17">17px</option>
                                    <option value="18">18px</option>
                                    <option value="19">19px</option>
                                    <option value="20">20px</option>
                                </select>
                                <button class="lab-mini-btn btn-success" id="labBtnRunJs" style="margin-right:4px;">▶ </button>
                                <button class="lab-mini-btn lab-btn-max" data-target="#panelJs">🔲 </button>
                                <button class="lab-mini-btn btn-danger" id="labBtnClearJs">Xóa</button>
                                <button class="lab-mini-btn lab-btn-toggle" data-target="#panelJs">Ẩn</button>
                            </div>
                        </div>
                        <div class="lab-panel-body">
                            <div class="lab-editor-container">
                                <textarea id="labJsInput" placeholder="// Viết code jQuery/JS... Ấn Ctrl + Enter để thực thi"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="lab-panel" id="panelConsole">
                        <div class="lab-panel-header">
                            <span style="color:#f1c40f; font-weight:bold;">CONSOLE LOG</span>
                            <div class="lab-panel-actions">
                                <button class="lab-mini-btn btn-success" id="labBtnCopyConsole" style="background:#0984e3; margin-right:4px;" title="Sao chép toàn bộ Log">📋</button>
                                <button class="lab-mini-btn lab-btn-max" data-target="#panelConsole">🔲 </button>
                                <button class="lab-mini-btn btn-danger" id="labBtnClearConsole">Xóa</button>
                                <button class="lab-mini-btn lab-btn-toggle" data-target="#panelConsole">Ẩn</button>
                            </div>
                        </div>
                        <div class="lab-panel-body"><div class="lab-console-output" id="labConsoleLogBody"></div></div>
                    </div>
                </div>
            </div>
            <iframe id="labSandboxIframe" sandbox="allow-scripts"></iframe>
        `;
        $('body').append(dashboardHtml);
        $('head').append('<style id="lab-dynamic-live-css"></style>');

        const $dashboard = $('#labMainDashboard');
        const $fabBtn = $('#labFabBtn');
        const $layoutEngine = $('#labLayoutEngine');
        const $consoleLog = $('#labConsoleLogBody');
        const $treeDomBody = $('#labTreeDomBody');
        const $familyTreeBar = $('#labFamilyTreeBar');
        const $cssInput = $('#labCssInput');
        const $jsInput = $('#labJsInput');
        const $sandboxIframe = $('#labSandboxIframe');

        let isInspectEnabled = false;
        let layoutState = 'horizontal';
        let savedTarget = null, savedParent = null, savedGrand = null;
        let isSandboxModeActive = false;
        let currentGeoDepth = 0;

        function escapeHtml(str) {
            return str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
        }
        // END BLOCK: HTML Dashboard Structure

        // ### BLOCK START: Events & LocalStorage State Manager
        // ==========================================
        // 3. SỰ KIỆN VÀ LOCALSTORAGE TRẠNG THÁI
        // ==========================================
        $jsInput.val(localStorage.getItem('lab_saved_js') || '');
        $cssInput.val(localStorage.getItem('lab_saved_css') || '');
        if ($cssInput.val()) {
            $('#lab-dynamic-live-css').text($cssInput.val());
        }

        const isDashboardSavedOpen = localStorage.getItem('lab_dashboard_open') === 'true';
        if (isDashboardSavedOpen) {
            $dashboard.css('display', 'flex');
            $fabBtn.text('×').css('background-color', '#e74c3c');
            isInspectEnabled = true;
            setTimeout(() => { updateScreenSplitting(); }, 200);
        }

        $jsInput.on('input', function() { localStorage.setItem('lab_saved_js', $(this).val()); });
        $cssInput.on('input', function() {
            const currentVal = $(this).val();
            localStorage.setItem('lab_saved_css', currentVal);
            if(!isSandboxModeActive) {
                $('#lab-dynamic-live-css').text(currentVal);
            } else {
                if($sandboxIframe[0].contentWindow) {
                    $sandboxIframe[0].contentWindow.postMessage({ type: 'LAB_LIVE_CSS', css: currentVal }, '*');
                }
            }
        });
        // END BLOCK: Events & LocalStorage State Manager

        // ### BLOCK START: Console Override & Logging
        // ==========================================
        // 4. BẮT GHI ĐÈ BỘ CONSOLE
        // ==========================================
        window.__labAppendLog = function(msg, type = 'log') {
            let className = type === 'error' ? 'lab-log-error' : (type === 'return' ? 'lab-log-return' : 'lab-log-info');
            $consoleLog.prepend(`<div class="lab-log-item ${className}"><span>${escapeHtml(String(msg))}</span></div>`);
            $consoleLog.scrollTop(0);
        };

        const _oldLog = console.log;
        const _oldErr = console.error;
        console.log = function(...args) {
            _oldLog.apply(console, args);
            window.__labAppendLog(args.join(' '), 'log');
        };
        console.error = function(...args) {
            _oldErr.apply(console, args);
            window.__labAppendLog(args.join(' '), 'error');
        };
        // END BLOCK: Console Override & Logging

        // ### BLOCK START: Object Tree Renderer
        // ==========================================
        // 5. TRÌNH TẠO CÂY ĐỐI TƯỢNG (OBJECT TREE RENDERER)
        // ==========================================
        window.__labBuildObjectTreeElement = function(obj, keyName = null) {
            const $container = jQuery('<div>').addClass('obj-tree-node');
            const displayKey = keyName ? `<span class="obj-key">${keyName}</span>: ` : '';

            if (obj === null) return $container.html(`${displayKey}<span class="obj-null">null</span>`);
            if (typeof obj !== 'object') {
                if (typeof obj === 'string') return $container.html(`${displayKey}<span class="obj-string">"${escapeHtml(obj)}"</span>`);
                if (typeof obj === 'number') return $container.html(`${displayKey}<span class="obj-number">${obj}</span>`);
                if (typeof obj === 'boolean') return $container.html(`${displayKey}<span class="obj-boolean">${obj}</span>`);
                return $container.html(`${displayKey}<span>${escapeHtml(String(obj))}</span>`);
            }

            const isArray = Array.isArray(obj);
            const openBracket = isArray ? '[' : '{';
            const closeBracket = isArray ? ']' : '}';
            const metaInfo = isArray ? `Array(${obj.length})` : 'Object';
            const $toggle = jQuery('<span>').addClass('obj-tree-toggle').html('▼ ');
            const $children = jQuery('<div>').addClass('obj-tree-children');

            $container.append($toggle)
                      .append(`<span>${displayKey}<span class="obj-meta">${metaInfo}</span> ${openBracket}</span>`)
                      .append($children);

            try {
                const keys = Object.keys(obj);
                if (keys.length === 0) {
                    $container.append(`<span> ${closeBracket}</span>`);
                    $toggle.css('visibility', 'hidden');
                    return $container;
                }
                keys.forEach(k => {
                    try {
                        const $childNode = window.__labBuildObjectTreeElement(obj[k], k);
                        if ($childNode) $children.append($childNode);
                    } catch(e) {}
                });
            } catch(e) {
                $container.append(`<span> <span class="obj-null">[Inaccessible]</span> ${closeBracket}</span>`);
                return $container;
            }
            $container.append(`<div><span>${closeBracket}</span></div>`);

            $toggle.on('click', function(e) {
                e.stopPropagation();
                jQuery(this).toggleClass('collapsed').html(jQuery(this).hasClass('collapsed') ? '▶ ' : '▼ ');
                $children.toggleClass('hidden');
            });
            return $container;
        };
        // END BLOCK: Object Tree Renderer

        // ### BLOCK START: PostMessage Sandbox Communication
        // ==========================================
        // 6. KÊNH GIAO TIẾP VỚI SANDBOX BẰNG POSTMESSAGE
        // ==========================================
        window.addEventListener('message', function(event) {
            const data = event.data;
            if (!data || typeof data !== 'object') return;

            if (data.type === 'LAB_SANDBOX_LOG') {
                window.__labAppendLog(data.msg, data.logType);
            }
            else if (data.type === 'LAB_SANDBOX_OBJECT_TREE') {
                const $treeNodeElement = window.__labBuildObjectTreeElement(data.obj, null);
                $treeNodeElement.addClass('lab-log-item').css({ 'padding-left': '14px', 'border-bottom': '1px solid #1a1a1a', 'margin-bottom': '4px' });
                $('#labConsoleLogBody').prepend($treeNodeElement).addClass('flash-success').scrollTop(0);
            }
            else if (data.type === 'LAB_SANDBOX_DOM_REPLY') {
                $treeDomBody.find('.tree-node, div').remove();
                if (data.html) {
                    $familyTreeBar.css('display', 'flex');
                    $treeDomBody.html(data.html);
                }
            }
        });
        // END BLOCK: PostMessage Sandbox Communication

        // ### BLOCK START: Sandbox Environment Initialization
        // ==========================================
        // 7. KHỞI TẠO MÔI TRƯỜNG SANDBOX CÔ LẬP
        // ==========================================
        $('#labBtnSourceSandbox').on('click', function() {
            if (!isSandboxModeActive) {
                window.__labAppendLog("⏳ Đang fetch mã nguồn Raw HTML nguyên bản từ Server...", "log");

                fetch(window.location.href, { cache: "no-store" })
                .then(response => response.text())
                .then(rawHtmlCode => {
                    const clientSandboxControllerScript = `
                        <script>
                            (function() {
                                window.console.log = function(...args) { window.parent.postMessage({ type: 'LAB_SANDBOX_LOG', logType: 'log', msg: args.join(' ') }, '*'); };
                                window.console.error = function(...args) { window.parent.postMessage({ type: 'LAB_SANDBOX_LOG', logType: 'error', msg: args.join(' ') }, '*'); };

                                let activeTarget = null;
                                let currentSandboxDepth = 0; // Thêm biến ghi nhớ cho Sandbox
                                function escapeH(s) { return s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''; }

                                function buildTreeString(node) {
                                    if (!node) return '';
                                    if (node.nodeType === 3) {
                                        const t = node.nodeValue.trim(); return t ? '<div class="tree-node"><span class="html-text">' + escapeH(t) + '</span></div>' : '';
                                    }
                                    if (node.nodeType === 1) {
                                        const tag = node.tagName.toLowerCase(); let attrStr = '';
                                        if (node.attributes) {
                                            for (let i = 0; i < node.attributes.length; i++) {
                                                attrStr += ' <span class="html-attr">' + node.attributes[i].name + '</span>=<span class="html-bracket">"</span><span class="html-val">' + escapeH(node.attributes[i].value) + '</span><span class="html-bracket">"</span>';
                                            }
                                        }
                                        let childHtml = '';
                                        node.childNodes.forEach(c => { childHtml += buildTreeString(c); });
                                        return '<div class="tree-node"><span class="tree-toggle">▼ </span><span>&lt;<span class="html-tag">' + tag + '</span>' + attrStr + '&gt;</span><div class="tree-children">' + childHtml + '</div><span>&lt;/<span class="html-tag">' + tag + '</span>&gt;</span></div>';
                                    }
                                    return '';
                                }

                                const internalStyle = document.createElement('style');
                                internalStyle.textContent = \`
                                    .lab-sb-hover { outline: 2px dashed #e74c3c !important; outline-offset: 2px; }
                                    .lab-sb-pinned { outline: 2px solid #e74c3c !important; outline-offset: 2px; }
                                \`;
                                document.head.appendChild(internalStyle);

                                document.addEventListener('mouseover', function(e) {
                                    document.querySelectorAll('.lab-sb-hover').forEach(el => el.classList.remove('lab-sb-hover'));
                                    e.target.classList.add('lab-sb-hover');
                                });

                                const handleSandboxInspectClick = function(e) {
                                    e.preventDefault(); e.stopPropagation();
                                    document.querySelectorAll('.lab-sb-hover, .lab-sb-pinned').forEach(el => el.classList.remove('lab-sb-hover', 'lab-sb-pinned'));
                                    activeTarget = e.target;
                                    currentSandboxDepth = 0; // Reset tầng về 0 khi chọn mới
                                    activeTarget.classList.add('lab-sb-pinned');
                                    const domTreeHtml = buildTreeString(activeTarget);
                                    window.parent.postMessage({ type: 'LAB_SANDBOX_DOM_REPLY', html: domTreeHtml }, '*');
                                };
                                document.addEventListener('contextmenu', handleSandboxInspectClick);

                                window.addEventListener('message', function(e) {
                                    const d = e.data; if(!d) return;
                                    if(d.type === 'LAB_LIVE_CSS') {
                                        let styleTag = document.getElementById('lab-sandbox-internal-css');
                                        if(!styleTag) {
                                            styleTag = document.createElement('style');
                                            styleTag.id = 'lab-sandbox-internal-css';
                                            document.head.appendChild(styleTag);
                                        }
                                        styleTag.textContent = d.css;
                                    }
                                    else if(d.type === 'LAB_EXECUTE_JS') {
                                        try {
                                            const decoded = decodeURIComponent(escape(atob(d.base64)));
                                            let rawRes = eval(decoded);
                                            if(rawRes !== undefined) {
                                                if(typeof rawRes === 'object' && rawRes !== null) {
                                                    window.parent.postMessage({ type: 'LAB_SANDBOX_OBJECT_TREE', code: decoded, obj: rawRes }, '*');
                                                } else {
                                                    window.parent.postMessage({ type: 'LAB_SANDBOX_LOG', logType: 'return', msg: rawRes }, '*');
                                                }
                                            }
                                        } catch(err) {
                                            window.parent.postMessage({ type: 'LAB_SANDBOX_LOG', logType: 'error', msg: "[Sandbox Error]: " + err.message }, '*');
                                        }
                                    }
                                    else if (d.type === 'LAB_GEO_INSPECT_REQUEST') {
                                        if (!activeTarget) return;

                                        // Cập nhật: Mở rộng map cho 10 Lớp và Đảo chiều trong Sandbox
                                        const depthMap = {
                                            'target': 0, 'parent': 1, 'grand': 2, 'greatgrand': 3,
                                            'greatgreatgrand': 4, 'ancestors': 5, 'layer7': 6,
                                            'layer8': 7, 'layer9': 8, 'layer10': 9
                                        };
                                        let loops = 0;
                                        if (d.geoMode === 'down') {
                                            currentSandboxDepth = Math.max(0, currentSandboxDepth-1);
                                            loops = currentSandboxDepth;
                                        } else {
                                            loops = depthMap[d.geoMode] !== undefined ? depthMap[d.geoMode] : 0;
                                            currentSandboxDepth = loops;
                                        }

                                        let targetNode = activeTarget;
                                        for (let i = 0; i < loops; i++) {
                                            if (targetNode.parentElement) targetNode = targetNode.parentElement;
                                        }

                                        document.querySelectorAll('.lab-sb-pinned').forEach(el => el.classList.remove('lab-sb-pinned'));
                                        targetNode.classList.add('lab-sb-pinned');
                                        const domTreeHtml = buildTreeString(targetNode);
                                        window.parent.postMessage({ type: 'LAB_SANDBOX_DOM_REPLY', html: domTreeHtml }, '*');
                                    }
                                });
                            })();
                        </script>
                    `;

                    const blob = new Blob([rawHtmlCode + clientSandboxControllerScript], { type: 'text/html' });
                    $sandboxIframe.attr('src', URL.createObjectURL(blob));

                    $sandboxIframe.show();
                    $('body').addClass('lab-active-sandbox-mode');
                    isSandboxModeActive = true;
                    isInspectEnabled = true;

                    $('#labBtnSourceSandbox').text('🔓').css('background', '#e67e22');

                    setTimeout(() => {
                        if($sandboxIframe[0].contentWindow) $sandboxIframe[0].contentWindow.postMessage({ type: 'LAB_LIVE_CSS', css: $cssInput.val() }, '*');
                    }, 500);
                })
                .catch(err => {
                    window.__labAppendLog("❌ Không thể fetch Raw Code từ Server: " + err.message, "error");
                });
            } else {
                $sandboxIframe.hide().attr('src', 'about:blank');
                $('body').removeClass('lab-active-sandbox-mode');
                isSandboxModeActive = false;
                $('#labBtnSourceSandbox').text('📦').css('background', '#8e44ad');
            }
            updateScreenSplitting();
        });
        // END BLOCK: Sandbox Environment Initialization

        // ### BLOCK START: JavaScript Dynamic Execution Engine
        // ==========================================
// 8. BỘ MÁY THỰC THI JAVASCRIPT ĐỘNG (FIXED & UPGRADED)
// ==========================================
// [1] Khởi tạo Bộ từ điển phiên dịch và gợi ý lỗi (Chỉ chạy 1 lần)
            if (!window.__labErrorTranslator) {
                window.__labErrorTranslator = function(errName, errMsg) {
                    let translated = errMsg;
                    let suggestion = "Kiểm tra lại cú pháp hoặc logic code của bạn tại dòng được báo lỗi.";

                    if (errName === 'ReferenceError') {
                        if (errMsg.includes('is not defined')) {
                            let varName = errMsg.replace(' is not defined', '');
                            translated = `Biến ${varName} chưa được khai báo.`;
                            suggestion = `Hãy đảm bảo bạn đã khai báo ${varName} bằng 'let', 'const', hoặc 'var' trước khi sử dụng, và kiểm tra xem có gõ sai chính tả không.`;
                        }
                    } else if (errName === 'TypeError') {
                        if (errMsg.includes('is not a function')) {
                            translated = `Bạn đang gọi một đối tượng không phải là hàm.`;
                            suggestion = `Kiểm tra lại xem biến/thuộc tính đó có tồn tại và có thực sự là một hàm (function) hay không.`;
                        } else if (errMsg.includes('Cannot read properties of undefined') || errMsg.includes('Cannot read property')) {
                            translated = `Không thể đọc thuộc tính của một đối tượng bị rỗng (undefined/null).`;
                            suggestion = `Đối tượng bạn đang cố truy cập hiện không có dữ liệu. Hãy console.log đối tượng đó ra trước dòng này để kiểm tra.`;
                        } else if (errMsg.includes('Assignment to constant variable')) {
                            translated = `Gán giá trị mới cho hằng số (const).`;
                            suggestion = `Bạn không thể thay đổi giá trị của biến 'const'. Hãy đổi 'const' thành 'let' nếu muốn cập nhật lại giá trị.`;
                        }
                    } else if (errName === 'SyntaxError') {
                        if (errMsg.includes('Unexpected token')) {
                            translated = `Dư hoặc sai ký tự cú pháp.`;
                            suggestion = `Thường do bạn bị thiếu/dư dấu ngoặc đơn '()', ngoặc nhọn '{}', hoặc sai dấu phẩy/chấm phẩy.`;
                        } else if (errMsg.includes('Unexpected identifier') || errMsg.includes('Unexpected string')) {
                            translated = `Khai báo tên biến hoặc chuỗi sai cú pháp.`;
                            suggestion = `Kiểm tra xem bạn có quên dấu phẩy ngăn cách, nối chuỗi sai, hoặc đặt tên biến chứa khoảng trắng/ký tự lạ không.`;
                        } else if (errMsg.includes('missing ) after argument list')) {
                            translated = `Thiếu dấu đóng ngoặc ')' khi gọi hàm.`;
                            suggestion = `Hãy đếm lại số lượng dấu mở ngoặc '(' và đóng ngoặc ')' xem đã khớp nhau chưa.`;
                        }
                    } else if (errName === 'RangeError') {
                        if (errMsg.includes('Maximum call stack size exceeded')) {
                            translated = `Vượt quá giới hạn gọi hàm (Tràn bộ nhớ).`;
                            suggestion = `Bạn đang bị lặp vô tận. Kiểm tra lại các vòng lặp (for/while) hoặc đệ quy (hàm tự gọi lại chính nó) xem có điểm dừng không.`;
                        }
                    }

                    return { translated, suggestion };
                };
            }
    // [2] Hàm thực thi chính
            async function executeJsEngine() {
                let userCode = window.__labJsEditor ? window.__labJsEditor.getValue() : $('#labJsInput').val();
                if (!userCode || !userCode.trim()) return;
            
                const $consoleBox = $('#labConsoleLogBody');
                $consoleBox.removeClass('flash-success flash-error');
            
                try {
                    window.outerHTML = document.getElementsByTagName("html")[0].outerHTML;
                } catch(e) {
                    console.error("Không thể gán outerHTML toàn cục:", e);
                }
            
                try {
                    // 🚀 ĐƯỜNG DẪN ĐẾN FILE BẠN VỪA LƯU Ở BƯỚC 1 (Hãy đổi lại link này cho đúng cấu trúc web của bạn)
                    const helperUrl = 'https://rawcdn.githack.com/alokillgtv-gif/VAXAPPSCRIPT/f6ca7b5f69f8350a2fc366bdc0f4fa9d882735bd/miniJQ.js'; 
                    
                    const response = await fetch(helperUrl);
                    if (!response.ok) {
                        throw new Error(`Không thể fetch file tiện ích tại: ${helperUrl}`);
                    }
                    const libraryRawCode = await response.text();
            
                    const base64Code = btoa(unescape(encodeURIComponent(userCode)));
            
                    // Chế độ Sandbox cô lập
                    if (typeof isSandboxModeActive !== 'undefined' && isSandboxModeActive) {
                        const $sandboxIframe = $('#labSandboxIframe');
                        if ($sandboxIframe.length && $sandboxIframe[0].contentWindow) {
                            $sandboxIframe[0].contentWindow.postMessage({ type: 'LAB_EXECUTE_JS', base64: base64Code }, '*');
                        }
                        return;
                    }
            
                    if (!window.__labEscapeHtmlHelper) {
                        window.__labEscapeHtmlHelper = function(str) {
                            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        };
                    }
            
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
            
                    // 🎯 NỐI CHUỖI TRỰC TIẾP: Ghép mã nguồn thư viện thô vừa fetch xong lên đầu
                    script.textContent = libraryRawCode + "\n" + `
                        try {
                            window.outerHTML = document.getElementsByTagName("html")[0].outerHTML;
            
                            const decodedCode = decodeURIComponent(escape(atob('${base64Code}')));
                            const codeWithSourceMap = decodedCode + "\\n//# sourceURL=lab_dynamic_script.js";
            
                            let rawResult = window.eval(codeWithSourceMap);
            
                            const cBox = jQuery('#labConsoleLogBody');
                            cBox.removeClass('flash-success flash-error');
            
                            if (rawResult !== undefined) {
                                if (typeof rawResult === 'object' && rawResult !== null) {
                                    const $treeNodeElement = window.__labBuildObjectTreeElement(rawResult);
                                    $treeNodeElement.addClass('lab-log-item').css({ 'padding-left': '14px', 'border-bottom': '1px solid #1a1a1a', 'margin-bottom': '4px' });
                                    cBox.prepend($treeNodeElement);
                                } else {
                                    window.__labAppendLog(rawResult, 'return');
                                }
                                cBox.addClass('flash-success');
                            } else {
                                cBox.addClass('flash-success');
                            }
                            cBox.scrollTop(0);
            
                        } catch(err) {
                            let lineNum = err.lineNumber || err.line;
            
                            if (!lineNum && err.stack) {
                                let match = err.stack.match(/lab_dynamic_script\\.js:(\\d+)/);
                                if (!match) match = err.stack.match(/eval.*?:(\\d+):\\d+/i);
                                if (!match) match = err.stack.match(/<anonymous>:(\\d+)/i);
                                if (match) lineNum = parseInt(match[1], 10);
                            }
            
                            let safeName = err.name || 'Lỗi';
                            let safeMsg = err.message || '';
                            let errorInfo = window.__labErrorTranslator(safeName, safeMsg);
            
                            let vnMsg = window.__labEscapeHtmlHelper(errorInfo.translated);
                            let vnSuggest = window.__labEscapeHtmlHelper(errorInfo.suggestion);
                            let rawMsg = window.__labEscapeHtmlHelper(safeMsg);
            
                            let linkHtml = lineNum ? '<div style="margin-top: 8px;"><span class="lab-error-line-link" data-line="' + lineNum + '" style="display:inline-block; padding:4px 10px; background:#e74c3c; color:#fff; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🎯 Cuộn tới Dòng ' + lineNum + '</span></div>' : "";
            
                            let errorHtml = '<div class="lab-log-item lab-log-error" style="display:flex; flex-direction:column; align-items:flex-start; padding:10px; line-height: 1.6; border-left: 3px solid #ff5555;">' +
                                                '<span style="font-weight:bold; font-size:13px; color:#ff5555;">🚨 ' + safeName + ': ' + vnMsg + '</span>' +
                                                '<span style="font-size:11px; color:#888; margin-top:2px; font-family: monospace;"><i>Nguyên bản: ' + rawMsg + '</i></span>' +
                                                '<span style="font-size:13px; color:#8be9fd; margin-top:6px; background: rgba(139, 233, 253, 0.1); padding: 4px 8px; border-radius: 4px;">💡 <b>Gợi ý:</b> ' + vnSuggest + '</span>' +
                                                linkHtml +
                                            '</div>';
            
                            jQuery('#labConsoleLogBody').prepend(errorHtml).removeClass('flash-success').addClass('flash-error').scrollTop(0);
                        }
                    `;
            
                    document.body.appendChild(script);
                    document.body.removeChild(script);
            
                } catch (outerErr) {
                    window.__labAppendLog("[Lỗi Hệ Thống]: " + outerErr.message, 'error');
                    $consoleBox.addClass('flash-error');
                }
            }


        // 3. Sự kiện Click (Đã thêm stopPropagation để chặn sự cố click bị đè)
        $(document).off('click.errorLink').on('click.errorLink', '.lab-error-line-link', function(e) {
            e.preventDefault();
            e.stopPropagation();

            let line = parseInt($(this).data('line'), 10);

            if (window.__labJsEditor && !isNaN(line)) {
                let targetLine = line-1; // CodeMirror tính dòng từ 0

                window.__labJsEditor.setCursor(targetLine, 0);
                window.__labJsEditor.focus();

                // Tự động cuộn Editor ra giữa màn hình
                let charCoords = window.__labJsEditor.charCoords({ line: targetLine, ch: 0 }, "local");
                let middleHeight = window.__labJsEditor.getScrollerElement().offsetHeight / 2;
                window.__labJsEditor.scrollTo(null, charCoords.top-middleHeight-5);

                // Đánh dấu đỏ dòng bị lỗi trong 1.5s
                window.__labJsEditor.addLineClass(targetLine, 'background', 'CodeMirror-selected');
                setTimeout(() => window.__labJsEditor.removeLineClass(targetLine, 'background', 'CodeMirror-selected'), 1500);
            }
        });

        $(document).on('click', '#labBtnRunJs', function(e) { e.preventDefault(); executeJsEngine(); });
        $jsInput.on('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'Enter' || e.keyCode === 13 || e.key === 'Space')) {
                e.preventDefault();
                executeJsEngine();
            }
        });
        // END BLOCK: JavaScript Dynamic Execution Engine

        // ### BLOCK START: DOM Inspector (Main Environment)
        // ==========================================
        // 9. TRÌNH QUAN SÁT DOM (INSPECTOR Ở MAIN ENVIRONMENT)
        // ==========================================
        function buildDomTreeMain(node) {
            if (node.nodeType === 3) {
                const text = node.nodeValue.trim();
                return text ? $('<div>').addClass('tree-node').html(`<span class="html-text">${escapeHtml(text)}</span>`) : null;
            }
            if (node.nodeType === 1) {
                // [UPDATE] Fix lỗi hắt highlight viền cho panel Sniffer  quick-extract-modal #labHtmlSourceModal
                if ($(node).closest('#labHtmlSourceModal').length || $(node).closest('#quick-extract-modal').length || $(node).closest('#labMainDashboard').length || $(node).hasClass('lab-fab-wrapper') || $(node).is('#labSandboxIframe') || $(node).is('#labCssQuickMenu') || $(node).hasClass('CodeMirror-hints') || $(node).closest('#panelSnifferLab').length) return null;

                const tagName = node.tagName.toLowerCase();
                let attrStr = '';
                if (node.attributes) {
                    for (let i = 0; i < node.attributes.length; i++) {
                        let attr = node.attributes[i];
                        if (attr.name.startsWith('lab-')) continue;
                        attrStr += ` <span class="html-attr">${attr.name}</span>=<span class="html-bracket">"</span><span class="html-val">${escapeHtml(attr.value)}</span><span class="html-bracket">"</span>`;
                    }
                }

                // 🌟 ĐÃ SỬA TẠI ĐÂY: Lưu trữ tham chiếu node thật vào biến data jQuery
                let $container = $('<div>').addClass('tree-node').data('real-node', node);

                let $toggle = $('<span>').addClass('tree-toggle').html('▼ ');
                let $children = $('<div>').addClass('tree-children');

                node.childNodes.forEach(child => {
                    let $childTree = buildDomTreeMain(child);
                    if ($childTree) $children.append($childTree);
                });

                return $container.append($toggle)
                    .append(`<span>&lt;<span class="html-tag">${tagName}</span>${attrStr}&gt;</span>`)
                    .append($children)
                    .append(`<span>&lt;/<span class="html-tag">${tagName}</span>&gt;</span>`);
            }
            return null;
        }
        function loadElementToTreeMain(element) {
            if (!element) return;
            $treeDomBody.find('.tree-node, div').remove();
            let $tree = buildDomTreeMain(element);
            if ($tree) $treeDomBody.append($tree);
        }

        $(document).on('mouseover', function(e) {
            if (!isInspectEnabled || isSandboxModeActive) return;
            // [UPDATE] Bỏ qua Sniffer  quick-extract-modal
            if ($(e.target).closest('#quick-extract-modal').length || $(e.target).closest('#labMainDashboard').length || $(e.target).hasClass('lab-fab-wrapper') || $(e.target).is('#labSandboxIframe') || $(e.target).closest('#labCssQuickMenu').length || $(e.target).hasClass('CodeMirror-hints') || $(e.target).closest('#panelSnifferLab').length) return;

            $(document).find('.lab-inspect-child, .lab-inspect-parent, .lab-inspect-grand').removeClass('lab-inspect-child lab-inspect-parent lab-inspect-grand');
            let $target = $(e.target);
            $target.addClass('lab-inspect-child');
            let $parent = $target.parent();

            if ($parent.length && !$parent.is('html, body')) {
                $parent.addClass('lab-inspect-parent');
                let $grand = $parent.parent();
                if ($grand.length && !$grand.is('html, body')) $grand.addClass('lab-inspect-grand');
            }
        });

        const processClickEventMain = function(e) {
            if (!isInspectEnabled || isSandboxModeActive) return;
            // [UPDATE] Bỏ qua Sniffer
            if ($(e.target).closest('#labHtmlSourceModal').length || $(e.target).closest('#labMainDashboard').length || $(e.target).hasClass('lab-fab-wrapper') || $(e.target).is('#labSandboxIframe') || $(e.target).closest('#labCssQuickMenu').length || $(e.target).hasClass('CodeMirror-hints') || $(e.target).closest('#panelSnifferLab').length) return;
            e.preventDefault();
            e.stopPropagation();

            $(document).find('.lab-inspect-child, .lab-inspect-parent, .lab-inspect-grand, .lab-pinned-child, .lab-pinned-parent, .lab-pinned-grand').removeClass('lab-inspect-child lab-inspect-parent lab-inspect-grand lab-pinned-child lab-pinned-parent lab-pinned-grand');
            savedTarget = e.target;
            currentGeoDepth = 0; // Reset độ sâu khi chọn phần tử mới

            let $target = $(savedTarget);
            $target.addClass('lab-pinned-child');

            let $parent = $target.parent();
            savedParent = $parent.length ? $parent[0] : null;

            if ($parent.length && !$parent.is('html, body')) {
                $parent.addClass('lab-pinned-parent');
                let $grand = $parent.parent();
                savedGrand = ($grand && $grand.length) ? $grand[0] : null;
                if ($grand.length && !$grand.is('html, body')) $grand.addClass('lab-pinned-grand');
            }
            $familyTreeBar.css('display', 'flex');
            loadElementToTreeMain(savedTarget);
           $('#panelJs .lab-sub-select').val('#panelTreeDom').trigger('change')
        };
        // END BLOCK: DOM Inspector (Main Environment)

        // ### BLOCK START: Quick Hide Element (Right Click)
        // --- MODULE: QUICK HIDE ELEMENT (RIGHT CLICK) ---
        $('body').append('<div id="lab-quick-hide-menu" style="display:none; position:fixed; background:#e74c3c; color:#fff; padding:6px 12px; border-radius:4px; font-size:12px; font-weight:bold; cursor:pointer; z-index:2147483647; box-shadow:0 4px 10px rgba(0,0,0,0.5);">🚫 Ẩn phần tử này</div>');

        $(document).on('contextmenu', function(e) {
            // Không chặn contextmenu ở trong bảng điều khiển
            if ($(e.target).closest('#labMainDashboard, #labHtmlSourceModal, #panelSnifferLab').length) return;

            // Nếu Inspect chưa bật thì bỏ qua
            if (!isInspectEnabled || isSandboxModeActive) return;

            let targetEl = e.target;
            $('#lab-quick-hide-menu').css({ top: e.clientY + 10 + 'px', left: e.clientX + 10 + 'px' }).show().off('click').on('click', function(ev) {
                ev.stopPropagation();

                // Sinh bộ chọn thông minh mạnh nhất
                let selector = '';
                if (targetEl.id) {
                    selector = '#' + targetEl.id;
                } else if (targetEl.className && typeof targetEl.className === 'string') {
                    selector = '.' + targetEl.className.trim().split(/\s+/).join('.');
                } else {
                    const tag = targetEl.tagName.toLowerCase();
                    const attrKeys = ['title', 'alt', 'name', 'src', 'data-id', 'href', 'style'];
                    for (let attr of attrKeys) {
                        if (targetEl.hasAttribute(attr)) {
                            selector = `${tag}[${attr}="${targetEl.getAttribute(attr).replace(/"/g, '\\"')}"]`;
                            break;
                        }
                    }
                    if (!selector) selector = tag; // Fallback
                }

                // Tự động gán CSS ẩn
                injectSmartCssRule(selector, "display: none !important;");
                $(targetEl).css('outline', '2px solid red'); // Chớp đỏ nhận diện
                setTimeout(() => $(targetEl).css('outline', ''), 500);
                $('#lab-quick-hide-menu').hide();
            });
        });

        $(document).on('click', () => $('#lab-quick-hide-menu').hide());

        $(document).on('contextmenu', processClickEventMain);

        function requestDomInspect(mode) {
            if(isSandboxModeActive) {
                if($sandboxIframe[0].contentWindow) {
                    $sandboxIframe[0].contentWindow.postMessage({ type: 'LAB_GEO_INSPECT_REQUEST', geoMode: mode }, '*');
                }
            } else {
                if(mode === 'target') { loadElementToTreeMain(savedTarget); }
                else if(mode === 'parent' && savedParent) { loadElementToTreeMain(savedParent); }
                else if(mode === 'grand' && savedGrand) { loadElementToTreeMain(savedGrand); }
            }
        }
        // END BLOCK: Quick Hide Element (Right Click)

        // ### BLOCK START: Family Tree Navigation (10 Levels)
        // ==========================================
        // ĐIỀU HƯỚNG PHẢ HỆ 10 CẤP + NÚT ĐẢO CHIỀU (XUỐNG)
        // ==========================================
        $(document).on('click', '#labFamilyTreeBar .lab-geo-btn', function(e) {
            e.stopPropagation();
            const btnId = $(this).attr('id');
            let mode = 'target';
            $(".lab-geo-btn").removeClass("activeMode");
            $(this).addClass('activeMode');
            if (btnId === 'geoBtnParent') mode = 'parent';
            else if (btnId === 'geoBtnGrand') mode = 'grand';
            else if (btnId === 'geoBtnGreatGrand') mode = 'greatgrand';
            else if (btnId === 'geoBtnGreatGreatGrand') mode = 'greatgreatgrand';
            else if (btnId === 'geoBtnAncestors') mode = 'ancestors';
            else if (btnId === 'geoBtnLayer7') mode = 'layer7';
            else if (btnId === 'geoBtnLayer8') mode = 'layer8';
            else if (btnId === 'geoBtnLayer9') mode = 'layer9';
            else if (btnId === 'geoBtnLayer10') mode = 'layer10';
            else if (btnId === 'geoBtnReverseDown') mode = 'down';

            // 1. Nếu đang ở chế độ Sandbox -> gửi thông điệp xuống khung cô lập
            if (isSandboxModeActive) {
                if ($sandboxIframe[0].contentWindow) {
                    $sandboxIframe[0].contentWindow.postMessage({ type: 'LAB_GEO_INSPECT_REQUEST', geoMode: mode }, '*');
                }
                return;
            }

            // 2. Chế độ Gốc (Main Environment)
            if (!savedTarget) return;

            const depthMap = {
                'target': 0, 'parent': 1, 'grand': 2, 'greatgrand': 3,
                'greatgreatgrand': 4, 'ancestors': 5, 'layer7': 6,
                'layer8': 7, 'layer9': 8, 'layer10': 9
            };

            // Logic đảo chiều (đi xuống lớp con) hoặc chọn trực tiếp độ sâu theo Lớp
            if (mode === 'down') {
                currentGeoDepth = Math.max(0, currentGeoDepth-1);
            } else {
                currentGeoDepth = depthMap[mode] !== undefined ? depthMap[mode] : 0;
            }

            let targetNode = savedTarget;
            for (let i = 0; i < currentGeoDepth; i++) {
                if (targetNode.parentElement) {
                    targetNode = targetNode.parentElement;
                }
            }

            $('*').removeClass('lab-pinned-child lab-pinned-parent lab-pinned-grand lab-pinned-great-grand lab-pinned-great-great-grand lab-pinned-ancestors lab-pinned-layer7 lab-pinned-layer8 lab-pinned-layer9 lab-pinned-layer10');

            const classes = [
                'lab-pinned-child', 'lab-pinned-parent', 'lab-pinned-grand',
                'lab-pinned-great-grand', 'lab-pinned-great-great-grand', 'lab-pinned-ancestors',
                'lab-pinned-layer7', 'lab-pinned-layer8', 'lab-pinned-layer9', 'lab-pinned-layer10'
            ];
            $(targetNode).addClass(classes[currentGeoDepth] || 'lab-pinned-ancestors');

            if (typeof window.__labRenderMainTree === 'function') {
                window.__labRenderMainTree(targetNode);
            } else if (typeof buildDomTreeMain === 'function') {
                $treeDomBody.empty().append(buildDomTreeMain(targetNode));
            }
        });
        // END BLOCK: Family Tree Navigation (10 Levels)

        // ### BLOCK START: UI & Resize Panel Manager
        // ==========================================
        // 10. QUẢN LÝ GIAO DIỆN VÀ RESIZE PANEL
        // ==========================================
        function updateScreenSplitting() {
            if ($dashboard.is(':hidden')) {
                $('html').css({ 'width': originalBodyStyle.width, 'overflow-x': originalBodyStyle.overflowX, 'margin-left': '' });
                $('html, body').css('padding-bottom', '');
                $('body').removeClass('lab-fullscreen-locked'); // [UPDATE] Dọn dẹp body khóa scroll
                return;
            }

            // [UPDATE] Auto Padding + Khóa cuộn khi full screen
            const isFull = $dashboard.hasClass('lab-fullscreen-mode') || $dashboard.hasClass('lab-vertical-panel-fullscreen');
            if (isFull) {
                $('body').addClass('lab-fullscreen-locked');
            } else {
                $('body').removeClass('lab-fullscreen-locked');
            }

            if (layoutState === 'horizontal') {
                $('html').css({ 'width': '100vw', 'overflow-x': originalBodyStyle.overflowX, 'margin-left': '' });
                let dashHeight = isFull ? 0 : (($dashboard.outerHeight()) + 10);
                var viewportHeight = $(window).height();

                // Chuyển đổi giá trị (dashHeight / 2) từ px sang vh
                var vhValue = ((dashHeight / 2) / viewportHeight) * 100;

                // Áp dụng vào CSS bằng đơn vị vh
                $('html, body').css('padding-bottom', vhValue + 'vh');
            } else {
                $('html, body').css('padding-bottom', '');
                $('html').css({ 'width': isFull ? '0vw' : '65vw', 'margin-left': (layoutState === 'vertical-left' && !isFull) ? '35vw' : '', 'overflow-x': 'hidden' });
            }
            if (window.__labJsEditor) window.__labJsEditor.refresh();
            if (window.__labCssEditor) window.__labCssEditor.refresh();
        }

        $('#labBtnToggleOrientation').on('click', function() {
            $('.lab-panel').removeClass('lab-panel-maximized').removeClass('lab-panel-hidden');
            $layoutEngine.removeClass('has-maximized');
            $('.lab-btn-max').text('🔲 ').removeClass('active-max');
            $('.lab-btn-restore').hide();

            if (layoutState === 'horizontal') {
                layoutState = 'vertical-right';
                $('#labBtnLeftRight').text('⬅️ ').show();
                $dashboard.removeClass('mode-horizontal').addClass('mode-vertical-right');
            } else {
                layoutState = 'horizontal';
                $('#labBtnLeftRight').hide();
                $dashboard.removeClass('mode-vertical-right').removeClass('mode-vertical-left').addClass('mode-horizontal');
            }
            $('#labBtnResetLayout').trigger('click');
            updateScreenSplitting();
        });

        $('#labBtnLeftRight').on('click', function() {
            if (layoutState === 'vertical-right') {
                layoutState = 'vertical-left';
                $(this).text('➡️ ');
                $dashboard.removeClass('mode-vertical-right').addClass('mode-vertical-left');
                $snifferPanel.removeClass('mode-vertical-right').addClass('mode-vertical-left');
            } else {
                layoutState = 'vertical-right';
                $(this).text('⬅️ ');
                $dashboard.removeClass('mode-vertical-left').addClass('mode-vertical-right');
                $snifferPanel.removeClass('mode-vertical-left').addClass('mode-vertical-right');
            }
            updateScreenSplitting();
            syncSnifferLayout();
        });

        $('.lab-btn-max').on('click', function() {
            const targetId = $(this).data('target');
            const $panel = $(targetId);
            if ($panel.hasClass('lab-panel-maximized')) {
                $panel.removeClass('lab-panel-maximized');
                $layoutEngine.removeClass('has-maximized');
                $(this).text('🔲 ').removeClass('active-max');
            } else {
                $('.lab-panel').removeClass('lab-panel-maximized');
                $('.lab-btn-max').text('🔲 ').removeClass('active-max');
                $layoutEngine.addClass('has-maximized');
                $panel.addClass('lab-panel-maximized');
                $(this).text('🔳').addClass('active-max');
            }
            setTimeout(() => {
                if (window.__labJsEditor) window.__labJsEditor.refresh();
                if (window.__labCssEditor) window.__labCssEditor.refresh();
            }, 100);
        });

        $('.lab-btn-toggle').on('click', function() {

            const target = $(this).data('target');
            $(target).addClass('lab-panel-hidden').removeClass('lab-sub-panel-active');
            $(`#labRestoreGroupButtons .lab-btn-restore[data-target="${target}"]`).show();
            if (typeof window.__labV163UpdateFloatingConsole === 'function') setTimeout(window.__labV163UpdateFloatingConsole, 50); // [UPDATE] Kích hoạt xếp console
        });

        $('.lab-btn-restore').on('click', function() {
            const target = $(this).data('target');
            $(target).removeClass('lab-panel-hidden');
            $(this).hide();
            if (window.__labJsEditor) window.__labJsEditor.refresh();
            if (window.__labCssEditor) window.__labCssEditor.refresh();
            if (typeof window.__labV163UpdateFloatingConsole === 'function') setTimeout(window.__labV163UpdateFloatingConsole, 50); // [UPDATE]
        });
        // END BLOCK: UI & Resize Panel Manager

        // ### BLOCK START: Draggable FAB Button
        // --- MODULE: DRAGGABLE FAB ---
        let isFabDragging = false;
        const $fabWrapper = $('.lab-fab-wrapper');

        $fabWrapper.on('mousedown', function(e) {
            if (e.which !== 1) return; // Chỉ kéo bằng chuột trái
            e.preventDefault();
            isFabDragging = false;
            let startX = e.clientX, startY = e.clientY;
            let startPos = $fabWrapper.offset();
            let scrollX = $(window).scrollLeft(), scrollY = $(window).scrollTop();

            // Đổi sang position fixed để kéo theo màn hình
            $fabWrapper.css({ right: 'auto', bottom: 'auto', left: (startPos.left-scrollX) + 'px', top: (startPos.top-scrollY) + 'px' });

            $(window).on('mousemove.fabDrag', function(moveEvent) {
                isFabDragging = true;
                let dx = moveEvent.clientX-startX;
                let dy = moveEvent.clientY-startY;
                $fabWrapper.css({ left: (startPos.left-scrollX + dx) + 'px', top: (startPos.top-scrollY + dy) + 'px' });
            });

            $(window).on('mouseup.fabDrag', function() { $(window).off('mousemove.fabDrag mouseup.fabDrag'); });
        });
        $fabBtn.on('click', function(e) {
            if (isFabDragging) return;
            e.stopPropagation();
            if ($dashboard.is(':hidden')) {
                $dashboard.css('display', 'flex');
                $fabBtn.text('×').css('background-color', '#e74c3c');
                isInspectEnabled = true;
                localStorage.setItem('lab_dashboard_open', 'true');
            } else {
                $dashboard.hide();
                $fabBtn.text('+').css('background-color', '#3498db');
                isInspectEnabled = false;
                localStorage.setItem('lab_dashboard_open', 'false');
                $(document).find('.lab-inspect-child, .lab-inspect-parent, .lab-inspect-grand, .lab-pinned-child, .lab-pinned-parent, .lab-pinned-grand').removeClass('lab-inspect-child lab-inspect-parent lab-inspect-grand lab-pinned-child lab-pinned-parent lab-pinned-grand');
            }
            setTimeout(() => { updateScreenSplitting(); }, 50); // [UPDATE] Đợi DOM render để js đo được height chính xác
        });
        // END BLOCK: Draggable FAB Button

        // ### BLOCK START: FAB Right-Click Scroll Handler
        // [NEW] Chức năng Right-Click trên nút FAB để scroll trang Web
        let fabRightClickTimer = null;
        let fabRightClickCount = 0;
        $fabBtn.on('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fabRightClickCount++;
            if (fabRightClickCount === 1) {
                fabRightClickTimer = setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // x1 Xuống đáy
                    fabRightClickCount = 0;
                }, 250);
            } else if (fabRightClickCount >= 2) {
                clearTimeout(fabRightClickTimer);
                window.scrollTo({ top: 0, behavior: 'smooth' }); // x2 Lên đỉnh
                fabRightClickCount = 0;
            }
        });

        $('#labBtnMaximizeDashboard').on('click', function() {
            if (layoutState === 'horizontal') $dashboard.toggleClass('lab-fullscreen-mode');
            else $dashboard.toggleClass('lab-vertical-panel-fullscreen');
            updateScreenSplitting();
        });

        $('#labBtnClearCss').on('click', () => {
            $cssInput.val('').trigger('input');
            if (window.__labCssEditor) window.__labCssEditor.setValue('');
            if(isSandboxModeActive){
                if($sandboxIframe[0].contentWindow) $sandboxIframe[0].contentWindow.postMessage({ type: 'LAB_LIVE_CSS', css: '' }, '*');
            } else {
                $('#lab-dynamic-live-css').text('');
            }
        });

        $('#labBtnClearJs').on('click', () => {
            $jsInput.val('');
            if (window.__labJsEditor) window.__labJsEditor.setValue('');
            localStorage.removeItem('lab_saved_js');
        });
        $('#labBtnClearConsole').on('click', () => {
            console.log("Xoá lịch sử console")
             localStorage.removeItem("lab_v163_console_history_html");
            $consoleLog.empty();
        });
        $('.lab-panel').each(function() {
            $(this).append('<div class="lab-resizer resizer-x"></div>');
            $(this).append('<div class="lab-resizer resizer-y"></div>');
        });

        $(document).on('mousedown', '.lab-resizer', function(e) {
            e.preventDefault();
            $layoutEngine.addClass('is-custom-resized');

            const $panel = $(this).closest('.lab-panel');
            const isX = $(this).hasClass('resizer-x');
            const startWidth = $panel.outerWidth();
            const startHeight = $panel.outerHeight();
            const startX = e.clientX;
            const startY = e.clientY;

            $(document).on('mousemove.lab-resize', function(moveEvent) {
                if (isX) { $panel.css('width', (startWidth + (moveEvent.clientX-startX)) + 'px'); }
                else { $panel.css('height', (startHeight + (moveEvent.clientY-startY)) + 'px'); }
                if (window.__labJsEditor) window.__labJsEditor.refresh();
                if (window.__labCssEditor) window.__labCssEditor.refresh();
            });

            $(document).on('mouseup.lab-resize', function() { $(document).off('mousemove.lab-resize mouseup.lab-resize'); });
        });
        // END BLOCK: FAB Right-Click Scroll Handler

        // ### BLOCK START: Panel Drag & Drop (Free Move)
        // [NEW] Cho phép 4 ô panel còn lại Kéo Thả tùy ý khi Mousedown vào Header
        $('.lab-panel-header').on('mousedown.labPanelDragFree', function(e) {
            const $panel = $(this).closest('.lab-panel');
            if ($panel.is('#panelSnifferLab')) return; // Sniffer đã có cơ chế Drag riêng
            if ($(e.target).closest('button, select, input, .lab-panel-actions').length) return; // Không drag nếu bấm nhầm vào nút con

            e.preventDefault(); e.stopPropagation();
            /*
            if ($panel.css('position') !== 'fixed' && !$panel.hasClass('lab-v163-floating-console')) {
                const rect = $panel[0].getBoundingClientRect();
                $panel.css({
                    position: 'fixed',
                    width: rect.width + 'px',
                    height: rect.height + 'px',
                    top: rect.top + 'px',
                    left: rect.left + 'px',
                    zIndex: 2147483646
                }).addClass('lab-draggable-panel');
            }
            */
            const rect = $panel[0].getBoundingClientRect();
            const startX = e.clientX, startY = e.clientY;
            const startLeft = rect.left, startTop = rect.top;

            $(window).on('mousemove.labPanelMoveFree', function(moveEvent) {
                $panel.css({
                    left: (startLeft + moveEvent.clientX-startX) + 'px',
                    top: (startTop + moveEvent.clientY-startY) + 'px',
                    right: 'auto', bottom: 'auto'
                });
            });

            $(window).on('mouseup.labPanelMoveFree', function() {
                $(window).off('mousemove.labPanelMoveFree mouseup.labPanelMoveFree');
            });
        });

        $('#labBtnResetLayout').on('click', function() {
            // [UPDATE] Xóa trạng thái fixed / kéo thả custom khi reset layout
            $('.lab-btn-restore').hide();
            $('.lab-panel').not('#panelSnifferLab').removeClass('lab-panel-hidden').removeClass('lab-draggable-panel').css({
                'position': '', 'width': '', 'height': '', 'top': '', 'left': '', 'zIndex': '', 'right': '', 'bottom': ''
            });

            $layoutEngine.removeClass('is-custom-resized');
            $('.lab-panel').css({ 'width': '', 'height': '' });
            if (window.__labJsEditor) window.__labJsEditor.refresh();
            if (window.__labCssEditor) window.__labCssEditor.refresh();
            setTimeout(syncSnifferLayout, 60);
        });
        // END BLOCK: Panel Drag & Drop (Free Move)

        // ### BLOCK START: Smart CSS Grouping & Quick-Option Popover
        // ==========================================
        // 11. EXTENSION ULTRA V4.2: SMART CSS GROUPING & QUICK-OPTION POPOVER
        // ==========================================
        const $treeDomHeaderActions = $('#panelTreeDom .lab-panel-actions');
        $('#labBtnExtractMeta').remove();
        const $btnExtractMeta = $('<button class="lab-mini-btn btn-success" id="labBtnExtractMeta" style="margin-right: 4px;" title="Trích xuất Meta/Link">📋 </button>');
        $treeDomHeaderActions.prepend($btnExtractMeta);

        function copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(err => { console.error("Lỗi sao chép nhanh: ", err); });
            } else {
                const $temp = $("<textarea>");
                $("body").append($temp);
                $temp.val(text).select();
                document.execCommand("copy");
                $temp.remove();
            }
        }

        // [NEW] Xử lý Sao chép Console Log
        $('#labBtnCopyConsole').on('click', function(e) {
            e.stopPropagation();
            const logText = $('#labConsoleLogBody').text().trim();
            if(logText) {
                copyToClipboard(logText);
                const $btn = $(this);
                $btn.text('✔️').css('background', '#27ae60');
                setTimeout(() => $btn.text('📋').css('background', '#0984e3'), 2000);
            }
        });

        $('#labCssQuickMenu').remove();
        const $quickMenu = $(`
            <div id="labCssQuickMenu" style="
                position: fixed; display: none; z-index: 2147483647; background: #1e1e1e; border: 1px solid #3498db; border-radius: 6px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.85); min-width: 240px; font-family: 'Segoe UI', sans-serif; font-size: 12px; overflow: hidden;
                user-select: none; pointer-events: auto;
            ">
                <div style="background: #252525; padding: 6px 10px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #f1c40f; font-weight: bold;">⚡ QUICK CSS LAB</span>
                    <span id="labQuickMenuTarget" style="color: #50fa7b; font-family: monospace; font-weight: bold; background: #111; padding: 2px 6px; border-radius: 3px;"></span>
                </div>
                <div id="labQuickMenuList" style="max-height: 260px; overflow-y: auto; padding: 4px 0;"></div>
            </div>
        `);
        $('body').append($quickMenu);

        const quickCssOptions = [
            { name: "👁️ Ẩn phần tử", css: "display: none !important;" },
            { name: "👁️ Hiện phần tử", css: "display: block !important;" },
            { name: "⬛ Nền đen", css: "background: black !important;" },
            { name: "🔤 Chữ đen", css: "color: black !important;" },
            { name: "👻 Trong suốt", css: "opacity: 0 !important;" },
            { name: "🔍 Ẩn chữ (Size 0)", css: "font-size: 0 !important;" },
            { name: "🔤 Chữ 16px", css: "font-size: 16px !important;" },
            { name: "🔤 Chữ 22px", css: "font-size: 22px !important;" }
        ];

        const $menuList = $quickMenu.find('#labQuickMenuList');
        quickCssOptions.forEach(opt => {
            const $item = $(`
                <div class="lab-quick-item" style="padding: 6px 12px; color: #ddd; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; transition: background 0.15s;">
                    <span>${opt.name}</span>
                    <code style="color: #8be9fd; font-size: 11px; background: #111; padding: 2px 5px; border-radius: 3px; font-family: Consolas, monospace;">${opt.css}</code>
                </div>
            `);
            $item.on('mouseenter', () => $item.css('background', '#34495e'));
            $item.on('mouseleave', () => $item.css('background', 'transparent'));
            $item.on('click', function(e) {
                e.stopPropagation();
                const activeSelector = $quickMenu.data('target-selector');
                if (activeSelector) injectSmartCssRule(activeSelector, opt.css);
                $quickMenu.hide();
            });
            $menuList.append($item);
        });

        $(document).on('click.closeQuickMenu contextmenu.closeQuickMenu', function(e) {
            if (!$(e.target).closest('#labCssQuickMenu').length) $quickMenu.hide();
        });
        $(document).on('keydown.closeQuickMenu', function(e) { if (e.key === 'Escape') $quickMenu.hide(); });

        function showQuickCssMenu(selector, clientX, clientY) {
    if (selector) {
        // 🛠️ FIX TRIỆT ĐỂ:
        // 1. Nếu selector là chuỗi class thuần có khoảng trắng ".class1 class2" -> ".class1.class2"
        if (selector.trim().startsWith('.')) {
            selector = selector.trim().split(/\s+/).join('.');
        }
        // 2. Nếu selector có dạng "div.class1 class2 class3" -> "div.class1.class2.class3"
        else if (selector.includes('.')) {
            // Khử khoảng trắng thừa, sau đó thay thế các khoảng trắng đứng sau class bằng dấu chấm
            selector = selector.trim().replace(/\s+/g, '.');
        }
    }

    $quickMenu.data('target-selector', selector);
    $quickMenu.find('#labQuickMenuTarget').text(selector);

    $quickMenu.show();
    const menuW = $quickMenu.outerWidth();
    const menuH = $quickMenu.outerHeight();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let posX = clientX + 10;
    let posY = clientY + 10;

    if (posX + menuW > winW) posX = clientX-menuW-10;
    if (posY + menuH > winH) posY = winH-menuH-10;

    $quickMenu.css({ top: Math.max(5, posY) + 'px', left: Math.max(5, posX) + 'px' });
}

        function injectSmartCssRule(targetSelector, cssRuleBody) {
            let currentCss = $cssInput.val() || "";
            const normRule = cssRuleBody.replace(/\s+/g, '').toLowerCase();
            const ruleRegex = /([^{]+)\{([^}]*)\}/g;
            let match;
            let foundAndMerged = false;
            let newCssText = currentCss;

            while ((match = ruleRegex.exec(currentCss)) !== null) {
                const fullMatch = match[0];
                const rawSelectors = match[1].trim();
                const rawBody = match[2].trim();
                const normBody = rawBody.replace(/\s+/g, '').toLowerCase();

                if (normBody === normRule || normBody === normRule.replace(/;$/, '')) {
                    const selectorList = rawSelectors.split(',').map(s => s.trim());
                    if (selectorList.includes(targetSelector)) { foundAndMerged = true; break; }
                    const mergedSelectors = targetSelector + ", " + rawSelectors;
                    const replacedBlock = fullMatch.replace(match[1], mergedSelectors + " ");
                    newCssText = currentCss.substring(0, match.index) + replacedBlock + currentCss.substring(match.index + fullMatch.length);
                    foundAndMerged = true; break;
                }
            }

            if (!foundAndMerged) {
                const prefix = currentCss.trim().length > 0 ? "\n\n" : "";
                const newBlock = `${prefix}${targetSelector} {\n    ${cssRuleBody}\n}`;
                newCssText = currentCss.trimRight() + newBlock;
            }

            $cssInput.val(newCssText).trigger('input');
            if (window.__labCssEditor && window.__labCssEditor.getValue() !== newCssText) {
                window.__labCssEditor.setValue(newCssText);
                window.__labCssEditor.setCursor(window.__labCssEditor.lineCount(), 0);
            }
            window.__labAppendLog(`⚡ [Smart CSS Applied] Gán (${cssRuleBody}) cho selector: ${targetSelector}`, 'return');
        }

        $treeDomBody.off('click', '.html-val, .html-attr');
        $treeDomBody.on('click', '.html-val, .html-attr', function(e) {
            e.stopPropagation();
            let targetSelector = null;

            if ($(this).hasClass('html-val')) {
                const rawVal = $(this).text().trim();
                const $prevAttr = $(this).prevAll('.html-attr').first();
                if (!$prevAttr.length) { copyToClipboard(rawVal); return; }

                const attrName = $prevAttr.text().trim().toLowerCase();
                if (attrName === 'class') {
                    // Chuyển "class1 class2" thành ".class1.class2"
                    const allClass = '.' + rawVal.trim().split(/\s+/).join('.');
                    if (allClass !== '.') targetSelector = allClass;
                } else if (attrName === 'id') { targetSelector = `#` + rawVal; }
                else { copyToClipboard(rawVal); }
            }
            else if ($(this).hasClass('html-attr')) {
                const attrName = $(this).text().trim().toLowerCase();
                const $nextVal = $(this).nextAll('.html-val').first();
                if (!$nextVal.length) { copyToClipboard(attrName); return; }

                const rawVal = $nextVal.text().trim();
                if (attrName === 'class') {
                    const firstClass = rawVal.split(/\s+/)[0];
                    if (firstClass) targetSelector = `.` + firstClass;
                } else if (attrName === 'id') { targetSelector = `#` + rawVal; }
                else { copyToClipboard(rawVal); }
            }

            if (targetSelector) {
                copyToClipboard(targetSelector);
                showQuickCssMenu(targetSelector, e.clientX, e.clientY);
            }
        });

        $('#lab-token-pointer-style').remove();
        const tokenStyles = document.createElement('style');
        tokenStyles.id = 'lab-token-pointer-style';
        tokenStyles.textContent = `
            #labTreeDomBody .html-val, #labTreeDomBody .html-attr { cursor: pointer !important; }
            #labTreeDomBody .html-val:hover, #labTreeDomBody .html-attr:hover { background: rgba(52, 152, 219, 0.3) !important; text-decoration: underline !important; }
        `;
        document.head.appendChild(tokenStyles);

        $btnExtractMeta.off('click');
        $btnExtractMeta.on('click', function(e) {
            e.stopPropagation();
            $familyTreeBar.hide();
            $treeDomBody.empty();

            const $rootContainer = $('<div>').addClass('tree-node');
            const $toggle = $('<span>').addClass('tree-toggle').html('▼ ');
            const $children = $('<div>').addClass('tree-children');

            $rootContainer.append($toggle).append(`<span>&lt;<span class="html-tag">head-metadata-summary</span>&gt;</span>`).append($children).append(`<div><span>&lt;/<span class="html-tag">head-metadata-summary</span>&gt;</span></div>`);

            let targetDocument = document;
            if (isSandboxModeActive && $sandboxIframe.length && $sandboxIframe[0].contentWindow) {
                try {
                    if($sandboxIframe[0].contentWindow.document) targetDocument = $sandboxIframe[0].contentWindow.document;
                } catch(err) { window.__labAppendLog("⚠️ Khung Sandbox chặn đọc Header, chuyển sang quét DOM môi trường gốc.", "error"); }
            }

            $(targetDocument).find('meta, link').each(function() {
                const nodeTagName = this.tagName.toLowerCase();
                if (nodeTagName === 'link' && ($(this).attr('style') || $(this).attr('rel') === 'style')) return;

                let attrStr = '';
                if (this.attributes) {
                    for (let i = 0; i < this.attributes.length; i++) {
                        const attr = this.attributes[i];
                        if (attr.name.toLowerCase() === 'style') continue;
                        attrStr += ` <span class="html-attr">${attr.name}</span>=<span class="html-bracket">"</span><span class="html-val">${escapeHtml(attr.value)}</span><span class="html-bracket">"</span>`;
                    }
                }
                const $metaNode = $('<div>').addClass('tree-node').css('margin-left', '20px').html(`<span>&lt;<span class="html-tag">${nodeTagName}</span>${attrStr}&gt;</span>`);
                $children.append($metaNode);
            });

            $treeDomBody.append($rootContainer);
            $toggle.on('click', function(ev) {
                ev.stopPropagation();
                $(this).toggleClass('collapsed').html($(this).hasClass('collapsed') ? '▶ ' : '▼ ');
                $children.toggleClass('hidden');
            });
        });
        // END BLOCK: Smart CSS Grouping & Quick-Option Popover

        // ### BLOCK START: Zero-Impact Sniffer & Deep Network Interceptor
        // ==========================================
        // 12. EXTENSION PRO++ V12: ZERO-IMPACT SNIFFER & DEEP NETWORK INTERCEPTOR
        // ==========================================
        if (!window.__labCapturedLinks) {
            window.__labCapturedLinks = { get: new Map(), post: new Map(), media: new Map(), embed: new Map() };
        }

        function checkAndStorageLink(url, type, networkDetails = null) {
            if (!url || typeof url !== 'string' || url.startsWith('data:') || url.startsWith('blob:')) return;
            let targetGroup = type.toLowerCase();
            const lowerUrl = url.toLowerCase();

            if (lowerUrl.includes('.mp4') || lowerUrl.includes('.m3u8') || lowerUrl.includes('.ts') || lowerUrl.includes('.mp3')) {
                targetGroup = 'media';
            } else if (lowerUrl.includes('embed') || lowerUrl.includes('iframe') || lowerUrl.includes('player')) {
                targetGroup = 'embed';
            }

            const finalDetails = networkDetails || { method: type.toUpperCase(), headers: "No Headers Captured", response: "No Response Body Captured" };

            if (!window.__labCapturedLinks[targetGroup].has(url)) {
                window.__labCapturedLinks[targetGroup].set(url, finalDetails);
                if (typeof window.__labRenderSnifferTree === 'function') window.__labRenderSnifferTree();
            } else if (networkDetails && networkDetails.response !== "No Response Body Captured") {
                window.__labCapturedLinks[targetGroup].set(url, finalDetails);
            }
        }

        if (!window.__labXhrOverridden) {
            const originalXHROpen = window.XMLHttpRequest.prototype.open;
            const originalXHRSend = window.XMLHttpRequest.prototype.send;
            const originalXHRSetHeader = window.XMLHttpRequest.prototype.setRequestHeader;

            window.XMLHttpRequest.prototype.open = function(method, url) {
                this._labMethod = method;
                this._labUrl = (typeof url === 'string') ? url : url.toString();
                this._labHeaders = {};
                return originalXHROpen.apply(this, arguments);
            };

            window.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
                if (!this._labHeaders) this._labHeaders = {};
                this._labHeaders[header] = value;
                return originalXHRSetHeader.apply(this, arguments);
            };

            window.XMLHttpRequest.prototype.send = function() {
                this.addEventListener('readystatechange', function() {
                    if (this.readyState === 4) {
                        let responseText = "No Response Body Captured";
                        try {
                            if (this.responseType === '' || this.responseType === 'text') responseText = this.responseText;
                            else if (this.responseType === 'json') responseText = JSON.stringify(this.response, null, 2);
                            else responseText = `[Type: ${this.responseType || 'Unknown binary object'}]`;
                        } catch(e) { responseText = "[Error reading response context]"; }

                        const detailsObj = {
                            method: this._labMethod || "UNKNOWN",
                            headers: (this._labHeaders && Object.keys(this._labHeaders).length > 0) ? this._labHeaders : "No Custom Headers Set",
                            response: responseText || "Empty Response"
                        };
                        checkAndStorageLink(this._labUrl, (this._labMethod === 'POST') ? 'post' : 'get', detailsObj);
                    }
                });
                return originalXHRSend.apply(this, arguments);
            };
            window.__labXhrOverridden = true;
        }

        if (!window.__labFetchOverridden) {
            const originalFetch = window.fetch;
            window.fetch = async function(input, init) {
                let url = ''; let method = 'GET'; let reqHeaders = "No Custom Headers Set";
                if (typeof input === 'string') url = input;
                else if (input instanceof Request) { url = input.url; method = input.method; }
                else url = String(input);

                if (init) {
                    if (init.method) method = init.method.toUpperCase();
                    if (init.headers) {
                        try { reqHeaders = (init.headers instanceof Headers) ? Object.fromEntries(init.headers.entries()) : init.headers; }
                        catch(e) { reqHeaders = init.headers; }
                    }
                }

                try {
                    const response = await originalFetch.apply(this, arguments);
                    const cloneRes = response.clone();
                    cloneRes.text().then(text => {
                        let parsedRes = text;
                        try { parsedRes = JSON.stringify(JSON.parse(text), null, 2); } catch(e){}
                        checkAndStorageLink(url, method === 'POST' ? 'post' : 'get', { method: method, headers: reqHeaders, response: parsedRes || "Empty Response" });
                    }).catch(() => {
                        checkAndStorageLink(url, method === 'POST' ? 'post' : 'get', { method, headers: reqHeaders, response: "[Blob/Stream]" });
                    });
                    return response;
                } catch (err) {
                    checkAndStorageLink(url, method === 'POST' ? 'post' : 'get', { method, headers: reqHeaders, response: `[Network Request Failed: ${err.message}]` });
                    throw err;
                }
            };
            window.__labFetchOverridden = true;
        }

        const $treeDomHeader = $('#panelTreeDom .lab-panel-actions');
        $('#labBtnClearTreeDom').remove();
        $('#labBtnToggleSniffer').remove();

        const $btnClearTreeDom = $('<button class="lab-mini-btn btn-danger" id="labBtnClearTreeDom" style="margin-right: 4px;" title="Xóa cây DOM">🗑️ </button>');
        const $btnToggleSniffer = $('<button class="lab-mini-btn" id="labBtnToggleSniffer" style="background: #27ae60; color: white; margin-right: 4px;" title="Bật/Tắt Sniffer">🌐 </button>');
        $('.sanbox-group').prepend($btnToggleSniffer);
        $treeDomHeader.prepend($btnClearTreeDom);

        $btnClearTreeDom.on('click', function(e) {
            e.stopPropagation();
            $treeDomBody.empty();
            $familyTreeBar.hide();
        });

        $('#panelSnifferLab').remove();
        const $snifferPanel = $(`
            <div id="panelSnifferLab" class="lab-panel lab-panel-hidden" style="
                display: none; flex-direction: column; background: #1e1e1e !important; border: 2px solid #34495e !important; color: #fff !important;
                box-sizing: border-box !important; position: fixed !important; z-index: 2147483647 !important; box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
                border-radius: 4px; pointer-events: auto !important;
            ">
                <div class="lab-panel-header" style="display: flex; justify-content: flex-end; align-items: center; background: #2c3e50; padding: 6px 10px; font-weight: bold; font-size: 12px; user-select: none;">
                    <span>🌐</span>
                    <div class="lab-panel-actions" style="display: flex; align-items: center;">
                        <button class="lab-mini-btn btn-danger" id="labBtnClearSniffer" style="margin-right: 4px;">🗑️ </button>
                        <button class="lab-mini-btn" id="labBtnCloseSniffer" style="background:#e74c3c; color:white;">×</button>
                    </div>
                </div>
                <div id="labSnifferBody" style="flex: 1; padding: 10px; overflow-y: auto; font-family: monospace; font-size: 12px; line-height: 1.6;"></div>
            </div>
        `);

        $('body').append($snifferPanel);
        $snifferPanel.append('<div class="lab-resizer resizer-x"></div><div class="lab-resizer resizer-y"></div>');

        // Bỏ việc chặn sự kiện mousedown/mouseup/mousemove để kéo thả mượt mà hơn
        $snifferPanel.on('click contextmenu', function(e) {
            e.stopPropagation();
        });

        function syncSnifferLayout() {
            if ($snifferPanel.hasClass('lab-panel-hidden')) { $snifferPanel.hide(); return; }
            $snifferPanel.css('display', 'flex');
            const viewW = window.innerWidth;
            const viewH = window.innerHeight;
            const dashEl = $layoutEngine[0];
            if (!dashEl) return;
            const rect = dashEl.getBoundingClientRect();
            const safeGap = 35;

            if (layoutState === 'horizontal') {
                const snifferH = Math.round(viewH * 0.28);
                let calculatedTop = rect.top-snifferH-safeGap;
                if (calculatedTop < 5) calculatedTop = 5;
                $snifferPanel.css({ 'top': calculatedTop-10 + 'px', 'left': rect.left + 'px', 'width': rect.width + 'px', 'height': snifferH + 'px' });
            }
            else if (layoutState === 'vertical-left') {
                let calculatedLeft = rect.right + safeGap;
                let calculatedW = viewW-calculatedLeft-20;
                if (calculatedW < 200) calculatedW = Math.round(viewW * 0.35);
                $snifferPanel.css({ 'top': '20px', 'left': 'auto', 'right': '20px', 'width': calculatedW + 'px', 'height': rect.height + 50 + 'px' });
            }
            else if (layoutState === 'vertical-right') {
                let calculatedW = rect.left-safeGap-20;
                if (calculatedW < 200) calculatedW = Math.round(viewW * 0.35);
                let calculatedLeft = rect.left-calculatedW-safeGap;
                if (calculatedLeft < 5) calculatedLeft = 5;
                $snifferPanel.css({ 'top': '20px', 'left': '10px', 'width': calculatedW + 'px', 'height': rect.height-50 + 'px' });
            }
        }

        const originalUpdateScreenSplitting = window.updateScreenSplitting;
        window.updateScreenSplitting = function() {
            if (typeof originalUpdateScreenSplitting === 'function') originalUpdateScreenSplitting();
            setTimeout(syncSnifferLayout, 60);
        };

        $btnToggleSniffer.on('click', function(e) {
            e.stopPropagation();
            $snifferPanel.toggleClass('lab-panel-hidden');
            if (!$snifferPanel.hasClass('lab-panel-hidden')) $(this).text('🌐 ').css('background', '#e74c3c');
            else $(this).text('🌐').css('background', '#27ae60');
            syncSnifferLayout();
        });

        $('#labBtnCloseSniffer').on('click', function(e) {
            e.stopPropagation();
            $snifferPanel.addClass('lab-panel-hidden');
            $btnToggleSniffer.text('🌐').css('background', '#27ae60');
            syncSnifferLayout();
        });
        // END BLOCK: Zero-Impact Sniffer & Deep Network Interceptor

        // ### BLOCK START: Pro Code Editor Engine
        // ==========================================
        // 13. EXTENSION ULTRA V15: PRO CODE EDITOR ENGINE
        // ==========================================
        function initProCodeEditors() {
            if (typeof CodeMirror === 'undefined') return;

            const jsTextarea = document.getElementById('labJsInput');
            if (jsTextarea && !window.__labJsEditor) {
                window.__labJsEditor = CodeMirror.fromTextArea(jsTextarea, {
                    mode: 'javascript', theme: 'dracula', lineNumbers: true,
                    matchBrackets: true, autoCloseBrackets: true, tabSize: 4, indentUnit: 4, lineWrapping: true,
                    extraKeys: {
                        'Ctrl-Enter': function() { $("#labBtnClearConsole").click();$('#panelJs .lab-sub-select').val('#panelConsole').trigger('change');executeJsEngine(); },
                        'Ctrl-G': function() { $("#labBtnClearConsole").click();$('#panelJs .lab-sub-select').val('#panelConsole').trigger('change');executeJsEngine(); },
                        'Ctrl-B': function() { $("#labBtnClearConsole").click(); },
                        'Ctrl-Space': 'autocomplete'
                    }
                });

                window.__labJsEditor.on('keyup', function(cm, event) {
                    if (!cm.state.completionActive && event.keyCode !== 13 && event.keyCode !== 27 && event.keyCode !== 8 && event.keyCode !== 32 && event.keyCode !== 17 && event.keyCode !== 18) {
                        const token = cm.getTokenAt(cm.getCursor());
                        if (token.string && (token.string.length > 1 || token.string === '.' || event.key === '.')) {
                            CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
                        }
                    }
                });

                window.__labJsEditor.on('change', function(cm) {
                    const code = cm.getValue();
                    $('#labJsInput').val(code);
                    localStorage.setItem('lab_saved_js', code);
                });
            }

            const cssTextarea = document.getElementById('labCssInput');
            if (cssTextarea && !window.__labCssEditor) {
                window.__labCssEditor = CodeMirror.fromTextArea(cssTextarea, {
                    mode: 'css', theme: 'dracula', lineNumbers: true,
                    matchBrackets: true, autoCloseBrackets: true, tabSize: 4, indentUnit: 4, lineWrapping: true,
                    extraKeys: { 'Ctrl-Space': 'autocomplete' }
                });

                window.__labCssEditor.on('keyup', function(cm, event) {
                    if (!cm.state.completionActive && event.keyCode !== 13 && event.keyCode !== 27 && event.keyCode !== 8 && event.keyCode !== 32 && event.keyCode !== 17 && event.keyCode !== 18) {
                        const token = cm.getTokenAt(cm.getCursor());
                        if (token.string && (token.string.length > 1 || event.key === ':')) {
                            CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
                        }
                    }
                });

                window.__labCssEditor.on('change', function(cm) {
                    const cssCode = cm.getValue();
                    $('#labCssInput').val(cssCode).trigger('input');
                });
            }

            setTimeout(() => {
                if (window.__labJsEditor) window.__labJsEditor.refresh();
                if (window.__labCssEditor) window.__labCssEditor.refresh();
            }, 300);
        }

        initProCodeEditors();
        // END BLOCK: Pro Code Editor Engine

        // ### BLOCK START: Mini Tree DOM Search
        // --- MODULE: MINI TREE DOM SEARCH ---
let miniSearchMatches = [];
let miniSearchIndex = -1;

$('#labMiniTreeSearch').on('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        let query = $(this).val().trim().toLowerCase();
        if (!query) return;

        // Xóa bôi màu cũ
        $('#labTreeDomBody .lab-mini-highlight').css({ 'background': '', 'color': '' }).removeClass('lab-mini-highlight');

        // Quét lấy tất cả span text
        miniSearchMatches = [];
        $('#labTreeDomBody span').each(function() {
            if ($(this).text().toLowerCase().includes(query) && !$(this).children().length) {
                miniSearchMatches.push(this);
            }
        });

        if (miniSearchMatches.length === 0) {
            window.__labAppendLog("Không tìm thấy: " + query, 'error');
            return;
        }

        // Chuyển tới mục tiếp theo
        miniSearchIndex++;
        if (miniSearchIndex >= miniSearchMatches.length) miniSearchIndex = 0;
        let target = miniSearchMatches[miniSearchIndex];

        // Mở các thư mục cha đang bị ẩn
        $(target).parents('.tree-children.hidden').removeClass('hidden').siblings('.tree-toggle').removeClass('collapsed').html('▼ ');
        // Bôi màu và cuộn
        $(target).addClass('lab-mini-highlight').css({ 'background': '#e74c3c', 'color': '#fff', 'border-radius': '2px', 'padding': '2px' });
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Tắt màu sau 5s
        setTimeout(() => {
            $(target).css({ 'background': '', 'color': '' }).removeClass('lab-mini-highlight');
        }, 5000);
    }
});
        // END BLOCK: Mini Tree DOM Search

        // ### BLOCK START: Sync Tree Hover to Web Element
        // --- MODULE: SYNC TREE HOVER TO WEB ELEMENT ---
        $('#labTreeDomBody').on('mouseenter', '.tree-node', function(e) {
            e.stopPropagation();
            let realNode = $(this).data('real-node');
            if (realNode && realNode.nodeType === 1) { // Đảm bảo là Element
                $('.lab-tree-sync-highlight').removeClass('lab-tree-sync-highlight');
                $(realNode).addClass('lab-tree-sync-highlight');
            }
        }).on('mouseleave', '.tree-node', function(e) {
            $('.lab-tree-sync-highlight').removeClass('lab-tree-sync-highlight');
        });
        // Xóa highlight khi đóng Dashboard
        $fabBtn.on('click', function() {
            $('.lab-tree-sync-highlight').removeClass('lab-tree-sync-highlight');
        });

        // GỌI HÀM KHỞI TẠO EDITOR
        initProCodeEditors();
        // END BLOCK: Sync Tree Hover to Web Element

        // ### BLOCK START: Right-Click Zoom & Copy
        // ==========================================
        // 14. NÂNG CẤP TOÀN DIỆN V15: CHUỘT PHẢI PHÓNG TO + SAO CHÉP
        // ==========================================
        $(document).on('contextmenu', function(e) {
            const $dashboardContext = $(e.target).closest('#labMainDashboard');
            if (!$dashboardContext.length) return;
            if ($(e.target).closest('#labCssQuickMenu, .CodeMirror-hints, .lab-mini-btn, .lab-sub-select').length) return;

            const $panel = $(e.target).closest('.lab-panel');
            if ($panel.length) {
                e.preventDefault();
                e.stopPropagation();

                const panelId = $panel.attr('id');
                let copyText = "";

                if (panelId === 'panelConsole') copyText = $('#labConsoleLogBody').text().trim();
                else if (panelId === 'panelTreeDom') copyText = $('#labTreeDomBody').text().trim();

                if (copyText) {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(copyText).catch(() => { fallbackCopyEngine(copyText, panelId); });
                    } else {
                        fallbackCopyEngine(copyText, panelId);
                    }
                }

                const $maxBtn = $panel.find('.lab-btn-max');
                if ($maxBtn.length) $maxBtn.trigger('click');
            }
        });

        function fallbackCopyEngine(text, panelName) {
            const $temp = $("<textarea>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();
        }
        // END BLOCK: Right-Click Zoom & Copy

        // ### BLOCK START: Pro Max Engine V16.1 (Smart Panel Switch)
        // =========================================================================
        // ★ 15. EXTENSION ULTRA V16.1: PRO MAX ENGINE
        // =========================================================================
        (function initV16ProMaxEngine() {
            const v16Style = document.createElement('style');
            v16Style.id = 'lab-v16-pro-max-styles';
            v16Style.innerHTML = `
                .CodeMirror, .CodeMirror *, .CodeMirror-scroll, .CodeMirror-sizer, .CodeMirror-lines, .CodeMirror-line, .CodeMirror-code { cursor: text !important; }
                .CodeMirror-gutters, .CodeMirror-gutter * { cursor: default !important; }
                .CodeMirror-selected { background: #000000 !important; }
                .CodeMirror-selectedtext { color: #ffffff !important; }
                .CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #000000 !important; color: #ffffff !important; }
                .CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #000000 !important; color: #ffffff !important; }
                .CodeMirror .CodeMirror-code .CodeMirror-line .CodeMirror-selected { background: #000000 !important; }
                .lab-layout-engine.has-maximized.has-sub-panel { position: relative !important; }
                .lab-layout-engine.has-maximized.has-sub-panel .lab-panel.lab-panel-maximized { width: calc(100% * 4 / 7) !important; }
                .lab-layout-engine.has-maximized .lab-panel.lab-sub-panel-active { display: flex !important; position: absolute !important; top: 0 !important; right: 0 !important; width: calc(100% * 3 / 7) !important; height: 100% !important; z-index: 2147483645 !important; border-left: 2px solid #e67e22 !important; box-shadow: -6px 0 20px rgba(0,0,0,0.8) !important; }
                .lab-sub-select,.lab-select-size { background: #151515; color: #50fa7b; border: 1px solid #3498db; font-size: 11px; padding: 1px 4px; border-radius: 3px; font-weight: bold; cursor: pointer; outline: none; margin-right: 4px;width:80px; }
                .lab-sub-select:hover,.lab-select-size:hover { border-color: #2ecc71; }
            `;
            document.head.appendChild(v16Style);

            $('#labBtnMaximizeDashboard').on('click.v16save', function() {
                setTimeout(() => {
                    const isFull = $dashboard.hasClass('lab-fullscreen-mode') || $dashboard.hasClass('lab-vertical-panel-fullscreen');
                    localStorage.setItem('lab_v16_fullscreen', isFull ? 'true' : 'false');
                }, 50);
            });

            $(document).on('click.v16save', '.lab-btn-max', function() {
                setTimeout(() => {
                    const targetId = $(this).data('target');
                    const isMax = $(targetId).hasClass('lab-panel-maximized');
                    localStorage.setItem('lab_v16_max_panel', isMax ? targetId : 'none');
                    if (!isMax) closeSubPanel();
                }, 50);
            });

            function restoreV16States() {
                if (localStorage.getItem('lab_v16_fullscreen') === 'true') {
                    if (layoutState === 'horizontal' && !$dashboard.hasClass('lab-fullscreen-mode')) {
                        $dashboard.addClass('lab-fullscreen-mode');
                    } else if (layoutState !== 'horizontal' && !$dashboard.hasClass('lab-vertical-panel-fullscreen')) {
                        $dashboard.addClass('lab-vertical-panel-fullscreen');
                    }
                    updateScreenSplitting();
                    if (window.__labJsEditor) window.__labJsEditor.refresh();
                    if (window.__labCssEditor) window.__labCssEditor.refresh();
                }
                const savedMaxPanel = localStorage.getItem('lab_v16_max_panel');
                if (savedMaxPanel && savedMaxPanel !== 'none' && $(savedMaxPanel).length) {
                    setTimeout(() => { $(`.lab-btn-max[data-target="${savedMaxPanel}"]`).trigger('click'); }, 150);
                }
            }
            setTimeout(restoreV16States, 300);

            window.addEventListener('keydown', function(e) {
                    // 1. Kiểm tra nếu là tổ hợp Ctrl + Q
                    const isCtrlQ = e.ctrlKey && (e.key === 'q' || e.key === 'Q' || e.code === 'KeyQ' || e.keyCode === 81);

                    // 2. Kiểm tra nếu là phím ESC
                    const isEsc = e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27;

                    // Nếu thỏa mãn 1 trong 2 điều kiện phím thì mới chạy tiếp
                    if (isCtrlQ) {
                        $("#labFabBtn").click();
                        /* Nhấn để ẩn menu
                        if (!$dashboard.is(':hidden')) {
                            const $target = $(e.target);
                            let $panel = $target.closest('.lab-panel');

                            if (!$panel.length) {
                                const $maximized = $('.lab-panel.lab-panel-maximized');
                                if ($maximized.length) {
                                    $panel = $maximized.first();
                                } else {
                                    $panel = $('.lab-panel:visible').first();
                                }
                            }

                            if ($panel.length) {
                                e.preventDefault();
                                e.stopPropagation();
                                // Kích hoạt nút Maximize/Minimize (hoặc bạn có thể đổi logic riêng cho ESC ở đây nếu muốn)
                                $panel.find('.lab-btn-max').first().trigger('click');
                            }
                        }
                        */
                    }
                    if(isEsc){
                        $("#labBtnMaximizeDashboard").click();
                    }
                }, true);

            const subSelectHtml = `
                <select class="lab-sub-select" title="Chế độ xem phụ bên phải (rộng 3/7)">
                    <option value="none">📌 Menu</option>
                    <option value="#panelTreeDom">👀 Tree DOM</option>
                    <option value="#panelCss">👀 CSS Live</option>
                    <option value="#panelJs">👀 JS jQuery</option>
                    <option value="#panelConsole">👀 Console</option>
                </select>
            `;
            $('.lab-panel-header .lab-panel-actions').prepend(subSelectHtml);

            function closeSubPanel() {
                $layoutEngine.removeClass('has-sub-panel');
                $('.lab-panel').removeClass('lab-sub-panel-active');
                $('.lab-sub-select').val('none');
                setTimeout(() => {
                    if (window.__labJsEditor) window.__labJsEditor.refresh();
                    if (window.__labCssEditor) window.__labCssEditor.refresh();
                }, 50);
            }
            $(document).on('change', '.lab-select-size', function(e) {
                e.stopPropagation();
                $("#fontSizeLab").remove();
                const px = Number($(this).val());
                const ln = px + 3;
                const $clickedPanel = $(this);
                const css = `<style id="fontSizeLab">.CodeMirror{font-size:${px}px!important;line-height:${ln}px}</style>`;
                $("body").append(css);
            });
            $(document).on('change', '.lab-sub-select', function(e) {
                e.stopPropagation();
                const targetPanelId = $(this).val();
                const $clickedPanel = $(this).closest('.lab-panel');
                let $mainMaxPanel = $('.lab-panel.lab-panel-maximized').first();

                if (!$mainMaxPanel.length) {
                    $clickedPanel.find('.lab-btn-max').trigger('click');
                    $mainMaxPanel = $clickedPanel;
                }
                const mainPanelId = '#' + $mainMaxPanel.attr('id');
                if (targetPanelId === 'none') { closeSubPanel(); return; }
                if (targetPanelId === mainPanelId) {
                    const currentSub = $('.lab-panel.lab-sub-panel-active').attr('id');
                    $('.lab-sub-select').val(currentSub ? ('#' + currentSub) : 'none');
                    return;
                }
                $layoutEngine.addClass('has-sub-panel');
                $('.lab-panel').removeClass('lab-sub-panel-active');
                $(targetPanelId).removeClass('lab-panel-hidden');
                $(`#labRestoreGroupButtons .lab-btn-restore[data-target="${targetPanelId}"]`).hide();
                $(targetPanelId).removeClass('lab-panel-maximized');
                $(targetPanelId).addClass('lab-sub-panel-active');
                $('.lab-sub-select').val(targetPanelId);
                $('.lab-v163-floating-console').removeClass("lab-v163-floating-console");
                setTimeout(() => {
                    if (window.__labJsEditor) window.__labJsEditor.refresh();
                    if (window.__labCssEditor) window.__labCssEditor.refresh();
                }, 100);
            });

            $('#labBtnToggleOrientation, #labBtnResetLayout').on('click.v16clean', closeSubPanel);
        })();
        // END BLOCK: Pro Max Engine V16.1 (Smart Panel Switch)

        // ### BLOCK START: Safe Patch V16.3 (UI/Drag/CM Isolation)
        // =========================================================================
        // ★ PATCH V16.3 SAFE UPGRADE: SỬA LỖI UI/KÉO THẢ/CÁCH LY CODEMIRROR
        // =========================================================================
        (function initV163SafeUpgradePatch() {
            'use strict';

            const LS_CONSOLE_KEY = 'lab_v163_console_history_html';
            const LS_TREE_KEY = 'lab_v163_tree_dom_history_html';
            const LS_TREE_TARGET_KEY = 'lab_v163_tree_selected_target_html';
            const LS_SNIFFER_POS_KEY = 'lab_v163_sniffer_position';

            const $dashboard = $('#labMainDashboard');
            const $layoutEngine = $('#labLayoutEngine');
            const $consoleLog = $('#labConsoleLogBody');
            const $treeDomBody = $('#labTreeDomBody');
            const $familyTreeBar = $('#labFamilyTreeBar');
            const $sandboxIframe = $('#labSandboxIframe');

            let v163CurrentTreeElement = null;
            let v163TreeSaveTimer = null;
            let v163ConsoleSaveTimer = null;
            let v163UserMovedSniffer = false;

            // ------------------------------------------------------------
            // 1. Chỉ bảo vệ hiển thị cho CodeMirror, không phá vỡ Grid Panel
            // ------------------------------------------------------------
            $('#lab-v163-isolation-styles').remove();

            const isolationStyle = document.createElement('style');
            isolationStyle.id = 'lab-v163-isolation-styles';
            isolationStyle.textContent = `
                /* Cách ly và bảo vệ chống ẩn khung gõ lệnh */
                #labMainDashboard .CodeMirror,
                #labMainDashboard .CodeMirror-scroll,
                #labMainDashboard .CodeMirror-sizer,
                #labMainDashboard .CodeMirror-lines,
                #labMainDashboard .CodeMirror-code,
                #labMainDashboard .CodeMirror-gutters {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    min-height: 40px !important;
                }

                #labMainDashboard .CodeMirror {
                    flex: 1 1 auto !important;
                    width: 100% !important;
                    height: 100% !important;
                    min-height: 100px !important;
                    position: relative !important;
                    z-index: 1 !important;
                }

                #labMainDashboard .CodeMirror-scroll {
                    overflow: auto !important;
                    height: 100% !important;
                }

                /* Console Nổi Căn Chỉnh */
                #panelConsole.lab-v163-floating-console {
                    display: flex !important;
                    position: fixed !important;
                    top: 20px !important;
                    right: 12px !important;
                    width: min(420px, 34vw) !important;
                    height: calc(100vh-120px) !important;
                    z-index: 2147483647 !important;
                    border: 2px solid #f1c40f !important;
                    box-shadow: 0 0 28px rgba(0,0,0,0.85) !important;
                    color:white;
                }

                #labLayoutEngine.has-v163-floating-console #panelConsole.lab-v163-floating-console {
                    grid-area: unset !important;
                }

                /* UI Sniffer */
                #panelSnifferLab.lab-v163-user-positioned { position: fixed !important; }
                #panelSnifferLab .lab-sniffer-details {
                    margin: 4px 0 6px 18px; background: #111; border: 1px solid #333;
                    border-radius: 4px; padding: 4px 6px; color: #bbb; white-space: pre-wrap; word-break: break-word;
                }
                #panelSnifferLab details {
                    margin: 3px 0; background: rgba(255,255,255,0.03); border: 1px solid #333;
                    border-radius: 4px; padding: 3px 6px;
                }
                #panelSnifferLab summary { color: #50fa7b; cursor: pointer; font-weight: bold; outline: none; }
                #panelSnifferLab pre { margin: 5px 0 2px 0; color: #ddd; white-space: pre-wrap; word-break: break-word; font-family: Consolas, monospace; font-size: 11px; }
            `;
            document.head.appendChild(isolationStyle);

            // ------------------------------------------------------------
            // 2. Lưu lại lịch sử Tree DOM & Console (Nâng cấp)
            // ------------------------------------------------------------
            function v163SaveConsoleHistory() {
                clearTimeout(v163ConsoleSaveTimer);
                v163ConsoleSaveTimer = setTimeout(() => {
                    try { localStorage.setItem(LS_CONSOLE_KEY, $consoleLog.html() || ''); } catch (err) {}
                }, 120);
            }

            function v163SaveTreeHistory() {
                clearTimeout(v163TreeSaveTimer);
                v163TreeSaveTimer = setTimeout(() => {
                    try {
                        let htmlContent = $treeDomBody.html() || '';
                        // [UPDATE] Tránh lỗi quá tải dữ liệu LocalStorage gây vỡ code
                        if (htmlContent.length > 4000000) { htmlContent = '<div style="color:red; padding:10px;">Dữ liệu Tree DOM quá lớn, đã tự động dọn dẹp để bảo vệ bộ nhớ.</div>'; }
                        localStorage.setItem(LS_TREE_KEY, htmlContent);
                        if (v163CurrentTreeElement) localStorage.setItem(LS_TREE_TARGET_KEY, v163CurrentTreeElement.outerHTML || '');
                    } catch (err) { window.__labAppendLog('Lỗi quá tải dung lượng lưu Tree DOM, đang dọn dẹp...', 'error'); }
                }, 200);
            }

            function v163RestoreHistory() {
                try {
                    const savedConsole = localStorage.getItem(LS_CONSOLE_KEY);
                    if (savedConsole && !$consoleLog.children().length) $consoleLog.html(savedConsole);
                    const savedTree = localStorage.getItem(LS_TREE_KEY);
                    if (savedTree) {
                        $treeDomBody.append($(savedTree));
                        //$treeDomBody.html(savedTree);
                        $familyTreeBar.css('display', 'flex');
                    }
                } catch (err) {}
            }

            v163RestoreHistory();

            const oldAppendLog = window.__labAppendLog;
            if (typeof oldAppendLog === 'function' && !window.__labAppendLog.__v163Wrapped) {
                window.__labAppendLog = function(msg, type = 'log') {
                    oldAppendLog.apply(this, arguments);
                    v163SaveConsoleHistory();
                };
                window.__labAppendLog.__v163Wrapped = true;
            }

            const consoleObserver = new MutationObserver(v163SaveConsoleHistory);
            const treeObserver = new MutationObserver(v163SaveTreeHistory);

            if ($consoleLog[0]) consoleObserver.observe($consoleLog[0], { childList: true, subtree: true, characterData: true });
            if ($treeDomBody[0]) treeObserver.observe($treeDomBody[0], { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style'] });

            // [UPDATE] Nâng cấp Event Delegation cho nút Mở Rộng Cây Dom (Phục hồi 100% khi reload)
            $treeDomBody.off('click.v163TreeToggle').on('click.v163TreeToggle', '.tree-toggle', function(e) {
                e.preventDefault(); e.stopPropagation();
                const $toggle = $(this);
                const $children = $toggle.siblings('.tree-children').first();
                $toggle.toggleClass('collapsed');
                $toggle.html($toggle.hasClass('collapsed') ? '▶ ' : '▼ ');
                if ($children.length) $children.toggleClass('hidden');
                v163SaveTreeHistory();
            });

            $('#labBtnClearSavedHistory').remove();
            const $btnClearHistory = $('<button class="lab-mini-btn btn-danger" id="labBtnClearSavedHistory" title="Dọn dẹp lịch sử Console và Tree DOM (Reset)">🧹 </button>');
            $('#labRestoreGroupButtons').prepend($btnClearHistory);

            $btnClearHistory.on('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                localStorage.removeItem(LS_CONSOLE_KEY);
                localStorage.removeItem(LS_TREE_KEY);
                localStorage.removeItem(LS_TREE_TARGET_KEY);
                $consoleLog.empty();
                $treeDomBody.empty();
                $familyTreeBar.hide();
                if (typeof window.__labAppendLog === 'function') window.__labAppendLog('🧹 Đã dọn dẹp lịch sử Console và Tree DOM.', 'return');
            });

            // ------------------------------------------------------------
            // 3. Nổi Console CHỈ khi 1 ô Code (JS/CSS) được chọn phóng to
            // ------------------------------------------------------------
            function v163UpdateFloatingConsole() {
                const jsMax = $('#panelJs').hasClass('lab-panel-maximized');
                const cssMax = $('#panelCss').hasClass('lab-panel-maximized');
                const isConsoleHidden = $('#panelConsole').hasClass('lab-panel-hidden');

                // [UPDATE] Tự động Căn Chỉnh Kích Thước khi ô JS/CSS phóng to
                if ((jsMax || cssMax) && !isConsoleHidden) {
                    $('#panelJs .lab-sub-select').val('#panelConsole').trigger('change')
                    /*
                    $('#panelConsole')
                        .removeClass('lab-panel-hidden lab-panel-maximized')
                        .addClass('lab-v163-floating-console');
                    $layoutEngine.addClass('has-v163-floating-console');

                    $('#labRestoreGroupButtons .lab-btn-restore[data-target="#panelConsole"]').hide();

                    $('.lab-panel.lab-panel-maximized').css('width', 'calc(100vw-min(420px, 34vw)-24px)');
                    */
                } else {
                    $('#panelConsole').removeClass('lab-v163-floating-console');
                    $layoutEngine.removeClass('has-v163-floating-console');

                    $('.lab-panel.lab-panel-maximized').css('width', '100%');
                }
                setTimeout(() => {
                    if (window.__labJsEditor) window.__labJsEditor.refresh();
                    if (window.__labCssEditor) window.__labCssEditor.refresh();
                }, 80);
            }

            // Expose function để kích hoạt từ các luồng khác
            window.__labV163UpdateFloatingConsole = v163UpdateFloatingConsole;

            $(document).on('click.v163FloatConsole', '.lab-btn-max, #labBtnToggleOrientation, #labBtnResetLayout, #labFabBtn, .lab-btn-toggle', function() {
                setTimeout(v163UpdateFloatingConsole, 90);
            });
            v163UpdateFloatingConsole();

            // ------------------------------------------------------------
            // 4. Trích xuất nhanh liên kết
            // ------------------------------------------------------------
            $('#labBtnQuickExtractLinks').remove();
            const $btnQuickExtract = $('<button class="lab-mini-btn btn-success" id="labBtnQuickExtractLinks" style="margin-right:4px;" title="Trích xuất toàn bộ Link bên trong Node này">🔗</button>');
            $('#panelTreeDom .lab-panel-actions').prepend($btnQuickExtract);
            
            function v163SetCurrentTreeElement(element) {
                if (!element || element.nodeType !== 1) return;
                v163CurrentTreeElement = element;
                try { localStorage.setItem(LS_TREE_TARGET_KEY, element.outerHTML || ''); } catch (err) {}
            }
            
            $(document).on('contextmenu.v163CaptureTarget', function(e) {
                // [UPDATE] Chặn bắt sự kiện viền hắt vào bảng Sniffer
                if ($(e.target).closest('#labHtmlSourceModal,#labMainDashboard, #labCssQuickMenu, .CodeMirror-hints, #panelSnifferLab,#quick-extract-modal,.lab-inspect-child').length || $(e.target).is('#labSandboxIframe')) return;
                v163SetCurrentTreeElement(e.target);
            });
            
            $('#labFamilyTreeBar').on('click.v163CaptureLayer', '.lab-geo-btn', function() {
                setTimeout(() => {
                    const $pinned = $('.lab-pinned-child, .lab-pinned-parent, .lab-pinned-grand, .lab-pinned-great-grand, .lab-pinned-great-great-grand, .lab-pinned-ancestors, .lab-pinned-layer7, .lab-pinned-layer8, .lab-pinned-layer9, .lab-pinned-layer10').first();
                    if ($pinned.length) v163SetCurrentTreeElement($pinned[0]);
                }, 80);
            });
            
            // HÀM ĐƯỢC NÂNG CẤP: Thêm tham số customSelector để cố định vùng tìm kiếm dữ liệu
            function v163ExtractLinksFromElement(rootElement, extractType = 'default', customSelector = '') {
                if (!rootElement || rootElement.nodeType !== 1) return '';
                const links = [];
                const $root = $(rootElement);
                
                // Xác định bộ chọn tìm kiếm: Ưu tiên bộ chọn tùy biến, nếu không có thì lấy mọi thẻ a[href]
                const targetSelector = customSelector.trim() || 'a[href]';
                
                // Tìm kiếm các phần tử nằm bên trong phạm vi nút gốc khớp với bộ chọn
                $root.find(targetSelector).each(function() {
                    if ($(this).is('a[href]')) {
                        links.push(this);
                    } else {
                        // Nếu người dùng chỉ nhập nhóm cha (ví dụ: .list hoặc #id), đào sâu tìm các thẻ a[href] bên trong nó
                        $(this).find('a[href]').each(function() {
                            if (!links.includes(this)) links.push(this);
                        });
                    }
                });
                
                // Kiểm tra trường hợp đặc biệt nếu chính bản thân nút gốc khớp với bộ chọn thiết lập
                if ($root.is(targetSelector) && $root.is('a[href]')) {
                    if (!links.includes(rootElement)) links.push(rootElement);
                }
                
                return links.map(a => {
                    const href = a.href || $(a).attr('href') || '';
                    let name = '';
                    const $a = $(a);
                    
                    // Danh sách các loại dùng thuộc tính (attribute)
                    const attrTypes = ['title', 'alt', 'data-title', 'data-alt', 'src', 'name'];
                    
                    if (extractType === 'default') {
                        // Mặc định ban đầu: Lấy text trực tiếp của thẻ <a>
                        name = $a.text();
                    } else if (attrTypes.includes(extractType)) {
                        // Nếu chọn title, alt, data-... thì lấy attribute của thẻ <a> hoặc của ảnh bên trong nó
                        name = $a.attr(extractType) || $a.find(`[${extractType}]`).first().attr(extractType) || '';
                    } else {
                        // Nếu chọn tag như h1, h2, h3, span, p, b, i...
                        // Tìm thẻ đó nằm BÊN TRONG thẻ <a> trước, nếu không có thì fallback về text của <a>
                        const $targetTag = $a.find(extractType);
                        name = $targetTag.length ? $targetTag.text() : $a.text();
                    }
                    
                    // Xử lý khoảng trắng và xuống dòng như cũ
                    name = name.replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim();
                    
                    if (name.length < 4) {
                        return "";
                    }
                    var stringurl = href + '@@' + name;
                    return stringurl.replace(/^https?:\/\/[^\/]+/i, "")
                }).filter(Boolean).join('\n');
            }
            
            $btnQuickExtract.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $("#labBtnClearConsole").click();
                $("#quick-extract-modal").remove();
                
                const options = ['title', 'src', 'alt', 'data-title', 'data-alt', 'h1', 'h2', 'h3', 'span', 'p', 'b', 'i'];
                
                // GIAO DIỆN MỚI: Bổ sung trường nhập Cố định Phạm vi CSS Selector
                const $popup = $(`
        <div id="quick-extract-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999999999999; display:flex; align-items:center; justify-content:center; font-family:Arial, sans-serif;">
            <div style="background:#fff; padding:20px; border-radius:8px; width:400px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <h4 style="margin-top:0; color:#333; margin-bottom:12px;">Cấu hình trích xuất Link nâng cao</h4>
                
                <label style="font-size:12px; font-weight:bold; color:#555; display:block; margin-bottom:4px;">1. Cố định vùng tìm kiếm (CSS Selector):</label>
                <input type="text" id="extract-selector-input" value="" placeholder="Ví dụ: .list a hoặc #id a (Để trống nếu lấy hết)" style="width:100%; padding:8px; box-sizing:border-box; border:1px solid #ccc; border-radius:4px; font-size:13px; margin-bottom:12px; outline:none;color:black"/>
                
                <label style="font-size:12px; font-weight:bold; color:#555; display:block; margin-bottom:4px;">2. Kiểu trích xuất tên (Extract Type):</label>
                <input type="text" id="extract-type-input" value="default" placeholder="Nhập tag hoặc attribute..." style="width:100%; padding:8px; box-sizing:border-box; border:1px solid #ccc; border-radius:4px; font-size:13px; margin-bottom:5px; outline:none;color:black"/>
                
                <p style="font-size:11px; color:#666; background:#f5f5f5; padding:6px; border-radius:4px; max-height:50px; overflow-y:auto; margin-top:0; margin-bottom:15px;">
                    Gợi ý thuộc tính: ${options.join(', ')}
                </p>
                <div style="text-align:right;">
                    <button id="btn-extract-cancel" style="padding:6px 12px; margin-right:8px; background:red;color:white; border:none; border-radius:4px; cursor:pointer;">Hủy</button>
                    <button id="btn-extract-submit" style="padding:6px 12px; background:#007bff; color:#fff; border:none; border-radius:4px; cursor:pointer;">Xác nhận (Enter)</button>
                </div>
            </div>
        </div>
    `);
                
                $('body').append($popup);
                
                const $selectorInput = $('#extract-selector-input');
                const $typeInput = $('#extract-type-input');
                
                // Mặc định tự động focus vào ô chọn kiểu tên, bôi đen chữ để người dùng thao tác nhanh
                $typeInput.focus().select();
                
                // Hàm xử lý chính khi người dùng nhấn Xác nhận
                function processExtraction() {
                    let extractType = $typeInput.val().trim().toLowerCase();
                    if (!options.includes(extractType)) {
                        extractType = 'default';
                    }
                    
                    // Lấy bộ lọc vùng tìm kiếm do người dùng chỉ định
                    const customSelector = $selectorInput.val().trim();
                    
                    let output = '';
                    if (v163CurrentTreeElement) {
                        output = v163ExtractLinksFromElement(v163CurrentTreeElement, extractType, customSelector);
                    }
                    
                    if (!output) {
                        try {
                            const savedOuter = localStorage.getItem(LS_TREE_TARGET_KEY);
                            if (savedOuter) {
                                const temp = document.createElement('div');
                                temp.innerHTML = savedOuter;
                                output = v163ExtractLinksFromElement(temp.firstElementChild, extractType, customSelector);
                            }
                        } catch (err) {}
                    }
                    
                    if (!output) output = '[Quick Extract] Không tìm thấy dữ liệu phù hợp với cấu hình thiết lập!';
                    
                    if (typeof window.__labAppendLog === 'function') window.__labAppendLog(output, 'return');
                    else $consoleLog.prepend('<div class="lab-log-item lab-log-return"><span>' + $('<div>').text(output).html() + '</span></div>');
                    v163SaveConsoleHistory();
                    
                    // Xóa popup sau khi chạy xong
                    $popup.remove();
                    $('#panelJs .lab-sub-select').val('#panelConsole').trigger('change');
                }
                
                // --- BẮT SỰ KIỆN PHÍM TẮT TRÊN CẢ HAI Ô NHẬP ---
                $typeInput.add($selectorInput).on('keydown', function(evt) {
                    if (evt.key === 'Enter') {
                        evt.preventDefault();
                        processExtraction();
                    } else if (evt.key === 'Escape') {
                        $popup.remove();
                    }
                });
                
                // Bắt sự kiện click các nút trên giao diện
                $('#btn-extract-submit').on('click', processExtraction);
                $('#btn-extract-cancel').on('click', function() { $popup.remove(); });
            });

            // ------------------------------------------------------------
            // 5. Đồng bộ Lớp (activeMode) & Đảo chiều đi xuống
            // ------------------------------------------------------------
            const v163LayerButtonMap = [
                '#geoBtnTarget', '#geoBtnParent', '#geoBtnGrand', '#geoBtnGreatGrand', '#geoBtnGreatGreatGrand',
                '#geoBtnAncestors', '#geoBtnLayer7', '#geoBtnLayer8', '#geoBtnLayer9', '#geoBtnLayer10'
            ];
            let v163ActiveDepth = 0;

            function v163SetActiveLayerByDepth(depth) {
                v163ActiveDepth = Math.max(0, Math.min(9, depth));
                $('.lab-geo-btn').removeClass('activeMode');
                $((v163LayerButtonMap[v163ActiveDepth] || '#geoBtnTarget')).addClass('activeMode');
            }

            $(document).on('click.v163ActiveLayerFix', '#labFamilyTreeBar .lab-geo-btn', function(e) {
                const btnId = this.id;
                const directMap = {
                    geoBtnTarget:0, geoBtnParent:1, geoBtnGrand:2, geoBtnGreatGrand:3, geoBtnGreatGreatGrand:4,
                    geoBtnAncestors:5, geoBtnLayer7:6, geoBtnLayer8:7, geoBtnLayer9:8, geoBtnLayer10:9
                };
                if (btnId === 'geoBtnReverseDown') {
                    setTimeout(() => v163SetActiveLayerByDepth(Math.max(0, v163ActiveDepth-1)), 20);
                } else if (Object.prototype.hasOwnProperty.call(directMap, btnId)) {
                    setTimeout(() => v163SetActiveLayerByDepth(directMap[btnId]), 20);
                }
            });

            // ------------------------------------------------------------
            // 6. Fix lỗi dính chuột ở Sniffer
            // ------------------------------------------------------------
            const $snifferPanel = $('#panelSnifferLab');

            function v163SaveSnifferPosition() {
                if (!$snifferPanel.length) return;
                const rect = $snifferPanel[0].getBoundingClientRect();
                try { localStorage.setItem(LS_SNIFFER_POS_KEY, JSON.stringify({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })); } catch (err) {}
            }

            function v163RestoreSnifferPosition() {
                if (!$snifferPanel.length) return;
                try {
                    const raw = localStorage.getItem(LS_SNIFFER_POS_KEY);
                    if (!raw) return;
                    const pos = JSON.parse(raw);
                    if (!pos || typeof pos !== 'object') return;
                    $snifferPanel.addClass('lab-v163-user-positioned').css({
                        top: Math.max(5, pos.top) + 'px', left: Math.max(5, pos.left) + 'px', right: 'auto',
                        width: Math.max(240, pos.width) + 'px', height: Math.max(160, pos.height) + 'px'
                    });
                    v163UserMovedSniffer = true;
                } catch (err) {}
            }
            v163RestoreSnifferPosition();

            const oldSyncSnifferLayout = typeof syncSnifferLayout === 'function' ? syncSnifferLayout : null;
            if (oldSyncSnifferLayout && !window.__labV163SyncSnifferWrapped) {
                syncSnifferLayout = function() {
                    if (v163UserMovedSniffer && !$snifferPanel.hasClass('lab-panel-hidden')) {
                        $snifferPanel.css('display', 'flex'); return;
                    }
                    oldSyncSnifferLayout.apply(this, arguments);
                };
                window.__labV163SyncSnifferWrapped = true;
            }

            $snifferPanel.off('mousedown.v163Drag').on('mousedown.v163Drag', '.lab-panel-header', function(e) {
                if ($(e.target).closest('button, select, input, textarea').length) return;
                e.preventDefault(); e.stopPropagation();

                const rect = $snifferPanel[0].getBoundingClientRect();
                const startX = e.clientX, startY = e.clientY, startLeft = rect.left, startTop = rect.top;

                $snifferPanel.addClass('lab-v163-user-positioned').css({ left: startLeft + 'px', top: startTop + 'px', right: 'auto' });

                $(window).on('mousemove.v163SnifferDrag', function(moveEvent) {
                    $snifferPanel.css({
                        left: Math.max(0, Math.min(window.innerWidth-80, startLeft + moveEvent.clientX-startX)) + 'px',
                        top: Math.max(0, Math.min(window.innerHeight-40, startTop + moveEvent.clientY-startY)) + 'px',
                        right: 'auto'
                    });
                });

                $(window).on('mouseup.v163SnifferDrag', function() {
                    $(window).off('mousemove.v163SnifferDrag mouseup.v163SnifferDrag');
                    v163UserMovedSniffer = true;
                    v163SaveSnifferPosition();
                });
            });

            $snifferPanel.off('mousedown.v163Resize').on('mousedown.v163Resize', '.lab-resizer', function(e) {
                e.preventDefault(); e.stopPropagation();

                const rect = $snifferPanel[0].getBoundingClientRect();
                const startX = e.clientX, startY = e.clientY, startW = rect.width, startH = rect.height;

                $snifferPanel.addClass('lab-v163-user-positioned').css({ left: rect.left + 'px', top: rect.top + 'px', right: 'auto' });

                $(window).on('mousemove.v163SnifferResize', function(moveEvent) {
                    $snifferPanel.css({
                        width: Math.min(window.innerWidth-rect.left-8, Math.max(240, startW + moveEvent.clientX-startX)) + 'px',
                        height: Math.min(window.innerHeight-rect.top-8, Math.max(160, startH + moveEvent.clientY-startY)) + 'px'
                    });
                });

                $(window).on('mouseup.v163SnifferResize', function() {
                    $(window).off('mousemove.v163SnifferResize mouseup.v163SnifferResize');
                    v163UserMovedSniffer = true;
                    v163SaveSnifferPosition();
                });
            });

            function v163EscapeText(value) { return $('<div>').text(value == null ? '' : String(value)).html(); }
            function v163FormatMaybeJson(value) {
                if (value == null) return '';
                if (typeof value === 'object') { try { return JSON.stringify(value, null, 2); } catch (err) { return String(value); } }
                const str = String(value);
                try { return JSON.stringify(JSON.parse(str), null, 2); } catch (err) { return str; }
            }
            function v163BuildDetails(title, content, open) {
                return `<details ${open ? 'open' : ''}><summary>${v163EscapeText(title)}</summary><pre>${v163EscapeText(v163FormatMaybeJson(content))}</pre></details>`;
            }

            function v163BuildSnifferGroupDomNode(title, linksMap, color, defaultOpen) {
                const $node = $('<div class="tree-node"></div>');
                const $toggle = $('<span class="tree-toggle" style="cursor:pointer; user-select:none; margin-right:4px;"></span>');
                const $label = $(`<span style="color:${color}; font-weight:bold;"></span>`).text(`${title} (${linksMap.size})`);
                const $children = $('<div class="tree-children" style="margin-left:18px;"></div>');

                $toggle.html(defaultOpen ? '▼ ' : '▶ ');
                if (!defaultOpen) { $toggle.addClass('collapsed'); $children.addClass('hidden').hide(); }

                $node.append($toggle).append($label).append($children);

                if (linksMap.size === 0) {
                    $children.append('<div style="color:#777; font-style:italic; margin-left:14px;">(Trống)</div>');
                } else {
                    linksMap.forEach((networkDetails, url) => {
                        const details = networkDetails || {};
                        const $item = $('<div class="lab-sniffer-item" style="white-space:normal; margin-bottom:6px; padding:6px; background:rgba(255,255,255,0.03); border-left:2px solid #7f8c8d; cursor:pointer;"></div>');
                        const $urlLine = $('<div style="display:flex; gap:6px; align-items:flex-start;"></div>');
                        const $urlSpan = $('<span style="color:#e67e22; font-size:11px; word-break:break-all;"></span>').text(url);

                        const $detailsBox = $('<div class="lab-sniffer-details"></div>');
                        $detailsBox.html(
                            v163BuildDetails('METHOD', details.method || 'UNKNOWN', false) +
                            v163BuildDetails('REQUEST HEADERS', details.headers || 'No Headers Captured', false) +
                            v163BuildDetails('RESPONSE BODY', details.response || 'No Response Body Captured', false)
                        );

                        $urlLine.append($('<span style="color:#7f8c8d;">-</span>')).append($urlSpan);
                        $item.append($urlLine).append($detailsBox);

                        $item.on('click', function(ev) {
                            if ($(ev.target).closest('details, summary, pre').length) return;
                            ev.stopPropagation();
                            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).catch(() => {});
                            else { const $temp = $('<textarea>').val(url).appendTo('body').select(); document.execCommand('copy'); $temp.remove(); }
                        });
                        $children.append($item);
                    });
                }

                $toggle.on('click', function(e) {
                    e.stopPropagation();
                    $(this).toggleClass('collapsed');
                    $(this).html($(this).hasClass('collapsed') ? '▶ ' : '▼ ');
                    $children.toggleClass('hidden').toggle();
                });
                return $node;
            }

            window.__labRenderSnifferTree = function() {
                const $snifferBody = $('#labSnifferBody');
                if (!$snifferBody.length || !window.__labCapturedLinks) return;
                $snifferBody.empty();
                $snifferBody.append(v163BuildSnifferGroupDomNode('📁 MEDIA LINKS (.mp4, .m3u8, .ts)', window.__labCapturedLinks.media, '#2ecc71', true));
                $snifferBody.append(v163BuildSnifferGroupDomNode('📁 EMBED RESOURCES (iframe, player)', window.__labCapturedLinks.embed, '#9b59b6', false));
                $snifferBody.append(v163BuildSnifferGroupDomNode('📁 POST REQUESTS (Full Objects)', window.__labCapturedLinks.post, '#e74c3c', false));
                $snifferBody.append(v163BuildSnifferGroupDomNode('📁 GET REQUESTS (Full Objects)', window.__labCapturedLinks.get, '#3498db', false));
            };

            if (typeof window.__labRenderSnifferTree === 'function') window.__labRenderSnifferTree();

            setTimeout(() => {
                if (window.__labJsEditor) window.__labJsEditor.refresh();
                if (window.__labCssEditor) window.__labCssEditor.refresh();
            }, 500);
        })();
        // END BLOCK: Safe Patch V16.3 (UI/Drag/CM Isolation)

// ### BLOCK START: Full-Screen HTML Source Viewer  3496
// [UPDATE SOURCE]
// ### BLOCK START: Full-Screen HTML Source Viewer  3496
// [UPDATE SOURCE WITH CLEAN COPY & MULTI-URL FETCH]
        const htmlSourceStyle = document.createElement('style');
        htmlSourceStyle.id = 'lab-html-source-viewer-styles';
        htmlSourceStyle.textContent = `
            /* [BẢO VỆ CHỐNG GIẬT KHUNG GIỮA 2 CỘT] Vô hiệu hóa hiệu ứng chuyển động nhiễm từ trang gốc */
            #labHtmlSourceModal .lab-inspect-parent,#labHtmlSourceModal .lab-inspect-child,#labHtmlSourceModal .lab-inspect-grand,#labHtmlSourceModal .lab-inspect-child::before,#labHtmlSourceModal .lab-inspect-parent::before,#labHtmlSourceModal .lab-inspect-grand::before,#labHtmlSourceModal.lab-inspect-parent,#labHtmlSourceModal.lab-inspect-child,#labHtmlSourceModal.lab-inspect-grand,#labHtmlSourceModal.lab-inspect-child::before,#labHtmlSourceModal.lab-inspect-parent::before,#labHtmlSourceModal.lab-inspect-grand::before {
                outline:inherit!important;
                outline-offset: inherit!important;
            }

            #labHtmlSourceModal, #labHtmlSourceModal * {
                box-sizing: border-box !important;
                transition: none !important;
                animation: none !important;
            }

            #labHtmlSourceModal {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(15, 15, 15, 0.98) !important; z-index: 2147483647 !important;
                display: none; flex-direction: column;
                font-family: 'Consolas', monospace !important;
            }
            #labHtmlSourceModal.lab-html-modal-active { display: flex !important; }

            #labHtmlSourceModal .lab-html-modal-header {
                background: #151515 !important; border-bottom: 2px solid #3498db !important;
                padding: 8px 14px !important; display: flex !important; align-items: center !important; gap: 12px !important;
                flex-shrink: 0 !important; height: 48px !important;
            }
            #labHtmlSourceModal .lab-html-modal-title { color: #3498db !important; font-weight: bold !important; font-size: 13px !important; white-space: nowrap !important; }

            #labHtmlSourceModal .lab-html-search-wrap {
                display: flex !important; align-items: center !important; gap: 6px !important; flex: 1 !important; max-width: 500px !important;
            }

            #labHtmlSourceModal #labHtmlSearchInput, #labHtmlSourceModal #labHtmlUrlInput {
                background: #202020 !important; border: 1px solid #333 !important; outline: none !important;
                color: #fff !important; padding: 6px 10px !important; border-radius: 3px !important; font-size: 12px !important;
            }
            #labHtmlSourceModal #labHtmlSearchInput { flex: 1 !important; }
            #labHtmlSourceModal #labHtmlUrlInput { width: 150px !important; }

            #labHtmlSourceModal .lab-html-search-btn {
                background: #34495e !important; color: #fff !important; border: none !important; outline: none !important;
                padding: 5px 12px !important; font-size: 12px !important; border-radius: 3px !important; cursor: pointer !important;
                white-space: nowrap !important;
            }
            #labHtmlSourceModal .lab-html-search-btn:hover { background: #4e6a85 !important; }
            #labHtmlSourceModal #labHtmlFormatBtn { background: #27ae60 !important; font-weight: bold !important; }
            #labHtmlSourceModal #labHtmlFormatBtn:hover { background: #2ecc71 !important; }
            #labHtmlSourceModal .lab-html-search-btn.btn-danger { background: #c0392b !important; }
            #labHtmlSourceModal .lab-html-search-btn.btn-danger:hover { background: #e74c3c !important; }
            #labHtmlSourceModal .lab-html-search-count { color: #aaa !important; font-size: 12px !important; min-width: 70px !important; text-align: center !important; }

            #labHtmlSourceModal .lab-html-modal-body {
                display: flex !important; flex: 1 !important; overflow: hidden !important; background: #1e1e1e !important;
            }

            /* Khu vực chứa Cây DOM hỗ trợ cuộn tự nhiên tuyệt đối ổn định */
            #labHtmlSourceModal .lab-html-editor-wrap {
                flex: 1 1 0% !important; min-width: 0 !important; display: flex !important; flex-direction: column !important;
                overflow: hidden !important; height: 100% !important; position: relative !important;
            }
            #labHtmlSourceModal .lab-html-editor-wrap.sidebar-open { flex: 0 0 70% !important; max-width: 70% !important; width: 70% !important; }

            #labHtmlTreeContainer {
                flex: 1 !important; overflow: auto !important; padding: 12px !important; background: #1e1e1e !important;
                color: #abb2bf !important; font-size: 12px !important; line-height: 1.6 !important; user-select: text !important;
            }

            /* CẤU TRÚC ĐỊNH DẠNG LAYOUT DOM TREE (STYLE DEVTOOLS DRACULA) */
            .lab-dom-node { display: block; padding-left: 4px; }
            .lab-dom-header { display: flex; align-items: flex-start; cursor: default; border-radius: 2px; padding: 1px 0; white-space: pre-wrap; word-break: break-all; }
            .lab-dom-header:hover { background: #2c313c !important; }

            /* Mũi tên đóng mở nhánh */
            .lab-dom-toggle { display: inline-block; width: 14px; min-width: 14px; text-align: center; color: #5c6370; font-size: 10px; user-select: none; margin-right: 2px; }
            .lab-dom-toggle.has-children { cursor: pointer; color: #abb2bf; }
            .lab-dom-toggle.has-children:hover { color: #fff; }

            /* Thư mục con thụt lề có đường kẻ biên mờ ảo trực quan */
            .lab-dom-children { margin-left: 14px; padding-left: 6px; border-left: 1px dashed #333333; }

            /* Đổ màu Token Mã nguồn */
            .lab-dom-tag-open, .lab-dom-tag-close, .lab-dom-block-close { color: #e06c75 !important; } /* Màu Thẻ Hồng */
            .lab-dom-node .tag-name { color: #e06c75 !important; font-weight: bold; cursor: pointer; }
            .lab-dom-node .tag-name:hover { text-decoration: underline !important; color: #ef596f !important; }

            .lab-dom-node .tag-attr { color: #d19a66 !important; cursor: pointer; display: inline-block; padding: 0 2px; } /* Thuộc tính Vàng cam */
            .lab-dom-node .tag-attr:hover { background: #3e4451; border-radius: 2px; }
            .lab-dom-node .attr-name { color: #d19a66 !important; }
            .lab-dom-node .attr-val { color: #98c379 !important; } /* Giá trị Xanh lá */

            .lab-dom-text { color: #abb2bf !important; cursor: pointer; } /* Chuỗi chữ */
            .lab-dom-pure-text { padding-left: 16px; color: #abb2bf !important; white-space: pre-wrap; word-break: break-all; }
            .lab-dom-summary { color: #5c6370 !important; font-style: italic; margin: 0 4px; user-select: none; }
            .lab-dom-comment { color: #5c6370 !important; font-style: italic; padding-left: 16px; white-space: pre-wrap; }

            /* Sidebar hiển thị danh sách kết quả */
            #labHtmlSourceModal .lab-html-sidebar {
                flex: 0 0 0% !important; background: #151515 !important; border-left: 2px solid #252525 !important;
                display: flex !important; flex-direction: column !important; overflow: hidden !important; height: 100% !important;
            }
            #labHtmlSourceModal .lab-html-sidebar.sidebar-open { flex: 0 0 30% !important; max-width: 30% !important; width: 30% !important; }

            #labHtmlSourceModal .lab-html-sidebar-header {
                background: #202020 !important; padding: 8px 10px !important; color: #aaa !important;
                font-size: 12px !important; font-weight: bold !important; border-bottom: 1px solid #333 !important;
                display: flex !important; justify-content: space-between !important; align-items: center;
            }
            #labHtmlSourceModal .lab-html-sidebar-list { flex: 1 !important; overflow-y: auto !important; padding: 4px !important; }

            #labHtmlSourceModal .lab-html-match-item {
                padding: 6px 8px !important; color: #ccc !important; font-size: 12px !important; cursor: pointer !important;
                border-bottom: 1px solid #222 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;
            }
            #labHtmlSourceModal .lab-html-match-item:hover { background: #252525 !important; color: #fff !important; }
            #labHtmlSourceModal .lab-html-match-item.active-match { background: #3498db !important; color: #fff !important; }
            #labHtmlSourceModal .lab-html-match-item .match-num { color: #e67e22 !important; font-weight: bold !important; margin-right: 6px !important; }

            /* Giao diện Toast và Trạng thái Highlight tìm kiếm */
            .lab-html-toast {
                position: fixed !important; background: rgba(46, 204, 113, 0.95) !important; color: #fff !important;
                padding: 6px 12px !important; border-radius: 4px !important; font-size: 12px !important; font-weight: bold !important;
                pointer-events: none !important; z-index: 2147483648 !important; box-shadow: 0 2px 10px rgba(0,0,0,0.5) !important;
                opacity: 0; max-width: 300px; word-break: break-all !important;
            }
            .lab-html-toast.show { opacity: 1 !important; }

            /* Trạng thái Highlight của cây tìm kiếm */
            .lab-tree-search-highlight { background: rgba(230, 126, 34, 0.35) !important; color: #fff !important; border-radius: 2px; padding: 0 2px; }
            .lab-tree-search-current { background: #e67e22 !important; color: #000 !important; font-weight: bold; border-radius: 2px; padding: 0 2px; }

            /* Tùy biến thanh cuộn chuẩn nguyên bản hệ thống */
            #labHtmlSourceModal ::-webkit-scrollbar { width: 10px !important; height: 10px !important; background: #1e1e1e !important; }
            #labHtmlSourceModal ::-webkit-scrollbar-thumb { background: #3e3e3e !important; border-radius: 3px !important; }
            #labHtmlSourceModal ::-webkit-scrollbar-thumb:hover { background: #555 !important; }
        `;
        document.head.appendChild(htmlSourceStyle);

        (function initHtmlSourceViewer() {
            const modalHtml = `
                <div id="labHtmlSourceModal">
                    <div class="lab-html-modal-header">
                        <span class="lab-html-modal-title">🌳 Cây Cấu Trúc DOM Gốc</span>
                        
                        <!-- CẢI TIẾN: Bộ nạp URL để fetch tiếp các trang cùng Domain -->
                        <div style="display: flex !important; align-items: center !important; gap: 4px !important;">
                            <input type="text" id="labHtmlUrlInput" placeholder="Đường dẫn trang mới (e.g. /categories)...">
                            <button class="lab-html-search-btn" id="labHtmlUrlFetchBtn" style="background: #2980b9 !important;" title="Fetch trang mới cùng Domain">⚡ Fetch URL</button>
                        </div>

                        <div class="lab-html-search-wrap">
                            <input type="text" class="lab-html-search-input" id="labHtmlSearchInput" placeholder="Nhập từ khóa cần lọc (thẻ, class, id, text)...">
                            <button class="lab-html-search-btn" id="labHtmlSearchPrev">▲ Trước</button>
                            <button class="lab-html-search-btn" id="labHtmlSearchNext">▼ Sau</button>
                            <span class="lab-html-search-count" id="labHtmlSearchCount">0/0</span>
                        </div>

                        <!-- CẢI TIẾN: Nút sao chép mã nguồn đã làm sạch hoàn toàn Script ẩn -->
                        <button class="lab-html-search-btn" id="labHtmlCopySourceBtn" style="background: #8e44ad !important;" title="Sao chép Source Sạch (Không chứa script)">📋 Sao chép</button>

                        <button class="lab-html-search-btn" id="labHtmlToggleSidebar" title="Bật/Tắt Kết quả">📋</button>
                        <button class="lab-html-search-btn btn-danger" id="labHtmlCloseModal" title="Đóng">✕</button>
                    </div>
                    <div class="lab-html-modal-body">
                        <div class="lab-html-editor-wrap" id="labHtmlEditorWrap">
                            <div id="labHtmlTreeContainer"></div>
                        </div>
                        <div class="lab-html-sidebar" id="labHtmlSidebar">
                            <div class="lab-html-sidebar-header">
                                <span>Danh sách kết quả</span>
                                <span id="labHtmlTotalMatches">0 kết quả</span>
                            </div>
                            <div class="lab-html-sidebar-list" id="labHtmlSidebarList"></div>
                        </div>
                    </div>
                </div>
            `;
            $('body').append(modalHtml);

            const $viewSourceBtn = $('<button class="lab-mini-btn" id="labBtnViewSource" title="Xem Cây DOM Gốc" style="margin-right:4px;">📄 Source Tree</button>');
            if ($('#labRestoreGroupButtons').length) {
                $('#labRestoreGroupButtons').append($viewSourceBtn);
            } else if ($('.lab-restore-group').length) {
                $('.lab-restore-group').first().append($viewSourceBtn);
            }

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
            const $treeContainer = $('#labHtmlTreeContainer');
            
            // Các Element mới được thêm vào
            const $copySourceBtn = $('#labHtmlCopySourceBtn');
            const $urlInput = $('#labHtmlUrlInput');
            const $urlFetchBtn = $('#labHtmlUrlFetchBtn');

            let parsedHtmlDocument = null;
            let searchMatches = [];
            let currentMatchIndex = -1;
            let sidebarOpen = false;
            let lastSearchQuery = '';

            function escapeHTML(str) {
                return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
            }

            // HÀM XÂY DỰNG CÂY DOM ĐỆ QUY CHUYÊN NGHIỆP
            function createTreeDOM(node) {
                if (node.nodeType === Node.COMMENT_NODE) {
                    const commentTxt = node.nodeValue.trim();
                    if (!commentTxt) return null;
                    return $(`<div class="lab-dom-comment">&lt;!-- ${escapeHTML(commentTxt)} --&gt;</div>`)[0];
                }
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue.trim();
                    if (!text) return null;
                    return $(`<div class="lab-dom-pure-text">${escapeHTML(text)}</div>`)[0];
                }
                if (node.nodeType !== Node.ELEMENT_NODE) return null;

                const tagName = node.tagName.toLowerCase();
                if (['link', 'meta', 'br', 'hr', 'img', 'input'].includes(tagName)) {
                    // Xử lý các thẻ tự đóng đơn giản inline
                    const $nodeWrap = $('<div class="lab-dom-node"></div>');
                    const $header = $('<div class="lab-dom-header"></div>');
                    $header.append('<span class="lab-dom-toggle empty">&nbsp;</span>');

                    const $openTag = $(`<span class="lab-dom-tag-open">&lt;<span class="tag-name">${tagName}</span></span>`);
                    if (node.attributes && node.attributes.length > 0) {
                        for (let attr of node.attributes) {
                            $openTag.append(' ');
                            $openTag.append($(`<span class="tag-attr" data-name="${attr.name}" data-val="${attr.value}"><span class="attr-name">${attr.name}</span>="<span class="attr-val">${attr.value}</span>"</span>`));
                        }
                    }
                    $openTag.append(' /&gt;');
                    $header.append($openTag);
                    $nodeWrap.append($header).data('raw-node', node);
                    return $nodeWrap[0];
                }

                const $nodeWrap = $('<div class="lab-dom-node"></div>').data('raw-node', node);
                const $header = $('<div class="lab-dom-header"></div>');

                const hasChildren = node.childNodes.length > 0;
                const hasElementChildren = node.children.length > 0;
                const totalTextLength = node.textContent.trim().length;

                const $toggle = $('<span class="lab-dom-toggle"></span>');
                const complexNode = hasElementChildren || (hasChildren && totalTextLength > 80);

                if (complexNode) {
                    $toggle.text('▸').addClass('has-children');
                } else {
                    $toggle.html('&nbsp;').addClass('empty');
                }
                $header.append($toggle);

                const $openTag = $(`<span class="lab-dom-tag-open">&lt;<span class="tag-name">${tagName}</span></span>`);
                if (node.attributes && node.attributes.length > 0) {
                    for (let attr of node.attributes) {
                        $openTag.append(' ');
                        $openTag.append($(`<span class="tag-attr" data-name="${attr.name}" data-val="${attr.value}"><span class="attr-name">${attr.name}</span>="<span class="attr-val">${attr.value}</span>"</span>`));
                    }
                }
                $openTag.append('&gt;');
                $header.append($openTag);

                const $childrenContainer = $('<div class="lab-dom-children" style="display:none;"></div>');
                const $blockClose = $(`<div class="lab-dom-block-close" style="display:none; padding-left:16px;">&lt;/<span class="tag-name">${tagName}</span>&gt;</div>`);

                if (complexNode) {
                    $header.append('<span class="lab-dom-summary">...</span>');
                    $header.append($(`<span class="lab-dom-tag-close" style="display:none;">&lt;/<span class="tag-name">${tagName}</span>&gt;</span>`));

                    for (let child of node.childNodes) {
                        const childDOM = createTreeDOM(child);
                        if (childDOM) $childrenContainer.append(childDOM);
                    }
                    $nodeWrap.append($header).append($childrenContainer).append($blockClose);
                } else {
                    // Thẻ đơn giản chứa text ngắn gọn hiển thị ngay trên 1 dòng
                    const txt = node.textContent.trim();
                    if (txt) {
                        $header.append($(`<span class="lab-dom-text">${escapeHTML(txt)}</span>`));
                    }
                    $header.append($(`<span class="lab-dom-tag-close">&lt;/<span class="tag-name">${tagName}</span>&gt;</span>`));
                    $nodeWrap.append($header);
                }

                // SỰ KIỆN CLICK ĐÓNG MỞ NHÁNH CÂY CỦA HEADER
                $header.on('click', function(e) {
                    if ($(e.target).closest('.tag-name, .tag-attr, .lab-dom-text').length > 0) return;
                    if ($toggle.hasClass('has-children')) {
                        const isOpen = $childrenContainer.is(':visible');
                        if (isOpen) {
                            $childrenContainer.hide();
                            $blockClose.hide();
                            $header.find('.lab-dom-summary').show();
                            $toggle.text('▸');
                        } else {
                            $childrenContainer.show();
                            $blockClose.show();
                            $header.find('.lab-dom-summary').hide();
                            $toggle.text('▾');
                        }
                    }
                });

                return $nodeWrap[0];
            }

            // HÀM TỔNG HỢP: Tiến hành Fetch mã nguồn từ 1 URL cụ thể và render lên Tree
            function executeFetchSource(targetUrl) {
                $treeContainer.html('<div style="color:#aaa; padding:10px;">⌛ Đang phân tích và dựng bản đồ DOM Tree nguồn...</div>');

                fetch(targetUrl)
                    .then(response => response.text())
                    .then(html => {
                        parsedHtmlDocument = new DOMParser().parseFromString(html, 'text/html');
                        $treeContainer.empty();

                        // Dựng cây từ thẻ HTML gốc của trang được fetch
                        const treeRoot = createTreeDOM(parsedHtmlDocument.documentElement);
                        if (treeRoot) {
                            $treeContainer.append(treeRoot);
                            // Mở sẵn tầng đầu tiên cho thân thiện
                            $(treeRoot).children('.lab-dom-header').trigger('click');
                        }

                        $modal.addClass('lab-html-modal-active');
                        $searchInput.val('');
                        lastSearchQuery = '';
                        clearSearch();
                    })
                    .catch(err => {
                        parsedHtmlDocument = null;
                        $treeContainer.html('<div style="color:#c0392b; padding:10px;">❌ Lỗi nạp nguồn mã: ' + err + '</div>');
                    });
            }

            $viewSourceBtn.on('click', function(e) {
                e.stopPropagation();

                // Nếu đã phân tích dữ liệu trước đó rồi, chỉ cần mở lại Modal mà không fetch lại trang gốc ban đầu
                if (parsedHtmlDocument) {
                    $modal.addClass('lab-html-modal-active');
                    return;
                }

                // Lần đầu tiên chạy, fetch URL hiện tại của trình duyệt
                executeFetchSource(window.location.href);
            });

            // CẢI TIẾN: Lắng nghe sự kiện click nút Fetch trang mới
            $urlFetchBtn.on('click', function(e) {
                e.stopPropagation();
                const inputUrl = $urlInput.val().trim();
                if (!inputUrl) {
                    alert('Vui lòng nhập đường dẫn URL cần Fetch tiếp theo!');
                    return;
                }
                executeFetchSource(inputUrl);
            });

            $urlInput.on('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    $urlFetchBtn.trigger('click');
                }
            });

            // CẢI TIẾN: Xử lý sự kiện sao chép mã nguồn loại bỏ toàn bộ Script chạy ngầm
            // =========================================================================
            // CẢI TIẾN MỚI: Xử lý sự kiện sao chép mã nguồn CÓ BẢO VỆ CHỐNG LỖI (3 TẦNG BẢO VỆ)
            // =========================================================================
                        // =========================================================================
            // CẢI TIẾN MỚI: SỐNG SÓT QUA MỌI WEBSITE & TỰ ĐỘNG BỔ SUNG FULL HOSTNAME CHO URL TƯƠNG ĐỐI
            // =========================================================================
            $copySourceBtn.on('click', function(e) {
                e.stopPropagation();
                if (!parsedHtmlDocument) {
                    alert('Không tìm thấy dữ liệu nguồn để sao chép!');
                    return;
                }

                let finalCleanHTML = '';

                // --- TẦNG 1: THỬ LÀM SẠCH VÀ LINK HOÁ TUYỆT ĐỐI BẰNG DOM (ƯU TIÊN) ---
                try {
                    const documentClone = parsedHtmlDocument.cloneNode(true);
                    if (documentClone && documentClone.documentElement) {
                        // 1. Quét sạch hoàn toàn mọi thẻ <script>
                        const allScriptTags = documentClone.querySelectorAll('script');
                        allScriptTags.forEach(script => script.remove());

                        // 2. Duyệt qua toàn bộ phần tử để xóa sự kiện inline và sửa URL tương đối
                        const allElements = documentClone.querySelectorAll('*');
                        allElements.forEach(element => {
                            // Xóa các sự kiện chạy ngầm on*
                            if (element.attributes && element.attributes.length > 0) {
                                const attrs = Array.from(element.attributes);
                                attrs.forEach(attr => {
                                    if (attr.name.toLowerCase().startsWith('on')) {
                                        element.removeAttribute(attr.name);
                                    }
                                });
                            }

                            // Tự động chuyển đổi các đường dẫn tương đối thành Full URL
                            ['src', 'href'].forEach(attrName => {
                                if (element.hasAttribute(attrName)) {
                                    let attrVal = element.getAttribute(attrName).trim();
                                    // Kiểm tra nếu URL không phải link tuyệt đối, base64 hay javascript:
                                    if (attrVal && !/^(https?:|===|\/\/|data:|javascript:|#)/i.test(attrVal)) {
                                        try {
                                            // Dùng đối tượng URL để tự động map chuẩn xác với domain hiện tại của trang
                                            let absoluteUrl = new URL(attrVal, window.location.href).href;
                                            element.setAttribute(attrName, absoluteUrl);
                                        } catch(urlErr) {
                                            // Bỏ qua nếu gặp ký tự URL lỗi đặc biệt
                                        }
                                    }
                                }
                            });
                        });
                        finalCleanHTML = '<!DOCTYPE html>\n' + documentClone.documentElement.outerHTML;
                    } else {
                        throw new Error("Không thể clone phần tử gốc");
                    }
                } catch (domError) {
                    console.warn("Tầng 1 (DOM) thất bại do dữ liệu quá nặng. Chuyển sang Tầng 2 (Regex)...", domError);
                    
                    // --- TẦNG 2: FALLBACK BẰNG REGEX (Xử lý chuỗi thuần phòng hờ DOM lỗi) ---
                    try {
                        let rawHtml = '';
                        if (parsedHtmlDocument.documentElement) {
                            rawHtml = parsedHtmlDocument.documentElement.outerHTML;
                        } else {
                            rawHtml = parsedHtmlDocument.body.innerHTML;
                        }
                        // Xóa các thẻ script
                        rawHtml = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                        // Xóa các thuộc tính on* inline
                        rawHtml = rawHtml.replace(/\s+on[a-zA-Z]+\s*=\s*(["'])(.*?)\1/gi, '');
                        rawHtml = rawHtml.replace(/\s+on[a-zA-Z]+\s*=\s*[^>\s]+/gi, '');
                        
                        // Quét chuỗi tìm src="..." và href="..." tương đối để tự động chèn thêm Hostname
                        rawHtml = rawHtml.replace(/(\b(src|href)\s*=\s*(["']))([^"'\s>]+)\3/gi, (match, p1, p2, p3, p4) => {
                            let urlVal = p4.trim();
                            if (urlVal && !/^(https?:|===|\/\/|data:|javascript:|#)/i.test(urlVal)) {
                                try {
                                    // Chuyển đổi chuỗi URL tương đối dựa vào URL trang hiện tại
                                    return p1 + new URL(urlVal, window.location.href).href + p3;
                                } catch(e) {
                                    return match;
                                }
                            }
                            return match;
                        });
                        
                        finalCleanHTML = '<!DOCTYPE html>\n' + rawHtml;
                    } catch (regexError) {
                        alert('❌ Không thể xử lý mã nguồn của trang này bằng cả 2 phương pháp!');
                        return;
                    }
                }

                // --- TẦNG 3: ĐƯA VÀO CLIPBOARD HOẶC TỰ ĐỘNG TẢI FILE HTML SẠCH VỀ MÁY ---
                if (finalCleanHTML) {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(finalCleanHTML)
                            .then(() => {
                                showToastSuccess("Đã sao chép Source Sạch!", e.clientX, e.clientY);
                            })
                            .catch(() => {
                                executeFallbackCopyOrDownload(finalCleanHTML, e.clientX, e.clientY);
                            });
                    } else {
                        executeFallbackCopyOrDownload(finalCleanHTML, e.clientX, e.clientY);
                    }
                }
            });

            // Hàm xử lý dự phòng: Thử copy kiểu cũ, nếu website chặn bảo mật nghiêm ngặt thì tải file về
            function executeFallbackCopyOrDownload(text, x, y) {
                let copySuccess = false;
                try {
                    const $temp = $('<textarea>').val(text).appendTo('body').select();
                    copySuccess = document.execCommand('copy');
                    $temp.remove();
                    if (copySuccess) {
                        showToastSuccess("Đã sao chép (Dự phòng)!", x, y);
                        return;
                    }
                } catch (err) {
                    console.error("Cách copy dự phòng cũng thất bại: ", err);
                }

                // Nếu mọi cơ chế copy đều bị trình duyệt chặn (CSP bảo mật lớn), xuất file tải về an toàn
                try {
                    const blob = new Blob([text], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `clean_source_${new Date().getTime()}.html`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    alert('⚠️ Do trang web này chặn quyền Sao chép, Script đã tự động chuyển hướng tải mã nguồn sạch về máy của bạn dưới dạng file .html để sử dụng hoàn hảo nhất!');
                } catch (downloadError) {
                    alert('❌ Thất bại: Không thể sao chép và không thể tạo file tải về!');
                }
            }

            // Hàm hiển thị thông báo Toast thành công
            function showToastSuccess(msg, x, y) {
                const $toast = $('<div class="lab-html-toast"></div>').text(msg);
                $('body').append($toast);
                $toast.css({ left: (x + 12) + 'px', top: (y + 12) + 'px' });
                requestAnimationFrame(() => $toast.addClass('show'));
                setTimeout(() => {
                    $toast.removeClass('show');
                    setTimeout(() => $toast.remove(), 250);
                }, 2500);
            }

            // CHỨC NĂNG CLICK SAO CHÉP VÀ ĐỒNG BỘ VỚI HỆ THỐNG GỐC CỦA BẠN
            $treeContainer.on('click', '.tag-name, .tag-attr, .lab-dom-text, .lab-dom-pure-text', function(e) {
                e.stopPropagation();
                let copyText = '';

                // Chỉ lấy giá trị thuộc tính bên trong data-val
                if ($(this).hasClass('tag-attr')) {
                    copyText = $(this).attr('data-val') || '';
                } else {
                    copyText = $(this).text();
                }

                // Đồng bộ trực tiếp phần tử thật vào bộ điều hướng DOM Tree Main của bạn
                if ($(this).hasClass('tag-name')) {
                    const rawNode = $(this).closest('.lab-dom-node').data('raw-node');
                    if (rawNode && typeof loadElementToTreeMain === 'function') {
                        loadElementToTreeMain(rawNode);
                        $('#labFamilyTreeBar').css('display', 'flex');
                    }
                }

                if (copyText && copyText.trim()) {
                    copyToClipboardWithToast(copyText.trim(), e.clientX, e.clientY);
                }
            });

            function closeModal() {
                $modal.removeClass('lab-html-modal-active');
                clearSearch();
            }
            $closeModal.on('click', closeModal);
            $(document).on('keydown.htmlSourceModal', function(e) {
                if (e.key === 'Escape' && $modal.hasClass('lab-html-modal-active')) closeModal();
            });

            function clearSearch() {
                searchMatches = [];
                currentMatchIndex = -1;
                $searchCount.text('0/0');
                $totalMatches.text('0 kết quả');
                $sidebarList.empty();
                $treeContainer.find('.lab-tree-search-highlight, .lab-tree-search-current').each(function() {
                    const rawTxt = $(this).text();
                    $(this).replaceWith(document.createTextNode(rawTxt));
                });
            }

            // HÀM TÌM KIẾM TOÀN DIỆN TRÊN CÂY DOM VÀ TỰ ĐỘNG BẬT NHÁNH CHA
            function performSearch() {
                const query = $searchInput.val().trim();
                if (!query) {
                    lastSearchQuery = '';
                    clearSearch();
                    return;
                }

                if (query === lastSearchQuery && searchMatches.length > 0) {
                    jumpToMatch(currentMatchIndex + 1);
                    return;
                }

                clearSearch();
                lastSearchQuery = query;
                const lowerQuery = query.toLowerCase();
                let listHtml = '';
                let index = 0;

                // Quét qua các lớp chứa nội dung text cốt lõi
                $treeContainer.find('.tag-name, .attr-name, .attr-val, .lab-dom-text, .lab-dom-pure-text, .lab-dom-comment').each(function() {
                    const $el = $(this);
                    const txt = $el.text();
                    const startIdx = txt.toLowerCase().indexOf(lowerQuery);

                    if (startIdx !== -1) {
                        searchMatches.push($el);

                        // Đánh dấu highlight nền mờ ban đầu bằng cách bao bọc thẻ span html
                        const safeTxt = escapeHTML(txt);
                        const regex = new RegExp('(' + query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'gi');
                        const highlightedHtml = safeTxt.replace(regex, '<span class="lab-tree-search-highlight">$1</span>');
                        $el.html(highlightedHtml);

                        let displayTxt = txt.substring(startIdx, startIdx + 50);
                        if (txt.length > 50) displayTxt += '...';

                        const pTag = $el.closest('.lab-dom-node').find('.tag-name').first().text() || 'text';
                        listHtml += `<div class="lab-html-match-item" data-idx="${index}">
                            <span class="match-num">#${index + 1}</span>[&lt;${pTag}&gt;]: ${escapeHTML(displayTxt)}
                        </div>`;
                        index++;
                    }
                });

                $totalMatches.text(searchMatches.length + ' kết quả');
                $searchCount.text(searchMatches.length > 0 ? `1/${searchMatches.length}` : '0/0');
                $sidebarList.html(listHtml);

                $sidebarList.find('.lab-html-match-item').on('click', function() {
                    jumpToMatch(parseInt($(this).attr('data-idx'), 10));
                });

                if (searchMatches.length > 0) {
                    jumpToMatch(0);
                    if (!sidebarOpen) toggleSidebar(true);
                }
            }

            function jumpToMatch(index) {
                if (searchMatches.length === 0) return;
                if (index < 0) index = searchMatches.length-1;
                if (index >= searchMatches.length) index = 0;
                currentMatchIndex = index;

                const $targetElement = searchMatches[index];

                // ÉP CÁC NHÁNH CHA CỦA KẾT QUẢ PHẢI TỰ ĐỘNG MỞ RA
                $targetElement.parents('.lab-dom-children').each(function() {
                    const $childrenBlock = $(this);
                    if (!$childrenBlock.is(':visible')) {
                        $childrenBlock.show();
                        const $parentNode = $childrenBlock.closest('.lab-dom-node');
                        const $pHeader = $parentNode.children('.lab-dom-header');
                        $pHeader.find('.lab-dom-toggle').text('▾');
                        $pHeader.find('.lab-dom-summary').hide();
                        $parentNode.children('.lab-dom-block-close').show();
                    }
                });

                // Cập nhật trạng thái Highlight cam đậm cho phần tử hiện tại đang chọn
                $treeContainer.find('.lab-tree-search-current').removeClass('lab-tree-search-current').addClass('lab-tree-search-highlight');
                const $localHighlight = $targetElement.find('.lab-tree-search-highlight').eq(0);
                if ($localHighlight.length) {
                    $localHighlight.removeClass('lab-tree-search-highlight').addClass('lab-tree-search-current');
                    $localHighlight[0].scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
                } else {
                    $targetElement.addClass('lab-tree-search-current');
                    $targetElement[0].scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
                }

                $searchCount.text((index + 1) + '/' + searchMatches.length);
                $sidebarList.find('.lab-html-match-item').removeClass('active-match');
                const $activeItem = $sidebarList.find(`.lab-html-match-item[data-idx="${index}"]`);
                $activeItem.addClass('active-match');
                if ($activeItem.length) {
                    $activeItem[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }

            $searchPrev.on('click', function(e) {
                e.stopPropagation();
                if (searchMatches.length > 0) jumpToMatch(currentMatchIndex-1);
            });

            $searchNext.on('click', function(e) {
                e.stopPropagation();
                performSearch();
            });

            $searchInput.on('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });

            function toggleSidebar(force) {
                if (typeof force !== 'undefined') sidebarOpen = force;
                else sidebarOpen = !sidebarOpen;
                $editorWrap.toggleClass('sidebar-open', sidebarOpen);
                $sidebar.toggleClass('sidebar-open', sidebarOpen);
            }

            $toggleSidebar.on('click', function(e) {
                e.stopPropagation();
                toggleSidebar();
            });

            function copyToClipboardWithToast(text, x, y) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
                } else {
                    fallbackCopy(text);
                }

                const displayText = text.length > 35 ? text.substring(0, 32) + '...' : text;
                const $toast = $('<div class="lab-html-toast"></div>').text('Đã sao chép: ' + displayText);
                $('body').append($toast);
                $toast.css({ left: (x + 12) + 'px', top: (y + 12) + 'px' });

                requestAnimationFrame(() => $toast.addClass('show'));
                setTimeout(() => {
                    $toast.removeClass('show');
                    setTimeout(() => $toast.remove(), 250);
                }, 2500);
            }

            function fallbackCopy(text) {
                const $temp = $('<textarea>').val(text).appendTo('body').select();
                document.execCommand('copy');
                $temp.remove();
            }

            $modal.on('click', function(e) {
                e.stopPropagation();
            });
        })();

//[UPDATE 2.0] END Full-screen HTML Source Viewer Feature
// END BLOCK: Full-Screen HTML Source Viewer 2948

    // ### BLOCK START: IIFE & Event Listener Cleanup
    });

})();
    // END BLOCK: IIFE & Event Listener Cleanup
