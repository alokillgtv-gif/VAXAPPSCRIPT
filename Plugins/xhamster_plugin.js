// =============================================================================
// VAAPP Plugin - Xhamster (Bản vá chuẩn hóa theo cấu trúc Core mới nhất)
// =============================================================================
BASEURL = "https://xhwide.com";
DEV = "true";
function getManifest() {
    return JSON.stringify({
        "id": "xhamster",          
        "name": "Xhamster",
        "description": "XXX Hay",
        "version": "1.3",             
        "baseUrl": BASEURL,
        "iconUrl": "https://static.cdnsolutions.media/xh-desktop/images/favicon/favicon-v2-256x256.ico", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "exoplayer"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "categories/vietnamese", "title": "Việt Nam", "type": "Horizontal" },
        { "slug": "categories/bus", "title": "Xe Bus", "type": "Horizontal" },
        { "slug": "categories/uncensored", "title": "Không Che", "type": "Horizontal" },
        { "slug": "best/weekly", "title": "Hay Trong Tuần", "type": "Horizontal" },
        { "slug": "newest", "title": "Hàng Mới", "type": "Grid" },
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { "slug": "categories/anal", "name": "Lỗ Nhị"},
        { "slug": "categories/big-tits", "name": "Vú Bự"},
        { "slug": "categories/gangbang", "name": "Tập Thể"},
        { "slug": "categories/threesome", "name": "Chơi 3"},
        { "slug": "categories/russian", "name": "Gái Nga"},
        { "slug": "categories/hentai", "name": "Hentai"}
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
    return BASEURL + "/search/" + encodeURIComponent(keyword);
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

        id: 26522500
        duration: 1130
        created: 1746867016
        title: "Fuck While Her Mom Next Room, Came All Over Her Face, Hoping She Wouldn't Notice."
        thumbId: 17475568
        videoType: "video"
        pageURL: "https://xhwide.com/videos/fuck-while-her-mom-next-room-came-all-over-her-face-hoping-she-wouldnt-notice-xhAOCwF"
        thumbURL: "https://ic-vt-nss.cdnsolutions.media/a/ZjQ2NTQxYTc0YjVlNDcwZjc5YjRiNDFiYWZmMjJkM2Y/s(w:526,h:298),webp/026/522/500/1280x720.17475568.jpg"
        imageURL: "https://ic-vt-nss.cdnsolutions.media/a/YjgwNDg0MGRkZWVjZjQ1ZGVhZjc5MzQ0ZWJkMDlhOTA/s(w:1280,h:720),webp/026/522/500/1280x720.17475568.jpg"
        previewThumbURL: "https://thumb-nss.cdnsolutions.media/a/9K9iFlO_g1a4evV3qApisA/026/522/500/16x9.17475568.jpg"
        icon: null
        spriteURL: "https://thumb-v0.cdnsolutions.media/a/aev8YLFGPuOK0aszutZMqA/026/522/500/526x298.s.webp"
        trailerURL: "https://thumb-v0.cdnsolutions.media/a/wQ7bPlymoSp4RxeqnFy1lQ/026/522/500/526x298.94.3.5.t.av1.mp4"
        trailerFallbackUrl: "https://thumb-v0.cdnsolutions.media/a/AV96D_DzLKvtU1vTZBv4QQ/026/522/500/526x298.94.3.5.t.mp4"
        isUHD: true
        views: 4707095
*/
function parseListResponse(html) {
    try {
        var script = html.match(/<script[^>]+id=['"]initials-script["']>([\s\S]*?)<\/script>/i);
        if(script && script[1]){
            eval(script);
     		var listVideos  = window.initials.pagesCategoryComponent.trendingVideoListProps.videoThumbProps;
     		var items = [];
    		for(var j = 0;j < listVideos.length;j++){
    		    var itemVideo = listVideos[j];
                items.push({
                    "id": itemVideo.pageURL,
                    "title": itemVideo.title,
                    "posterUrl": itemVideo.previewThumbURL,
                    "backdropUrl": itemVideo.imageURL
                });
    		}
    		return JSON.stringify({
                "items": items,
                "pagination": {
                    "currentPage": window.initials.pagesCategoryComponent.paginationProps.currentPageNumber,
                    "totalPages": window.initials.pagesCategoryComponent.paginationProps.lastPageNumber, // ĐÃ SỬA: Đồng bộ đúng biến totalPages động
                    "totalItems": 46 * window.initials.pagesCategoryComponent.paginationProps.lastPageNumber,
                    "itemsPerPage": 46
                }
            });
        }
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

    var rmatch = html.match(/link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1].replace("https://xhamster.com",BASEURL); }

    rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    
     var rmatch = html.match(/rel="preload"\shref="([\s\S]*?m3u8)"/i);
   	 if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
        
     
    return JSON.stringify({
        id: streamUrl ,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n" + streamUrl + "\r\n\r\n" +lurl,
        servers: [
            {
                name: "Xhamster Stream",
                episodes: [
                    { id: streamUrl , name: "Xem Ngay", slug: "full" }
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

function parseDetailResponse(html,url) {
    try {
        var streamUrl = "";
        
        var rmatch = html.match(/rel="preload"\shref="([\s\S]*?m3u8)"/i);
   	 if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
        
      /*
      var rmatch = html.match(/link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1]; }
    */
		var customJs = textJS(html,url)

return JSON.stringify({
    url: streamUrl,
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
function textJS(html,$url){
    return customJs = `
function initCustomVideoFix() {
    const style = document.createElement('style');
    var customcss = 'body { background: black; overflow: hidden; }';
    style.innerHTML = customcss;
    document.head.appendChild(style);
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('click', () => { autoFullscreenLoop(video); });
        autoFullscreenLoop(video);
    } else {
        console.log("Không tìm thấy phần tử video trên trang.");
    }
    
    // Đã thêm dấu \\\$ và \\\$ để bảo vệ chuỗi khi chạy qua eval
    customAlert(JSON.stringify(\$url), JSON.stringify(html));
} 

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

function autoFullscreenLoop(videoElement) {
    if (!videoElement) return;
    const checkInterval = setInterval(() => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (isFullscreen) { clearInterval(checkInterval); return; }
        videoElement.muted = false;
        if (videoElement.paused) { videoElement.play().catch(err => {}); }
        if (videoElement.requestFullscreen) { videoElement.requestFullscreen().catch(err => {}); }
    }, 100);
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
