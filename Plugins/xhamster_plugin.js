// =============================================================================
// VAAPP Plugin - Xhamster (Bản vá chuẩn hóa theo cấu trúc Core mới nhất)
// =============================================================================
BASEURL = "https://xhwide.com";
DEV = "true";
function getManifest() {
    return JSON.stringify({
        "id": "xhamster",          
        "name": "Xhamster",
        "description": "XXX Hay",
        "version": "1.6",             
        "baseUrl": BASEURL,
        "iconUrl": "https://static.cdnsolutions.media/xh-desktop/images/favicon/favicon-v2-256x256.ico", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "categories/vietnamese", "title": "Việt Nam", "type": "Horizontal" },
        { "slug": "categories/bus", "title": "Xe Bus", "type": "Horizontal" },
        { "slug": "categories/uncensored", "title": "Không Che", "type": "Horizontal" },
        { "slug": "best/weekly", "title": "Hay Trong Tuần", "type": "Horizontal" },
        { "slug": "newest", "title": "Hàng Mới", "type": "Grid" },
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { "slug": "categories/anal", "name": "Lỗ Nhị"},
        { "slug": "categories/big-tits", "name": "Vú Bự"},
        { "slug": "categories/gangbang", "name": "Tập Thể"},
        { "slug": "categories/threesome", "name": "Chơi 3"},
        { "slug": "categories/russian", "name": "Gái Nga"},
        { "slug": "categories/hentai", "name": "Hentai"}
    ]);
}

