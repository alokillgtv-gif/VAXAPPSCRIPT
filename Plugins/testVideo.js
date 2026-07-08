// =============================================================================
// VAAPP Plugin - Crophim Pro (Đồng bộ cấu trúc 100% theo chuẩn RophimFake)
// Tên file bắt buộc khi lưu: crophim_plugin.js #labHtmlSourceModal
// =============================================================================
BaseURL = "https://script.google.com/macros/s/AKfycbydwasfO9sUsP7nSduOON6yKVZUMpSraNRFb58knwl_AKpb6vixCuPe-uptcpaGIiXBEw/exec";
BaseJSON = "";
BaseJSON2 = "";

function getManifest() {
    return JSON.stringify({
        "id": "testvideo",          
        "name": "Test Embed",
        "description": "Nguồn xem phim Online ổn định",
        "version": "1.21",             
        "baseUrl": BaseURL,
        "iconUrl": "https://crimescenesolutions.co.za/wp-content/uploads/2026/04/phimhayok-io-fav.jpg", 
        "isEnabled": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}


function getHomeSections() {
    return JSON.stringify([
        { "slug": "", "title": "Phim Lẻ", "type": "Horizontal" }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { "name": "Hành Động", "slug": "" }
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
// URL GENERATION (Bóc tách slug sạch theo khuôn mẫu mới)
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    
    if (slug === "hanh-dong" || slug === "kinh-di" || slug === "phim-18" || slug === "hai-huoc" || slug === "chien-tranh" || slug === "hoat-hinh" || slug === "vien-tuong") {
        return BaseURL;
    }
    return BaseURL;
}

function getUrlSearch(keyword, filtersJson) {
    return BaseURL;
}

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf('http') === 0) return slug;
    return BaseURL;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    try {
        var script = html.match(/<script[^>]+id=['"]initials-script["']>([\s\S]*?)<\/script>/i);
        if (script && script[1]) {
            var scriptText = script[1].trim();
            
            // 1. Dùng RegExp bóc tách lấy từ dấu { đầu tiên cho đến dấu } cuối cùng
            var jsonMatch = scriptText.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                var jsonText = jsonMatch[0]; // Chuỗi JSON sạch
            }
        }
        // Lưu trữ object đầu tiên trực tiếp vào BaseJSON toàn cục để các hàm sau dùng tiện lợi
        var parsed = JSON.parse(html);
        BaseJSON = Array.isArray(parsed) ? parsed[0] : parsed;
        var $url = BaseJSON.url || "";
        var items = [];
        items.push({
            "id": $url,
            "title": $url,
            "posterUrl": "https://img-cdn.phimhayok.net/filmhayok/1782912263995/20260701/ChatGPT-Image-19_29_49-1-thg-7-2026_a20d108246f140ad8be82acb9bca2606.png",
            "backdropUrl": "https://img-cdn.phimhayok.net/filmhayok/1782912263995/20260701/ChatGPT-Image-19_29_49-1-thg-7-2026_a20d108246f140ad8be82acb9bca2606.png"
        });
        
        return JSON.stringify({
            "items": items,
            "pagination": { "currentPage": 1, "totalPages": 1 }
        });
    } catch (e) {
        return JSON.stringify({ "items": [], "pagination": { "currentPage": 1, "totalPages": 1 } });
    }
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    try {
        var id = BaseURL;
        // Khai báo trước streamUrl chống lỗi Strict Mode khi eval thực thi
        var streamUrl = ""; 
        var rmatch = html.match(/id="streaming-sv"[^>]*?data-link="(https?:[^"]*)"/i);
        if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
        var title = "Chưa rõ tên phim";
        var year = "2026";
        var des = streamUrl + "\r\n\r\n" + html;
        var img = "https://img-cdn.phimhayok.net/filmhayok/1782912263995/20260701/ChatGPT-Image-19_29_49-1-thg-7-2026_a20d108246f140ad8be82acb9bca2606.png";
        var episodes = [{ id: id, name: "Xem Ngay", slug: "full" }];
        
        return JSON.stringify({
            "id": id,
            "title": title,
            "posterUrl": img,
            "backdropUrl": img,
            "description": des,
            "year": year,
            "rating": 10,
            "quality": "HD",
            "servers": [{ "name": "Server Vietsub", "episodes": episodes }]
        });

    } catch (e) {
        return JSON.stringify({ "id": "error", "title": "Lỗi tải dữ liệu", "servers": [] });
    }
}

function parseDetailResponse(html,url) {
    try {
        // Đọc trực tiếp từ thuộc tính của BaseJSON đã lưu ở bước đầu tiên
        var parsed = JSON.parse(html);
        BaseJSON = Array.isArray(parsed) ? parsed[0] : parsed;
        var videoUrl = BaseJSON.link || "";
        var refUrl = BaseJSON.ref || "";
        var agent = BaseJSON.codeb || "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
        var customjs = BaseJSON.codec || "";
        customjs += `
        function runScript($title,$msg){
            customAlert($msg + $title, $msg);
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
            "url": videoUrl, 
            "headers": {
                "Referer": refUrl,
                "Origin": refUrl,
                "User-Agent": agent,
              // Đánh lừa thuật toán Client Hints của tường lửa
                "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                "Sec-Ch-Ua-Mobile": "?1",
                "Sec-Ch-Ua-Platform": '"Android"',
    
    // Khai báo kiểu dữ liệu được chấp nhận giống như trình duyệt thật
                "Accept": "*/*",
                "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
                "X-Requested-With": "com.android.chrome",
                "Custom-Js": customjs.trim()
            },
            "subtitles": []
        });

    } catch (e) {
        return JSON.stringify({ "url": "", "headers": {} });
    }
}

function getAllLinks(html) {
  // Lấy toàn bộ HTML của trang hiện tạ
 const linkRegex = /(https?:\/\/[^\s"'<>]+|(?<![\w/])[a-zA-Z0-9.-]+\.(?:com|net|org|edu|gov|mil|biz|info|vn|me|io)[^\s"'<>]*)/gi;
  const matches = html.match(linkRegex);

  if (!matches) {
    return "";
  }

  return matches.join('\n');
}


function base64Encode(str) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var encoded = '';
    for (var i = 0; i < str.length; i += 3) {
        var c1 = str.charCodeAt(i);
        var c2 = i + 1 < str.length ? str.charCodeAt(i + 1) : NaN;
        var c3 = i + 2 < str.length ? str.charCodeAt(i + 2) : NaN;
        
        var byte1 = c1 >> 2;
        var byte2 = ((c1 & 3) << 4) | (isNaN(c2) ? 0 : c2 >> 4);
        var byte3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (isNaN(c3) ? 0 : c3 >> 6);
        var byte4 = isNaN(c3) ? 64 : c3 & 63;
        
        encoded += chars.charAt(byte1) + chars.charAt(byte2) + chars.charAt(byte3) + chars.charAt(byte4);
    }
    return encoded;
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
