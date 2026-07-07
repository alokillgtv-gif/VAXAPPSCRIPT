BASEURL = "https://heovl.im";
function getManifest() {
    return JSON.stringify({
        "id": "heovl",
        "name": "Heovl",
        "description": "XXX Hay",
        "version": "1.82",
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
                    if (j === 0) {
                        episodes.push({
                            id: sourceUrl[1],
                            name: "Server Full",
                            slug: "tap-0"
                        });
                    
                    } // Server đầu tiên làm ID chính
                   
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

        var customjs = customJQ();
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

function customJQ(){
    return `
// Script chạy cho server heovl

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
    
    const checkAndClick = setInterval(() => {
        const skipButton = document.getElementById("skip-ad");
        
        if (skipButton) {
            skipButton.click();
            console.log("🎯 Đã tìm thấy và bấm nút thành công! Dừng script.");
            showToast("Đã bỏ qua quảng cáo", duration = 3000)
            clearInterval(checkAndClick); // Dừng lại ngay lập tức
        } else {
            //showToast("Đang tìm nút", duration = 3000)
        }
    }, 200);
    // Giới hạn tối đa 20 giây để tự động dọn dẹp bộ nhớ nếu nút không bao giờ xuất hiện
    setTimeout(() => {
        clearInterval(checkAndClick);
        //console.log("⏱️ Đã quá 20 giây, dừng tìm kiếm.");
    }, 20000);
    
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}

`;
}
