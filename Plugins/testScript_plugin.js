// ========================================================
// PHIM CHILL VAAPP PLUGIN (AUTO DOUBLE-LOAD SYSTEM)
// ========================================================

BASEURL = "https://phimchillhdv.im";
// Sử dụng Apps Script làm proxy để fetch HTML trang xem phim ngầm
BASESCRIPT = "https://script.google.com/macros/s/AKfycby7drcNdhTGOQQ2yB-tTEFH4rHhyjhWYZbSvuX5eqJntT-f2ayEvwKFUI4qOrdUTZ8/exec?check=phimchill&url=";

function getManifest() {
    return JSON.stringify({
        "id": "phimchill",          
        "name": "Phim Chill",
        "description": "Phim online",
        "version": "1.3.0",             
        "baseUrl": "https://phimchillhdv.im",
        "iconUrl": "https://raw.githubusercontent.com/alokillgtv-gif/VAXAPPSCRIPT/main/img/motherless_logo.jpgphimchill.ico", 
        "isEnabled": true,
        "isAdult": true,
        "type": "MOVIE",
        "playerType": "embedtoexoplay"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "danh-sach/phim-moi.html", "title": "Phim Mới", "type": "Grid" }
    ]);
}

function getPrimaryCategories() {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

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
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        if (filters.category) {
            return BASEURL + "/" + filters.category + "?page=" + page;
        }
        if (page > 1) {
            return BASEURL + "/" + slug + "?page=" + page;
        }
        return BASEURL + "/" + slug;
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/?search=" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    if (!slug) return "";
    
    // Nếu là click phát tập phim thật (có đầu play-)
    if (slug.indexOf("play-") === 0) {
        var playUrl = slug.replace("play-", "");
        if (playUrl.indexOf('http') !== 0) playUrl = BASEURL + playUrl;
        return playUrl;
    }

    if (slug.indexOf('http') === 0) return slug;
    return BASEURL + slug;
}

function getUrlCategories() { return BASEURL; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// HELPER: TẢI TRANG NGẦM (TẢI LẦN 2)
// =============================================================================
function fetchPageHtmlSync(targetUrl) {
    try {
        // Sử dụng Google Apps Script Proxy để tránh lỗi CORS trong môi trường App
        var requestUrl = BASESCRIPT + encodeURIComponent(targetUrl);
        
        // Khởi tạo một request đồng bộ (Synchronous XMLHttpRequest)
        var xhr = new XMLHttpRequest();
        xhr.open("GET", requestUrl, false); // false = Đồng bộ, bắt JS đợi cho đến khi tải xong
        xhr.send(null);
        
        if (xhr.status === 200) {
            return xhr.responseText;
        }
    } catch (e) {
        // Fallback: Nếu không gọi được bằng BASESCRIPT, gọi trực tiếp targetUrl
        try {
            var xhr2 = new XMLHttpRequest();
            xhr2.open("GET", targetUrl, false);
            xhr2.send(null);
            if (xhr2.status === 200) return xhr2.responseText;
        } catch (err) {}
    }
    return "";
}

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
            var id = rawUrl;
            
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
            var posterUrl = srcMatch ? srcMatch[1].trim() : "";
            if (posterUrl.indexOf('/') === 0 && posterUrl.indexOf('//') !== 0) {
    			posterUrl = BASEURL + posterUrl;
			} 
			else if (posterUrl.indexOf('http') !== 0 && posterUrl.indexOf('//') !== 0) {
    			posterUrl = BASEURL + "/" + posterUrl;
			}
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

function parseMovieDetail(html, url) {
    // Nếu đang trong luồng phát video, chặn chạy lại parser
    if (url && url.includes("play-")) {
        return JSON.stringify({ id: url, servers: [] });
    }

    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var ldirec = ""; 
    var lactor = ""; 
    var lduran = ""; 

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

    var workingHtml = html;
    
    // Kiểm tra xem trang hiện tại đã là trang xem phim (đã có danh sách tập) hay chưa
    var hasEpisodesHtml = html.indexOf('class="flex flex-row flex-wrap"') !== -1;

    // CHIẾN THUẬT AUTO DOUBLE-LOAD:
    // Nếu chưa có HTML danh sách tập, ta tiến hành "Tải lần 2" tự động ngay tại đây
    if (!hasEpisodesHtml) {
        var playBtnMatch = html.match(/href="([^"]+\/tap-[^"]+)"/i) || html.match(/href="([^"]+)"[^>]*>Xem phim<\/a>/i);
        if (playBtnMatch) {
            var playPageUrl = playBtnMatch[1];
            if (playPageUrl.indexOf('http') !== 0) {
                playPageUrl = BASEURL + (playPageUrl.indexOf('/') === 0 ? "" : "/") + playPageUrl;
            }
            
            // Tiến hành tải ngầm lần 2 lấy HTML của trang xem phim
            var secondLoadHtml = fetchPageHtmlSync(playPageUrl);
            if (secondLoadHtml && secondLoadHtml.indexOf('class="flex flex-row flex-wrap"') !== -1) {
                // Đã lấy được HTML trang xem phim thành công, gán đè vào workingHtml để bóc tách tập phim
                workingHtml = secondLoadHtml;
            }
        }
    }

    // Bóc tách danh sách tập từ HTML (Lúc này chắc chắn là HTML của trang xem phim)
    var servers = [];
    var serverBlockRegex = /<span class="text-zinc-200[^"]*">([\s\S]*?)<\/span>\s*<div class="flex flex-row flex-wrap">([\s\S]*?)<\/div>/gi;
    var episodeRegex = /<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    var serverCounter = 1; 
    
    while ((serverMatch = serverBlockRegex.exec(workingHtml)) !== null) {
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
                id: "play-" + ep.url, 
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
        id: url,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes,
        servers: servers,
        quality: "HD",
        year: 2026,
        rating: 8.5,
        status: servers.length > 0 ? "Đã cập nhật tập" : "Đang cập nhật...",
        duration: lduran || "",
        casts: lactor || "",
        director: ldirec || "",
        category: "Phim"
    });
}

