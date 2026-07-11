(function() {
    'use strict';
    // ─── BIẾN TOÀN CỤC CỦA SCRIPT ───
    var DEVELOPE = false;

    function GetlinkVideo() {
     var playlist = scanSources();
     var stream1 = playlist.activeSrc || '';
     var stream2 = window.location.href;
     showToast("Đang khởi chạy trình phát tốt hơn.", 5000, true);
     buildVideo(stream1, stream2, playlist);
    }
/*
     // === THÊM SERVER VÀ TẬP PHIM TÙY CHỈNH ===
    window.customPlaylist = {
      servers: [
        { label: 'Server VIP', src: 'https://vip.example.com/video.mp4' },
        { label: 'Server Backup', src: 'https://backup.example.com/video.mp4' }
      ],
      episodes: [
        { label: 'Tập 1', src: 'https://site.com/phim/tap-1' },
        { label: 'Tập 2', src: 'https://site.com/phim/tap-2' },
        { label: 'Tập 3', src: 'https://site.com/phim/tap-3' }
      ]
    };
    
    // Hardcode server & tập phim
servers.push({ label: 'Server 2', src: 'https://.../link2.mp4' });
servers.push({ label: 'Server 3', src: 'https://.../link3.mp4' });
episodes.push({ label: 'Tập 1', src: 'https://.../tap-1' });
episodes.push({ label: 'Tập 2', src: 'https://.../tap-2' });
    // === KẾT THÚC CUSTOM ===
     */
// ─── QUÉT NGUỒN PHÁT VÀ PLAYLIST TRƯỚC KHI XÓA DOM ───

    // ─── QUÉT NGUỒN PHÁT VÀ PLAYLIST TRƯỚC KHI XÓA DOM ───
    function scanSources() {
        var activeSrc = '';
        var servers = [];
        var episodes = [];
        var seen = new Set();

        // 1. Quét video, iframe, source
        var els = document.querySelectorAll('[class*="video"], [class*="player"], video, iframe');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var src = el.src || el.getAttribute('data-src') || '';
            if (!src) {
                var s = el.querySelector('source');
                if (s) src = s.src || s.getAttribute('src') || '';
            }
            if (src && (src.indexOf('.mp4') > -1 || src.indexOf('.m3u8') > -1 || src.indexOf('embed') > -1)) {
                if (!activeSrc) activeSrc = src;
                if (!seen.has(src)) {
                    seen.add(src);
                    var lbl = 'Server ' + (servers.length + 1);
                    if (src.indexOf('embed') > -1) lbl = 'Nhúng ' + (servers.length + 1);
                    servers.push({ label: lbl, src: src, type: 'server' });
                }
            }
        }

        // 2. Quét thêm các nút/data-link chuyển server
        var allLinks = document.querySelectorAll('a, button, [role="button"], [data-link]');
        for (var k = 0; k < allLinks.length; k++) {
            var el2 = allLinks[k];
            var href = el2.href || el2.getAttribute('href') || el2.getAttribute('data-src') || el2.getAttribute('data-link') || '';
            var txt = (el2.textContent || el2.innerText || '').trim();
            if (!href || href === '#' || href === window.location.href || seen.has(href)) continue;
            if (/(server|sv|nguồn|source|embed|link)/i.test(txt + ' ' + el2.className)) {
                if (href.indexOf('.mp4') > -1 || href.indexOf('.m3u8') > -1 || href.indexOf('embed') > -1) {
                    seen.add(href);
                    servers.push({ label: txt || 'Server ' + (servers.length + 1), src: href, type: 'server' });
                }
            }
        }

        // 3. Quét link tập phim
        var aTags = document.querySelectorAll('a');
        for (var j = 0; j < aTags.length; j++) {
            var a = aTags[j];
            var aHref = a.href || a.getAttribute('href');
            var aTxt = (a.textContent || a.innerText || '').trim();
            if (!aHref || aHref === '#' || aHref === window.location.href) continue;
            var isEpisode = false;
            if (/(tập|tap|ep|episode|chap|part)\s*(\d+|[ivx]+)/i.test(aTxt)) isEpisode = true;
            if (/(tập|tap|ep|episode|chap|part)[-\s]?(\d+|[ivx]+)/i.test(aHref)) isEpisode = true;
            if (a.className && /(^|\s)(ep|episode|tap|chapter|part|tapphim)(\d+|$)/i.test(a.className)) isEpisode = true;
            if (isEpisode) {
                episodes.push({ label: aTxt || 'Tập ' + (episodes.length + 1), src: aHref, type: 'episode' });
            }
        }

        // Merge custom servers & episodes từ window.customPlaylist (nếu có)
        if (typeof window.customPlaylist !== 'undefined' && window.customPlaylist) {
            if (window.customPlaylist.servers) {
                for (var s = 0; s < window.customPlaylist.servers.length; s++) {
                    var cs = window.customPlaylist.servers[s];
                    if (cs && cs.src && !seen.has(cs.src)) {
                        seen.add(cs.src);
                        servers.push({ label: cs.label || 'Custom Server', src: cs.src, type: 'server' });
                    }
                }
            }
            if (window.customPlaylist.episodes) {
                for (var e = 0; e < window.customPlaylist.episodes.length; e++) {
                    var ce = window.customPlaylist.episodes[e];
                    if (ce && ce.src) {
                        episodes.push({ label: ce.label || ('Custom Tập ' + (episodes.length + 1)), src: ce.src, type: 'episode' });
                    }
                }
            }
        }

        return { activeSrc: activeSrc, servers: servers, episodes: episodes };
    }
    // ─── HÀM TOAST ĐƯỢC ĐƯA RA NGOÀI (Có thể gọi ở mọi nơi) ───
    function showToast(message, duration, check) {
        if (typeof duration === 'undefined') duration = 7000;
        if (typeof check === 'undefined') check = true;
        if (check === false) return;
        var container = document.getElementById('global-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'global-toast-container';
            container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999999;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(container);
        }
        var toastEl = document.createElement('div');
        toastEl.innerHTML = message;
        toastEl.style.cssText = 'background:rgba(50,50,50,0.95);color:#fff;padding:12px 24px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.2);font-family:sans-serif;font-size:14px;min-width:200px;transition:all 0.3s ease;transform:translateX(120%);opacity:0;';
        container.appendChild(toastEl);
        setTimeout(function() {
            toastEl.style.transform = 'translateX(0)';
            toastEl.style.opacity = '1';
        }, 10);
        setTimeout(function() {
            toastEl.style.transform = 'translateX(120%)';
            toastEl.style.opacity = '0';
            setTimeout(function() {
                toastEl.remove();
                if (container.childElementCount === 0) container.remove();
            }, 300);
        }, duration);
    }

    function buildVideo(stream1, stream2, playlistData) {
        var container = document.createElement('div');
        container.id = 'custom-video-player';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:Segoe UI,Roboto,sans-serif;user-select:none;-webkit-user-select:none;';

        var video = document.createElement('video');
        video.id = 'main-video';
        video.style.cssText = 'width:100%;height:100%;object-fit:contain;cursor:pointer;background:#000;';
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.src = stream1;
        video.autoplay = true;
        video.muted = false;
        video.controls = false;

        var spinner = document.createElement('div');
        spinner.id = 'video-spinner';
        spinner.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;border:4px solid rgba(255,255,255,0.3);border-top:4px solid #fff;border-radius:50%;animation:spin 1s linear infinite;z-index:10;pointer-events:none;';
        var spinStyle = document.createElement('style');
        spinStyle.textContent = '@keyframes spin{0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);}}';
        document.head.appendChild(spinStyle);

        var controls = document.createElement('div');
        controls.id = 'video-controls';
        controls.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:12px 16px 20px;box-sizing:border-box;transition:opacity 0.3s;opacity:0;z-index:20;';

        var progressWrap = document.createElement('div');
        progressWrap.style.cssText = 'width:100%;height:6px;background:rgba(255,255,255,0.3);border-radius:3px;cursor:pointer;position:relative;margin-bottom:12px;';
        var progressBar = document.createElement('div');
        progressBar.style.cssText = 'height:100%;background:#e74c3c;width:0%;border-radius:3px;position:relative;pointer-events:none;';
        var progressHandle = document.createElement('div');
        progressHandle.style.cssText = 'position:absolute;right:-6px;top:-4px;width:14px;height:14px;background:#e74c3c;border-radius:50%;opacity:0;transition:opacity 0.2s;pointer-events:none;';
        progressBar.appendChild(progressHandle);
        progressWrap.appendChild(progressBar);
        progressWrap.onmouseenter = function() { progressHandle.style.opacity = '1'; };
        progressWrap.onmouseleave = function() { progressHandle.style.opacity = '0'; };

        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;align-items:center;gap:12px;';

        var btnPlay = createBtn('⏸', 'Phát / Tạm dừng');
        var btnMute = createBtn('🔊', 'Tắt / Bật âm lượng');
        var timeDisplay = document.createElement('span');
        timeDisplay.style.cssText = 'color:#fff;font-size:13px;min-width:100px;';
        timeDisplay.textContent = '0:00 / 0:00';
        var btnReload = createBtn('🔄', 'Tải lại nguồn video');
        var spacer = document.createElement('div');
        spacer.style.cssText = 'flex:1;';
        var speedIndicator = document.createElement('span');
        speedIndicator.style.cssText = 'color:#fff;font-size:12px;opacity:0.8;';
        speedIndicator.textContent = '1.0x';
        var btnFullscreen = createBtn('⛶', 'Toàn màn hình');
        var btnPlaylist = createBtn('☰', 'Danh sách phát / Server');

        btnRow.appendChild(btnPlay);
        btnRow.appendChild(btnMute);
        btnRow.appendChild(timeDisplay);
        btnRow.appendChild(spacer);
        btnRow.appendChild(speedIndicator);
        btnRow.appendChild(btnReload);
        btnRow.appendChild(btnFullscreen);

        // Chỉ hiện nút playlist nếu có nội dung
        var hasPlaylist = (playlistData && ((playlistData.servers && playlistData.servers.length > 1) || (playlistData.episodes && playlistData.episodes.length > 0)));
        if (hasPlaylist) {
            btnRow.appendChild(btnPlaylist);
        }

        controls.appendChild(progressWrap);
        controls.appendChild(btnRow);

        var bigPlayBtn = document.createElement('div');
        bigPlayBtn.id = 'big-play-btn';
        bigPlayBtn.textContent = '▶';
        bigPlayBtn.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;background:rgba(0,0,0,0.6);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;font-size:36px;cursor:pointer;z-index:15;';

        var seekOverlay = document.createElement('div');
        seekOverlay.id = 'seek-overlay';
        seekOverlay.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:#fff;padding:12px 24px;border-radius:8px;font-size:18px;font-weight:bold;pointer-events:none;opacity:0;transition:opacity 0.3s;z-index:30;';

        // Playlist Panel
        var playlistPanel = document.createElement('div');
        playlistPanel.id = 'playlist-panel';
        playlistPanel.style.cssText = 'position:fixed;top:0;right:0;width:300px;max-width:80%;height:100%;background:rgba(15,15,15,0.97);z-index:40;transform:translateX(100%);transition:transform 0.25s ease;overflow-y:auto;padding:20px;box-sizing:border-box;color:#fff;font-family:Segoe UI,Roboto,sans-serif;';

        var plHeader = document.createElement('div');
        plHeader.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.2);';
        plHeader.innerHTML = '<span style="font-size:16px;font-weight:bold;">📋 Playlist</span>';
        var plClose = document.createElement('button');
        plClose.textContent = '✕';
        plClose.style.cssText = 'background:none;border:none;color:#fff;font-size:18px;cursor:pointer;';
        plClose.onclick = function(e) { if(e)e.stopPropagation(); playlistPanel.style.transform = 'translateX(100%)'; };
        plHeader.appendChild(plClose);
        playlistPanel.appendChild(plHeader);

        function buildSection(title, items, onClick) {
            if (!items || items.length === 0) return;
            var sec = document.createElement('div');
            sec.style.cssText = 'margin-bottom:20px;';
            var secTitle = document.createElement('div');
            secTitle.textContent = title;
            secTitle.style.cssText = 'font-size:13px;text-transform:uppercase;opacity:0.6;margin-bottom:10px;';
            sec.appendChild(secTitle);
            for (var i = 0; i < items.length; i++) {
                (function(item) {
                    var btn = document.createElement('button');
                    btn.textContent = item.label;
                    btn.style.cssText = 'display:block;width:100%;text-align:left;padding:10px 12px;margin-bottom:6px;background:rgba(255,255,255,0.08);border:none;border-radius:6px;color:#fff;font-size:14px;cursor:pointer;transition:background 0.2s;';
                    btn.onmouseenter = function() { btn.style.background = 'rgba(231,76,60,0.3)'; };
                    btn.onmouseleave = function() { btn.style.background = 'rgba(255,255,255,0.08)'; };
                    btn.onclick = function(e) { if(e)e.stopPropagation(); onClick(item); };
                    sec.appendChild(btn);
                })(items[i]);
            }
            playlistPanel.appendChild(sec);
        }

        if (playlistData) {
            if (playlistData.servers && playlistData.servers.length > 1) {
                buildSection('🎥 Chuyển Server', playlistData.servers, function(item) {
                    switchSource(item.src);
                });
            }
            if (playlistData.episodes && playlistData.episodes.length > 0) {
                buildSection('📁 Tập phim', playlistData.episodes, function(item) {
                    savePosition();
                    window.location.href = item.src;
                });
            }
        }

        container.appendChild(video);
        container.appendChild(spinner);
        container.appendChild(bigPlayBtn);
        container.appendChild(seekOverlay);
        container.appendChild(controls);
        if (hasPlaylist) {
            container.appendChild(playlistPanel);
        }

        var htmlTAG = document.getElementsByTagName("html")[0];
        htmlTAG.innerHTML = '';
        document.body = document.createElement('body');
        document.body.appendChild(container);
        document.head.innerHTML = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
        document.head.appendChild(spinStyle);
        document.title = 'Video Player';

        var isPlaying = false;
        var isMuted = false;
        var currentSpeed = 1.0;
        var controlsTimeout = null;
        var isDraggingProgress = false;
        var isDraggingVideo = false;

        // ─── LOCALSTORAGE: LƯU / KHÔI PHỤC VỊ TRÍ ───
        // Tạo key ổn định: bỏ các path segment chứa '=' (key=, state=, speed=, reftag=...)
        // chỉ giữ lại các phần thuần túy của link gốc
        function getStableKey(url) {
            try {
                var u = new URL(url);
                var parts = u.pathname.split('/').filter(function(p) { return p.length && p.indexOf('=') === -1; });
                var path = parts.length ? '/' + parts.join('/') : '/';
                return 'videoPlayer_lastPos_' + encodeURIComponent(u.origin + path);
            } catch (e) {
                return 'videoPlayer_lastPos_' + encodeURIComponent(url.split('?')[0].split('#')[0]);
            }
        }

        var saveKey = getStableKey(stream1);
        var lastSaveTime = 0;
        var pendingRestoreTime = null;
        var hasRestored = false;

        function savePosition(force) {
            if (!video || video.ended || !video.currentTime || isNaN(video.currentTime)) return;
            if (!force) {
                var now = Date.now();
                if (now - lastSaveTime < 3000) return; // debounce 3 giây
                lastSaveTime = now;
            }
            try {
                // Chỉ lưu nếu đã xem quá 3s và còn hơn 5s cuối
                if (video.currentTime > 3 && (!video.duration || isNaN(video.duration) || video.currentTime < video.duration - 5)) {
                    localStorage.setItem(saveKey, JSON.stringify({
                        time: video.currentTime,
                        duration: video.duration || 0,
                        savedAt: Date.now()
                    }));
                }
            } catch (e) {}
        }

        function clearSavedPosition() {
            try { localStorage.removeItem(saveKey); } catch (e) {}
        }

        function restorePosition() {
            if (hasRestored) { console.log('[Player] already restored'); return true; }
            try {
                var saved = localStorage.getItem(saveKey);
                console.log('[Player] saveKey:', saveKey, 'saved:', saved ? 'found' : 'null');
                if (saved) {
                    var data = JSON.parse(saved);
                    console.log('[Player] parsed data:', JSON.stringify(data));
                    if (data && data.time && data.time > 3) {
                        // Nếu đã biết duration, kiểm tra xem đây có phải cùng phim không
                        if (video.duration && !isNaN(video.duration) && data.duration && !isNaN(data.duration)) {
                            var durDiff = Math.abs(video.duration - data.duration);
                            if (durDiff > 3) {
                                console.log('[Player] duration mismatch (saved:', data.duration, 'current:', video.duration, '), this is a different movie');
                                clearSavedPosition(); // xóa data cũ của phim khác
                                return false;
                            }
                        }
                        if (!video.duration || isNaN(video.duration)) {
                            pendingRestoreTime = data.time;
                            console.log('[Player] duration not ready, pending:', data.time);
                            return false;
                        }
                        if (data.time < video.duration - 5) {
                            try {
                                video.currentTime = data.time;
                                hasRestored = true;
                                console.log('[Player] restored to:', data.time);
                                showToast('⏩ Đã tiếp tục phát từ ' + formatTime(data.time), 4000, true);
                                return true;
                            } catch (seekErr) {
                                console.warn('[Player] seek failed, will retry on canplay:', seekErr);
                                pendingRestoreTime = data.time;
                                return false;
                            }
                        }
                    }
                }
            } catch (e) { console.error('[Player] restore error:', e); }
            return false;
        }

        function applyPendingRestore() {
            if (pendingRestoreTime !== null && video.duration && !isNaN(video.duration)) {
                // Kiểm tra duration khớp trước khi apply
                try {
                    var saved = localStorage.getItem(saveKey);
                    if (saved) {
                        var data = JSON.parse(saved);
                        if (data.duration && !isNaN(data.duration)) {
                            var durDiff = Math.abs(video.duration - data.duration);
                            if (durDiff > 3) {
                                console.log('[Player] pending restore rejected: duration mismatch');
                                pendingRestoreTime = null;
                                return false;
                            }
                        }
                    }
                } catch (e) {}
                if (pendingRestoreTime < video.duration - 5) {
                    try {
                        video.currentTime = pendingRestoreTime;
                        hasRestored = true;
                        console.log('[Player] applied pending restore:', pendingRestoreTime);
                        showToast('⏩ Đã tiếp tục phát từ ' + formatTime(pendingRestoreTime), 4000, true);
                    } catch (seekErr) {
                        console.warn('[Player] pending seek failed:', seekErr);
                    }
                }
                pendingRestoreTime = null;
                return true;
            }
            return false;
        }

        // Lưu ngay khi rời trang / reload, không chờ debounce
        window.addEventListener('beforeunload', function() {
            savePosition(true);
        });

        function switchSource(newSrc) {
            var wasPlaying = !video.paused;
            var prevTime = video.currentTime;
            // Lưu vị trí cũ trước khi đổi
            savePosition(true);
            stream1 = newSrc;
            saveKey = getStableKey(stream1);
            hasRestored = false;
            pendingRestoreTime = null;
            video.src = newSrc;
            video.load();
            spinner.style.display = 'block';
            video.onloadeddata = function() {
                spinner.style.display = 'none';
                if (!restorePosition() && prevTime > 0) {
                    video.currentTime = prevTime;
                }
                if (wasPlaying) video.play();
                showToast('Đã chuyển nguồn phát');
            };
            video.onerror = function() {
                spinner.style.display = 'none';
                showToast('Không thể phát nguồn này!');
            };
            playlistPanel.style.transform = 'translateX(100%)';
        }

        function createBtn(icon, title) {
            var btn = document.createElement('button');
            btn.textContent = icon;
            btn.title = title;
            btn.style.cssText = 'background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:4px 8px;border-radius:4px;transition:background 0.2s;outline:none;';
            btn.onmouseenter = function() { btn.style.background = 'rgba(255,255,255,0.2)'; };
            btn.onmouseleave = function() { btn.style.background = 'none'; };
            return btn;
        }

        function showSeekOverlay(text) {
            seekOverlay.textContent = text;
            seekOverlay.style.opacity = '1';
            clearTimeout(seekOverlay._timer);
            seekOverlay._timer = setTimeout(function() { seekOverlay.style.opacity = '0'; }, 800);
        }

        function formatTime(sec) {
            if (!sec || isNaN(sec)) return '0:00';
            var m = Math.floor(sec / 60);
            var s = Math.floor(sec % 60);
            return m + ':' + (s < 10 ? '0' + s : s);
        }

        function updateProgress() {
            if (video.duration && !isNaN(video.duration) && !isDraggingProgress) {
                var pct = (video.currentTime / video.duration) * 100;
                progressBar.style.width = pct + '%';
            }
            timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
        }

        function seekVideo(seconds) {
            var newTime = video.currentTime + seconds;
            if (newTime < 0) newTime = 0;
            if (video.duration && !isNaN(video.duration) && newTime > video.duration) newTime = video.duration;
            video.currentTime = newTime;
            showSeekOverlay((seconds > 0 ? '+' : '') + seconds + 's');
        }

        function togglePlay() {
            if (video.paused) {
                video.play().then(function() {
                    isPlaying = true;
                    btnPlay.textContent = '⏸';
                    bigPlayBtn.style.display = 'none';
                    spinner.style.display = 'none';
                }).catch(function(e) {
                    console.warn('Autoplay bị chặn:', e);
                    video.muted = true;
                    video.play().then(function() {
                        isMuted = true;
                        btnMute.textContent = '🔇';
                        isPlaying = true;
                        btnPlay.textContent = '⏸';
                        bigPlayBtn.style.display = 'none';
                        spinner.style.display = 'none';
                    });
                });
            } else {
                video.pause();
                isPlaying = false;
                btnPlay.textContent = '▶';
                bigPlayBtn.style.display = 'flex';
            }
        }

        function toggleMute() {
            video.muted = !video.muted;
            isMuted = video.muted;
            btnMute.textContent = isMuted ? '🔇' : '🔊';
            showToast(isMuted ? 'Đã tắt tiếng' : 'Đã bật tiếng');
        }

        function reloadVideo() {
            spinner.style.display = 'block';
            var currentTime = video.currentTime;
            var wasPlaying = !video.paused;
            // Lưu vị trí hiện tại trước khi reload
            savePosition(true);
            video.src = stream1 + (stream1.indexOf('?') > -1 ? '&' : '?') + '_reload=' + Date.now();
            video.load();
            video.onloadeddata = function() {
                spinner.style.display = 'none';
                // Ưu tiên vị trí hiện tại, nếu 0 thì thử restore từ localStorage
                if (currentTime > 0) {
                    video.currentTime = currentTime;
                } else {
                    restorePosition();
                }
                if (wasPlaying) video.play();
                showToast('Đã tải lại nguồn video');
            };
            video.onerror = function() {
                spinner.style.display = 'none';
                if (stream2 && stream2 !== stream1) {
                    showToast('Nguồn 1 lỗi, thử nguồn dự phòng...');
                    stream1 = stream2;
                    saveKey = getStableKey(stream1);
                    video.src = stream1;
                    video.load();
                } else {
                    showToast('Lỗi tải video! Kiểm tra nguồn.');
                }
            };
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(function() {});
            } else {
                document.exitFullscreen().catch(function() {});
            }
        }

        function showControls() {
            controls.style.opacity = '1';
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(function() {
                if (!isDraggingProgress) controls.style.opacity = '0';
            }, 3000);
        }

        video.addEventListener('loadeddata', function() {
            console.log('[Player] loadeddata, readyState:', video.readyState, 'duration:', video.duration, 'currentTime:', video.currentTime);
            spinner.style.display = 'none';
            updateProgress();
            if (isMuted && video.muted) {
                video.muted = false;
                isMuted = false;
                btnMute.textContent = '🔊';
            }
            restorePosition();
        });

        video.addEventListener('loadedmetadata', function() {
            console.log('[Player] loadedmetadata, duration:', video.duration);
            applyPendingRestore();
        });

        video.addEventListener('durationchange', function() {
            console.log('[Player] durationchange, duration:', video.duration);
            applyPendingRestore();
        });

        video.addEventListener('canplay', function() {
            console.log('[Player] canplay, readyState:', video.readyState, 'currentTime:', video.currentTime, 'seekable:', video.seekable ? video.seekable.length : 0);
            if (!hasRestored) {
                if (pendingRestoreTime !== null) {
                    applyPendingRestore();
                } else {
                    restorePosition();
                }
            }
        });

        video.addEventListener('waiting', function() { spinner.style.display = 'block'; });
        video.addEventListener('playing', function() { spinner.style.display = 'none'; });
        video.addEventListener('error', function() {
            spinner.style.display = 'none';
            showToast('Lỗi phát video! Nhấn 🔄 để tải lại.');
            btnPlay.textContent = '▶';
            bigPlayBtn.style.display = 'flex';
        });
        video.addEventListener('timeupdate', function() {
            updateProgress();
            savePosition();
        });
        video.addEventListener('ended', function() {
            btnPlay.textContent = '▶';
            bigPlayBtn.style.display = 'flex';
            isPlaying = false;
            clearSavedPosition();
        });

        video.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isDraggingVideo) {
                isDraggingVideo = false;
                return;
            }
            var rect = video.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var width = rect.width;
            if (x < width * 0.3) {
                seekVideo(-10);
            } else if (x > width * 0.7) {
                seekVideo(10);
            } else {
                togglePlay();
            }
        });

        video.addEventListener('volumechange', function() {
            btnMute.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
        });

        btnPlay.addEventListener('click', function(e) { e.stopPropagation(); togglePlay(); });
        btnMute.addEventListener('click', function(e) { e.stopPropagation(); toggleMute(); });
        btnReload.addEventListener('click', function(e) { e.stopPropagation(); reloadVideo(); });
        btnFullscreen.addEventListener('click', function(e) { e.stopPropagation(); toggleFullscreen(); });
        if (hasPlaylist) {
            btnPlaylist.addEventListener('click', function(e) {
                e.stopPropagation();
                playlistPanel.style.transform = 'translateX(0)';
            });
        }

        progressWrap.addEventListener('click', function(e) {
            e.stopPropagation();
            var rect = progressWrap.getBoundingClientRect();
            var pct = (e.clientX - rect.left) / rect.width;
            if (video.duration && !isNaN(video.duration)) {
                video.currentTime = pct * video.duration;
            }
            updateProgress();
        });
        progressWrap.addEventListener('mousedown', function(e) {
            isDraggingProgress = true;
            showControls();
        });
        document.addEventListener('mousemove', function(e) {
            if (isDraggingProgress && video.duration && !isNaN(video.duration)) {
                var rect = progressWrap.getBoundingClientRect();
                var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                progressBar.style.width = (pct * 100) + '%';
                video.currentTime = pct * video.duration;
                updateProgress();
            }
        });
        document.addEventListener('mouseup', function() { isDraggingProgress = false; });

        container.addEventListener('mousemove', showControls);
        container.addEventListener('click', function() { showControls(); });
        bigPlayBtn.addEventListener('click', function(e) { e.stopPropagation(); togglePlay(); });

        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            showControls();
            switch(e.key) {
                case 'ArrowLeft': e.preventDefault(); e.shiftKey ? seekVideo(-30) : (e.ctrlKey || e.altKey) ? seekVideo(-5) : seekVideo(-10); break;
                case 'ArrowRight': e.preventDefault(); e.shiftKey ? seekVideo(30) : (e.ctrlKey || e.altKey) ? seekVideo(5) : seekVideo(10); break;
                case ' ': case 'k': case 'K': e.preventDefault(); togglePlay(); break;
                case 'ArrowUp': e.preventDefault(); video.volume = Math.min(1, video.volume + 0.1); showToast('Âm lượng: ' + Math.round(video.volume * 100) + '%'); break;
                case 'ArrowDown': e.preventDefault(); video.volume = Math.max(0, video.volume - 0.1); showToast('Âm lượng: ' + Math.round(video.volume * 100) + '%'); break;
                case 'm': case 'M': e.preventDefault(); toggleMute(); break;
                case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
                case 'r': case 'R': e.preventDefault(); reloadVideo(); break;
                case 'Home': e.preventDefault(); video.currentTime = 0; showToast('Về đầu video'); break;
                case 'End': e.preventDefault(); if (video.duration && !isNaN(video.duration)) video.currentTime = video.duration - 1; break;
                case '>': case '.': e.preventDefault(); currentSpeed = Math.min(4, currentSpeed + 0.25); video.playbackRate = currentSpeed; speedIndicator.textContent = currentSpeed.toFixed(1) + 'x'; showToast('Tốc độ: ' + currentSpeed.toFixed(1) + 'x'); break;
                case '<': case ',': e.preventDefault(); currentSpeed = Math.max(0.25, currentSpeed - 0.25); video.playbackRate = currentSpeed; speedIndicator.textContent = currentSpeed.toFixed(1) + 'x'; showToast('Tốc độ: ' + currentSpeed.toFixed(1) + 'x'); break;
                case '0': e.preventDefault(); video.currentTime = 0; break;
                case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': e.preventDefault(); if (video.duration && !isNaN(video.duration)) { video.currentTime = video.duration * (parseInt(e.key) / 10); } break;
            }
        });

        var touchStartX = 0;
        var touchStartY = 0;
        var touchStartTime = 0;
        var isSwiping = false;

        container.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isSwiping = false;
        }, { passive: true });

        container.addEventListener('touchmove', function(e) {
            if (e.touches.length !== 1) return;
            var dx = e.touches[0].clientX - touchStartX;
            var dy = e.touches[0].clientY - touchStartY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                isSwiping = true;
                var seekSec = Math.round(dx / 15);
                if (Math.abs(seekSec) >= 1) {
                    seekVideo(seekSec);
                    touchStartX = e.touches[0].clientX;
                }
            }
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 20) {
                isSwiping = true;
                var screenWidth = window.innerWidth;
                var isRightSide = touchStartX > screenWidth / 2;
                if (isRightSide) {
                    var volChange = -dy / 200;
                    video.volume = Math.max(0, Math.min(1, video.volume + volChange));
                    showToast('🔊 ' + Math.round(video.volume * 100) + '%');
                    touchStartY = e.touches[0].clientY;
                }
            }
        }, { passive: true });

        var regionStartX = 0;
        var regionOverlay = null;

        video.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            isDraggingVideo = false;
            regionStartX = e.clientX;
            regionOverlay = document.createElement('div');
            regionOverlay.style.cssText = 'position:fixed;top:0;height:100vh;background:rgba(231,76,60,0.3);pointer-events:none;z-index:25;';
            document.body.appendChild(regionOverlay);
        });

        document.addEventListener('mousemove', function(e) {
            if (!regionOverlay) return;
            isDraggingVideo = true;
            var left = Math.min(regionStartX, e.clientX);
            var width = Math.abs(e.clientX - regionStartX);
            regionOverlay.style.left = left + 'px';
            regionOverlay.style.width = width + 'px';
        });

        document.addEventListener('mouseup', function(e) {
            if (!regionOverlay) return;
            var endX = e.clientX;
            var deltaX = endX - regionStartX;
            var minDrag = 50;
            if (Math.abs(deltaX) > minDrag && video.duration && !isNaN(video.duration)) {
                var screenWidth = window.innerWidth;
                var startPct = Math.min(regionStartX, endX) / screenWidth;
                var endPct = Math.max(regionStartX, endX) / screenWidth;
                var startTime = startPct * video.duration;
                var endTime = endPct * video.duration;
                if (deltaX > 0) {
                    video.currentTime = startTime;
                    showToast('▶ Phát vùng ' + formatTime(startTime) + ' - ' + formatTime(endTime));
                } else {
                    video.currentTime = startTime;
                    showToast('⏩ Tua đến ' + formatTime(startTime));
                }
                if (video.paused) togglePlay();
            }
            regionOverlay.remove();
            regionOverlay = null;
        });

        video.play().then(function() {
            spinner.style.display = 'none';
            btnPlay.textContent = '⏸';
            isPlaying = true;
            console.log('Video autoplay thành công với tiếng');
            showToast('Đã phát video thành công. Xem vui nhé friend', 5000, true);
        }).catch(function(err) {
            console.log('Autoplay bị chặn, thử muted...');
            video.muted = true;
            isMuted = true;
            btnMute.textContent = '🔇';
            video.play().then(function() {
                spinner.style.display = 'none';
                btnPlay.textContent = '⏸';
                isPlaying = true;
                showToast('Đã tự phát (chưa bật tiếng) - Nhấn M để bật tiếng');
            }).catch(function(err2) {
                spinner.style.display = 'none';
                bigPlayBtn.style.display = 'flex';
                showToast('Không thể phát video: ', 3000, DEVELOPE);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', GetlinkVideo);
    } else {
        GetlinkVideo();
    }
})();
