(function() {
    'use strict';

    // ─── BIẾN TOÀN CỤC CỦA SCRIPT ───
    var DEVELOPE = false;
    var VIDEO_ON = false;
    function GetlinkVideo() {
        var htmlTAG = document.getElementsByTagName("html")[0];
//https://emb.cd-vs.com/embed/7c59c84f-a540-4496-afb0-dc7eb8f9c26f
    
        function keepOnlyElementWithoutReload(selector) {
            const target = document.querySelector(selector);
            
            if (!target) {
                console.error("Không tìm thấy element!");
                return;
            }
            
            // 1. Tạo một tập hợp (Set) chứa element mục tiêu và tất cả các cha của nó
            const ancestors = new Set();
            let current = target;
            while (current && current !== document.body) {
                ancestors.add(current);
                current = current.parentElement;
            }
            
            // 2. Hàm đệ quy để duyệt và xóa các element khác
            function cleanUp(container) {
                // Lấy danh sách childNodes (bao gồm cả text và comment)
                const children = Array.from(container.childNodes);
                
                children.forEach(child => {
                    // Nếu child không nằm trong danh sách cha cần giữ lại
                    if (!ancestors.has(child)) {
                        // Và child không chính là cái target
                        if (child !== target) {
                            child.remove(); // Xóa nó đi
                        }
                    } else {
                        // Nếu nó là một phần tử cha, ta cần đi sâu vào trong để xóa các anh chị em khác của target
                        if (child.nodeType === Node.ELEMENT_NODE) {
                            cleanUp(child);
                        }
                    }
                });
            }
            
            // 3. Bắt đầu dọn dẹp từ document.body
            cleanUp(document.body);
            
            // 4. (Tùy chọn) Căn giữa target nếu cần
            // Bạn có thể thêm code căn giữa ở đây, ví dụ:
            Object.assign(target.style, {
                position: 'fixed',
                top: '30px',
                left: '0%',
                width: '100%',
                height: '100%',
                zIndex: '9999'
            });
            document.body.style.background = 'black';
        }
        // --- CÁCH SỬ DỤNG ---
        // Đảm bảo iframe đang chạy. Gọi hàm này:
        keepOnlyElementWithoutReload('#jsVideoIframe');
        document.querySelectorAll('style').forEach(tag => tag.remove());
        
        setTimeout(function() {
            document.getElementById("jsVideoIframe").click();
        }, 3000)
        showToast("Xem ít thôi mấy bác, nhấn vào video để chạy nha.\)\)", 10000, true);
        
        let isSkipping = false;
    
        const checkAndClick = setInterval(() => {
            const skipButton = document.getElementById("skip-ad");
            
            if (skipButton) {
                // Kiểm tra xem nút có bị ẩn bằng CSS không (nếu có thuộc tính display: none hoặc opacity: 0 thì bỏ qua)
                const style = window.getComputedStyle(skipButton);
                if (style.display === 'none' || style.visibility === 'hidden') return;
    
                skipButton.click();
                console.log("🎯 Đã phát hiện và kích hoạt nút bỏ qua quảng cáo!");
    
                // Chỉ hiện toast 1 lần cho mỗi đợt skip để đỡ spam giao diện
                if (!isSkipping) {
                    isSkipping = true;
                    showToast("Đã bỏ qua quảng cáo", 3000,DEVELOPE);
                    
                    // Reset lại trạng thái sau 2 giây để sẵn sàng cho quảng cáo tiếp theo (nếu có)
                    setTimeout(() => { isSkipping = false; }, 2000);
                }
                
                // LƯU Ý: ĐÃ XÓA clearInterval(checkAndClick) ở đây để script tiếp tục chạy
                // đề phòng trường hợp có nhiều quảng cáo nối tiếp nhau.
            }
        }, 250); // 250ms là khoảng thời gian vừa đủ, không gây lag trình duyệt
        showToast('<textarea style="width:500px;height:300px">'+htmlTAG.outerHTML+'</textarea>', 50000, DEVELOPE);
        if(VIDEO_ON == true){
            buildVideo(stream1, stream2);
        }
    }
    // ─── HÀM TOAST ĐƯỢC ĐƯA RA NGOÀI (Có thể gọi ở mọi nơi) ───
    function showToast(message, duration = 7000, check = true) {
        if (check == false) {
            return false;
        }
        let container = document.getElementById('global-toast-container');
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
        
        const toastEl = document.createElement('div'); // Đổi tên thành toastEl để tránh trùng
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
        
        setTimeout(() => {
            toastEl.style.transform = 'translateX(0)';
            toastEl.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            toastEl.style.transform = 'translateX(120%)';
            toastEl.style.opacity = '0';
            
            setTimeout(() => {
                toastEl.remove();
                if (container.childElementCount === 0) {
                    container.remove();
                }
            }, 300);
        }, duration);
    }

    GetlinkVideo();
})()

