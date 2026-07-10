
BASEURL = "https://www.xxxfiles.com";
BASEIMG = "https://www.xxxfiles.com/img/logo.png?v=3";
// https://www.xxxfiles.com/favicon-32x32.png
function getManifest() {
    return JSON.stringify({
        "id": "xxxfiles",
        "name": "xxxfiles",
        "description": "XXX Hay",
        "version": "1.0",
        "BASEURL": "https://www.xxxfiles.com",
        "iconUrl": "https://www.xxxfiles.com/favicon-32x32.png",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "exoplayer"
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

function getUrlList(slug, filtersJson) {
    var baseUrlClean = (typeof BASEURL !== 'undefined' ? BASEURL : "").replace(/\/$/, "");
    
    var page = 1;
    var path = "";
    
    // 1. Cố gắng parse JSON một cách an toàn
    try {
        if (filtersJson) {
            // Thay thế các key không có dấu nháy bằng key có dấu nháy để sửa lỗi JSON lỏng lẻo
            var fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
            var filters = JSON.parse(fixedJson);
            
            page = parseInt(filters.page) || 1;
            
            // Xử lý nếu category là mảng
            if (filters.category) {
                if (Array.isArray(filters.category) && filters.category.length > 0) {
                    path = filters.category[0].slug;
                } else if (typeof filters.category === 'string') {
                    path = filters.category;
                }
            }
        }
    } catch (e) {
        
    }
    
    // 2. Nếu filters không có category, sử dụng slug truyền vào
    if (!path) {
        path = slug || "";
    }
    
    // 3. KIỂM TRA NẾU PATH ĐÃ LÀ URL TUYỆT ĐỐI
    // Nếu path bắt đầu bằng http:// hoặc https://, ta xử lý riêng không cộng BASEURL nữa
    if (/^https?:\/\//i.test(path)) {
        // Chuẩn hóa xóa dấu / ở cuối
        path = path.replace(/\/+$/, "");
        
        if (page > 1) {
            return path + "/" + page + "/";
        } else {
            return path + "/";
        }
    }
    
    // 4. Xử lý cho URL tương đối (slug thông thường)
    if (!path) return baseUrlClean + "/";
    
    path = path.replace(/^\/+|\/+$/g, "");
    var targetUrl = baseUrlClean + "/" + path;
    
    if (page > 1) {
        targetUrl += "/" + page + "/";
    } else {
        targetUrl += "/";
    }
    
    return targetUrl;
}
/*
var BASEURL = "https://www.xxxfiles.com";
// JSON lỗi cú pháp (thiếu nháy kép) của bạn
var filtersJson = '{page:1,category:[{"slug":"categories/teen/","name":"Thiếu niên"}]}'; 
// Trường hợp 1: Truyền URL tuyệt đối vào slug
console.log(getUrlList("https://www.xxxfiles.com/search/black/", filtersJson));
// Kết quả: "https://www.xxxfiles.com/categories/teen/" 
// (Vì trong filtersJson có category nên nó ưu tiên dùng category trước)
// Trường hợp 2: Nếu filtersJson không có category, nó sẽ dùng slug trực tiếp
var filtersJsonNoCat = '{page:2}';
console.log(getUrlList("https://www.xxxfiles.com/search/black/", filtersJsonNoCat));
// Kết quả: "https://www.xxxfiles.com/search/black/2/" (Nhận diện đúng URL và thêm trang)
*/

function getUrlSearch(keyword, filtersJson) {
    return "https://www.xxxfiles.com/search/" + encodeURIComponent(keyword) + "/";
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
        //rmatch = html.match(/meta\s+property=\["']og:image["']\s+content=["']([^"']+)["']/i);
        // if (rmatch && rmatch[1]) { limg = rmatch[1]; }
        
        rmatch = html.match(/property=["']og:title["']\s+content=["']([\s\S]*?)["']/i);
        if (rmatch && rmatch[1]) { lname = rmatch[1].trim(); }
        
        rmatch = html.match(/property=["']og:image["']\s+content=["']([\s\S]*?)["']/i);
        if (rmatch && rmatch[1]) { limg = rmatch[1].trim(); }
        rmatch = html.match(/class=["']links__list["'][^>]*>([\s\S]*?)<\/div>/i);
        if (rmatch && rmatch[1]) {
                var result = rmatch[1].replace(/<[^>]*>/g, '');
                // 2. (Tùy chọn) Khử các thực thể HTML phổ biến như &nbsp;, &amp;, &lt;, &gt;
                result = result.replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/\r|\n/gi, '')
                    .replace(/\s+/gi, ', ')
                    .replace(/^,|,$/g, "");
                    ldes = result.trim();
        }
        
        
        var episodes = [];
        var serverMatches = html.match(/video\s+id=["']video[[\s\S]*?src=["']([\s\S]*?)["']/i);
        
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
        // 1. Lấy đoạn script Custom-JS của bạn
        var customjs = textJS(html, url);
        
        // SỬA BẪY CSS: Ép đoạn mã CSS trong textJS không được ẩn thẻ video và các thẻ điều khiển của player
        customjs = customjs.replace(
            "body * {background: black;display:none!important}",
            "body *:not(video):not(source):not(script):not(style) {background: black;display:none!important}"
        );
        
        // 2. Kiểm tra xem link truyền vào là MP4 hay luồng phát HLS (.m3u8)
        var isHls = url.indexOf(".m3u8") > -1 || url.indexOf("manifest") > -1;
        
        // 3. Tự chế trang HTML hoàn chỉnh
        // Nếu là HLS, tự động lách luật bằng cách nhúng thêm thư viện cdn hls.js để tự phát trên Android
        var htmlFake = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VAX Player Premium</title>
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }
        video { width: 100%; height: 100%; object-fit: contain; }
    </style>
    ${isHls ? '<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>' : ''}
</head>
<body>

    <video id="vax-video-player" controls autoplay playsinline></video>

    <script>
        var video = document.getElementById('vax-video-player');
        var videoSrc = '${url}';

        if (${isHls} && Hls.isSupported()) {
            var hls = new Hls({
                maxMaxBufferLength: 30 // Giới hạn buffer tránh tràn RAM trên máy yếu
            });
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
        } else {
            // Nếu là MP4 hoặc môi trường hỗ trợ HLS gốc (như iOS)
            video.src = videoSrc;
        }
    </script>
</body>
</html>
        `;
        
        // 4. Mã hóa trang HTML tự chế này sang chuỗi Base64
        // Dùng mã hóa an toàn để không bị lỗi font chữ hoặc ký tự đặc biệt
        var base64Url = "data:text/html;base64," + btoa(unescape(encodeURIComponent(htmlFake)));
        
        // 5. Trả kết quả về cho App
        return JSON.stringify({
            "url": base64Url,
            "isEmbed": true, // Bắt buộc để true để App kích hoạt mở WebView ẩn chạy trang này
            "headers": {
                "Referer": BASEURL,
                "Origin": BASEURL,
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                "Sec-Ch-Ua-Mobile": "?1",
                "Sec-Ch-Ua-Platform": '"Android"',
                "Accept": "*/*",
                "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
                "X-Requested-With": "com.android.chrome",
                "Custom-Js": customjs.trim() // Mã JS đã sửa lỗi né player vẫn sẽ được tiêm vào trang này
            },
            "subtitles": []
        });
        
    } catch (e) {
        return JSON.stringify({ "url": "", "headers": {} });
    }
}

function parseEmbedResponse(html, sourceUrl) {
    
    var link = sourceUrl;
    var customjs = textJS(html, sourceUrl);
    
    return JSON.stringify({
        url: link,
        isEmbed: false, // Kết thúc, đây là link stream cuối
        mimeType: "application/x-mpegURL", // Báo App đây là HLS
        headers: {
            "Referer": BASEURL,
            "Custom-Js": customjs.trim()
            
        },
    });
    
    return JSON.stringify({ url: "", isEmbed: false });
}

function textJS(html, $url) {
    // Sử dụng biến $url từ tham số truyền vào thay vì ghi cứng link
    return `
SCRIPTURL = "https://script.google.com/macros/s/AKfycbwsvLFzWMdxvX9ZH-3wnP3GJzS58v0CtT_0mlEYeOz6cOsgen9IR3c6VPv_EssPXMFzwQ/exec?name=xxxfiles&type=js"; 
const style = document.createElement('style');
var customcss = 'body { background: black; overflow: hidden; }body * {background: black;display:none!important}';
style.innerHTML = customcss;
document.head.appendChild(style);
showToast("Đang tải video cho bạn.", 7000)
function showToast(message, duration = 7000) {
    let container = document.getElementById('global-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        
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
    
    const toast = document.createElement('div');
    toast.innerHTML = message;
    
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
        transform: 'translateX(120%)',
        opacity: '0'
    });
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        
        setTimeout(() => {
            toast.remove();
            if (container.childElementCount === 0) {
                container.remove();
            }
        }, 300);
    }, duration);
}

function injectScriptAfterLoad(scriptUrl) {
    function doFetchAndInject() {
        console.log('⏳ Đang tiến hành fetch code từ:', scriptUrl);
        
        fetch(SCRIPTURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Mã phản hồi từ Server không tốt: ' + response.status);
                }
                return response.text(); // Lấy toàn bộ mã nguồn dưới dạng chuỗi chữ
            })
            .then(codeText => {
                // 1. Tạo một thẻ script trống mới hoàn toàn bằng JS
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                
                // 2. Đổ thẳng nội dung code dạng chữ vào trong thẻ script vừa tạo
                scriptElement.textContent = codeText;
                
                // 3. Nhúng (Inject) thẻ script này vào vị trí cuối cùng của thẻ body
                document.body.appendChild(scriptElement);
               // showToast('🎯 Đã fetch và nhúng thành công script vào sau body,!',5000);
            })
            .catch(error => {
                console.error('❌ Lỗi không thể fetch hoặc nhúng script:', error);
            });
    }
    
    // Kiểm tra trạng thái tải của trang web
    if (document.readyState !== 'loading') {
        // Nếu trang web đã tải xong cấu trúc DOM cơ bản, thực hiện ngay lập tức
        doFetchAndInject();
    } else {
        // Nếu trang web vẫn đang load thô, đợi sự kiện DOMContentLoaded kích hoạt rồi chạy
        document.addEventListener('DOMContentLoaded', doFetchAndInject);
    }
}

function initCustomVideoFix() {
    // SỬA: Lấy động giá trị từ tham số $url truyền vào hàm textJS bên ngoài
    
    if (SCRIPTURL && SCRIPTURL !== "undefined") {
        injectScriptAfterLoad(SCRIPTURL);
    }
    
    // Lưu ý: Đảm bảo hàm runScript() này đã được định nghĩa ở đâu đó trong hệ thống của bạn
    if (typeof runScript === "function") {
        runScript("sssssssss");
    }
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
