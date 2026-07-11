var BASEURL = "https://motherless.xxx";

function getManifest() {
    return JSON.stringify({
        "id": "motherless",
        "name": "Motherless",
        "description": "XXX Hay",
        "version": "1.4",
        "baseUrl": "https://motherless.xxx",
        "iconUrl": "https://raw.githubusercontent.com/alokillgtv-gif/VAXAPPSCRIPT/main/img/motherless.jpg",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "exoplayer"
    });
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

function getLISTmenu() {
    return `porn/gay-group/videos@@Gay Group
porn/gay-incest/videos@@Gay Incest
porn/transsexual-anal/videos@@Trans Anal
porn/transsexual-ladyboy/videos@@Trans Ladyboy
porn/transsexual-thai/videos@@Trans Thai
porn/transsexual-threesome/videos@@Trans Threesome
porn/amateur/videos@@Amateur
porn/anal/videos@@Anal
porn/asian/videos@@Asian
porn/atm/videos@@ATM
porn/bbc/videos@@BBC
porn/bbw/videos@@BBW
porn/bdsm/videos@@BDSM
porn/big-ass/videos@@Big Ass
porn/big-cock/videos@@Big Cock
porn/big-tits/videos@@Big Tits
porn/bisexual/videos@@Bisexual
porn/bizarre/videos@@Bizarre
porn/blonde/videos@@Blonde
porn/blowjob/videos@@Blowjob
porn/brunette/videos@@Brunette
porn/bukkake/videos@@Bukkake
porn/cartoon/videos@@Cartoon
porn/cfnm/videos@@CFNM
porn/choking/videos@@Choking
porn/clothed/videos@@Clothed
porn/cosplay/videos@@Cosplay
porn/cream-pie/videos@@Cream Pie
porn/crossdresser/videos@@Crossdresser
porn/cuckold/videos@@Cuckold
porn/cumshot/videos@@Cumshot
porn/double-penetration/videos@@DP
porn/ebony/videos@@Ebony
porn/euro/videos@@Euro
porn/facial/videos@@Facial
porn/feet/videos@@Feet
porn/femdom/videos@@Femdom
porn/fetish/videos@@Fetish
porn/fisting/videos@@Fisting
porn/flashing/videos@@Flashing
porn/funny/videos@@Funny
porn/gagging/videos@@Gagging
porn/gangbang/videos@@Gangbang
porn/gaping/videos@@Gaping
porn/gay/videos@@Gay
porn/german/videos@@German
porn/girlfriend/videos@@Girlfriend
porn/glory-hole/videos@@Glory Hole
porn/gothic/videos@@Gothic
porn/group/videos@@Group
porn/hairy/videos@@Hairy
porn/handjobs/videos@@Handjobs
porn/heels/videos@@Heels
porn/hentai/videos@@Hentai
porn/homemade/videos@@Homemade
porn/humiliation/videos@@Humiliation
porn/incest/videos@@Incest
porn/insertions/videos@@Insertions
porn/interracial/videos@@Interracial
porn/japanese/videos@@Japanese
porn/joi/videos@@JOI
porn/lactating/videos@@Lactating
porn/latex/videos@@Latex
porn/latina/videos@@Latina
porn/legs/videos@@Legs
porn/lesbian/videos@@Lesbian
porn/lingerie/videos@@Lingerie
porn/machine/videos@@Machine
porn/massage/videos@@Massage
porn/masturbation/videos@@Masturbation
porn/mature/videos@@Mature
porn/medical/videos@@Medical
porn/midgets/videos@@Midgets
porn/milf/videos@@MILF
porn/nerdy-girls/videos@@Nerdy Girls
porn/old-young/videos@@Old & Young
porn/orgy/videos@@Orgy
porn/panties/videos@@Panties
porn/pegging/videos@@Pegging
porn/petite/videos@@Petite
porn/pierced/videos@@Pierced
porn/pissing/videos@@Pissing
porn/pov/videos@@POV
porn/pregnant/videos@@Pregnant
porn/prolapse/videos@@Prolapse
porn/public/videos@@Public
porn/redhead/videos@@Redhead
porn/rimming/videos@@Rimming
porn/role-play/videos@@Role Play
porn/rough/videos@@Rough
porn/russian/videos@@Russian
porn/scat/videos@@Scat
porn/skinny/videos@@Skinny
porn/slut/videos@@Slut
porn/small-tits/videos@@Small Tits
porn/smoking/videos@@Smoking
porn/social-media/videos@@Social Media
porn/solo/videos@@Solo
porn/spanking/videos@@Spanking
porn/squirting/videos@@Squirting
porn/stockings/videos@@Stockings
porn/swingers/videos@@Swingers
porn/tattoo/videos@@Tattoo
porn/teen/videos@@Teen(18 + )
porn/threesome/videos@@Threesome
porn/toys/videos@@Toys
porn/transsexual/videos@@Transsexual
porn/upskirt/videos@@Upskirt
porn/vintage/videos@@Vintage
porn/vomit/videos@@Vomit
porn/voyeur/videos@@Voyeur
porn/webcam/videos@@Webcam
porn/wet-t-shirt/videos@@Wet T-Shirt
porn/wife/videos@@Wife
porn/wtf/videos@@WTF
porn/extreme-bdsm/videos@@BDSM
porn/extreme-bizarre/videos@@Bizarre
porn/extreme-blasphemy/videos@@Blasphemy
porn/extreme-cbt/videos@@CBT
porn/extreme-choking/videos@@Choking
porn/extreme-electro-play/videos@@Electro Play
porn/extreme-enema/videos@@Enema
porn/extreme-farting/videos@@Farting
porn/extreme-femdom/videos@@Femdom
porn/extreme-fetish/videos@@Fetish
porn/extreme-fisting/videos@@Fisting
porn/extreme-forced-orgasm/videos@@Forced Orgasm
porn/extreme-furry/videos@@Furry
porn/extreme-gagging/videos@@Gagging
porn/extreme-granny/videos@@Granny
porn/extreme-humiliation/videos@@Humiliation
porn/extreme-incest/videos@@Incest
porn/extreme-lactating/videos@@Lactating
porn/extreme-latex/videos@@Latex
porn/extreme-machine/videos@@Machine
porn/extreme-mask/videos@@Mask
porn/extreme-painal/videos@@Painal
porn/extreme-pegging/videos@@Pegging
porn/extreme-pissing/videos@@Pissing
porn/extreme-pregnant/videos@@Pregnant
porn/extreme-prolapse/videos@@Prolapse
porn/extreme-punishment/videos@@Punishment
porn/extreme-rope/videos@@Rope
porn/extreme-rough/videos@@Rough
porn/extreme-scat/videos@@Scat
porn/extreme-slave/videos@@Slave
porn/extreme-spanking/videos@@Spanking
porn/extreme-toilet/videos@@Toilet
porn/extreme-torture/videos@@Torture
porn/extreme-uniform/videos@@Uniform
porn/extreme-worship/videos@@Worship
porn/funny-humor/videos@@Humor
porn/funny-weird/videos@@Weird
porn/funny-wtf/videos@@WTF`;
}

function getHomeSections() {
    var listurl = "videos/recent@@Hàng Mới@@true";
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

// ĐÃ SỬA: Xóa bỏ hàm getUrlList thừa, giữ lại hàm chuẩn logic phân trang
function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = parseInt(filters.page) || 1;
        var path = filters.category ? filters.category : slug;
        
        if (path.startsWith("/")) path = path.substring(1);
        
        // Đảm bảo đuôi link danh mục có dấu / để tránh bị Server redirect 301/403
        if (!path.endsWith("/") && path.indexOf('?') === -1) {
            path += "/";
        }
        
        var targetUrl = BASEURL + "/" + path;
        
        if (path.indexOf("term") > -1) {
            // Đối với trang tìm kiếm / tag
            if (page > 1) {
                targetUrl = targetUrl.replace(/\/$/, ""); // Xóa dấu / cuối nếu có để nối param
                targetUrl += "/?page=" + page + "&size=0&range=0&sort=relevance";
            } else {
                targetUrl = targetUrl.replace(/\/$/, "");
                targetUrl += "/?size=0&range=0&sort=relevance";
            }
        } else {
            // Đối với danh mục thông thường (ví dụ: porn/anal/videos/)
            if (page > 1) {
                targetUrl += "?page=" + page;
            }
        }
        return targetUrl;
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/term/" + encodeURIComponent(keyword);
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



function parseListResponse(html) {
    try {
        var items = [];
        
        // Kiểm tra nếu HTML trả về là trang lỗi hoặc trang trống
        if (!html || html.indexOf('body') === -1) {
            return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
        }
        
        // Regex quét tìm mọi khối liên kết chứa ảnh thumbnail dạng: /giá_trị_id (thường là chuỗi số hoặc ký tự băm)
        // Cấu trúc Motherless: <a href="/[Mã_Số]"><img ... src="[Link_Ảnh]" alt="[Tiêu_Đề]" /></a>
        var regex = /<a[\s\S]*?href=["'](\/[A-F0-9]{7,15}|\/video\/[^"']+)["'][\s\S]*?>[\s\S]*?<img\s+class=["']static["'][\s\S]*?src=["']([^"']+)["'][\s\S]*?alt=["']([^"']+)["']/gi;
        
        var match;
        // Quét toàn bộ HTML từ trên xuống dưới
        while ((match = regex.exec(html)) !== null) {
            var url = match[1];
            var id = url.replace(BASEURL + "/", "");
            //https://cdn5-thumbs.motherlessmedia.com/thumbs/69A3E54-small-7.jpg
            var poster = "https://cdn5-thumbs.motherlessmedia.com/thumbs/" + id + "-small-7.jpg";
            var title = match[3].trim();
            
            // Bỏ qua nếu dính icon hoặc ảnh đại diện avatar người dùng
            if (poster.indexOf('avatar') > -1 || poster.indexOf('favicon') > -1 || !url) {
                continue;
            }
            
            // Chuẩn hóa URL video
            if (!url.startsWith("http")) {
                url = BASEURL + url;
            }
            
            // Chuẩn hóa URL ảnh poster (Xử lý nếu dính ảnh lười tải plc.gif)
            if (html.indexOf('data-src=') > -1) {
                // Nếu trang có dùng lazyload, ta bóc lại data-src kế cạnh khối đó
                var subBlock = html.substring(match.index, match.index + 400);
                var realImg = subBlock.match(/data-src=["']([^"']+)["']/i);
                if (realImg && realImg[1]) poster = realImg[1];
            }
            
            if (!poster.startsWith("http")) {
                poster = BASEURL + poster;
            }
            
            // Giải mã chữ lỗi hiển thị
            title = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
            
            // Kiểm tra trùng lặp ID trước khi push
            var isDuplicate = false;
            for (var j = 0; j < items.length; j++) {
                if (items[j].id === url) { isDuplicate = true; break; }
            }
            
            if (!isDuplicate) {
                items.push({
                    id: url,
                    title: title,
                    posterUrl: poster
                });
            }
        }
        
        // Nếu dùng Regex quét gắt quá vẫn rỗng, dùng phương án dự phòng cuối cùng: bóc chay thẻ <a>
        if (items.length === 0) {
            var fallbackMatches = html.match(/<div class=["']thumb-title["']>[\s\S]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
            if (fallbackMatches) {
                for (var k = 0; k < fallbackMatches.length; k++) {
                    var linkM = fallbackMatches[k].match(/href=["']([^"']+)["']/i);
                    var textM = fallbackMatches[k].match(/>([^<]+)<\/a>/i);
                    if (linkM && linkM[1]) {
                        var fUrl = linkM[1].startsWith("http") ? linkM[1] : BASEURL + linkM[1];
                        var fTitle = textM ? textM[1].trim() : "Video";
                        items.push({
                            id: fUrl,
                            title: fTitle,
                            posterUrl: "https://cdn5-static.motherlessmedia.com/images/plc.gif"
                        });
                    }
                }
            }
        }
        
        return JSON.stringify({
            items: items,
            pagination: { currentPage: 1, totalPages: 999 }
        });
        
    } catch (e) {
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
    }
}
//BASEURL = "https://motherless.xxx";
//var html = document.getElementsByTagName("html")[0].outerHTML;
//JSON.parse(parseListResponse(html));

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html, $url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var year = 2026;
    var direc = "????";
    var cast = "????";
    var status = "????";
    var duration = "1:09:00 | 16 | 16";
    var servers = [];
    
    try {
        var rmatch;
        var idvideo = $url.replace(BASEURL + "/", "");
        var limg = "https://cdn5-thumbs.motherlessmedia.com/thumbs/" + idvideo + "-small-7.jpg";
        //rmatch = html.match(/meta\s+property=\["']og:image["']\s+content=["']([^"']+)["']/i);
        // if (rmatch && rmatch[1]) { limg = rmatch[1]; }
        
        rmatch = html.match(/<title>([\s\S]*?)<\/title>/i);
        if (rmatch && rmatch[1]) { lname = rmatch[1].trim(); }
        
        rmatch = html.match(/meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
        
        var episodes = [];
        var serverMatches = html.match(/<video[\s\S]*?src=["']([^"']+)["']/i);
        
        if (serverMatches && serverMatches[1]) {
            lurl = serverMatches[1];
            episodes.push({
                id: $url,
                name: "Xem Ngay",
                slug: "tap-1"
            });
        }
        servers = [{
            name: "Server",
            episodes: episodes
        }];
        
    } catch (e) {
        //console.error("Lỗi parse dữ liệu: ", e);
    }
    
    return JSON.stringify({
        id: $url,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: lurl ? ldes + "\r\n\r\n" + lurl : ldes,
        servers: servers,
        quality: "HD",
        year: year,
        status: status,
        duration: duration,
        casts: cast,
        director: direc
    });
}
//BASEURL = "https://motherless.xxx";
//var html = document.getElementsByTagName("html")[0].outerHTML;
//JSON.parse(parseMovieDetail(html));



function parseDetailResponse(html, url) {
    try {
    var $link = "";
    var episodes = [];
    var serverMatches = html.match(/<video[\s\S]*?src=["']([^"']+)["']/i);
    if (serverMatches && serverMatches[1]) {
        $link = serverMatches[1]
    }
        var customjs = textJS();
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
SCRIPTURL = "https://script.google.com/macros/s/AKfycbwsvLFzWMdxvX9ZH-3wnP3GJzS58v0CtT_0mlEYeOz6cOsgen9IR3c6VPv_EssPXMFzwQ/exec?name=mortherless&type=js"; 
const style = document.createElement('style');
var customcss = 'body { background: black; overflow: hidden; }body * {background: black;display:none!important}';
style.innerHTML = customcss;
document.head.appendChild(style);

(function() {
    'use strict';
    // ─── BIẾN TOÀN CỤC CỦA SCRIPT ───
    var DEVELOPE = false;

    function GetlinkVideo() {
        var playlist = scanSources();
        var stream1 = playlist.activeSrc || '';
        var stream2 = window.location.href;
        showToast("Đang khởi chạy trình phát tốt hơn.", 5000, true);
        buildVideo(stream1, stream2, playlist);
    }


/*
     // === THÊM SERVER VÀ TẬP PHIM TÙY CHỈNH ===
    window.customPlaylist = {
      servers: [
        { label: 'Server VIP', src: 'https://vip.example.com/video.mp4' },
        { label: 'Server Backup', src: 'https://backup.example.com/video.mp4' }
      ],
      episodes: [
        { label: 'Tập 1', src: 'https://site.com/phim/tap-1' },
        { label: 'Tập 2', src: 'https://site.com/phim/tap-2' },
        { label: 'Tập 3', src: 'https://site.com/phim/tap-3' }
      ]
    };
    
    // Hardcode server & tập phim
servers.push({ label: 'Server 2', src: 'https://.../link2.mp4' });
servers.push({ label: 'Server 3', src: 'https://.../link3.mp4' });
episodes.push({ label: 'Tập 1', src: 'https://.../tap-1' });
episodes.push({ label: 'Tập 2', src: 'https://.../tap-2' });
    // === KẾT THÚC CUSTOM ===
     */
// ─── QUÉT NGUỒN PHÁT VÀ PLAYLIST TRƯỚC KHI XÓA DOM ───

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
            if (src && (src.indexOf('.mp4') > -1 || src.indexOf('.m3u8') > -1 || src.indexOf('embed') > -1)) {
                if (!activeSrc) activeSrc = src;
                if (!seen.has(src)) {
                    seen.add(src);
                    var lbl = 'Server ' + (servers.length + 1);
                    if (src.indexOf('embed') > -1) lbl = 'Nhúng ' + (servers.length + 1);
                    servers.push({ label: lbl, src: src, type: 'server' });
                }
            }
        }

        // 2. Quét thêm các nút/data-link chuyển server
        var allLinks = document.querySelectorAll('a, button, [role="button"], [data-link]');
        for (var k = 0; k < allLinks.length; k++) {
            var el2 = allLinks[k];
            var href = el2.href || el2.getAttribute('href') || el2.getAttribute('data-src') || el2.getAttribute('data-link') || '';
            var txt = (el2.textContent || el2.innerText || '').trim();
            if (!href || href === '#' || href === window.location.href || seen.has(href)) continue;
            if (/(server|sv|nguồn|source|embed|link)/i.test(txt + ' ' + el2.className)) {
                if (href.indexOf('.mp4') > -1 || href.indexOf('.m3u8') > -1 || href.indexOf('embed') > -1) {
                    seen.add(href);
                    servers.push({ label: txt || 'Server ' + (servers.length + 1), src: href, type: 'server' });
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
            if (a.className && /(^|\s)(ep|episode|tap|chapter|part|tapphim)(\d+|$)/i.test(a.className)) isEpisode = true;
            if (isEpisode) {
                episodes.push({ label: aTxt || 'Tập ' + (episodes.length + 1), src: aHref, type: 'episode' });
            }
        }

        // Merge custom servers & episodes từ window.customPlaylist (nếu có)
        if (typeof window.customPlaylist !== 'undefined' && window.customPlaylist) {
            if (window.customPlaylist.servers) {
                for (var s = 0; s < window.customPlaylist.servers.length; s++) {
                    var cs = window.customPlaylist.servers[s];
                    if (cs && cs.src && !seen.has(cs.src)) {
                        seen.add(cs.src);
                        servers.push({ label: cs.label || 'Custom Server', src: cs.src, type: 'server' });
                    }
                }
            }
            if (window.customPlaylist.episodes) {
                for (var e = 0; e < window.customPlaylist.episodes.length; e++) {
                    var ce = window.customPlaylist.episodes[e];
                    if (ce && ce.src) {
                        episodes.push({ label: ce.label || ('Custom Tập ' + (episodes.length + 1)), src: ce.src, type: 'episode' });
                    }
                }
            }
        }

        return { activeSrc: activeSrc, servers: servers, episodes: episodes };
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
            container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999999;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(container);
        }
        var toastEl = document.createElement('div');
        toastEl.innerHTML = message;
        toastEl.style.cssText = 'background:rgba(50,50,50,0.95);color:#fff;padding:12px 24px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.2);font-family:sans-serif;font-size:14px;min-width:200px;transition:all 0.3s ease;transform:translateX(120%);opacity:0;';
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
        container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:Segoe UI,Roboto,sans-serif;user-select:none;-webkit-user-select:none;';

        var video = document.createElement('video');
        video.id = 'main-video';
        video.style.cssText = 'width:100%;height:100%;object-fit:contain;cursor:pointer;background:#000;';
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.src = stream1;
        video.autoplay = true;
        video.muted = false;
        video.controls = false;

        var spinner = document.createElement('div');
        spinner.id = 'video-spinner';
        spinner.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;border:4px solid rgba(255,255,255,0.3);border-top:4px solid #fff;border-radius:50%;animation:spin 1s linear infinite;z-index:10;pointer-events:none;';
        var spinStyle = document.createElement('style');
        spinStyle.textContent = '@keyframes spin{0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);}}';
        document.head.appendChild(spinStyle);

        var controls = document.createElement('div');
        controls.id = 'video-controls';
        controls.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:12px 16px 20px;box-sizing:border-box;transition:opacity 0.3s;opacity:0;z-index:20;';

        var progressWrap = document.createElement('div');
        progressWrap.style.cssText = 'width:100%;height:6px;background:rgba(255,255,255,0.3);border-radius:3px;cursor:pointer;position:relative;margin-bottom:12px;';
        var progressBar = document.createElement('div');
        progressBar.style.cssText = 'height:100%;background:#e74c3c;width:0%;border-radius:3px;position:relative;pointer-events:none;';
        var progressHandle = document.createElement('div');
        progressHandle.style.cssText = 'position:absolute;right:-6px;top:-4px;width:14px;height:14px;background:#e74c3c;border-radius:50%;opacity:0;transition:opacity 0.2s;pointer-events:none;';
        progressBar.appendChild(progressHandle);
        progressWrap.appendChild(progressBar);
        progressWrap.onmouseenter = function() { progressHandle.style.opacity = '1'; };
        progressWrap.onmouseleave = function() { progressHandle.style.opacity = '0'; };

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
        var hasPlaylist = (playlistData && ((playlistData.servers && playlistData.servers.length > 1) || (playlistData.episodes && playlistData.episodes.length > 0)));
        if (hasPlaylist) {
            btnRow.appendChild(btnPlaylist);
        }

        controls.appendChild(progressWrap);
        controls.appendChild(btnRow);

        var bigPlayBtn = document.createElement('div');
        bigPlayBtn.id = 'big-play-btn';
        bigPlayBtn.textContent = '▶';
        bigPlayBtn.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;background:rgba(0,0,0,0.6);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;font-size:36px;cursor:pointer;z-index:15;';

        var seekOverlay = document.createElement('div');
        seekOverlay.id = 'seek-overlay';
        seekOverlay.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);color:#fff;padding:12px 24px;border-radius:8px;font-size:18px;font-weight:bold;pointer-events:none;opacity:0;transition:opacity 0.3s;z-index:30;';

        // Playlist Panel
        var playlistPanel = document.createElement('div');
        playlistPanel.id = 'playlist-panel';
        playlistPanel.style.cssText = 'position:fixed;top:0;right:0;width:300px;max-width:80%;height:100%;background:rgba(15,15,15,0.97);z-index:40;transform:translateX(100%);transition:transform 0.25s ease;overflow-y:auto;padding:20px;box-sizing:border-box;color:#fff;font-family:Segoe UI,Roboto,sans-serif;';

        var plHeader = document.createElement('div');
        plHeader.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.2);';
        plHeader.innerHTML = '<span style="font-size:16px;font-weight:bold;">📋 Playlist</span>';
        var plClose = document.createElement('button');
        plClose.textContent = '✕';
        plClose.style.cssText = 'background:none;border:none;color:#fff;font-size:18px;cursor:pointer;';
        plClose.onclick = function(e) { if(e)e.stopPropagation(); playlistPanel.style.transform = 'translateX(100%)'; };
        plHeader.appendChild(plClose);
        playlistPanel.appendChild(plHeader);

        function buildSection(title, items, onClick) {
            if (!items || items.length === 0) return;
            var sec = document.createElement('div');
            sec.style.cssText = 'margin-bottom:20px;';
            var secTitle = document.createElement('div');
            secTitle.textContent = title;
            secTitle.style.cssText = 'font-size:13px;text-transform:uppercase;opacity:0.6;margin-bottom:10px;';
            sec.appendChild(secTitle);
            for (var i = 0; i < items.length; i++) {
                (function(item) {
                    var btn = document.createElement('button');
                    btn.textContent = item.label;
                    btn.style.cssText = 'display:block;width:100%;text-align:left;padding:10px 12px;margin-bottom:6px;background:rgba(255,255,255,0.08);border:none;border-radius:6px;color:#fff;font-size:14px;cursor:pointer;transition:background 0.2s;';
                    btn.onmouseenter = function() { btn.style.background = 'rgba(231,76,60,0.3)'; };
                    btn.onmouseleave = function() { btn.style.background = 'rgba(255,255,255,0.08)'; };
                    btn.onclick = function(e) { if(e)e.stopPropagation(); onClick(item); };
                    sec.appendChild(btn);
                })(items[i]);
            }
            playlistPanel.appendChild(sec);
        }

        if (playlistData) {
            if (playlistData.servers && playlistData.servers.length > 1) {
                buildSection('🎥 Chuyển Server', playlistData.servers, function(item) {
                    switchSource(item.src);
                });
            }
            if (playlistData.episodes && playlistData.episodes.length > 0) {
                buildSection('📁 Tập phim', playlistData.episodes, function(item) {
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
        document.head.innerHTML = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
        document.head.appendChild(spinStyle);
        document.title = 'Video Player';

        var isPlaying = false;
        var isMuted = false;
        var currentSpeed = 1.0;
        var controlsTimeout = null;
        var isDraggingProgress = false;
        var isDraggingVideo = false;

        // ─── LOCALSTORAGE: LƯU / KHÔI PHỤC VỊ TRÍ ───
        // Key dựa trên thời lượng video: VIDEO_<phút>_<giây>
        // Cùng 1 URL (remote_control.php) nhưng video khác nhau sẽ có duration khác nhau -> key khác nhau
        function getDurationKey(duration) {
            if (!duration || isNaN(duration)) return null;
            var totalSec = Math.round(duration);
            var min = Math.floor(totalSec / 60);
            var sec = totalSec % 60;
            return 'VIDEO_' + min + '_' + sec;
        }

        var saveKey = null;
        var lastSaveTime = 0;
        var pendingRestoreTime = null;
        var hasRestored = false;

        function updateSaveKey() {
            if (video && video.duration && !isNaN(video.duration)) {
                var newKey = getDurationKey(video.duration);
                if (newKey && newKey !== saveKey) {
                    saveKey = newKey;
                    console.log('[Player] saveKey updated to:', saveKey);
                }
            }
        }

        function savePosition(force) {
            if (!video || video.ended || !video.currentTime || isNaN(video.currentTime)) return;
            if (!saveKey) return; // chưa có key thì chưa lưu
            if (!force) {
                var now = Date.now();
                if (now - lastSaveTime < 3000) return; // debounce 3 giây
                lastSaveTime = now;
            }
            try {
                // Chỉ lưu nếu đã xem quá 3s và còn hơn 5s cuối
                if (video.currentTime > 3 && (!video.duration || isNaN(video.duration) || video.currentTime < video.duration - 5)) {
                    localStorage.setItem(saveKey, JSON.stringify({
                        time: video.currentTime,
                        duration: video.duration || 0,
                        savedAt: Date.now()
                    }));
                }
            } catch (e) {}
        }

        function clearSavedPosition() {
            try { localStorage.removeItem(saveKey); } catch (e) {}
        }

        function restorePosition() {
            if (hasRestored) { console.log('[Player] already restored'); return true; }
            if (!saveKey) { console.log('[Player] no saveKey yet, will retry when duration known'); return false; }
            try {
                var saved = localStorage.getItem(saveKey);
                console.log('[Player] saveKey:', saveKey, 'saved:', saved ? 'found' : 'null');
                if (saved) {
                    var data = JSON.parse(saved);
                    console.log('[Player] parsed data:', JSON.stringify(data));
                    if (data && data.time && data.time > 3) {
                        // Nếu đã biết duration, kiểm tra xem đây có phải cùng phim không
                        if (video.duration && !isNaN(video.duration) && data.duration && !isNaN(data.duration)) {
                            var durDiff = Math.abs(video.duration - data.duration);
                            if (durDiff > 3) {
                                console.log('[Player] duration mismatch (saved:', data.duration, 'current:', video.duration, '), this is a different movie');
                                clearSavedPosition(); // xóa data cũ của phim khác
                                return false;
                            }
                        }
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
                                showToast('⏩ Đã tiếp tục phát từ ' + formatTime(data.time), 4000, true);
                                return true;
                            } catch (seekErr) {
                                console.warn('[Player] seek failed, will retry on canplay:', seekErr);
                                pendingRestoreTime = data.time;
                                return false;
                            }
                        }
                    }
                }
            } catch (e) { console.error('[Player] restore error:', e); }
            return false;
        }

        function applyPendingRestore() {
            if (pendingRestoreTime !== null && video.duration && !isNaN(video.duration)) {
                // Kiểm tra duration khớp trước khi apply
                try {
                    var saved = localStorage.getItem(saveKey);
                    if (saved) {
                        var data = JSON.parse(saved);
                        if (data.duration && !isNaN(data.duration)) {
                            var durDiff = Math.abs(video.duration - data.duration);
                            if (durDiff > 3) {
                                console.log('[Player] pending restore rejected: duration mismatch');
                                pendingRestoreTime = null;
                                return false;
                            }
                        }
                    }
                } catch (e) {}
                if (pendingRestoreTime < video.duration - 5) {
                    try {
                        video.currentTime = pendingRestoreTime;
                        hasRestored = true;
                        console.log('[Player] applied pending restore:', pendingRestoreTime);
                        showToast('⏩ Đã tiếp tục phát từ ' + formatTime(pendingRestoreTime), 4000, true);
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
        window.addEventListener('beforeunload', function() {
            savePosition(true);
        });

        function switchSource(newSrc) {
            var wasPlaying = !video.paused;
            var prevTime = video.currentTime;
            // Lưu vị trí cũ trước khi đổi
            savePosition(true);
            stream1 = newSrc;
            saveKey = null; // reset key, sẽ cập nhật lại khi có duration mới
            hasRestored = false;
            pendingRestoreTime = null;
            video.src = newSrc;
            video.load();
            spinner.style.display = 'block';
            video.onloadeddata = function() {
                spinner.style.display = 'none';
                updateSaveKey();
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
            btn.style.cssText = 'background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:4px 8px;border-radius:4px;transition:background 0.2s;outline:none;';
            btn.onmouseenter = function() { btn.style.background = 'rgba(255,255,255,0.2)'; };
            btn.onmouseleave = function() { btn.style.background = 'none'; };
            return btn;
        }

        function showSeekOverlay(text) {
            seekOverlay.textContent = text;
            seekOverlay.style.opacity = '1';
            clearTimeout(seekOverlay._timer);
            seekOverlay._timer = setTimeout(function() { seekOverlay.style.opacity = '0'; }, 800);
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
            timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
        }

        function seekVideo(seconds) {
            var newTime = video.currentTime + seconds;
            if (newTime < 0) newTime = 0;
            if (video.duration && !isNaN(video.duration) && newTime > video.duration) newTime = video.duration;
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
            // Lưu vị trí hiện tại trước khi reload
            savePosition(true);
            video.src = stream1 + (stream1.indexOf('?') > -1 ? '&' : '?') + '_reload=' + Date.now();
            video.load();
            video.onloadeddata = function() {
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
            video.onerror = function() {
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
            console.log('[Player] loadeddata, readyState:', video.readyState, 'duration:', video.duration, 'currentTime:', video.currentTime);
            spinner.style.display = 'none';
            updateProgress();
            if (isMuted && video.muted) {
                video.muted = false;
                isMuted = false;
                btnMute.textContent = '🔊';
            }
            updateSaveKey();
            restorePosition();
        });

        video.addEventListener('loadedmetadata', function() {
            console.log('[Player] loadedmetadata, duration:', video.duration);
            updateSaveKey();
            applyPendingRestore();
        });

        video.addEventListener('durationchange', function() {
            console.log('[Player] durationchange, duration:', video.duration);
            updateSaveKey();
            applyPendingRestore();
        });

        video.addEventListener('canplay', function() {
            console.log('[Player] canplay, readyState:', video.readyState, 'currentTime:', video.currentTime, 'seekable:', video.seekable ? video.seekable.length : 0);
            updateSaveKey();
            if (!hasRestored) {
                if (pendingRestoreTime !== null) {
                    applyPendingRestore();
                } else {
                    restorePosition();
                }
            }
        });

        video.addEventListener('waiting', function() { spinner.style.display = 'block'; });
        video.addEventListener('playing', function() { spinner.style.display = 'none'; });
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

        btnPlay.addEventListener('click', function(e) { e.stopPropagation(); togglePlay(); });
        btnMute.addEventListener('click', function(e) { e.stopPropagation(); toggleMute(); });
        btnReload.addEventListener('click', function(e) { e.stopPropagation(); reloadVideo(); });
        btnFullscreen.addEventListener('click', function(e) { e.stopPropagation(); toggleFullscreen(); });
        if (hasPlaylist) {
            btnPlaylist.addEventListener('click', function(e) {
                e.stopPropagation();
                playlistPanel.style.transform = 'translateX(0)';
            });
        }

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
        document.addEventListener('mouseup', function() { isDraggingProgress = false; });

        container.addEventListener('mousemove', showControls);
        container.addEventListener('click', function() { showControls(); });
        bigPlayBtn.addEventListener('click', function(e) { e.stopPropagation(); togglePlay(); });

        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            showControls();
            switch(e.key) {
                case 'ArrowLeft': e.preventDefault(); e.shiftKey ? seekVideo(-30) : (e.ctrlKey || e.altKey) ? seekVideo(-5) : seekVideo(-10); break;
                case 'ArrowRight': e.preventDefault(); e.shiftKey ? seekVideo(30) : (e.ctrlKey || e.altKey) ? seekVideo(5) : seekVideo(10); break;
                case ' ': case 'k': case 'K': e.preventDefault(); togglePlay(); break;
                case 'ArrowUp': e.preventDefault(); video.volume = Math.min(1, video.volume + 0.1); showToast('Âm lượng: ' + Math.round(video.volume * 100) + '%'); break;
                case 'ArrowDown': e.preventDefault(); video.volume = Math.max(0, video.volume - 0.1); showToast('Âm lượng: ' + Math.round(video.volume * 100) + '%'); break;
                case 'm': case 'M': e.preventDefault(); toggleMute(); break;
                case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
                case 'r': case 'R': e.preventDefault(); reloadVideo(); break;
                case 'Home': e.preventDefault(); video.currentTime = 0; showToast('Về đầu video'); break;
                case 'End': e.preventDefault(); if (video.duration && !isNaN(video.duration)) video.currentTime = video.duration - 1; break;
                case '>': case '.': e.preventDefault(); currentSpeed = Math.min(4, currentSpeed + 0.25); video.playbackRate = currentSpeed; speedIndicator.textContent = currentSpeed.toFixed(1) + 'x'; showToast('Tốc độ: ' + currentSpeed.toFixed(1) + 'x'); break;
                case '<': case ',': e.preventDefault(); currentSpeed = Math.max(0.25, currentSpeed - 0.25); video.playbackRate = currentSpeed; speedIndicator.textContent = currentSpeed.toFixed(1) + 'x'; showToast('Tốc độ: ' + currentSpeed.toFixed(1) + 'x'); break;
                case '0': e.preventDefault(); video.currentTime = 0; break;
                case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': e.preventDefault(); if (video.duration && !isNaN(video.duration)) { video.currentTime = video.duration * (parseInt(e.key) / 10); } break;
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
        }, { passive: true });

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
        }, { passive: true });

        var regionStartX = 0;
        var regionOverlay = null;

        video.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            isDraggingVideo = false;
            regionStartX = e.clientX;
            regionOverlay = document.createElement('div');
            regionOverlay.style.cssText = 'position:fixed;top:0;height:100vh;background:rgba(231,76,60,0.3);pointer-events:none;z-index:25;';
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
                    showToast('▶ Phát vùng ' + formatTime(startTime) + ' - ' + formatTime(endTime));
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
            console.log('Video autoplay thành công với tiếng');
            showToast('Đã phát video thành công. Xem vui nhé friend', 5000, true);
            bigPlayBtn.style.display = 'none';
        }).catch(function(err) {
            console.log('Autoplay bị chặn, thử muted...');
            video.muted = true;
            isMuted = true;
            btnMute.textContent = '🔇';
            video.play().then(function() {
                spinner.style.display = 'none';
                btnPlay.textContent = '⏸';
                isPlaying = true;
                showToast('Đã tự phát (chưa bật tiếng) - Nhấn M để bật tiếng');
                bigPlayBtn.style.display = 'none';
            }).catch(function(err2) {
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
})();





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
