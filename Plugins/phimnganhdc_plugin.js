BASEURL = "https://phimnganhdc.com";
// https://www.xxxfiles.com/favicon-32x32.png
function getManifest() {
    return JSON.stringify({
        "id": "phimnganhdc",
        "name": "Phim Ngắn HDC",
        "description": "Phim ngắn trung quốc.",
        "version": "1.0",
        "BASEURL": "https://phimnganhdc.com",
        "iconUrl": "https://phimnganhdc.com/storage/files/logo-phimnganhdc.png",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}


// https://phimnganhdc.com/danh-sach/phim-hoan-thanh
// https://phimnganhdc.com/danh-sach/top-phim-ngay
// https://phimnganhdc.com/the-loai/phim-ngan
function getHomeSections() {
    var listurl = `
/danh-sach/phim-hoan-thanh@@Phim Đã Full@@false
/danh-sach/top-phim-ngay@@Top Trong Ngày@@false
/the-loai/phim-ngan@@Phim Mới@@true
`;
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
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

function getUrlList(slug, filtersJson) {
    try {
        // 1. Kiểm tra nếu slug là link tuyệt đối (chứa http) và không có bộ lọc thì trả về luôn
        if (slug && slug.indexOf("http") > -1 || slug.indexOf("search") > -1) {
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
            resultUrl += "/page=" + page;
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
// https://phimnganhdc.com/the-loai/phim-ngan?page=5
// https://phimnganhdc.com/the-loai/phim-ngan?page=5
// https://phimnganhdc.com/?search=m%E1%BB%B9+nh%C3%A2n
//var BASEURL = "https://phimnganhdc.com";
// JSON lỗi cú pháp (thiếu nháy kép) của bạn
//var filtersJsonNoCat = '{page:11,category:[{"slug":"/the-loai/phim-ngan","name":"Thiếu niên"}]}'; 
//var filtersJsonNoCat = '{page:22}';
//console.log(getUrlList("", filtersJsonNoCat));


function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/?search=" + encodeURIComponent(keyword);
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

//BASEURL = "https://motherless.xxx";
//var html = document.getElementsByTagName("html")[0].outerHTML;
//JSON.parse(parseListResponse(html));

function parseListResponse(html, $url) {
    try {``
        var items = [];
        
        _$(html).find(".item").each(function() {
            var href = this.find("a").attr("href");
            var title = this.find(".img-film").attr("title");
            var src = this.find(".img-film").attr("src");
            
            if (href && href.indexOf("http") > -1) {
                var cleanThumb = src.replace(/&amp;/g, '&');
                
                items.push({
                    "id": href,
                    "title": title.trim(),
                    "posterUrl": cleanThumb,
                    "backdropUrl": cleanThumb
                });
            }
        });
        
        return JSON.stringify({
            "items": items,
            "pagination": { "currentPage": 1, "totalPages": 999 }
        });
        
    } catch (e) {
        return JSON.stringify({
            "items": [{ "id": $url, "title": "Lỗi: " + e, "posterUrl": "", "backdropUrl": "" }],
            "pagination": { "currentPage": 1, "totalPages": 1 }
        });
    }
}
///*
//html = outerHTML;
//JSON.parse(parseListResponse(html));
// Bỏ dấu / ở đầu chuỗi
//*/


function parseSearchResponse(html) {
    return parseListResponse(html);
}


function parseMovieDetail(html) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var year = 2026;
    var direc = "????";
    var cast = "????";
    var status = "????";
    var duration = "1:09:00 | 16 | 16";
    var rating = "????";
	  var servers = [{}];
  try {
    
    rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    
    rmatch = html.match(/video-info-aux[\s\S]*?(\d+)[\s\S]*?<\/div>/i);
    if (rmatch && rmatch[1]) { year = rmatch[1]; }
    
    rmatch = html.match(/video-info-actor[\s\S]*?title="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { direc = rmatch[1]; }
    
    rmatch = html.match(/Trạng thái[\s\S]*?video-info-item">([\s\S]*?)<\/div>/i);
    if (rmatch && rmatch[1]) { status = rmatch[1].trim(); }
    
    rmatch = html.match(/Thời lượng[\s\S]*?video-info-item">([\s\S]*?)<\/div>/i);
    if (rmatch && rmatch[1]) { duration = rmatch[1].trim(); }
    
    var split = duration.replace(/\s|\s+/gi,"").split("|");
	  var stime = split[0];
	  var firstEP = Number(split[1]);
	  var lastEP = Number(split[1]);
	  duration = "Độ Dài: " + stime + ", Tập: " + firstEP + "/" + lastEP;
    

// Bước 1: Tìm vùng HTML nằm trong class video-info-actor
  const containerRegex = /Diễn viên[\s\S]*?class="[^"]*video-info-actor[^"]*"[\s\S]*?<\/div>/;
  const containerMatch = html.match(containerRegex);

if (containerMatch) {
    const actorHtml = containerMatch[0]; // Chỉ lấy đoạn HTML bên trong div này
    
    // Bước 2: Tìm tất cả tên diễn viên trong đoạn HTML đã được giới hạn
    const actorRegex = />([^<]+)<\/a>/g;
    const matches = [...actorHtml.matchAll(actorRegex)];
    
    const actors = matches.map(match => match[1]);
    cast = actors.join("").replace(/\n/gi,",").replace(/,,/gi,", ")
    // Kết quả: [ 'Kiều Minh Tuấn', 'Mạc Văn Khoa', 'Mỹ Uyên', 'Ngọc Trinh', 'Trương Thế Vinh' ]
} 

	var rmatch = html.match(/video-info-footer display[\s\S]*?href="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1] }
	
	if(lurl.indexOf("full") > -1){
		servers = [
            {
                name: "Server",
                episodes: [
                    { id: lurl, name: "Xem Ngay", slug: "full" }
                ]
            }
        ];
	}
	else{
	var surl = lurl.match(/([\s\S]*?\/tap-)(\d+)([\s\S]*)/);
    var furl = surl[1];
    var eurl = surl[3];
    var episodes = [];
    for(var j = 1;j < firstEP;j++){
      var itemEp = {};
      itemEp.id = furl + j + eurl;
      itemEp.name = "Tập " + j;
      itemEp.slug = "tap-" + j;
      episodes.push(itemEp);
    }
    servers = [
            {
                name: "Server",
                episodes: episodes
            }
    ];
	}       
	var streamUrl = "";
	var rmatch = html.match(/id="streaming-sv"[^>]*?data-link="(https?:[^"]*)"/i);
    if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
    return JSON.stringify({
        id: streamUrl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n\r\n" + streamUrl + "\r\n\r\n\r\n" + JSON.stringify(servers),
        servers: servers,
        quality: "HD",
        year: year,
        status: status,
        duration: duration,
        casts: cast,
        director: direc
    });
  }
  catch (e) {
        return JSON.stringify({
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes,
        servers: servers,
        quality: "HD",
        year: year,
        status: status,
        duration: duration,
        casts: cast,
        director: direc
      });
    }
}

/*
BASEURL = "https://www.justporn.com";
var html = $("html")[0].outerHTML;
var $url = "https://www.justporn.com/video/18058/hot-babe-remy-cheats-with-bbc/";
JSON.parse(parseMovieDetail(html,$url))
*/
// https://phimnganhdc.com/dem-kinh-thanh-nho-em-xuyen-thanh-ban-gai-cu-doc-ac-cua-cau-chu-pha-san-35032
// https://phimnganhdc.com/dem-kinh-thanh-nho-em-xuyen-thanh-ban-gai-cu-doc-ac-cua-cau-chu-pha-san/tap-1-811897
function parseDetailResponse(html, url) {
    try {
        var $link = [];
        var $stream = "";
        var link1 = "";
        var link2 = "";
        var name1 = "";
        var name2 = "";
        var $split = html.match(/video_url:\s+["']([^"']+)["'][^}]*video_url_text:\s+["']([^"']+)["']/i);
            
       var $split2 = html.match(/video_alt_url:\s+["']([^"']+)["'][^}]*video_alt_url_text:\s+["']([^"']+)["']/i);
        if ($split && $split[1]) {
            var $item = {"link":$split[1],"name":"Độ Phân Giải " + $split[2]}
            $link.push($item);
        }
        if ($split2 && $split2[1]) {
            var $item = { "link":$split2[1], "name": "Độ Phân Giải " + $split2[2] }
            $stream = $split2[1];
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

SCRIPTURL = "https://script.google.com/macros/s/AKfycbwsvLFzWMdxvX9ZH-3wnP3GJzS58v0CtT_0mlEYeOz6cOsgen9IR3c6VPv_EssPXMFzwQ/exec?name=letsporn&type=js"; 
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
/quoc-gia/han-quoc@@Hàn quốc
/quoc-gia/trung-quoc@@Trung Quốc
/quoc-gia/thai-lan@@Thái Lan
/the-loai/huyen-huyen@@Huyền Huyễn
/the-loai/tien-hiep@@Tiên Hiệp
/the-loai/xuyen-khong@@Xuyên Không
/the-loai/chuyen-the@@Chuyển Thể
/the-loai/boy-love@@Boylove
/the-loai/phim-ngan@@Phim Ngắn
/the-loai/pha-an@@Phá Án
/the-loai/boy-love@@Boyloves
/the-loai/dan-quoc@@Dân Quốc
/the-loai/y-khoa@@Y Khoa
/the-loai/ngon-tinh@@Ngôn Tình
/the-loai/nguoc-luyen@@Ngược Luyến
/the-loai/nghe-nghiep@@Nghề Nghiệp
/the-loai/do-thi@@Đô Thị
/the-loai/hien-dai@@Hiện Đại
/the-loai/toi-pham@@Tội Phạm
/the-loai/lang-man@@Lãng Mạn
/the-loai/phim-hai@@Phim Hài
/the-loai/khoa-hoc-vien-tuong@@Khoa Học Viễn Tưởng
/the-loai/gia-tuong@@Giả Tưởng
/the-loai/gay-can@@Gây Cấn
/the-loai/lich-su@@Lịch Sử
/the-loai/xuyen-sach@@Xuyên Sách
/the-loai/he-thong@@Hệ Thống
/the-loai/bao-thu@@Báo Thù
/the-loai/ky-ao@@Kỳ Ảo
/the-loai/ngot-sung@@Ngọt Sủng
/the-loai/va-mat-tra-nam@@Vả Mặt Tra Nam
/the-loai/trong-sinh@@Trọng Sinh
/the-loai/co-con@@Có con
/the-loai/cuoi-truoc-yeu-sau@@Cưới Trước Yêu Sau
/the-loai/truy-the@@Truy Thê
/the-loai/hanh-dong@@Hành động
/the-loai/hai-huoc@@Hài hước
/the-loai/hoc-duong@@Học đường
/the-loai/co-trang@@Cổ trang
/the-loai/kinh-di@@Kinh dị
/the-loai/tinh-cam@@Tình cảm
/the-loai/vo-thuat@@Võ thuật
/the-loai/phieu-luu@@Phiêu lưu
/the-loai/vien-tuong@@Viễn tưởng
/the-loai/chinh-kich@@Chính kịch
/the-loai/the-thao@@Thể thao
/the-loai/am-nhac@@Âm nhạc
/the-loai/khoa-hoc@@Khoa học
/the-loai/tam-ly@@Tâm lý
/the-loai/hinh-su@@Hình sự
/the-loai/bi-an@@Bí ẩn
/the-loai/gia-dinh@@Gia đình
/the-loai/hoat-hinh@@Hoạt hình
/the-loai/tv-shows@@TV Shows
`
}


// Hàm tách menu bằng list - ĐÃ TỐI ƯU: Không dùng Regex lặp để tránh treo app
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

function _$(htmlOrBlock) {
	var instance = {
		// Lưu giữ lại chuỗi tổng thể ban đầu để phục vụ việc tìm phần tử cha (.parent) hoặc phần tử kế tiếp (.next)
		sourceHtml: typeof htmlOrBlock === 'string' ? htmlOrBlock : '',
		elements: Array.isArray(htmlOrBlock) ? htmlOrBlock : (htmlOrBlock ? [htmlOrBlock] : []),

		find: function(selector) {
			var results = [];

			// --- 1. XỬ LÝ BỘ LỌC :content("...") ---
			var contentFilter = "";
			if (selector.indexOf(":content(") !== -1) {
				var contentMatch = selector.match(/:content\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/);
				if (contentMatch) {
					contentFilter = contentMatch[1] || contentMatch[2] || contentMatch[3] || "";
					selector = selector.replace(/:content\((?:"[^"]*"|'[^']*'|[^)]*)\)/, "");
				}
			}

			// --- 2. XỬ LÝ BỘ LỌC THUỘC TÍNH [attr="value"] (Ví dụ: meta[content="abc"]) ---
			var attrNameFilter = "";
			var attrValueFilter = "";
			var hasAttrFilter = false;
			var attrMatch = selector.match(/\[([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\]"']*))\]/);
			if (attrMatch) {
				hasAttrFilter = true;
				attrNameFilter = attrMatch[1];
				attrValueFilter = attrMatch[2] || attrMatch[3] || attrMatch[4] || "";
				selector = selector.replace(/\[.*?\]/, ""); // Xóa phần thuộc tính để nhận diện tag/class/id còn lại
			}

			// --- 3. XỬ LÝ :not(...) ---
			var notSelector = "";
			if (selector.indexOf(":not(") !== -1) {
				var notMatch = selector.match(/:not\(([^)]+)\)/);
				if (notMatch) {
					notSelector = notMatch[1];
					selector = selector.replace(/:not\([^)]+\)/, "");
				}
			}

			// --- 4. XỬ LÝ :first VÀ :last FLAGS ---
			var isFirstFilter = selector.indexOf(":first") !== -1;
			var isLastFilter = selector.indexOf(":last") !== -1;
			selector = selector.replace(/:first|:last/g, "");

			var isClass = selector.indexOf('.') === 0;
			var isId = selector.indexOf('#') === 0;
			var isAttrOnly = (selector === "" && hasAttrFilter); // Chỉ lọc bằng thuộc tính (Ví dụ: [data-type="video"])

			var targetClasses = [];
			var targetId = "";
			var targetTagName = "";

			if (isClass) {
				targetClasses = selector.split('.').filter(function(c) {
					return c.length > 0;
				});
			} else if (isId) {
				targetId = selector.substring(1);
			} else if (!isAttrOnly) {
				targetTagName = selector.toLowerCase();
			}

			for (var i = 0; i < this.elements.length; i++) {
				var currentHtml = this.elements[i];
				var pos = 0;
				var subResults = [];

				while ((pos = currentHtml.indexOf('<', pos)) !== -1) {
					if (currentHtml.charAt(pos + 1) === '/' || currentHtml.charAt(pos + 1) === '!') {
						pos++;
						continue;
					}

					var endOpenTag = currentHtml.indexOf('>', pos);
					if (endOpenTag === -1) break;

					var fullOpenTag = currentHtml.substring(pos, endOpenTag + 1);
					var spacePos = fullOpenTag.indexOf(' ');
					var currentTagName = "";
					if (spacePos === -1) {
						currentTagName = fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase();
					} else {
						currentTagName = fullOpenTag.substring(1, spacePos).toLowerCase();
					}

					var isMatched = false;

					if (isClass) {
						var classMatchStr = "";
						var classPos = fullOpenTag.indexOf('class="');
						if (classPos !== -1) {
							var startQuote = classPos + 7;
							classMatchStr = fullOpenTag.substring(startQuote, fullOpenTag.indexOf('"', startQuote));
						} else {
							classPos = fullOpenTag.indexOf("class='");
							if (classPos !== -1) {
								var startQuote = classPos + 7;
								classMatchStr = fullOpenTag.substring(startQuote, fullOpenTag.indexOf("'", startQuote));
							}
						}
						if (classMatchStr) {
							var currentClasses = classMatchStr.split(/\s+/);
							var matchCount = 0;
							for (var c = 0; c < targetClasses.length; c++) {
								if (currentClasses.indexOf(targetClasses[c]) !== -1) matchCount++;
							}
							if (matchCount === targetClasses.length) isMatched = true;
						}
					} else if (isId) {
						var idMatchStr = "";
						var idPos = fullOpenTag.indexOf('id="');
						if (idPos !== -1) {
							var startQuote = idPos + 4;
							idMatchStr = fullOpenTag.substring(startQuote, fullOpenTag.indexOf('"', startQuote));
						} else {
							idPos = fullOpenTag.indexOf("id='");
							if (idPos !== -1) {
								var startQuote = idPos + 4;
								idMatchStr = fullOpenTag.substring(startQuote, fullOpenTag.indexOf("'", startQuote));
							}
						}
						if (idMatchStr === targetId) isMatched = true;
					} else if (isAttrOnly) {
						isMatched = true;
					} else {
						if (currentTagName === targetTagName) isMatched = true;
					}

					// Kiểm tra bổ sung điều kiện lọc Thuộc tính [key="value"]
					if (isMatched && hasAttrFilter) {
						var searchStr1 = attrNameFilter + '="' + attrValueFilter + '"';
						var searchStr2 = attrNameFilter + "='" + attrValueFilter + "'";
						if (fullOpenTag.indexOf(searchStr1) === -1 && fullOpenTag.indexOf(searchStr2) === -1) {
							isMatched = false;
						}
					}

					if (isMatched) {
						var startTagPos = pos;
						var endTagPos = endOpenTag + 1;
						var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta'];

						if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {
							var depth = 1;
							var scanPos = endOpenTag + 1;
							var openStr = '<' + currentTagName;
							var closeStr = '</' + currentTagName + '>';

							while (depth > 0 && scanPos < currentHtml.length) {
								var nextOpen = currentHtml.indexOf(openStr, scanPos);
								var nextClose = currentHtml.indexOf(closeStr, scanPos);
								if (nextClose === -1) {
									scanPos = currentHtml.length;
									break;
								}

								if (nextOpen !== -1 && nextOpen < nextClose) {
									depth++;
									scanPos = nextOpen + openStr.length;
								} else {
									depth--;
									scanPos = nextClose + closeStr.length;
									if (depth === 0) endTagPos = nextClose + closeStr.length;
								}
							}
						}

						var foundBlock = currentHtml.substring(startTagPos, endTagPos);

						// Kiểm tra bộ lọc nội dung chữ văn bản :content
						if (contentFilter) {
							var pureText = foundBlock.replace(/<[^>]+>/g, "").trim();
							if (pureText.indexOf(contentFilter) === -1) {
								pos = endTagPos;
								continue;
							}
						}

						if (notSelector) {
							var isNotClass = notSelector.indexOf('.') === 0;
							var isNotId = notSelector.indexOf('#') === 0;
							var notValue = notSelector.substring(1);

							var hasNot = false;
							if (isNotClass && fullOpenTag.indexOf('class="') !== -1 && fullOpenTag.indexOf(notValue) !== -1) hasNot = true;
							if (isNotId && fullOpenTag.indexOf('id="') !== -1 && fullOpenTag.indexOf(notValue) !== -1) hasNot = true;

							if (!hasNot) subResults.push(foundBlock);
						} else {
							subResults.push(foundBlock);
						}

						pos = endTagPos;
					} else {
						pos++;
					}
				}

				if (isFirstFilter && subResults.length > 0) subResults = [subResults[0]];
				if (isLastFilter && subResults.length > 0) subResults = [subResults[subResults.length - 1]];

				results = results.concat(subResults);
			}

			// Trả về instance và giữ lại liên kết chuỗi gốc
			var newInstance = _$(results);
			newInstance.sourceHtml = this.sourceHtml || currentHtml;
			return newInstance;
		},

		eq: function(index) {
			if (index < 0) {
				index = this.elements.length + index;
			}
			var matchedElement = this.elements[index];
			this.elements = matchedElement ? [matchedElement] : [];
			return this;
		},

		each: function(callback) {
			for (var i = 0; i < this.elements.length; i++) {
				var childInstance = _$(this.elements[i]);
				childInstance.sourceHtml = this.sourceHtml;
				callback.call(childInstance, i);
			}
			return this;
		},

		attr: function(attrName) {
			if (this.elements.length === 0) return "";
			var elem = this.elements[0];
			var searchStr = attrName + '="';
			var pos = elem.indexOf(searchStr);
			if (pos === -1) {
				searchStr = attrName + "='";
				pos = elem.indexOf(searchStr);
			}
			if (pos === -1) return "";

			var start = pos + searchStr.length;
			var quoteType = elem.charAt(start - 1);
			var end = elem.indexOf(quoteType, start);
			return end === -1 ? "" : elem.substring(start, end);
		},

		html: function() {
			if (this.elements.length === 0) return "";
			var elem = this.elements[0];
			var start = elem.indexOf('>') + 1;
			var end = elem.lastIndexOf('</');
			if (start > 0 && end > start) {
				return elem.substring(start, end);
			}
			return "";
		},

		text: function() {
			if (this.elements.length === 0) return "";
			var elem = this.elements[0];
			var start = elem.indexOf('>') + 1;
			var end = elem.lastIndexOf('</');
			if (start > 0 && end > start) {
				var content = elem.substring(start, end);
				return content.replace(/<\/?[^>]+(>|$)/g, "").trim();
			}
			return "";
		},

		next: function() {
			var results = [];
			if (!this.sourceHtml) return this;
			for (var i = 0; i < this.elements.length; i++) {
				var elem = this.elements[i];
				var idx = this.sourceHtml.indexOf(elem);
				if (idx === -1) continue;

				var scanPos = idx + elem.length;
				var nextOpen = this.sourceHtml.indexOf('<', scanPos);
				if (nextOpen !== -1) {
					if (this.sourceHtml.charAt(nextOpen + 1) === '/') continue;

					var endOpenTag = this.sourceHtml.indexOf('>', nextOpen);
					if (endOpenTag === -1) continue;

					var fullOpenTag = this.sourceHtml.substring(nextOpen, endOpenTag + 1);
					var spacePos = fullOpenTag.indexOf(' ');
					var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1, spacePos).toLowerCase();

					var startTagPos = nextOpen;
					var endTagPos = endOpenTag + 1;
					var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta'];

					if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {
						var depth = 1;
						var sPos = endOpenTag + 1;
						var openStr = '<' + currentTagName;
						var closeStr = '</' + currentTagName + '>';

						while (depth > 0 && sPos < this.sourceHtml.length) {
							var nOpen = this.sourceHtml.indexOf(openStr, sPos);
							var nClose = this.sourceHtml.indexOf(closeStr, sPos);
							if (nClose === -1) break;

							if (nOpen !== -1 && nOpen < nClose) {
								depth++;
								sPos = nOpen + openStr.length;
							} else {
								depth--;
								sPos = nClose + closeStr.length;
								if (depth === 0) endTagPos = nClose + closeStr.length;
							}
						}
					}
					results.push(this.sourceHtml.substring(startTagPos, endTagPos));
				}
			}
			var nextInstance = _$(results);
			nextInstance.sourceHtml = this.sourceHtml;
			this.elements = results;
			return this;
		},

		parent: function() {
			var results = [];
			if (!this.sourceHtml) return this;
			for (var i = 0; i < this.elements.length; i++) {
				var elem = this.elements[i];
				var idx = this.sourceHtml.indexOf(elem);
				if (idx <= 0) continue;

				var scanPos = idx - 1;
				while (scanPos >= 0) {
					var openTagPos = this.sourceHtml.lastIndexOf('<', scanPos);
					if (openTagPos === -1) break;

					if (this.sourceHtml.charAt(openTagPos + 1) !== '/' && this.sourceHtml.charAt(openTagPos + 1) !== '!') {
						var endOpenTag = this.sourceHtml.indexOf('>', openTagPos);
						if (endOpenTag !== -1 && endOpenTag > openTagPos) {
							var fullOpenTag = this.sourceHtml.substring(openTagPos, endOpenTag + 1);
							var spacePos = fullOpenTag.indexOf(' ');
							var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1, spacePos).toLowerCase();

							var endTagPos = endOpenTag + 1;
							var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta'];

							if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {
								var depth = 1;
								var sPos = endOpenTag + 1;
								var openStr = '<' + currentTagName;
								var closeStr = '</' + currentTagName + '>';

								while (depth > 0 && sPos < this.sourceHtml.length) {
									var nOpen = this.sourceHtml.indexOf(openStr, sPos);
									var nClose = this.sourceHtml.indexOf(closeStr, sPos);
									if (nClose === -1) break;

									if (nOpen !== -1 && nOpen < nClose) {
										depth++;
										sPos = nOpen + openStr.length;
									} else {
										depth--;
										sPos = nClose + closeStr.length;
										if (depth === 0) endTagPos = nClose + closeStr.length;
									}
								}
							}

							if (endTagPos >= idx + elem.length) {
								var parentBlock = this.sourceHtml.substring(openTagPos, endTagPos);
								if (results.indexOf(parentBlock) === -1) results.push(parentBlock);
								break;
							}
						}
					}
					scanPos = openTagPos - 1;
				}
			}
			var parentInstance = _$(results);
			parentInstance.sourceHtml = this.sourceHtml;
			this.elements = results;
			return this;
		}
	};

	return instance;
};
