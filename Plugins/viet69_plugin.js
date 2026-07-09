BASEURL = "https://viet69z.me";

function getManifest() {
    return JSON.stringify({
        "id": "viet69",          
        "name": "Viet69",
        "description": "XXX Hay",
        "version": "1.3",             
        "baseUrl": "https://viet69z.me",
        "iconUrl": "https://raw.githubusercontent.com/alokillgtv-gif/VAXAPPSCRIPT/main/img/viet69.png", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "", "title": "Sex Mới", "type": "Grid" }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { "slug": "sinh-vien", "name": "Sinh Viên" },
        { "slug": "may-bay-ba-gia", "name": "Máy Bay" },
        { "slug": "?s=Vi%E1%BB%87t+nam", "name": "Việt Nam" },
        { "slug": "?s=T%E1%BA%ADp+th%E1%BB%83", "name": "Tập Thể" }, // ĐÃ SỬA: Thêm dấu phẩy ở đây
        { "slug": "?s=Hi%E1%BA%BFp+d%C3%A2m", "name": "Hiếp Dâm" }
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
        if (filtersJson.category) {
            return BASEURL + "/" + filters.category + "/page/" + page;
        }
        if (page > 1) {
            if (slug.indexOf("s=") > -1) {
                 return BASEURL + "/page/" + page + "/" + slug;
            } else {
                 return BASEURL + "/" + slug + "/page/" + page;
            }
        }
        return BASEURL + "/" + slug;
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/?s=" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf('http') === 0) return slug;
    return BASEURL + "/" + slug;
}

function getUrlCategories() { return BASEURL; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    try {
        var items = [];
        var pattern = /(?=<div[^>]*class="[^"]*entry-video__thumbnail[^"]*")/g;
        var splitItems = html.split(pattern).filter(Boolean);

        for (var j = 1; j < splitItems.length; j++) {
            var block = splitItems[j];
            var hrefMatch = block.match(/href="([^"]+)"/i);
            if (!hrefMatch) continue; 

            var id = hrefMatch[1].trim();
            var title = "";
            
            var altMatch = block.match(/title="([^"]+)"/i);
            if (altMatch) {
                title = altMatch[1].trim();
            } else {
                var labelMatch = block.match(/aria-label="([^"]+)"/i); // ĐÃ SỬA: Fallback sang aria-label thay vì trùng lặp quét title
                title = labelMatch ? labelMatch[1].trim() : "";
            }
            
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
		
        // ĐÃ SỬA: Loại bỏ khai báo trùng lặp var/const cho biến currentPage
        var currentRegex = /aria-current="page"[^>]*>([\d]+)<\/span>/;
        var currentMatch = html.match(currentRegex);
        var parsedCurrentPage = currentMatch ? parseInt(currentMatch[1], 10) : 1;

        // Tìm trang cuối cùng (Last Page)
        var pageNumRegex = /\/page\/([\d]+)\//g;
        var match;
        var maxPage = 1; 

        while ((match = pageNumRegex.exec(html)) !== null) {
            var pageNum = parseInt(match[1], 10);
            if (pageNum > maxPage) {
                maxPage = pageNum;
            }
        }

        return JSON.stringify({
            "items": items,
            "pagination": { 
                "currentPage": parsedCurrentPage, 
                "totalPages": maxPage, 
                "totalItems": 20 * maxPage,
                "itemsPerPage": 20
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

    var rmatch = html.match(/<meta[^>]*?property="og:url"[^>]*?content="([^"\s]+)"|<meta[^>]*?content="([^"\s]+)"[^>]*?property="og:url"/i);
    if (rmatch) { lurl = rmatch[1] || rmatch[2]; }

    rmatch = html.match(/property="og:image" content="([^"]+)"/i);
if (rmatch && rmatch[1]) { limg = rmatch[1].replace(/\?[\s\S]*?$/i, ""); }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }   
     
    var streamUrl = "";
    var iframeMatch = html.match(/src="(https:\/\/emb\.cd-vs\.com\/embed\/[^"]+)"/i);
   	if (iframeMatch && iframeMatch[1]) { streamUrl = iframeMatch[1]; }
     
    return JSON.stringify({
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes  + "\r\n\r\n" + lurl + "\r\n\r\n" + streamUrl,
        servers: [
            {
                name: "Server",
                episodes: [
                    { id: lurl, name: "Xem Ngay", slug: "full" }
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

function parseDetailResponse(html, url) {
    try {
        // Đọc trực tiếp từ thuộc tính của BaseJSON đã lưu ở bước đầu tiên
// Quét lấy link nhúng theo domain đã tối ưu
        var streamUrl = "";
        var iframeMatch = html.match(/src="(https:\/\/emb\.cd-vs\.com\/embed\/[^"]+)"/i);
        if (iframeMatch && iframeMatch[1]) { streamUrl = iframeMatch[1]; }
        
        return JSON.stringify({
            url: streamUrl,
            isEmbed: true // Vẫn cần fetch tiếp
        });
        
    } catch (e) {
        return JSON.stringify({ "url": "", "headers": {} });
    }
}


function parseEmbedResponse(html, sourceUrl) {
    
    
    var customjs = textJS(html, sourceUrl);
    customjs += `
        function runScript($msg){
            //showToast("${sourceUrl}", duration = 60000)
        }
        function decodeBase64ToHtml(base64String) {
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
        }
        `
    
    return JSON.stringify({
        url: sourceUrl,
        isEmbed: false, // Kết thúc, đây là link stream cuối
        mimeType: "application/x-mpegURL", // Báo App đây là HLS
        headers: {
            "Referer": sourceUrl,
            "Custom-Js": customjs.trim()
        },
    });
    
    return JSON.stringify({ url: "", isEmbed: false });
}

function textJS(html, $url) {
    // ĐÃ SỬA: Chuẩn hóa lại cú pháp escape ký tự \$ trong Template Literals
    return `
function showToast(message, duration = 7000) {
    // 1. Kiểm tra xem trên màn hình đã có "khung chứa" Toast chưa, nếu chưa thì tự tạo bằng JS
    let container = document.getElementById('global-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        
        // Ép CSS trực tiếp bằng JS để đặt khung ở góc dưới bên phải màn hình
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '99999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        });
        document.body.appendChild(container);
    }
    
    // 2. Tạo phần tử Toast mới hoàn toàn bằng JS
    const toast = document.createElement('div');
    toast.innerText = message;
    
    // Ép CSS giao diện cho cục Toast (màu bo góc, bóng mờ, hiệu ứng hiện hình)
    Object.assign(toast.style, {
        background: 'rgba(50, 50, 50, 0.95)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        minWidth: '200px',
        transition: 'all 0.3s ease',
        transform: 'translateX(120%)', // Ban đầu nằm ẩn bên ngoài màn hình
        opacity: '0'
    });
    
    // Đưa cục Toast vào khung chứa
    container.appendChild(toast);
    
    // 3. Tạo hiệu ứng bay từ bên phải vào (Slide In) sau 10 mili-giây
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // 4. Tạo hiệu ứng mờ dần (Fade Out) và XÓA HOÀN TOÀN khỏi màn hình khi hết thời gian
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        
        // Chờ hiệu ứng ẩn chạy xong 300ms rồi xóa hẳn thẻ HTML này đi cho sạch bộ nhớ
        setTimeout(() => {
            toast.remove();
            // Nếu không còn thông báo nào nữa thì xóa luôn cái khung lớn cho gọn
            if (container.childElementCount === 0) {
                container.remove();
            }
        }, 300);
    }, duration);
}

function initCustomVideoFix() {
    const style = document.createElement('style');
    
    // Dùng dấu nháy đơn và nối chuỗi bằng dấu cộng để dễ nhìn, không bị trùng backtick
    var customcss = 'body { background: black; overflow: hidden; }#comments,header,footer,.entry-actions,.entry-header,.entry-info,.entry-content,#related-posts,.entry-content + .mt-2 {display:none}body * {background: black;}';
    
    style.innerHTML = customcss; // ĐÃ SỬA: Xóa dấu nháy đơn thừa
    document.head.appendChild(style);
    showToast("Chèn css mới", duration = 3000)
    if (typeof jwplayer === "function") {
        const player = jwplayer("previewPlayer");
        if (player && typeof player.getMute === "function") {
            if (player.getMute()) {
                player.setMute(false);
                showToast("Đã bật tiếng", duration = 3000)
            }
            player.setVolume(100);
        }
    }
    
    // Biến cờ (flag) để tránh việc hiển thị Toast liên tục gây rác màn hình khi nút đang được nhấn
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
                showToast("Đã bỏ qua quảng cáo", 3000);
                
                // Reset lại trạng thái sau 2 giây để sẵn sàng cho quảng cáo tiếp theo (nếu có)
                setTimeout(() => { isSkipping = false; }, 2000);
            }
            
            // LƯU Ý: ĐÃ XÓA clearInterval(checkAndClick) ở đây để script tiếp tục chạy
            // đề phòng trường hợp có nhiều quảng cáo nối tiếp nhau.
        }
    }, 250); // 250ms là khoảng thời gian vừa đủ, không gây lag trình duyệt
    //runScript("sssssssss");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}

`;
}
function parseCategoriesResponse(html) { return JSON.stringify([
    { "slug": "sinh-vien", "name": "Sinh Viên" },
    { "slug": "may-bay-ba-gia", "name": "Máy Bay" },
    { "slug": "?s=Vi%E1%BB%87t+nam", "name": "Việt Nam" },
    { "slug": "?s=T%E1%BA%ADp+th%E1%BB%83", "name": "Tập Thể" }, // ĐÃ SỬA: Thêm dấu phẩy ở đây
    { "slug": "?s=Hi%E1%BA%BFp+d%C3%A2m", "name": "Hiếp Dâm" }
])}
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
/*

*/