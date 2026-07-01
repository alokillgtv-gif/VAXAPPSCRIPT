// =============================================================================
// VAAPP Plugin - Phim Chill
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "phimchill",          
        "name": "Phim Chill",
        "description": "Phim online",
        "version": "1.0",             
        "baseUrl": "https://phimchillhdc.im",
        "iconUrl": "https://phimchillhdc.im/favicon.ico", 
        "isEnabled": true,
        "type": "VIDEO",
        "playerType": "exoplayer"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "danh-sach/phim-le.html", "title": "Phim Lẻ", "type": "Horizontal" },
        { "slug": "danh-sach/phim-bo.html", "title": "Phim Bộ", "type": "Horizontal" },
        { "slug": "the-loai/short-drama.html", "title": "Phim Ngắn", "type": "Horizontal" },,
        { "slug": "the-loai/kinh-di.html", "title": "Kinh Dị", "type": "Grid" }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
    { "slug": "the-loai/hoat-hinh.html", "name": "Hoạt Hình" },
    { "slug": "the-loai/phim-18.html", "name": "18+" },
    { "slug": "the-loai/hanh-dong.html", "name": "Hành Động" },
    { "slug": "the-loai/hai-huoc.html", "name": "Hài Hước" },
    { "slug": "the-loai/vien-tuong.html", "name": "Viễn Tưởng" },
    { "slug": "the-loai/phieu-luu.html", "name": "Phiêu Lưu" },
    { "slug": "the-loai/chien-tranh.html", "name": "Chiến Tranh" }
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
            return "https://phimchillhdc.im/" + slug + "?page=" + page;
        }
        return "https://phimchillhdc.im/" + slug;
    } catch (e) {
        return "https://phimchillhdc.im/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return "https://phimchillhdc.im/?search=" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf('http') === 0) return slug;
    return "https://phimchillhdc.im/" + slug;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    try {
        var items = [];
var pattern = /(?=<article[^>]*class="[^"]*max-w-xs[^"]*")/g;
var splitItems = html.split(pattern).filter(Boolean);

for (var j = 1; j < splitItems.length; j++) {
    var block = splitItems[j];
    var hrefMatch = block.match(/href="([^"]+)"/i);
    if (!hrefMatch) continue; // Bỏ qua nếu khối không chứa link

	 var id = "https://script.google.com/macros/s/AKfycbwpvG-r_4JrHSTo_EMg6_k5GTSjZwlgn1xl36mZQLyHWg1R-OFwP7oQdIn-Loo4Eqw/exec?url=" + hrefMatch[1].trim();
    var title = "";
    
    // Thử lấy title từ thuộc tính alt của ảnh trước
    // <span class="title">
    var altMatch = block.match(/title="([^"]+)"/i);
    if (altMatch) {
        title = altMatch[1].trim();
    } else {
        // Khử fallback sang aria-label nếu alt không tồn tại
        var labelMatch = block.match(/title="([^"]+)"/i);
        title = labelMatch ? labelMatch[1].trim() : "";
    }
    
    // ĐIỀU KIỆN 1: Nếu tiêu đề rỗng hoặc là "Video không tiêu đề" thì không gán vào items
    if (!title || title === "Video không tiêu đề") {
        continue; 
    }
    
    var srcMatch = block.match(/img[\s\S]*?src="([^"]+)"/i);
    var posterUrl = srcMatch ? srcMatch[1].trim() : "https://ic-vt-nss.cdnsolutions.media/a/YjgwNDg0MGRkZWVjZjQ1ZGVhZjc5MzQ0ZWJkMDlhOTA/s(w:1280,h:720),webp/026/522/500/1280x720.17475568.jpg";
    
    items.push({
        "id": id,          
        "title": title, 
        "posterUrl": posterUrl, 
        "backdropUrl": posterUrl
    });
}
		
        var currentPage = 1;
        var totalPages = 1;

        const activeRegex = /active".*?<a[^>]*>\s*(\d+)\s*<\/a>/s;
		const activeMatch = htmlString.match(activeRegex);
		const activePage = activeMatch ? parseInt(activeMatch[1]) : null;

