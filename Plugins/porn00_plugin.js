BASEURL = "https://www.porn00.tv";

function getManifest() {
    return JSON.stringify({
        "id": "porn00",
        "name": "Porn00",
        "description": "Nguồn XXX Hay",
        "version": "1.0",
        "BASEURL": "https://www.porn00.tv",
        "iconUrl": "https://krx18.com/wp-content/uploads/2022/10/krx18B.png",
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}
// https://www.porn00.tv/latest-vids/4/
function getHomeSections() {
    return JSON.stringify([
        { "slug": "/latest-vids/", "title": "Phim Có Nội Dung", "type": "Grid" }
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
// ===================================================================
function getUrlList(slug, filtersJson) {
    try {
        // 1. Kiểm tra nếu slug là link tuyệt đối (chứa http) và không có bộ lọc thì trả về luôn
        if (slug && slug.indexOf("http") > -1 || slug.indexOf("search/") > -1) {
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
        if (page > 1 && resultUrl.indexOf("filter=latest") == -1) {
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
// https://www.porn00.tv/category-name/4k/6/
// https://www.porn00.tv/latest-vids/4/

//BASEURL = "https://www.trannymovs.com";
//filtersJson = '{"page":5,"category":[{"slug":"/categories/ladyboy/","name":"ladyboy"}]}';
//filtersJson = '{"page":13}';
//console.log(getUrlList("", filtersJson));
// https://www.porn00.tv/searching/blacked/

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/searching/" + encodeURIComponent(keyword) + "/";
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
<div class=[^>]+item[^>]*>[\\s\\S]*?
<a[^>]+href=["']([^"']+)["'][^>]*
title=["']([^"']+)["'][^>]*>[\\s\\S]*?
<img[^>]+data-original=["']([^"']+)["']
`;
        regexList = regexList.replace(/\r|\n|\t/g, "");
        regmath = new RegExp(regexList, "g");
//regmath.exec(html)
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
///*
//html = $("html")[0].outerHTML;
//JSON.parse(parseListResponse(html));
// Bỏ dấu / ở đầu chuỗi
//*/

function parseSearchResponse(html) {
    return parseListResponse(html);
}




function parseMovieDetail(html,$url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var streamUrl = ""; // ĐÃ SỬA: Khai báo rõ ràng biến streamUrl tránh lỗi Global leak

    var rmatch = html.match(/link\s+rel="canonical"\s+href=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1] }

    rmatch = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/<title>([^<]+)/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    var epi = [];
    var script = html.match(/var\s+flashvars\s+=\s+({[\s\S]*?}\;)/i);
    if(script && script[1]){
    var jsonObj = new Function(`return ${script[1]}`)();
        if(jsonObj.video_alt_url && jsonObj.video_alt_url.match(/http|.mp4/)){
            stream1 = jsonObj.video_alt_url;
            streamname1 = "Độ Phân Giải: " + jsonObj.video_alt_url_text;
            stream2 = jsonObj.video_url;
            streamname2 = "Độ Phân Giải: " + jsonObj.video_url_text;
            epi.push({ id: stream1, name: streamname1, slug: "full" });
            epi.push({ id: stream2, name: streamname2, slug: "full" })
        }
        else{
            stream1 = jsonObj.video_url;
            streamname1 = "Độ Phân Giải: " + jsonObj.video_url_text;
            epi.push({ id: stream1, name: streamname1, slug: "full" });
        }
    }
    // var stream = 'https://agokda.cdnlab.live/stream/X9mBBkyCNC1euSox903wew/1783632790/0/431/431.m3u8';
    var $return = {
        id: $url,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: "",
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
    }
    var $objreturn = $return;
    $return.description = ldes + "\r\n\r\n\r\n\r\n\r\n\r\n" + JSON.stringify($objreturn);
    return JSON.stringify($return);
}

/*
BASEURL = "https://www.justporn.com";
var html = $("html")[0].outerHTML;
var $url = "https://www.justporn.com/video/18058/hot-babe-remy-cheats-with-bbc/";
JSON.parse(parseMovieDetail(html,$url))
*/

function parseDetailResponse(html,url) {
    try {
        
        var customjs = textJS(html, url);

    // {"embed_url":"https:\/\/play.playkrx18.site\/play\/6a4f1c63ee633ccb0191a32f","type":"iframe"}
    // Đọc trực tiếp từ thuộc tính của BaseJSON đã lưu ở bước đầu tiên
        return JSON.stringify({
    "url": "",
    "headers": {
        "Referer": BASEURL,
        "Origin": BASEURL,
        mimeType: "application/x-mpegURL",
        isEmbed: true,
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

function parseEmbedResponse(html, sourceUrl) {
        
        var link = sourceUrl;
        var customjs = textJS(html, sourceUrl);

        return JSON.stringify({
            url: link,
            isEmbed: false, // Kết thúc, đây là link stream cuối
            mimeType: "application/x-mpegURL", // Báo App đây là HLS
            headers: { "Referer": BASEURL,
            "Custom-Js": customjs.trim()
                
            },
        });
    
    return JSON.stringify({ url: "", isEmbed: false });
}

function textJS(html, $url) {
    // Sử dụng biến $url từ tham số truyền vào thay vì ghi cứng link
    return `
SCRIPTURL = "https://script.google.com/macros/s/AKfycbwsvLFzWMdxvX9ZH-3wnP3GJzS58v0CtT_0mlEYeOz6cOsgen9IR3c6VPv_EssPXMFzwQ/exec?name=porn00&type=js"; 
function showToast(message, duration = 7000) {
    let container = document.getElementById('global-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '99999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        });
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.innerHTML = message;
    
    Object.assign(toast.style, {
        background: 'rgba(50, 50, 50, 0.95)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        minWidth: '200px',
        transition: 'all 0.3s ease',
        transform: 'translateX(120%)',
        opacity: '0'
    });
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        
        setTimeout(() => {
            toast.remove();
            if (container.childElementCount === 0) {
                container.remove();
            }
        }, 300);
    }, duration);
}

function injectScriptAfterLoad(scriptUrl) {
    function doFetchAndInject() {
        console.log('⏳ Đang tiến hành fetch code từ:', scriptUrl);
        
        fetch(scriptUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Mã phản hồi từ Server không tốt: ' + response.status);
                }
                return response.text();
            })
            .then(codeText => {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                // Đổ thẳng nội dung code dạng chữ vào trong thẻ script
                script.textContent = codeText;
                
                document.body.appendChild(script);
                console.log('🎯 Đã fetch và thực thi Script thành công!');
            })
            .catch(error => {
                console.error('❌ Lỗi không thể fetch hoặc chạy script:', error);
            });
    }
    
    // Thay vì đợi 'load' (quá muộn), ta kiểm tra nếu không còn ở trạng thái 'loading' thì chạy luôn
    if (document.readyState !== 'loading') {
        doFetchAndInject();
    } else {
        // Nếu web thực sự đang load dữ liệu thô, đợi DOMContentLoaded cho nhanh (không cần đợi ảnh/video tải xong)
        document.addEventListener('DOMContentLoaded', doFetchAndInject);
    }
}

function initCustomVideoFix() {
    // SỬA: Lấy động giá trị từ tham số $url truyền vào hàm textJS bên ngoài
    
    if (SCRIPTURL && SCRIPTURL !== "undefined") {
        injectScriptAfterLoad(SCRIPTURL);
    }
    
    const style = document.createElement('style');
    var customcss = 'body { background: black; overflow: hidden; }#comments,header,footer,.entry-actions,.entry-header,.entry-info,.entry-content,#related-posts,.entry-content + .mt-2 {display:none}body * {background: black;}';
    
    style.innerHTML = customcss;
    document.head.appendChild(style);

    if (typeof jwplayer === "function") {
        const player = jwplayer("previewPlayer");
        if (player && typeof player.getMute === "function") {
            if (player.getMute()) {
                player.setMute(false);
                showToast("Đã bật tiếng", 3000); // SỬA: Bỏ "duration ="
            }
            player.setVolume(100);
        }
    }
    
    let isSkipping = false;

    const checkAndClick = setInterval(() => {
        const skipButton = document.getElementById("skip-ad");
        
        if (skipButton) {
            const style = window.getComputedStyle(skipButton);
            if (style.display === 'none' || style.visibility === 'hidden') return;

            skipButton.click();
            console.log("🎯 Đã phát hiện và kích hoạt nút bỏ qua quảng cáo!");

            if (!isSkipping) {
                isSkipping = true;
                showToast("Đã bỏ qua quảng cáo", 3000); // SỬA: Bỏ "duration ="
                setTimeout(() => { isSkipping = false; }, 2000);
            }
        }
    }, 250);
    
    // Lưu ý: Đảm bảo hàm runScript() này đã được định nghĩa ở đâu đó trong hệ thống của bạn
    if (typeof runScript === "function") {
        runScript("sssssssss");
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
/category-name/720p/@@720p
/category-name/amateur/@@amateur
/category-name/american/@@American
/category-name/anal/@@anal
/category-name/anal-fingering/@@anal fingering
/category-name/arab/@@arab
/category-name/asian/@@asian
/category-name/asmr/@@ASMR
/category-name/ass-licking/@@ass licking
/category-name/ass-worship/@@ass worship
/category-name/babe/@@babe
/category-name/ballerina/@@ballerina
/category-name/bdsm/@@bdsm
/category-name/bedroom/@@Bedroom
/category-name/big-ass/@@big ass
/category-name/big-dick/@@big dick
/category-name/big-tits/@@big tits
/category-name/bisexual/@@bisexual
/category-name/black-hair/@@black hair
/category-name/blonde/@@blonde
/category-name/blowjob/@@blowjob
/category-name/blue-hair/@@blue hair
/category-name/boss/@@boss
/category-name/brazilian/@@brazilian
/category-name/brown-hair/@@brown hair
/category-name/brunette/@@brunette
/category-name/bubble-butt/@@bubble butt
/category-name/business-woman/@@business woman
/category-name/car-bus-sex/@@car/bus sex
/category-name/casting/@@casting
/category-name/cheating/@@cheating
/category-name/chinese/@@chinese
/category-name/christmas/@@christmas
/category-name/cosplay/@@cosplay
/category-name/couples-fantasies/@@couples fantasies
/category-name/cowgirl/@@cowgirl
/category-name/creampie/@@creampie
/category-name/criminal/@@criminal
/category-name/cuckold/@@cuckold
/category-name/cumshot/@@cumshot
/category-name/czech/@@czech
/category-name/deep-throat/@@deep throat
/category-name/dildo/@@dildo
/category-name/doctor/@@doctor
/category-name/doctor-nurse/@@doctor/nurse
/category-name/doggy/@@doggy
/category-name/doggystyle/@@doggystyle
/category-name/domination/@@domination
/category-name/double-penetration/@@double penetration
/category-name/ebony/@@ebony
/category-name/face-fuck/@@face fuck
/category-name/face-sitting/@@face sitting
/category-name/facial/@@facial
/category-name/family/@@family
/category-name/feet/@@feet
/category-name/femdom/@@femdom
/category-name/first-anal/@@first anal
/category-name/foot-fetish/@@foot fetish
/category-name/footjob/@@footjob
/category-name/force-sex-scene/@@force sex scene
/category-name/foursome/@@foursome
/category-name/fuck-my-wife/@@fuck my wife
/category-name/gagging/@@gagging
/category-name/gangbang/@@gangbang
/category-name/gaping/@@gaping
/category-name/girlfriend/@@girlfriend
/category-name/glasses/@@glasses
/category-name/gonzo/@@gonzo
/category-name/great-ass/@@great ass
/category-name/group-sex/@@group sex
/category-name/hairy-pussy/@@hairy pussy
/category-name/halloween/@@halloween
/category-name/hand/@@hand
/category-name/handjob/@@handjob
/category-name/hardcore/@@hardcore
/category-name/high-heels/@@high heels
/category-name/hospital/@@hospital
/category-name/huge-tits/@@huge tits
/category-name/incest/@@incest
/category-name/interactive-porn/@@interactive porn
/category-name/interracial/@@interracial
/category-name/japanese/@@japanese
/category-name/latin/@@latin
/category-name/latina/@@latina
/category-name/lesbian/@@lesbian
/category-name/lingerie/@@lingerie
/category-name/maid/@@maid
/category-name/mass/@@mass
/category-name/massage/@@massage
/category-name/masturbation/@@masturbation
/category-name/medium-ass/@@medium ass
/category-name/medium-tits/@@medium tits
/category-name/milf/@@milf
/category-name/missionary/@@missionary
/category-name/muslim/@@muslim
/category-name/natural-tits/@@natural tits
/category-name/neighbor/@@neighbor
/category-name/nurse/@@nurse
/category-name/office/@@office
/category-name/onlyfans/@@OnlyFans
/category-name/oral-train/@@oral train
/category-name/orgy/@@orgy
/category-name/parody/@@parody
/category-name/petite/@@petite
/category-name/piercing/@@piercing
/category-name/police/@@police
/category-name/prisoner/@@prisoner
/category-name/public-sex/@@public sex
/category-name/punishment/@@punishment
/category-name/pussy-fingering/@@pussy fingering
/category-name/pussy-licking/@@pussy licking
/category-name/raven/@@raven
/category-name/reality-porn/@@reality porn
/category-name/red-head/@@red head
/category-name/rimjob/@@rimjob
/category-name/rough-sex/@@rough sex
/category-name/russian/@@russian
/category-name/school/@@school
/category-name/school-fantasies/@@school fantasies
/category-name/school-girl/@@school girl
/category-name/sci-fi/@@sci-fi
/category-name/secretary/@@secretary
/category-name/sex-toys/@@sex toys
/category-name/shaved/@@shaved
/category-name/side-fuck/@@side fuck
/category-name/sleeping/@@sleeping
/category-name/small-ass/@@small ass
/category-name/small-tits/@@small tits
/category-name/solo/@@solo
/category-name/spanish/@@spanish
/category-name/spanking/@@spanking
/category-name/spoon/@@spoon
/category-name/sports/@@sports
/category-name/squirt/@@squirt
/category-name/stepaunt/@@stepaunt
/category-name/stepbrother/@@stepbrother
/category-name/stepdad/@@stepdad
/category-name/stepdaughter/@@stepdaughter
/category-name/stepmom/@@stepmom
/category-name/stepsister/@@stepsister
/category-name/stepson/@@stepson
/category-name/stockings/@@stockings
/category-name/stripper/@@stripper
/category-name/stuck/@@stuck
/category-name/sugar-daddy/@@sugar daddy
/category-name/swallow/@@swallow
/category-name/swap/@@swap
/category-name/swingers/@@swingers
/category-name/taboo/@@taboo
/category-name/tattoo/@@tattoo
/category-name/teacher/@@teacher
/category-name/teen/@@teen
/category-name/thanksgiving/@@Thanksgiving
/category-name/thief/@@thief
/category-name/threesome/@@threesome
/category-name/tittyfuck/@@tittyfuck
/category-name/uniform/@@uniform
/category-name/waitress/@@waitress
/category-name/webcam/@@webcam
/category-name/wedding/@@wedding
/category-name/wife/@@wife
/category-name/wife-swap/@@wife swap
/category-name/work-fantasies/@@work fantasies
/category-name/workout/@@workout
/category-name/yoga/@@yoga
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


