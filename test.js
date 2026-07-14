/**
 * Dọn dẹp DOM, giữ lại các phần tử mong muốn và tự động gắn Control nếu có thẻ Video.
 */
function keepElementsAndInjectControls(selectors) {
    const targets = [];
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => targets.push(el));
    });

    if (targets.length === 0) {
        console.error("Không tìm thấy element nào khớp với các selector!");
        return;
    }

    const targetsSet = new Set(targets);
    const ancestors = new Set();

    targets.forEach(target => {
        let current = target.parentElement;
        while (current && current !== document.body && current !== document.documentElement) {
            ancestors.add(current);
            current = current.parentElement;
        }
    });

    function cleanUp(container) {
        const children = Array.from(container.childNodes);
        children.forEach(child => {
            if (targetsSet.has(child)) {
                // Giữ nguyên
            } else if (ancestors.has(child)) {
                if (child.nodeType === Node.ELEMENT_NODE) cleanUp(child);
            } else {
                child.remove();
            }
        });
    }

    cleanUp(document.body);
    document.body.style.background = 'black';

    targets.forEach(target => {
        if (target.tagName.toLowerCase() === 'video') {
            Object.assign(target.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                zIndex: '998', 
                objectFit: 'contain',
                background: '#000',
                margin: '0',
                padding: '0'
            });
            
            target.controls = false; 
            injectCustomVideoControls(target);
        } else {
            target.style.position = 'relative';
            target.style.zIndex = '9999';
        }
    });
}

/**
 * Tạo UI và gắn logic điều khiển cho thẻ video có sẵn
 */
function injectCustomVideoControls(video) {
    const toastContainer = document.createElement('div');
    toastContainer.className = "custom-toast-container"; // THÊM CLASS ĐỂ QUẢN LÝ
    toastContainer.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:9999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(toastContainer);

    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.innerHTML = message;
        toast.style.cssText = 'background:rgba(50,50,50,0.95);color:#fff;padding:12px 24px;border-radius:8px;font-family:sans-serif;font-size:14px;transition:all 0.3s ease;transform:translateX(120%);opacity:0;';
        toastContainer.appendChild(toast);
        
        setTimeout(() => { toast.style.transform = 'translateX(0)'; toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)'; toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function generateVideoKey() {
        if (!video.duration || isNaN(video.duration)) return null;
        return 'VIDEO_SAVED_POS_' + Math.floor(video.duration);
    }

    function savePosition() {
        if (video.ended || !video.currentTime || video.currentTime < 5 || video.currentTime > video.duration - 5) return;
        const key = generateVideoKey();
        if (key) localStorage.setItem(key, video.currentTime);
    }

    function restorePosition() {
        const key = generateVideoKey();
        if (!key) return;
        const savedTime = localStorage.getItem(key);
        if (savedTime && parseFloat(savedTime) > 5) {
            video.currentTime = parseFloat(savedTime);
            showToast('⏩ Đã tiếp tục phát từ ' + formatTime(video.currentTime));
        }
    }

    const overlay = document.createElement('div');
    overlay.className = "custom-video-overlay"; // THÊM CLASS ĐỂ QUẢN LÝ
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;font-family:sans-serif;';
    
    const controls = document.createElement('div');
    controls.style.cssText = 'pointer-events:auto;position:absolute;bottom:0;left:0;width:100%;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:12px 16px 20px;box-sizing:border-box;transition:opacity 0.3s;opacity:0;';
    
    const progressWrap = document.createElement('div');
    progressWrap.style.cssText = 'width:100%;height:6px;background:rgba(255,255,255,0.3);border-radius:3px;cursor:pointer;position:relative;margin-bottom:12px;';
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'height:100%;background:#e74c3c;width:0%;border-radius:3px;pointer-events:none;';
    progressWrap.appendChild(progressBar);

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;align-items:center;gap:12px;color:#fff;';

    const btnPlay = document.createElement('button');
    btnPlay.textContent = video.paused ? '▶' : '⏸';
    const btnMute = document.createElement('button');
    btnMute.textContent = video.muted ? '🔇' : '🔊';
    const timeDisplay = document.createElement('span');
    timeDisplay.style.cssText = 'font-size:13px;min-width:100px;';
    timeDisplay.textContent = '0:00 / 0:00';
    
    const bigPlayBtn = document.createElement('div');
    bigPlayBtn.textContent = '▶';
    bigPlayBtn.style.cssText = 'pointer-events:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;background:rgba(0,0,0,0.6);border-radius:50%;display:'+(video.paused?'flex':'none')+';align-items:center;justify-content:center;color:#fff;font-size:36px;cursor:pointer;z-index:15;';

    [btnPlay, btnMute].forEach(btn => {
        btn.style.cssText = 'background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:4px 8px;outline:none;';
    });

    btnRow.append(btnPlay, btnMute, timeDisplay);
    controls.append(progressWrap, btnRow);
    overlay.append(bigPlayBtn, controls);
    document.body.appendChild(overlay);

    function formatTime(sec) {
        if (!sec || isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' + s : s);
    }

    function togglePlay() {
        // Chỉ cho phép bấm khi overlay đang hiển thị (thẻ video đang hiện)
        if (overlay.style.display === 'none') return;
        video.paused ? video.play() : video.pause();
    }

    function updateUI() {
        btnPlay.textContent = video.paused ? '▶' : '⏸';
        bigPlayBtn.style.display = video.paused ? 'flex' : 'none';
        if (video.duration) {
            progressBar.style.width = (video.currentTime / video.duration * 100) + '%';
            timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
        }
    }

    let controlsTimeout;
    function showControls() {
        if (overlay.style.display === 'none') return;
        controls.style.opacity = '1';
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => { controls.style.opacity = '0'; }, 3000);
    }

    video.addEventListener('timeupdate', () => { updateUI(); savePosition(); });
    video.addEventListener('play', updateUI);
    video.addEventListener('pause', updateUI);
    video.addEventListener('loadedmetadata', restorePosition);
    video.addEventListener('volumechange', () => { btnMute.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊'; });
    
    if (video.readyState >= 1) restorePosition();

    document.addEventListener('mousemove', showControls);
    overlay.addEventListener('click', showControls);
    
    const clickZone = document.createElement('div');
    clickZone.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:calc(100% - 60px);pointer-events:auto;cursor:pointer;';
    clickZone.addEventListener('click', togglePlay);
    overlay.appendChild(clickZone);

    btnPlay.addEventListener('click', togglePlay);
    bigPlayBtn.addEventListener('click', togglePlay);
    btnMute.addEventListener('click', () => { video.muted = !video.muted; });
    
    progressWrap.addEventListener('click', (e) => {
        const rect = progressWrap.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        if (video.duration) video.currentTime = pct * video.duration;
    });

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        if (overlay.style.display === 'none') return; // Không ăn phím tắt khi đang xem iframe
        showControls();
        switch(e.key) {
            case ' ': e.preventDefault(); togglePlay(); break;
            case 'ArrowRight': video.currentTime += 10; break;
            case 'ArrowLeft': video.currentTime -= 10; break;
            case 'f': 
            case 'F': 
                if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                else document.exitFullscreen();
                break;
        }
    });
}

