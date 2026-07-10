// =============================================================================
// VAAPP Plugin - Crophim Pro (Đồng bộ cấu trúc 100% theo chuẩn RophimFake)
// Tên file bắt buộc khi lưu: crophim_plugin.js
// =============================================================================
BaseURL = "https://script.google.com/macros/s/AKfycbydwasfO9sUsP7nSduOON6yKVZUMpSraNRFb58knwl_AKpb6vixCuPe-uptcpaGIiXBEw/exec";
BaseJSON = "";
BaseJSON2 = "";

function getManifest() {
    return JSON.stringify({
        "id": "testvideo",          
        "name": "Test Embed",
        "description": "Nguồn xem phim Online ổn định",
        "version": "2.1",             
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
        
        // Lưu trữ object đầu tiên trực tiếp vào BaseJSON toàn cục để các hàm sau dùng tiện lợi
        var parsed = JSON.parse(html);
        BaseJSON = Array.isArray(parsed) ? parsed[0] : parsed;
        var $url = BaseJSON.url || "";
        var customjs = BaseJSON.codec || "";
        var $base64 = base64encode(customjs);
        var baselink = paramUrl($url, "base64", $base64);
        var items = [];
        items.push({
            "id": baselink,
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

function parseMovieDetail(html,url) {
    try {
        var id = BaseURL;
        // Khai báo trước streamUrl chống lỗi Strict Mode khi eval thực thi
        var decode = "";
        var base64 = url.match(/base64=([^&]+)/i);
        if(base64 && base64[1]){
            decode = base64decode(base64[1])
        }
        
        var title = "Chưa rõ tên phim";
        var year = "2026";
        var des = decode + "\r\n\r\n\r\n\r\n" + html;
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
        function runScript($msg){
            showToast($msg, duration = 3000)
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


function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

function paramUrl(url, paramName, paramValue) {
    // Regex này kiểm tra xem trong URL đã có chứa dấu hỏi chấm '?' của Param nào chưa
    const coParamChua = /\?/.test(url);
    
    if (coParamChua) {
        // Nếu ĐÃ CÓ param phía trước (ví dụ: ?hl=vi), ta nối thêm bằng dấu '&'
        return `${url}&${paramName}=${paramValue}`;
    } else {
        // Nếu CHƯA CÓ param nào, ta chèn dấu '?' vào đầu
        return `${url}?${paramName}=${paramValue}`;
    }
}
// Mã hóa chuỗi Tiếng Việt (UTF-8) sang Base64
function base64encode(encodedStr) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var bytes = [];
    
    // Loại bỏ các ký tự khoảng trắng nếu có
    encodedStr = encodedStr.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
    for (var i = 0; i < encodedStr.length; i += 4) {
        // Lấy giá trị index của 4 ký tự Base64
        var b1 = chars.indexOf(encodedStr.charAt(i));
        var b2 = chars.indexOf(encodedStr.charAt(i + 1));
        var b3 = chars.indexOf(encodedStr.charAt(i + 2));
        var b4 = chars.indexOf(encodedStr.charAt(i + 3));
        
        // Khôi phục lại 3 byte ban đầu từ 4 giá trị Base64
        var c1 = (b1 << 2) | (b2 >> 4);
        var c2 = ((b2 & 15) << 4) | (b3 >> 2);
        var c3 = ((b3 & 3) << 6) | b4;
        
        bytes.push(c1);
        if (b3 !== 64 && encodedStr.charAt(i + 2) !== '=') bytes.push(c2);
        if (b4 !== 64 && encodedStr.charAt(i + 3) !== '=') bytes.push(c3);
    }
    
    // Bước quan trọng: Giải mã mảng bytes theo chuẩn UTF-8 để hỗ trợ Tiếng Việt
    return decodeUTF8(bytes);
}

// Hàm bổ trợ giải mã UTF-8 từ mảng byte
function base64decode(bytes) {
    var str = '';
    var i = 0;
    while (i < bytes.length) {
        var byte1 = bytes[i++];
        if (byte1 < 128) {
            str += String.fromCharCode(byte1);
        } else if (byte1 > 191 && byte1 < 224) {
            var byte2 = bytes[i++];
            str += String.fromCharCode(((byte1 & 31) << 6) | (byte2 & 63));
        } else if (byte1 > 223 && byte1 < 240) {
            var byte2 = bytes[i++];
            var byte3 = bytes[i++];
            str += String.fromCharCode(((byte1 & 15) << 12) | ((byte2 & 63) << 6) | (byte3 & 63));
        } else {
            var byte2 = bytes[i++];
            var byte3 = bytes[i++];
            var byte4 = bytes[i++];
            var codepoint = ((byte1 & 7) << 18) | ((byte2 & 63) << 12) | ((byte3 & 63) << 6) | (byte4 & 63);
            str += String.fromCodePoint(codepoint);
        }
    }
    return str;
}