var BASEURL = "https://www.trannymovs.com";
function getManifest() {
    return JSON.stringify({
        "id": "trannymovs",          
        "name": "Trannymovs",
        "description": "XXX dành cho người có sở thích đặc biệt",
        "version": "1.3",             
        "baseUrl": "https://www.trannymovs.com",
        "iconUrl": "https://cdn1.tranny.one/trannystatic/v30/common/lib-tr/img/logo-2x.png", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}
// https://www.trannymovs.com/latest-updates/2/
function getHomeSections() {
    return JSON.stringify([
        { "slug": "/latest-updates/", "title": "Hàng Mới", "type": "Grid" }
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
// https://www.trannymovs.com/latest-updates/2/
// https://www.trannymovs.com/categories/ladyboy/21/
// https://www.trannymovs.com/search/blacked/

// https://www.trannymovs.com/latest-updates/2/
// https://www.trannymovs.com/categories/ladyboy/21/
// https://www.trannymovs.com/search/blacked/

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
            resultUrl += page + "/";
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
// https://www.trannymovs.com/latest-updates/2/
// https://www.trannymovs.com/categories/ladyboy/21/
// https://www.trannymovs.com/search/blacked/

//BASEURL = "https://www.trannymovs.com";
//filtersJson = '{"page":5,"category":[{"slug":"/categories/ladyboy/","name":"ladyboy"}]}';
//filtersJson = '{"page":13}';
//console.log(getUrlList("/latest-updates/", filtersJson));



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
class=["']item[^"']+["'][\\s\\S]*?
href="([^"']+)"[\\s\\S]*?
title=["']([^"']+)["'][\\s\\S]*?
data-webp=["']([^"']+)["']
`;
        regexList = regexList.replace(/\r|\n|\t/g, "");
        regmath = new RegExp(regexList, "g");
        var matchList;
        // regexList.exec(html)
        while ((matchList = regmath.exec(html)) !== null) {
            if (matchList[1] && matchList[1].indexOf("http") > -1) {
                var cleanThumb = matchList[3].replace(/&amp;/g, '&');
                // var imgorigin = matchList[0].match(/data-webp=["']([^"']+)["']/i);
                //if(imgorigin && imgorigin[1]){
                //   cleanThumb = imgorigin[1];
                //}
                
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
//var regexList = /class=["']item[^"']+["'][\s\S]*?href="([^"']+)"[\s\S]*?title=["']([^"']+)["'][\s\S]*?src=["']([^"']+)["']/g;
//var math = html.match(regexList)
//math
//regmath.exec(html)
//JSON.parse(parseListResponse(html));
// Bỏ dấu / ở đầu chuỗi


function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html,$url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var streamUrl = ""; // ĐÃ SỬA: Khai báo rõ ràng biến streamUrl tránh lỗi Global leak

    var rmatch = html.match(/link\s+rel="canonical"\s+href=["']([^"]+)["']/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1] }

    rmatch = html.match(/property=["']og:image["']\s+content=["']([^"]+)["']/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/<title>([^<]+)/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+name=["']description["']\s+content=["']([^"]+)["']/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    //
    var $stream = "";
    var epi = [];
    var $linkURL = html.match(/video_url[^"']+'([^"']+)'/i);
    if($linkURL && $linkURL[1]){
        $stream = $linkURL[1];
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


function parseDetailResponse(html, url) {
    try {
          var $stream = "";
          var epi = [];
          var $linkURL = html.match(/video_url[^"']+'([^"']+)'/i);
          if ($linkURL && $linkURL[1]) {
              $stream = $linkURL[1];
              epi.push({ id: $stream, name: "Xem Ngay", slug: "full" });
          }
        var customjs = textJS(epi);
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

function textJS($lists) {
    // Sử dụng biến $url từ tham số truyền vào thay vì ghi cứng link
    return `
LINKVIDEO = ${JSON.stringify($lists)};
SCRIPTURL = "https://script.google.com/macros/s/AKfycbwsvLFzWMdxvX9ZH-3wnP3GJzS58v0CtT_0mlEYeOz6cOsgen9IR3c6VPv_EssPXMFzwQ/exec?name=trannymovs&type=js"; 
const style = document.createElement('style');
var customcss = 'body { background: black; overflow: hidden; }body * {background: black;display:none!important}';
style.innerHTML = customcss;
document.head.appendChild(style);

/* BUILD VIDEO BEGIN  */

    // ─── BIẾN TOÀN CỤC CỦA SCRIPT ───
    var DEVELOPE = false;

    function GetlinkVideo() {
        var playlist = scanSources();
        var stream1 = playlist.activeSrc || '';
        var stream2 = window.location.href;
        showToast("Đang khởi chạy trình phát tốt hơn.", 5000, true);
        buildVideo(stream1, stream2, playlist);
    }

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
                    'embed') > -1)) {
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
                    'embed') > -1) {
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
                    .className)) isEpisode = true;
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
        setTimeout(function () {
            toastEl.style.transform = 'translateX(0)';
            toastEl.style.opacity = '1';
        }, 10);
        setTimeout(function () {
            toastEl.style.transform = 'translateX(120%)';
            toastEl.style.opacity = '0';
            setTimeout(function () {
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
        progressWrap.onmouseenter = function () {
            progressHandle.style.opacity = '1';
        };
        progressWrap.onmouseleave = function () {
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

        // Chỉ hiện nút playlist nếu có nội dung
        var hasPlaylist = (playlistData && ((playlistData.servers && playlistData.servers.length >
            1) || (playlistData.episodes && playlistData.episodes.length > 0)));
        if (hasPlaylist) {
            btnRow.appendChild(btnPlaylist);
        }

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
        plClose.onclick = function (e) {
            if (e) e.stopPropagation();
            playlistPanel.style.transform = 'translateX(100%)';
        };
        plHeader.appendChild(plClose);
        playlistPanel.appendChild(plHeader);

        function buildSection(title, items, onClick) {
            if (!items || items.length === 0) return;
            var sec = document.createElement('div');
            sec.style.cssText = 'margin-bottom:20px;';
            var secTitle = document.createElement('div');
            secTitle.textContent = title;
            secTitle.style.cssText =
                'font-size:13px;text-transform:uppercase;opacity:0.6;margin-bottom:10px;';
            sec.appendChild(secTitle);
            for (var i = 0; i < items.length; i++) {
                (function (item) {
                    var btn = document.createElement('button');
                    btn.textContent = item.label;
                    btn.style.cssText =
                        'display:block;width:100%;text-align:left;padding:10px 12px;margin-bottom:6px;background:rgba(255,255,255,0.08);border:none;border-radius:6px;color:#fff;font-size:14px;cursor:pointer;transition:background 0.2s;';
                    btn.onmouseenter = function () {
                        btn.style.background = 'rgba(231,76,60,0.3)';
                    };
                    btn.onmouseleave = function () {
                        btn.style.background = 'rgba(255,255,255,0.08)';
                    };
                    btn.onclick = function (e) {
                        if (e) e.stopPropagation();
                        onClick(item);
                    };
                    sec.appendChild(btn);
                })(items[i]);
            }
            playlistPanel.appendChild(sec);
        }

        if (playlistData) {
            if (playlistData.servers && playlistData.servers.length > 1) {
                buildSection('🎥 Chuyển Server', playlistData.servers, function (item) {
                    switchSource(item.src);
                });
            }
            if (playlistData.episodes && playlistData.episodes.length > 0) {
                buildSection('📁 Tập phim', playlistData.episodes, function (item) {
                    savePosition();
                    window.location.href = item.src;
                });
            }
        }

        container.appendChild(video);
        container.appendChild(spinner);
        container.appendChild(bigPlayBtn);
        container.appendChild(seekOverlay);
        container.appendChild(controls);
        if (hasPlaylist) {
            container.appendChild(playlistPanel);
        }

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
        // Tạo key ổn định: bỏ các path segment chứa '=' (key=, state=, speed=, reftag=...)
        // chỉ giữ lại các phần thuần túy của link gốc
        function getStableKey(url) {
            try {
                var u = new URL(url);
                var parts = u.pathname.split('/').filter(function (p) {
                    return p.length && p.indexOf('=') === -1;
                });
                var path = parts.length ? '/' + parts.join('/') : '/';
                return 'videoPlayer_lastPos_' + encodeURIComponent(u.origin + path);
            } catch (e) {
                return 'videoPlayer_lastPos_' + encodeURIComponent(url.split('?')[0].split('#')[0]);
            }
        }

        var saveKey = getStableKey(stream1);
        var lastSaveTime = 0;
        var pendingRestoreTime = null;
        var hasRestored = false;

        function savePosition(force) {
            if (!video || video.ended || !video.currentTime || isNaN(video.currentTime)) return;
            if (!force) {
                var now = Date.now();
                if (now - lastSaveTime < 3000) return; // debounce 3 giây
                lastSaveTime = now;
            }
            try {
                // Chỉ lưu nếu đã xem quá 3s và còn hơn 5s cuối
                if (video.currentTime > 3 && (!video.duration || isNaN(video.duration) || video
                        .currentTime < video.duration - 5)) {
                    localStorage.setItem(saveKey, JSON.stringify({
                        time: video.currentTime,
                        duration: video.duration || 0,
                        savedAt: Date.now()
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
            if (hasRestored) {
                console.log('[Player] already restored');
                return true;
            }
            try {
                var saved = localStorage.getItem(saveKey);
                console.log('[Player] saveKey:', saveKey, 'saved:', saved ? 'found' : 'null');
                if (saved) {
                    var data = JSON.parse(saved);
                    console.log('[Player] parsed data:', JSON.stringify(data));
                    if (data && data.time && data.time > 3) {
                        if (!video.duration || isNaN(video.duration)) {
                            pendingRestoreTime = data.time;
                            console.log('[Player] duration not ready, pending:', data.time);
                            return false;
                        }
                        if (data.time < video.duration - 5) {
                            try {
                                video.currentTime = data.time;
                                hasRestored = true;
                                console.log('[Player] restored to:', data.time);
                                showToast('⏩ Đã tiếp tục phát từ ' + formatTime(data.time), 4000,
                                    true);
                                return true;
                            } catch (seekErr) {
                                console.warn('[Player] seek failed, will retry on canplay:',
                                    seekErr);
                                pendingRestoreTime = data.time;
                                return false;
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('[Player] restore error:', e);
            }
            return false;
        }

        function applyPendingRestore() {
            if (pendingRestoreTime !== null && video.duration && !isNaN(video.duration)) {
                if (pendingRestoreTime < video.duration - 5) {
                    try {
                        video.currentTime = pendingRestoreTime;
                        hasRestored = true;
                        console.log('[Player] applied pending restore:', pendingRestoreTime);
                        showToast('⏩ Đã tiếp tục phát từ ' + formatTime(pendingRestoreTime), 4000,
                            true);
                    } catch (seekErr) {
                        console.warn('[Player] pending seek failed:', seekErr);
                    }
                }
                pendingRestoreTime = null;
                return true;
            }
            return false;
        }

        // Lưu ngay khi rời trang / reload, không chờ debounce
        window.addEventListener('beforeunload', function () {
            savePosition(true);
        });

        function switchSource(newSrc) {
            var wasPlaying = !video.paused;
            var prevTime = video.currentTime;
            // Lưu vị trí cũ trước khi đổi
            savePosition(true);
            stream1 = newSrc;
            saveKey = getStableKey(stream1);
            hasRestored = false;
            pendingRestoreTime = null;
            video.src = newSrc;
            video.load();
            spinner.style.display = 'block';
            video.onloadeddata = function () {
                spinner.style.display = 'none';
                if (!restorePosition() && prevTime > 0) {
                    video.currentTime = prevTime;
                }
                if (wasPlaying) video.play();
                showToast('Đã chuyển nguồn phát');
            };
            video.onerror = function () {
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
            btn.onmouseenter = function () {
                btn.style.background = 'rgba(255,255,255,0.2)';
            };
            btn.onmouseleave = function () {
                btn.style.background = 'none';
            };
            return btn;
        }

        function showSeekOverlay(text) {
            seekOverlay.textContent = text;
            seekOverlay.style.opacity = '1';
            clearTimeout(seekOverlay._timer);
            seekOverlay._timer = setTimeout(function () {
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
                video.duration;
            video.currentTime = newTime;
            showSeekOverlay((seconds > 0 ? '+' : '') + seconds + 's');
        }

        function togglePlay() {
            if (video.paused) {
                video.play().then(function () {
                    isPlaying = true;
                    btnPlay.textContent = '⏸';
                    bigPlayBtn.style.display = 'none';
                    spinner.style.display = 'none';
                }).catch(function (e) {
                    console.warn('Autoplay bị chặn:', e);
                    video.muted = true;
                    video.play().then(function () {
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
            // Lưu vị trí hiện tại trước khi reload
            savePosition(true);
            video.src = stream1 + (stream1.indexOf('?') > -1 ? '&' : '?') + '_reload=' + Date.now();
            video.load();
            video.onloadeddata = function () {
                spinner.style.display = 'none';
                // Ưu tiên vị trí hiện tại, nếu 0 thì thử restore từ localStorage
                if (currentTime > 0) {
                    video.currentTime = currentTime;
                } else {
                    restorePosition();
                }
                if (wasPlaying) video.play();
                showToast('Đã tải lại nguồn video');
            };
            video.onerror = function () {
                spinner.style.display = 'none';
                if (stream2 && stream2 !== stream1) {
                    showToast('Nguồn 1 lỗi, thử nguồn dự phòng...');
                    stream1 = stream2;
                    saveKey = getStableKey(stream1);
                    video.src = stream1;
                    video.load();
                } else {
                    showToast('Lỗi tải video! Kiểm tra nguồn.');
                }
            };
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(function () {});
            } else {
                document.exitFullscreen().catch(function () {});
            }
        }

        function showControls() {
            controls.style.opacity = '1';
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(function () {
                if (!isDraggingProgress) controls.style.opacity = '0';
            }, 3000);
        }

        video.addEventListener('loadeddata', function () {
            console.log('[Player] loadeddata, readyState:', video.readyState, 'duration:',
                video.duration, 'currentTime:', video.currentTime);
            spinner.style.display = 'none';
            updateProgress();
            if (isMuted && video.muted) {
                video.muted = false;
                isMuted = false;
                btnMute.textContent = '🔊';
            }
            restorePosition();
        });

        video.addEventListener('loadedmetadata', function () {
            console.log('[Player] loadedmetadata, duration:', video.duration);
            applyPendingRestore();
        });

        video.addEventListener('durationchange', function () {
            console.log('[Player] durationchange, duration:', video.duration);
            applyPendingRestore();
        });

        video.addEventListener('canplay', function () {
            console.log('[Player] canplay, readyState:', video.readyState, 'currentTime:',
                video.currentTime, 'seekable:', video.seekable ? video.seekable.length :
                0);
            if (!hasRestored) {
                if (pendingRestoreTime !== null) {
                    applyPendingRestore();
                } else {
                    restorePosition();
                }
            }
        });

        video.addEventListener('waiting', function () {
            spinner.style.display = 'block';
        });
        video.addEventListener('playing', function () {
            spinner.style.display = 'none';
        });
        video.addEventListener('error', function () {
            spinner.style.display = 'none';
            showToast('Lỗi phát video! Nhấn 🔄 để tải lại.');
            btnPlay.textContent = '▶';
            bigPlayBtn.style.display = 'flex';
        });
        video.addEventListener('timeupdate', function () {
            updateProgress();
            savePosition();
        });
        video.addEventListener('ended', function () {
            btnPlay.textContent = '▶';
            bigPlayBtn.style.display = 'flex';
            isPlaying = false;
            clearSavedPosition();
        });

        video.addEventListener('click', function (e) {
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

        video.addEventListener('volumechange', function () {
            btnMute.textContent = video.muted || video.volume === 0 ? '🔇' : '🔊';
        });

        btnPlay.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePlay();
        });
        btnMute.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMute();
        });
        btnReload.addEventListener('click', function (e) {
            e.stopPropagation();
            reloadVideo();
        });
        btnFullscreen.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleFullscreen();
        });
        if (hasPlaylist) {
            btnPlaylist.addEventListener('click', function (e) {
                e.stopPropagation();
                playlistPanel.style.transform = 'translateX(0)';
            });
        }

        progressWrap.addEventListener('click', function (e) {
            e.stopPropagation();
            var rect = progressWrap.getBoundingClientRect();
            var pct = (e.clientX - rect.left) / rect.width;
            if (video.duration && !isNaN(video.duration)) {
                video.currentTime = pct * video.duration;
            }
            updateProgress();
        });
        progressWrap.addEventListener('mousedown', function (e) {
            isDraggingProgress = true;
            showControls();
        });
        document.addEventListener('mousemove', function (e) {
            if (isDraggingProgress && video.duration && !isNaN(video.duration)) {
                var rect = progressWrap.getBoundingClientRect();
                var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                progressBar.style.width = (pct * 100) + '%';
                video.currentTime = pct * video.duration;
                updateProgress();
            }
        });
        document.addEventListener('mouseup', function () {
            isDraggingProgress = false;
        });

        container.addEventListener('mousemove', showControls);
        container.addEventListener('click', function () {
            showControls();
        });
        bigPlayBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePlay();
        });

        document.addEventListener('keydown', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            showControls();
            switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                e.shiftKey ? seekVideo(-30) : (e.ctrlKey || e.altKey) ? seekVideo(-5) :
                    seekVideo(-10);
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

        container.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isSwiping = false;
        }, {
            passive: true
        });

        container.addEventListener('touchmove', function (e) {
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

        video.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;
            isDraggingVideo = false;
            regionStartX = e.clientX;
            regionOverlay = document.createElement('div');
            regionOverlay.style.cssText =
                'position:fixed;top:0;height:100vh;background:rgba(231,76,60,0.3);pointer-events:none;z-index:25;';
            document.body.appendChild(regionOverlay);
        });

        document.addEventListener('mousemove', function (e) {
            if (!regionOverlay) return;
            isDraggingVideo = true;
            var left = Math.min(regionStartX, e.clientX);
            var width = Math.abs(e.clientX - regionStartX);
            regionOverlay.style.left = left + 'px';
            regionOverlay.style.width = width + 'px';
        });

        document.addEventListener('mouseup', function (e) {
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

        video.play().then(function () {
            spinner.style.display = 'none';
            btnPlay.textContent = '⏸';
            isPlaying = true;
            console.log('Video autoplay thành công với tiếng');
            showToast('Đã phát video thành công. Xem vui nhé friend', 5000, true);
        }).catch(function (err) {
            console.log('Autoplay bị chặn, thử muted...');
            video.muted = true;
            isMuted = true;
            btnMute.textContent = '🔇';
            video.play().then(function () {
                spinner.style.display = 'none';
                btnPlay.textContent = '⏸';
                isPlaying = true;
                showToast('Đã tự phát (chưa bật tiếng) - Nhấn M để bật tiếng');
            }).catch(function (err2) {
                spinner.style.display = 'none';
                bigPlayBtn.style.display = 'flex';
                showToast('Không thể phát video: ', 3000, DEVELOPE);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', GetlinkVideo);
    } else {
        GetlinkVideo();
    }


/* BUILD VIDEO END */


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
/categories/ladyboy/@@Ladyboy
/categories/teen-18/@@Teen 18+
/categories/shemale/@@Shemale
/categories/threesome/@@Threesome
/categories/tranny/@@Tranny
/categories/beauty/@@Beauty
/categories/big-ass/@@Big Ass
/categories/big-boobs/@@Big Boobs
/categories/big-cock/@@Big Cock
/categories/anal/@@Anal
/categories/60-fps/@@60 FPS
/categories/amateur/@@Amateur
/categories/anal-orgasm/@@Anal Orgasm
/categories/animation/@@Animation
/categories/arab/@@Arab
/categories/asian/@@Asian
/categories/babe/@@Babe
/categories/bareback/@@Bareback
/categories/bbc/@@BBC
/categories/bbw/@@BBW
/categories/bdsm/@@BDSM
/categories/bisexual/@@Bisexual
/categories/black-ebony/@@Black & Ebony
/categories/blonde/@@Blonde
/categories/blowjob/@@Blowjob
/categories/brazilian/@@Brazilian
/categories/brunette/@@Brunette
/categories/bukkake/@@Bukkake
/categories/casting/@@Casting
/categories/compilation/@@Compilation
/categories/creampie/@@Creampie
/categories/crossdressing/@@Crossdressing
/categories/cumshot/@@Cumshot
/categories/deepthroat/@@Deepthroat
/categories/domination/@@Domination
/categories/double-penetration/@@Double Penetration
/categories/fetish/@@Fetish
/categories/fisting/@@Fisting
/categories/futa/@@Futa
/categories/gangbang/@@Gangbang
/categories/girl-fucks-tranny/@@Girl Fucks Tranny
/categories/gloryhole/@@Gloryhole
/categories/granny/@@Granny
/categories/group-sex/@@Group Sex
/categories/guy-fucks-tranny/@@Guy Fucks Tranny
/categories/handjob/@@Handjob
/categories/hardcore/@@Hardcore
/categories/hd-porn/@@HD Porn
/categories/homemade/@@Homemade
/categories/interracial/@@Interracial
/categories/latina/@@Latina
/categories/lingerie/@@Lingerie
/categories/massage/@@Massage
/categories/masturbation/@@Masturbation
/categories/mature/@@Mature
/categories/milf/@@MILF
/categories/orgy/@@Orgy
/categories/outdoor/@@Outdoor
/categories/petite/@@Petite
/categories/pissing/@@Pissing
/categories/pornstar/@@Pornstar
/categories/pov/@@POV
/categories/public/@@Public
/categories/redhead/@@Redhead
/categories/rimming/@@Rimming
/categories/self-sucking/@@Self Sucking
/categories/sissy/@@Sissy
/categories/small-cock/@@Small Cock
/categories/small-tits/@@Small Tits
/categories/solo-tranny/@@Solo Tranny
/categories/squirt/@@Squirt
/categories/striptease/@@Striptease
/categories/tattoo/@@Tattoo
/categories/tranny-fucks-girl/@@Tranny Fucks Girl
/categories/tranny-fucks-guy/@@Tranny Fucks Guy
/categories/tranny-fucks-tranny/@@Tranny Fucks Tranny
/categories/vintage/@@Vintage
/categories/vr/@@VR
/categories/webcam/@@Webcam
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
