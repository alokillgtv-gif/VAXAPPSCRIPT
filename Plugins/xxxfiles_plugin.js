
BASEURL = "https://www.xxxfiles.com";
BASEIMG = "https://www.xxxfiles.com/img/logo.png?v=3";
// https://www.xxxfiles.com/favicon-32x32.png
function getManifest() {
    return JSON.stringify({
        "id": "xxxfiles",
        "name": "xxxfiles",
        "description": "XXX Hay",
        "version": "1.1",
        "BASEURL": BASEURL,
        "iconUrl": "https://www.xxxfiles.com/favicon-32x32.png",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}



function getHomeSections() {
    var listurl = "latest-updates/@@Hàng Mới@@true";
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
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

// ĐÃ SỬA: Xóa bỏ hàm getUrlList thừa, giữ lại hàm chuẩn logic phân trang
function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = parseInt(filters.page) || 1;
        var path = filters.category ? filters.category : slug;
        
        if (path.startsWith("/")) path = path.substring(1);
        
        // Đảm bảo đuôi link danh mục có dấu / để tránh bị Server redirect 301/403
        if (!path.endsWith("/") && path.indexOf('?') === -1) {
            path += "/";
        }
        
        var targetUrl = BASEURL + "/" + path;
        // search/black
        if (path.indexOf("/search/") > -1) {
            // Đối với trang tìm kiếm / tag
            if (page > 1) {
                targetUrl = targetUrl.replace(/\/$/, ""); // Xóa dấu / cuối nếu có để nối param
                targetUrl += "/" + page + "/";
            } else {
                targetUrl = targetUrl.replace(/\/$/, "");
                targetUrl += "/";
            }
        } else {
            // Đối với danh mục thông thường (ví dụ: porn/anal/videos/)
            if (page > 1) {
                targetUrl += "/" + page + "/";
            }
        }
        return targetUrl;
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

function getUrlCategories() { return BASEURL; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

//BASEURL = "https://motherless.xxx";
//var html = document.getElementsByTagName("html")[0].outerHTML;
//JSON.parse(parseListResponse(html));



function parseListResponse(html, currentUrl) {
    try {
        var items = [];
        
        // 1. Kiểm tra nếu HTML trống hoặc lỗi
        if (!html || html.indexOf('body') === -1) {
            return JSON.stringify({
                items: [{ id: currentUrl, title: "Lỗi: 1 - " + currentUrl, posterUrl: BASEIMG }],
                pagination: { currentPage: 1, totalPages: 1 }
            });
        }
        
        // 2. Regex linh hoạt hơn cho class (chấp nhận thumb item hoặc item thumb, và các class đi kèm)
        const divRegex = /<div[^>]*class=["'][^"']*(?:thumb\s+item|item\s+thumb)[^"']*["'][^>]*>([\s\S]*?)<\/div>/g;
        let match;
        
        while ((match = divRegex.exec(html)) !== null) {
            const content = match[1];
            
            // Nếu trong khối không chứa các từ khóa quan trọng thì bỏ qua
            if (!content.match(/img|href|video|src/i)) {
                continue;
            }
            
            // 3. Lấy href từ thẻ <a> đầu tiên trong khối
            var urlMatch = content.match(/<a[^>]+href=["']([^"']+)["']/i);
            var itemUrl = "";
            if (urlMatch && urlMatch[1]) {
                itemUrl = urlMatch[1];
            } else {
                continue; // Không có link thì bỏ qua item này
            }
            
            if (!itemUrl.startsWith("http")) {
                itemUrl = BASEURL + (itemUrl.startsWith("/") ? "" : "/") + itemUrl;
            }
            
            // 4. Lấy Title từ thuộc tính alt của ảnh
            var title = "";
            var rmatch = content.match(/alt=["']([^"']+)["']/i);
            if (rmatch && rmatch[1]) {
                title = rmatch[1];
            }
            
            // 5. Lấy Poster (Ưu tiên data-src rồi mới đến src)
            var posterMatch = content.match(/data-src=["']([^"']+)["']/i) || content.match(/src=["']([^"']+)["']/i);
            var poster = posterMatch ? posterMatch[1] : BASEIMG;
            
            if (poster && !poster.startsWith("http")) {
                poster = BASEURL + (poster.startsWith("/") ? "" : "/") + poster;
            }
            
            items.push({
                id: itemUrl,
                title: title,
                posterUrl: poster
            });
        }
        
        return JSON.stringify({
            items: items,
            pagination: { currentPage: 1, totalPages: 999 }
        });
        
    } catch (e) {
        return JSON.stringify({
            items: [{ id: currentUrl, title: "Lỗi: 2 - " + e.message, posterUrl: BASEIMG }],
            pagination: { currentPage: 1, totalPages: 1 }
        });
    }
}

// --- Cách chạy thực tế trên Console trình duyệt ---
//var htmlData = document.documentElement.outerHTML; // Lấy toàn bộ HTML chuẩn hơn
//var resultJson = parseListResponse(htmlData, window.location.href);
//JSON.parse(resultJson);
//BASEURL = "https://www.xxxfiles.com";
//var html = document.getElementsByTagName("html")[0].outerHTML;
//JSON.parse(parseListResponse(html));

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html, url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var year = 2026;
    var direc = "????";
    var cast = "????";
    var status = "????";
    var duration = "1:09:00 | 16 | 16";
    var servers = [];
    try {
        var rmatch;
        var idvideo = url.replace(BASEURL + "/", "");
        var limg = "https://cdn5-thumbs.motherlessmedia.com/thumbs/" + idvideo + "-small-7.jpg";
        //rmatch = html.match(/meta\s+property=\["']og:image["']\s+content=["']([^"']+)["']/i);
        // if (rmatch && rmatch[1]) { limg = rmatch[1]; }
        
        rmatch = html.match(/<title>([\s\S]*?)<\/title>/i);
        if (rmatch && rmatch[1]) { lname = rmatch[1].trim(); }
        
        rmatch = html.match(/meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
        
        var episodes = [];
        var serverMatches = html.match(/<video[\s\S]*?src=["']([^"']+)["']/i);
        
        if (serverMatches && serverMatches[1]) {
            lurl = serverMatches[1];
            episodes.push({
                id: serverMatches[1],
                name: "Xem Ngay",
                slug: "tap-1"
            });
        }
        servers = [{
            name: "Server",
            episodes: episodes
        }];
        
    } catch (e) {
        console.error("Lỗi parse dữ liệu: ", e);
    }
    
    return JSON.stringify({
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: lurl ? ldes + "\r\n\r\n" + lurl : ldes,
        servers: servers,
        quality: "HD",
        year: year,
        status: status,
        duration: duration,
        casts: cast,
        director: direc
    });
}
//BASEURL = "https://motherless.xxx";
//var html = document.getElementsByTagName("html")[0].outerHTML;
//JSON.parse(parseMovieDetail(html));



function parseDetailResponse(html, url) {
    try {
        var customJs = `
function initCustomVideoFix() {
    const style = document.createElement('style');
    var customcss = 'body { background: black; overflow: hidden; }#comments,header,footer,.entry-actions,.entry-header,.entry-info,.entry-content,#related-posts,.entry-content + .mt-2 {display:none}body * {background: black;}';
    style.innerHTML = customcss;
    document.head.appendChild(style);
    
    if (typeof jwplayer === "function") {
        const player = jwplayer("previewPlayer");
        if (player && typeof player.getMute === "function") {
            if (player.getMute()) {
                player.setMute(false);
            }
            player.setVolume(100);
        }
    }
    
    const checkAndClick = setInterval(() => {
        const skipButton = document.getElementById("skip-ad");
        if (skipButton) {
            skipButton.click();
            clearInterval(checkAndClick);
        }
    }, 200);
    
    setTimeout(() => { clearInterval(checkAndClick); }, 20000);
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}`;
        
        return JSON.stringify({
            url: "",
            headers: {
                "Referer": url,
                "Origin": url,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Custom-Js": customJs.trim()
            }
        });
    } catch (error) {
        return JSON.stringify({ url: "", headers: {} });
    }
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
categories/teen/@@Thiếu niên
categories/taboo/@@Cấm Kỵ
categories/mature/@@Già Gân
categories/anal/@@Lỗ Nhị
categories/interracial/@@Khác Tộc
categories/big-ass/@@Mông To
categories/casting/@@Diễn Viên
categories/babe/@@Gái Xinh
categories/amateur/@@Nghiệp Dư
categories/old-and-young2/@@Già và Trẻ
categories/hardcore/@@Hạng Nặng
categories/fetish/@@Đặc biệt
categories/double-penetration2/@@2 Cây Hàng
categories/ebony/@@Da Màu
`
}


// Hàm tách menu bằng list - ĐÃ TỐI ƯU: Không dùng Regex lặp để tránh treo app
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