function parseDetailResponse(html, url) {
    try {
        var customJs = CustomjQ(html, url);
        var streamUrl = "";
        
        var rmatch = html.match(/chooseStreamingServer[\s\S]*?data-link="([\s\S]*?)"/i);
        if (rmatch && rmatch[1]) { 
            streamUrl = rmatch[1]; 
        } else {
            streamUrl = url;
        }

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

function parseCategoriesResponse(apiResponseJson) {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

function getLISTmenu() {
    return `
danh-sach/phim-le.html@@Phim Lẻ
danh-sach/phim-bo.html@@Phim Bộ
the-loai/short-drama.html@@Phim Ngắn
the-loai/tinh-cam.html@@Tình Cảm
the-loai/am-nhac.html@@Âm Nhạc
the-loai/tam-ly.html@@Tâm Lý
the-loai/kinh-di.html@@Kinh Dị
the-loai/tai-lieu.html@@Tài Liệu
the-loai/tv-shows.html@@TV Shows
the-loai/hanh-dong.html@@Hành Động
the-loai/vien-tuong.html@@Viễn Tưởng
the-loai/than-thoai.html@@Thần Thoại
the-loai/vo-thuat.html@@Võ Thuật
the-loai/chien-tranh.html@@Chiến Tranh
the-loai/chinh-kich.html@@Chính Kịch
the-loai/phieu-luu.html@@Phiêu Lưu
the-loai/hai-huoc.html@@Hài Hước
the-loai/co-trang.html@@Cổ Trang
the-loai/gia-dinh.html@@Gia Đình
the-loai/hoc-duong.html@@Học Đường
the-loai/hinh-su.html@@Hình Sự
the-loai/bi-an.html@@Bí Ẩn
the-loai/phim-18.html@@Phim 18+
`
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

function CustomjQ(html, url) {
    var $custom1 = `
    function runBegin(){
        //customAlert("2412421", "Alo alo");
    }
    `;
    var $custom2 = `
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
