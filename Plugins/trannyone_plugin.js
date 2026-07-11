var BASEURL = "https://www.tranny.one";
function getManifest() {
    return JSON.stringify({
        "id": "trannyone",          
        "name": "Tranny One",
        "description": "XXX dành cho người có sở thích đặc biệt",
        "version": "2.2",             
        "baseUrl": "https://www.tranny.one",
        "iconUrl": "https://cdn1.tranny.one/trannystatic/v30/common/lib-tr/img/logo-2x.png", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}
// https://www.tranny.one/recent/
// https://www.tranny.one/c2096/shemale-anal/?mix=true&pageId=4&_=1783573037242
function getHomeSections() {
    return JSON.stringify([
        { "slug": "/recent/", "title": "Hàng Mới", "type": "Grid" }
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
// =============================================================================
// https://www.tranny.one/c2096/shemale-anal/?mix=true&pageId=4
// https://www.tranny.one/search/blacked/?mix=true&pageId=5
// https://www.tranny.one/recent/?mix=true&pageId=2&_=1783573720196

function getUrlList(slug, filtersJson) {
    try {
        // 1. Kiểm tra nếu slug là link tuyệt đối (chứa http) và không có bộ lọc thì trả về luôn
        if (slug && slug.indexOf("http") > -1) {
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
        if (page > 1) {
            resultUrl += "?mix=true&pageId=" + page;
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


// --- KHU VỰC TEST CÁC TRƯỜNG HỢP ---
// https://www.tranny.one/c2096/shemale-anal/?mix=true&pageId=4
// https://www.tranny.one/search/blacked/?mix=true&pageId=5
// https://www.tranny.one/recent/?mix=true&pageId=2&_=1783573720196
//BASEURL = "https://www.tranny.one";
//filtersJson = '{"page":5,"category":[{"slug":"/c2096/shemale-anal/","name":"anal"}]}';
//filtersJson = '{"page":13}';
//console.log(getUrlList("/search/blacked/", filtersJson));



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
        var regexList = /class=["'][^"']+movie-[\s\S]*?href="([^"']+)"[\s\S]*?alt="([^"']+)"[\s\S]*?src="([^"']+)"/g;
        var matchList;
        // regexList.exec(html)
        while ((matchList = regexList.exec(html)) !== null) {
            if (matchList[1] && matchList[1].indexOf("http") > -1) {	
                var cleanThumb = matchList[3].replace(/&amp;/g, '&');
                var fullblock = matchList[0].match(/data-src=["']([^"']+)"/i);
                if(fullblock && fullblock[1]){
cleanThumb = fullblock[1];
                }
                
                items.push({
                    "id": matchList[1],
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
//var html = $("html")[0].outerHTML;
//var regexList = /class=["'][^"']+movie-[\s\S]*?href="([^"']+)"[\s\S]*?alt="([^"']+)"[\s\S]*?src="([^"']+)"/g;
//var math = html.match(regexList)
//math
//regexList.exec(html)
//JSON.parse(parseListResponse(html))


function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html,$url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var streamUrl = ""; // ĐÃ SỬA: Khai báo rõ ràng biến streamUrl tránh lỗi Global leak

    var rmatch = html.match(/link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1].replace("https://xhamster.com", BASEURL); }

    rmatch = html.match(/rel=["']preload["'][^>]+as=["']image["'][^>]+href=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/<title>([^<]+)/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+name="description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    
    var epi = [];
    var mathser = html.match(/videoContainer[^>]+data-low=["']([^"']+)["'][^>]+data-high=["']([^"']+)["']/i)
    if(mathser && mathser[1]){
         epi.push({ id: $url, name: "Xem Ngay", slug: "full" });
    }
    return JSON.stringify({
        id: $url,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n" + limg + "\r\n\r\n" + lurl+ "\r\n\r\n" + JSON.stringify(epi),
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
    });
}
//BASEURL = "https://www.justporn.com";
//var html = $("html")[0].outerHTML;
//var $url = "https://www.justporn.com/video/18058/hot-babe-remy-cheats-with-bbc/";
//JSON.parse(parseMovieDetail(html,$url))
// var flashvars = {

function parseDetailResponse(html, url) {
    try {
        var $link = [];
        var $stream = url;
        var mathser = html.match(/videoContainer[^>]+data-low=["']([^"']+)["'][^>]+data-high=["']([^"']+)["']/i)
        if (mathser && mathser[1]) {
            var $item = {"link":mathser[1],"name":"Độ Phân Giải Cao"}
            $stream = mathser[1];
            $link.push($item);
        }
        if (mathser && mathser[2]) {
            var $item = { "link":mathser[2], "name": "Độ Phân Giải Thấp" }
            $link.push($item);
        }
        var customjs = textJS($link);
        return JSON.stringify({
            "url": $stream,
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

function textJS($links) {
    // Sử dụng biến $url từ tham số truyền vào thay vì ghi cứng link
    return `
LINKVIDEO = ${JSON.stringify($links)}

SCRIPTURL = "https://script.google.com/macros/s/AKfycbwsvLFzWMdxvX9ZH-3wnP3GJzS58v0CtT_0mlEYeOz6cOsgen9IR3c6VPv_EssPXMFzwQ/exec?name=trannyone&type=js"; 
const style = document.createElement('style');
var customcss = 'body { background: black; overflow: hidden; }body * {background: black;display:none!important}';
style.innerHTML = customcss;
//document.head.appendChild(style);

/* Build Video Begin*/

    var DEVELOPE = false;

    function GetlinkVideo() {
        var playlist = scanSources();
        var stream1 = playlist.activeSrc || '';
        var stream2 = window.location.href;
        showToast("Đang khởi chạy trình phát tốt hơn.", 5000, true);
        if (LINKVIDEO && LINKVIDEO.length > 0) {
            var $server = [];
            for (var $j = 0; $j < LINKVIDEO.length; $j++) {
                var $line = LINKVIDEO[$j];
                var $link = $line.link;
                var $name = $line.name;
                var $item = {
                    label: $name,
                    src: $link,
                    type: "server"
                }
                $server.push($item);
                if ($j == 0) {
                    playlist.activeSrc = $link;
                }
            }
            playlist.servers = $server
        }
        buildVideo(stream1, stream2, playlist);
    }

    /*
    VideoPlayerAPI.addServer({ label: 'Server 2', src: '...' }) Thêm server vào cuối danh sách
    VideoPlayerAPI.addServerAt(0, { label: 'VIP', src: '...' }) Thêm server vào vị trí bất kỳ(ví dụ 0 là đầu tiên)
    VideoPlayerAPI.addEpisode({ label: 'Tập 5', src: '...' }) Thêm tập phim vào cuối
    VideoPlayerAPI.addEpisodeAt(2, { label: 'Tập 3', src: '...' }) Thêm tập vào vị trí chỉ định
    VideoPlayerAPI.removeServer('Server 2') Xóa server theo label
    VideoPlayerAPI.removeEpisode('Tập 5') Xóa tập theo label
    VideoPlayerAPI.clearServers() Xóa toàn bộ server
    VideoPlayerAPI.clearEpisodes() Xóa toàn bộ tập phim
    VideoPlayerAPI.getServers() / getEpisodes() Lấy mảng hiện tại
    VideoPlayerAPI.switchSource('https://...') Đổi nguồn phát ngay lập tức
    VideoPlayerAPI.refresh() Vẽ lại giao diện playlist

    */

    // ─── QUÉT NGUỒN PHÁT VÀ PLAYLIST TRƯỚC KHI XÓA DOM ───
    function scanSources() {
        var activeSrc = '';
        var servers = [];
        var episodes = [];
        var seen = new Set();

        // 1. Quét video, iframe, source
        var els = document.querySelectorAll('[class*="video"], [class*="player"], video, iframe');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var src = el.src || el.getAttribute('data-src') || '';
            if (!src) {
                var s = el.querySelector('source');
                if (s) src = s.src || s.getAttribute('src') || '';
            }
            if (src && (src.indexOf('.mp4') > -1 || src.indexOf('.m3u8') > -1 || src.indexOf(
                        'embed') >
                    -1)) {
                if (!activeSrc) activeSrc = src;
                if (!seen.has(src)) {
                    seen.add(src);
                    var lbl = 'Server ' + (servers.length + 1);
                    if (src.indexOf('embed') > -1) lbl = 'Nhúng ' + (servers.length + 1);
                    servers.push({
                        label: lbl,
                        src: src,
                        type: 'server'
                    });
                }
            }
        }

        // 2. Quét thêm các nút/data-link chuyển server
        var allLinks = document.querySelectorAll('a, button, [role="button"], [data-link]');
        for (var k = 0; k < allLinks.length; k++) {
            var el2 = allLinks[k];
            var href = el2.href || el2.getAttribute('href') || el2.getAttribute('data-src') || el2
                .getAttribute('data-link') || '';
            var txt = (el2.textContent || el2.innerText || '').trim();
            if (!href || href === '#' || href === window.location.href || seen.has(href)) continue;
            if (/(server|sv|nguồn|source|embed|link)/i.test(txt + ' ' + el2.className)) {
                if (href.indexOf('.mp4') > -1 || href.indexOf('.m3u8') > -1 || href.indexOf(
                        'embed') > -
                    1) {
                    seen.add(href);
                    servers.push({
                        label: txt || 'Server ' + (servers.length + 1),
                        src: href,
                        type: 'server'
                    });
                }
            }
        }

        // 3. Quét link tập phim
        var aTags = document.querySelectorAll('a');
        for (var j = 0; j < aTags.length; j++) {
            var a = aTags[j];
            var aHref = a.href || a.getAttribute('href');
            var aTxt = (a.textContent || a.innerText || '').trim();
            if (!aHref || aHref === '#' || aHref === window.location.href) continue;
            var isEpisode = false;
            if (/(tập|tap|ep|episode|chap|part)\s*(\d+|[ivx]+)/i.test(aTxt)) isEpisode = true;
            if (/(tập|tap|ep|episode|chap|part)[-\s]?(\d+|[ivx]+)/i.test(aHref)) isEpisode = true;
            if (a.className && /(^|\s)(ep|episode|tap|chapter|part|tapphim)(\d+|$)/i.test(a
                    .className))
                isEpisode = true;
            if (isEpisode) {
                episodes.push({
                    label: aTxt || 'Tập ' + (episodes.length + 1),
                    src: aHref,
                    type: 'episode'
                });
            }
        }

        return {
            activeSrc: activeSrc,
            servers: servers,
            episodes: episodes
        };
    }

    // ─── HÀM TOAST ĐƯỢC ĐƯA RA NGOÀI (Có thể gọi ở mọi nơi) ───
    function showToast(message, duration, check) {
        if (typeof duration === 'undefined') duration = 7000;
        if (typeof check === 'undefined') check = true;
        if (check === false) return;
        var container = document.getElementById('global-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'global-toast-container';
            container.style.cssText =
                'position:fixed;bottom:20px;right:20px;z-index:9999999;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(container);
        }
        var toastEl = document.createElement('div');
        toastEl.innerHTML = message;
        toastEl.style.cssText =
            'background:rgba(50,50,50,0.95);color:#fff;padding:12px 24px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.2);font-family:sans-serif;font-size:14px;min-width:200px;transition:all 0.3s ease;transform:translateX(120%);opacity:0;';
        container.appendChild(toastEl);
        setTimeout(function() {
            toastEl.style.transform = 'translateX(0)';
            toastEl.style.opacity = '1';
        }, 10);
        setTimeout(function() {
            toastEl.style.transform = 'translateX(120%)';
            toastEl.style.opacity = '0';
            setTimeout(function() {
                toastEl.remove();
                if (container.childElementCount === 0) container.remove();
            }, 300);
        }, duration);
    }

    function buildVideo(stream1, stream2, playlistData) {
        var container = document.createElement('div');
        container.id = 'custom-video-player';
        container.style.cssText =
            'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:Segoe UI,Roboto,sans-serif;user-select:none;-webkit-user-select:none;';

        var video = document.createElement('video');
        video.id = 'main-video';
        video.style.cssText =
            'width:100%;height:100%;object-fit:contain;cursor:pointer;background:#000;';
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.src = stream1;
        video.autoplay = true;
        video.muted = false;
        video.controls = false;

        var spinner = document.createElement('div');
        spinner.id = 'video-spinner';
        spinner.style.cssText =
            'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;border:4px solid rgba(255,255,255,0.3);border-top:4px solid #fff;border-radius:50%;animation:spin 1s linear infinite;z-index:10;pointer-events:none;';
        var spinStyle = document.createElement('style');
        spinStyle.textContent =
            '@keyframes spin{0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);}}';
        document.head.appendChild(spinStyle);

        var controls = document.createElement('div');
        controls.id = 'video-controls';
        controls.style.cssText =
            'position:absolute;bottom:0;left:0;width:100%;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:12px 16px 20px;box-sizing:border-box;transition:opacity 0.3s;opacity:0;z-index:20;';

        var progressWrap = document.createElement('div');
        progressWrap.style.cssText =
            'width:100%;height:6px;background:rgba(255,255,255,0.3);border-radius:3px;cursor:pointer;position:relative;margin-bottom:12px;';
        var progressBar = document.createElement('div');
        progressBar.style.cssText =
            'height:100%;background:#e74c3c;width:0%;border-radius:3px;position:relative;pointer-events:none;';
        var progressHandle = document.createElement('div');
        progressHandle.style.cssText =
            'position:absolute;right:-6px;top:-4px;width:14px;height:14px;background:#e74c3c;border-radius:50%;opacity:0;transition:opacity 0.2s;pointer-events:none;';
        progressBar.appendChild(progressHandle);
        progressWrap.appendChild(progressBar);
        progressWrap.onmouseenter = function() {
            progressHandle.style.opacity = '1';
        };
        progressWrap.onmouseleave = function() {
            progressHandle.style.opacity = '0';
        };

        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;align-items:center;gap:12px;';

        var btnPlay = createBtn('⏸', 'Phát / Tạm dừng');
        var btnMute = createBtn('🔊', 'Tắt / Bật âm lượng');
        var timeDisplay = document.createElement('span');
        timeDisplay.style.cssText = 'color:#fff;font-size:13px;min-width:100px;';
        timeDisplay.textContent = '0:00 / 0:00';
        var btnReload = createBtn('🔄', 'Tải lại nguồn video');
        var spacer = document.createElement('div');
        spacer.style.cssText = 'flex:1;';
        var speedIndicator = document.createElement('span');
        speedIndicator.style.cssText = 'color:#fff;font-size:12px;opacity:0.8;';
        speedIndicator.textContent = '1.0x';
        var btnFullscreen = createBtn('⛶', 'Toàn màn hình');
        var btnPlaylist = createBtn('☰', 'Danh sách phát / Server');

        btnRow.appendChild(btnPlay);
        btnRow.appendChild(btnMute);
        btnRow.appendChild(timeDisplay);
        btnRow.appendChild(spacer);
        btnRow.appendChild(speedIndicator);
        btnRow.appendChild(btnReload);
        btnRow.appendChild(btnFullscreen);

        controls.appendChild(progressWrap);
        controls.appendChild(btnRow);

        var bigPlayBtn = document.createElement('div');
        bigPlayBtn.id = 'big-play-btn';
        bigPlayBtn.textContent = '▶';
        bigPlayBtn.style.cssText =
            'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;background:rgba(0,0,0,0.6);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;font-size:36px;cursor:pointer;z-index:15;';

        var seekOverlay = document.createElement('div');
        seekOverlay.id = 'seek-overlay';
        seekOverlay.style.cssText =
            'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:#fff;padding:12px 24px;border-radius:8px;font-size:18px;font-weight:bold;pointer-events:none;opacity:0;transition:opacity 0.3s;z-index:30;';

        // Playlist Panel
        var playlistPanel = document.createElement('div');
        playlistPanel.id = 'playlist-panel';
        playlistPanel.style.cssText =
            'position:fixed;top:0;right:0;width:300px;max-width:80%;height:100%;background:rgba(15,15,15,0.97);z-index:40;transform:translateX(100%);transition:transform 0.25s ease;overflow-y:auto;padding:20px;box-sizing:border-box;color:#fff;font-family:Segoe UI,Roboto,sans-serif;';

        var plHeader = document.createElement('div');
        plHeader.style.cssText =
            'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.2);';
        plHeader.innerHTML = '<span style="font-size:16px;font-weight:bold;">📋 Playlist</span>';
        var plClose = document.createElement('button');
        plClose.textContent = '✕';
        plClose.style.cssText =
            'background:none;border:none;color:#fff;font-size:18px;cursor:pointer;';
        plClose.onclick = function(e) {
            if (e) e.stopPropagation();
            playlistPanel.style.transform = 'translateX(100%)';
        };
        plHeader.appendChild(plClose);
        playlistPanel.appendChild(plHeader);

        var plContent = document.createElement('div');
        plContent.id = 'playlist-content';
        playlistPanel.appendChild(plContent);

        // Playlist state & API
        var playlistState = {
            servers: (playlistData && playlistData.servers) ? playlistData.servers.slice() : [],
            episodes: (playlistData && playlistData.episodes) ? playlistData.episodes.slice() : []
        };

        function buildSection(title, items, onClick, parent) {
            if (!items || items.length === 0) return;
            var sec = document.createElement('div');
            sec.style.cssText = 'margin-bottom:20px;';
            var secTitle = document.createElement('div');
            secTitle.textContent = title;
            secTitle.style.cssText =
                'font-size:13px;text-transform:uppercase;opacity:0.6;margin-bottom:10px;';
            sec.appendChild(secTitle);
            for (var i = 0; i < items.length; i++) {
                (function(item) {
                    var btn = document.createElement('button');
                    btn.textContent = item.label;
                    btn.style.cssText =
                        'display:block;width:100%;text-align:left;padding:10px 12px;margin-bottom:6px;background:rgba(255,255,255,0.08);border:none;border-radius:6px;color:#fff;font-size:14px;cursor:pointer;transition:background 0.2s;';
                    btn.onmouseenter = function() {
                        btn.style.background = 'rgba(231,76,60,0.3)';
                    };
                    btn.onmouseleave = function() {
                        btn.style.background = 'rgba(255,255,255,0.08)';
                    };
                    btn.onclick = function(e) {
                        if (e) e.stopPropagation();
                        onClick(item);
                    };
                    sec.appendChild(btn);
                })(items[i]);
            }
            parent.appendChild(sec);
        }

        function renderPlaylist() {
            plContent.innerHTML = '';
            var hasAny = false;
            if (playlistState.servers.length > 1) {
                buildSection('🎥 Chuyển Server', playlistState.servers, function(item) {
                    switchSource(item.src);
                }, plContent);
                hasAny = true;
            }
            if (playlistState.episodes.length > 0) {
                buildSection('📁 Tập phim', playlistState.episodes, function(item) {
                    savePosition();
                    window.location.href = item.src;
                }, plContent);
                hasAny = true;
            }
            if (hasAny) {
                if (!btnPlaylist.parentNode) {
                    btnRow.appendChild(btnPlaylist);
                }
                if (!playlistPanel.parentNode) {
                    container.appendChild(playlistPanel);
                }
            } else {
                if (btnPlaylist.parentNode) {
                    btnPlaylist.parentNode.removeChild(btnPlaylist);
                }
            }
        }

        container.appendChild(video);
        container.appendChild(spinner);
        container.appendChild(bigPlayBtn);
        container.appendChild(seekOverlay);
        container.appendChild(controls);
        container.appendChild(playlistPanel);

        var htmlTAG = document.getElementsByTagName("html")[0];
        htmlTAG.innerHTML = '';
        document.body = document.createElement('body');
        document.body.appendChild(container);
        document.head.innerHTML =
            '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
        document.head.appendChild(spinStyle);
        document.title = 'Video Player';

        var isPlaying = false;
        var isMuted = false;
        var currentSpeed = 1.0;
        var controlsTimeout = null;
        var isDraggingProgress = false;
        var isDraggingVideo = false;

        // ─── LOCALSTORAGE: LƯU / KHÔI PHỤC VỊ TRÍ ───
        var cleanStreamURL = stream1.split('?')[0];
        var saveKey = 'videoPlayer_lastPos_' + encodeURIComponent(cleanStreamURL);
        var lastSaveTime = 0;

        function savePosition() {
            if (!video || video.ended || !video.currentTime || isNaN(video.currentTime)) return;
            var now = Date.now();
            if (now - lastSaveTime < 4000) return; // debounce 4 giây
            lastSaveTime = now;
            try {
                // Chỉ lưu nếu đã xem quá 5s và còn hơn 5s cuối
                if (video.currentTime > 5 && (!video.duration || isNaN(video.duration) || video
                        .currentTime < video.duration - 5)) {
                    localStorage.setItem(saveKey, JSON.stringify({
                        time: video.currentTime,
                        duration: video.duration || 0,
                        savedAt: now
                    }));
                }
            } catch (e) {}
        }

        function clearSavedPosition() {
            try {
                localStorage.removeItem(saveKey);
            } catch (e) {}
        }

        function restorePosition() {
            try {
                var saved = localStorage.getItem(saveKey);
                if (saved) {
                    var data = JSON.parse(saved);
                    // Chỉ cần có data.time > 5 là cho phép tua
                    if (data && data.time && data.time > 5) {
                        // Nếu video đã load được duration, check xem có phải đang ở 5s cuối không
                        if (video.duration && !isNaN(video.duration) && data.time >= video
                            .duration - 5) {
                            return false;
                        }
                        video.currentTime = data.time;
                        showToast('⏩ Đã tiếp tục phát từ ' + formatTime(data.time), 4000, true);
                        return true;
                    }
                }
            } catch (e) {}
            return false;
        }

        function switchSource(newSrc) {
            var wasPlaying = !video.paused;
            var prevTime = video.currentTime;
            stream1 = newSrc;
            saveKey = 'videoPlayer_lastPos_' + encodeURIComponent(stream1);
            video.src = newSrc;
            video.load();
            spinner.style.display = 'block';
            video.onloadeddata = function() {
                spinner.style.display = 'none';
                if (!restorePosition() && prevTime > 0) {
                    video.currentTime = prevTime;
                }
                if (wasPlaying) video.play();
                showToast('Đã chuyển nguồn phát');
            };
            video.onerror = function() {
                spinner.style.display = 'none';
                showToast('Không thể phát nguồn này!');
            };
            playlistPanel.style.transform = 'translateX(100%)';
        }

        function createBtn(icon, title) {
            var btn = document.createElement('button');
            btn.textContent = icon;
            btn.title = title;
            btn.style.cssText =
                'background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:4px 8px;border-radius:4px;transition:background 0.2s;outline:none;';
            btn.onmouseenter = function() {
                btn.style.background = 'rgba(255,255,255,0.2)';
            };
            btn.onmouseleave = function() {
                btn.style.background = 'none';
            };
            return btn;
        }

        function showSeekOverlay(text) {
            seekOverlay.textContent = text;
            seekOverlay.style.opacity = '1';
            clearTimeout(seekOverlay._timer);
            seekOverlay._timer = setTimeout(function() {
                seekOverlay.style.opacity = '0';
            }, 800);
        }

        function formatTime(sec) {
            if (!sec || isNaN(sec)) return '0:00';
            var m = Math.floor(sec / 60);
            var s = Math.floor(sec % 60);
            return m + ':' + (s < 10 ? '0' + s : s);
        }

        function updateProgress() {
            if (video.duration && !isNaN(video.duration) && !isDraggingProgress) {
                var pct = (video.currentTime / video.duration) * 100;
                progressBar.style.width = pct + '%';
            }
            timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video
                .duration);
        }

        function seekVideo(seconds) {
            var newTime = video.currentTime + seconds;
            if (newTime < 0) newTime = 0;
            if (video.duration && !isNaN(video.duration) && newTime > video.duration) newTime =
                video
                .duration;
            video.currentTime = newTime;
            showSeekOverlay((seconds > 0 ? '+' : '') + seconds + 's');
        }

        function togglePlay() {
            if (video.paused) {
                video.play().then(function() {
                    isPlaying = true;
                    btnPlay.textContent = '⏸';
                    bigPlayBtn.style.display = 'none';
                    spinner.style.display = 'none';
                }).catch(function(e) {
                    console.warn('Autoplay bị chặn:', e);
                    video.muted = true;
                    video.play().then(function() {
                        isMuted = true;
                        btnMute.textContent = '🔇';
                        isPlaying = true;
                        btnPlay.textContent = '⏸';
                        bigPlayBtn.style.display = 'none';
                        spinner.style.display = 'none';
                    });
                });
            } else {
                video.pause();
                isPlaying = false;
                btnPlay.textContent = '▶';
                bigPlayBtn.style.display = 'flex';
            }
        }

        function toggleMute() {
            video.muted = !video.muted;
            isMuted = video.muted;
            btnMute.textContent = isMuted ? '🔇' : '🔊';
            showToast(isMuted ? 'Đã tắt tiếng' : 'Đã bật tiếng');
        }

        function reloadVideo() {
            spinner.style.display = 'block';
            var currentTime = video.currentTime;
            var wasPlaying = !video.paused;
            video.src = stream1 + (stream1.indexOf('?') > -1 ? '&' : '?') + '_reload=' + Date.now();
            video.load();
            video.onloadeddata = function() {
                spinner.style.display = 'none';
                video.currentTime = currentTime;
                restorePosition();
                if (wasPlaying) video.play();
                showToast('Đã tải lại nguồn video');
            };
            video.onerror = function() {
                spinner.style.display = 'none';
                if (stream2 && stream2 !== stream1) {
                    showToast('Nguồn 1 lỗi, thử nguồn dự phòng...');
                    stream1 = stream2;
                    saveKey = 'videoPlayer_lastPos_' + encodeURIComponent(stream1);
                    video.src = stream1;
                    video.load();
                } else {
                    showToast('Lỗi tải video! Kiểm tra nguồn.');
                }
            };
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(function() {});
            } else {
                document.exitFullscreen().catch(function() {});
            }
        }

        function showControls() {
            controls.style.opacity = '1';
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(function() {
                if (!isDraggingProgress) controls.style.opacity = '0';
            }, 3000);
        }

        video.addEventListener('loadeddata', function() {
            spinner.style.display = 'none';
            updateProgress();
            if (isMuted && video.muted) {
                video.muted = false;
                isMuted = false;
                btnMute.textContent = '🔊';
            }
            // Khôi phục vị trí đã lưu
            restorePosition();
        });

        // Giữ nguyên cụm loadeddata cũ để ẩn spinner
        video.addEventListener('loadeddata', function() {
            spinner.style.display = 'none';
            updateProgress();
            if (isMuted && video.muted) {
                video.muted = false;
                isMuted = false;
                btnMute.textContent = '🔊';
            }
        });

        // THÊM SỰ KIỆN NÀY ĐỂ CHUYÊN LÀM NHIỆM VỤ TUA VIDEO
        video.addEventListener('loadedmetadata', function() {
            restorePosition();
        });

        video.addEventListener('waiting', function() {
            spinner.style.display = 'block';
        });
        video.addEventListener('playing', function() {
            spinner.style.display = 'none';
            bigPlayBtn.style.display = 'none';
        });
        video.addEventListener('error', function() {
            spinner.style.display = 'none';
            showToast('Lỗi phát video! Nhấn 🔄 để tải lại.');
            btnPlay.textContent = '▶';
            bigPlayBtn.style.display = 'flex';
        });
        video.addEventListener('timeupdate', function() {
            updateProgress();
            savePosition();
        });
        video.addEventListener('ended', function() {
            btnPlay.textContent = '▶';
            bigPlayBtn.style.display = 'flex';
            isPlaying = false;
            clearSavedPosition();
        });

        video.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isDraggingVideo) {
                isDraggingVideo = false;
                return;
            }
            var rect = video.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var width = rect.width;
            if (x < width * 0.3) {
                seekVideo(-10);
            } else if (x > width * 0.7) {
                seekVideo(10);
            } else {
                togglePlay();
            }
        });

        video.addEventListener('volumechange', function() {
            btnMute.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
        });

        btnPlay.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePlay();
        });
        btnMute.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMute();
        });
        btnReload.addEventListener('click', function(e) {
            e.stopPropagation();
            reloadVideo();
        });
        btnFullscreen.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFullscreen();
        });
        btnPlaylist.addEventListener('click', function(e) {
            e.stopPropagation();
            playlistPanel.style.transform = 'translateX(0)';
        });

        progressWrap.addEventListener('click', function(e) {
            e.stopPropagation();
            var rect = progressWrap.getBoundingClientRect();
            var pct = (e.clientX - rect.left) / rect.width;
            if (video.duration && !isNaN(video.duration)) {
                video.currentTime = pct * video.duration;
            }
            updateProgress();
        });
        progressWrap.addEventListener('mousedown', function(e) {
            isDraggingProgress = true;
            showControls();
        });
        document.addEventListener('mousemove', function(e) {
            if (isDraggingProgress && video.duration && !isNaN(video.duration)) {
                var rect = progressWrap.getBoundingClientRect();
                var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                progressBar.style.width = (pct * 100) + '%';
                video.currentTime = pct * video.duration;
                updateProgress();
            }
        });
        document.addEventListener('mouseup', function() {
            isDraggingProgress = false;
        });

        container.addEventListener('mousemove', showControls);
        container.addEventListener('click', function() {
            showControls();
        });
        bigPlayBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePlay();
        });

        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            showControls();
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    e.shiftKey ? seekVideo(-30) : (e.ctrlKey || e.altKey) ? seekVideo(-5) :
                        seekVideo(-
                            10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    e.shiftKey ? seekVideo(30) : (e.ctrlKey || e.altKey) ? seekVideo(5) :
                        seekVideo(10);
                    break;
                case ' ':
                case 'k':
                case 'K':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    video.volume = Math.min(1, video.volume + 0.1);
                    showToast('Âm lượng: ' + Math.round(video.volume * 100) + '%');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    video.volume = Math.max(0, video.volume - 0.1);
                    showToast('Âm lượng: ' + Math.round(video.volume * 100) + '%');
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    reloadVideo();
                    break;
                case 'Home':
                    e.preventDefault();
                    video.currentTime = 0;
                    showToast('Về đầu video');
                    break;
                case 'End':
                    e.preventDefault();
                    if (video.duration && !isNaN(video.duration)) video.currentTime = video
                        .duration - 1;
                    break;
                case '>':
                case '.':
                    e.preventDefault();
                    currentSpeed = Math.min(4, currentSpeed + 0.25);
                    video.playbackRate = currentSpeed;
                    speedIndicator.textContent = currentSpeed.toFixed(1) + 'x';
                    showToast('Tốc độ: ' + currentSpeed.toFixed(1) + 'x');
                    break;
                case '<':
                case ',':
                    e.preventDefault();
                    currentSpeed = Math.max(0.25, currentSpeed - 0.25);
                    video.playbackRate = currentSpeed;
                    speedIndicator.textContent = currentSpeed.toFixed(1) + 'x';
                    showToast('Tốc độ: ' + currentSpeed.toFixed(1) + 'x');
                    break;
                case '0':
                    e.preventDefault();
                    video.currentTime = 0;
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    e.preventDefault();
                    if (video.duration && !isNaN(video.duration)) {
                        video.currentTime = video.duration * (parseInt(e.key) / 10);
                    }
                    break;
            }
        });

        var touchStartX = 0;
        var touchStartY = 0;
        var touchStartTime = 0;
        var isSwiping = false;

        container.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isSwiping = false;
        }, {
            passive: true
        });

        container.addEventListener('touchmove', function(e) {
            if (e.touches.length !== 1) return;
            var dx = e.touches[0].clientX - touchStartX;
            var dy = e.touches[0].clientY - touchStartY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                isSwiping = true;
                var seekSec = Math.round(dx / 15);
                if (Math.abs(seekSec) >= 1) {
                    seekVideo(seekSec);
                    touchStartX = e.touches[0].clientX;
                }
            }
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 20) {
                isSwiping = true;
                var screenWidth = window.innerWidth;
                var isRightSide = touchStartX > screenWidth / 2;
                if (isRightSide) {
                    var volChange = -dy / 200;
                    video.volume = Math.max(0, Math.min(1, video.volume + volChange));
                    showToast('🔊 ' + Math.round(video.volume * 100) + '%');
                    touchStartY = e.touches[0].clientY;
                }
            }
        }, {
            passive: true
        });

        var regionStartX = 0;
        var regionOverlay = null;

        video.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            isDraggingVideo = false;
            regionStartX = e.clientX;
            regionOverlay = document.createElement('div');
            regionOverlay.style.cssText =
                'position:fixed;top:0;height:100vh;background:rgba(231,76,60,0.3);pointer-events:none;z-index:25;';
            document.body.appendChild(regionOverlay);
        });

        document.addEventListener('mousemove', function(e) {
            if (!regionOverlay) return;
            isDraggingVideo = true;
            var left = Math.min(regionStartX, e.clientX);
            var width = Math.abs(e.clientX - regionStartX);
            regionOverlay.style.left = left + 'px';
            regionOverlay.style.width = width + 'px';
        });

        document.addEventListener('mouseup', function(e) {
            if (!regionOverlay) return;
            var endX = e.clientX;
            var deltaX = endX - regionStartX;
            var minDrag = 50;
            if (Math.abs(deltaX) > minDrag && video.duration && !isNaN(video.duration)) {
                var screenWidth = window.innerWidth;
                var startPct = Math.min(regionStartX, endX) / screenWidth;
                var endPct = Math.max(regionStartX, endX) / screenWidth;
                var startTime = startPct * video.duration;
                var endTime = endPct * video.duration;
                if (deltaX > 0) {
                    video.currentTime = startTime;
                    showToast('▶ Phát vùng ' + formatTime(startTime) + ' - ' + formatTime(
                        endTime));
                } else {
                    video.currentTime = startTime;
                    showToast('⏩ Tua đến ' + formatTime(startTime));
                }
                if (video.paused) togglePlay();
            }
            regionOverlay.remove();
            regionOverlay = null;
        });

        video.play().then(function() {
            spinner.style.display = 'none';
            btnPlay.textContent = '⏸';
            isPlaying = true;
            bigPlayBtn.style.display = 'none';
            console.log('Video autoplay thành công với tiếng');
            showToast('Đã phát video thành công. Xem vui nhé friend', 5000, true);
        }).catch(function(err) {
            console.log('Autoplay bị chặn, thử muted...');
            video.muted = true;
            isMuted = true;
            btnMute.textContent = '🔇';
            video.play().then(function() {
                spinner.style.display = 'none';
                btnPlay.textContent = '⏸';
                isPlaying = true;
                bigPlayBtn.style.display = 'none';
                showToast('Đã tự phát (chưa bật tiếng) - Nhấn M để bật tiếng');
            }).catch(function(err2) {
                spinner.style.display = 'none';
                bigPlayBtn.style.display = 'flex';
                showToast('Không thể phát video: ', 3000, DEVELOPE);
            });
        });

        // ─── EXPOSE API CHO PLAYLIST CUSTOM ───
        renderPlaylist();

        window.VideoPlayerAPI = {
            addServer: function(item) {
                if (!item || !item.src) return;
                playlistState.servers.push(item);
                renderPlaylist();
                showToast('Đã thêm server: ' + (item.label || item.src));
            },
            addServerAt: function(index, item) {
                if (!item || !item.src) return;
                playlistState.servers.splice(index, 0, item);
                renderPlaylist();
                showToast('Đã thêm server [' + index + ']: ' + (item.label || item.src));
            },
            addEpisode: function(item) {
                if (!item || !item.src) return;
                playlistState.episodes.push(item);
                renderPlaylist();
                showToast('Đã thêm tập: ' + (item.label || item.src));
            },
            addEpisodeAt: function(index, item) {
                if (!item || !item.src) return;
                playlistState.episodes.splice(index, 0, item);
                renderPlaylist();
                showToast('Đã thêm tập [' + index + ']: ' + (item.label || item.src));
            },
            removeServer: function(label) {
                playlistState.servers = playlistState.servers.filter(function(s) {
                    return s.label !== label;
                });
                renderPlaylist();
            },
            removeEpisode: function(label) {
                playlistState.episodes = playlistState.episodes.filter(function(s) {
                    return s.label !== label;
                });
                renderPlaylist();
            },
            clearServers: function() {
                playlistState.servers = [];
                renderPlaylist();
            },
            clearEpisodes: function() {
                playlistState.episodes = [];
                renderPlaylist();
            },
            getServers: function() {
                return playlistState.servers.slice();
            },
            getEpisodes: function() {
                return playlistState.episodes.slice();
            },
            switchSource: function(src) {
                switchSource(src);
            },
            refresh: function() {
                renderPlaylist();
            }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', GetlinkVideo);
    } else {
        GetlinkVideo();
    }


/* Build Video End */

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

function parseCategoriesResponse(apiResponseJson) {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

function getLISTmenu() {
    return `
/c2047/asian-ladyboys/@@Asian Ladyboy
/c2096/shemale-anal/@@Anal
/c2061/asian/@@Asian
/c2094/black/@@Black
/c2106/amateur-trans/@@Amateur
/c2100/hardcore/@@Hardcore
/c2052/big-tits/@@Big Tits
/c2081/big-cock/@@Big Cock
/c2381/sissy-femboy-porn/@@Sissy
/c2097/tits/@@Tits
/c2062/threesome/@@Threesome
/c2060/interracial/@@Interracial
/c2063/masturbation/@@Masturbation
/c2050/stockings/@@Stockings
/c2064/bareback/@@Bareback
/c2059/lingerie/@@Lingerie
/c2147/crossdressing/@@Crossdressing
/c2199/cum-in-mouth/@@Cum In Mouth
/c2095/creampie/@@Creampie
/c2042/shemales-fuck-guys/@@Shemales with Guys
/c2048/shemales - fuck - girls / @ @Shemales with Girls /
    c2049 / shemales - fuck - shemales / @ @Shemale with Shemale
/c2110/ebony/@@Ebony
/c2103/bdsm/@@BDSM
/c2067/small-tits/@@Small Tits
/c2115/homemade/@@Homemade
/c2043/black-trannies/@@Black Trannies
/c2123/mature/@@Mature
/c2099/teen/@@Teen(18 + )
/c2201/big-ass/@@Big Ass
/c2105/japanese/@@Japanese
/c2085/tattoo/@@Tattoo
/c2157/futanari/@@Futanari
/c2101/milf/@@Milf
/c2054/shemale-domination/@@Shemale Domination
/c2046/gorgeous-shemales/@@Gorgeous Shemales
/c2198/cum-compilation/@@Cum Compilation
/c2104/riding/@@Riding
/c2133/blowjobs/@@Blowjobs
/c2077/toys/@@Toys
/c2058/outdoor/@@Outdoor
/c2088/big-dick/@@Big Dick
/c2053/webcams/@@Webcams
/c2129/fetish/@@Fetish
/c2300/babes/@@Babes
/c2044/group-sex/@@Group Sex
/c2080/massage/@@Massage
/c2068/blondes/@@Blondes
/c2203/brazilian/@@Brazilian
/c2253/shemale-compilations/@@Shemale Compilations
/c2057/teen-trannies/@@Teen Trannies(18 + )
/c2078/skinny/@@Skinny
/c2200/foot-fetish/@@Foot Fetish
/c2213/doggy-style/@@Doggy Style
/c2194/indian/@@Indian
/c2171/bedroom/@@Bedroom
/c2122/chubby/@@Chubby
/c2091/public/@@Public
/c2086/double-penetration/@@Double Penetration
/c2168/kissing/@@Kissing
/c2118/cumshots/@@Cumshots
/c2208/gang-bang/@@Gang Bang
/c2045/latina-trannies/@@Latina Trannies
/c2074/latex/@@Latex
/c2260/thai/@@Thai
/c2117/pussy/@@Pussy
/c2143/pissing/@@Pissing
/c2120/white/@@White
/c2167/vintage/@@Vintage
/c2189/femdom/@@Femdom
/c2223/ass-to-mouth/@@Ass To Mouth
/c2232/3 d-futanari/@@3D Futanari
/c2318/cum-swallowing/@@Cum Swallowing
/c2193/chinese/@@Chinese
/c2155/european/@@European
/c2121/pornstars/@@Pornstars
/c2246/pussy-licking/@@Pussy Licking
/c2132/russian/@@Russian
/c2140/foursome/@@Foursome
/c2144/bondage/@@Bondage
/c2072/fishnet/@@Fishnet
/c2237/cosplay/@@Cosplay
/c2163/german/@@German
/c2153/fisting/@@Fisting
/c2314/high-heels/@@High Heels
/c2145/anime/@@Anime
/c2146/hentai/@@Hentai
/c2212/solo-girls/@@Solo Girls
/c2179/colombian/@@Colombian
/c2188/bukkake/@@Bukkake
/c2127/fingering/@@Fingering
/c2112/party/@@Party
/c2102/petite/@@Petite
/c2070/uniform/@@Uniform
/c2291/granny/@@Granny
/c2268/face-sitting/@@Face Sitting
/c2149/kitchen/@@Kitchen
/c2270/cuckold/@@Cuckold
/c2107/pantyhose/@@Pantyhose
/c2134/british/@@British
/c2209/brunettes/@@Brunettes
/c2051/office/@@Office
/c2230/panties/@@Panties
/c2202/ass-licking/@@Ass Licking
/c2073/bathroom/@@Bathroom
/c2154/smoking/@@Smoking
/c2087/glasses/@@Glasses
/c2137/brazil/@@Brazil
/c2329/humiliation/@@Humiliation
/c2224/facials/@@Facials
/c2172/beach/@@Beach
/c2098/babysitter/@@Babysitter
/c2113/french/@@French
/c2247/piercing/@@Piercing
/c2225/redheads/@@Redheads
/c2191/dildos/@@Dildos
/c2114/shower/@@Shower
/c2084/sex-orgy/@@Sex Orgy
/c2176/italian/@@Italian
/c2190/handjobs/@@Handjobs
/c2341/mistress/@@Mistress
/c2185/latinas/@@Latinas
/c2187/sport/@@Sport
/c2119/bikini/@@Bikini
/c2214/nipples/@@Nipples
/c2205/prison/@@Prison
/c2065/tanned/@@Tanned
/c2166/reality/@@Reality
/c2344/mexican/@@Mexican
/c2207/deep-throat/@@Deep Throat
/c2306/funny/@@Funny
/c2128/school/@@School
/c2195/casting/@@Casting
/c2296/glamour/@@Glamour
/c2076/nurses/@@Nurses
/c2226/pick-up/@@Pick up
/c2196/nylon/@@Nylon
/c2164/oiled/@@Oiled
/c2108/boots/@@Boots
/c2055/strapon/@@Strapon
/c2243/shemale-pmv/@@Shemale PMV
/c2382/cougars/@@Cougars
/c2160/gagging/@@Gagging
/c2159/spanish/@@Spanish
/c2340/medical/@@Medical
/c2204/czech/@@Czech
/c2175/footjob/@@Footjob
/c2227/shorts/@@Shorts
/c2220/assholes/@@Assholes
/c2126/girlfriends/@@Girlfriends
/c2289/korean/@@Korean
/c2258/cum-on-tits/@@Cum on Tits
/c2261/punishment/@@Punishment
/c2197/fucking-machines/@@Fucking Machines
/c2238/shemale-cartoons/@@Shemale Cartoons
/c2342/prostate/@@Prostate
/c2335/pregnant/@@Pregnant
/c2083/christmas/@@Christmas
/c2333/air-hostesses/@@Air Hostesses
/c2165/toilet/@@Toilet
/c2234/maids/@@Maids
/c2093/glory-hole/@@Glory Hole
/c2082/xxl-dildos/@@XXL dildos
/c2345/braces/@@Braces
/c2323/upskirt/@@Upskirt
/c2148/club/@@Club
/c2357/canadian/@@Canadian
/c2066/bodystocking/@@BodyStocking
/c2262/forest/@@Forest
/c2150/spanking/@@Spanking
/c2152/butts/@@Butts
/c2321/amateur-bdsm/@@Amateur BDSM
/c2178/cheerleaders/@@Cheerleaders
/c2174/whores/@@Whores
/c2273/closeups/@@Closeups
/c2229/gonzo/@@Gonzo
/c2228/locker-room/@@Locker Room
/c2183/striptease/@@Striptease
/c2249/3 d-comics/@@3D Comics
/c2216/cock-selfies/@@Cock selfies
/c2390/ashemaletube/@@Ashemaletube
/c2397/shemalez/@@Shemalez
/c2391/tgtube/@@Tgtube
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