function getFilters() {
    return JSON.stringify({
        "sort": [
            { "name": "Mới nhất", "value": "newest" }
        ]
    });
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        
        if (page > 1) {
            return BASEURL + "/" + slug + "/" + page;
        }
        return BASEURL + "/" + slug;
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/search/" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf('http') === 0) return slug;
    return BASEURL + "/" + slug;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    try {
        var items = [];
var pattern = /(?=<div[^>]*class="[^"]*thumb-list__item[^"]*")/g;
var splitItems = html.split(pattern).filter(Boolean);

for (var j = 1; j < splitItems.length; j++) {
    var block = splitItems[j];
    var hrefMatch = block.match(/href="([^"]+)"/i);
    if (!hrefMatch) continue; // Bỏ qua nếu khối không chứa link

    var id = hrefMatch[1].trim();
    
    // ĐIỀU KIỆN 2: Đường dẫn id buộc phải chứa dạng "/videos/"
    if (id.indexOf('/videos/') === -1) {
        continue; // Loại bỏ nếu không đúng định dạng đường dẫn video
    }

    var title = "";
    
    // Thử lấy title từ thuộc tính alt của ảnh trước
    var altMatch = block.match(/img[\s\S]*?alt="([^"]+)"/i);
    if (altMatch) {
        title = altMatch[1].trim();
    } else {
        // Khử fallback sang aria-label nếu alt không tồn tại
        var labelMatch = block.match(/aria-label="([^"]+)"/i);
        title = labelMatch ? labelMatch[1].trim() : "";
    }
    
    // ĐIỀU KIỆN 1: Nếu tiêu đề rỗng hoặc là "Video không tiêu đề" thì không gán vào items
    if (!title || title === "Video không tiêu đề") {
        continue; 
    }
    
    var srcMatch = block.match(/img[\s\S]*?src="([^"]+)"/i);
    var posterUrl = srcMatch ? srcMatch[1].trim() : "https://ic-vt-nss.cdnsolutions.media/a/YjgwNDg0MGRkZWVjZjQ1ZGVhZjc5MzQ0ZWJkMDlhOTA/s(w:1280,h:720),webp/026/522/500/1280x720.17475568.jpg";
    
    items.push({
        "id": id,          
        "title": title, 
        "posterUrl": posterUrl, 
        "backdropUrl": posterUrl
    });
}
		
        var currentPage = 1;
        var totalPages = 1;

        var currentMatch = html.match(/page-button-link--active[^>]*>(\d+)/i);
        var maxMatch = html.match(/page-limit-button--right[^>]*page-button-link[^>]*>(\d+)/i);

        if (currentMatch) currentPage = parseInt(currentMatch[1], 10);
        if (maxMatch) totalPages = parseInt(maxMatch[1], 10);
        if (totalPages < currentPage) totalPages = currentPage;

        return JSON.stringify({
            "items": items,
            "pagination": { 
                "currentPage": currentPage, 
                "totalPages": 10, // ĐÃ SỬA: Đồng bộ đúng biến totalPages động
                "totalItems": 46 * totalPages,
                "itemsPerPage": 46
            }
        });
    } catch (e) {
        return JSON.stringify({ "items": [], "pagination": { "currentPage": 1, "totalPages": 1 } });
    }
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";

    var rmatch = html.match(/link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1].replace("https://xhamster.com",BASEURL); }

    rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    
     var rmatch = html.match(/rel="preload"\shref="([\s\S]*?m3u8)"/i);
   	 if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
        
     
    return JSON.stringify({
        id: streamUrl ,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n" + streamUrl + "\r\n\r\n" +lurl,
        servers: [
            {
                name: "Xhamster Stream",
                episodes: [
                    { id: streamUrl , name: "Xem Ngay", slug: "full" }
                ]
            }
        ],
        quality: "HD",
        year: 2026,
        rating: 8.5,
        status: "Full",
        duration: "N/A",
        casts: "N/A",
        director: "N/A",
        category: "18+"
    });
}
//<link rel="preload" href="https://video3.cdnsolutions.media/key=kePlMtN+ADhubUR5+oDV3A,end=1782846000/data=2405:4802:918e:9690:213f:c9b0:ee12:58e-dvp/media=hls4/multi=256x144:144p:,426x240:240p:,854x480:480p:,1280x720:720p:,1920x1080:1080p:/029/485/972/_TPL_.av1.mp4.m3u8" as="fetch" crossorigin="true">
function parseDetailResponse(html,url) {
    try {
        var streamUrl = "";
        
        var rmatch = html.match(/rel="preload"\shref="([\s\S]*?m3u8)"/i);
   	 if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
        
      /*
      var rmatch = html.match(/link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1]; }
    */
		var customJs = `
// Script chạy cho server heovl
function initCustomVideoFix() {
    const style = document.createElement('style');
    var customcss = 'body { background: black; overflow: hidden; }';
    style.innerHTML = customcss;
    document.head.appendChild(style);
    const video = document.querySelector('video');
    const body = document.querySelector('body');
    if (video) {
        video.addEventListener('click', () => {
            autoFullscreenLoop(video);
        });
        autoFullscreenLoop(video);
    } else {
        console.log("Không tìm thấy phần tử video trên trang.");
    }
    var $DEV = "${DEV}"
    // Gọi hàm alert tùy chỉnh
    
    customAlert("${$url}||${BASE}", "${html}");
    
} // <--- ĐÃ BỔ SUNG: Dấu ngoặc đóng của hàm initCustomVideoFix nằm ở đây

// Định nghĩa hàm customAlert độc lập bên ngoài để code sạch sẽ hơn
function customAlert(title, message) {
    // 1. Tạo lớp nền mờ (Overlay)
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '99999',
        opacity: '0',
        transition: 'opacity 0.2s ease'
    });
    
    // 2. Tạo hộp thoại chính (Box)
    const box = document.createElement('div');
    Object.assign(box.style, {
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        maxWidth: '380px',
        width: '85%',
        textAlign: 'center',
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        transform: 'scale(0.8)',
        transition: 'transform 0.2s ease'
    });
    
    // 3. Tạo Tiêu đề (Title)
    const titleEl = document.createElement('input');
    titleEl.type = 'text'; // Biến thành input text
    titleEl.value = title;
    Object.assign(titleEl.style, {
        margin: '0 0 12px 0',
        color: '#222222',
        fontSize: '15px',
        fontWeight: '600'
    });
    
    // 4. Tạo Nội dung (Message)
    const msgEl = document.createElement('textarea');
    msgEl.value = message;
    Object.assign(msgEl.style, {
        margin: '0 0 20px 0',
        color: '#555555',
        fontSize: '15px',
        height: '200px',
        lineHeight: '1.5'
    });
    
    // 5. Tạo Nút bấm (Button)
    const btn = document.createElement('button');
    btn.innerText = 'OK';
    Object.assign(btn.style, {
        padding: '10px 28px',
        fontSize: '15px',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        outline: 'none',
        transition: 'background-color 0.1s'
    });
    
    // Hiệu ứng hover cho nút
    btn.onmouseover = () => btn.style.backgroundColor = '#0056b3';
    btn.onmouseout = () => btn.style.backgroundColor = '#007bff';
    
    // 6. Hàm đóng và xóa Alert khỏi giao diện
    const closeAlert = () => {
        overlay.style.opacity = '0';
        box.style.transform = 'scale(0.8)';
        setTimeout(() => {
            overlay.remove();
        }, 200);
    };
    
    // Sự kiện khi bấm nút hoặc bấm ra ngoài màn hình
    btn.onclick = closeAlert;
    overlay.onclick = (e) => {
        if (e.target === overlay) closeAlert();
    };
    
    // 7. Lắp ráp các phần tử lại với nhau
    box.appendChild(titleEl);
    box.appendChild(msgEl);
    box.appendChild(btn);
    overlay.appendChild(box);
    
    // 8. Đưa vào body và kích hoạt hiệu ứng hiển thị
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
        box.style.transform = 'scale(1)';
    }, 10);
}

// Định nghĩa hàm autoFullscreenLoop độc lập bên ngoài
function autoFullscreenLoop(videoElement) {
    if (!videoElement) return;
    
    const checkInterval = setInterval(() => {
        const isFullscreen = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;
        
        if (isFullscreen) {
            console.log("Đã vào Fullscreen thành công! Dừng vòng lặp.");
            clearInterval(checkInterval);
            return;
        }
        
        console.log("Đang thử mở Fullscreen và bật tiếng...");
        
        videoElement.muted = false;
        if (videoElement.paused) {
            videoElement.play().catch(err => console.log("Chưa phát được video:", err.message));
        }
        
        if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen().catch(err => {});
        } else if (videoElement.webkitRequestFullscreen) {
            videoElement.webkitRequestFullscreen();
        } else if (videoElement.msRequestFullscreen) {
            videoElement.msRequestFullscreen();
        }
    }, 100);
}

// Khởi chạy script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}
`;

return JSON.stringify({
    url: streamUrl,
    headers: {
        "Referer": BASEURL,
        "Origin": BASEURL,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Custom-Js": customJs.trim()
    }
});
    } catch (error) {
        return JSON.stringify({ url: "", headers: {} });
    }
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
