html, body { 
    margin: 0; 
    padding: 0; 
    width: 100%; 
    height: 100%; 
    background: #000; 
    overflow: hidden;
}

.page-main-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

/* Xoay wrapper -90deg để khớp hướng màn hình ngang */
.page-main-wrapper.force-rotate {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    width: 100vh !important;  
    height: 100vw !important; 
    transform: translate(-50%, -50%) rotate(-90deg) !important;
    transform-origin: center !important;
    z-index: 9996 !important;
    background: #000 !important;
    overflow: hidden !important;
}

/* GIAO DIỆN CONTAINER: Chuyển thành row để xếp ngang hàng và căn giữa */
.server-container { 
    position: fixed; 
    top: 12px; 
    right: 12px; 
    z-index: 10000; 
    font-family: Arial, sans-serif; 
    display: flex; 
    flex-direction: row; /* Xếp ngang */
    gap: 6px;            /* Khoảng cách giữa 2 nút */
    align-items: center;
}

.server-btn-wrapper {
    position: relative;
}

/* GIAO DIỆN NÚT BẤM: Thu nhỏ kích thước và làm mờ 50% */
.server-main-btn, .server-rotate-btn { 
    display: inline-block;
    background: rgba(0, 0, 0, 0.5); 
    color: #fff; 
    border: 1px solid rgba(255, 255, 255, 0.2); 
    padding: 5px 10px;      /* Giảm padding cho nút nhỏ lại */
    font-size: 12px;        /* Chữ nhỏ hơn */
    border-radius: 4px; 
    cursor: pointer; 
    backdrop-filter: blur(3px); 
    font-weight: bold; 
    min-width: 95px;        /* Thu hẹp chiều rộng tối thiểu */
    text-align: center; 
    box-sizing: border-box;
    opacity: 0.5;           /* Làm mờ 50% */
    transition: all 0.2s ease;
}

/* Khi hover hoặc chạm vào nút sẽ sáng rõ lên */
.server-main-btn:hover, .server-rotate-btn:hover { 
    background: rgba(0, 0, 0, 0.8); 
    border-color: rgba(255, 255, 255, 0.5);
    opacity: 1;             /* Hiện rõ 100% */
}

/* Menu dropdown hiển thị hợp lý ngay dưới nút chọn server */
.server-dropdown { 
    display: none; 
    position: absolute; 
    top: 100%; 
    right: 0; 
    margin-top: 4px; 
    background: rgba(20, 20, 20, 0.95); 
    border: 1px solid #444; 
    border-radius: 4px; 
    min-width: 130px; 
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.server-dropdown.show { 
    display: block;
}

.server-item { 
    padding: 10px 12px; 
    color: #ccc; 
    cursor: pointer; 
    transition: all 0.2s; 
    text-align: left; 
    font-size: 13px; 
    border-left: 3px solid transparent;
}

.server-item:hover { 
    background: #333; 
    color: #fff;
}

.server-item.active { 
    color: #fff; 
    background: rgba(0, 255, 0, 0.15); 
    border-left: 3px solid #00ff00; 
    font-weight: bold;
}

.overlay-black { 
    position: fixed !important; 
    top: 0 !important; 
    left: 0 !important; 
    width: 100% !important; 
    height: 100% !important; 
    background: #000 !important; 
    z-index: 9990 !important; 
    display: none;
}

.iframe-wrapper { 
    position: fixed !important; 
    top: 0 !important; 
    left: 0 !important; 
    width: 100% !important; 
    height: 100% !important; 
    z-index: 9991 !important; 
    border: none !important; 
    display: none; 
    background: #000 !important;
}

/* Hiệu ứng Loading giữ nguyên thẳng màn hình */
.server-loading-box { 
    position: fixed; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    z-index: 9999; 
    display: none; 
    text-align: center; 
    color: #fff; 
    pointer-events: none; 
    font-family: Arial, sans-serif;
}

.server-spinner { 
    width: 35px; 
    height: 35px; 
    border: 3px solid rgba(255, 255, 255, 0.1); 
    border-top: 3px solid #00ff00; 
    border-radius: 50%; 
    margin: 0 auto 10px auto; 
    animation: server-spin 0.8s linear infinite;
}

@keyframes server-spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); }
}
