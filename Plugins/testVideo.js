(function(global) {
    'use strict';

    // ─── BIẾN TOÀN CỤC CỦA SCRIPT ───
    var DEVELOPE = false;

    /**
     * Hàm tìm nguồn video từ flashvars trong HTML hiện tại
     * (Giữ nguyên logic cũ, tự động gọi buildVideoPlayer với target='html')
     */
    function GetlinkVideo() {
        const source = document.querySelectorAll('[class*="video"], [class*="player"], video, iframe');
        var stream1 = "";
        var stream2 = window.location.href;
        source.forEach(el => {
            // Lọc ra các phần tử thực sự có chứa link nguồn (src)
            let src = el.src || el.getAttribute('data-src') || el.querySelector('source')?.src;
            if (src && (src.includes('.mp4') || src.includes('.m3u8') || src.includes('embed'))) {
                stream1 = src;
            }
        });
        
        buildVideoPlayer(stream1, stream2, 'html');
    }

    // ─── HÀM TOAST ───
    function showToast(message, duration, check) {
        if (typeof duration === 'undefined') duration = 7000;
        if (typeof check === 'undefined') check = true;
        if (check == false) {
            return false;
        }
        var container = document.getElementById('global-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'global-toast-container';
            Object.assign(container.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '9999999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });
            document.body.appendChild(container);
        }
        
        var toastEl = document.createElement('div');
        toastEl.innerHTML = message;
        
        Object.assign(toastEl.style, {
            background: 'rgba(50, 50, 50, 0.95)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            minWidth: '200px',
            transition: 'all 0.3s ease',
            transform: 'translateX(120%)',
            opacity: '0'
        });
        
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
                if (container.childElementCount === 0) {
                    container.remove();
                }
            }, 300);
        }, duration);
    }

    // ─── HỖ TRỢ HLS / M3U8 ───
    function isHlsSource(url) {
        return typeof url === 'string' && /\.m3u8($|\?)/i.test(url);
    }

    function loadHlsJs(callback) {
        if (global.Hls && global.Hls.isSupported) {
            callback();
            return;
        }
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.onload = function() { callback(); };
        script.onerror = function() { callback(new Error('Không thể tải HLS.js')); };
        document.head.appendChild(script);
    }

    /**
     * Gán nguồn cho video, tự động xử lý HLS nếu là m3u8
     */
    function applySource(video, url, onReady) {
        if (isHlsSource(url)) {
            // Safari / iOS native HLS support
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                if (video._hlsInstance) {
                    video._hlsInstance.destroy();
                    video._hlsInstance = null;
                }
                video.src = url;
                video.load();
                if (onReady) onReady();
            } else {
                loadHlsJs(function(err) {
                    if (err || !global.Hls.isSupported()) {
                        if (onReady) onReady(err || new Error('Trình duyệt không hỗ trợ HLS'));
                        return;
                    }
                    if (video._hlsInstance) {
                        video._hlsInstance.destroy();
                        video._hlsInstance = null;
                    }
                    var hls = new global.Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(global.Hls.Events.MANIFEST_PARSED, function() {
                        if (onReady) onReady();
                    });
                    hls.on(global.Hls.Events.ERROR, function(event, data) {
                        if (data.fatal) {
                            hls.destroy();
                            if (onReady) onReady(new Error('Lỗi HLS nghiêm trọng'));
                        }
                    });
                    video._hlsInstance = hls;
                });
            }
        } else {
            if (video._hlsInstance) {
                video._hlsInstance.destroy();
                video._hlsInstance = null;
            }
            video.src = url;
            video.load();
            if (onReady) onReady();
        }
    }

    /**
     * Hàm chính: xây dựng video player
     * @param {string} source - Nguồn video chính (mp4, m3u8, v.v.)
     * @param {string} [source2] - Nguồn dự phòng
     * @param {string|HTMLElement} [target] - 'html' để thay toàn bộ trang, hoặc DOM element để chèn vào bên trong
     */
    function buildVideoPlayer(source, source2, target) {
        if (!source) {
            showToast('Thiếu nguồn video!', 3000, true);
            return;
        }
        if (typeof target === 'undefined') target = 'html';

        var isHtmlTarget = (target === 'html' || target === document.documentElement);
        var targetEl = isHtmlTarget ? null : target;

        if (!isHtmlTarget && (!targetEl || !targetEl.nodeType)) {
            showToast('Element đích không hợp lệ!', 3000, true);
            return;
        }

        var container = document.createElement('div');
        container.id = 'custom-video-player';
        var containerStyle = isHtmlTarget
            ? 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:Segoe UI,Roboto,sans-serif;user-select:none;-webkit-user-select:none;'
            : 'position:relative;width:100%;height:100%;min-height:200px;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Segoe UI,Roboto,sans-serif;user-select:none;-webkit-user-select:none;';
        container.style.cssText = containerStyle;

        var video = document.createElement('video');
        video.id = 'main-video';
        video.style.cssText = 'width:100%;height:100%;object-fit:contain;cursor:pointer;background:#000;';
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.autoplay = true;
        video.muted = false;
        video.controls = false;

        var spinner = document.createElement('div');
        spinner.id = 'video-spinner';
        spinner.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;border:4px solid rgba(255,255,255,0.3);border-top:4px solid #fff;border-radius:50%;animation:spin 1s linear infinite;z-index:10;pointer-events:none;';
        var spinStyle = document.createElement('style');
        spinStyle.textContent = '@keyframes spin{0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);}}';

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

        btnRow.appendChild(btnPlay);
        btnRow.appendChild(btnMute);
        btnRow.appendChild(timeDisplay);
        btnRow.appendChild(spacer);
        btnRow.appendChild(speedIndicator);
        btnRow.appendChild(btnReload);
        btnRow.appendChild(btnFullscreen);

        controls.appendChild(progressWrap);
        controls.appendChild(btnRow);

        var bigPlayBtn = document.createElement('div');
        bigPlayBtn.id = 'big-play-btn';
        bigPlayBtn.textContent = '▶';
        bigPlayBtn.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;background:rgba(0,0,0,0.6);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;font-size:36px;cursor:pointer;z-index:15;';

        var seekOverlay = document.createElement('div');
        seekOverlay.id = 'seek-overlay';
        seekOverlay.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:#fff;padding:12px 24px;border-radius:8px;font-size:18px;font-weight:bold;pointer-events:none;opacity:0;transition:opacity 0.3s;z-index:30;';

        container.appendChild(video);
        container.appendChild(spinner);
        container.appendChild(bigPlayBtn);
        container.appendChild(seekOverlay);
        container.appendChild(controls);

        // ─── Chèn vào DOM theo target ───
        if (isHtmlTarget) {
            var htmlTAG = document.getElementsByTagName("html")[0];
            htmlTAG.innerHTML = '';
            document.body = document.createElement('body');
            document.body.appendChild(container);
            document.head.innerHTML = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
            document.head.appendChild(spinStyle);
            document.title = 'Video Player';
        } else {
            // Nếu element đã có player cũ, xóa đi tránh chồng chéo
            var existingPlayer = targetEl.querySelector('#custom-video-player');
            if (existingPlayer) existingPlayer.remove();

            targetEl.appendChild(container);
            // Đảm bảo target có position để chứa các absolute elements
            var computedPos = window.getComputedStyle(targetEl).position;
            if (computedPos === 'static') {
                targetEl.style.position = 'relative';
            }
            // Thêm style animation vào head nếu chưa có
            if (!document.getElementById('video-spin-style')) {
                spinStyle.id = 'video-spin-style';
                document.head.appendChild(spinStyle);
            }
        }

        var isPlaying = false;
        var isMuted = false;
        var currentSpeed = 1.0;
        var controlsTimeout = null;
        var isDraggingProgress = false;
        var isDraggingVideo = false;

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
            if (video.duration && !isDraggingProgress) {
                var pct = (video.currentTime / video.duration) * 100;
                progressBar.style.width = pct + '%';
            }
            timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
        }

        function seekVideo(seconds) {
            var newTime = video.currentTime + seconds;
            if (newTime < 0) newTime = 0;
            if (video.duration && newTime > video.duration) newTime = video.duration;
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
            var newSrc = source + (source.indexOf('?') > -1 ? '&' : '?') + '_reload=' + Date.now();

            applySource(video, newSrc, function(err) {
                if (err) {
                    spinner.style.display = 'none';
                    if (source2 && source2 !== source) {
                        showToast('Nguồn 1 lỗi, thử nguồn dự phòng...');
                        source = source2;
                        applySource(video, source, function(err2) {
                            if (err2) {
                                showToast('Lỗi tải video! Kiểm tra nguồn.');
                            } else {
                                if (wasPlaying) video.play();
                                showToast('Đã chuyển sang nguồn dự phòng');
                            }
                        });
                    } else {
                        showToast('Lỗi tải video! Kiểm tra nguồn.');
                    }
                    return;
                }

                video.onloadeddata = function() {
                    spinner.style.display = 'none';
                    video.currentTime = currentTime;
                    if (wasPlaying) video.play();
                    showToast('Đã tải lại nguồn video');
                };
                video.onerror = function() {
                    spinner.style.display = 'none';
                    if (source2 && source2 !== source) {
                        showToast('Nguồn 1 lỗi, thử nguồn dự phòng...');
                        source = source2;
                        applySource(video, source);
                    } else {
                        showToast('Lỗi tải video! Kiểm tra nguồn.');
                    }
                };
            });
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
            spinner.style.display = 'none';
            updateProgress();
            if (isMuted && video.muted) {
                video.muted = false;
                isMuted = false;
                btnMute.textContent = '🔊';
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
        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ended', function() {
            btnPlay.textContent = '▶';
            bigPlayBtn.style.display = 'flex';
            isPlaying = false;
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

        progressWrap.addEventListener('click', function(e) {
            e.stopPropagation();
            var rect = progressWrap.getBoundingClientRect();
            var pct = (e.clientX - rect.left) / rect.width;
            video.currentTime = pct * video.duration;
            updateProgress();
        });
        progressWrap.addEventListener('mousedown', function(e) {
            isDraggingProgress = true;
            showControls();
        });
        document.addEventListener('mousemove', function(e) {
            if (isDraggingProgress && video.duration) {
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
                case 'End': e.preventDefault(); if (video.duration) video.currentTime = video.duration - 1; break;
                case '>': case '.': e.preventDefault(); currentSpeed = Math.min(4, currentSpeed + 0.25); video.playbackRate = currentSpeed; speedIndicator.textContent = currentSpeed.toFixed(1) + 'x'; showToast('Tốc độ: ' + currentSpeed.toFixed(1) + 'x'); break;
                case '<': case ',': e.preventDefault(); currentSpeed = Math.max(0.25, currentSpeed - 0.25); video.playbackRate = currentSpeed; speedIndicator.textContent = currentSpeed.toFixed(1) + 'x'; showToast('Tốc độ: ' + currentSpeed.toFixed(1) + 'x'); break;
                case '0': e.preventDefault(); video.currentTime = 0; break;
                case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': e.preventDefault(); if (video.duration) { video.currentTime = video.duration * (parseInt(e.key) / 10); } break;
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

            if (Math.abs(deltaX) > minDrag && video.duration) {
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

        // ─── Khởi tạo nguồn và autoplay ───
        applySource(video, source, function(err) {
            if (err) {
                console.error(err);
                spinner.style.display = 'none';
                bigPlayBtn.style.display = 'flex';
                showToast('Không thể khởi tạo nguồn video: ' + (err.message || 'Unknown error'));
                return;
            }

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
                    showToast('Không thể phát video: ' + (err2.message || ''), 3000, DEVELOPE);
                });
            });
        });
    }

    // Expose ra global để sử dụng từ bên ngoài
    GetlinkVideo();

})(window);