// --- KHỞI TẠO SELECT BOX ---
var html = document.body.innerHTML; 
const regex = /data-link=["']([^"']+)["']/g;
var number = 0;

var selectHtml = '<select class="changeServer" onchange="changeServer(this)" style="background:black;color:white;opacity:0.8;border:none;padding:4px;font-size:14px;border-radius:4px;outline:none;">';
for (const match of html.matchAll(regex)) {
  number++;
  const url = match[1]; 
  selectHtml += '<option value="'+url+'">Server '+number+'</option>';
}
selectHtml += '</select>'; 

const tempDiv = document.createElement('div');
tempDiv.className = "wrap-server";
tempDiv.innerHTML = selectHtml;
tempDiv.style.cssText = "position:fixed;right:20px;top:10px;z-index:100000;background:black;color:white;padding:4px;border:1px solid #fff;border-radius:4px";

const iframe = document.createElement('iframe');
iframe.className = "frame-server";
// Tăng z-index lên 9999 để đè hoàn toàn lên video, nhưng dưới nút chọn server (100000)
iframe.style.cssText = "background:black;position:fixed;right:0px;top:0px;left:0px;bottom:0px;width:100%;height:100%;display:none;z-index:9999;border:none;";
iframe.src = "about:blank";

keepElementsAndInjectControls(["video"]);

setTimeout(function(){
    document.body.appendChild(tempDiv);
    document.body.appendChild(iframe); 
}, 2000);

// --- XỬ LÝ CHUYỂN SERVER (ĐÃ FIX LỖI ĐÈ) ---
window.changeServer = function(selectElement) {
    // Lấy chính xác video của bạn bằng Class
    const _VIDEO = document.getElementsByClassName("v-node")[0]; 
    const _IFRAME = document.getElementsByClassName("frame-server")[0];
    const _OVERLAY = document.getElementsByClassName("custom-video-overlay")[0];
    const _TOAST = document.getElementsByClassName("custom-toast-container")[0];
    
    const link = selectElement.value;
    if (!link) return;

    if (/mp4|m3u8/i.test(link)) {
        if (_IFRAME) {
            _IFRAME.style.display = "none";   
            _IFRAME.src = "about:blank"; 
        }
        
        if (_VIDEO) {
            _VIDEO.style.display = "block";
            _VIDEO.src = link;
            _VIDEO.load();
            _VIDEO.play().catch(e => console.log("Chờ click để play: ", e));
        }
        if (_OVERLAY) _OVERLAY.style.display = "block";
        if (_TOAST) _TOAST.style.display = "flex";
    } 
    else {
        // Tắt chính xác video của bạn
        if (_VIDEO) {
            _VIDEO.pause();             
            _VIDEO.style.display = "none";
        }
        
        if (_OVERLAY) _OVERLAY.style.display = "none";
        if (_TOAST) _TOAST.style.display = "none";
        
        if (_IFRAME) {
            _IFRAME.style.display = "block";
            _IFRAME.src = link;
        }
        
        if (window.showToast) {
            window.showToast("Đôi khi chuyển đổi server sẽ hơi chậm. Nếu video chưa chạy hãy nhấn nhiều lần vào video nhé bạn.", 5000);
        }
    }
}

    // TRƯỜNG HỢP 2: SERVER EMBED / IFRAME
    