// 2. Regex lấy số trang cuối cùng (Đứng ngay trước nút 'next')
		const lastPageRegex = /(\d+)\s*<\/a>\s*<\/li>\s*<li[^>]*next/s;
		const lastPageMatch = htmlString.match(lastPageRegex);
		const lastPage = lastPageMatch ? parseInt(lastPageMatch[1]) : null;


        return JSON.stringify({
            "items": items,
            "pagination": { 
                "currentPage": activePage, 
                "totalPages": lastPage, // ĐÃ SỬA: Đồng bộ đúng biến totalPages động
                "totalItems": 48 * totalPages,
                "itemsPerPage": 48
            }
        });
    } catch (e) {
        return JSON.stringify({ "items": [], "pagination": { "currentPage": 1, "totalPages": 1 } });
    }
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}
//<div class="md:w-full w-10/12 mx-auto">
// https://script.google.com/macros/s/AKfycbwpvG-r_4JrHSTo_EMg6_k5GTSjZwlgn1xl36mZQLyHWg1R-OFwP7oQdIn-Loo4Eqw/exec?url=https://phimchillhdc.im/phim/phi-phong-quy-mau-rung-thieng_46797.html
function parseMovieDetail(html) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";

    var rmatch = html.match(/md:w-full[\s\S]*?href="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1]}

    rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }   
     
     var streamUrl = "";
        
        var rmatch = html.match(/iframe[\s\S]*?data-src="([\s\S]*?)"/i);
   	 if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
     
    return JSON.stringify({
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes  + "\r\n\r\n" +lurl + "\r\n\r\n" + streamUrl,
        servers: [
            {
                name: "HaySex",
                episodes: [
                    { id: lurl, name: "Xem Ngay", slug: "full" }
                ]
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
    });
}
//<link rel="preload" href="https://video3.cdnsolutions.media/key=kePlMtN+ADhubUR5+oDV3A,end=1782846000/data=2405:4802:918e:9690:213f:c9b0:ee12:58e-dvp/media=hls4/multi=256x144:144p:,426x240:240p:,854x480:480p:,1280x720:720p:,1920x1080:1080p:/029/485/972/_TPL_.av1.mp4.m3u8" as="fetch" crossorigin="true">
function parseDetailResponse(html) {
    try {
      /*
      var rmatch = html.match(/link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1]; }
    */
		var customJs = `
function initCustomVideoFix() {
  // 1. Chèn CSS dọn dẹp giao diện (ẩn footer, sidebar, navbar...)
  const style = document.createElement('style');
  style.innerHTML = '';
  document.head.appendChild(style);
  
  const player = jwplayer("previewPlayer");

// 2. Kiểm tra xem player có tồn tại và đang bị tắt tiếng hay không
if (player && typeof player.getMute === "function") {
    if (player.getMute()) {
        player.setMute(false); // Bật tiếng (Bỏ chế độ Mute)
        console.log("Đã bật tiếng video!");
    } else {
        console.log("Video đã có tiếng sẵn từ trước.");
    }

    // Tiện tay nếu bạn muốn đảm bảo âm thanh ở mức to nhất (ví dụ: 100%)
    player.setVolume(100); 
} else {
    console.error("Không tìm thấy đối tượng JW Player hoặc player chưa sẵn sàng.");
}


}
  // 2. Dùng setInterval để đợi trình phát video v0:480p:,1280x720:720p:,1920x10

// Kiểm tra trạng thái trang để kích hoạt hàm an toàn nhất
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
  initCustomVideoFix();
}
`;
		var streamUrl = "";
        var rmatch = html.match(/iframe[\s\S]*?data-src="([\s\S]*?)"/i);
   	 if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
   
return JSON.stringify({
    url: streamUrl,
    headers: {
        "Referer": "https://phimchillhdc.im",
        "Origin": "https://phimchillhdc.im",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Custom-Js": customJs.trim()
    }
});
    } catch (error) {
        return JSON.stringify({ url: "", headers: {} });
    }
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
