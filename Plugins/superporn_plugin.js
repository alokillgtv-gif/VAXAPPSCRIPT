BASEURL = "https://www.superporn.com";

function getManifest() {
    return JSON.stringify({
        "id": "superporn",          
        "name": "SuperPorn",
        "description": "XXX Hay",
        "version": "2.9",             
        "baseUrl": "https://www.superporn.com",
        "iconUrl": "https://superporn.com/favicon.ico", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "auto"
    });
}
/*
{ "slug": "phim-sex-hiep-dam", "title": "Hiếp Dâm", "type": "Horizontal" },
        { "slug": "phim-sex-loan-luan", "title": "Loạn Luân", "type": "Horizontal" },
        { "slug": "phim-sex-vung-trom", "title": "Vụng Trộm", "type": "Horizontal" }, // ĐÃ SỬA: Thêm dấu phẩy hợp lệ ở đây
        { "slug": "phim-sex-chau-au", "title": "Châu Âu", "type": "Horizontal" },
        { "slug": "phim-sex-trung-quoc", "title": "Trung Quốc", "type": "Horizontal" }
    ]);
*/
function getHomeSections() {
    return JSON.stringify([
        { "slug": "japanese", "title": "Gái Nhật", "type": "Horizontal" },
        { "slug": "teen", "title": "Gái Trẻ", "type": "Horizontal" },
        { "slug": "series/full-movies", "title": "Phim Dài", "type": "Horizontal" },
        { "slug": "", "title": "Clip Mới", "type": "Grid" }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { "slug": "shemale", "name": "Shemale"},
        { "slug": "japanese", "name": "Gái Nhật"},
        { "slug": "cheating", "name": "Chơi Lén"},
        { "slug": "gay", "name": "Gay"},
        { "slug": "russian-porn", "name": "Gái Nga"},
        { "slug": "dad-and-daughter", "name": "Cha Con"},
        { "slug": "mom-and-son", "name": "Mẹ Con"}
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
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        
        if (page > 1) {
            return BASEURL + "/" + slug + "/" + page;
        }
        return BASEURL + "/" + slug;
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/search?q=" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf('http') === 0) return slug;
    return BASEURL + "/" + slug;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================
/*
<div class="thumb-video  ">
    <a href="https://www.superporn.com/video/hard-black-cock-for-tori-black" class="thumb-duracion">
    <img alt="Hard black cock for Tori Black" loading="lazy" class="lazy " src="https://img2.superporn.com/videos/146/14658/thumbs/thumbs_0012_custom_1678794635.1263.jpg" width="332" height="186" data-loaded="true">
    <span class="duracion">
    26:41
  </span>
*/
function parseListResponse(html) {
    try {
        var items = [];
        var cleanHtml = html.replace(/<!--[\s\S]*?-->/g,""); // Xóa comment[cite: 5]
        
        // Bóc chính xác thẻ <a> và thẻ <img> nằm bên trong cụm class="thumb-video"
        var regex = /div class="thumb-video[^>]*>[\s\S]*?href="([^"]+)"[\s\S]*?<img\s+alt="([^"]+)"[\s\S]*?src="(http[^"]+)"/gi;
        var match;
        
        while ((match = regex.exec(cleanHtml)) !== null) {
            var id = match[1].trim();
            var title = match[2].trim();
            var limg = match[3].trim();
            
            items.push({
                "id": id,          
                "title": title, 
                "posterUrl": limg,
                "backdropUrl": limg
            });
        }

        var currentPage = 1;
        var totalPages = 1;

        if (cleanHtml) {
            var currentMatch = cleanHtml.match(/btn-pagination--selected[^>]*>(\d+)<\/a>/i);
            //var maxMatch = cleanHtml.match(/<a[^>]*>(\d+)<\/a>\s*<\/li>\s*<li[^>]*class="[^"]*next/i);
			var maxMatch = cleanHtml.match(/results__search--videos[\s\S]*?count-results[\s\S]*?(\d+)/i);
			
            if (currentMatch && currentMatch[1]) {
                currentPage = parseInt(currentMatch[1], 10);
            }
            if (maxMatch && maxMatch[1]) {
                var totalPage = parseInt(maxMatch[1], 10);
                var totalPages = Math.floor(totalPage / 56)
            }
            else{
            	var maxMatch = cleanHtml.match(/count-results[\s\S]*?(\d+)/i);
            	if (maxMatch && maxMatch[1]) {
                	var totalPage = parseInt(maxMatch[1], 10);
                	var totalPages = Math.floor(totalPage / 56)
          	  }	
			}
        }

        return JSON.stringify({
            "items": items,
            "pagination": { 
                "currentPage": currentPage, 
                "totalPages": 10,    
                "totalItems":  56 * totalPages,
                "itemsPerPage": 56
            }
        });
    } catch (e) {
        return JSON.stringify({ "items": [], "pagination": { "currentPage": 1, "totalPages": 1 } });
    }
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html,$url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
	// <link rel="canonical" href="https://www.superporn.com/video/japanese-and-german-girls-massage-each-other-s-giant-boobs">
    var rmatch = html.match(/link\srel="canonical"[\s\S]*?href="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:image"\s+content="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    rmatch = html.match(/id="superporn_player_html5_api[\s\S]*?source\ssrc="([\s\S]*?)"/i);
    var streamUrl = "None";
        if (rmatch && rmatch[1]) {
            streamUrl = rmatch[1];
        }	
     
    return JSON.stringify({
        id: $url,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n" + streamUrl,
        servers: [
            {
                name: "Full",
                episodes: [
                    { id: $url, name: "Full", slug: "" }
                ]
            }
        ],
        quality: "HD",
        year: 2026, // ĐÃ SỬA: Thay "????" bằng số nguyên để không lỗi ép kiểu
        rating: 8.0,
        status: "Full",
        duration: 0, // ĐÃ SỬA: Thay "????" bằng 0 đề phòng lỗi ép kiểu tương tự
        casts: "Diễn viên",
        director: "Đạo diễn",
        category: "18+"
    });
}
//<video id="superporn_player_html5_api" playsinline="playsinline" webkit-playsinline="" preload="none" class="vjs-tech" poster="https://img.superporn.com/videos/356/3560/previews/previews_0012_custom_1654675518.0576.jpg" data-stats-video-id="3560" data-sprites-url="https://img.superporn.com/videos/356/3560/sprites/sprite_[index].jpg" data-video-duration="1146" data-video-preview="https://img.superporn.com/videos/356/3560/previews/previews_0012_custom_1654675518.0576.jpg" tabindex="-1"> <source src="https://cdnst.superporn.com/videos/356/3560/mp4/08742e514343b8c354693ddf5c593d76521831d9e6c586f29da7106393d5bba4.mp4?secure=lptcAIZwqd7MiKvVipxKeg%3D%3D%2C1782908733" type="video/mp4"> </video>

function parseDetailResponse(html, url) {
    try {
        var $link = "";
        var serverMatches = html.match(/video[\s\S]*?src=["']([^"']+)["'][\s\S]*?<\/video>/i);
        if (serverMatches && serverMatches[1]) {
            $link = serverMatches[1]
        }
        var customjs = textJS($link);
        return JSON.stringify({
            "url": $link,
            "headers": {
                "Referer": BASEURL,
                "Origin": BASEURL,
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

function textJS($link) {
    // Sử dụng biến $url từ tham số truyền vào thay vì ghi cứng link
    return `
LINKVIDEO = '${$link}';
SCRIPTURL = "https://script.google.com/macros/s/AKfycbwsvLFzWMdxvX9ZH-3wnP3GJzS58v0CtT_0mlEYeOz6cOsgen9IR3c6VPv_EssPXMFzwQ/exec?name=superporn&type=js"; 
const style = document.createElement('style');
var customcss = 'body { background: black; overflow: hidden; }body * {background: black;display:none!important}';
style.innerHTML = customcss;
//document.head.appendChild(style);
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
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}

`;
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
