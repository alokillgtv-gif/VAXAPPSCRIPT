var BASEURL = "https://motherless.xxx";

function getManifest() {
    return JSON.stringify({
        "id": "motherless",
        "name": "Motherless",
        "description": "XXX Hay",
        "version": "1.2",
        "baseUrl": BASEURL,
        "iconUrl": "https://static.cdnsolutions.media/xh-desktop/images/favicon/favicon-v2-256x256.ico",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
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
        var targetUrl = BASEURL + "/" + path;
        
        if (path.indexOf("term") > -1) {
            targetUrl += "/?range=0&size=0&sort=relevance";
            if (page > 1) targetUrl += "&page=" + page;
        } else {
            if (page > 1) {
                // Kiểm tra xem cấu trúc url gốc đã có dấu ? chưa
                targetUrl += (targetUrl.indexOf('?') > -1 ? '&' : '/?') + "page=" + page;
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

function parseListResponse(html) {
    try {
        var items = [];
        
        // Cắt chuỗi theo class bao bọc bên ngoài mỗi ô video (Hỗ trợ cả giao diện mobile lẫn chuẩn)
        var chunks = html.split('class="mobile-thumb-inner"');
        if (chunks.length <= 1) {
            // Dự phòng nếu hệ thống đổi class hoặc dùng giao diện PC
            chunks = html.split('class="thumb-container"');
        }
        
        // Duyệt toàn bộ mảng (i < chunks.length) để không bỏ sót phần tử cuối cùng
        for (var i = 1; i < chunks.length; i++) {
            var blockHtml = chunks[i];
            
            // Bỏ qua các khối HTML rác hoặc quảng cáo không có tài nguyên
            if (!blockHtml.match(/img|href|video|src/i)) {
                continue;
            }
            
            // 1. Tách LINK VIDEO: Dùng [\s\S]*? để nuốt gọn mọi dấu xuống dòng/khoảng trắng trong thẻ <a>
            var urlMatch = blockHtml.match(/<a[\s\S]*?href=["']([^"']+)["']/i);
            var url = "";
            if (urlMatch && urlMatch[1]) {
                url = urlMatch[1];
            } else {
                continue; // Không bóc được URL của item này thì bỏ qua, chạy tiếp item sau
            }
            
            // Chuẩn hóa link video đầy đủ
            if (!url.startsWith("http")) {
                url = url.startsWith("/") ? BASEURL + url : BASEURL + "/" + url;
            }
            
            // 2. Tách TIÊU ĐỀ: Tìm trong alt trước, nếu không có thì quét qua class text/title
            var title = "";
            var rmatch = blockHtml.match(/alt=["']([^"']+)["']/i);
            if (rmatch && rmatch[1]) {
                title = rmatch[1].trim();
            } else {
                rmatch = blockHtml.match(/class=["']title["'][^>]*>([\s\S]*?)<\/a>/i) ||
                    blockHtml.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i);
                if (rmatch && rmatch[1]) {
                    title = rmatch[1].trim();
                }
            }
            
            // Loại bỏ các tag HTML lọt vào tiêu đề (nếu có)
            title = title.replace(/<[^>]*>/g, "");
            
            // 3. Tách POSTER: Hỗ trợ ảnh lười tải (data-src, data-original) và ảnh thường (src)
            var posterMatch = blockHtml.match(/data-src=["']([^"']+)["']/i) ||
                blockHtml.match(/data-original=["']([^"']+)["']/i) ||
                blockHtml.match(/src=["']([^"']+)["']/i);
            
            var poster = posterMatch ? posterMatch[1] : "https://cdn5-static.motherlessmedia.com/images/plc.gif";
            
            if (poster && !poster.startsWith("http")) {
                poster = poster.startsWith("/") ? BASEURL + poster : BASEURL + "/" + poster;
            }
            
            // Giải mã thực thể HTML tránh lỗi hiển thị chữ lỗi thời
            title = title.replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">");
            
            items.push({
                id: url,
                title: title,
                posterUrl: poster
            });
        }
        
        // Trả về chuỗi JSON theo cấu trúc chuẩn của plugin
        return JSON.stringify({
            items: items,
            pagination: { currentPage: 1, totalPages: 999 }
        });
        
    } catch (e) {
        console.error("Lỗi nghiêm trọng trong parseListResponse:", e);
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
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
    var year = 2026;
    var direc = "????";
    var cast = "????";
    var status = "????";
    var duration = "1:09:00 | 16 | 16";
    var servers = [];
    
    try {
        var rmatch;
        rmatch = html.match(/meta\s+property=\"og:image\"\s+content=\"([^"]+)\"/i);
        if (rmatch && rmatch[1]) { limg = rmatch[1]; }
        
        rmatch = html.match(/<h1 class="lab-pinned-child">([\s\S]*?)<\/h1>/i);
        if (rmatch && rmatch[1]) { lname = rmatch[1].replace(/<[^>]*>/g, "").trim(); }
        
        rmatch = html.match(/meta\s+name=\"description\"\s+content=\"([^"]+)\"/i);
        if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
        
        var episodes = [];
        var serverMatches = html.match(/<video[\s\S]*?src=\"([^"]+)\"/i);
        if (serverMatches && serverMatches[1]) {
            lurl = serverMatches[1];
            episodes.push({
                id: serverMatches[1],
                name: "Xem Ngay",
                slug: "tap-1"
            });
        }
        servers = [{
            name: "Server",
            episodes: episodes
        }];
        
    } catch (e) {
        console.error("Lỗi parse dữ liệu: ", e);
    }
    
    return JSON.stringify({
        id: lurl,
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

function parseDetailResponse(html, url) {
    try {
        var customJs = `
function initCustomVideoFix() {
    const style = document.createElement('style');
    var customcss = 'body { background: black; overflow: hidden; }#comments,header,footer,.entry-actions,.entry-header,.entry-info,.entry-content,#related-posts,.entry-content + .mt-2 {display:none}body * {background: black;}';
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
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}`;
        
        return JSON.stringify({
            url: "",
            headers: {
                "Referer": url,
                "Origin": url,
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
