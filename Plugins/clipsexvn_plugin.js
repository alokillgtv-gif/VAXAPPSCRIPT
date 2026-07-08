var BASEURL = "https://clipsexvn.mobi";
function getManifest() {
    return JSON.stringify({
        "id": "clipsexvn",          
        "name": "Clip Sex Hay",
        "description": "XXX Hay",
        "version": "1.0",             
        "baseUrl": BASEURL,
        "iconUrl": "https://clipsexvn.mobi/wp-content/themes/video3x/images/favicon.ico", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "new/", "title": "Hàng Mới", "type": "Grid" }
    ]);
}

function getPrimaryCategories() {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

// ĐÃ SỬA: Lỗi cú pháp khai báo biến trong JSON.stringify
function getFilterConfig() {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify({
        category: menulist
    });
}
// =============================================================================
// URL GENERATION
// =============================================================================
// https://clipsexvn.mobi/phim-sex-khong-che/page/3/
// https://clipsexvn.mobi/new/3/
// https://clipsexvn.mobi/search/be/page/3/

function getUrlList(slug, filtersJson) {
    try {
        if (slug && slug.indexOf("http") !== -1) {
            // Nếu có JSON và có page, ta có thể chèn page vào link (tùy bạn cấu hình, ở đây trả về slug gốc để tránh lỗi)
            return slug;
        }
        if (filtersJson) {
            // url có page và categ
            var fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
            var filters = JSON.parse(fixedJson);
            page = parseInt(filters.page) || 1;
            // Chỉ lấy category từ JSON nếu không truyền slug vào hà
            if (filters.category) {
                // dạng url có chuyên mục
                if (Array.isArray(filters.category) && filters.category.length > 0) {
                    path = filters.category[0].slug;
                } else if (typeof filters.category === 'string') {
                    path = filters.category;
                }
                return BASEURL + "/" + path + "/" + page;
            }
            if (page > 1 && slug.indexOf("http") == -1) {
                return BASEURL + "/" + slug + page;
            }
            // dạng url search
            if (page > 1 && slug.indexOf("http") > -1) {
                return slug + "/" + page;
            }
        }
        // url ko có page
        return BASEURL + "/" + slug;
        
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}

//var BASEURL = "https://clipsexvn.mobi";
// Test trường hợp của bạn (slug = "kinh-di", có kèm filter JSON)/
//var filtersJson = '{"page":5,"category":[{"slug":"hiep-dam/","name":"Hiếp dâm"}]}';
//console.log(getUrlList("kinh-di", filtersJson)); 
// Kết quả chuẩn: https://y2mate.ink/page/5?genres=kinh-di&categories=phim-le
// (genres "kinh-di" truyền ngoài vào đã ghi đè "am-nhac" trong JSON theo đúng logic ưu tiên slug)
// Test trường hợp không có filter JSON
//var filtersJson = '{"page":6}';
//console.log(getUrlList("https://clipsexvn.mobi/search/fdsfdsd", filtersJson));
// Kết quả chuẩn: https://y2mate.ink?categories=phim-bo



function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/search/" + encodeURIComponent(keyword);
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

function parseListResponse(html,$url) {
    try {
        var items = [];
        var regexList = /class="video-item[\s\S]*?title="([^"']+)"[^>]+href="([^"']+)"[\s\S]*?src="([^"']+)"/g;
        var matchList;
        
        while ((matchList = regexList.exec(html)) !== null) {
            if (matchList[2] && matchList[2].indexOf("http") > -1) {
                var cleanThumb = matchList[3].replace(/&amp;/g, '&');
                items.push({
                    "id": matchList[2],
                    "title": matchList[1].trim(),
                    "posterUrl": cleanThumb,
                    "backdropUrl": cleanThumb
                });
            }
        }
        
        var totalPages = 999;
        var currentPage = 1;
        
        return JSON.stringify({
            "items": items,
            "pagination": { "currentPage": currentPage, "totalPages": totalPages }
        });
    } catch (e) {
        var items = [];
        items.push({
            "id": $url,
            "title": "Lỗi: " + e,
            "posterUrl": "",
            "backdropUrl": ""
        });
        return JSON.stringify({ "items": items, "pagination": { "currentPage": 1, "totalPages": 1 } });
    }
}
//var html = $("html")[0].outerHTML;
//JSON.parse(parseListResponse(html))



function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html,$url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var streamUrl = ""; // ĐÃ SỬA: Khai báo rõ ràng biến streamUrl tránh lỗi Global leak

    var rmatch = html.match(/link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1].replace("https://xhamster.com", BASEURL); }

    rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    
    // ĐÃ SỬA: Loại bỏ khai báo trùng lặp `var rmatch`
    rmatch = html.match(/class=["']video-player[\s\S]*?src=["']([^"']+)"/i);
    if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
        
    return JSON.stringify({
        id: streamUrl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n" + streamUrl + "\r\n\r\n" + lurl,
        servers: [
            {
                name: "Servers: ",
                episodes: [
                    { id: streamUrl, name: "Server 1", slug: "full" },{ id: streamUrl + "2", name: "Server 2", slug: "full" },{ id: streamUrl + "3", name: "Server 3", slug: "full" }
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
//BASEURL = "https://clipsexvn.mobi";
//var html = $("html")[0].outerHTML;
//var $url = "https://clipsexvn.mobi/me-ke-dam-duc-quyen-ru-con-chong-lam-tinh-cuc-suong.html";
//JSON.parse(parseMovieDetail(html,$url))

function parseDetailResponse(html, url) {
    try {
        var customJs = textJS(html, url);

        return JSON.stringify({
            url: url,
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

function textJS(html, $url) {
    // ĐÃ SỬA: Chuẩn hóa lại cú pháp escape ký tự \$ trong Template Literals
    return `
// 1. Tự động chèn CSS vào <head> khi file JS này được tải
const style = document.createElement('style');
style.textContent = "#toast-container {position: fixed;top: 20px;right: 20px;z-index: 9999;display: flex;flex-direction: column;gap: 10px;}.toast-bubble {background-color: #333;color: #fff;padding: 12px 24px;border-radius: 8px;box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);font-family: sans-serif;font-size: 14px;min-width: 200px;max-width: 350px;opacity: 0;transform: translateX(100%);transition: all 0.4s ease;}.toast-bubble.show {opacity: 1;transform: translateX(0);}.toast-bubble.hide {opacity: 0;transform: translateX(100%);}";
document.head.appendChild(style);

// 2. Tự động tạo container chứa thông báo và chèn vào <body>
let toastContainer = document.getElementById('toast-container');
if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
}

// 3. Hàm hiển thị thông báo (Bạn gọi hàm này ở bất cứ đâu)
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-bubble';
    toast.innerText = message;
    
    toastContainer.appendChild(toast);
    
    // Hiển thị (Slide in)
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Tự động xóa sau 5 giây
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        
        // Chờ hiệu ứng ẩn kết thúc rồi xóa khỏi DOM
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 5000);
}
function initCustomVideoFix() {
    const style = document.createElement('style');
    var customcss = 'body { background: black; overflow: hidden; }';
    style.innerHTML = customcss;
    document.head.appendChild(style);
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('click', () => { autoFullscreenLoop(video); });
            autoFullscreenLoop(video);
    } else {
        
    }
    
} 

function autoFullscreenLoop(videoElement) {
    if (!videoElement) return;
    const checkInterval = setInterval(() => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (isFullscreen) { clearInterval(checkInterval); return; }
        videoElement.muted = false;
        if (videoElement.paused) { videoElement.play().catch(err => {}); }
        if (videoElement.requestFullscreen) { videoElement.requestFullscreen().catch(err => {}); }
    }, 100);
    jwplayer("player").setFullscreen(true);
    jwplayer("player").setMute(false);
    showToast("Đã bật tiếng và toàn màn hình");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}
`;
}

function parseCategoriesResponse(apiResponseJson) {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

function getLISTmenu() {
    return `
phim-sex-vietsub/@@Sex Phụ Đề
phim-sex-hiep-dam/@@Sex Hiếp Dâm
phim-sex-loan-luan/@@Sex Loạn Luân
phim-sex-vung-trom/@@Sex Vụng Trộm
phim-sex-viet-nam/@@Sex Việt Nam
phim-sex-trung-quoc/@@Sex Trung Quốc
phim-sex-khong-che/@@Sex Không Che
phim-sex-nhat-ban/@@Sex Nhật Bản
phim-sex-chau-au/@@Sex Châu Âu
phim-sex-dit-nhau/@@Phim Địt Nhau
sextop1/@@SexTop1
vlxx/@@VLXX
xnxx/@@XNXX
phim-heo/@@Phim Heo
`;
}

function buildMenu(listurl) {
    let menulist = [];
    if (!listurl) return menulist;
    
    let lines = listurl.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.indexOf('@@') === -1) continue;
        
        let parts = line.split('@@');
        let link = parts[0] ? parts[0].trim() : "";
        let name = parts[1] ? parts[1].trim() : "";
        let check = parts[2] ? parts[2].trim() : undefined;
        
        if (!link || !name) continue;
        
        let item = {};
        if (check === "false") {
            item = { "slug": link, "title": name, "type": "Horizontal" };
        } else if (check === "true") {
            item = { "slug": link, "title": name, "type": "Grid" };
        } else {
            item = { "slug": link, "name": name };
        }
        menulist.push(item);
    }
    return menulist;
}