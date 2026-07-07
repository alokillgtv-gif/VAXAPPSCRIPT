BASEURL = "https://viet69z.me";

function getManifest() {
    return JSON.stringify({
        "id": "viet69",          
        "name": "Viet69",
        "description": "XXX Hay",
        "version": "1.1",             
        "baseUrl": "https://viet69z.me",
        "iconUrl": "https://raw.githubusercontent.com/alokillgtv-gif/VAXAPPSCRIPT/main/img/viet69.png", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "", "title": "Sex Mới", "type": "Grid" }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { "slug": "sinh-vien", "name": "Sinh Viên" },
        { "slug": "may-bay-ba-gia", "name": "Máy Bay" },
        { "slug": "?s=Vi%E1%BB%87t+nam", "name": "Việt Nam" },
        { "slug": "?s=T%E1%BA%ADp+th%E1%BB%83", "name": "Tập Thể" }, // ĐÃ SỬA: Thêm dấu phẩy ở đây
        { "slug": "?s=Hi%E1%BA%BFp+d%C3%A2m", "name": "Hiếp Dâm" }
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
        if (filtersJson.category) {
            return BASEURL + "/" + filters.category + "/page/" + page;
        }
        if (page > 1) {
            if (slug.indexOf("s=") > -1) {
                 return BASEURL + "/page/" + page + "/" + slug;
            } else {
                 return BASEURL + "/" + slug + "/page/" + page;
            }
        }
        return BASEURL + "/" + slug;
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/?s=" + encodeURIComponent(keyword);
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
        var pattern = /(?=<div[^>]*class="[^"]*entry-video__thumbnail[^"]*")/g;
        var splitItems = html.split(pattern).filter(Boolean);

        for (var j = 1; j < splitItems.length; j++) {
            var block = splitItems[j];
            var hrefMatch = block.match(/href="([^"]+)"/i);
            if (!hrefMatch) continue; 

            var id = hrefMatch[1].trim();
            var title = "";
            
            var altMatch = block.match(/title="([^"]+)"/i);
            if (altMatch) {
                title = altMatch[1].trim();
            } else {
                var labelMatch = block.match(/aria-label="([^"]+)"/i); // ĐÃ SỬA: Fallback sang aria-label thay vì trùng lặp quét title
                title = labelMatch ? labelMatch[1].trim() : "";
            }
            
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
		
        // ĐÃ SỬA: Loại bỏ khai báo trùng lặp var/const cho biến currentPage
        var currentRegex = /aria-current="page"[^>]*>([\d]+)<\/span>/;
        var currentMatch = html.match(currentRegex);
        var parsedCurrentPage = currentMatch ? parseInt(currentMatch[1], 10) : 1;

        // Tìm trang cuối cùng (Last Page)
        var pageNumRegex = /\/page\/([\d]+)\//g;
        var match;
        var maxPage = 1; 

        while ((match = pageNumRegex.exec(html)) !== null) {
            var pageNum = parseInt(match[1], 10);
            if (pageNum > maxPage) {
                maxPage = pageNum;
            }
        }

        return JSON.stringify({
            "items": items,
            "pagination": { 
                "currentPage": parsedCurrentPage, 
                "totalPages": maxPage, 
                "totalItems": 20 * maxPage,
                "itemsPerPage": 20
            }
        });
    } catch (e) {
        return JSON.stringify({ "items": [], "pagination": { "currentPage": 1, "totalPages": 1 } });
    }
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";

    var rmatch = html.match(/<meta[^>]*?property="og:url"[^>]*?content="([^"\s]+)"|<meta[^>]*?content="([^"\s]+)"[^>]*?property="og:url"/i);
    if (rmatch) { lurl = rmatch[1] || rmatch[2]; }

    rmatch = html.match(/property="og:image" content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }   
     
    var streamUrl = "";
    var iframeMatch = html.match(/src="(https:\/\/emb\.cd-vs\.com\/embed\/[^"]+)"/i);
   	if (iframeMatch && iframeMatch[1]) { streamUrl = iframeMatch[1]; }
     
    return JSON.stringify({
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes  + "\r\n\r\n" + lurl + "\r\n\r\n" + streamUrl,
        servers: [
            {
                name: "Server",
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

function parseDetailResponse(html) {
    try {
var customJs = `
function initCustomVideoFix() {
  // 1. Thêm CSS cơ bản để tràn màn hình
  const style = document.createElement('style');
  style.innerHTML = '#jsHandleFavoritePost,a[rel="tag"],#comments,footer,.custom-logo-link,.top-menu,.entry-content.mt-2,.space-y-4.p-2,#jsCommentContainer,#related-posts,.entry-header,.entry-header{display:none!important;}body,.py-1{background:black;color:black;overflow: hidden;}.cursor-pointer{color:white}.#jsListServers{text-align: center;display:block!important;width:100%}#jsListServers li{display:inline--block}iframe { width: 100 % ;height: 100 % ;position: fixed;top: 0;left: 0;right: 0;bottom: 0;z - index: 99999 }body, html { width: 100%; height: 100%; overflow: hidden; margin: 0; padding: 0; background: #000; }';
  document.head.appendChild(style);
  
  startContinuousCleaning();
}

// Hàm thực hiện việc dọn dẹp liên tục
function startContinuousCleaning() {
  // Chạy lần đầu tiên ngay lập tức
  cleanPageAndKeepVideo();
  
  // Cứ mỗi 5 giây (5000ms) sẽ quét và xóa banner một lần để diệt tận gốc quảng cáo tự nhảy ra
  // Nếu bạn muốn ĐÚNG 1 phút tròn mới quét một lần thì đổi số 5000 thành 60000 nhé
  let cleanInterval = setInterval(cleanPageAndKeepVideo, 5000);
  
  // Tự động dừng vòng lặp dọn dẹp này sau 5 phút (300000ms) để tiết kiệm RAM/CPU cho trình duyệt
  setTimeout(() => {
    clearInterval(cleanInterval);
    console.log("Đã dừng vòng lặp dọn dẹp sau 5 phút.");
  }, 300000);
}

// Hàm dọn sạch trang web, chỉ giữ lại đúng iframe video
function cleanPageAndKeepVideo() {
  const iframe = document.querySelector('iframe[id*="player"]');
  
  if (iframe) {
    // Ép style cho iframe này tràn hết màn hình
    if (iframe.style.position !== 'fixed') {
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.zIndex = '999999';
      iframe.style.border = 'none';
    }

    // Đưa iframe ra làm con trực tiếp của body nếu nó chưa ở đó
    if (iframe.parentElement !== document.body) {
      document.body.appendChild(iframe);
    }

    // Quét và xóa sạch tất cả những thằng khác nằm trong <body>
    let deletedCount = 0;
    Array.from(document.body.children).forEach(child => {
      if (child !== iframe && child.tagName !== 'STYLE' && child.tagName !== 'SCRIPT') {
        child.remove(); 
        deletedCount++;
      }
    });
    
    if (deletedCount > 0) {
      console.log(\`Đã quét và xóa thêm \${deletedCount} banner quảng cáo phát sinh!\`);
    }
  } else {
    console.log("Không tìm thấy iframe video để bảo vệ.");
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
  initCustomVideoFix();
}
`;


        // Quét lấy link nhúng theo domain đã tối ưu
        var streamUrl = "";
        var rmatch = html.match(/src="(https:\/\/emb\.cd-vs\.com\/embed\/[^"]+)"/i);
        if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
   
        return JSON.stringify({
            url: streamUrl,
            headers: {
                "Referer": "https://viet69z.me",
                "Origin": "https://viet69z.me",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Custom-Js": customJs.trim()
            }
        });
    } catch (error) {
        return JSON.stringify({ url: "", headers: {} });
    }
}

function parseCategoriesResponse(html) { return JSON.stringify([
    { "slug": "sinh-vien", "name": "Sinh Viên" },
    { "slug": "may-bay-ba-gia", "name": "Máy Bay" },
    { "slug": "?s=Vi%E1%BB%87t+nam", "name": "Việt Nam" },
    { "slug": "?s=T%E1%BA%ADp+th%E1%BB%83", "name": "Tập Thể" }, // ĐÃ SỬA: Thêm dấu phẩy ở đây
    { "slug": "?s=Hi%E1%BA%BFp+d%C3%A2m", "name": "Hiếp Dâm" }
])}
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
