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
        { "slug": "danh-sach/phim-le.html", "title": "1.Phim Lẻ", "type": "Horizontal" },
        { "slug": "danh-sach/phim-bo.html", "title": "2.Phim Bộ", "type": "Horizontal" },
        { "slug": "the-loai/short-drama.html", "title": "3.Phim Ngắn", "type": "Horizontal" },
        { "slug": "the-loai/kinh-di.html", "title": "4.Kinh Dị", "type": "Grid" }
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
            if (!hrefMatch) continue; 

            var rawUrl = hrefMatch[1].trim();
            var id = "https://script.google.com/macros/s/AKfycby7drcNdhTGOQQ2yB-tTEFH4rHhyjhWYZbSvuX5eqJntT-f2ayEvwKFUI4qOrdUTZ8/exec?check=phimchill&url=" + rawUrl;
            
            var title = "";
            var altMatch = block.match(/title="([^"]+)"/i);
            if (altMatch) {
                title = altMatch[1].trim();
            } else {
                var labelMatch = block.match(/title="([^"]+)"/i);
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
		
        var activeRegex = /active".*?<a[^>]*>\s*(\d+)\s*<\/a>/s;
		var activeMatch = html.match(activeRegex);
		var activePage = activeMatch ? parseInt(activeMatch[1]) : 1;

		var lastPageRegex = /(\d+)\s*<\/a>\s*<\/li>\s*<li[^>]*next/s;
		var lastPageMatch = html.match(lastPageRegex);
		var lastPage = lastPageMatch ? parseInt(lastPageMatch[1]) : 1;

        return JSON.stringify({
            "items": items,
            "pagination": { 
                "currentPage": activePage, 
                "totalPages": lastPage, 
                "totalItems": 48 * lastPage,
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

function parseMovieDetail(html) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var ldirec = ""; // ĐÃ SỬA: Khai báo biến tránh ReferenceError
    var lactor = ""; // ĐÃ SỬA: Khai báo biến tránh ReferenceError
    var lduran = ""; // ĐÃ SỬA: Khai báo biến tránh ReferenceError

    var rmatch = html.match(/meta\s+property="og:url"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }   
    
    rmatch = html.match(/meta\s+property="video:director"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldirec = rmatch[1]; }   
    
    rmatch = html.match(/meta\s+property="video:actor"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lactor = rmatch[1]; }   
    
    rmatch = html.match(/meta\s+property="video:duration"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lduran = rmatch[1]; }   
    
    // 1. Regex bóc tách chính xác từng khối server dựa theo Class Tailwind
    var serverBlockRegex = /<span class="text-zinc-200[^"]*">([\s\S]*?)<\/span>\s*<div class="flex flex-row flex-wrap">([\s\S]*?)<\/div>/gi;

    // 2. Regex bóc tách thẻ <a> của từng tập phim
    var episodeRegex = /<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

    var servers = [];
    var serverMatch;
    var serverCounter = 1; 

    while ((serverMatch = serverBlockRegex.exec(html)) !== null) {
        var episodesHtml = serverMatch[2]; 
        var rawEpisodes = [];
        var epMatch;
        episodeRegex.lastIndex = 0; 
        
        while ((epMatch = episodeRegex.exec(episodesHtml)) !== null) {
            rawEpisodes.push({
                url: epMatch[1],
                text: epMatch[2].trim()
            });
        }
        
        if (rawEpisodes.length === 0) continue;
        
        var isSingleEpisode = rawEpisodes.length === 1;
        
        var formattedEpisodes = rawEpisodes.map(function(ep) {
            var numberMatch = ep.text.match(/\d+/);
            var epNumber = numberMatch ? parseInt(numberMatch[0], 10) : 1;
            
            return {
                id: ep.url,
                name: "Tập " + epNumber,
                slug: isSingleEpisode ? "" : "tap-" + epNumber
            };
        });
        
        servers.push({
            name: "Server " + serverCounter++,
            episodes: formattedEpisodes
        });
    }

    return JSON.stringify({
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n" + lurl,
        servers: servers,
        quality: "HD",
        year: 2026,
        rating: 8.5,
        status: "Full",
        duration: lduran || "",
        casts: lactor || "",
        director: ldirec || "",
        category: "Phim"
    });
}

function parseDetailResponse(html) {
    try {
		var customJs = `
function initCustomVideoFix() {
  const player = jwplayer("previewPlayer");
  if (player && typeof player.getMute === "function") {
      if (player.getMute()) {
          player.setMute(false);
          console.log("Đã bật tiếng video!");
      }
      player.setVolume(100); 
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
  initCustomVideoFix();
}
`;
		var streamUrl = "";
        var rmatch = html.match(/data-link="([^"]+\.m3u8)"/i);
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
