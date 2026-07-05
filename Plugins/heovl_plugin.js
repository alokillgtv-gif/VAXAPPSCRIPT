// =============================================================================
// VAAPP Plugin-Crophim Pro (Đồng bộ cấu trúc 100% theo chuẩn RophimFake)
// Tên file bắt buộc khi lưu:s crophim_plugin.js
// =============================================================================
BASEURL = "https://heovl.im";
function getManifest() {
    return JSON.stringify({
        "id": "heovl",
        "name": "Heovl",
        "description": "XXX Hay",
        "version": "1.12",
        "BASEURL": BASEURL,
        "iconUrl": "https://static.cdnsolutions.media/xh-desktop/images/favicon/favicon-v2-256x256.ico",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}



// Hàm tách menu bằng list
function buildMenu(listurl){
// 2. Khởi tạo mảng chứa kết quả
let menulist = [];
let regex = /^([^@\r\n]+)@@([^@\r\n]+)(?:@@([^@\r\n]+))?/gm;
let match;

// 4. Vòng lặp duyệt qua từng hàng bằng RegExp
while ((match = regex.exec(listurl)) !== null) {
    let link = match[1].trim();
    let name = match[2].trim();
    let check = match[3] ? match[3].trim() : undefined; // Lấy giá trị check nếu có

    let item = {};

    // 5. Kiểm tra điều kiện biến check để tạo cấu trúc Object
    if (check === "false") {
        item = { 
            "slug": link, 
            "title": name, 
            "type": "Horizontal" 
        };
    } else if (check === "true") {
        item = { 
            "slug": link, 
            "title": name, 
            "type": "Grid" 
        };
    } else {
        // Trường hợp không có biến check (undefined)
        item = { 
            "slug": link, 
            "name": name 
        };
    }

    // 6. Push item vào mảng menulist
    menulist.push(item);
}


// 7. In kết quả ra để kiểm tra
    return menulist
}

//https://pornone.com/newest/
//https://pornone.com/newest/3/
//https://pornone.com/search?q=black
/*
{ "slug": "", "title": "", "type": "Horizontal" },
{ "slug": "", "title": "", "type": "Grid" }
*/

function getHomeSections() {
    var listurl = `
    categories/viet-nam@@Việt Nam@@true
    `
    var  menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

// https://pornone.com/anal/
/*
    { "slug": "", "name": ""},
    { "slug": "", "name": ""}
    
    
*/
function getPrimaryCategories() {
    var listurl = `
    categories/choi-lo-dit-anal-sex@@Lỗ Nhị
    categories/nga-russia@@Nga
    categories/vu-to@@Vú To
    categories/tap-the@@Tập Thể
    categories/hiep-dam@@Hiếp Dâm
    categories/loan-luan@@Loạn Luân
    categories/phim-cap-3@@Phim Cap 3
    `
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

function getFilterConfig() {
    return JSON.stringify({
        sort: [
            { name: 'Mới cập nhật', value: 'latest' },
            { name: 'Đánh giá cao', value: 'rating' },
            { name: 'Xem nhiều', value: 'views' }
        ],
        category: [
            { name: "Huyền Huyễn", value: "huyen-huyen" },
            { name: "Xuyên Không", value: "xuyen-khong" },
            { name: "Trùng Sinh", value: "trung-sinh" },
            { name: "Tiên Hiệp", value: "tien-hiep" },
            { name: "Cổ Trang", value: "co-trang" },
            { name: "Hài Hước", value: "hai-huoc" },
            { name: "Kiếm Hiệp", value: "kiem-hiep" },
            { name: "Hiện Đại", value: "hien-dai" }
        ]
    });
}

// =============================================================================
// URL GENERATION (Bóc tách slug sạch theo khuôn mẫu mới)
// =============================================================================

// https://heovl.im/search/vang-anh?page=3
// https://heovl.im/categories/viet-nam?page=3

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        // Prioritize category filter if present
        if (filtersJson.category) {
            return BASEURL + "/" + filters.category + "/?page=" + page;
        }
        
        if (page > 1) {
            if (slug.indexOf("search") > -1) {
                return BASEURL + "/" + slug + "/?page=" + page;
            } else {
                return BASEURL + "/" + slug + "/?page=" + page;
            }
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

function getUrlCategories() { return BASEURL; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    try {
        var items = [];
        // Tách từng item phim để tránh regex chạy sai giữa các item
        var chunks = html.split('class="videos__box-wrapper"');
        
        // Bắt đầu từ 1 vì phần tử 0 là phần html trước class đầu tiên
        for (var i = 1; i < chunks.length; i++) {
            var blockHtml = chunks[i];
            
            // Kiểm tra xem block này có chứa các thẻ cốt lõi của video không
            if (!blockHtml.match(/img|href|video|src/i)) {
                continue;
            }
            
            // 1. Lấy link phim (Sửa lỗi logic || thành &&)
            var urlMatch = blockHtml.match(/a[\s\S]*?href="([^"]+)"/i);
            var url = "";
            if (urlMatch && urlMatch[1]) {
                url = urlMatch[1];
            } else {
                // Nếu không có url hợp lệ, bỏ qua chunk này luôn, không lấy rác
                continue;
            }
            
            if (!url.startsWith("http")) {
                url = BASEURL + url;
            }
            
            // 2. Lấy Title
            var title = "";
            var rmatch = blockHtml.match(/title="([^"]+)"/i);
            if (rmatch && rmatch[1]) {
                title = rmatch[1];
            }
            
            // 3. Lấy Poster (Toán tử 3 ngôi chuẩn)
            var posterMatch = blockHtml.match(/data-src="([^"]+)"/i) || blockHtml.match(/src="([^"]+)"/i);
            var poster = posterMatch ? posterMatch[1] : "";
            if (poster && !poster.startsWith("http")) {
                poster = BASEURL + poster;
            }
            
            items.push({
                id: url,
                title: title,
                posterUrl: poster
            });
        }
        
        return JSON.stringify({
            items: items,
            pagination: { currentPage: 1, totalPages: 999 }
        });
    } catch (e) {
        //console.error("Lỗi Parse:", e);
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
    }
}


function parseSearchResponse(html) {
    return parseListResponse(html);
}



//JSON.parse(parseMovieDetail(html,"https://heovl.im/videos/chich-nhan-tinh-cuc-pham-tren-ghe-sieu-nung"))
function parseMovieDetail(html,ourl) {
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
        // 1. Parse Meta Tags
        var rmatch;
        rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) { limg = rmatch[1]; }
        
        rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) { lname = rmatch[1]; }
        
        rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
        
        var episodes = [];
        
        // 2. Kiểm tra xem có nút bấm server hay không bằng Regex MatchAll
        // Tìm tất cả các đoạn có data-source="..." trong class button tương ứng
        var serverRegex = /data-source="([^"]+)"/gi;
        //var html = document.getElementsByTagName("html")[0].outerHTML;
        var serverMatches = html.match(serverRegex)
        
        if (serverMatches.length > 0) {
            // Nếu tìm thấy các nút server
            for (var j = 0; j < serverMatches.length; j++) {
                var sourcebutton = serverMatches[j]; // Lấy giá trị trong nhóm ngoặc đơn ([^"]+)
                var sourceUrl = sourcebutton.match(/data-source=["']([\s\S]*?)["']/i);
                if(sourceUrl && sourceUrl[1]){
                    //console.log(sourceUrl[1])
                    if (j === 0) { lurl = sourceUrl[1]; } // Server đầu tiên làm ID chính
                   
                    episodes.push({
                        id: sourceUrl[1],
                        name: "Server " + (j + 1),
                        slug: "tap-" + (j + 1)
                    });
                }

            }
        } else {
            // 3. Nếu không có nút thì tìm iframe
            var iframeRegex = /class="[^"]*video-player[^"]*"[\s\S]*?iframe\s+src="([^"]+)"/i;
            var iframeMatch = html.match(iframeRegex);
            
            if (iframeMatch && iframeMatch[1]) {
                lurl = iframeMatch[1];
                
                episodes.push({
                    id: lurl,
                    name: "Server 1",
                    slug: "tap-1"
                });
            }
        }
        
        servers = [{
            name: "Server",
            episodes: episodes
        }];
        
    } catch (e) {
        //console.error("Lỗi parse dữ liệu: ", e);
    }
    var $return = {
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: lurl,
        servers: servers,
        quality: "HD",
        year: year,
        status: status,
        duration: duration,
        casts: cast,
        director: direc
    }
    var $string = JSON.stringify($return);
    $return.description = $return.description + "\r\n" + JSON.stringify($return);
    // Trả về kết quả (Dù lỗi hay không lỗi vẫn return đúng cấu trúc object mong muốn)
    return JSON.stringify($return);
}
//var html = document.getElementsByTagName("html")[0].outerHTML;
//JSON.parse(parseMovieDetail(html,""))



