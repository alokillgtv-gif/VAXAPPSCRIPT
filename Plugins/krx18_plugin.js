BASEURL = "https://krx18.com";

function getManifest() {
    return JSON.stringify({
        "id": "krx18",
        "name": "Phim 18+ Hàn",
        "description": "Nguồn XXX hàn quốc Hay",
        "version": "1.0",
        "BASEURL": "https://krx18.com",
        "iconUrl": "https://krx18.com/wp-content/uploads/2022/10/krx18B.png",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}
// https://krx18.com/movies/page/2/
function getHomeSections() {
    return JSON.stringify([
        { "slug": "/movies/", "title": "Phim Có Nội Dung", "type": "Grid" }
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
// ===================================================================
function getUrlList(slug, filtersJson) {
    try {
        // 1. Kiểm tra nếu slug là link tuyệt đối (chứa http) và không có bộ lọc thì trả về luôn
        if (slug && slug.indexOf("http") > -1 || slug.indexOf("search/") > -1) {
            // thường là link search sẽ bị trả về ở đây
            return slug;
        }
        let page = 1;
        let path = slug || "";
        
        // 2. Xử lý an toàn filtersJson nếu có truyền vào
        if (filtersJson) {
            // Nếu có số trang hoặc  có menu categ
            // Sửa lỗi nếu JSON thiếu dấu ngoặc kép ở key hoặc sai cú pháp cơ bản
            let fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                .replace(/:,/g, ':');
            // Sửa lỗi nếu truyền kiểu {"page",24} thành {"page":24}
            
            try {
                let filters = JSON.parse(fixedJson);
                page = parseInt(filters.page) || 1;
                
                // Nếu có category trong JSON, ưu tiên lấy category làm đường dẫn (path)
                if (filters.category) {
                    if (Array.isArray(filters.category) && filters.category.length > 0) {
                        path = filters.category[0].slug;
                    } else if (typeof filters.category === 'string') {
                        path = filters.category;
                    }
                }
            } catch (jsonErr) {
                //console.log("JSON parse lỗi, dùng giá trị mặc định");
            }
        }
        
        
        // 4. Chuẩn hóa path (Xóa dấu gạch chéo thừa ở đầu/cuối để tránh nhân đôi dấu //)        
        // 5. Nối chuỗi URL kết quả
        let resultUrl = BASEURL;
        if (path) {
            resultUrl += path;
        }
        // https://www.tranny.one/recent/?mix=true&pageId=2&_=1783573720196
        if (page > 1 && resultUrl.indexOf("filter=latest") == -1) {
            resultUrl += "page/" + page + "/";
        }
        // Trả về kết quả, chỉ gộp dấu // ở phần path, giữ nguyên https://
        return resultUrl.replace(/([^:]\/)\/+/g, "$1");
        
    } catch (e) {
        // console.log("Lỗi hệ thống: " + e.message);
        // Trả về URL gốc an toàn nếu có lỗi
        let fallback = BASEURL + (slug ? "/" + slug : "");
        return fallback.replace(/([^:]\/)\/+/g, "$1");
    }
}
// https://krx18.com/genre/china/page/3/
// https://krx18.com/movies/page/4/

//BASEURL = "https://www.trannymovs.com";
//filtersJson = '{"page":5,"category":[{"slug":"/categories/ladyboy/","name":"ladyboy"}]}';
//filtersJson = '{"page":13}';
//console.log(getUrlList("", filtersJson));


function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/search/" + encodeURIComponent(keyword) + "/";
}

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf('http') === 0) return slug;
    return BASEURL + slug;
}

function getUrlCategories() { return BASEURL; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html, $url) {
    try {
        var items = [];
        //.thumb_rel item
        // 
        var regexList = `
class[^>]+movies[\\s\\S]*?
src=["']([^"']+)["'][\\s\\S]*?
alt=["']([^"']+)["'][\\s\\S]*?
href=["']([^"']+)["']
`;
        regexList = regexList.replace(/\r|\n|\t/g, "");
        regmath = new RegExp(regexList, "g");
//regmath.exec(html)
        var matchList;
        // regexList.exec(html)
        while ((matchList = regmath.exec(html)) !== null) {
            if (matchList[3] && matchList[3].indexOf("http") > -1) {
                var cleanThumb = matchList[1].replace(/&amp;/g, '&');
                // var imgorigin = matchList[0].match(/data-webp=["']([^"']+)["']/i);
                //if(imgorigin && imgorigin[1]){
                //   cleanThumb = imgorigin[1];
                //}
                
                items.push({
                    "id": matchList[3],
                    "title": matchList[2].trim(),
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
///*
//html = $("html")[0].outerHTML;
//JSON.parse(parseListResponse(html));
// Bỏ dấu / ở đầu chuỗi
//*/



function parseSearchResponse(html) {
    return parseListResponse(html);
}


function parseMovieDetail(html,$url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var streamUrl = ""; // ĐÃ SỬA: Khai báo rõ ràng biến streamUrl tránh lỗi Global leak

    var rmatch = html.match(/link\s+rel="canonical"\s+href=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1] }

    rmatch = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/<title>([^<]+)/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    // https://krx18.com/wp-json/dooplayer/v2/85671/movie/1
    // <meta id="dooplay-ajax-counter" data-postid="85671" />
    var idvideo = "";
    var $linkser = "";
    rmatch = html.match(/id=["']dooplay-ajax-counter["']\s+data-postid=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { 
        idvideo = rmatch[1];
        $linkser = "https://krx18.com/wp-json/dooplayer/v2/"+idvideo+"/movie/";
    }
    var $stream = "";
    var epi = [];
    
     epi.push({ id: $linkser + "1", name: "Server 1", slug: "full" });
    epi.push({ id: $linkser + "2", name: "Server 2", slug: "full" });
    epi.push({ id: $linkser + "3", name: "Server 3", slug: "full" });
    // var stream = 'https://agokda.cdnlab.live/stream/X9mBBkyCNC1euSox903wew/1783632790/0/431/431.m3u8';
    var $return = {
        id: $url,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: "",
        servers: [
            {
                name: "Servers: ",
                episodes: epi
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
    }
    var $objreturn = $return;
    $return.description = ldes + "\r\n\r\n\r\n\r\n\r\n\r\n" + JSON.stringify($objreturn);
    return JSON.stringify($return);
}

/*
BASEURL = "https://www.justporn.com";
var html = $("html")[0].outerHTML;
var $url = "https://www.justporn.com/video/18058/hot-babe-remy-cheats-with-bbc/";
JSON.parse(parseMovieDetail(html,$url))
*/

function parseDetailResponse(html,url) {
    try {
        var link = url;
        //if(html.indexOf("embed_url") > -1){
            var $embed = JSON.parse(html);
            link = $embed.embed_url;
       // }
        
        
        var customjs = textJS(html, url);
        customjs += `
        function runScript($msg){
            showToast("Tải video thành công, coi vui nhé bạn", 10000);
            document.getElementById("mediaplayer").click();
        }
        `
    // {"embed_url":"https:\/\/play.playkrx18.site\/play\/6a4f1c63ee633ccb0191a32f","type":"iframe"}
    // Đọc trực tiếp từ thuộc tính của BaseJSON đã lưu ở bước đầu tiên
        return JSON.stringify({
    "url": link,
    "headers": {
        "Referer": BASEURL,
        "Origin": BASEURL,
        isEmbed: true,
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
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

function parseEmbedResponse(html, sourceUrl) {
        
        var link = sourceUrl;
       // if (html.indexOf("embed_url") > -1) {
            var $embed = JSON.parse(html);
            link = $embed.embed_url;
       // }

        var customjs = textJS(html, sourceUrl);
        customjs += `
        function runScript($msg){
            showToast("Bước 2", 60000)
        }
        `

        return JSON.stringify({
            url: link,
            isEmbed: false, // Kết thúc, đây là link stream cuối
            mimeType: "application/x-mpegURL", // Báo App đây là HLS
            headers: { "Referer": BASEURL,
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
    //showToast("Chèn css mới", duration = 3000)
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
    runScript("sssssssss");
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
/genre/korea/@@Korea
/genre/australia/@@Australia
/genre/belgium/@@Belgium
/genre/canada/@@Canada
/genre/china/@@China
/genre/denmark/@@Denmark
/genre/france/@@France
/genre/germany/@@Germany
/genre/indonesia/@@Indonesia
/genre/india/@@India
/genre/italy/@@Italy
/genre/japan/@@Japan
/genre/netherlands/@@Netherlands
/genre/philippines/@@Philippines
/genre/poland/@@Poland
/genre/russia/@@Russia
/genre/singapore/@@Singapore
/genre/spain/@@Spain
/genre/switzerland/@@Switzerland
/genre/taiwan/@@Taiwan
/genre/thailand/@@Thailand
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


