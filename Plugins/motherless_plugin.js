BASEURL = "https://motherless.xxx";
function getManifest() {
    return JSON.stringify({
        "id": "motherless",
        "name": "Mortherless",
        "description": "XXX Hay",
        "version": "1.0",
        "BASEURL": BASEURL,
        "iconUrl": "https://motherless.xxx/images/logo-header-3.svg",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}

// Hàm tách menu bằng list
function buildMenu(listurl){
// 2. Khởi tạo mảng chứa kết quả
let menulist = [];
let regex = /^([^@\r\n]+)@@([^@\r\n]+)(?:@@([^@\r\n]+))?/gm;
let match;

// 4. Vòng lặp duyệt qua từng hàng bằng RegExp
while ((match = regex.exec(listurl)) !== null) {
    let link = match[1].trim();
    let name = match[2].trim();
    let check = match[3] ? match[3].trim() : undefined; // Lấy giá trị check nếu có

    let item = {};

    // 5. Kiểm tra điều kiện biến check để tạo cấu trúc Object
    if (check === "false") {
        item = { 
            "slug": link, 
            "title": name, 
            "type": "Horizontal" 
        };
    } else if (check === "true") {
        item = { 
            "slug": link, 
            "title": name, 
            "type": "Grid" 
        };
    } else {
        // Trường hợp không có biến check (undefined)
        item = { 
            "slug": link, 
            "name": name 
        };
    }

    // 6. Push item vào mảng menulist
    menulist.push(item);
}
// 7. In kết quả ra để kiểm tra
    return menulist
}

function getLISTmenu(){
 return `
porn/gay-group/videos@@Gay Group
porn/gay-incest/videos@@Gay Incest
porn/transsexual-anal/videos@@Trans Anal
porn/transsexual-ladyboy/videos@@LTrans adyboy
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
porn/funny-wtf/videos@@WTF
 `
}
//https://motherless.xxx/videos/recent
/*
{ "slug": "", "title": "", "type": "Horizontal" },
{ "slug": "", "title": "", "type": "Grid" }
*/

function getHomeSections() {
    var listurl = `
    videos/recent@@Hàng Mới@@true
    `
    var  menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

// https://pornone.com/anal/
/*
    { "slug": "", "name": ""},
    { "slug": "", "name": ""}
    
    
*/
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
// URL GENERATION (Bóc tách slug sạch theo khuôn mẫu mới)
// =============================================================================

// https://motherless.xxx/porn/anal/videos?page=4

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        // Prioritize category filter if present
        if (filtersJson.category) {
            return BASEURL + "/" + filters.category + "/?page=" + page;
        }
        
        if (page > 1) {
            // https://motherless.xxx/term/videos/girl?range=0&size=0&sort=relevance&page=3
            if (slug.indexOf("term") > -1) {
                return BASEURL + "/" + slug + "/?range=0&size=0&sort=relevance&page=" + page;
            } else {
                return BASEURL + "/" + slug + "/?page=" + page;
            }
        }
        return BASEURL + "/" + slug;
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}


// https://motherless.xxx/term/girl
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
        // Tách từng item phim để tránh regex chạy sai giữa các item
        var chunks = html.split('class="mobile-thumb-inner"');
        
        // Bắt đầu từ 1 vì phần tử 0 là phần html trước class đầu tiên
        for (var i = 1; i < chunks.length - 1; i++) {
            var blockHtml = chunks[i];
            
            // Kiểm tra xem block này có chứa các thẻ cốt lõi của video không
            if (!blockHtml.match(/img|href|video|src/i)) {
                continue;
            }
            
            // 1. Lấy link phim
            var urlMatch = blockHtml.match(/a[\s\S]*?href="([^"]+)"/i);
            var url = "";
            var title = ""; // Khai báo một lần ở đây để dùng cho cả block
            
            if (urlMatch && urlMatch[1]) {
                url = urlMatch[1];
            } else {
                // Nếu không có url hợp lệ, bỏ qua chunk này luôn
                continue;
            }
            
            if (!url.startsWith("http")) {
                url = BASEURL + url;
            }
            
            // 2. Lấy Title
            var rmatch = blockHtml.match(/alt="([^"]+)"/i);
            if (rmatch && rmatch[1]) {
                title = rmatch[1].trim();
            } else {
                rmatch = blockHtml.match(/thumb-title[\s\S]*?class="title"[\s\S]*?>([\s\S]*?)<\/a>/i);
                if (rmatch && rmatch[1]) {
                    title = rmatch[1].trim();
                }
            }
            
            // 3. Lấy Poster
            var posterMatch = blockHtml.match(/data-src="([^"]+)"/i) || blockHtml.match(/src="([^"]+)"/i);
            var poster = posterMatch ? posterMatch[1] : "https://cdn5-static.motherlessmedia.com/images/plc.gif";
            if (poster && !poster.startsWith("http")) {
                poster = BASEURL + poster;
            }
            
            items.push({
                id: url,
                title: title,
                posterUrl: poster
            });
        }
        
        return JSON.stringify({
            items: items,
            pagination: { currentPage: 1, totalPages: 999 }
        });
    } catch (e) {
        console.error("Lỗi Parse:", e);
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
        // 1. Parse Meta Tags
        var rmatch;
        rmatch = html.match(/meta\s+property=\"og:image\"\s+content=\"([^"]+)\"/i);
        if (rmatch && rmatch[1]) { limg = rmatch[1]; }
        
        rmatch = html.match(/<h1 class="lab-pinned-child">([\s\S]*?)<\/h1>/i);
        if (rmatch && rmatch[1]) { lname = rmatch[1]; }
        
        rmatch = html.match(/meta\s+name=\"description\"\s+content=\"([^"]+)\"/i);
        if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
        
        var episodes = [];
        

        var serverMatches = html.match(/<video[\s\S]*?src=\"([\s\S]*?)"/i);
        if (serverMatches && serverMatches[1]) {
            lurl = serverMatches[1];
            // Nếu tìm thấy các nút server
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
    
    // Trả về kết quả (Dù lỗi hay không lỗi vẫn return đúng cấu trúc object mong muốn)
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


// =================================================================
// TẦNG 1: Xử lý trang xem phim gốc (link_xem_phim)
// =================================================================
function parseDetailResponse(html, url) {
    try {
        var customJs = `
// Script chạy cho server heovl

function initCustomVideoFix() {
    const style = document.createElement('style');
    
    // Dùng dấu nháy đơn và nối chuỗi bằng dấu cộng để dễ nhìn, không bị trùng backtick
    var customcss = 'body { background: black; overflow: hidden; }#comments,header,footer,.entry-actions,.entry-header,.entry-info,.entry-content,#related-posts,.entry-content + .mt-2 {display:none}body * {background: black;}';
    
    style.innerHTML = customcss; // ĐÃ SỬA: Xóa dấu nháy đơn thừa
    document.head.appendChild(style);
    
    if (typeof jwplayer === "function") {
        const player = jwplayer("previewPlayer");
        if (player && typeof player.getMute === "function") {
            if (player.getMute()) {
                player.setMute(false);
                console.log("Đã bật tiếng video!");
            }
            player.setVolume(100);
        }
    }
    
    const checkAndClick = setInterval(() => {
        const skipButton = document.getElementById("skip-ad");
        
        if (skipButton) {
            skipButton.click();
            console.log("🎯 Đã tìm thấy và bấm nút thành công! Dừng script.");
            clearInterval(checkAndClick); // Dừng lại ngay lập tức
        } else {
            console.log("⏳ Vẫn đang tìm nút...");
        }
    }, 200);
    
    // Giới hạn tối đa 20 giây để tự động dọn dẹp bộ nhớ nếu nút không bao giờ xuất hiện
    setTimeout(() => {
        clearInterval(checkAndClick);
        console.log("⏱️ Đã quá 20 giây, dừng tìm kiếm.");
    }, 20000);
    
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}

`;
        
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

// KHỚP MẪU ROPHIMFAKE: Trả về chuỗi text thuần túy thay vì gọi JSON.stringify
//function parseCategoriesResponse(html) { return "[]"}
function parseCategoriesResponse(apiResponseJson) {
var listurl = getLISTmenu();
var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}
function parseCountriesResponse(html) { return "[]"}
function parseYearsResponse(html) { return "[]"}
