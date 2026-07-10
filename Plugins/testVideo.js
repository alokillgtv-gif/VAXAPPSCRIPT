BaseURL = "https://script.google.com/macros/s/AKfycbydwasfO9sUsP7nSduOON6yKVZUMpSraNRFb58knwl_AKpb6vixCuPe-uptcpaGIiXBEw/exec";
BaseJSON = "";
BaseJSON2 = "";

function getManifest() {
    return JSON.stringify({
        "id": "testvideo",          
        "name": "Test Embed",
        "description": "Nguồn xem phim Online ổn định",
        "version": "1.2",             
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
        var customjs = BaseJSON.coded || "";
        var $base64 = stringToHex(customjs);
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
        var $title = "";
        var base64 = url.match(/base64=([^&]+)/i);
        if(base64 && base64[1]){
            decode = hexToString(base64[1])
            var error =  safeEval(decode)
            if(typeOf(error) == "string"){
                $title = error;
            }
            //decode = base64[1];
        }
        
        var title = $title;
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
// 1. Hàm ENCODE hỗ trợ Tiếng Việt (Thuần JS)
// 1. Hàm mã hóa: Chuỗi Tiếng Việt -> Chuỗi mã Hex
// 1. Hàm mã hóa: Chuỗi Tiếng Việt -> Chuỗi mã Hex (Không dùng TextEncoder)
function stringToHex(str) {
    try {
        var hexStr = '';
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var bytes = [];
            
            // Tự phân tách ký tự Unicode thành các byte UTF-8 thủ công
            if (code < 0x80) {
                bytes.push(code);
            } else if (code < 0x800) {
                bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
            } else if (code < 0xd800 || code >= 0xe000) {
                bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            } else {
                i++;
                code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            }
            
            // Chuyển mảng byte vừa tách sang chuỗi Hex
            for (var j = 0; j < bytes.length; j++) {
                var hex = bytes[j].toString(16);
                hexStr += (hex.length === 1 ? '0' + hex : hex);
            }
        }
        return hexStr;
    } catch (e) {
        return "Lỗi mã hóa Hex";
    }
}

// 2. Hàm giải mã: Chuỗi mã Hex -> Chuỗi Tiếng Việt (Không dùng TextDecoder)
function hexToString(hexStr) {
    try {
        // Làm sạch chuỗi hex, loại bỏ ký tự lạ
        hexStr = hexStr.replace(/[^0-9A-Fa-f]/g, '');
        if (hexStr.length % 2 !== 0) {
            return "Lỗi: Độ dài mã Hex không hợp lệ";
        }
        
        // Chuyển chuỗi Hex thành mảng các byte số nguyên
        var bytes = [];
        for (var i = 0; i < hexStr.length; i += 2) {
            bytes.push(parseInt(hexStr.substring(i, i + 2), 16));
        }
        
        // Gộp các byte UTF-8 lại thành chữ Tiếng Việt có dấu chuẩn
        var result = '';
        var j = 0;
        while (j < bytes.length) {
            var b1 = bytes[j++];
            if (b1 < 128) {
                result += String.fromCharCode(b1);
            } else if (b1 > 191 && b1 < 224 && j < bytes.length) {
                var b2 = bytes[j++];
                result += String.fromCharCode(((b1 & 31) << 6) | (b2 & 63));
            } else if (b1 > 223 && b1 < 240 && j + 1 < bytes.length) {
                var b2 = bytes[j++];
                var b3 = bytes[j++];
                result += String.fromCharCode(((b1 & 15) << 12) | ((b2 & 63) << 6) | (b3 & 63));
            } else if (b1 > 239 && b1 < 245 && j + 2 < bytes.length) {
                var b2 = bytes[j++];
                var b3 = bytes[j++];
                var b4 = bytes[j++];
                var cp = ((b1 & 7) << 18) | ((b2 & 63) << 12) | ((b3 & 63) << 6) | (b4 & 63);
                if (cp <= 0x10FFFF) result += String.fromCodePoint(cp);
            }
        }
        return result;
    } catch (e) {
        return "Lỗi giải mã Hex: " + e.message;
    }
}

function safeEval(codeString) {
    if (!codeString || typeof codeString !== 'string') return null;
    
    // Bước 1: Kiểm tra xem chuỗi có lỗi cú pháp (Syntax Error) hay không
    // Việc khởi tạo "new Function" chỉ biên dịch code chứ CHƯA thực thi nó.
    // Nếu cú pháp lỗi (thiếu dấu ngoặc, sai từ khóa...), nó sẽ nhảy vào catch ngay lập tức.
    try {
        new Function(codeString);
    } catch (syntaxError) {
        return "Lỗi cú pháp: " + syntaxError.message;
    }
    
    // Bước 2: Khi cú pháp đã chuẩn, tiến hành eval trong môi trường try...catch 
    // để phòng hờ lỗi Runtime (ví dụ: gọi hàm không tồn tại, biến chưa định nghĩa...)
    try {
        // Sử dụng một biến cục bộ để hứng kết quả trả về từ eval nếu có
        var result = eval(codeString);
        return result;
    } catch (runtimeError) {
        return "Lỗi thực thi: " + runtimeError.message;
    }
}