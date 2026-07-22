// ============================================================
// === DANH MỤC CHỨC NĂNG (INDEX) ===
// ============================================================

// ### UserScript Header & Metadata - 1 - 26 - Khối metadata Tampermonkey với các thông tin @name, @version, @require, và quyền truy cập.

// ### IIFE Wrapper & Entry Point - 27 - 5323 - Khối IIFE (Immediately Invoked Function Expression) bao bọc toàn bộ logic, kiểm tra iframe và khởi chạy sau window load.

// ### CSS Injection (High-Contrast Engine & CodeMirror) - 174 - 475 - Định nghĩa và chèn CSS tùy chỉnh vào trang, bao gồm giao diện dashboard, CodeMirror theme Dracula, scrollbar, và các hiệu ứng highlight DOM.

// ### HTML Dashboard Structure - 476 - 627 - Xây dựng cấu trúc HTML bằng jQuery cho bốn panel chính: DOM Tree, Console, CSS Inspector, và JS Editor.
// ### escapeHtml - 624 - 624 - Hàm cốt lõi trong module HTML Dashboard Structure.

// ### Events & LocalStorage State Manager - 628 - 665 - Quản lý trạng thái dashboard qua LocalStorage: tự động lưu và khôi phục vị trí, chế độ hiển thị, panel ẩn/hiện.

// ### Console Override & Logging - 666 - 686 - Ghi đè console.log/error/warn để bắt và hiển thị log nội bộ trong panel Console của dashboard.

// ### Object Tree Renderer - 687 - 740 - Hiển thị cấu trúc object JavaScript dạng cây phân cấp, hỗ trợ mở rộng/thu gọn từng node.

// ### PostMessage Sandbox Communication - 741 - 765 - Thiết lập kênh giao tiếp postMessage giữa môi trường chính và sandbox iframe an toàn.

// ### Sandbox Environment Initialization - 766 - 912 - Tạo iframe sandbox cô lập, inject code kiểm tra DOM và cây thức thể bên trong sandbox.
// ### escapeH - 784 - 784 - Hàm cốt lõi trong module Sandbox Environment Initialization.
// ### buildTreeString - 786 - 786 - Hàm cốt lõi trong module Sandbox Environment Initialization.

// ### JavaScript Dynamic Execution Engine - 913 - 1112 - Cung cấp engine thực thi JavaScript động với đầy đủ try-catch, hiển thị kết quả trả về hoặc lỗi.
// ### executeJsEngine - 962 - 962 - Hàm cốt lõi trong module JavaScript Dynamic Execution Engine.

// ### DOM Inspector (Main Environment) - 1113 - 1205 - Công cụ soi DOM trong môi trường chính: xây dựng cây DOM, xử lý click phải, chọn thành phần.
// ### buildDomTreeMain - 1117 - 1117 - Hàm cốt lõi trong module DOM Inspector (Main Environment).
// ### loadElementToTreeMain - 1154 - 1154 - Hàm cốt lõi trong module DOM Inspector (Main Environment).

// ### Quick Hide Element (Right Click) - 1206 - 1262 - Ẩn nhanh phần tử DOM bằng click chuột phải với tổ hợp phím Ctrl+Alt.
// ### requestDomInspect - 1251 - 1251 - Hàm cốt lõi trong module Quick Hide Element (Right Click).

// ### Family Tree Navigation (10 Levels) - 1263 - 1331 - Hiển thị cây phả hệ DOM lên đến 10 cấp độ với điều hướng parent/child/sibling.

// ### UI & Resize Panel Manager - 1332 - 1441 - Quản lý kích thước và vị trí panel: resize splitter, mở rộng/thu nhớ, tắt/bật panel.
// ### updateScreenSplitting - 1336 - 1336 - Hàm cốt lõi trong module UI & Resize Panel Manager.

// ### Draggable FAB Button - 1442 - 1507 - Nút FAB (Floating Action Button) kéo thả tự do, hỗ trợ chuyển đổi chế độ.

// ### FAB Right-Click Scroll Handler - 1508 - 1579 - Xử lý cuộn trang bằng click chuột phải trên FAB, kết hợp với phím tắt.

// ### Panel Drag & Drop (Free Move) - 1580 - 1629 - Hệ thống kéo thả panel tự do (free move) trên màn hình.

// ### Smart CSS Grouping & Quick-Option Popover - 1630 - 1887 - Nhóm CSS thông minh và hiển thị tùy chọn nhanh qua popover.
// ### copyToClipboard - 1671 - 1671 - Hàm cốt lõi trong module Smart CSS Grouping & Quick-Option Popover.
// ### showQuickCssMenu - 1729 - 1729 - Hàm cốt lõi trong module Smart CSS Grouping & Quick-Option Popover.
// ### injectSmartCssRule - 1761 - 1761 - Hàm cốt lõi trong module Smart CSS Grouping & Quick-Option Popover.

// ### DevTools-Style Network Monitor v19 - 1888 - 2989 - Theo dõi mạng theo phong cách DevTools, hiển thị request/response.
// ### __labCategorizeEntry - 2004 - 2004 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labAddNetworkEntry - 2018 - 2018 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labFormatBytes - 2034 - 2034 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labFormatDuration - 2041 - 2041 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labStatusColor - 2047 - 2047 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labMethodColor - 2055 - 2055 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labGroupColor - 2060 - 2060 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labGroupLabel - 2064 - 2064 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labDominateSiblings - 2408 - 2408 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labCreateBlockedModal - 2493 - 2493 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labShowBlockedModal - 2521 - 2521 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labResetAllTools - 2527 - 2527 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### __labCheckTampered - 2566 - 2566 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.
// ### syncSnifferLayout - 3909 - 3909 - Hàm cốt lõi trong module DevTools-Style Network Monitor v19.

// ### Pro Code Editor Engine - 2990 - 3190 - Engine code editor chuyên nghiệp với syntax highlighting và autocomplete.
// ### initProCodeEditors - 2994 - 2994 - Hàm cốt lõi trong module Pro Code Editor Engine.
// ### saveJsTabs - 3013 - 3013 - Hàm cốt lõi trong module Pro Code Editor Engine.
// ### renderJsTabs - 3020 - 3020 - Hàm cốt lõi trong module Pro Code Editor Engine.

// ### Mini Tree DOM Search - 3191 - 3235 - Tìm kiếm mini tree trong DOM, hỗ trợ điều hướng nhanh.

// ### Sync Tree Hover to Web Element - 3236 - 3255 - Đồng bộ hover trên cây DOM với phần tử web tương ứng.

// ### Right-Click Zoom & Copy - 3256 - 3296 - Phóng to và sao chép nội dung bằng click chuột phải.
// ### fallbackCopyEngine - 3278 - 3278 - Hàm cốt lõi trong module Right-Click Zoom & Copy.

// ### Pro Max Engine V16.1 (Smart Panel Switch) - 3297 - 3467 - Engine chuyển đổi panel thông minh tự động điều chỉnh layout.
// ### restoreV16States - 3336 - 3336 - Hàm cốt lõi trong module Pro Max Engine V16.1 (Smart Panel Switch).
// ### closeSubPanel - 3402 - 3402 - Hàm cốt lõi trong module Pro Max Engine V16.1 (Smart Panel Switch).

// ### Safe Patch V16.3 (UI/Drag/CM Isolation) - 3468 - 4044 - Patch an toàn cô lập UI, draggable và CodeMirror để tránh xung đột.
// ### v163SaveConsoleHistory - 3563 - 3563 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163SaveTreeHistory - 3570 - 3570 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163RestoreHistory - 3583 - 3583 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163UpdateFloatingConsole - 3642 - 3642 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163SetCurrentTreeElement - 3687 - 3687 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163ExtractLinksFromElement - 3707 - 3707 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### processExtraction - 3803 - 3803 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163SetActiveLayerByDepth - 3863 - 3863 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163SaveSnifferPosition - 3887 - 3887 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163RestoreSnifferPosition - 3893 - 3893 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### syncSnifferLayout - 3909 - 3909 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163EscapeText - 3975 - 3975 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163FormatMaybeJson - 3976 - 3976 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163BuildDetails - 3982 - 3982 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).
// ### v163BuildSnifferGroupDomNode - 3986 - 3986 - Hàm cốt lõi trong module Safe Patch V16.3 (UI/Drag/CM Isolation).

// ### Full-Screen HTML Source Viewer  3496 - 4045 - 4791 - Module Full-Screen HTML Source Viewer  3496.
// ### escapeHTML - 4257 - 4257 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### createTreeDOM - 4262 - 4262 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### executeFetchSource - 4367 - 4367 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### executeFallbackCopyOrDownload - 4539 - 4539 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### showToastSuccess - 4572 - 4572 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### closeModal - 4609 - 4609 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### clearSearch - 4618 - 4618 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### performSearch - 4631 - 4631 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### jumpToMatch - 4690 - 4690 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### toggleSidebar - 4748 - 4748 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### copyToClipboardWithToast - 4760 - 4760 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.
// ### fallbackCopy - 4762 - 4762 - Hàm cốt lõi trong module Full-Screen HTML Source Viewer  3496.

// ### Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED) - 4792 - 5317 - Tăng cường bảo vệ chống hijack và trích xuất CSS.
// ### __labEscHtml - 4824 - 4824 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### getLabElementBySelector - 4828 - 4828 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### selectorFromElement - 4832 - 4832 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### isInsideLabUI - 4861 - 4861 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### shieldClickHandler - 4872 - 4872 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### enableShield - 4892 - 4892 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### blockUnloadHandler - 4951 - 4951 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### disableShield - 4960 - 4960 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### toggleShield - 4996 - 4996 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### createShieldBtn - 5002 - 5002 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### updateShieldBtn - 5021 - 5021 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### createExtractMenu - 5039 - 5039 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### getInlineStyleCss - 5127 - 5127 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### getStylesheetCssForSelector - 5133 - 5133 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### getComputedCss - 5157 - 5157 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### dedupBlocks - 5172 - 5172 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### renderExtractList - 5181 - 5181 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### addBlock - 5091 - 5091 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### openExtractMenu - 5210 - 5210 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### addTooltipStyle - 5273 - 5273 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).
// ### initModule - 5291 - 5291 - Hàm cốt lõi trong module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED).

// ### IIFE & Event Listener Cleanup - 5318 - 5324 - Dọn dẹp event listeners và kết thúc IIFE.

// ### BLOCK START: UserScript Header & IIFE Start
// ==UserScript==
// @name         Web Interactive Lab & Inspector Dashboard PRO v16.5 (Stable Patch)
// @namespace    http://tampermonkey.net/
// @version      16.6
// @description  Hồi sinh Click chuột Phải soi DOM trong Hard-Sandbox. Tự động lưu trạng thái. Tích hợp Pro CodeEditor Engine & Sub-Panel Splitter + Fix UI/Draggable. [FIX] Remove invalid CSS @require.
// @author       Gemini
// @match        *://*/*
// @run-at       document-start
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldcode.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldgutter.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/brace-fold.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.1/beautify.min.js

// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        setTimeout(() => {
            window.outerHTML = document.getElementsByTagName("html")[0].outerHTML;
            if (window.self !== window.top) return;
            // END BLOCK: UserScript Header & IIFE Start

            /* === Begin Module CSS Injection (High-Contrast Engine & CodeMirror): 174 === */
            // ==========================================
            // 1. KHỞI TẠO VÀ NHÚNG CSS (HIGH-CONTRAST ENGINE STYLES & CODEMIRROR)
            // ==========================================
            const styleElement = document.createElement('style');
            styleElement.id = 'interactive-dashboard-styles-v15-0';
            styleElement.innerHTML = `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css');
            @import url('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/hint/show-hint.min.css');

#panelConsole.lab-panel.lab-v163-floating-console.lab-panel-hidden { display: none!important; }
.lab-editor-container, .lab-editor-container, #labTreeDomBody, #labConsoleLogBody { text-align: left; }
.activeMode { background: black!important; color: white!important; border: 1px solid red; }
html, body { overscroll-behavior-y: contain !important; }
.lab-fab-wrapper:hover { opacity: 1; }
.lab-fab-wrapper { opacity: 0.2; position: fixed !important; bottom: 20px !important; right: 50px !important; z-index: 2147483647 !important; display: flex !important; pointer-events: auto !important; }
.lab-fab-main { width: 44px; height: 44px; border-radius: 50%; background-color: #3498db; color: white; border: none; font-size: 22px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.lab-dashboard-container { position: fixed!important; background: #111111; z-index: 2147483646; box-shadow: 0 0 25px rgba(0,0,0,0.6); display: none; flex-direction: column; font-family: 'Segoe UI', sans-serif; box-sizing: border-box; overflow: hidden; }
.lab-dashboard-container * { box-sizing: border-box; }
.lab-restore-bar { background: #151515; padding: 4px 10px; display: flex; gap: 8px; border-bottom: 1px solid #252525; font-size: 11px; color: #aaa; align-items: center; height: 38px; flex-shrink: 0; width: 100%; }
.lab-restore-group { display: flex; gap: 5px; align-items: center; border-right: 1px solid #333; padding-right: 8px; }
.lab-dashboard-container.mode-horizontal { bottom: 5px; left: 0; width: 100vw; height: 45vh; border-top: 3px solid #3498db; }
.lab-dashboard-container.mode-vertical-right { top: 0; right: 0; height: 100vh !important; width: 35vw; border-left: 3px solid #2ecc71; }
.lab-dashboard-container.mode-vertical-left { top: 0; left: 0; height: 100vh !important; width: 35vw; border-right: 3px solid #2ecc71; }
.lab-dashboard-container.lab-vertical-panel-fullscreen { width: 100vw !important; }
.lab-layout-engine { display: grid; flex: 1; min-height: 0; width: 100%; padding: 4px; gap: 6px; background: #111; overflow: hidden; }
.lab-dashboard-container.mode-horizontal .lab-layout-engine { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
.lab-dashboard-container[class*="mode-vertical-"] .lab-layout-engine { grid-template-columns: 1fr !important; grid-template-rows: repeat(4, 1fr); }
.lab-layout-engine.has-maximized { grid-template-columns: 1fr !important; grid-template-rows: 1fr !important; }
.lab-layout-engine.has-maximized .lab-panel:not(.lab-panel-maximized):not(.lab-v163-floating-console) { display: none }
.lab-layout-engine.has-maximized.lab-sub-panel-active { display: block!important }
.lab-panel { display: flex; flex-direction: column; background: #1e1e1e; border: 1px solid #252525; border-radius: 4px; overflow: hidden; position: relative; }
.lab-panel.lab-panel-hidden { display: none !important; }
.lab-panel.lab-panel-maximized { display: flex !important; width: 100%; height: 100% !important; }
.lab-panel-header { background: #252525; padding: 6px 8px; display: flex; justify-content: space-between; align-items: center; color: #aaa; font-size: 11px; font-weight: bold; border-bottom: 1px solid #151515; flex-shrink: 0; user-select: none; cursor: default; position: relative; }
.lab-panel-title { color: #3498db; }
.lab-panel-actions { display: flex; gap: 4px; align-items: center; pointer-events: auto; z-index: 10; }
.lab-mini-btn { background: #34495e; color: #fff; border: none; padding: 2px 6px; font-size: 11px; border-radius: 3px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; pointer-events: auto; }
.lab-mini-btn:hover { background: #4e6a85; }
.lab-mini-btn.btn-danger { background: #c0392b; }
.lab-mini-btn.btn-danger:hover { background: #e74c3c; }
.lab-mini-btn.btn-success { background: #27ae60; }
.lab-mini-btn.btn-success:hover { background: #2ecc71; }
.lab-mini-btn.active-max { background: #e67e22 !important; }
.lab-btn-wrap.active { background: #e67e22 !important; }
.lab-panel-body { flex: 1; overflow: auto; padding: 4px; position: relative; display: flex; flex-direction: column; background: #1e1e1e; min-height: 0; }
.lab-editor-container { position: relative; flex: 1; width: 100%; height: 100%; background: #1a1a1a; border-radius: 4px; border: 1px solid #333; overflow: hidden; display: flex; flex-direction: column; }
.CodeMirror { flex: 1; width: 100% !important; height: 100% !important; font-family: 'Consolas', 'Consolas', monospace !important; font-size: 13px !important; line-height: 1.5 !important; background: #1a1a1a !important; }
.CodeMirror-gutters { background: #151515 !important; border-right: 1px solid #333 !important; }
.CodeMirror-hints { display: block !important; visibility: visible !important; opacity: 1 !important; z-index: 2147483647 !important; position: absolute !important; list-style: none !important; margin: 0 !important; padding: 2px !important; border-radius: 3px !important; font-family: 'Consolas', monospace !important; font-size: 12px !important; background: #252525 !important; border: 1px solid #3498db !important; box-shadow: 0 8px 20px rgba(0,0,0,0.8) !important; max-height: 240px !important; overflow-y: auto !important; }
.CodeMirror-hint { display: block !important; padding: 4px 8px !important; color: #f8f8f2 !important; cursor: pointer !important; }
.CodeMirror-hint:hover, .CodeMirror-hint.CodeMirror-hint-active { background: #3498db !important; color: #fff !important; }
#labMainDashboard .CodeMirror-hints, #labMainDashboard .CodeMirror-hints *, #labMainDashboard .CodeMirror-hint { filter: none !important; text-decoration: none !important; }
.CodeMirror-hints:not(.CodeMirror-hints.hidden) { visibility: visible !important; opacity: 1 !important; display: block !important; }
.CodeMirror-foldmarker { color:#00f; text-shadow:#b9f 1px 1px 2px,#b9f -1px -1px 2px,#b9f 1px -1px 2px,#b9f -1px 1px 2px; font-family:arial; line-height:.3; cursor:pointer }
.CodeMirror-foldgutter { width:.7em }
.CodeMirror-foldgutter-folded,.CodeMirror-foldgutter-open { cursor:pointer }
.CodeMirror-foldgutter-open:after { content:"\\25BE" }
.CodeMirror-foldgutter-folded:after { content:"\\25B8" }
.CodeMirror-cursor { border-left: 2px solid #50fa7b !important; }
.CodeMirror-foldgutter { width: 14px !important; }
.CodeMirror-foldgutter-open, .CodeMirror-foldgutter-folded { cursor: pointer !important; color: #888 !important; font-size: 12px !important; text-align: center !important; line-height: 1.5 !important; }
.CodeMirror-foldgutter-open:hover, .CodeMirror-foldgutter-folded:hover { color: #3498db !important; }
.CodeMirror-foldmarker { color: #3498db !important; background: rgba(52,152,219,0.15) !important; border: 1px solid #3498db !important; border-radius: 3px !important; padding: 0 4px !important; font-family: 'Consolas', monospace !important; font-size: 11px !important; }
// Nạp CSS gốc của CodeMirror Fold .CodeMirror-foldgutter { width: 16px !important; text-align: center; }
.CodeMirror-foldgutter-open, .CodeMirror-foldgutter-folded { opacity: 0.4; transition: opacity 0.15s; cursor: pointer; font-size: 0 !important; display: inline-block; width: 12px; height: 12px; line-height: 12px; }
.CodeMirror-gutters:hover .CodeMirror-foldgutter-open, .CodeMirror-gutters:hover .CodeMirror-foldgutter-folded { opacity: 1; }
.CodeMirror-foldgutter-open::after { content: "▾" !important; font-size: 14px !important; color: #6272a4 !important; display: block; }
.CodeMirror-foldgutter-folded::after { content: "▸" !important; font-size: 14px !important; color: #ff79c6 !important; display: block; }
.lab-js-tabs-bar { display: flex; gap: 2px; background: #151515; padding: 3px 4px 0; border-bottom: 1px solid #252525; flex-shrink: 0; align-items: center; }
.lab-js-tab { padding: 4px 10px; font-size: 11px; color: #aaa; background: #1a1a1a; border: 1px solid #333; border-bottom: none; border-radius: 3px 3px 0 0; cursor: pointer; user-select: none; position: relative; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lab-js-tab:hover { background: #252525; color: #ccc; }
.lab-js-tab.active { background: #1e1e1e; color: #3498db; font-weight: bold; border-color: #3498db; }
.lab-js-tab-add { padding: 4px 8px; font-size: 13px; color: #2ecc71; background: transparent; border: 1px dashed #333; border-radius: 3px; cursor: pointer; margin-left: 4px; }
.lab-js-tab-add:hover { background: rgba(46,204,113,0.1); border-color: #2ecc71; }
.lab-js-tab-close { margin-left: 6px; font-size: 10px; color: #888; display: inline-block; }
.lab-js-tab-close:hover { color: #e74c3c; }
.lab-console-output { flex: 1; background: #0d0d0d; border: 1px solid #333; border-radius: 4px; overflow: auto; font-family: 'Consolas', monospace; font-size: 12px; padding: 6px; display: flex; flex-direction: column; }
.lab-log-item { margin-bottom: 4px; padding: 2px 4px; border-bottom: 1px solid #1a1a1a; white-space: pre-wrap; word-break: break-all; flex-shrink: 0; }
.lab-log-error { color: #ff6b6b; background: rgba(255,107,107,0.1); }
.lab-log-return { color: #f1c40f; font-weight: bold; }
@keyframes labFlashSuccess { 0% { background-color: rgba(39, 174, 96, 0.4); }
100% { background-color: #0d0d0d; }
}
@keyframes labFlashError { 0% { background-color: rgba(192, 41, 43, 0.4); }
100% { background-color: #0d0d0d; }
}
.flash-success { animation: labFlashSuccess 0.8s ease-out; }
.flash-error { animation: labFlashError 0.8s ease-out; }
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
#panelSnifferLab.lab-sub-select { display: none; }
#panelSnifferLab { z-index: 2147483647!important; }
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
.lab-inspect-layer7 { outline: 2px dashed #d35400 !important; outline-offset: 14px; }
.lab-inspect-layer8 { outline: 2px dashed #c0392b !important; outline-offset: 16px; }
.lab-inspect-layer9 { outline: 2px dashed #16a085 !important; outline-offset: 18px; }
.lab-inspect-layer10 { outline: 2px dashed #8e44ad !important; outline-offset: 20px; }
.lab-pinned-layer7 { outline: 2px solid #d35400 !important; outline-offset: 14px; }
.lab-pinned-layer8 { outline: 2px solid #c0392b !important; outline-offset: 16px; }
.lab-pinned-layer9 { outline: 2px solid #16a085 !important; outline-offset: 18px; }
.lab-pinned-layer10 { outline: 2px solid #8e44ad !important; outline-offset: 20px; }
.mode-vertical-right .lab-panel-title, #panelConsole.lab-panel-header span,.mode-vertical-left .lab-panel-title,.mode-vertical-right #panelConsole span,.mode-vertical-left #panelConsole span,#panelSnifferLab select { DISPLAY: NONE; }
.lab-dashboard-container:not(.lab-fullscreen-mode) #panelConsole.lab-v163-floating-console { height: calc(65vh-120px) !important; top: auto !important; bottom: 0; }
.CodeMirror-vscrollbar { width: 9px !important; }
.CodeMirror-hscrollbar { height: 9px !important; }
.CodeMirror-vscrollbar::-webkit-scrollbar, .CodeMirror-hscrollbar::-webkit-scrollbar { width: 9px !important; height: 9px !important; }
.CodeMirror-vscrollbar::-webkit-scrollbar-thumb, .CodeMirror-hscrollbar::-webkit-scrollbar-thumb { background: #555 !important; border-radius: 4px; }
.CodeMirror-vscrollbar::-webkit-scrollbar-track, .CodeMirror-hscrollbar::-webkit-scrollbar-track { background: #1a1a1a !important; }
.CodeMirror-vscrollbar::-webkit-scrollbar-thumb { background: #555 !important; border-radius: 4px; min-height: 30px !important; }
.CodeMirror-hscrollbar::-webkit-scrollbar-thumb { background: #555 !important; border-radius: 4px; min-width: 30px !important; }
.lab-panel-body::-webkit-scrollbar, .lab-console-output::-webkit-scrollbar, #labSnifferBody::-webkit-scrollbar,#labTreeDomBody::-webkit-scrollbar { width: 9px !important; height: 9px !important; }
.lab-panel-body::-webkit-scrollbar-track, .lab-console-output::-webkit-scrollbar-track, #labSnifferBody::-webkit-scrollbar-track,#labTreeDomBody::-webkit-scrollbar-track { background: #1a1a1a !important; }
.lab-panel-body::-webkit-scrollbar-thumb, .lab-console-output::-webkit-scrollbar-thumb, #labSnifferBody::-webkit-scrollbar-thumb,#labTreeDomBody::-webkit-scrollbar-thumb { background: #555 !important; border-radius: 4px; min-height: 30px !important; min-width: 30px !important; }
body.lab-fullscreen-locked { overflow: hidden !important; }
.lab-draggable-panel { box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important; border: 2px solid #e74c3c !important; }
.lab-dashboard-container:not(.lab-fullscreen-mode) #panelConsole.lab-v163-floating-console { height: calc(65vh-120px) !important; top: auto !important; bottom: 0; }
#panelConsole.lab-panel.lab-panel-maximized.lab-panel-hidden { display: none!important; }
.lab-tree-sync-highlight { background-color: rgba(46, 204, 113, 0.4) !important; outline: 2 px dashed #e74c3c!important; outline-offset: 2 px; }
.lab-cm-error-line { background-color: rgba(231, 76, 60, 0.3)!important; }
.lab-error-line-link: hover { color: #fff!important; text-decoration: none!important; }
.lab-overlay-blocker { position: fixed; top: 0; left: 0; width: 100 %; height: 100 %; z-index: 999999; background: transparent; pointer-events: none; display: none; }
.lab-overlay-blocker.active { display: block; pointer-events: all; }
.lab-dashboard-container.mode-horizontal.lab-fullscreen-mode { height: 85vh!important; }
.lab-log-info { color:white!important }
#labCssExtractMenu .lab-inspect-parent, #labCssExtractMenu .lab-inspect-child, #labCssExtractMenu .lab-inspect-grand, #labCssExtractMenu .lab-inspect-child::before, #labCssExtractMenu .lab-inspect-parent::before, #labCssExtractMenu .lab-inspect-grand::before, #labCssExtractMenu.lab-inspect-parent, #labCssExtractMenu.lab-inspect-child, #labCssExtractMenu.lab-inspect-grand, #labCssExtractMenu.lab-inspect-child::before, #labCssExtractMenu.lab-inspect-parent::before, #labCssExtractMenu.lab-inspect-grand::before { outline: none!important; ; border: none!important; }
.lab-sub-select, .lab-select-size { visibility: visible !important; opacity: 1 !important; display: inline-block !important; filter: none !important; color-scheme: dark !important; flex-shrink: 0 !important; flex-grow: 0 !important; width: 85px !important; min-width: 85px !important; height: 22px !important; box-sizing: border-box !important; appearance: none !important; -moz-appearance: none !important; -webkit-appearance: none !important; background-color: #151515 !important; color: #50fa7b !important; border: 1px solid #3498db !important; font-size: 11px !important; font-weight: bold !important; padding: 1px 18px 1px 6px !important; border-radius: 3px !important; cursor: pointer !important; outline: none !important; margin-right: 4px !important; background-image: url("data:image/svg+xml; charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2350fa7b'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e") !important; background-repeat: no-repeat !important; background-position: right 2px center !important; background-size: 12px !important; }
.lab-sub-select option, .lab-select-size option { background-color: #151515 !important; color: #50fa7b !important; }
.lab-sub-select option, .lab-select-size option { background-color: #151515 !important; color: #50fa7b !important; }
.lab-dashboard-container .cm-editor *, .lab-dashboard-container .CodeMirror * { box-sizing: content-box !important; }
.cm-scroller { overflow-x: auto !important; display: block !important; }
.CodeMirror-scroll { overflow-x: auto !important; }

        `;
            document.head.appendChild(styleElement);

            const originalBodyStyle = {
                width: $('html').css('width'),
                overflowX: $('html').css('overflow-x')
            };
            /* === End Module CSS Injection (High-Contrast Engine & CodeMirror): 475 === */
            /* === Begin Module HTML Dashboard Structure: 476 === */
            // ==========================================
            // 2. KHỞI TẠO CẤU TRÚC HTML DASHBOARD
            // ==========================================
            const dashboardHtml = `<div class="lab-fab-wrapper"><button class="lab-fab-main" id="labFabBtn" title="Chuột trái: Đóng/Mở | Click Phải x1: Xuống đáy | Click Phải x2: Lên đỉnh">+</button></div>

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
                            <span class="lab-panel-title">DOM</span>
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
                                <!--
                                <button class="lab-geo-btn" id="geoBtnReverseDown" style="background:#00cec9; color:#000; margin-bottom:2px; margin-left:4px; border: 1px solid #fff;" title="Đảo chiều: Đi xuống lớp con liền kề">⬇️ </button>
                                -->
                            </div>
                            <div id="labTreeDomBody" style="background:#151515; color:#abb2bf; padding:6px; flex:1; overflow:auto; border-radius:4px; font-size:11px;">
                                <span style="color:#666; font-style:italic;"></span>
                            </div>
                        </div>
                    </div>

                    <div class="lab-panel" id="panelCss">
                        <div class="lab-panel-header">
                            <span class="lab-panel-title">CSS</span>
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
                                <button class="lab-mini-btn lab-btn-wrap active" data-target="css" title="Bật/Tắt Wrap">↩️</button>
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
                            <span class="lab-panel-title">RUN</span>
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
                                <button class="lab-mini-btn lab-btn-wrap active" data-target="js" title="Bật/Tắt Wrap">↩️</button>
                                <button class="lab-mini-btn btn-success" id="labBtnRunJs" style="margin-right:4px;">▶ </button>
                                <button class="lab-mini-btn" id="labBtnBeautifyJs" title="Làm đẹp code JS">✨</button>
                                <button class="lab-mini-btn" id="labBtnOutdentJs" title="Outdent 1 cấp">⬅️</button>
                                <button class="lab-mini-btn lab-btn-max" data-target="#panelJs">🔲 </button>
                                <button class="lab-mini-btn btn-danger" id="labBtnClearJs">Xóa</button>
                                <button class="lab-mini-btn lab-btn-toggle" data-target="#panelJs">Ẩn</button>
                            </div>
                        </div>
                        <div class="lab-panel-body">
                            <div class="lab-js-tabs-bar" id="labJsTabsBar"></div>
                            <div class="lab-editor-container">
                                <textarea id="labJsInput" placeholder="// Viết code jQuery/JS... Ấn Ctrl + Enter để thực thi"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="lab-panel" id="panelConsole">
                        <div class="lab-panel-header">
                            <span style="color:#f1c40f; font-weight:bold;">CONSOLE</span>
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
            let savedTarget = null,
                savedParent = null,
                savedGrand = null;
            let isSandboxModeActive = false;
            let currentGeoDepth = 0;

            function escapeHtml(str) {
                return str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
            }
            /* === End Module HTML Dashboard Structure: 627 === */
            /* === Begin Module Events & LocalStorage State Manager: 628 === */
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
                setTimeout(() => {
                    updateScreenSplitting();
                }, 200);
            }

            $jsInput.on('input', function() {
                const val = $(this).val();
                localStorage.setItem('lab_saved_js', val);
                if (window.__labJsTabs && window.__labJsTabs[window.__labJsActiveTab]) {
                    window.__labJsTabs[window.__labJsActiveTab].content = val;
                    try {
                        localStorage.setItem('lab_js_tabs', JSON.stringify(window.__labJsTabs));
                    } catch (e) {}
                }
            });
            $cssInput.on('input', function() {
                const currentVal = $(this).val();
                localStorage.setItem('lab_saved_css', currentVal);
                if (!isSandboxModeActive) {
                    $('#lab-dynamic-live-css').text(currentVal);
                } else {
                    if ($sandboxIframe[0].contentWindow) {
                        $sandboxIframe[0].contentWindow.postMessage({
                            type: 'LAB_LIVE_CSS',
                            css: currentVal
                        }, '*');
                    }
                }
            });
            /* === End Module Events & LocalStorage State Manager: 665 === */
            /* === Begin Module Console Override & Logging: 666 === */
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
            /* === End Module Console Override & Logging: 686 === */
            /* === Begin Module Object Tree Renderer: 687 === */
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
                        } catch (e) {}
                    });
                } catch (e) {
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
            /* === End Module Object Tree Renderer: 740 === */
            /* === Begin Module PostMessage Sandbox Communication: 741 === */
            // ==========================================
            // 6. KÊNH GIAO TIẾP VỚI SANDBOX BẰNG POSTMESSAGE
            // ==========================================
            window.addEventListener('message', function(event) {
                const data = event.data;
                if (!data || typeof data !== 'object') return;

                if (data.type === 'LAB_SANDBOX_LOG') {
                    window.__labAppendLog(data.msg, data.logType);
                } else if (data.type === 'LAB_SANDBOX_OBJECT_TREE') {
                    const $treeNodeElement = window.__labBuildObjectTreeElement(data.obj, null);
                    $treeNodeElement.addClass('lab-log-item').css({
                        'padding-left': '14px',
                        'border-bottom': '1px solid #1a1a1a',
                        'margin-bottom': '4px'
                    });
                    $('#labConsoleLogBody').prepend($treeNodeElement).addClass('flash-success').scrollTop(0);
                } else if (data.type === 'LAB_SANDBOX_DOM_REPLY') {
                    $treeDomBody.find('.tree-node, div').remove();
                    if (data.html) {
                        $familyTreeBar.css('display', 'flex');
                        $treeDomBody.html(data.html);
                    }
                }
            });
            /* === End Module PostMessage Sandbox Communication: 765 === */
            /* === Begin Module Sandbox Environment Initialization: 766 === */
            // ==========================================
            // 7. KHỞI TẠO MÔI TRƯỜNG SANDBOX CÔ LẬP
            // ==========================================
            $('#labBtnSourceSandbox').on('click', function() {
                if (!isSandboxModeActive) {
                    window.__labAppendLog("⏳ Đang fetch mã nguồn Raw HTML nguyên bản từ Server...", "log");

                    fetch(window.location.href, {
                            cache: "no-store"
                        })
                        .then(response => response.text())
                        .then(rawHtmlCode => {
                            const clientSandboxControllerScript = `<script>
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

                            const blob = new Blob([rawHtmlCode + clientSandboxControllerScript], {
                                type: 'text/html'
                            });
                            $sandboxIframe.attr('src', URL.createObjectURL(blob));

                            $sandboxIframe.show();
                            $('body').addClass('lab-active-sandbox-mode');
                            isSandboxModeActive = true;
                            isInspectEnabled = true;

                            $('#labBtnSourceSandbox').text('🔓').css('background', '#e67e22');

                            setTimeout(() => {
                                if ($sandboxIframe[0].contentWindow) $sandboxIframe[0].contentWindow.postMessage({
                                    type: 'LAB_LIVE_CSS',
                                    css: $cssInput.val()
                                }, '*');
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
            /* === End Module Sandbox Environment Initialization: 912 === */
            /* === Begin Module JavaScript Dynamic Execution Engine: 913 === */
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

                    return {
                        translated,
                        suggestion
                    };
                };
            }
            // [2] Hàm thực thi chính
            async function executeJsEngine() {
                let userCode = '';
                if (window.__labJsEditor && window.__labJsTabs) {
                    // Save current tab first
                    window.__labJsTabs[window.__labJsActiveTab].content = window.__labJsEditor.getValue();
                    // Concatenate all tabs
                    userCode = window.__labJsTabs.map(t => t.content).join('\n\n');
                } else {
                    userCode = window.__labJsEditor ? window.__labJsEditor.getValue() : $('#labJsInput').val();
                }
                if (!userCode || !userCode.trim()) return;

                const $consoleBox = $('#labConsoleLogBody');
                $consoleBox.removeClass('flash-success flash-error');

                try {
                    window.outerHTML = document.getElementsByTagName("html")[0].outerHTML;
                } catch (e) {
                    console.error("Không thể gán outerHTML toàn cục:", e);
                }

                try {
                    // 🚀 ĐƯỜNG DẪN ĐẾN FILE BẠN VỪA LƯU Ở BƯỚC 1 (Hãy đổi lại link này cho đúng cấu trúc web của bạn)
                    const helperUrl = 'https://rawcdn.githack.com/alokillgtv-gif/VAXAPPSCRIPT/2ed43c93c2e9b694a3f7b3e73d6dfba60f56cfbd/miniJQ.js';

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
                            $sandboxIframe[0].contentWindow.postMessage({
                                type: 'LAB_EXECUTE_JS',
                                base64: base64Code
                            }, '*');
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
                    let targetLine = line - 1; // CodeMirror tính dòng từ 0

                    window.__labJsEditor.setCursor(targetLine, 0);
                    window.__labJsEditor.focus();

                    // Tự động cuộn Editor ra giữa màn hình
                    let charCoords = window.__labJsEditor.charCoords({
                        line: targetLine,
                        ch: 0
                    }, "local");
                    let middleHeight = window.__labJsEditor.getScrollerElement().offsetHeight / 2;
                    window.__labJsEditor.scrollTo(null, charCoords.top - middleHeight - 5);

                    // Đánh dấu đỏ dòng bị lỗi trong 1.5s
                    window.__labJsEditor.addLineClass(targetLine, 'background', 'CodeMirror-selected');
                    setTimeout(() => window.__labJsEditor.removeLineClass(targetLine, 'background', 'CodeMirror-selected'), 1500);
                }
            });

            $(document).on('click', '#labBtnRunJs', function(e) {
                e.preventDefault();
                executeJsEngine();
            });
            $jsInput.on('keydown', function(e) {
                if (e.ctrlKey && (e.key === 'Enter' || e.keyCode === 13 || e.key === 'Space')) {
                    e.preventDefault();
                    executeJsEngine();
                }
            });
            /* === End Module JavaScript Dynamic Execution Engine: 1112 === */
            /* === Begin Module DOM Inspector (Main Environment): 1113 === */
            // ==========================================
            // 9. TRÌNH QUAN SÁT DOM (INSPECTOR Ở MAIN ENVIRONMENT)
            // ==========================================

            function buildDomTreeMain(node) {
                if (node.nodeType === 3) {
                    const text = node.nodeValue.trim();
                    return text ? $('<div>').addClass('tree-node').html(`<span class="html-text">${escapeHtml(text)}</span>`) : null;
                }
                if (node.nodeType === 1) {
                    // [UPDATE] Fix lỗi hắt highlight viền cho panel Sniffer quick-extract-modal #labHtmlSourceModal
                    if ($(node).closest('#labHtmlSourceModal').length || $(node).closest('#quick-extract-modal').length || $(node).closest('#labMainDashboard').length || $(node).hasClass('lab-fab-wrapper') || $(node).is('#labSandboxIframe') || $(node).closest('#labCssQuickMenu').length || $(node).hasClass('CodeMirror-hints') || $(node).closest('#panelSnifferLab').length) return null;

                    const tagName = node.tagName.toLowerCase();
                    let attrStr = '';
                    if (node.attributes) {
                        for (let i = 0; i < node.attributes.length; i++) {
                            let attr = node.attributes[i];
                            if (attr.name.startsWith('lab-')) continue;
                            attrStr += ` <span class="html-attr">${attr.name}</span>=<span class="html-bracket">"</span><span class="html-val">${escapeHtml(attr.value)}</span><span class="html-bracket">"</span>`;
                        }
                    }

                    // Lưu trữ tham chiếu node thật vào biến data jQuery
                    let $container = $('<div>').addClass('tree-node').data('real-node', node);

                    let $toggle = $('<span>').addClass('tree-toggle').html('▼ ').css('cursor', 'pointer');
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

                // Xóa trắng cây cũ để nạp cây mới
                $treeDomBody.find('.tree-node, div').remove();
                let $tree = buildDomTreeMain(element);
                if ($tree) $treeDomBody.append($tree);

                // [TÍCH HỢP] Reset trạng thái nút của bạn về trạng thái mặc định (chưa thu gọn) mỗi khi soi phần tử mới
                $('#labBtnCollapseAllTree').html('⤓ ').data('collapsed', false);
            }

            // 1. Xử lý click đóng/mở riêng lẻ cho từng dấu mũi tên đầu dòng (▼ / ►)
            $(document).off('click.labDOMInspector', '.tree-toggle').on('click.labDOMInspector', '.tree-toggle', function(e) {
                e.stopPropagation();
                const $toggle = $(this);
                const $children = $toggle.siblings('.tree-children');

                if ($toggle.text().includes('▼')) {
                    $children.hide();
                    $toggle.html('► ');
                } else {
                    $children.show();
                    $children.children('.tree-node').show(); // Hiện lại toàn bộ các con trực tiếp bao gồm cả text node
                    $toggle.html('▼ ');
                }
            });

            // 2. [TÍCH HỢP] Xử lý click đóng/mở ĐỒNG LOẠT vào nút có sẵn của bạn (#labBtnCollapseAllTree)

            $(document).off('click.labDOMInspector', '#labBtnCollapseAllTree').on('click.labDOMInspector', '#labBtnCollapseAllTree', function(e) {
                e.stopPropagation();
                const $btn = $(this);
                const isCollapsed = $btn.data('collapsed') || false;

                if (!isCollapsed) {
                    // TIẾN HÀNH THU GỌN THÔNG MINH (Giữ khung xương, ẩn text node và thu gọn thẻ lá)
                    $treeDomBody.find('.tree-node').each(function() {
                        const $node = $(this);
                        const $toggle = $node.children('.tree-toggle');
                        const $children = $node.children('.tree-children');

                        if ($toggle.length > 0) { // Định dạng thẻ HTML Element
                            const hasChildElements = $children.find('.tree-toggle').length > 0;
                            if (!hasChildElements) {
                                // Là thẻ cuối cùng (thẻ lá) -> Thu gọn hẳn thành 1 dòng
                                $children.hide();
                                $toggle.html('► ');
                            } else {
                                // Là thẻ chứa cấu trúc -> Giữ hiển thị bộ khung
                                $children.show();
                                $toggle.html('▼ ');
                            }
                        } else if ($node.find('.html-text').length > 0) {
                            // Ẩn bớt các chuỗi text thuần để cây DOM nhìn gọn gàng
                            $node.hide();
                        }
                    });
                    // Đổi icon thành mũi tên hướng lên (biểu thị click tiếp theo sẽ mở rộng ra)
                    $btn.html('⤒ ').data('collapsed', true);
                } else {
                    // TIẾN HÀNH MỞ RỘNG TOÀN BỘ TRỞ LẠI NHƯ BAN ĐẦU
                    $treeDomBody.find('.tree-node').show();
                    $treeDomBody.find('.tree-children').show();
                    $treeDomBody.find('.tree-toggle').html('▼ ');
                    // Trả lại icon ban đầu của bạn
                    $btn.html('⤓ ').data('collapsed', false);
                }
            });

            $(document).on('mouseover', function(e) {
                if (!isInspectEnabled || isSandboxModeActive) return;
                // [UPDATE] Bỏ qua Sniffer quick-extract-modal
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
                if ($(e.target).closest('#labHtmlSourceModal').length || $(e.target).closest('#labMainDashboard').length || $(e.target).hasClass('lab-fab-wrapper') || $(e.target).is('#labSandboxIframe') || $(e.target).closest('#labCssQuickMenu').length || $(e.target).hasClass('CodeMirror-hints') || $(e.target).closest('#panelSnifferLab').length || $(e.target).closest('#labTreeDomBody').length) return;
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
                    if ($grand.length && !$grand.is('html, body')) $grand.addClass('lab-inspect-grand');
                }
                $familyTreeBar.css('display', 'flex');
                loadElementToTreeMain(savedTarget);
                $('#panelJs .lab-sub-select').val('#panelTreeDom').trigger('change')
            };
            /* === End Module DOM Inspector (Main Environment): 1205 === */

            /* === Begin Module Quick Hide Element (Right Click): 1206 === */
            // --- MODULE: QUICK HIDE ELEMENT (RIGHT CLICK) ---
            $('body').append('<div id="lab-quick-hide-menu" style="display:none; position:fixed; background:#e74c3c; color:#fff; padding:6px 12px; border-radius:4px; font-size:12px; font-weight:bold; cursor:pointer; z-index:2147483647; box-shadow:0 4px 10px rgba(0,0,0,0.5);">🚫 Ẩn phần tử này</div>');

            $(document).on('contextmenu', function(e) {
                // Không chặn contextmenu ở trong bảng điều khiển
                if ($(e.target).closest('#labMainDashboard, #labHtmlSourceModal, #panelSnifferLab').length) return;

                // Nếu Inspect chưa bật thì bỏ qua
                if (!isInspectEnabled || isSandboxModeActive) return;

                let targetEl = e.target;
                $('#lab-quick-hide-menu').css({
                    top: e.clientY + 10 + 'px',
                    left: e.clientX + 10 + 'px'
                }).show().off('click').on('click', function(ev) {
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
                if (isSandboxModeActive) {
                    if ($sandboxIframe[0].contentWindow) {
                        $sandboxIframe[0].contentWindow.postMessage({
                            type: 'LAB_GEO_INSPECT_REQUEST',
                            geoMode: mode
                        }, '*');
                    }
                } else {
                    if (mode === 'target') {
                        loadElementToTreeMain(savedTarget);
                    } else if (mode === 'parent' && savedParent) {
                        loadElementToTreeMain(savedParent);
                    } else if (mode === 'grand' && savedGrand) {
                        loadElementToTreeMain(savedGrand);
                    }
                }
            }
            /* === End Module Quick Hide Element (Right Click): 1262 === */
            /* === Begin Module Family Tree Navigation (10 Levels): 1263 === */
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
                        $sandboxIframe[0].contentWindow.postMessage({
                            type: 'LAB_GEO_INSPECT_REQUEST',
                            geoMode: mode
                        }, '*');
                    }
                    return;
                }

                // 2. Chế độ Gốc (Main Environment)
                if (!savedTarget) return;

                const depthMap = {
                    'target': 0,
                    'parent': 1,
                    'grand': 2,
                    'greatgrand': 3,
                    'greatgreatgrand': 4,
                    'ancestors': 5,
                    'layer7': 6,
                    'layer8': 7,
                    'layer9': 8,
                    'layer10': 9
                };

                // Logic đảo chiều (đi xuống lớp con) hoặc chọn trực tiếp độ sâu theo Lớp
                if (mode === 'down') {
                    currentGeoDepth = Math.max(0, currentGeoDepth - 1);
                } else {
                    currentGeoDepth = depthMap[mode] !== undefined ? depthMap[mode] : 0;
                }

                let targetNode = savedTarget;
                for (let i = 0; i < currentGeoDepth; i++) {
                    if (targetNode.parentElement) {
                        targetNode = targetNode.parentElement;
                    }
                }

                // [PERF] Chỉ xóa class từ node đã được highlight trước đó, không quét toàn bộ DOM
                $('.lab-highlighted-node').removeClass('lab-pinned-child lab-pinned-parent lab-pinned-grand lab-pinned-great-grand lab-pinned-great-great-grand lab-pinned-ancestors lab-pinned-layer7 lab-pinned-layer8 lab-pinned-layer9 lab-pinned-layer10 lab-highlighted-node');

                const classes = [
                    'lab-pinned-child', 'lab-pinned-parent', 'lab-pinned-grand',
                    'lab-pinned-great-grand', 'lab-pinned-great-great-grand', 'lab-pinned-ancestors',
                    'lab-pinned-layer7', 'lab-pinned-layer8', 'lab-pinned-layer9', 'lab-pinned-layer10'
                ];
                $(targetNode).addClass(classes[currentGeoDepth] || 'lab-pinned-ancestors').addClass('lab-highlighted-node');

                if (typeof window.__labRenderMainTree === 'function') {
                    window.__labRenderMainTree(targetNode);
                } else if (typeof buildDomTreeMain === 'function') {
                    $treeDomBody.empty().append(buildDomTreeMain(targetNode));
                }
            });
            /* === End Module Family Tree Navigation (10 Levels): 1331 === */
            /* === Begin Module UI & Resize Panel Manager: 1332 === */
            // ==========================================
            // 10. QUẢN LÝ GIAO DIỆN VÀ RESIZE PANEL
            // ==========================================
            function updateScreenSplitting() {
                if ($dashboard.is(':hidden')) {
                    $('html').css({
                        'width': originalBodyStyle.width,
                        'overflow-x': originalBodyStyle.overflowX,
                        'margin-left': ''
                    });
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
                    $('html').css({
                        'width': '100vw',
                        'overflow-x': originalBodyStyle.overflowX,
                        'margin-left': ''
                    });
                    let dashHeight = isFull ? 0 : (($dashboard.outerHeight()) + 10);
                    var viewportHeight = $(window).height();

                    // Chuyển đổi giá trị (dashHeight / 2) từ px sang vh
                    var vhValue = ((dashHeight / 2) / viewportHeight) * 100;

                    // Áp dụng vào CSS bằng đơn vị vh
                    $('html, body').css('padding-bottom', vhValue + 'vh');
                } else {
                    $('html, body').css('padding-bottom', '');
                    $('html').css({
                        'width': isFull ? '0vw' : '65vw',
                        'margin-left': (layoutState === 'vertical-left' && !isFull) ? '35vw' : '',
                        'overflow-x': 'hidden'
                    });
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
            /* === End Module UI & Resize Panel Manager: 1441 === */
            /* === Begin Module Draggable FAB Button: 1442 === */
            // --- MODULE: DRAGGABLE FAB ---
            let isFabDragging = false;
            const $fabWrapper = $('.lab-fab-wrapper');

            $fabWrapper.on('mousedown', function(e) {
                if (e.which !== 1) return; // Chỉ kéo bằng chuột trái
                e.preventDefault();
                isFabDragging = false;
                let startX = e.clientX,
                    startY = e.clientY;
                let startPos = $fabWrapper.offset();
                let scrollX = $(window).scrollLeft(),
                    scrollY = $(window).scrollTop();

                // Đổi sang position fixed để kéo theo màn hình
                $fabWrapper.css({
                    right: 'auto',
                    bottom: 'auto',
                    left: (startPos.left - scrollX) + 'px',
                    top: (startPos.top - scrollY) + 'px'
                });

                $(window).on('mousemove.fabDrag', function(moveEvent) {
                    isFabDragging = true;
                    let dx = moveEvent.clientX - startX;
                    let dy = moveEvent.clientY - startY;
                    $fabWrapper.css({
                        left: (startPos.left - scrollX + dx) + 'px',
                        top: (startPos.top - scrollY + dy) + 'px'
                    });
                });

                $(window).on('mouseup.fabDrag', function() {
                    $(window).off('mousemove.fabDrag mouseup.fabDrag');
                });
            });
            // Long-press reset for FAB button
            let fabResetTimer = null;
            let fabResetTriggered = false;
            $fabBtn.on('mousedown touchstart', function(e) {
                if (isFabDragging) return;
                fabResetTriggered = false;
                fabResetTimer = setTimeout(() => {
                    fabResetTriggered = true;
                    // Destroy all lab DOM structures before reload
                    $('#labMainDashboard, .lab-fab-wrapper, #interactive-dashboard-styles-v15-0, #lab-dynamic-live-css, #labSandboxIframe, #labCssExtractMenu, #lab-overlay-blocker, .lab-token-pointer-style').remove();
                    $('body').removeClass('lab-active-sandbox-mode lab-fullscreen-locked');
                    localStorage.clear();
                    $fabBtn.text('↻').css('background-color', '#9b59b6');
                    location.reload();
                }, 2500);
            });
            $fabBtn.on('mouseup mouseleave touchend', function(e) {
                if (fabResetTimer) {
                    clearTimeout(fabResetTimer);
                    fabResetTimer = null;
                }
            });

            $fabBtn.on('click', function(e) {
                if (isFabDragging || fabResetTriggered) {
                    fabResetTriggered = false;
                    return;
                }
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
                setTimeout(() => {
                    updateScreenSplitting();
                }, 50); // [UPDATE] Đợi DOM render để js đo được height chính xác
            });
            /* === End Module Draggable FAB Button: 1507 === */
            /* === Begin Module FAB Right-Click Scroll Handler: 1508 === */
            // [NEW] Chức năng Right-Click trên nút FAB để scroll trang Web
            let fabRightClickTimer = null;
            let fabRightClickCount = 0;
            $fabBtn.on('contextmenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                fabRightClickCount++;
                if (fabRightClickCount === 1) {
                    fabRightClickTimer = setTimeout(() => {
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: 'smooth'
                        }); // x1 Xuống đáy
                        fabRightClickCount = 0;
                    }, 250);
                } else if (fabRightClickCount >= 2) {
                    clearTimeout(fabRightClickTimer);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    }); // x2 Lên đỉnh
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
                if (isSandboxModeActive) {
                    if ($sandboxIframe[0].contentWindow) $sandboxIframe[0].contentWindow.postMessage({
                        type: 'LAB_LIVE_CSS',
                        css: ''
                    }, '*');
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
                    if (isX) {
                        $panel.css('width', (startWidth + (moveEvent.clientX - startX)) + 'px');
                    } else {
                        $panel.css('height', (startHeight + (moveEvent.clientY - startY)) + 'px');
                    }
                    if (window.__labJsEditor) window.__labJsEditor.refresh();
                    if (window.__labCssEditor) window.__labCssEditor.refresh();
                });

                $(document).on('mouseup.lab-resize', function() {
                    $(document).off('mousemove.lab-resize mouseup.lab-resize');
                });
            });
            /* === End Module FAB Right-Click Scroll Handler: 1579 === */
            /* === Begin Module Panel Drag & Drop (Free Move): 1580 === */
            // [NEW] Cho phép 4 ô panel còn lại Kéo Thả tùy ý khi Mousedown vào Header
            $('.lab-panel-header').on('mousedown.labPanelDragFree', function(e) {
                const $panel = $(this).closest('.lab-panel');
                if ($panel.is('#panelSnifferLab')) return; // Sniffer đã có cơ chế Drag riêng
                if ($(e.target).closest('button, select, input, .lab-panel-actions').length) return; // Không drag nếu bấm nhầm vào nút con

                e.preventDefault();
                e.stopPropagation();
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
                const rect = $panel[0].getBoundingClientRect();
                const startX = e.clientX,
                    startY = e.clientY;
                const startLeft = rect.left,
                    startTop = rect.top;

                $(window).on('mousemove.labPanelMoveFree', function(moveEvent) {
                    $panel.css({
                        left: (startLeft + moveEvent.clientX - startX) + 'px',
                        top: (startTop + moveEvent.clientY - startY) + 'px',
                        right: 'auto',
                        bottom: 'auto'
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
                    'position': '',
                    'width': '',
                    'height': '',
                    'top': '',
                    'left': '',
                    'zIndex': '',
                    'right': '',
                    'bottom': ''
                });

                $layoutEngine.removeClass('is-custom-resized');
                $('.lab-panel').css({
                    'width': '',
                    'height': ''
                });
                if (window.__labJsEditor) window.__labJsEditor.refresh();
                if (window.__labCssEditor) window.__labCssEditor.refresh();
                setTimeout(syncSnifferLayout, 60);
            });
            /* === End Module Panel Drag & Drop (Free Move): 1629 === */
            /* === Begin Module Smart CSS Grouping & Quick-Option Popover: 1630 === */
            // ==========================================
            // 11. EXTENSION ULTRA V4.2: SMART CSS GROUPING & QUICK-OPTION POPOVER
            // ==========================================
            const $treeDomHeaderActions = $('#panelTreeDom .lab-panel-actions');
            $('#labBtnExtractMeta').remove();
            const $btnExtractMeta = $('<button class="lab-mini-btn btn-success" id="labBtnExtractMeta" style="margin-right: 4px;" title="Trích xuất Meta/Link">📋 </button>');
            $treeDomHeaderActions.prepend($btnExtractMeta);

            // [NEW] Collapse/Expand All for Tree DOM
            $('#labBtnCollapseAllTree').remove();

            function copyToClipboard(text) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).catch(err => {
                        console.error("Lỗi sao chép nhanh: ", err);
                    });
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
                if (logText) {
                    copyToClipboard(logText);
                    const $btn = $(this);
                    $btn.text('✔️').css('background', '#27ae60');
                    setTimeout(() => $btn.text('📋').css('background', '#0984e3'), 2000);
                }
            });

            $('#labCssQuickMenu').remove();
            const $quickMenu = $(`<div id="labCssQuickMenu" style="position: fixed; display: none; z-index: 2147483647; background: #1e1e1e; border: 1px solid #3498db; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.85); min-width: 240px; font-family: 'Segoe UI', sans-serif; font-size: 12px; overflow: hidden; user-select: none; pointer-events: auto;"><div style="background: #252525; padding: 6px 10px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;"><span style="color: #f1c40f; font-weight: bold;">⚡ QUICK CSS LAB</span><span id="labQuickMenuTarget" style="color: #50fa7b; font-family: monospace; font-weight: bold; background: #111; padding: 2px 6px; border-radius: 3px;"></span></div><div id="labQuickMenuList" style="max-height: 260px; overflow-y: auto; padding: 4px 0;"></div></div>`);
            $('body').append($quickMenu);

            const quickCssOptions = [{
                    name: "👁️ Ẩn phần tử",
                    css: "display: none !important;"
                },
                {
                    name: "👁️ Hiện phần tử",
                    css: "display: block !important;"
                },
                {
                    name: "⬛ Nền đen",
                    css: "background: black !important;"
                },
                {
                    name: "🔤 Chữ đen",
                    css: "color: black !important;"
                },
                {
                    name: "👻 Trong suốt",
                    css: "opacity: 0 !important;"
                },
                {
                    name: "🔍 Ẩn chữ (Size 0)",
                    css: "font-size: 0 !important;"
                },
                {
                    name: "🔤 Chữ 16px",
                    css: "font-size: 16px !important;"
                },
                {
                    name: "🔤 Chữ 22px",
                    css: "font-size: 22px !important;"
                }
            ];

            const $menuList = $quickMenu.find('#labQuickMenuList');
            quickCssOptions.forEach(opt => {
                const $item = $(`<div class="lab-quick-item" style="padding: 6px 12px; color: #ddd; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; transition: background 0.15s;"><span>${opt.name}</span><code style="color: #8be9fd; font-size: 11px; background: #111; padding: 2px 5px; border-radius: 3px; font-family: Consolas, monospace;">${opt.css}</code></div>`);
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
            $(document).on('keydown.closeQuickMenu', function(e) {
                if (e.key === 'Escape') $quickMenu.hide();
            });

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

                if (posX + menuW > winW) posX = clientX - menuW - 10;
                if (posY + menuH > winH) posY = winH - menuH - 10;

                $quickMenu.css({
                    top: Math.max(5, posY) + 'px',
                    left: Math.max(5, posX) + 'px'
                });
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
                        if (selectorList.includes(targetSelector)) {
                            foundAndMerged = true;
                            break;
                        }
                        const mergedSelectors = targetSelector + ", " + rawSelectors;
                        const replacedBlock = fullMatch.replace(match[1], mergedSelectors + " ");
                        newCssText = currentCss.substring(0, match.index) + replacedBlock + currentCss.substring(match.index + fullMatch.length);
                        foundAndMerged = true;
                        break;
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
                    if (!$prevAttr.length) {
                        copyToClipboard(rawVal);
                        return;
                    }

                    const attrName = $prevAttr.text().trim().toLowerCase();
                    if (attrName === 'class') {
                        // Chuyển "class1 class2" thành ".class1.class2"
                        const allClass = '.' + rawVal.trim().split(/\s+/).join('.');
                        if (allClass !== '.') targetSelector = allClass;
                    } else if (attrName === 'id') {
                        targetSelector = `#` + rawVal;
                    } else {
                        copyToClipboard(rawVal);
                    }
                } else if ($(this).hasClass('html-attr')) {
                    const attrName = $(this).text().trim().toLowerCase();
                    const $nextVal = $(this).nextAll('.html-val').first();
                    if (!$nextVal.length) {
                        copyToClipboard(attrName);
                        return;
                    }

                    const rawVal = $nextVal.text().trim();
                    if (attrName === 'class') {
                        const firstClass = rawVal.split(/\s+/)[0];
                        if (firstClass) targetSelector = `.` + firstClass;
                    } else if (attrName === 'id') {
                        targetSelector = `#` + rawVal;
                    } else {
                        copyToClipboard(rawVal);
                    }
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
                        if ($sandboxIframe[0].contentWindow.document) targetDocument = $sandboxIframe[0].contentWindow.document;
                    } catch (err) {
                        window.__labAppendLog("⚠️ Khung Sandbox chặn đọc Header, chuyển sang quét DOM môi trường gốc.", "error");
                    }
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
            /* === End Module Smart CSS Grouping & Quick-Option Popover: 1887 === */
            /* === Begin Module DevTools-Style Network Monitor v19: 1888 === */
            // ==========================================
            // 12. EXTENSION PRO++ V19: DEVTOOLS-STYLE NETWORK MONITOR
            // ==========================================
            // CHANGES v19:
            // - 4-Category Grouping: XHR | Resources | Media | Other
            // - Anti-Detection: bypass debugger traps, console detection, visibility checks
            // - Hotkey: Ctrl+L to toggle panel
            // - Panel prepended to body (top layer) + auto-dominate siblings
            // - Z-index 2147483647 with !important enforcement
            // - Passive monitoring (always on)
            // - Captures: XHR, fetch, WebSocket, sendBeacon, images, scripts, CSS, media, fonts
            // - Full request & response headers + body capture
            // - DevTools-style table with sortable columns + detail inspector
            // - Blocked Detection: auto-detect when panel is hidden/removed by website
            // - Recovery Modal: prompt to reset tools or accept being blocked

            // --- ANTI-DETECTION LAYER (protects the whole module) ---
            (function __labAntiDetect() {
                const _origConsole = {
                    log: console.log.bind(console),
                    warn: console.warn.bind(console),
                    error: console.error.bind(console),
                    info: console.info.bind(console),
                    debug: console.debug.bind(console)
                };
                window.__labOrigConsole = _origConsole;

                let _debuggerBypass = false;
                const _origFunction = Function.prototype.constructor;
                try {
                    Function.prototype.constructor = function(...args) {
                        const code = args.join(',');
                        if (code.includes('debugger') && code.length < 200) {
                            _debuggerBypass = true;
                            return function() {};
                        }
                        return _origFunction.apply(this, args);
                    };
                } catch (e) {}

                const _origDefineProperty = Object.defineProperty;
                try {
                    Object.defineProperty = function(obj, prop, desc) {
                        if (obj === console && ['log', 'warn', 'error', 'info', 'debug'].includes(prop)) {
                            return obj;
                        }
                        return _origDefineProperty.call(Object, obj, prop, desc);
                    };
                } catch (e) {}

                const _origAddEventListener = window.addEventListener;
                window.addEventListener = function(type, listener, options) {
                    if (type === 'blur' || type === 'focus' || type === 'visibilitychange') {
                        const wrapped = function(ev) {
                            if (window.__labPanelVisible && type === 'blur') return;
                            return listener.apply(this, arguments);
                        };
                        return _origAddEventListener.call(this, type, wrapped, options);
                    }
                    return _origAddEventListener.apply(this, arguments);
                };

                const _origVisDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState') || Object.getOwnPropertyDescriptor(document, 'visibilityState');
                if (_origVisDesc) {
                    Object.defineProperty(document, 'visibilityState', {
                        get: function() {
                            if (window.__labPanelVisible) return 'visible';
                            return _origVisDesc.get.call(this);
                        },
                        configurable: true
                    });
                }

                const _origHiddenDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden') || Object.getOwnPropertyDescriptor(document, 'hidden');
                if (_origHiddenDesc) {
                    Object.defineProperty(document, 'hidden', {
                        get: function() {
                            if (window.__labPanelVisible) return false;
                            return _origHiddenDesc.get.call(this);
                        },
                        configurable: true
                    });
                }

                try {
                    const _owDesc = Object.getOwnPropertyDescriptor(window, 'outerWidth');
                    const _ohDesc = Object.getOwnPropertyDescriptor(window, 'outerHeight');
                    if (_owDesc) Object.defineProperty(window, 'outerWidth', {
                        get: function() {
                            return window.innerWidth;
                        },
                        configurable: true
                    });
                    if (_ohDesc) Object.defineProperty(window, 'outerHeight', {
                        get: function() {
                            return window.innerHeight;
                        },
                        configurable: true
                    });
                } catch (e) {}

                const _origPerfNow = performance.now.bind(performance);
                let _perfBase = _origPerfNow();
                let _perfFake = _origPerfNow();
                performance.now = function() {
                    const real = _origPerfNow();
                    _perfFake += (real - _perfBase);
                    _perfBase = real;
                    return _perfFake;
                };
            })();

            // --- GLOBAL STATE ---
            if (!window.__labNetworkLog) {
                window.__labNetworkLog = [];
                window.__labNetworkLogMax = 500;
                window.__labNetworkPaused = false;
                window.__labNetworkAutoOpen = false;
                window.__labNetworkFilter = 'all';
                window.__labNetworkSearch = '';
                window.__labNetworkSelectedId = null;
                window.__labNetworkGroup = 'xhr';
                window.__labPanelVisible = false;
            }

            function __labCategorizeEntry(entry) {
                const t = entry.type || 'other';
                const m = (entry.method || 'GET').toUpperCase();
                const url = entry.url || '';
                if (t === 'xhr' || t === 'fetch' || t === 'beacon') return 'xhr';
                if ((m === 'POST' || m === 'PUT' || m === 'PATCH' || m === 'DELETE') && !/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|mp4|mp3|webm|ogg|avi|mov)$/i.test(url)) {
                    return 'xhr';
                }
                if (t === 'media' || /\.(mp4|webm|ogg|mp3|wav|flac|aac|m4a|mov|avi|mkv|flv)$/i.test(url)) return 'media';
                if (t === 'img' || t === 'script' || t === 'css' || t === 'font') return 'resource';
                if (/\.(png|jpg|jpeg|gif|webp|svg|ico|bmp|tiff|js|css|woff|woff2|ttf|eot|otf|pdf|doc|docx|zip|rar|tar|gz)$/i.test(url)) return 'resource';
                return 'other';
            }

            function __labAddNetworkEntry(entry) {
                if (window.__labNetworkPaused) return;
                entry.id = entry.id || (Date.now() + '_' + Math.random().toString(36).substr(2, 9));
                entry.endTime = entry.endTime || performance.now();
                entry.duration = entry.duration || (entry.endTime - entry.startTime);
                entry._group = __labCategorizeEntry(entry);
                window.__labNetworkLog.unshift(entry);
                if (window.__labNetworkLog.length > window.__labNetworkLogMax) {
                    window.__labNetworkLog.pop();
                }

                if (typeof __labRenderNetworkTable === 'function') {
                    __labRenderNetworkTable();
                }
            }

            function __labFormatBytes(bytes) {
                if (bytes === null || bytes === undefined || bytes === 0) return '-';
                if (bytes < 1024) return bytes + ' B';
                if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
                return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
            }

            function __labFormatDuration(ms) {
                if (ms === null || ms === undefined) return '-';
                if (ms < 1000) return Math.round(ms) + ' ms';
                return (ms / 1000).toFixed(2) + ' s';
            }

            function __labStatusColor(status) {
                if (!status || status === 0) return '#e74c3c';
                if (status >= 200 && status < 300) return '#2ecc71';
                if (status >= 300 && status < 400) return '#f39c12';
                if (status >= 400) return '#e74c3c';
                return '#95a5a6';
            }

            function __labMethodColor(method) {
                const colors = {
                    GET: '#3498db',
                    POST: '#2ecc71',
                    PUT: '#f39c12',
                    DELETE: '#e74c3c',
                    PATCH: '#9b59b6',
                    HEAD: '#95a5a6',
                    OPTIONS: '#1abc9c',
                    WS: '#e67e22'
                };
                return colors[method] || '#bdc3c7';
            }

            function __labGroupColor(group) {
                return {
                    xhr: '#3498db',
                    resource: '#2ecc71',
                    media: '#e67e22',
                    other: '#95a5a6'
                } [group] || '#bdc3c7';
            }

            function __labGroupLabel(group) {
                return {
                    xhr: 'XHR/API',
                    resource: 'Resources',
                    media: 'Media',
                    other: 'Other'
                } [group] || group;
            }

            // --- XHR Interceptor ---
            if (!window.__labXhrOverridden) {
                const origOpen = window.XMLHttpRequest.prototype.open;
                const origSend = window.XMLHttpRequest.prototype.send;
                const origSetHeader = window.XMLHttpRequest.prototype.setRequestHeader;

                window.XMLHttpRequest.prototype.open = function(method, url) {
                    this._labNetEntry = {
                        type: 'xhr',
                        method: (method || 'GET').toUpperCase(),
                        url: String(url),
                        startTime: performance.now(),
                        requestHeaders: {},
                        requestBody: null,
                        status: null,
                        statusText: '',
                        responseHeaders: {},
                        responseBody: null,
                        responseType: null,
                        duration: null,
                        size: null,
                        timing: {}
                    };
                    return origOpen.apply(this, arguments);
                };

                window.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
                    if (this._labNetEntry) {
                        this._labNetEntry.requestHeaders[header] = value;
                    }
                    return origSetHeader.apply(this, arguments);
                };

                window.XMLHttpRequest.prototype.send = function(body) {
                    if (this._labNetEntry) {
                        this._labNetEntry.requestBody = body;
                        this._labNetEntry.startTime = performance.now();
                    }
                    const handleLoad = () => {
                        if (!this._labNetEntry) return;
                        const entry = this._labNetEntry;
                        entry.endTime = performance.now();
                        entry.duration = entry.endTime - entry.startTime;
                        entry.status = this.status;
                        entry.statusText = this.statusText;
                        entry.responseType = this.responseType;
                        try {
                            const rawHeaders = this.getAllResponseHeaders();
                            if (rawHeaders) {
                                rawHeaders.split('\r\n').forEach(line => {
                                    const idx = line.indexOf(':');
                                    if (idx > 0) {
                                        entry.responseHeaders[line.substr(0, idx).trim()] = line.substr(idx + 1).trim();
                                    }
                                });
                            }
                        } catch (e) {}
                        try {
                            if (this.responseType === '' || this.responseType === 'text') {
                                entry.responseBody = this.responseText;
                                entry.size = entry.responseBody ? entry.responseBody.length : 0;
                            } else if (this.responseType === 'json') {
                                entry.responseBody = JSON.stringify(this.response, null, 2);
                                entry.size = entry.responseBody.length;
                            } else if (this.responseType === 'blob') {
                                entry.responseBody = '[Blob: ' + (this.response ? this.response.size : 0) + ' bytes]';
                                entry.size = this.response ? this.response.size : 0;
                            } else if (this.responseType === 'arraybuffer') {
                                entry.responseBody = '[ArrayBuffer: ' + (this.response ? this.response.byteLength : 0) + ' bytes]';
                                entry.size = this.response ? this.response.byteLength : 0;
                            } else {
                                entry.responseBody = '[Type: ' + this.responseType + ']';
                            }
                        } catch (e) {
                            entry.responseBody = '[Error reading response]';
                        }
                        __labAddNetworkEntry(entry);
                    };
                    this.addEventListener('load', handleLoad);
                    this.addEventListener('error', () => {
                        if (!this._labNetEntry) return;
                        this._labNetEntry.status = 0;
                        this._labNetEntry.statusText = 'Network Error';
                        this._labNetEntry.endTime = performance.now();
                        this._labNetEntry.duration = this._labNetEntry.endTime - this._labNetEntry.startTime;
                        __labAddNetworkEntry(this._labNetEntry);
                    });
                    this.addEventListener('abort', () => {
                        if (!this._labNetEntry) return;
                        this._labNetEntry.status = 0;
                        this._labNetEntry.statusText = 'Aborted';
                        this._labNetEntry.endTime = performance.now();
                        this._labNetEntry.duration = this._labNetEntry.endTime - this._labNetEntry.startTime;
                        __labAddNetworkEntry(this._labNetEntry);
                    });
                    this.addEventListener('timeout', () => {
                        if (!this._labNetEntry) return;
                        this._labNetEntry.status = 0;
                        this._labNetEntry.statusText = 'Timeout';
                        this._labNetEntry.endTime = performance.now();
                        this._labNetEntry.duration = this._labNetEntry.endTime - this._labNetEntry.startTime;
                        __labAddNetworkEntry(this._labNetEntry);
                    });
                    return origSend.apply(this, arguments);
                };
                window.__labXhrOverridden = true;
            }

            // --- Fetch Interceptor ---
            if (!window.__labFetchOverridden) {
                const origFetch = window.fetch;
                window.fetch = async function(input, init) {
                    const entry = {
                        type: 'fetch',
                        method: 'GET',
                        url: '',
                        startTime: performance.now(),
                        requestHeaders: {},
                        requestBody: null,
                        status: null,
                        statusText: '',
                        responseHeaders: {},
                        responseBody: null,
                        duration: null,
                        size: null,
                        timing: {}
                    };
                    if (typeof input === 'string') {
                        entry.url = input;
                    } else if (input instanceof Request) {
                        entry.url = input.url;
                        entry.method = input.method.toUpperCase();
                        try {
                            input.headers.forEach((v, k) => {
                                entry.requestHeaders[k] = v;
                            });
                        } catch (e) {}
                        try {
                            entry.requestBody = await input.clone().text().catch(() => null);
                        } catch (e) {}
                    } else {
                        entry.url = String(input);
                    }
                    if (init) {
                        if (init.method) entry.method = init.method.toUpperCase();
                        if (init.headers) {
                            try {
                                if (init.headers instanceof Headers) {
                                    init.headers.forEach((v, k) => {
                                        entry.requestHeaders[k] = v;
                                    });
                                } else if (typeof init.headers === 'object') {
                                    Object.assign(entry.requestHeaders, init.headers);
                                }
                            } catch (e) {}
                        }
                        if (init.body) entry.requestBody = init.body;
                    }
                    try {
                        const response = await origFetch.apply(this, arguments);
                        const clone = response.clone();
                        entry.status = response.status;
                        entry.statusText = response.statusText;
                        entry.endTime = performance.now();
                        entry.duration = entry.endTime - entry.startTime;
                        try {
                            response.headers.forEach((v, k) => {
                                entry.responseHeaders[k] = v;
                            });
                        } catch (e) {}
                        try {
                            const text = await clone.text();
                            entry.size = text.length;
                            try {
                                const json = JSON.parse(text);
                                entry.responseBody = JSON.stringify(json, null, 2);
                            } catch (e) {
                                entry.responseBody = text;
                            }
                        } catch (e) {
                            entry.responseBody = '[Unreadable Body]';
                        }
                        __labAddNetworkEntry(entry);
                        return response;
                    } catch (err) {
                        entry.status = 0;
                        entry.statusText = err.name || 'Network Error';
                        entry.endTime = performance.now();
                        entry.duration = entry.endTime - entry.startTime;
                        __labAddNetworkEntry(entry);
                        throw err;
                    }
                };
                window.__labFetchOverridden = true;
            }

            // --- WebSocket Interceptor ---
            if (!window.__labWebSocketOverridden && window.WebSocket) {
                const OriginalWebSocket = window.WebSocket;
                window.WebSocket = function(url, protocols) {
                    const ws = new OriginalWebSocket(url, protocols);
                    const entry = {
                        type: 'websocket',
                        method: 'WS',
                        url: url,
                        startTime: performance.now(),
                        requestHeaders: {
                            'Upgrade': 'websocket',
                            'Connection': 'Upgrade'
                        },
                        requestBody: null,
                        status: 101,
                        statusText: 'Switching Protocols',
                        responseHeaders: {},
                        responseBody: '[WebSocket Connection Established]',
                        duration: null,
                        size: 0,
                        timing: {}
                    };
                    ws.addEventListener('open', () => {
                        entry.endTime = performance.now();
                        entry.duration = entry.endTime - entry.startTime;
                        __labAddNetworkEntry(entry);
                    });
                    ws.addEventListener('message', (e) => {
                        entry.size = (entry.size || 0) + (e.data ? String(e.data).length : 0);
                        if (typeof __labRenderNetworkTable === 'function') __labRenderNetworkTable();
                    });
                    ws.addEventListener('close', () => {
                        entry.statusText = 'Closed';
                        entry.endTime = performance.now();
                        entry.duration = entry.endTime - entry.startTime;
                        if (typeof __labRenderNetworkTable === 'function') __labRenderNetworkTable();
                    });
                    ws.addEventListener('error', () => {
                        entry.status = 0;
                        entry.statusText = 'Error';
                        entry.endTime = performance.now();
                        entry.duration = entry.endTime - entry.startTime;
                        if (typeof __labRenderNetworkTable === 'function') __labRenderNetworkTable();
                    });
                    return ws;
                };
                Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
                Object.setPrototypeOf(window.WebSocket.prototype, OriginalWebSocket.prototype);
                window.__labWebSocketOverridden = true;
            }

            // --- PerformanceObserver for static resources ---
            if (!window.__labPerfObserverStarted && window.PerformanceObserver) {
                try {
                    const perfObserver = new PerformanceObserver((list) => {
                        for (const perfEntry of list.getEntries()) {
                            if (perfEntry.entryType === 'resource') {
                                const existing = window.__labNetworkLog.find(e =>
                                    e.url === perfEntry.name && Math.abs(e.startTime - perfEntry.startTime) < 5 && e.type !== 'xhr' && e.type !== 'fetch'
                                );
                                if (!existing) {
                                    const typeMap = {
                                        'img': 'img',
                                        'image': 'img',
                                        'script': 'script',
                                        'css': 'css',
                                        'link': 'css',
                                        'xmlhttprequest': 'xhr',
                                        'fetch': 'fetch',
                                        'video': 'media',
                                        'audio': 'media',
                                        'track': 'media',
                                        'font': 'font',
                                        'subdocument': 'other'
                                    };
                                    const mappedType = typeMap[perfEntry.initiatorType] || 'other';
                                    __labAddNetworkEntry({
                                        type: mappedType,
                                        method: 'GET',
                                        url: perfEntry.name,
                                        startTime: perfEntry.startTime,
                                        endTime: perfEntry.responseEnd,
                                        requestHeaders: {},
                                        requestBody: null,
                                        status: perfEntry.responseStatus || 200,
                                        statusText: '',
                                        responseHeaders: {},
                                        responseBody: '[Resource loaded via Performance API]',
                                        duration: perfEntry.duration,
                                        size: perfEntry.transferSize || 0,
                                        timing: {
                                            dns: perfEntry.domainLookupEnd - perfEntry.domainLookupStart,
                                            connect: perfEntry.connectEnd - perfEntry.connectStart,
                                            ssl: perfEntry.secureConnectionStart ? (perfEntry.connectEnd - perfEntry.secureConnectionStart) : 0,
                                            ttfb: perfEntry.responseStart - perfEntry.fetchStart,
                                            download: perfEntry.responseEnd - perfEntry.responseStart
                                        }
                                    });
                                }
                            }
                        }
                    });
                    perfObserver.observe({
                        entryTypes: ['resource']
                    });
                    window.__labPerfObserverStarted = true;
                } catch (e) {}
            }

            // --- sendBeacon Interceptor ---
            if (!window.__labBeaconOverridden && navigator.sendBeacon) {
                const origBeacon = navigator.sendBeacon.bind(navigator);
                navigator.sendBeacon = function(url, data) {
                    const entry = {
                        type: 'beacon',
                        method: 'POST',
                        url: url,
                        startTime: performance.now(),
                        requestHeaders: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        requestBody: data,
                        status: 204,
                        statusText: 'No Content',
                        responseHeaders: {},
                        responseBody: '[Beacon sent]',
                        duration: null,
                        size: 0,
                        timing: {}
                    };
                    const result = origBeacon(url, data);
                    entry.endTime = performance.now();
                    entry.duration = entry.endTime - entry.startTime;
                    __labAddNetworkEntry(entry);
                    return result;
                };
                window.__labBeaconOverridden = true;
            }

            // --- Navigation Timing ---
            if (!window.__labNavTimingCaptured) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        try {
                            const nav = performance.getEntriesByType('navigation')[0];
                            if (nav) {
                                __labAddNetworkEntry({
                                    type: 'navigation',
                                    method: 'GET',
                                    url: location.href,
                                    startTime: nav.startTime,
                                    endTime: nav.loadEventEnd,
                                    requestHeaders: {},
                                    requestBody: null,
                                    status: 200,
                                    statusText: 'OK',
                                    responseHeaders: {},
                                    responseBody: '[Page Navigation]',
                                    duration: nav.duration,
                                    size: nav.transferSize || 0,
                                    timing: {
                                        dns: nav.domainLookupEnd - nav.domainLookupStart,
                                        connect: nav.connectEnd - nav.connectStart,
                                        ssl: nav.secureConnectionStart ? (nav.connectEnd - nav.secureConnectionStart) : 0,
                                        ttfb: nav.responseStart - nav.fetchStart,
                                        download: nav.responseEnd - nav.responseStart,
                                        dom: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
                                        load: nav.loadEventEnd - nav.loadEventStart
                                    }
                                });
                            }
                        } catch (e) {}
                    }, 0);
                });
                window.__labNavTimingCaptured = true;
            }

            // ==========================================
            // UI SETUP — DOM CREATION & EVENT BINDING
            // ==========================================

            // Cleanup old UI
            $('#labBtnToggleSniffer').remove();
            $('#labBtnPauseSniffer').remove();
            $('#labBtnGroupSniffer').remove();
            $('#labSearchSniffer').remove();
            $('#panelSnifferLab').remove();
            $('#__labTopLayerContainer').remove();
            $('#__labBlockedModal').remove();
            $('#lab-net-style').remove();

            // Buttons
            const $btnToggleSniffer = $('<button class="lab-mini-btn" id="labBtnToggleSniffer" style="background: #e74c3c; color: white; margin-right: 4px;" title="Network Monitor (Ctrl+L)">🌐 </button>');
            const $btnPauseSniffer = $('<button class="lab-mini-btn" id="labBtnPauseSniffer" style="background: #2ecc71; color: white; margin-right: 4px;" title="Pause Recording">⏸ </button>');
            const $btnGroupSniffer = $('<button class="lab-mini-btn" id="labBtnGroupSniffer" style="background: #9b59b6; color: white; margin-right: 4px;" title="Group: XHR">📂 XHR</button>');
            $('.sanbox-group').prepend($btnToggleSniffer);
            $('.sanbox-group').prepend($btnPauseSniffer);
            $('.sanbox-group').prepend($btnGroupSniffer);

            // Panel HTML
            const $snifferPanel = $('<div id="panelSnifferLab" class="lab-panel" style="display: none; flex-direction: column; background: #1e1e1e !important; border: 2px solid #34495e !important; color: #fff !important; box-sizing: border-box !important; position: fixed !important; z-index: 2147483999 !important; box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important; border-radius: 4px; pointer-events: auto !important; overflow: hidden !important;"></div>');

            const panelHeader = '<div class="lab-panel-header" style="display: flex; justify-content: space-between; align-items: center; background: #2c3e50; padding: 6px 10px; font-weight: bold; font-size: 12px; user-select: none; flex-shrink: 0;">' +
                '<span>🌐 Network Monitor</span>' +
                '<div class="lab-panel-actions" style="display: flex; align-items: center;">' +
                '<input type="text" id="labSearchSniffer" placeholder="Filter URL..." style="background:#1a1a1a; color:#fff; border:1px solid #444; border-radius:3px; padding:3px 6px; font-size:11px; width:120px; margin-right:6px;">' +
                '<button class="lab-mini-btn btn-danger" id="labBtnClearSniffer" style="margin-right: 4px;" title="Clear">🗑️ </button>' +
                '<button class="lab-mini-btn" id="labBtnFullscreenSniffer" style="background:#2980b9; color:white; margin-right: 4px;" title="Fullscreen">⛶</button>' +
                '<button class="lab-mini-btn" id="labBtnCloseSniffer" style="background:#e74c3c; color:white;" title="Close">×</button>' +
                '</div>' +
                '</div>';

            const groupTabs = '<div id="labNetworkGroupTabs" style="display: flex; background: #252525; border-bottom: 1px solid #444; padding: 0; font-size: 11px; flex-shrink: 0; overflow-x: auto;">' +
                '<button class="lab-net-group-tab active" data-group="xhr" style="background:transparent; border:none; color:#fff; padding:5px 12px; cursor:pointer; font-size:11px; border-bottom:2px solid #3498db; white-space:nowrap;">XHR/API</button>' +
                '<button class="lab-net-group-tab" data-group="resource" style="background:transparent; border:none; color:#aaa; padding:5px 12px; cursor:pointer; font-size:11px; border-bottom:2px solid transparent; white-space:nowrap;">Resources</button>' +
                '<button class="lab-net-group-tab" data-group="media" style="background:transparent; border:none; color:#aaa; padding:5px 12px; cursor:pointer; font-size:11px; border-bottom:2px solid transparent; white-space:nowrap;">Media</button>' +
                '<button class="lab-net-group-tab" data-group="other" style="background:transparent; border:none; color:#aaa; padding:5px 12px; cursor:pointer; font-size:11px; border-bottom:2px solid transparent; white-space:nowrap;">Other</button>' +
                '</div>';

            const tableHeader = '<div id="labNetworkTableHeader" style="display: flex; background: #252525; border-bottom: 1px solid #444; padding: 4px 8px; font-size: 11px; color: #aaa; font-weight: bold; flex-shrink: 0; user-select: none;">' +
                '<span style="width: 50px; flex-shrink: 0;">Method</span>' +
                '<span style="width: 50px; flex-shrink: 0;">Status</span>' +
                '<span style="flex: 1; min-width: 0;">URL</span>' +
                '<span style="width: 22px; flex-shrink: 0; text-align: center;"></span>' +
                '<span style="width: 60px; flex-shrink: 0; text-align: right;">Size</span>' +
                '<span style="width: 60px; flex-shrink: 0; text-align: right;">Time</span>' +
                '</div>';

            const detailTabs = '<div id="labNetworkDetailTabs" style="display: flex; background: #252525; border-bottom: 1px solid #444; flex-shrink: 0;">' +
                '<button class="lab-net-tab active" data-tab="headers" style="background:transparent; border:none; color:#fff; padding:5px 12px; cursor:pointer; font-size:11px; border-bottom:2px solid #3498db;">Headers</button>' +
                '<button class="lab-net-tab" data-tab="response" style="background:transparent; border:none; color:#aaa; padding:5px 12px; cursor:pointer; font-size:11px; border-bottom:2px solid transparent;">Response</button>' +
                '<button class="lab-net-tab" data-tab="preview" style="background:transparent; border:none; color:#aaa; padding:5px 12px; cursor:pointer; font-size:11px; border-bottom:2px solid transparent;">Preview</button>' +
                '<button class="lab-net-tab" data-tab="timing" style="background:transparent; border:none; color:#aaa; padding:5px 12px; cursor:pointer; font-size:11px; border-bottom:2px solid transparent;">Timing</button>' +
                '</div>';

            const panelBody = '<div id="labSnifferBody" style="flex: 1; padding: 0; overflow: hidden; font-family: monospace; font-size: 12px; line-height: 1.6; display: flex; flex-direction: column;">' +
                groupTabs + tableHeader +
                '<div id="labNetworkTableBody" style="flex: 1; overflow-y: auto; padding: 0;"></div>' +
                '<div id="labSnifferHResizer" style="display: none; flex-shrink: 0; height: 6px; background: #333; cursor: ns-resize; border-top: 1px solid #444; border-bottom: 1px solid #444; position: relative; z-index: 5;"><div style="position: absolute; left: 50%; top: 1px; transform: translateX(-50%); width: 30px; height: 4px; background: #555; border-radius: 2px;"></div></div>' +
                '<div id="labNetworkDetail" style="display: none; height: 45%; border-top: 2px solid #444; background: #1a1a1a; flex-direction: column; flex-shrink: 0;">' +
                detailTabs +
                '<div id="labNetworkDetailContent" style="flex: 1; overflow-y: auto; padding: 8px; font-size: 11px; color: #ddd;"></div>' +
                '</div>' +
                '</div>';

            $snifferPanel.append(panelHeader);
            $snifferPanel.append(panelBody);

            // Top layer container
            const $labContainer = $('<div id="__labTopLayerContainer" style="position: fixed !important; top: 0 !important; left: 0 !important; width: 0 !important; height: 0 !important; z-index: 2147483645 !important; pointer-events: none !important;"></div>');
            $('body').prepend($labContainer);
            $('body').prepend($snifferPanel);

            // DOMINATE SIBLINGS
            function __labDominateSiblings() {
                try {
                    const container = document.getElementById('__labTopLayerContainer');
                    if (!container) return;
                    const parent = container.parentNode;
                    if (!parent) return;
                    for (let i = 0; i < parent.children.length; i++) {
                        const el = parent.children[i];
                        if (el === container) continue;

                        // THÊM ĐIỀU KIỆN LỌC CỦA BẠN VÀO ĐÂY:
                        if (el.id && (el.id.startsWith('lab') || el.id.startsWith('__lab') || el.id === 'quick-extract-modal' || el.id === 'panelSnifferLab')) continue;

                        const style = window.getComputedStyle(el);
                        if (style.position === 'fixed' || style.position === 'absolute' || style.position === 'sticky' || style.position === 'relative') {
                            const currentZ = parseInt(style.zIndex) || 0;
                            if (currentZ >= 2147483000) {
                                el.style.setProperty('z-index', '2147483000', 'important');
                            }
                        }
                    }
                } catch (e) {}
            }

            (function __labSetupDominationObserver() {
                try {
                    const observer = new MutationObserver(function(mutations) {
                        let needDominate = false;
                        for (const m of mutations) {
                            if (m.type === 'childList' && m.addedNodes.length) needDominate = true;
                        }
                        if (needDominate) setTimeout(__labDominateSiblings, 50);
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: false
                    });
                } catch (e) {}
            })();
            setInterval(__labDominateSiblings, 2000);

            // Resizers
            $snifferPanel.append('<div class="lab-resizer resizer-x" style="position:absolute; right:0; top:0; bottom:0; width:6px; cursor:ew-resize; z-index:10;"></div>');
            $snifferPanel.append('<div class="lab-resizer resizer-y" style="position:absolute; bottom:0; left:0; right:0; height:6px; cursor:ns-resize; z-index:10;"></div>');
            $snifferPanel.append('<div class="lab-resizer resizer-top" style="position:absolute; top:0; left:0; right:0; height:6px; cursor:ns-resize; z-index:10;" title="Kéo để thay đổi chiều cao từ trên"></div>');

            // Styles
            const $netStyle = $('<style id="lab-net-style"></style>');
            $netStyle.text(
                '#labNetworkTableBody .lab-net-row { display: flex; padding: 3px 8px; border-bottom: 1px solid #2a2a2a; cursor: pointer; font-size: 11px; align-items: center; transition: background 0.1s; }' +
                '#labNetworkTableBody .lab-net-row:hover { background: #2a2a2a; }' +
                '#labNetworkTableBody .lab-net-row.selected { background: #1a3a5c; }' +
                '#labNetworkTableBody .lab-net-row .net-method { width: 50px; flex-shrink: 0; font-weight: bold; }' +
                '#labNetworkTableBody .lab-net-row .net-status { width: 50px; flex-shrink: 0; }' +
                '#labNetworkTableBody .lab-net-row .net-url { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 8px; }' +
                '#labNetworkTableBody .lab-net-row .net-size { width: 60px; flex-shrink: 0; text-align: right; }' +
                '#labNetworkTableBody .lab-net-row .net-time { width: 60px; flex-shrink: 0; text-align: right; }' +
                '#labNetworkDetailContent .net-detail-section { margin-bottom: 10px; }' +
                '#labNetworkDetailContent .net-detail-title { color: #3498db; font-weight: bold; margin-bottom: 4px; font-size: 12px; }' +
                '#labNetworkDetailContent .net-detail-table { width: 100%; border-collapse: collapse; }' +
                '#labNetworkDetailContent .net-detail-table td { padding: 3px 6px; border-bottom: 1px solid #333; font-size: 11px; }' +
                '#labNetworkDetailContent .net-detail-table td:first-child { color: #aaa; width: 180px; white-space: nowrap; }' +
                '#labNetworkDetailContent pre { background: #111; padding: 6px; border-radius: 3px; border: 1px solid #333; margin: 0; white-space: pre-wrap; word-break: break-word; max-height: 300px; overflow-y: auto; }' +
                '#labNetworkDetailContent .net-timing-bar { height: 14px; background: #3498db; border-radius: 2px; margin: 2px 0; }' +
                '#labNetworkDetailContent .net-timing-label { display: flex; justify-content: space-between; font-size: 10px; color: #aaa; }' +
                '.lab-net-tab:hover { background: #333 !important; }' +
                '.lab-net-group-tab:hover { background: #333 !important; }' +
                '.lab-net-group-tab.active { color: #fff !important; border-bottom-color: #3498db !important; }' +
                '#panelSnifferLab.lab-sniffer-fullscreen { top: 0 !important; left: 0 !important; right: auto !important; width: 100vw !important; height: 100vh !important; border-radius: 0 !important; z-index: 2147483645 !important; }' +
                '#labSnifferHResizer:hover { background: #3498db !important; }' +
                '.net-url { cursor: pointer; }' +
                '.net-url:hover { text-decoration: underline; color: #3498db; }' +
                '.net-copy-btn:hover { opacity: 1 !important; color: #2ecc71 !important; }' +
                '.lab-net-row .net-copy-btn { width: 22px; flex-shrink: 0; text-align: center; cursor: pointer; color: #888; font-size: 11px; opacity: 0.6; transition: opacity 0.2s; }' +
                '.lab-net-row:hover .net-copy-btn { opacity: 0.9; }' +
                '.net-copy-btn:hover { opacity: 1; color: #2ecc71; }' +

                '.lab-copy-toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #2ecc71; color: #fff; padding: 6px 16px; border-radius: 4px; font-size: 12px; z-index: 2147483647; pointer-events: none; opacity: 0; transition: opacity 0.3s; }' +
                '.lab-preview-btn:hover { filter: brightness(1.15); }' +
                '#labNetworkDetailContent { display: flex; flex-direction: column; }' +
                '#__labBlockedModal { position: fixed !important; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2147483647; display: none; justify-content: center; align-items: center; font-family: sans-serif; }' +
                '#__labBlockedModal .lab-modal-box { background: #1e1e1e; border: 2px solid #e74c3c; border-radius: 8px; padding: 24px; max-width: 420px; width: 90%; box-shadow: 0 0 40px rgba(231,76,60,0.4); color: #fff; }' +
                '#__labBlockedModal .lab-modal-title { font-size: 18px; font-weight: bold; color: #e74c3c; margin-bottom: 12px; }' +
                '#__labBlockedModal .lab-modal-text { font-size: 13px; line-height: 1.6; color: #ccc; margin-bottom: 20px; }' +
                '#__labBlockedModal .lab-modal-btn { border: none; border-radius: 4px; padding: 8px 16px; font-size: 13px; cursor: pointer; margin-right: 8px; }' +
                '#__labBlockedModal .lab-modal-btn-reset { background: #e74c3c; color: white; }' +
                '#__labBlockedModal .lab-modal-btn-reset:hover { background: #c0392b; }' +
                '#__labBlockedModal .lab-modal-btn-cancel { background: #555; color: white; }' +
                '#__labBlockedModal .lab-modal-btn-cancel:hover { background: #444; }'
            );
            $('head').append($netStyle);

            // --- BLOCKED DETECTION & RECOVERY MODAL ---
            function __labCreateBlockedModal() {
                if ($('#__labBlockedModal').length) return;
                const modal = '<div id="__labBlockedModal" style="position: fixed !important; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 2147483647; display: none; justify-content: center; align-items: center; font-family: sans-serif;">' +
                    '<div class="lab-modal-box" style="background: #1e1e1e; border: 2px solid #e74c3c; border-radius: 8px; padding: 24px; max-width: 420px; width: 90%; box-shadow: 0 0 40px rgba(231,76,60,0.4); color: #fff;">' +
                    '<div class="lab-modal-title" style="font-size: 18px; font-weight: bold; color: #e74c3c; margin-bottom: 12px;">⚠️ Website đã chặn bộ công cụ</div>' +
                    '<div class="lab-modal-text" style="font-size: 13px; line-height: 1.6; color: #ccc; margin-bottom: 20px;">' +
                    'Trang web này đã phát hiện và chặn / che giấu bộ công cụ kiểm tra.<br><br>' +
                    'Bạn có thể <strong>Reset lại bộ công cụ</strong> để thử khôi phục, hoặc <strong>Chấp nhận bị chặn</strong> để tiếp tục duyệt web.' +
                    '</div>' +
                    '<div style="text-align: center;">' +
                    '<button class="lab-modal-btn lab-modal-btn-reset" id="__labBtnResetTools" style="border: none; border-radius: 4px; padding: 8px 16px; font-size: 13px; cursor: pointer; margin-right: 8px; background: #e74c3c; color: white;">🔄 Reset lại bộ công cụ</button>' +
                    '<button class="lab-modal-btn lab-modal-btn-cancel" id="__labBtnAcceptBlocked" style="border: none; border-radius: 4px; padding: 8px 16px; font-size: 13px; cursor: pointer; background: #555; color: white;">✕ Chấp nhận bị chặn</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $('body').append(modal);

                $('#__labBtnResetTools').on('click', function(e) {
                    e.stopPropagation();
                    __labResetAllTools();
                });
                $('#__labBtnAcceptBlocked').on('click', function(e) {
                    e.stopPropagation();
                    $('#__labBlockedModal').css('display', 'none');
                    window.__labBlockedAccepted = true;
                });
            }

            function __labShowBlockedModal() {
                if (window.__labBlockedAccepted) return;
                __labCreateBlockedModal();
                $('#__labBlockedModal').css('display', 'flex');
            }

            function __labResetAllTools() {
                $('#__labBlockedModal').css('display', 'none');
                // Remove and recreate all lab panels
                $('#panelSnifferLab').remove();
                $('#panelConsole').remove();
                $('#panelJs').remove();
                $('#panelCss').remove();
                $('#labMainDashboard').remove();
                $('#labHtmlSourceModal').remove();
                $('#__labTopLayerContainer').remove();
                $('#__labBlockedModal').remove();
                $('.lab-panel').remove();
                $('.lab-resizer').remove();
                $('#lab-net-style').remove();

                // Clear flags so init will run again
                window.__labNetworkLog = [];
                window.__labNetworkPaused = false;
                window.__labNetworkSelectedId = null;
                window.__labNetworkGroup = 'xhr';
                window.__labPanelVisible = false;
                window.__labBlockedAccepted = false;
                window.__labXhrOverridden = false;
                window.__labFetchOverridden = false;
                window.__labWebSocketOverridden = false;
                window.__labPerfObserverStarted = false;
                window.__labBeaconOverridden = false;
                window.__labNavTimingCaptured = false;

                // Trigger a full re-init by calling the main init if available
                if (typeof window.__labReinitAll === 'function') {
                    window.__labReinitAll();
                } else {
                    // fallback: reload page
                    location.reload();
                }
            }

            // Detect when panel is hidden, removed, or tampered
            function __labCheckTampered() {
                if (window.__labBlockedAccepted) return;
                try {
                    const panel = document.getElementById('panelSnifferLab');
                    if (!panel) {
                        __labShowBlockedModal();
                        return;
                    }
                    const style = window.getComputedStyle(panel);
                    if (style.display === 'none' && window.__labPanelVisible) {
                        __labShowBlockedModal();
                        return;
                    }
                    if (style.visibility === 'hidden') {
                        __labShowBlockedModal();
                        return;
                    }
                    if (parseFloat(style.opacity) < 0.1) {
                        __labShowBlockedModal();
                        return;
                    }
                    if (style.zIndex && parseInt(style.zIndex) < 100000) {
                        __labShowBlockedModal();
                        return;
                    }
                } catch (e) {}
            }

            setInterval(__labCheckTampered, 1500);

            // MutationObserver to detect removal of our panels
            (function __labSetupRemovalObserver() {
                try {
                    const observer = new MutationObserver(function(mutations) {
                        for (const m of mutations) {
                            if (m.type === 'childList' && m.removedNodes.length) {
                                for (let i = 0; i < m.removedNodes.length; i++) {
                                    const node = m.removedNodes[i];
                                    if (node.id === 'panelSnifferLab' || node.id === 'labMainDashboard' || node.id === 'lab-fab-wrapper') {
                                        __labShowBlockedModal();
                                        return;
                                    }
                                }
                            }
                        }
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: false
                    });
                } catch (e) {}
            })();

            // Layout sync
            function syncSnifferLayout() {
                if ($snifferPanel.hasClass('lab-panel-hidden')) {
                    $snifferPanel.hide();
                    return;
                }
                $snifferPanel.css('display', 'flex');
                const viewW = window.innerWidth;
                const viewH = window.innerHeight;
                const dashEl = $layoutEngine[0];
                if (!dashEl) return;
                const rect = dashEl.getBoundingClientRect();
                const safeGap = 35;
                if (layoutState === 'horizontal') {
                    const snifferH = Math.round(viewH * 0.32);
                    let calculatedTop = rect.top - snifferH - safeGap;
                    if (calculatedTop < 5) calculatedTop = 5;
                    $snifferPanel.css({
                        'top': calculatedTop - 10 + 'px',
                        'left': rect.left + 'px',
                        'width': rect.width + 'px',
                        'height': snifferH + 'px'
                    });
                } else if (layoutState === 'vertical-left') {
                    let calculatedLeft = rect.right + safeGap;
                    let calculatedW = viewW - calculatedLeft - 20;
                    if (calculatedW < 200) calculatedW = Math.round(viewW * 0.35);
                    $snifferPanel.css({
                        'top': '20px',
                        'left': 'auto',
                        'right': '20px',
                        'width': calculatedW + 'px',
                        'height': rect.height + 50 + 'px'
                    });
                } else if (layoutState === 'vertical-right') {
                    let calculatedW = rect.left - safeGap - 20;
                    if (calculatedW < 200) calculatedW = Math.round(viewW * 0.35);
                    let calculatedLeft = rect.left - calculatedW - safeGap;
                    if (calculatedLeft < 5) calculatedLeft = 5;
                    $snifferPanel.css({
                        'top': '20px',
                        'left': '10px',
                        'width': calculatedW + 'px',
                        'height': rect.height - 50 + 'px'
                    });
                }
            }

            const originalUpdateScreenSplitting = window.updateScreenSplitting;
            window.updateScreenSplitting = function() {
                if (typeof originalUpdateScreenSplitting === 'function') originalUpdateScreenSplitting();
                setTimeout(syncSnifferLayout, 60);
            };

            window.__labOpenSnifferPanel = function() {
                $snifferPanel.removeClass('lab-panel-hidden');
                window.__labPanelVisible = true;
                syncSnifferLayout();
                __labDominateSiblings();
            };

            window.__labCloseSnifferPanel = function() {
                $snifferPanel.addClass('lab-panel-hidden');
                window.__labPanelVisible = false;
                syncSnifferLayout();
            };

            // Button events
            $btnToggleSniffer.on('click', function(e) {
                e.stopPropagation();
                if ($snifferPanel.hasClass('lab-panel-hidden')) {
                    window.__labOpenSnifferPanel();
                    $(this).text('🌐 ').css('background', '#e74c3c');
                } else {
                    window.__labCloseSnifferPanel();
                    $(this).text('🌐').css('background', '#27ae60');
                }
            });

            $btnPauseSniffer.on('click', function(e) {
                e.stopPropagation();
                window.__labNetworkPaused = !window.__labNetworkPaused;
                $(this).text(window.__labNetworkPaused ? '▶ ' : '⏸ ').css('background', window.__labNetworkPaused ? '#e74c3c' : '#2ecc71');
                $(this).attr('title', window.__labNetworkPaused ? 'Resume Recording' : 'Pause Recording');
            });

            const groupTypes = ['xhr', 'resource', 'media', 'other'];
            let groupIdx = 0;
            $btnGroupSniffer.on('click', function(e) {
                e.stopPropagation();
                groupIdx = (groupIdx + 1) % groupTypes.length;
                window.__labNetworkGroup = groupTypes[groupIdx];
                $(this).text('📂 ' + __labGroupLabel(window.__labNetworkGroup).toUpperCase());
                $(this).css('background', __labGroupColor(window.__labNetworkGroup));
                __labRenderNetworkTable();
            });

            // Bind events DIRECTLY on the panel (not via document delegation) so stopPropagation doesn't break them
            $snifferPanel.on('click', '#labBtnClearSniffer', function(e) {
                e.stopPropagation();
                window.__labNetworkLog = [];
                window.__labNetworkSelectedId = null;
                $('#labNetworkDetail').hide();
                $('#labSnifferHResizer').hide();
                __labRenderNetworkTable();
            });

            $snifferPanel.on('click', '#labBtnCloseSniffer', function(e) {
                e.stopPropagation();
                window.__labCloseSnifferPanel();
                $btnToggleSniffer.text('🌐').css('background', '#27ae60');
                syncSnifferLayout();
            });

            $snifferPanel.on('input', '#labSearchSniffer', function() {
                window.__labNetworkSearch = $(this).val().toLowerCase();
                __labRenderNetworkTable();
            });

            // Tab switching — bind directly on panel
            $snifferPanel.on('click', '.lab-net-tab', function(e) {
                e.stopPropagation();
                $snifferPanel.find('.lab-net-tab').removeClass('active').css({
                    'color': '#aaa',
                    'border-bottom-color': 'transparent'
                });
                $(this).addClass('active').css({
                    'color': '#fff',
                    'border-bottom-color': '#3498db'
                });
                __labRenderNetworkDetail();
            });

            $snifferPanel.on('click', '.lab-net-group-tab', function(e) {
                e.stopPropagation();
                $snifferPanel.find('.lab-net-group-tab').removeClass('active').css({
                    'color': '#aaa',
                    'border-bottom-color': 'transparent'
                });
                $(this).addClass('active').css({
                    'color': '#fff',
                    'border-bottom-color': '#3498db'
                });
                window.__labNetworkGroup = $(this).data('group');
                $btnGroupSniffer.text('📂 ' + __labGroupLabel(window.__labNetworkGroup).toUpperCase()).css('background', __labGroupColor(window.__labNetworkGroup));
                __labRenderNetworkTable();
            });

            // Row click — bind directly on table body
            $snifferPanel.on('click', '.lab-net-row', function(e) {
                e.stopPropagation();
                const id = $(this).data('id');
                window.__labNetworkSelectedId = id;
                $snifferPanel.find('.lab-net-row').removeClass('selected');
                $(this).addClass('selected');
                $('#labNetworkDetail').css('display', 'flex');
                $('#labSnifferHResizer').css('display', 'flex');
                __labRenderNetworkDetail();
            });

            // Copy button on each row
            $snifferPanel.on('click', '.net-copy-btn', function(e) {
                e.stopPropagation();
                const url = $(this).data('url') || $(this).siblings('.net-url').attr('title');
                if (!url) return;
                navigator.clipboard.writeText(url).catch(function() {});
                const toast = $('<div class="lab-copy-toast">📋 Copied!</div>');
                $('body').append(toast);
                requestAnimationFrame(function() {
                    toast.css('opacity', '1');
                });
                setTimeout(function() {
                    toast.css('opacity', '0');
                    setTimeout(function() {
                        toast.remove();
                    }, 300);
                }, 1200);
            });

            // Allow clicks inside panel but stop propagation to outside
            $snifferPanel.on('click contextmenu', function(e) {
                e.stopPropagation();
            });

            // --- FULLSCREEN TOGGLE ---
            let __labSnifferNormalState = null;
            $snifferPanel.on('click', '#labBtnFullscreenSniffer', function(e) {
                e.stopPropagation();
                if ($snifferPanel.hasClass('lab-sniffer-fullscreen')) {
                    $snifferPanel.removeClass('lab-sniffer-fullscreen');
                    if (__labSnifferNormalState) {
                        $snifferPanel.css({
                            top: __labSnifferNormalState.top,
                            left: __labSnifferNormalState.left,
                            right: __labSnifferNormalState.right,
                            width: __labSnifferNormalState.width,
                            height: __labSnifferNormalState.height
                        });
                    } else {
                        syncSnifferLayout();
                    }
                    $(this).text('⛶').attr('title', 'Fullscreen');
                } else {
                    __labSnifferNormalState = {
                        top: $snifferPanel.css('top'),
                        left: $snifferPanel.css('left'),
                        right: $snifferPanel.css('right'),
                        width: $snifferPanel.css('width'),
                        height: $snifferPanel.css('height')
                    };
                    $snifferPanel.addClass('lab-sniffer-fullscreen');
                    $(this).text('⛶').attr('title', 'Restore');
                }
            });

            // --- HORIZONTAL RESIZER (table ↔ detail) ---
            (function() {
                const $resizer = $('#labSnifferHResizer');
                const $detail = $('#labNetworkDetail');
                const $tableBody = $('#labNetworkTableBody');
                let dragging = false,
                    startY = 0,
                    startDetailH = 0;
                $resizer.on('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dragging = true;
                    startY = e.clientY;
                    startDetailH = $detail.outerHeight();
                    $(document).on('mousemove.labHResize', function(ev) {
                        if (!dragging) return;
                        const delta = startY - ev.clientY;
                        const newH = Math.max(80, Math.min(window.innerHeight * 0.7, startDetailH + delta));
                        $detail.css('height', newH + 'px');
                        $tableBody.css('flex', '1 1 auto');
                        return false;
                    });
                    $(document).on('mouseup.labHResize', function() {
                        dragging = false;
                        $(document).off('mousemove.labHResize mouseup.labHResize');
                    });
                });
            })();

            // Hotkey: Ctrl+L toggles ALL Lab tools (Dashboard + Sniffer)
            $(document).on('keydown', function(e) {
                if (e.ctrlKey && !e.shiftKey && (e.key === 'L' || e.key === 'l')) {
                    e.preventDefault();
                    e.stopPropagation();
                    if ($dashboard.is(':visible')) {
                        // Close everything
                        $dashboard.hide();
                        $fabBtn.text('+').css('background-color', '#3498db');
                        isInspectEnabled = false;
                        localStorage.setItem('lab_dashboard_open', 'false');
                        $(document).find('.lab-inspect-child, .lab-inspect-parent, .lab-inspect-grand, .lab-pinned-child, .lab-pinned-parent, .lab-pinned-grand').removeClass('lab-inspect-child lab-inspect-parent lab-inspect-grand lab-pinned-child lab-pinned-parent lab-pinned-grand');
                        window.__labCloseSnifferPanel();
                        $btnToggleSniffer.text('🌐').css('background', '#27ae60');
                    } else {
                        // Open everything
                        $dashboard.css('display', 'flex');
                        $fabBtn.text('×').css('background-color', '#e74c3c');
                        isInspectEnabled = true;
                        localStorage.setItem('lab_dashboard_open', 'true');
                        window.__labOpenSnifferPanel();
                        $btnToggleSniffer.text('🌐 ').css('background', '#e74c3c');
                    }
                    setTimeout(function() {
                        updateScreenSplitting();
                    }, 50);
                    return false;
                }
            });

            window.__labRenderNetworkTable = function() {
                const $body = $('#labNetworkTableBody');
                if (!$body.length) return;
                let filtered = window.__labNetworkLog;
                filtered = filtered.filter(e => {
                    const g = e._group || __labCategorizeEntry(e);
                    return g === window.__labNetworkGroup;
                });
                if (window.__labNetworkSearch) {
                    filtered = filtered.filter(e => e.url.toLowerCase().includes(window.__labNetworkSearch));
                }
                const html = filtered.map(entry => {
                    const isSelected = entry.id === window.__labNetworkSelectedId;
                    const methodColor = __labMethodColor(entry.method);
                    const statusColor = __labStatusColor(entry.status);
                    const shortUrl = entry.url.length > 80 ? entry.url.substr(0, 77) + '...' : entry.url;
                    const isMedia = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|mp4|webm|ogg|mov|m3u8|mkv|mp3|wav|aac|flac)(\?|$)/i.test(entry.url) || (entry.type || '').includes('image') || (entry.type || '').includes('video') || (entry.type || '').includes('audio');
                    const mediaIcon = isMedia ? ' 🎬' : '';
                    return '<div class="lab-net-row ' + (isSelected ? 'selected' : '') + '" data-id="' + entry.id + '">' +
                        '<span class="net-method" style="color:' + methodColor + '">' + entry.method + '</span>' +
                        '<span class="net-status" style="color:' + statusColor + '">' + (entry.status || '—') + '</span>' +
                        '<span class="net-url" title="' + entry.url + '">' + shortUrl + mediaIcon + '</span>' +
                        '<span class="net-copy-btn" title="Copy URL" data-url="' + entry.url.replace(/"/g, '&quot;') + '">📋</span>' +
                        '<span class="net-size">' + __labFormatBytes(entry.size) + '</span>' +
                        '<span class="net-time">' + __labFormatDuration(entry.duration) + '</span>' +
                        '</div>';
                }).join('');
                const groupLabel = __labGroupLabel(window.__labNetworkGroup);
                const emptyMsg = '<div style="padding: 20px; text-align: center; color: #777; font-size: 12px;">' +
                    '<div style="font-size: 24px; margin-bottom: 8px;">📂 ' + groupLabel + '</div>' +
                    'No entries in this group yet.<br>Requests will appear automatically.</div>';
                $body.html(html || emptyMsg);
            };

            window.__labRenderNetworkDetail = function() {
                const entry = window.__labNetworkLog.find(e => e.id === window.__labNetworkSelectedId);
                if (!entry) return;
                const activeTab = $snifferPanel.find('.lab-net-tab.active').data('tab') || 'headers';
                const $content = $('#labNetworkDetailContent');

                if (activeTab === 'headers') {
                    let reqHtml = '';
                    if (entry.requestHeaders && Object.keys(entry.requestHeaders).length > 0) {
                        reqHtml = Object.entries(entry.requestHeaders).map(([k, v]) =>
                            '<tr><td>' + k + '</td><td>' + String(v).replace(/</g, '&lt;') + '</td></tr>'
                        ).join('');
                    } else {
                        reqHtml = '<tr><td colspan="2" style="color:#777;">No request headers captured</td></tr>';
                    }
                    let respHtml = '';
                    if (entry.responseHeaders && Object.keys(entry.responseHeaders).length > 0) {
                        respHtml = Object.entries(entry.responseHeaders).map(([k, v]) =>
                            '<tr><td>' + k + '</td><td>' + String(v).replace(/</g, '&lt;') + '</td></tr>'
                        ).join('');
                    } else {
                        respHtml = '<tr><td colspan="2" style="color:#777;">No response headers captured</td></tr>';
                    }
                    $content.html(
                        '<div class="net-detail-section"><div class="net-detail-title">General</div>' +
                        '<table class="net-detail-table">' +
                        '<tr><td>Request URL</td><td>' + entry.url + '</td></tr>' +
                        '<tr><td>Request Method</td><td>' + entry.method + '</td></tr>' +
                        '<tr><td>Status Code</td><td>' + entry.status + ' ' + entry.statusText + '</td></tr>' +
                        '<tr><td>Type</td><td>' + entry.type + '</td></tr>' +
                        '<tr><td>Category</td><td>' + __labGroupLabel(entry._group || __labCategorizeEntry(entry)) + '</td></tr>' +
                        '<tr><td>Duration</td><td>' + __labFormatDuration(entry.duration) + '</td></tr>' +
                        '<tr><td>Size</td><td>' + __labFormatBytes(entry.size) + '</td></tr>' +
                        '</table></div>' +
                        '<div class="net-detail-section"><div class="net-detail-title">Request Headers</div>' +
                        '<table class="net-detail-table">' + reqHtml + '</table></div>' +
                        '<div class="net-detail-section"><div class="net-detail-title">Response Headers</div>' +
                        '<table class="net-detail-table">' + respHtml + '</table></div>'
                    );
                } else if (activeTab === 'response') {
                    const body = entry.responseBody || '[No response body]';
                    const isJson = typeof body === 'string' && (body.startsWith('{') || body.startsWith('['));
                    const displayBody = isJson ? body : body;
                    $content.html(
                        '<div class="net-detail-section"><div class="net-detail-title">Response Body</div>' +
                        '<pre>' + displayBody.replace(/</g, '&lt;') + '</pre></div>'
                    );
                } else if (activeTab === 'preview') {
                    const previewUrl = entry.url || '';
                    const ct = (entry.contentType || entry.type || '').toLowerCase();
                    const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(previewUrl) || ct.includes('image');
                    const isVideo = /\.(mp4|webm|ogg|mov|m3u8|mkv)(\?|$)/i.test(previewUrl) || ct.includes('video');
                    const isAudio = /\.(mp3|wav|aac|flac|ogg|m4a|wma)(\?|$)/i.test(previewUrl) || ct.includes('audio');
                    const actions = '<div style="display:flex; gap:6px; margin-bottom:10px; flex-shrink:0;">' +
                        '<button class="lab-preview-btn lab-open-link" style="background:#2980b9;color:#fff;border:none;padding:4px 10px;border-radius:3px;font-size:11px;cursor:pointer;">🔗 Open</button>' +
                        '<button class="lab-preview-btn lab-copy-link" style="background:#27ae60;color:#fff;border:none;padding:4px 10px;border-radius:3px;font-size:11px;cursor:pointer;">📋 Copy</button>' +
                        '<button class="lab-preview-btn lab-dl-link" style="background:#8e44ad;color:#fff;border:none;padding:4px 10px;border-radius:3px;font-size:11px;cursor:pointer;">⬇️ Download</button>' +
                        '</div>';
                    if (isImage) {
                        $content.html(
                            actions + '<div style="display:flex; justify-content:center; align-items:center; flex:1; min-height:0; padding:10px; overflow:auto;">' +
                            '<img src="' + previewUrl.replace(/</g, '&lt;') + '" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4);" onerror="this.outerHTML=\'<div style=color:#888;padding:20px 0;>Cannot load image</div>\'"></div>'
                        );
                    } else if (isVideo) {
                        $content.html(
                            actions + '<div style="display:flex; justify-content:center; align-items:center; flex:1; min-height:0; padding:10px; overflow:auto;">' +
                            '<video src="' + previewUrl.replace(/</g, '&lt;') + '" controls style="max-width:100%; max-height:100%; border-radius:4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4);" onerror="this.outerHTML=\'<div style=color:#888;padding:20px 0;>Cannot load video</div>\'"></div>'
                        );
                    } else if (isAudio) {
                        $content.html(
                            actions + '<div style="display:flex; justify-content:center; align-items:center; flex:1; min-height:0; padding:10px;">' +
                            '<audio src="' + previewUrl.replace(/</g, '&lt;') + '" controls style="width:100%;" onerror="this.outerHTML=\'<div style=color:#888;padding:20px 0;>Cannot load audio</div>\'"></div>'
                        );
                    } else {
                        const isText = ct.includes('javascript') || ct.includes('css') || ct.includes('html') || ct.includes('json') || ct.includes('text') || ct.includes('xml') || ct.includes('csv') || ct.includes('plain') ||
                            /\.(js|css|html|htm|json|txt|xml|csv|log|md|ts|jsx|tsx|vue|php|py|rb|go|java|c|cpp|h|swift|kt|rs|sh|bash|yaml|yml)(\?|$)/i.test(previewUrl);
                        if (isText && entry.responseBody) {
                            const body = String(entry.responseBody).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                            const previewType = ct.includes('json') || ct.includes('javascript') ? 'json' :
                                ct.includes('css') ? 'css' :
                                ct.includes('html') ? 'html' : 'text';
                            const langLabel = previewType === 'json' ? 'JSON / JS' : previewType === 'css' ? 'CSS' : previewType === 'html' ? 'HTML' : 'Text';
                            $content.html(
                                actions + '<div style="flex:1; min-height:0; overflow:auto; padding:0 0 10px;">' +
                                '<div style="font-size:10px; color:#888; margin-bottom:4px; padding:2px 4px; background:#1a1a1a; border-radius:3px; display:inline-block;">' + langLabel + '</div>' +
                                '<pre style="background:#111; padding:8px; border-radius:3px; border:1px solid #333; font-size:11px; line-height:1.5; color:#ddd; white-space:pre-wrap; word-break:break-word; margin:0;">' + body + '</pre></div>'
                            );
                        } else {
                            $content.html(
                                actions + '<div style="color: #888; font-size: 12px; padding: 20px 0; text-align:center;">Preview not available for this type<br><span style="font-size:10px; color:#555;">' + previewUrl.replace(/</g, '&lt;') + '</span></div>'
                            );
                        }
                    }
                    // Bind preview actions
                    $content.find('.lab-open-link').on('click', function(e) {
                        e.stopPropagation();
                        window.open(previewUrl, '_blank');
                    });
                    $content.find('.lab-copy-link').on('click', function(e) {
                        e.stopPropagation();
                        navigator.clipboard.writeText(previewUrl).catch(function() {});
                        const toast = $('<div class="lab-copy-toast">📋 Copied!</div>');
                        $('body').append(toast);
                        requestAnimationFrame(function() {
                            toast.css('opacity', '1');
                        });
                        setTimeout(function() {
                            toast.css('opacity', '0');
                            setTimeout(function() {
                                toast.remove();
                            }, 300);
                        }, 1200);
                    });
                    $content.find('.lab-dl-link').on('click', function(e) {
                        e.stopPropagation();
                        const a = document.createElement('a');
                        a.href = previewUrl;
                        a.download = '';
                        a.target = '_blank';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    });
                } else if (activeTab === 'timing') {
                    const t = entry.timing || {};
                    const total = entry.duration || 0;
                    const bars = [];
                    if (t.dns > 0) bars.push({
                        label: 'DNS',
                        val: t.dns,
                        color: '#9b59b6'
                    });
                    if (t.connect > 0) bars.push({
                        label: 'Connect',
                        val: t.connect,
                        color: '#f39c12'
                    });
                    if (t.ssl > 0) bars.push({
                        label: 'SSL',
                        val: t.ssl,
                        color: '#e74c3c'
                    });
                    if (t.send > 0) bars.push({
                        label: 'Send',
                        val: t.send,
                        color: '#3498db'
                    });
                    if (t.ttfb > 0) bars.push({
                        label: 'TTFB',
                        val: t.ttfb,
                        color: '#2ecc71'
                    });
                    if (t.download > 0) bars.push({
                        label: 'Download',
                        val: t.download,
                        color: '#1abc9c'
                    });
                    const maxBar = Math.max.apply(Math, bars.map(function(b) {
                        return b.val;
                    }).concat([1]));
                    const barHtml = bars.map(function(b) {
                        const pct = (b.val / maxBar * 100).toFixed(1);
                        return '<div class="net-timing-label"><span>' + b.label + '</span><span>' + __labFormatDuration(b.val) + '</span></div>' +
                            '<div class="net-timing-bar" style="width:' + pct + '%; background:' + b.color + ';"></div>';
                    }).join('');
                    $content.html(
                        '<div class="net-detail-section"><div class="net-detail-title">Timing Breakdown</div>' +
                        '<div style="margin-top: 8px;">' + (barHtml || '<div style="color:#777;">No detailed timing available</div>') + '</div>' +
                        '<div style="margin-top: 12px; border-top: 1px solid #333; padding-top: 8px;">' +
                        '<div class="net-timing-label"><span>Total Duration</span><span>' + __labFormatDuration(total) + '</span></div></div></div>'
                    );
                }
            };

            // Initial render
            __labRenderNetworkTable();

            /* === End Module DevTools-Style Network Monitor v19: 2989 === */
            /* === Begin Module Pro Code Editor Engine: 2990 === */
            // ==========================================
            // 13. EXTENSION ULTRA V15: PRO CODE EDITOR ENGINE
            // ==========================================

            function initProCodeEditors() {
                if (typeof CodeMirror === 'undefined') return;

                // --- JS Editor Tabs System ---
                if (!window.__labJsTabs) {
                    try {
                        const saved = localStorage.getItem('lab_js_tabs');
                        if (saved) {
                            window.__labJsTabs = JSON.parse(saved);
                            window.__labJsActiveTab = parseInt(localStorage.getItem('lab_js_active_tab') || '0', 10);
                        }
                    } catch (e) {}
                    if (!window.__labJsTabs) {
                        const savedJs = localStorage.getItem('lab_saved_js') || '';
                        window.__labJsTabs = [{
                            name: 'Tab 1',
                            content: savedJs
                        }];
                        window.__labJsActiveTab = 0;
                    }
                }

                // [FIX v17.2] Bảo vệ CodeMirror Hints khỏi bị che khuất
                (function protectCodeMirrorHints() {
                    setInterval(function() {
                        const hints = document.querySelectorAll('.CodeMirror-hints');
                        hints.forEach(hint => {
                            hint.style.setProperty('display', 'block', 'important');
                            hint.style.setProperty('visibility', 'visible', 'important');
                            hint.style.setProperty('opacity', '1', 'important');
                            hint.style.setProperty('z-index', '2147483647', 'important');
                        });
                    }, 100);
                })();

                function saveJsTabs() {
                    if (window.__labJsTabs) {
                        localStorage.setItem('lab_js_tabs', JSON.stringify(window.__labJsTabs));
                        localStorage.setItem('lab_js_active_tab', String(window.__labJsActiveTab));
                    }
                }

                function renderJsTabs() {
                    const $bar = $('#labJsTabsBar');
                    if (!$bar.length) return;
                    $bar.empty();
                    window.__labJsTabs.forEach((tab, idx) => {
                        const $tab = $('<span class="lab-js-tab"></span>').text(tab.name);
                        if (idx === window.__labJsActiveTab) $tab.addClass('active');
                        if (window.__labJsTabs.length > 1) {
                            const $close = $('<span class="lab-js-tab-close">×</span>');
                            $tab.append($close);
                        }
                        $tab.on('click', function(e) {
                            if ($(e.target).hasClass('lab-js-tab-close')) {
                                e.stopPropagation();
                                if (window.__labJsTabs.length <= 1) return;
                                window.__labJsTabs.splice(idx, 1);
                                if (window.__labJsActiveTab >= idx) window.__labJsActiveTab = Math.max(0, window.__labJsActiveTab - 1);
                                saveJsTabs();
                                renderJsTabs();
                                if (window.__labJsEditor) {
                                    window.__labJsEditor.setValue(window.__labJsTabs[window.__labJsActiveTab].content || '');
                                }
                                return;
                            }
                            // Save current before switching
                            if (window.__labJsEditor) {
                                window.__labJsTabs[window.__labJsActiveTab].content = window.__labJsEditor.getValue();
                            }
                            window.__labJsActiveTab = idx;
                            saveJsTabs();
                            renderJsTabs();
                            if (window.__labJsEditor) {
                                window.__labJsEditor.setValue(window.__labJsTabs[window.__labJsActiveTab].content || '');
                            }
                        });
                        $bar.append($tab);
                    });
                    const $add = $('<span class="lab-js-tab-add">+</span>');
                    $add.on('click', function() {
                        if (window.__labJsEditor) {
                            window.__labJsTabs[window.__labJsActiveTab].content = window.__labJsEditor.getValue();
                        }
                        const newIdx = window.__labJsTabs.length + 1;
                        window.__labJsTabs.push({
                            name: 'Tab ' + newIdx,
                            content: ''
                        });
                        window.__labJsActiveTab = window.__labJsTabs.length - 1;
                        saveJsTabs();
                        renderJsTabs();
                        if (window.__labJsEditor) {
                            window.__labJsEditor.setValue('');
                        }
                    });
                    $bar.append($add);
                }

                const jsTextarea = document.getElementById('labJsInput');
                if (jsTextarea && !window.__labJsEditor) {
                    window.__labJsEditor = CodeMirror.fromTextArea(jsTextarea, {
									    mode: 'javascript',
									    theme: 'dracula',
									    lineNumbers: true,
									    matchBrackets: true,
									    autoCloseBrackets: true,
									    tabSize: 4,
									    indentUnit: 4,
									    lineWrapping: true,
									    foldGutter: true,
									    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
									    hintOptions: {
									        hint: CodeMirror.hint.javascript
									    },
									    extraKeys: {
									        'Up': function(cm) {
									            if (cm.state.completionActive) {
									                cm.state.completionActive.move(-1);
									            } else {
									                cm.execCommand('goLineUp');
									            }
									        },
									        'Down': function(cm) {
									            if (cm.state.completionActive) {
									                cm.state.completionActive.move(1);
									            } else {
									                cm.execCommand('goLineDown');
									            }
									        },
									        'Enter': function(cm) {
									            if (cm.state.completionActive) {
									                cm.state.completionActive.pick();
									            } else {
									                cm.execCommand('newlineAndIndent');
									            }
									        },
									        'Esc': function(cm) {
									            if (cm.state.completionActive) cm.closeHint();
									        },
									        'Tab': function(cm) {
									            if (cm.state.completionActive) {
									                cm.state.completionActive.pick();
									            } else {
									                cm.replaceSelection('    ');
									            }
									        },
									        'Ctrl-G': function() {
									            $("#labBtnClearConsole").click();
									            $('#panelJs .lab-sub-select').val('#panelConsole').trigger('change');
									            executeJsEngine();
									        },
									        'Ctrl-Enter': function() {
									            $("#labBtnClearConsole").click();
									            $('#panelJs .lab-sub-select').val('#panelConsole').trigger('change');
									            executeJsEngine();
									        },
									        'Ctrl-Space': 'autocomplete',
									        'Ctrl-Q': function(cm) {
									            cm.foldCode(cm.getCursor());
									        }
									    }
									});

									/* =========================================================
									   CẤU HÌNH TỰ ĐỘNG TẠO & GIỮ TỐI THIỂU 20 DÒNG TRỐNG
									   ========================================================= */
									(function(cm) {
									    if (!cm) return;

									    // Chuỗi chứa 19 dấu xuống dòng để tạo ra đúng 20 dòng trống ban đầu
									    const twentyBlankLines = '\n'.repeat(99);

									    // 1. Kiểm tra lúc khởi tạo: Nếu editor rỗng (hoặc chưa có dữ liệu khôi phục), nạp 20 dòng trống
									    if (cm.getValue().trim() === '') {
									        cm.setValue(twentyBlankLines);
									        // Đưa con trỏ chuột về dòng đầu tiên thay vì nằm ở cuối dòng 20
									        cm.setCursor({line: 0, ch: 0});
									    }

									    // 2. Lắng nghe sự kiện thay đổi: Nếu xóa hết sạch, tự động bù lại 20 dòng trống
									    cm.on('change', function(instance) {
									        if (instance.getValue() === '') {
									            instance.setValue(twentyBlankLines);
									            instance.setCursor({line: 0, ch: 0});
									        }
									    });
									})(window.__labJsEditor);


                    // Load initial tab content
                    if (window.__labJsTabs && window.__labJsTabs[window.__labJsActiveTab]) {
                        window.__labJsEditor.setValue(window.__labJsTabs[window.__labJsActiveTab].content || '');
                    }
                    renderJsTabs();

                    // Debounce autocomplete to prevent blinking; exclude arrow keys
                    let __labAutoCompleteTimer = null;
                    window.__labJsEditor.on('keyup', function(cm, event) {
                        // Exclude navigation keys from triggering autocomplete
                        if (event.keyCode >= 33 && event.keyCode <= 40) return; // PageUp/Down, End, Home, Arrow keys
                        if (event.keyCode === 13 || event.keyCode === 27 || event.keyCode === 8 || event.keyCode === 32 || event.keyCode === 17 || event.keyCode === 18 || event.keyCode === 9) return;
                        if (cm.state.completionActive) return;

                        const token = cm.getTokenAt(cm.getCursor());
                        if (token.string && (token.string.length > 1 || token.string === '.' || event.key === '.')) {
                            if (__labAutoCompleteTimer) clearTimeout(__labAutoCompleteTimer);
                            __labAutoCompleteTimer = setTimeout(function() {
                                CodeMirror.commands.autocomplete(cm, null, {
                                    completeSingle: false,
                                    customKeys: {
                                        'Enter': false
                                    }
                                });
                            }, 150);
                        }
                    });

                    window.__labJsEditor.on('change', function(cm) {
                        const code = cm.getValue();
                        $('#labJsInput').val(code);
                        if (window.__labJsTabs && window.__labJsTabs[window.__labJsActiveTab]) {
                            window.__labJsTabs[window.__labJsActiveTab].content = code;
                            saveJsTabs();
                        }
                        localStorage.setItem('lab_saved_js', code);
                    });
                }

                const cssTextarea = document.getElementById('labCssInput');
                if (cssTextarea && !window.__labCssEditor) {
                    window.__labCssEditor = CodeMirror.fromTextArea(cssTextarea, {
                        mode: 'css',
                        theme: 'dracula',
                        lineNumbers: true,
                        matchBrackets: true,
                        autoCloseBrackets: true,
                        tabSize: 4,
                        indentUnit: 4,
                        lineWrapping: true,
                        foldGutter: true,
                        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                        hintOptions: {
                            hint: CodeMirror.hint.css
                        },
                        extraKeys: {
                            'Tab': function(cm) {
                                if (cm.state.completionActive) {
                                    cm.closeHint();
                                } else {
                                    cm.replaceSelection('    ');
                                }
                            },
                            'Esc': function(cm) {
                                if (cm.state.completionActive) cm.closeHint();
                            },
                            'Ctrl-Space': 'autocomplete',
                            'Ctrl-Q': function(cm) {
                                cm.foldCode(cm.getCursor());
                            }
                        }
                    });

                    window.__labCssEditor.on('keyup', function(cm, event) {
                        if (event.keyCode >= 33 && event.keyCode <= 40) return;
                        if (event.keyCode === 13 || event.keyCode === 27 || event.keyCode === 8 || event.keyCode === 32 || event.keyCode === 17 || event.keyCode === 18 || event.keyCode === 9) return;
                        if (cm.state.completionActive) return;
                        const token = cm.getTokenAt(cm.getCursor());
                        if (token.string && (token.string.length > 1 || event.key === ':')) {
                            CodeMirror.commands.autocomplete(cm, null, {
                                completeSingle: false,
                                customKeys: {
                                    'Enter': false
                                }
                            });
                        }
                    });

                    window.__labCssEditor.on('change', function(cm) {
                        const cssCode = cm.getValue();
                        $('#labCssInput').val(cssCode).trigger('input');
                    });
                }

                setTimeout(() => {
                    if (window.__labJsEditor) {
                        window.__labJsEditor.refresh();
                        $('.lab-btn-wrap[data-target="js"]').toggleClass('active', window.__labJsEditor.getOption('lineWrapping'));
                    }
                    if (window.__labCssEditor) {
                        window.__labCssEditor.refresh();
                        $('.lab-btn-wrap[data-target="css"]').toggleClass('active', window.__labCssEditor.getOption('lineWrapping'));
                    }
                }, 300);

                // [UPDATE v16.4] Bind Beautify & Outdent buttons for JS Editor
                $('#labBtnBeautifyJs').on('click', function() {
                    if (window.__labJsEditor && typeof window.js_beautify === 'function') {
                        const raw = window.__labJsEditor.getValue();
                        const formatted = window.js_beautify(raw, {
                            indent_size: 4,
                            space_in_empty_paren: true
                        });
                        window.__labJsEditor.setValue(formatted);
                        $('#labJsInput').val(formatted).trigger('input');
                        localStorage.setItem('lab_saved_js', formatted);
                        if (window.__labJsTabs && window.__labJsTabs[window.__labJsActiveTab]) {
                            window.__labJsTabs[window.__labJsActiveTab].content = formatted;
                            try {
                                localStorage.setItem('lab_js_tabs', JSON.stringify(window.__labJsTabs));
                            } catch (e) {}
                        }
                    } else if (window.__labJsEditor) {
                        if (typeof window.__labAppendLog === 'function') window.__labAppendLog('⚠️ Thư viện js-beautify chưa sẵn sàng.', 'log');
                    }
                });
                $('#labBtnOutdentJs').on('click', function() {
                    if (window.__labJsEditor) {
                        window.__labJsEditor.execCommand('indentLess');
                    }
                });
            }

            // [FIX v17.11] jQuery-based Arrow Key Handler cho Hints
            $(document).on('keydown.labHintsNav', function(e) {
                // Chỉ xử lý khi hints hiển thị
                const $hints = $('.CodeMirror-hints');
                if ($hints.length === 0 || $hints.is(':hidden')) return;

                const $active = $hints.find('.CodeMirror-hint-active');
                let $target = null;

                // Arrow Up
                if (e.key === 'ArrowUp' && e.keyCode === 38) {
                    e.preventDefault();
                    e.stopPropagation();

                    $target = $active.prev('.CodeMirror-hint');
                    if ($target.length) {
                        $active.removeClass('CodeMirror-hint-active');
                        $target.addClass('CodeMirror-hint-active');
                        $target[0].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }
                    return false;
                }

                // Arrow Down
                if (e.key === 'ArrowDown' && e.keyCode === 40) {
                    e.preventDefault();
                    e.stopPropagation();

                    $target = $active.next('.CodeMirror-hint');
                    if ($target.length) {
                        $active.removeClass('CodeMirror-hint-active');
                        $target.addClass('CodeMirror-hint-active');
                        $target[0].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }
                    return false;
                }

                // [NEW] Ctrl+D - Chọn dòng tiếp theo của hints (Down)
                if (e.ctrlKey && (e.key === 'f' || e.key === 'F' || e.keyCode === 70)) {
                    e.preventDefault();
                    e.stopPropagation();

                    const $allHints = $hints.find('.CodeMirror-hint');
                    $target = $active.next('.CodeMirror-hint');

                    if ($target.length) {
                        // Có hint tiếp theo
                        $active.removeClass('CodeMirror-hint-active');
                        $target.addClass('CodeMirror-hint-active');
                        $target[0].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                        //console.log('⬇️ Ctrl+F: Move down to:', $target.text());
                    } else {
                        // Tới cuối rồi, loop lại đầu
                        $active.removeClass('CodeMirror-hint-active');
                        $allHints.first().addClass('CodeMirror-hint-active');
                        $allHints[0].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                        //console.log('🔄 Ctrl+F: Loop back to first:', $allHints.first().text());
                    }
                    return false;
                }

                // [NEW] Ctrl+U - Chọn dòng trước của hints (Up) - tùy chọn
                if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
                    e.preventDefault();
                    e.stopPropagation();

                    $target = $active.prev('.CodeMirror-hint');
                    if ($target.length) {
                        $active.removeClass('CodeMirror-hint-active');
                        $target.addClass('CodeMirror-hint-active');
                        $target[0].scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                        //console.log('⬆️ Ctrl+U: Move up to:', $target.text());
                    }
                    return false;
                }

                // Enter - Chọn hint
                if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                    if ($active.length) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Trigger click trên hint item
                        $active.trigger('click');
                        return false;
                    }
                }

                // Enter - Chọn hint
                if (e.key === 'Enter' && e.keyCode === 13) {
                    if ($active.length) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Trigger click trên hint item
                        $active.trigger('click');
                        return false;
                    }
                }

                // Escape - Đóng hints
                if (e.key === 'Escape' && e.keyCode === 27) {
                    if ($hints.length) {
                        e.preventDefault();
                        $hints.remove();
                        return false;
                    }
                }
            });

            initProCodeEditors();
            /* === End Module Pro Code Editor Engine: 3190 === */
            /* === Begin Module Mini Tree DOM Search: 3191 === */
            // --- MODULE: MINI TREE DOM SEARCH ---
            let miniSearchMatches = [];
            let miniSearchIndex = -1;

            $('#labMiniTreeSearch').on('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    let query = $(this).val().trim().toLowerCase();
                    if (!query) return;

                    // Xóa bôi màu cũ
                    $('#labTreeDomBody .lab-mini-highlight').css({
                        'background': '',
                        'color': ''
                    }).removeClass('lab-mini-highlight');

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
                    $(target).addClass('lab-mini-highlight').css({
                        'background': '#e74c3c',
                        'color': '#fff',
                        'border-radius': '2px',
                        'padding': '2px'
                    });
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // Tắt màu sau 5s
                    setTimeout(() => {
                        $(target).css({
                            'background': '',
                            'color': ''
                        }).removeClass('lab-mini-highlight');
                    }, 5000);
                }
            });
            /* === End Module Mini Tree DOM Search: 3235 === */
            /* === Begin Module Sync Tree Hover to Web Element: 3236 === */
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
            /* === End Module Sync Tree Hover to Web Element: 3255 === */
            /* === Begin Module Right-Click Zoom & Copy: 3256 === */
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
                            navigator.clipboard.writeText(copyText).catch(() => {
                                fallbackCopyEngine(copyText, panelId);
                            });
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
            /* === End Module Right-Click Zoom & Copy: 3296 === */
            /* === Begin Module Pro Max Engine V16.1 (Smart Panel Switch): 3297 === */
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
                        setTimeout(() => {
                            $(`.lab-btn-max[data-target="${savedMaxPanel}"]`).trigger('click');
                        }, 150);
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
                    if (isEsc) {
                        $("#labBtnMaximizeDashboard").click();
                    }
                }, true);

                const subSelectHtml = `<select class="lab-sub-select" title="Chế độ xem phụ bên phải (rộng 3/7)">
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
                    const css = `<style id="fontSizeLab">.CodeMirror{font-size:${px}px!important;line-height:${ln}px}</style>`;
                    $("body").append(css);
                    if (window.__labJsEditor) window.__labJsEditor.refresh();
                    if (window.__labCssEditor) window.__labCssEditor.refresh();
                });

                $(document).on('click', '.lab-btn-wrap', function(e) {
                    e.stopPropagation();
                    const target = $(this).data('target');
                    let cm;
                    if (target === 'js') cm = window.__labJsEditor;
                    else if (target === 'css') cm = window.__labCssEditor;
                    if (!cm) return;
                    const newState = !cm.getOption('lineWrapping');
                    cm.setOption('lineWrapping', newState);
                    $(this).toggleClass('active', newState);
                    cm.refresh();
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
                    if (targetPanelId === 'none') {
                        closeSubPanel();
                        return;
                    }
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
            /* === End Module Pro Max Engine V16.1 (Smart Panel Switch): 3467 === */
            /* === Begin Module Safe Patch V16.3 (UI/Drag/CM Isolation): 3468 === */
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
                        try {
                            localStorage.setItem(LS_CONSOLE_KEY, $consoleLog.html() || '');
                        } catch (err) {}
                    }, 120);
                }

                function v163SaveTreeHistory() {
                    clearTimeout(v163TreeSaveTimer);
                    v163TreeSaveTimer = setTimeout(() => {
                        try {
                            let htmlContent = $treeDomBody.html() || '';
                            // [UPDATE] Tránh lỗi quá tải dữ liệu LocalStorage gây vỡ code
                            if (htmlContent.length > 4000000) {
                                htmlContent = '<div style="color:red; padding:10px;">Dữ liệu Tree DOM quá lớn, đã tự động dọn dẹp để bảo vệ bộ nhớ.</div>';
                            }
                            localStorage.setItem(LS_TREE_KEY, htmlContent);
                            if (v163CurrentTreeElement) localStorage.setItem(LS_TREE_TARGET_KEY, v163CurrentTreeElement.outerHTML || '');
                        } catch (err) {
                            window.__labAppendLog('Lỗi quá tải dung lượng lưu Tree DOM, đang dọn dẹp...', 'error');
                        }
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

                if ($consoleLog[0]) consoleObserver.observe($consoleLog[0], {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
                if ($treeDomBody[0]) treeObserver.observe($treeDomBody[0], {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true,
                    attributeFilter: ['class', 'style']
                });

                // [UPDATE] Nâng cấp Event Delegation cho nút Mở Rộng Cây Dom (Phục hồi 100% khi reload)
                $treeDomBody.off('click.v163TreeToggle').on('click.v163TreeToggle', '.tree-toggle', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
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
                    e.preventDefault();
                    e.stopPropagation();
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
                const $btndownhtmml = $('<button class="lab-mini-btn" id="labBtnCollapseAllTree" style="margin-right: 4px;" title="Thu gọn/Mở rộng tất cả">⤓ </button>');
                $('#panelTreeDom .lab-panel-actions').prepend($btndownhtmml);

                function v163SetCurrentTreeElement(element) {
                    if (!element || element.nodeType !== 1) return;
                    v163CurrentTreeElement = element;
                    try {
                        localStorage.setItem(LS_TREE_TARGET_KEY, element.outerHTML || '');
                    } catch (err) {}
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
                    // Nếu lỗi hoặc không hợp lệ, trả về mảng rỗng dạng chuỗi "[]"
                    if (!rootElement || rootElement.nodeType !== 1) return "[]";

                    const links = [];
                    const $root = $(rootElement);

                    const targetSelector = customSelector.trim() || 'a[href]';

                    $root.find(targetSelector).each(function() {
                        if ($(this).is('a[href]')) {
                            links.push(this);
                        } else {
                            $(this).find('a[href]').each(function() {
                                if (!links.includes(this)) links.push(this);
                            });
                        }
                    });

                    if ($root.is(targetSelector) && $root.is('a[href]')) {
                        if (!links.includes(rootElement)) links.push(rootElement);
                    }

                    // Tạo mảng dữ liệu sạch trước
                    const rawDataArray = links.map(a => {
                        const href = a.href || $(a).attr('href') || '';
                        let name = '';
                        const $a = $(a);

                        const attrTypes = ['title', 'alt', 'data-title', 'data-alt', 'src', 'name'];

                        if (extractType === 'default') {
                            name = $a.text();
                        } else if (attrTypes.includes(extractType)) {
                            name = $a.attr(extractType) || $a.find(`[${extractType}]`).first().attr(extractType) || '';
                        } else {
                            const $targetTag = $a.find(extractType);
                            name = $targetTag.length ? $targetTag.text() : $a.text();
                        }

                        name = name.replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim();

                        if (name.length < 4 || !href) {
                            return null;
                        }

                        const cleanLink = href.replace(/^https?:\/\/[^\/]+/i, "");

                        // Ở đây trả về Object thông thường
                        return {
                            link: cleanLink,
                            name: name
                        };
                    }).filter(item => item !== null);

                    // THAY ĐỔI Ở ĐÂY: Chuyển toàn bộ mảng thành một chuỗi JSON duy nhất trước khi return
                    // Thay vì chỉ return JSON.stringify(rawDataArray);
										return JSON.stringify(JSON.stringify(rawDataArray));

                }

                $btnQuickExtract.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("#labBtnClearConsole").click();
                    $("#quick-extract-modal").remove();

                    const options = ['title', 'src', 'alt', 'data-title', 'data-alt', 'h1', 'h2', 'h3', 'span', 'p', 'b', 'i'];

                    // GIAO DIỆN MỚI: Bổ sung trường nhập Cố định Phạm vi CSS Selector
                    const $popup = $(`<div id="quick-extract-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999999999999!important; display:flex; align-items:center; justify-content:center; font-family:Arial, sans-serif;">
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
                    $('#btn-extract-cancel').on('click', function() {
                        $popup.remove();
                    });
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
                        geoBtnTarget: 0,
                        geoBtnParent: 1,
                        geoBtnGrand: 2,
                        geoBtnGreatGrand: 3,
                        geoBtnGreatGreatGrand: 4,
                        geoBtnAncestors: 5,
                        geoBtnLayer7: 6,
                        geoBtnLayer8: 7,
                        geoBtnLayer9: 8,
                        geoBtnLayer10: 9
                    };
                    if (btnId === 'geoBtnReverseDown') {
                        setTimeout(() => v163SetActiveLayerByDepth(Math.max(0, v163ActiveDepth - 1)), 20);
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
                    try {
                        localStorage.setItem(LS_SNIFFER_POS_KEY, JSON.stringify({
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height
                        }));
                    } catch (err) {}
                }

                function v163RestoreSnifferPosition() {
                    if (!$snifferPanel.length) return;
                    try {
                        const raw = localStorage.getItem(LS_SNIFFER_POS_KEY);
                        if (!raw) return;
                        const pos = JSON.parse(raw);
                        if (!pos || typeof pos !== 'object') return;
                        $snifferPanel.addClass('lab-v163-user-positioned').css({
                            top: Math.max(5, pos.top) + 'px',
                            left: Math.max(5, pos.left) + 'px',
                            right: 'auto',
                            width: Math.max(240, pos.width) + 'px',
                            height: Math.max(160, pos.height) + 'px'
                        });
                        v163UserMovedSniffer = true;
                    } catch (err) {}
                }
                v163RestoreSnifferPosition();

                const oldSyncSnifferLayout = typeof syncSnifferLayout === 'function' ? syncSnifferLayout : null;
                if (oldSyncSnifferLayout && !window.__labV163SyncSnifferWrapped) {
                    syncSnifferLayout = function() {
                        if (v163UserMovedSniffer && !$snifferPanel.hasClass('lab-panel-hidden')) {
                            $snifferPanel.css('display', 'flex');
                            return;
                        }
                        oldSyncSnifferLayout.apply(this, arguments);
                    };
                    window.__labV163SyncSnifferWrapped = true;
                }

                $snifferPanel.off('mousedown.v163Drag').on('mousedown.v163Drag', '.lab-panel-header', function(e) {
                    if ($(e.target).closest('button, select, input, textarea').length) return;
                    e.preventDefault();
                    e.stopPropagation();

                    const rect = $snifferPanel[0].getBoundingClientRect();
                    const startX = e.clientX,
                        startY = e.clientY,
                        startLeft = rect.left,
                        startTop = rect.top;

                    $snifferPanel.addClass('lab-v163-user-positioned').css({
                        left: startLeft + 'px',
                        top: startTop + 'px',
                        right: 'auto'
                    });

                    $(window).on('mousemove.v163SnifferDrag', function(moveEvent) {
                        $snifferPanel.css({
                            left: Math.max(0, Math.min(window.innerWidth - 80, startLeft + moveEvent.clientX - startX)) + 'px',
                            top: Math.max(0, Math.min(window.innerHeight - 40, startTop + moveEvent.clientY - startY)) + 'px',
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
                    e.preventDefault();
                    e.stopPropagation();
                    const isTopResizer = $(this).hasClass('resizer-top');
                    const rect = $snifferPanel[0].getBoundingClientRect();
                    const startX = e.clientX,
                        startY = e.clientY,
                        startW = rect.width,
                        startH = rect.height,
                        startTop = rect.top;

                    $snifferPanel.addClass('lab-v163-user-positioned').css({
                        left: rect.left + 'px',
                        top: rect.top + 'px',
                        right: 'auto'
                    });

                    $(window).on('mousemove.v163SnifferResize', function(moveEvent) {
                        if (isTopResizer) {
                            const newTop = Math.max(0, Math.min(startTop + moveEvent.clientY - startY, startTop + startH - 160));
                            const newHeight = Math.max(160, startH - (moveEvent.clientY - startY));
                            $snifferPanel.css({
                                top: newTop + 'px',
                                height: Math.min(window.innerHeight - newTop - 8, newHeight) + 'px'
                            });
                        } else {
                            $snifferPanel.css({
                                width: Math.min(window.innerWidth - rect.left - 8, Math.max(240, startW + moveEvent.clientX - startX)) + 'px',
                                height: Math.min(window.innerHeight - rect.top - 8, Math.max(160, startH + moveEvent.clientY - startY)) + 'px'
                            });
                        }
                    });

                    $(window).on('mouseup.v163SnifferResize', function() {
                        $(window).off('mousemove.v163SnifferResize mouseup.v163SnifferResize');
                        v163UserMovedSniffer = true;
                        v163SaveSnifferPosition();
                    });
                });

                function v163EscapeText(value) {
                    return $('<div>').text(value == null ? '' : String(value)).html();
                }

                function v163FormatMaybeJson(value) {
                    if (value == null) return '';
                    if (typeof value === 'object') {
                        try {
                            return JSON.stringify(value, null, 2);
                        } catch (err) {
                            return String(value);
                        }
                    }
                    const str = String(value);
                    try {
                        return JSON.stringify(JSON.parse(str), null, 2);
                    } catch (err) {
                        return str;
                    }
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
                    if (!defaultOpen) {
                        $toggle.addClass('collapsed');
                        $children.addClass('hidden').hide();
                    }

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
                                else {
                                    const $temp = $('<textarea>').val(url).appendTo('body').select();
                                    document.execCommand('copy');
                                    $temp.remove();
                                }
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
                    __labRenderNetworkTable();
                };

                if (typeof window.__labRenderSnifferTree === 'function') window.__labRenderSnifferTree();

                setTimeout(() => {
                    if (window.__labJsEditor) window.__labJsEditor.refresh();
                    if (window.__labCssEditor) window.__labCssEditor.refresh();
                }, 500);
            })();
            /* === End Module Safe Patch V16.3 (UI/Drag/CM Isolation): 4044 === */
            /* === Begin Module Full-Screen HTML Source Viewer  3496: 4045 === */
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
    const modalHtml = `<div id="labHtmlSourceModal">
        <div class="lab-html-modal-header">
            <span class="lab-html-modal-title"></span>

            <!-- CẢI TIẾN: Bộ nạp URL và Tùy chọn Fetch qua Google Script Proxy -->
            <div style="display: flex !important; align-items: center !important; gap: 6px !important; background: #2c3e50; padding: 4px 8px; border-radius: 4px;">
                <input type="text" id="labHtmlUrlInput" placeholder="Đường dẫn trang mới (e.g. /categories)..." style="width: 100px !important;">

                <select id="labHtmlFetchMode" style="width: 150px !important; background: #34495e; color: #fff; border: 1px solid #7f8c8d; padding: 2px 4px; border-radius: 3px; cursor: pointer; height: 26px;">
                    <option value="direct">🌐 Fetch Trực Tiếp</option>
                    <option value="gas_proxy">⚡ Google Script (Proxy)</option>
                    <option value="gas_scraper">🕷️ Google Script (Scraper API)</option>
                </select>

                <label id="labHtmlRenderLabel" style="display: none; align-items: center; gap: 4px; color: #fff; font-size: 12px; cursor: pointer; user-select: none;">
                    <input type="checkbox" id="labHtmlRenderToggle"> Render JS
                </label>

                <button class="lab-html-search-btn" id="labHtmlUrlFetchBtn" style="background: #2980b9 !important;" title="Fetch trang mới">⚡ Fetch</button>
            </div>

            <div class="lab-html-search-wrap">
                <input type="text" style="width: 100px !important;" class="lab-html-search-input" id="labHtmlSearchInput" placeholder="Nhập từ khóa cần lọc (thẻ, class, id, text)...">
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

    // Các Element mới được thêm vào và cập nhật bổ sung
    const $copySourceBtn = $('#labHtmlCopySourceBtn');
    const $urlInput = $('#labHtmlUrlInput');
    const $urlFetchBtn = $('#labHtmlUrlFetchBtn');
    const $fetchMode = $('#labHtmlFetchMode');
    const $renderLabel = $('#labHtmlRenderLabel');
    const $renderToggle = $('#labHtmlRenderToggle');

    let parsedHtmlDocument = null;
    let searchMatches = [];
    let currentMatchIndex = -1;
    let sidebarOpen = false;
    let lastSearchQuery = '';

    // Khởi tạo biến toàn cục lưu trữ mã nguồn HTML thô thu được
    window.sourceHTML = '';

    // Ẩn/Hiện checkbox Render JS tùy thuộc vào việc chọn chế độ Scraper API
    $fetchMode.on('change', function() {
        if ($(this).val() === 'gas_scraper') {
            $renderLabel.css('display', 'flex');
        } else {
            $renderLabel.css('display', 'none');
        }
    });

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
            const txt = node.textContent.trim();
            if (txt) {
                $header.append($(`<span class="lab-dom-text">${escapeHTML(txt)}</span>`));
            }
            $header.append($(`<span class="lab-dom-tag-close">&lt;/<span class="tag-name">${tagName}</span>&gt;</span>`));
            $nodeWrap.append($header);
        }

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

    // HÀM TỔNG HỢP NÂNG CẤP: Fetch mã nguồn hỗ trợ qua Google Script Proxy hoặc Direct
    // fetch Google script
    // window._$ = function (htmlOrBlock)

    window.executeFetchSource = function(targetUrl,$check) {
        $treeContainer.html('<div style="color:#aaa; padding:10px;">⌛ Đang phân tích và dựng bản đồ DOM Tree nguồn...</div>');

        let finalRequestUrl = targetUrl;
        const selectedMode = $fetchMode.val();

        // Xử lý cấu trúc URL endpoint gọi lên Google Script App của bạn
        if (selectedMode === 'gas_proxy' || selectedMode === 'gas_scraper') {
            const baseGasUrl = "https://script.google.com/macros/s/AKfycbyxM6-_Q-DG_2l1hm1bM_ASVA74OPywVPk3hpm2FbpT78gGzBEpDN81Ty6tla8DTO27/exec";
            const checkParam = (selectedMode === 'gas_scraper') ? "true" : "false";
            const renderParam = $renderToggle.is(':checked') ? "true" : "false";

            finalRequestUrl = `${baseGasUrl}?url=${encodeURIComponent(targetUrl)}&check=${checkParam}&render=${renderParam}`;
        }

        fetch(finalRequestUrl)
            .then(response => response.text())
            .then(html => {
                // Đổ dữ liệu thô thu được vào biến toàn cục sourceHTML

                window.sourceHTML = html;
                if ($check == true) {
                	return false;
                }

                parsedHtmlDocument = new DOMParser().parseFromString(html, 'text/html');
                $treeContainer.empty();

                // Tiến hành dựng cây từ thẻ gốc HTML
                const treeRoot = createTreeDOM(parsedHtmlDocument.documentElement);
                const treeRoot2 = createTreeDOM(parsedHtmlDocument.documentElement);
                if (treeRoot) {
                    $treeContainer.html(treeRoot);
                    $("#labTreeDomBody").html(treeRoot2);
                    $(treeRoot).children('.lab-dom-header').trigger('click');
                }
								//labTreeDomBody


                $modal.addClass('lab-html-modal-active');
                $searchInput.val('');
                lastSearchQuery = '';
                clearSearch();
            })
            .catch(err => {
                parsedHtmlDocument = null;
                window.sourceHTML = '';
                $treeContainer.html('<div style="color:#c0392b; padding:10px;">❌ Lỗi nạp nguồn mã: ' + err + '</div>');
            });
    }

    $viewSourceBtn.on('click', function(e) {
        e.stopPropagation();
        if (parsedHtmlDocument) {
            $modal.addClass('lab-html-modal-active');
            return;
        }
        executeFetchSource(window.location.href);
    });

    $urlFetchBtn.on('click', function(e) {
        e.stopPropagation();
        let inputUrl = $urlInput.val().trim();
        if (!inputUrl) {
            alert('Vui lòng nhập đường dẫn URL hoặc Endpoint cần Fetch!');
            return;
        }

        // Nếu người dùng nhập link tương đối, tự map với hostname hiện tại trước khi gửi lên Proxy
        if (inputUrl.startsWith('/') && !inputUrl.startsWith('//')) {
            try {
                inputUrl = new URL(inputUrl, window.location.href).href;
            } catch(e) {}
        }
        executeFetchSource(inputUrl);
    });

    $urlInput.on('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $urlFetchBtn.trigger('click');
        }
    });

    // GIỮ NGUYÊN CÁC SỰ KIỆN SAO CHÉP MÃ NGUỒN AN TOÀN ĐÃ CÓ CỦA BẠN
    $copySourceBtn.on('click', function(e) {
        e.stopPropagation();
        if (!parsedHtmlDocument) {
            alert('Không tìm thấy dữ liệu nguồn để sao chép!');
            return;
        }

        let finalCleanHTML = '';

        try {
            const documentClone = parsedHtmlDocument.cloneNode(true);
            if (documentClone && documentClone.documentElement) {
                const allScriptTags = documentClone.querySelectorAll('script');
                allScriptTags.forEach(script => script.remove());

                const allElements = documentClone.querySelectorAll('*');
                allElements.forEach(element => {
                    if (element.attributes && element.attributes.length > 0) {
                        const attrs = Array.from(element.attributes);
                        attrs.forEach(attr => {
                            if (attr.name.toLowerCase().startsWith('on')) {
                                element.removeAttribute(attr.name);
                            }
                        });
                    }

                    ['src', 'href'].forEach(attrName => {
                        if (element.hasAttribute(attrName)) {
                            let attrVal = element.getAttribute(attrName).trim();
                            if (attrVal && !/^(https?:|===|\/\/|data:|javascript:|#)/i.test(attrVal)) {
                                try {
                                    let absoluteUrl = new URL(attrVal, window.location.href).href;
                                    element.setAttribute(attrName, absoluteUrl);
                                } catch (urlErr) {}
                            }
                        }
                    });
                });
                finalCleanHTML = '<!DOCTYPE html>\n' + documentClone.documentElement.outerHTML;
            } else {
                throw new Error("Không thể clone phần tử gốc");
            }
        } catch (domError) {
            console.warn("Tầng 1 (DOM) thất bại. Chuyển sang Tầng 2 (Regex)...", domError);
            try {
                let rawHtml = parsedHtmlDocument.documentElement ? parsedHtmlDocument.documentElement.outerHTML : parsedHtmlDocument.body.innerHTML;
                rawHtml = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                rawHtml = rawHtml.replace(/\s+on[a-zA-Z]+\s*=\s*(["'])(.*?)\1/gi, '');
                rawHtml = rawHtml.replace(/\s+on[a-zA-Z]+\s*=\s*[^>\s]+/gi, '');

                rawHtml = rawHtml.replace(/(\b(src|href)\s*=\s*(["']))([^"'\s>]+)\3/gi, (match, p1, p2, p3, p4) => {
                    let urlVal = p4.trim();
                    if (urlVal && !/^(https?:|===|\/\/|data:|javascript:|#)/i.test(urlVal)) {
                        try {
                            return p1 + new URL(urlVal, window.location.href).href + p3;
                        } catch (e) { return match; }
                    }
                    return match;
                });

                finalCleanHTML = '<!DOCTYPE html>\n' + rawHtml;
            } catch (regexError) {
                alert('❌ Không thể xử lý mã nguồn của trang này!');
                return;
            }
        }

        if (finalCleanHTML) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(finalCleanHTML)
                    .then(() => { showToastSuccess("Đã sao chép Source Sạch!", e.clientX, e.clientY); })
                    .catch(() => { executeFallbackCopyOrDownload(finalCleanHTML, e.clientX, e.clientY); });
            } else {
                executeFallbackCopyOrDownload(finalCleanHTML, e.clientX, e.clientY);
            }
        }
    });

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
        } catch (err) {}

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
            alert('⚠️ Quyền Sao chép bị chặn, file sạch đã được tải về máy thành công!');
        } catch (downloadError) {
            alert('❌ Thất bại: Không thể xuất file!');
        }
    }

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

    $treeContainer.on('click', '.tag-name, .tag-attr, .lab-dom-text, .lab-dom-pure-text', function(e) {
        e.stopPropagation();
        let copyText = '';
        if ($(this).hasClass('tag-attr')) {
            copyText = $(this).attr('data-val') || '';
        } else {
            copyText = $(this).text();
        }

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

        $treeContainer.find('.tag-name, .attr-name, .attr-val, .lab-dom-text, .lab-dom-pure-text, .lab-dom-comment').each(function() {
            const $el = $(this);
            const txt = $el.text();
            const startIdx = txt.toLowerCase().indexOf(lowerQuery);

            if (startIdx !== -1) {
                searchMatches.push($el);
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
        if (index < 0) index = searchMatches.length - 1;
        if (index >= searchMatches.length) index = 0;
        currentMatchIndex = index;

        const $targetElement = searchMatches[index];

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
        if (searchMatches.length > 0) jumpToMatch(currentMatchIndex - 1);
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


/* === Begin Module Resize Main Panel === */
(function() {
    const panel = document.getElementById('labMainDashboard');
    if (!panel) {
        console.error("Không tìm thấy phần tử có id là 'labMainDashboard'");
        return;
    }

    const resizer = document.createElement('div');
    resizer.id = 'labPanelResizer';

    Object.assign(resizer.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '6px',
        cursor: 'ns-resize',
        zIndex: '99999',
        background: 'transparent',
        transition: 'background 0.2s'
    });

    resizer.addEventListener('mouseenter', () => resizer.style.background = 'rgba(69, 162, 158, 0.4)');
    resizer.addEventListener('mouseleave', () => resizer.style.background = 'transparent');

    if (window.getComputedStyle(panel).position === 'static') {
        panel.style.position = 'relative';
    }

    panel.insertBefore(resizer, panel.firstChild);

    let isResizing = false;

    resizer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isResizing = true;
        resizer.style.background = 'rgba(102, 252, 241, 0.7)';
        document.body.style.cursor = 'ns-resize';
    });

    window.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        let newHeight = window.innerHeight - e.clientY;
        if (newHeight < 44) newHeight = 44;
        if (newHeight > window.innerHeight * 0.95) newHeight = window.innerHeight * 0.95;
        panel.style.height = newHeight + 'px';
    });

    window.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            resizer.style.background = 'transparent';
            document.body.style.cursor = 'default';
        }
    });
})();

						/*===  End Module Resize Main Panel   ===*/


            //[UPDATE 2.0] END Full-screen HTML Source Viewer Feature
            /* === End Module Full-Screen HTML Source Viewer  3496: 4791 === */
            /* === Begin Module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor (FIXED): 4792 === */
            // ==========================================
            // 14. MODULE: ANTI-HIJACK SHIELD & CSS EXTRACTOR (FIXED)
            // ==========================================
            // CHANGES v17.1:
            // - Wrapped entire module in try-catch to prevent crash
            // - Added CSS.escape polyfill for older browsers
            // - Defined $cssInput and $jsInput inside module
            // - Moved module OUTSIDE window.addEventListener('load') to prevent blocking
            // - Added wait-for-DOM logic instead of relying on load event
            // - Fixed shield whitelist to include all panels
            // - Shield button now appends with fallback if #labRestoreBar missing
            // - Shield default OFF (no accidental blocking on first install)

            (function() {
                'use strict';

                try {
                    // --- Polyfills ---
                    if (!window.CSS || !window.CSS.escape) {
                        window.CSS = window.CSS || {};
                        window.CSS.escape = function(s) {
                            if (typeof s !== 'string') return '';
                            return s.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
                        };
                    }

                    // --- Globals ---
                    const $cssInput = window.$ && $('#labCssInput').length ? $('#labCssInput') : null;
                    const $jsInput = window.$ && $('#labJsInput').length ? $('#labJsInput') : null;

                    // --- Helpers ---
                    function __labEscHtml(str) {
                        return str ? String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
                    }

                    function getLabElementBySelector(selector) {
                        try {
                            return document.querySelector(selector);
                        } catch (e) {
                            return null;
                        }
                    }

                    function selectorFromElement(el) {
                        if (!el) return 'unknown';
                        if (el.id) return '#' + CSS.escape(el.id);
                        if (el.className && typeof el.className === 'string') {
                            const cls = el.className.trim().split(/\s+/).filter(Boolean).map(c => CSS.escape(c)).join('.');
                            if (cls) return '.' + cls;
                        }
                        return el.tagName.toLowerCase();
                    }

                    // ==========================================================
                    // 14.1 ANTI-HIJACK SHIELD
                    // ==========================================================
                    const SHIELD_KEY = 'lab_anti_hijack_enabled_v17';
                    let shieldActive = false; // Default OFF to avoid blocking on first install

                    // Saved originals
                    let _origOpen = window.open;
                    let _origAssign = window.location.assign;
                    let _origReplace = window.location.replace;
                    let _origSetInterval = window.setInterval;
                    let _origSetTimeout = window.setTimeout;
                    let _origRAF = window.requestAnimationFrame;
                    const shieldTimers = [];
                    const shieldRAFs = [];

                    // EXTENDED whitelist: includes all Lab panels and CodeMirror
                    const LAB_UI_SELECTORS = '#labMainDashboard, .lab-fab-wrapper, #labCssQuickMenu, #labCssExtractMenu, #labHtmlSourceModal, #panelSnifferLab, #quick-extract-modal, .CodeMirror-hints, .lab-overlay-blocker, .lab-html-toast, #panelJs, #panelCss, #panelConsole, #panelTree, .CodeMirror, .CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-gutters, .CodeMirror-linenumber, .CodeMirror-lines, .lab-editor-container, .lab-panel, .lab-sidebar, .lab-restore-bar, .lab-tree-dom, .lab-console-log';

                    function isInsideLabUI(el) {
                        if (!el || !el.closest) return false;
                        try {
                            return !!el.closest(LAB_UI_SELECTORS);
                        } catch (e) {
                            return false;
                        }
                    }

                    // Rapid-click backdoor for shield
                    let __shieldClickTracker = {};
                    let __shieldBackdoorTimer = null;

                    function shieldClickHandler(e) {
                        if (!shieldActive) return;
                        const path = e.composedPath ? e.composedPath() : [e.target];
                        for (let node of path) {
                            if (node instanceof Element && isInsideLabUI(node)) return;
                        }

                        // Backdoor: rapid click on same element (3+ times within 500ms) disables shield temporarily
                        const target = e.target;
                        if (target && target instanceof Element) {
                            const key = target.outerHTML || String(target);
                            const now = Date.now();
                            if (!__shieldClickTracker[key]) __shieldClickTracker[key] = [];
                            __shieldClickTracker[key].push(now);
                            // Keep only clicks within last 500ms
                            __shieldClickTracker[key] = __shieldClickTracker[key].filter(t => now - t < 500);
                            if (__shieldClickTracker[key].length >= 3) {
                                if (typeof window.__labAppendLog === 'function') window.__labAppendLog('[Shield] Backdoor triggered: rapid click detected — disabling shield for 3s', 'return');
                                disableShield();
                                if (__shieldBackdoorTimer) clearTimeout(__shieldBackdoorTimer);
                                __shieldBackdoorTimer = setTimeout(() => {
                                    enableShield();
                                }, 3000);
                                return; // allow this click through
                            }
                        }

                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        if (typeof window.__labAppendLog === 'function') {

                        }
                    }

                    function enableShield() {
                        if (shieldActive) return;
                        shieldActive = true;
                        localStorage.setItem(SHIELD_KEY, 'true');

                        // 1. Chặn click vẫn hoạt động bình thường
                        document.addEventListener('click', shieldClickHandler, true);
                        document.addEventListener('mousedown', shieldClickHandler, true);
                        document.addEventListener('mouseup', shieldClickHandler, true);

                        // 2. THAY VÌ GHI ĐÈ LOCATION (Gây crash), ta sử dụng "BeforeUnload" để chặn thoát trang
                        // Điều này hiệu quả hơn và không bao giờ bị lỗi Read-Only
                        window.addEventListener('beforeunload', blockUnloadHandler, true);
                        // 2.5. Add listeners to shadow DOM hosts
                        document.querySelectorAll("*[shadowroot]").forEach(function(el) {
                            if (el.shadowRoot) {
                                el.shadowRoot.addEventListener("click", shieldClickHandler, true);
                                el.shadowRoot.addEventListener("mousedown", shieldClickHandler, true);
                                el.shadowRoot.addEventListener("mouseup", shieldClickHandler, true);
                            }
                        });

                        // 3. Chặn window.open an toàn
                        try {
                            window.open = function() {
                                if (typeof window.__labAppendLog === "function") {
                                    window.__labAppendLog("[Shield] Blocked window.open()", "return");
                                }
                                return null;
                            };

                        } catch (e) {}

                        // 4. Chặn Timer (vẫn dùng logic cũ của bạn vì nó an toàn)
                        window.setInterval = function() {
                            return -1;
                        };

                        // ... (Giữ nguyên phần setTimeout và requestAnimationFrame như cũ) ...

                        updateShieldBtn();
                        if (typeof window.__labAppendLog === 'function') window.__labAppendLog('[Shield] ENABLED', 'return');
                    }

                    // Hàm hỗ trợ để chặn thoát trang
                    function blockUnloadHandler(e) {
                        if (shieldActive) {
                            e.preventDefault();
                            e.returnValue = 'Bạn có muốn rời khỏi trang này?';
                            return 'Bạn có muốn rời khỏi trang này?';
                        }
                    }

                    function disableShield() {
                        if (!shieldActive) return;
                        shieldActive = false;
                        localStorage.setItem(SHIELD_KEY, 'false');
                        try {
                            document.removeEventListener('click', shieldClickHandler, true);
                            document.removeEventListener('mousedown', shieldClickHandler, true);
                            // Remove shadow DOM listeners
                            document.querySelectorAll("*[shadowroot]").forEach(function(el) {
                                if (el.shadowRoot) {
                                    el.shadowRoot.removeEventListener("click", shieldClickHandler, true);
                                    el.shadowRoot.removeEventListener("mousedown", shieldClickHandler, true);
                                    el.shadowRoot.removeEventListener("mouseup", shieldClickHandler, true);
                                }
                            });
                            document.removeEventListener('mouseup', shieldClickHandler, true);

                            window.open = _origOpen;
                            window.location.assign = _origAssign;
                            window.location.replace = _origReplace;
                            window.setInterval = _origSetInterval;
                            window.setTimeout = _origSetTimeout;
                            window.requestAnimationFrame = _origRAF;

                            shieldTimers.forEach(id => {
                                try {
                                    clearTimeout(id);
                                } catch (e) {}
                            });
                            shieldTimers.length = 0;
                            shieldRAFs.forEach(id => {
                                try {
                                    cancelAnimationFrame(id);
                                } catch (e) {}
                            });
                            shieldRAFs.length = 0;
                        } catch (e) {
                            window.__labAppendLog('Có lỗi xảy ra', 'return');
                        }
                        updateShieldBtn();
                        if (typeof window.__labAppendLog === 'function') window.__labAppendLog('[Shield] DISABLED', 'return');
                    }

                    function toggleShield() {
                        shieldActive ? disableShield() : enableShield();
                    }

                    // UI Button with fallback
                    let $shieldBtn = null;

                    function createShieldBtn() {
                        if (!window.$) return;
                        $shieldBtn = $('<button class="lab-mini-btn" id="labBtnAntiHijack" style="margin-right:4px;" title="Bật/Tắt Anti-Hijack Shield">🛡️ OFF</button>');
                        const $target = $('#labRestoreBar .lab-restore-group').first();
                        if ($target.length) {
                            $target.append($shieldBtn);
                        } else {
                            // Fallback: append to dashboard header or body
                            const $header = $('#labMainDashboard .lab-header');
                            if ($header.length) {
                                $header.append($shieldBtn);
                            } else {
                                $shieldBtn.css({
                                    position: 'fixed',
                                    bottom: '10px',
                                    right: '10px',
                                    zIndex: 2147483647
                                }).appendTo('body');
                            }
                        }
                        $shieldBtn.on('click', function(e) {
                            toggleShield();
                        });
                        updateShieldBtn();
                    }

                    function updateShieldBtn() {
                        if (!$shieldBtn || !$shieldBtn.length) return;
                        if (shieldActive) {
                            $shieldBtn.css({
                                background: '#e74c3c',
                                color: '#fff',
                                fontWeight: 'bold',
                                border: '1px solid #c0392b'
                            }).text('🛡️ SHIELD ON').attr('title', 'Anti-Hijack Shield đang BẬT — Click để tắt');
                        } else {
                            $shieldBtn.css({
                                background: '#27ae60',
                                color: '#fff',
                                fontWeight: 'normal',
                                border: '1px solid #1e8449'
                            }).text('🛡️ SHIELD OFF').attr('title', 'Anti-Hijack Shield đang TẮT — Click để bật');
                        }
                    }

                    // ==========================================================
                    // 14.2 CSS EXTRACTOR MENU (Shift + Click on Tree DOM)
                    // ==========================================================
                    let $extractMenu = null;
                    let _extractSelector = '';
                    let _extractEl = null;
                    let _extractBlocks = [];

                    function createExtractMenu() {
                        if (!window.$) return;
                        $extractMenu = $(`<div id="labCssExtractMenu" style="
                    position: fixed; display: none; z-index: 2147483647; background: #1e1e1e; border: 1px solid #9b59b6; border-radius: 6px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.85); min-width: 320px; max-width: 420px; font-family: 'Segoe UI', sans-serif; font-size: 12px; overflow: hidden;
                    user-select: none; pointer-events: auto;
                ">
                    <div style="background: #252525; padding: 6px 10px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #f1c40f; font-weight: bold;">🎨 CSS EXTRACTOR</span>
                        <span id="labCssExtractTarget" style="color: #50fa7b; font-family: monospace; font-weight: bold; background: #111; padding: 2px 6px; border-radius: 3px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
                    </div>
                    <div id="labCssExtractList" style="max-height: 320px; overflow-y: auto; padding: 4px 0;"></div>
                    <div style="background: #111; padding: 6px 10px; border-top: 1px solid #333; display: flex; gap: 4px; flex-wrap: wrap;">
                        <button id="labBtnExtractInline" class="lab-mini-btn" style="font-size:11px; flex:1;">📌 Inline</button>
                        <button id="labBtnExtractSheets" class="lab-mini-btn" style="font-size:11px; flex:1;">📄 Sheets</button>
                        <button id="labBtnExtractComputed" class="lab-mini-btn" style="font-size:11px; flex:1;">🖥️ Computed</button>
                        <button id="labBtnInjectToEditor" class="lab-mini-btn btn-success" style="font-size:11px; flex:1; min-width:80px;">➡️ Editor</button>
                    </div>
                </div>
            `);
                        $('body').append($extractMenu);

                        // Make CSS Extractor draggable via header / border area
                        $extractMenu.on('mousedown.labExtractDrag', function(e) {
                            // Chỉ kéo khi bấm vào vùng header hoặc border, không kéo khi bấm vào nút, row, pre
                            if ($(e.target).closest('button, .lab-extract-row, pre, code, input').length) return;
                            e.preventDefault();
                            e.stopPropagation();
                            const rect = $extractMenu[0].getBoundingClientRect();
                            const startX = e.clientX,
                                startY = e.clientY;
                            const startLeft = rect.left,
                                startTop = rect.top;
                            $(window).on('mousemove.labExtractMove', function(moveEvent) {
                                $extractMenu.css({
                                    left: (startLeft + moveEvent.clientX - startX) + 'px',
                                    top: (startTop + moveEvent.clientY - startY) + 'px',
                                    right: 'auto',
                                    bottom: 'auto'
                                });
                            });
                            $(window).on('mouseup.labExtractMove', function() {
                                $(window).off('mousemove.labExtractMove mouseup.labExtractMove');
                            });
                        });

                        $extractMenu.find('#labBtnExtractInline').on('click', function(e) {
                            e.stopPropagation();
                            const css = getInlineStyleCss(_extractEl);
                            if (css) addBlock('inline style', css);
                            else if (typeof window.__labAppendLog === 'function') window.__labAppendLog('⚠️ Không có inline style.', 'log');
                        });
                        $extractMenu.find('#labBtnExtractSheets').on('click', function(e) {
                            e.stopPropagation();
                            const rules = getStylesheetCssForSelector(_extractSelector);
                            if (rules.length) {
                                rules.forEach((r, i) => addBlock('stylesheet #' + (i + 1), r));
                            } else {
                                if (typeof window.__labAppendLog === 'function') window.__labAppendLog('⚠️ Không tìm thấy rule stylesheet cho ' + _extractSelector, 'log');
                            }
                        });
                        $extractMenu.find('#labBtnExtractComputed').on('click', function(e) {
                            e.stopPropagation();
                            const css = getComputedCss(_extractEl);
                            if (css) addBlock('computed style', css);
                            else if (typeof window.__labAppendLog === 'function') window.__labAppendLog('⚠️ Không có computed style khả dụng.', 'log');
                        });
                        $extractMenu.find('#labBtnInjectToEditor').on('click', function(e) {
                            e.stopPropagation();
                            const selected = _extractBlocks.filter((_, i) => $extractMenu.find('.lab-extract-row').eq(i).hasClass('selected'));
                            const blocks = selected.length ? selected : _extractBlocks;
                            if (!blocks.length) {
                                alert('Chưa có CSS nào. Hãy bấm Inline / Sheets / Computed trước.');
                                return;
                            }
                            const merged = blocks.map(b => b.cssText).join('\n\n');
                            const cur = ($cssInput && $cssInput.val() ? $cssInput.val() : '').trim();
                            const final = cur ? cur + '\n\n/* ===== CSS Extractor Injection ===== */\n' + merged : merged;
                            if ($cssInput && $cssInput.length) $cssInput.val(final).trigger('input');
                            if (window.__labCssEditor && window.__labCssEditor.setValue) {
                                window.__labCssEditor.setValue(final);
                                if (window.__labCssEditor.setCursor) window.__labCssEditor.setCursor(window.__labCssEditor.lineCount(), 0);
                            }
                            if (typeof window.__labAppendLog === 'function') window.__labAppendLog('🎨 Đã chèn ' + blocks.length + ' khối CSS vào CSS Editor.', 'return');
                            $extractMenu.hide();
                        });

                        $(document).on('click.closeCssExtractMenu contextmenu.closeCssExtractMenu', function(e) {
                            if (!$(e.target).closest('#labCssExtractMenu').length) $extractMenu.hide();
                        });
                    }

                    function getInlineStyleCss(el) {
                        if (!el || !el.style || !el.style.cssText) return '';
                        const body = el.style.cssText.split(';').filter(Boolean).map(s => '    ' + s.trim() + ';').join('\n');
                        return `/* Inline Style */\n${selectorFromElement(el)} {\n${body}\n}`;
                    }

                    function getStylesheetCssForSelector(selector) {
                        const results = [];
                        if (!selector) return results;
                        const rawName = selector.replace(/^[.#]/, '');
                        try {
                            for (let sheet of document.styleSheets) {
                                let rules;
                                try {
                                    rules = sheet.cssRules || sheet.rules;
                                } catch (e) {
                                    continue;
                                }
                                if (!rules) continue;
                                for (let rule of rules) {
                                    if (rule.type !== CSSRule.STYLE_RULE) continue;
                                    const selText = rule.selectorText || '';
                                    const parts = selText.split(',').map(s => s.trim());
                                    let hit = false;
                                    for (let p of parts) {
                                        if (p.includes(selector) || p.includes(rawName)) {
                                            hit = true;
                                            break;
                                        }
                                    }
                                    if (hit) results.push(rule.cssText);
                                }
                            }
                        } catch (e) {
                            console.error('[CSS Extractor] Stylesheet error:', e);
                        }
                        return results;
                    }

                    function getComputedCss(el) {
                        if (!el) return '';
                        const computed = window.getComputedStyle(el);
                        const props = ['display', 'visibility', 'position', 'top', 'left', 'right', 'bottom', 'width', 'height', 'margin', 'padding', 'background', 'background-color', 'color', 'font-size', 'font-family', 'font-weight', 'line-height', 'text-align', 'border', 'border-radius', 'opacity', 'transform', 'z-index', 'overflow', 'cursor', 'pointer-events', 'box-shadow', 'text-decoration', 'white-space', 'flex', 'grid', 'gap'];
                        const lines = [];
                        props.forEach(prop => {
                            const val = computed.getPropertyValue(prop);
                            if (val && val !== 'initial' && val !== 'auto' && val !== 'normal' && val !== 'none' && val !== '0px' && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent') {
                                lines.push('    ' + prop + ': ' + val + ';');
                            }
                        });
                        if (!lines.length) return '';
                        return `/* Computed Style (filtered) */\n${selectorFromElement(el)} {\n${lines.join('\n')}\n}`;
                    }

                    function dedupBlocks(blocks) {
                        const seen = new Set();
                        return blocks.filter(b => {
                            if (seen.has(b.cssText)) return false;
                            seen.add(b.cssText);
                            return true;
                        });
                    }

                    function renderExtractList() {
                        if (!$extractMenu) return;
                        const $list = $extractMenu.find('#labCssExtractList');
                        $list.empty();
                        _extractBlocks = dedupBlocks(_extractBlocks);
                        if (!_extractBlocks.length) {
                            $list.html('<div style="padding:8px 12px; color:#888;">Chưa có dữ liệu. Nhấn Inline / Sheets / Computed để trích xuất.</div>');
                            return;
                        }
                        _extractBlocks.forEach((block, idx) => {
                            const $row = $(`<div class="lab-extract-row" data-idx="${idx}" style="padding: 6px 10px; border-bottom: 1px solid #222; cursor: pointer; transition: background 0.15s;">
                        <div style="color: #9b59b6; font-size: 10px; margin-bottom: 2px; font-weight: bold;">${__labEscHtml(block.source)}</div>
                        <pre style="color: #ddd; font-size: 11px; margin: 0; white-space: pre-wrap; word-break: break-word; font-family: Consolas, monospace; max-height: 120px; overflow: auto;">${__labEscHtml(block.cssText)}</pre>
                    </div>
                `);
                            $row.on('click', function() {
                                $(this).toggleClass('selected');
                                $(this).css('background', $(this).hasClass('selected') ? 'rgba(155,89,182,0.25)' : 'transparent');
                            });
                            $list.append($row);
                        });
                    }

                    function addBlock(source, cssText) {
                        if (!cssText || !cssText.trim()) return;
                        _extractBlocks.push({
                            source,
                            cssText: cssText.trim()
                        });
                        renderExtractList();
                    }

                    function openExtractMenu(selector, x, y) {
                        if (!$extractMenu) return;
                        _extractSelector = selector;
                        _extractEl = getLabElementBySelector(selector);
                        _extractBlocks = [];
                        $extractMenu.find('#labCssExtractTarget').text(selector).attr('title', selector);
                        renderExtractList();
                        const w = $extractMenu.outerWidth() || 320;
                        const h = $extractMenu.outerHeight() || 400;
                        let px = x + 12,
                            py = y + 12;
                        if (px + w > window.innerWidth) px = x - w - 12;
                        if (py + h > window.innerHeight) py = window.innerHeight - h - 12;
                        $extractMenu.css({
                            top: Math.max(5, py) + 'px',
                            left: Math.max(5, px) + 'px'
                        }).show();
                    }

                    // Shift+Click handler on Tree DOM
                    document.addEventListener('click', function(e) {
                        const t = e.target;
                        if (!t || !t.closest) return;
                        if (!t.closest('#labTreeDomBody')) return;
                        if (!t.matches('.html-val, .html-attr')) return;
                        if (!e.shiftKey) return;
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        let targetSelector = null;
                        const $t = $(t);
                        if ($t.hasClass('html-val')) {
                            const rawVal = $t.text().trim();
                            const $prevAttr = $t.prevAll('.html-attr').first();
                            if (!$prevAttr.length) return;
                            const attrName = $prevAttr.text().trim().toLowerCase();
                            if (attrName === 'class') {
                                const allClass = '.' + rawVal.split(/\s+/).filter(Boolean).join('.');
                                if (allClass !== '.') targetSelector = allClass;
                            } else if (attrName === 'id') {
                                targetSelector = '#' + rawVal;
                            }
                        } else if ($t.hasClass('html-attr')) {
                            const attrName = $t.text().trim().toLowerCase();
                            const $nextVal = $t.nextAll('.html-val').first();
                            if (!$nextVal.length) return;
                            const rawVal = $nextVal.text().trim();
                            if (attrName === 'class') {
                                const firstClass = rawVal.split(/\s+/).filter(Boolean)[0];
                                if (firstClass) targetSelector = '.' + firstClass;
                            } else if (attrName === 'id') {
                                targetSelector = '#' + rawVal;
                            }
                        }
                        if (targetSelector) {
                            openExtractMenu(targetSelector, e.clientX, e.clientY);
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(targetSelector).catch(() => {});
                            } else {
                                const $tmp = $('<textarea>').val(targetSelector).appendTo('body').select();
                                document.execCommand('copy');
                                $tmp.remove();
                            }
                        }
                    }, true);

                    // Tooltip style
                    function addTooltipStyle() {
                        const $tokStyle = $('#lab-token-pointer-style');
                        if ($tokStyle.length) {
                            const extra = `
                    #labTreeDomBody .html-val:hover::after, #labTreeDomBody .html-attr:hover::after {
                        content: "Shift+Click: Extract CSS";
                        position: absolute; background: #9b59b6; color: #fff; font-size: 10px;
                        padding: 2px 5px; border-radius: 3px; margin-left: 4px; white-space: nowrap;
                        z-index: 2147483647; pointer-events: none;
                    }
                `;
                            $tokStyle.append(extra);
                        }
                    }

                    // ==========================================================
                    // 14.3 INIT: Wait for DOM / jQuery / Dashboard
                    // ==========================================================
                    function initModule() {
                        if (!window.$ || !$('#labMainDashboard').length) {
                            setTimeout(initModule, 500);
                            return;
                        }
                        createShieldBtn();
                        createExtractMenu();
                        addTooltipStyle();
                    }

                    // Start init when DOM ready
                    if (document.readyState === 'complete' || document.readyState === 'interactive') {
                        setTimeout(initModule, 100);
                        executeFetchSource(window.location.href,true);
                    } else {
                        document.addEventListener('DOMContentLoaded', function() {
                            setTimeout(initModule, 100);
                        });

                    }

                    // Restore previous shield state if any (but default is OFF)
                    if (localStorage.getItem(SHIELD_KEY) === 'true') {
                        setTimeout(function() {
                            if (localStorage.getItem(SHIELD_KEY) === 'true') enableShield();
                        }, 1000);
                    }

                } catch (err) {
                    console.error('[Enhancement Module v17.1] Initialization error:', err);
                }
            })();
            /* === End Module Enhancement Module v17.1 — Anti-Hijack Shield & CSS Extractor


            (FIXED): 5317 === */
            /* === Begin Module IIFE & Event Listener Cleanup: 5318 === */
        }, 10);

    });
})();
/* === End Module IIFE & Event Listener Cleanup: 5324 === */