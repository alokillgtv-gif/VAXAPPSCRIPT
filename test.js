/**
 * Dọn dẹp DOM, giữ lại các phần tử mong muốn và tự động gắn Control nếu có thẻ Video.
 * @param {string[]} selectors - Mảng các CSS Selector cần giữ lại (VD: ['#myVideo', '.chat-box'])
 */
function keepElementsAndInjectControls(selectors) {
    // 1. Thu thập tất cả các elements cần giữ
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

    // 2. Tìm tất cả các element cha của toàn bộ targets để bảo vệ đường dẫn DOM
    targets.forEach(target => {
        let current = target.parentElement;
        while (current && current !== document.body && current !== document.documentElement) {
            ancestors.add(current);
            current = current.parentElement;
        }
    });

    // 3. Hàm đệ quy dọn dẹp các element thừa
    function cleanUp(container) {
        const children = Array.from(container.childNodes);
        children.forEach(child => {
            if (targetsSet.has(child)) {
                // Đích đến -> Giữ nguyên, không can thiệp sâu thêm để tránh lỗi
            } else if (ancestors.has(child)) {
                // Là một phần của đường dẫn cha -> Giữ lại và đi sâu vào trong
                if (child.nodeType === Node.ELEMENT_NODE) cleanUp(child);
            } else {
                // Rác -> Xóa
                child.remove();
            }
        });
    }

    cleanUp(document.body);
    document.body.style.background = 'black';

    // 4. Xử lý UI và tiêm (inject) Video Control
    targets.forEach(target => {
        if (target.tagName.toLowerCase() === 'video') {
            // Ép video full màn hình ngay tại vị trí cũ, không thay đổi cấu trúc DOM
            Object.assign(target.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                zIndex: '9998', // Lớp dưới của Control
                objectFit: 'contain',
                background: '#000',
                margin: '0',
                padding: '0'
            });
            
            // Xóa control mặc định
            target.controls = false; 

            // Tiêm cơ chế custom control
            injectCustomVideoControls(target);
        } else {
            // CSS cơ bản cho các phần tử khác được giữ lại (bạn có thể custom thêm)
            target.style.position = 'relative';
            target.style.zIndex = '9999';
        }
    });
}

/**
 * Tạo UI và gắn logic điều khiển cho thẻ video có sẵn
 */
