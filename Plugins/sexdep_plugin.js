
BASEURL = "https://sexdep.vip";
BASEIMG = "https://sexdeplon.com/resize/50/2025/02/04/16c0e67dcf0acbc0be5e7ef611c410b76820a26b490a9d790f758fbe851607bc.png";

// https://sexdep.vip/?page=2
// https://www.xxxfiles.com/favicon-32x32.png
function getManifest() {
    return JSON.stringify({
        "id": "sexdep",
        "name": "sexdep",
        "description": "XXX Hay",
        "version": "1.1",
        "BASEURL": "https://sexdep.vip",
        "iconUrl": BASEIMG,
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}



// https://sexdeplon.com/?view=hay-nhat&page=2
function getHomeSections() {
    var listurl = "the-loai/viet-nam@@Hàng Mới@@true";
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
            
            // Chỉ lấy category từ JSON nếu không truyền slug vào hàm
            if (!slug && filters.category) {
                if (Array.isArray(filters.category) && filters.category.length > 0) {
                    path = filters.category[0].slug;
                } else if (typeof filters.category === 'string') {
                    path = filters.category;
                }
            }
        }
    } catch (e) {
        // Ghi log lỗi nếu cần thiết để debug: console.error(e);
    }
    
    // 2. Nếu có slug truyền vào, ưu tiên sử dụng slug đó
    if (slug) {
        path = slug;
    }
    
    // 3. KIỂM TRA NẾU PATH ĐÃ LÀ URL TUYỆT ĐỐI
    if (/^https?:\/\//i.test(path)) {
        path = path.replace(/\/+$/, "");
        
        if (page > 1) {
            if (path.indexOf("?") > -1) {
                return path + "&page=" + page;
            } else {
                return path + "/?page=" + page;
            }
        } else {
            return path + "/";
        }
    }
    
    // 4. Xử lý cho URL tương đối (slug thông thường)
    if (!path) return baseUrlClean + "/";
    
    path = path.replace(/^\/+|\/+$/g, "");
    var targetUrl = baseUrlClean + "/" + path;
    
    if (page > 1) {
        if (targetUrl.indexOf("?") > -1) {
            targetUrl += "&page=" + page;
        } else {
            targetUrl += "?page=" + page;
        }
    } else {
        // Tránh nhân đôi dấu / nếu path thực chất là query string (ví dụ: ?view=hay-nhat)
        if (path.indexOf("?") !== 0) {
            targetUrl += "/";
        }
    }
    
    return targetUrl;
}
/*
// === KHU VỰC TEST CHẠY THỬ ===
var BASEURL = "https://sexdep.vip";
var filtersJson = '{page:5,category:[{"slug":"?view=hay-nhat","name":"Hay Nhất"},{"slug":"the-loai/vietsub","name":"Vietsub"},{"slug":"the-loai/khong-che","name":"Không Che"},{"slug":"the-loai/viet-nam","name":"Việt Nam"},{"slug":"the-loai/trung-quoc","name":"Trung Quốc"},{"slug":"the-loai/au-my","name":"Âu - Mỹ"},{"slug":"the-loai/gai-xinh","name":"Gái Xinh"},{"slug":"the-loai/hiep-dam","name":"Hiếp Dâm"},{"slug":"the-loai/jav-hd","name":"JAV HD"},{"slug":"the-loai/hoc-sinh","name":"Học Sinh"},{"slug":"the-loai/vu-to","name":"Vú To"}]}';

//Trường hợp 1: Truyền slug cụ thể -> Sẽ lấy slug này + số page trong JSON
//console.log(getUrlList("the-loai/au-my", filtersJson)); 
// Kết quả: https://sexdep.vip/the-loai/au-my?page=7
// Trường hợp 2: Không truyền slug -> Sẽ tự động lấy phần tử đầu tiên trong JSON (?view=hay-nhat)
console.log(getUrlList("https://sexdep.vip/search/vang-anh", filtersJson));
*/
// https://sexdep.vip/search/gai-nga?page=2

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
        const divRegex = /<div[^>]*class=["'][^"']*item-box[^"']*["'][^>]*>([\s\S]*?)<\/div>/g;
        let match;
        
        while ((match = divRegex.exec(html)) !== null) {
            const content = match[1];
            
            // Nếu trong khối không chứa các từ khóa quan trọng thì bỏ qua
            if (!content.match(/img|href|video|src/i)) {
                continue;
            }
            
            // 3. Lấy href từ thẻ <a> đầu tiên trong khối
            var urlMatch = content.match(/<a[^>]+href=["'](http[^"']+)["']/i);
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
            var rmatch = content.match(/alt=["']([^>]+)["']/i);
            if (rmatch && rmatch[1]) {
                title = rmatch[1];
            }
            
            // 5. Lấy Poster (Ưu tiên data-src rồi mới đến src)
            // <a[^>]+href=["'](http[^"']+)["']
            var posterMatch = content.match(/src=['"](http[^"']+)["']/i);
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

/*
BASEURL = "https://sexdeplon.com";
BASEIMG = "https://sexdeplon.com";
var html = document.getElementsByTagName("html")[0].outerHTML;
JSON.parse(parseListResponse(html));
*/


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
    var duration = "";
    var servers = [];
    var categories = "";
    
    try {
        var rmatch;
        // Lấy title name /property=["']og:title["']\s+content=["']([^"']+)["']/i
        rmatch = html.match(/property=["']og:title["']\s+content=["']([^"']+)["']/i);
        if (rmatch && rmatch[1]) { lname = rmatch[1].trim(); }
        
        // Lấy ảnh /property=["']og:image["']\s+content=["']([^"']+)["']/i
        rmatch = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);
        if (rmatch && rmatch[1]) { limg = rmatch[1].trim(); }
        
        // Lấy description /property=["']og:description["']\s+content=["']([^"']+)["']/i
        rmatch = html.match(/property=["']og:description["']\s+content=["']([^"']+)["']/i);
        if (rmatch && rmatch[1]) {var ldes = rmatch[1];}
        
        // Lấy thể loại /(<div[^>]+class=["']categories[\s\S]*?<\/div>)/i
        rmatch = html.match(/(<div[^>]+class=["']categories[\s\S]*?<\/div>)/i);
        if (rmatch && rmatch[1]) {categories = trimHTML(rmatch[1])}          
        // Bốc tách server
        var regex = /data-source=["']([^"']+)/g;
        var matches = [...html.matchAll(regex)];
        var episodes = [];

        matches.forEach((match, index) => {
          var link = match[1];
          var stt = index + 1; // Số thứ tự bắt đầu từ 1, 2, 3...
          episodes.push({
             id: link,
             name: "Server " + stt,
             slug: "tap-" + stt
          });
          //console.log("Đang duyệt link số: " + stt + " -> " + link);
        });
        
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
        director: direc,
        category: categories
    });
}


//BASEURL = "https://motherless.xxx";
//var html = document.getElementsByTagName("html")[0].outerHTML;
//JSON.parse(parseMovieDetail(html));



function parseDetailResponse(html, url) {
    try {
        var customJs = CustomjQ(html, url);
        return JSON.stringify({
            url: "",
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

function parseCategoriesResponse(apiResponseJson) {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

function getLISTmenu() {
    return `
the-loai/vietsub@@Vietsub
the-loai/khong-che@@Không Che
the-loai/viet-nam@@Việt Nam
the-loai/trung-quoc@@Trung Quốc
the-loai/au-my@@Âu - Mỹ
the-loai/gai-xinh@@Gái Xinh
the-loai/hiep-dam@@Hiếp Dâm
the-loai/jav-hd@@JAV HD
the-loai/hoc-sinh@@Học Sinh
the-loai/vu-to@@Vú To
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
function trimHTML(inhtml) {
    var result = inhtml.replace(/<[^>]*>/g, '');
    result = result.replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\n|\r/gi, ' - ')
        .replace(/\s+/gi, ' ')
        .replace(/^,+|,+$/g, "");
    return result;
}

function CustomjQ(html, url){
    var $custom1 = `
    function runBegin(){
        customAlert("2412421", "Alo alo");
    }
    `;
    var $custom2 =  `
    function customAlert(title, message) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: '99999', opacity: '0', transition: 'opacity 0.2s ease'
        });
        
        const box = document.createElement('div');
        Object.assign(box.style, {
            backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)', maxWidth: '380px', width: '85%',
            boxSizing: 'border-box', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            transform: 'scale(0.8)', transition: 'transform 0.2s ease'
        });
        
        const titleEl = document.createElement('input');
        titleEl.type = 'text'; 
        titleEl.value = title;
        Object.assign(titleEl.style, {
            display: 'block', width: '100%', boxSizing: 'border-box',
            margin: '0 0 12px 0', padding: '6px 10px', color: '#222222',
            fontSize: '15px', fontWeight: '600', border: '1px solid #ddd', borderRadius: '6px'
        });
        
        const msgEl = document.createElement('textarea');
        msgEl.value = message;
        Object.assign(msgEl.style, {
            display: 'block', width: '100%', boxSizing: 'border-box',
            margin: '0 0 20px 0', padding: '8px 10px', color: '#555555',
            fontSize: '14px', height: '200px', lineHeight: '1.5',
            border: '1px solid #ddd', borderRadius: '6px', resize: 'none'
        });
        
        const btn = document.createElement('button');
        btn.innerText = 'OK';
        Object.assign(btn.style, {
            display: 'block', margin: '0 auto', padding: '10px 28px',
            fontSize: '15px', fontWeight: '600', color: '#ffffff',
            backgroundColor: '#007bff', border: 'none', borderRadius: '6px',
            cursor: 'pointer', outline: 'none', transition: 'background-color 0.1s'
        });
        
        btn.onmouseover = () => btn.style.backgroundColor = '#0056b3';
        btn.onmouseout = () => btn.style.backgroundColor = '#007bff';
        
        const closeAlert = () => {
            overlay.style.opacity = '0';
            box.style.transform = 'scale(0.8)';
            setTimeout(() => { overlay.remove(); }, 200);
        };
        
        btn.onclick = closeAlert;
        overlay.onclick = (e) => { if (e.target === overlay) closeAlert(); };
        
        box.appendChild(titleEl);
        box.appendChild(msgEl);
        box.appendChild(btn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        
        setTimeout(() => { overlay.style.opacity = '1'; box.style.transform = 'scale(1)'; }, 10);
    }

    function initCustomVideoFix() {
        const style = document.createElement('style');
        var customcss = 'body {overflow: hidden; }#comments,header,footer,.entry-actions,.entry-header,.entry-info,.entry-content,#related-posts,.entry-content + .mt-2 {display:none}body * {background: black;}';
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
        runBegin();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomVideoFix);
    } else {
        initCustomVideoFix();
    }
`

return $custom1 + $custom2;
}