// =================================================================
// TẦNG 1: Xử lý trang xem phim gốc (link_xem_phim)
// =================================================================
function parseDetailResponse(html, url) {
    try {
        var customJs = `
// Script chạy cho server heovl

function initCustomVideoFix() {
    const style = document.createElement('style');
    
    // Dùng dấu nháy đơn và nối chuỗi bằng dấu cộng để dễ nhìn, không bị trùng backtick
    var customcss = 'body { background: black; overflow: hidden; }#comments,header,footer,.entry-actions,.entry-header,.entry-info,.entry-content,#related-posts,.entry-content + .mt-2 {display:none}body * {background: black;}';
    
    style.innerHTML = customcss; // ĐÃ SỬA: Xóa dấu nháy đơn thừa
    document.head.appendChild(style);
    
    if (typeof jwplayer === "function") {
        const player = jwplayer("previewPlayer");
        if (player && typeof player.getMute === "function") {
            if (player.getMute()) {
                player.setMute(false);
                console.log("Đã bật tiếng video!");
            }
            player.setVolume(100);
        }
    }
    
    const checkAndClick = setInterval(() => {
        const skipButton = document.getElementById("skip-ad");
        
        if (skipButton) {
            skipButton.click();
            console.log("🎯 Đã tìm thấy và bấm nút thành công! Dừng script.");
            clearInterval(checkAndClick); // Dừng lại ngay lập tức
        } else {
            console.log("⏳ Vẫn đang tìm nút...");
        }
    }, 200);
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

    // Giới hạn tối đa 20 giây để tự động dọn dẹp bộ nhớ nếu nút không bao giờ xuất hiện
    setTimeout(() => {
        clearInterval(checkAndClick);
        customAlert("Báo", "⏱️ Đã quá 20 giây, dừng tìm kiếm."))
        console.log("⏱️ Đã quá 20 giây, dừng tìm kiếm.");
    }, 20000);
    
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}

`;
        
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

// KHỚP MẪU ROPHIMFAKE: Trả về chuỗi text thuần túy thay vì gọi JSON.stringify
//function parseCategoriesResponse(html) { return "[]"}
function parseCategoriesResponse(apiResponseJson) {
    var listurl = `
categories/viet-nam@@Việt Nam
categories/nga-russia@@Nga(Russia)
categories/vu-to@@Vú To
categories/tap-the@@Tập Thể
categories/hiep-dam@@Hiếp Dâm
categories/loan-luan@@Loạn Luân
categories/phim-cap-3@@Phim Cap 3
categories/vietsub@@Vietsub
categories/choi-lo-dit-anal-sex@@Chơi lỗ đít(Anal Sex
categories/nhat-ban@@Nhật Bản
`
    var menulist = buildMenu(listurl);
    
    return JSON.stringify(menulist);
}
function parseCountriesResponse(html) { return "[]"}
function parseYearsResponse(html) { return "[]"}