function injectCustomVideoControls(video) {
    // --- KHỞI TẠO HỆ THỐNG TOAST ---
    const toastContainer = document.createElement('div');
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

    // --- CƠ CHẾ LƯU VỊ TRÍ ---
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

    // --- XÂY DỰNG GIAO DIỆN (OVERLAY) ---
    // Overlay Container đè lên video (xuyên thấu click để video vẫn nhận diện nếu cần)
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;font-family:sans-serif;';
    
    // Gradient nền cho controls
    const controls = document.createElement('div');
    controls.style.cssText = 'pointer-events:auto;position:absolute;bottom:0;left:0;width:100%;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:12px 16px 20px;box-sizing:border-box;transition:opacity 0.3s;opacity:0;';
    
    // Thanh tiến trình
    const progressWrap = document.createElement('div');
    progressWrap.style.cssText = 'width:100%;height:6px;background:rgba(255,255,255,0.3);border-radius:3px;cursor:pointer;position:relative;margin-bottom:12px;';
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'height:100%;background:#e74c3c;width:0%;border-radius:3px;pointer-events:none;';
    progressWrap.appendChild(progressBar);

    // Hàng nút bấm
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;align-items:center;gap:12px;color:#fff;';

    const btnPlay = document.createElement('button');
    btnPlay.textContent = video.paused ? '▶' : '⏸';
    const btnMute = document.createElement('button');
    btnMute.textContent = video.muted ? '🔇' : '🔊';
    const timeDisplay = document.createElement('span');
    timeDisplay.style.cssText = 'font-size:13px;min-width:100px;';
    timeDisplay.textContent = '0:00 / 0:00';
    
    // Nút Play bự giữa màn hình
    const bigPlayBtn = document.createElement('div');
    bigPlayBtn.textContent = '▶';
    bigPlayBtn.style.cssText = 'pointer-events:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;background:rgba(0,0,0,0.6);border-radius:50%;display:'+(video.paused?'flex':'none')+';align-items:center;justify-content:center;color:#fff;font-size:36px;cursor:pointer;z-index:15;';

    // Style chung cho các nút
    [btnPlay, btnMute].forEach(btn => {
        btn.style.cssText = 'background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:4px 8px;outline:none;';
    });

    btnRow.append(btnPlay, btnMute, timeDisplay);
    controls.append(progressWrap, btnRow);
    overlay.append(bigPlayBtn, controls);
    document.body.appendChild(overlay);

    // --- CÁC HÀM TIỆN ÍCH ---
    function formatTime(sec) {
        if (!sec || isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' + s : s);
    }

    function togglePlay() {
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

    // --- RÀNG BUỘC SỰ KIỆN (EVENT LISTENERS) ---
    let controlsTimeout;
    function showControls() {
        controls.style.opacity = '1';
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => { controls.style.opacity = '0'; }, 3000);
    }

    // Sự kiện trên Video
    video.addEventListener('timeupdate', () => { updateUI(); savePosition(); });
    video.addEventListener('play', updateUI);
    video.addEventListener('pause', updateUI);
    video.addEventListener('loadedmetadata', restorePosition);
    video.addEventListener('volumechange', () => { btnMute.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊'; });
    
    // Kích hoạt restore ngay nếu video đã load xong metadata trước khi chạy script
    if (video.readyState >= 1) restorePosition();

    // Sự kiện tương tác UI
    document.addEventListener('mousemove', showControls);
    overlay.addEventListener('click', showControls);
    
    // Vùng click ẩn để Pause/Play ngay trên video (vì overlay không nhận click ngoại trừ controls)
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

    // Sự kiện bàn phím (Shortcuts)
    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
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


function setServer() {
    // 1. Dữ liệu Server của bạn
    /*
    const LINKVIDEO = [
        {"link":"https://sv1.website/get/80b33ffed5588401acc0894f8e9bf2aaf8fff054.m3u8","name":"Server 1"},
        {"link":"https://sv1.website/get/80b33ffed5588401acc0894f8e9bf2aaf8fff054-gg.m3u8","name":"Server 2"},
        {"link":"https://zpi.cx/s12/z1BeuPycr.mp4","name":"Server 3"}
    ];
*/
    // 2. Tự động thêm CSS vào trang để làm mờ và định vị nút trôi nổi bên phải
    const css = `
        .server-widget {
            position: fixed; right: 20px; top: 50%; transform: translateY(-50%);
            z-index: 99999; display: flex; flex-direction: column; align-items: flex-end;
            font-family: sans-serif;
        }
        .server-trigger-btn {
            background-color: #ff5722; color: white; border: none; padding: 12px 16px;
            border-radius: 30px; cursor: pointer; font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: all 0.3s ease;
            opacity: 0.4; /* Mặc định làm mờ đi */
        }
        .server-widget:hover .server-trigger-btn {
            opacity: 1; transform: scale(1.05); /* Hiện rõ và phóng to nhẹ khi hover */
        }
        .server-list {
            display: none; flex-direction: column; gap: 8px; margin-top: 10px;
            background: rgba(30, 30, 30, 0.95); padding: 10px; border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5); border: 1px solid #444; min-width: 120px;
        }
        .server-widget:hover .server-list {
            display: flex; /* Hover vào là hiện danh sách server */
        }
        .server-item {
            background-color: #333; color: #fff; border: 1px solid #555;
            padding: 8px 12px; border-radius: 4px; cursor: pointer; text-align: center;
            font-size: 14px; transition: all 0.2s;
        }
        .server-item:hover { background-color: #ff5722; border-color: #ff5722; }
        .server-item.active { background-color: #4caf50; border-color: #4caf50; font-weight: bold; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // 3. Khởi tạo cấu trúc giao diện Widget bằng JS
    const widget = document.createElement('div');
    widget.className = 'server-widget';

    const triggerBtn = document.createElement('button');
    triggerBtn.className = 'server-trigger-btn';
    triggerBtn.textContent = 'Chọn Server';
    widget.appendChild(triggerBtn);

    const listContainer = document.createElement('div');
    listContainer.className = 'server-list';
    widget.appendChild(listContainer);

    // Đẩy widget ra ngoài màn hình
    document.body.appendChild(widget);

    // 4. Tìm thẻ <video> hiện có trên trang (sẽ tìm thẻ đầu tiên, hoặc bạn đổi thành document.getElementById('id_cua_ban'))
    const videoPlayer = document.querySelector('video');

    if (!videoPlayer) {
        console.error("Không tìm thấy thẻ <video> nào trên trang!");
        return;
    }

    // 5. Hàm xử lý logic chuyển đổi server
    function switchServer(url, activeBtn) {
        videoPlayer.src = url;
        videoPlayer.load();
        showToast(url,6000,true);
        videoPlayer.play().catch(err => {
            console.log("Tự động phát bị chặn, cần user click trực tiếp:", err);
        });

        // Đổi chữ trên nút chính thành tên server đang chạy
        triggerBtn.textContent = activeBtn.textContent;

        // Cập nhật trạng thái Active của các nút
        const allButtons = listContainer.querySelectorAll('.server-item');
        allButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // 6. Duyệt mảng dữ liệu để tạo các nút Server
    LINKVIDEO.forEach((server, index) => {
        const btn = document.createElement('button');
        btn.className = 'server-item';
        btn.textContent = server.name;

        btn.addEventListener('click', () => {
            switchServer(server.link, btn);
        });

        listContainer.appendChild(btn);

        // Mặc định load Server 1 khi trang vừa tải xong
        if (index === 0) {
           // switchServer(server.link, btn);
        }
    });
}

keepElementsAndInjectControls(["video"]);
setTimeout(function(){
        setServer()
},2000)
