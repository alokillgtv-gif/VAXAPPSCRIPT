var BASEURL = "https://hhpanda.st"; 
// https://www.whoreshub.com/categories/4k-porn/
function getManifest() {
    return JSON.stringify({
      "id": "hhpanda",
      "name": "Nguồn HHPanda",
      "description": "Anime siêu hay.",
      "version": "1.1.4",
      "info": "Nguồn phim hoạt hình chất lượng cao, tuy nhiên cơ chế chiếu phát của nó rất khó chịu. Chỉ phát được trên máy chủ của họ còn phát qua app sẽ bị mất góc không tràn viền.\r\nVì thế đã tích hợp bộ chỉnh kích cỡ video vào bên trong video. Bạn có thể chỉnh sao cho vừa màn hình. Chỉ cần chỉnh 1 lần là các lần sau sẽ dùng như vậy.",
      "baseUrl": "https://hhpanda.st",
      "iconUrl": "https://hhpanda.st/wp-content/uploads/2024/10/logo.webp",
      "isEnabled": true,
      "type": "MOVIE",
      "playerTpye": "embedtoexoplay"
    })
};

function log(msg) {
    if (typeof nativeLog !== 'undefined') {
        nativeLog("["+BASEURL+"] " + msg);
    } else if (typeof console !== 'undefined' && console.log) {
        console.log("["+BASEURL+"] " + msg);
    }
}

function getHomeSections() {
    var listurl = '[{\"link\":\"/moi-cap-nhat/\",\"name\":\"Phim Mới\"}]';
    var menulist = buildMenu(listurl, true);
    return JSON.stringify(menulist);
}

function getPrimaryCategories() {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}



function getFilterConfig() {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl,"filter");
    return JSON.stringify({
        category: menulist
    });
}

// =============================================================================
// HELPER: CURSOR BASE64 ENCODE / DECODE
// =============================================================================
function getUrlList(slug, filtersJson) {
    try {
        if (slug && slug.indexOf("http") > -1) {
            return slug;
        }

        var page = 1;
        var path = slug || "";

        if (filtersJson) {
            var fixedJson2 = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":').replace(/:,/g, ':');
            try {
                var filters = JSON.parse(fixedJson2);
                page = parseInt(filters.page) || 1;
                if (filters.category) {
                    if (Array.isArray(filters.category) && filters.category.length > 0) {
                        path = filters.category[0].slug;
                    } else if (typeof filters.category === 'string') {
                        path = filters.category;
                    }
                }
            } catch (jsonErr) {}
        }

        var resultUrl = BASEURL;
        if (path) {
            resultUrl += path;
        }
        if (page > 1) {
            resultUrl += "/page/" + page;
        }
        return resultUrl.replace(/([^:]\/)\/+/g, "$1");
    } catch (e) {
        console.log(e);
        if (slug && slug.indexOf("http") > -1) {
            return slug;
        }
        var fallback = BASEURL + (slug ? "/" + slug : "");
        return fallback.replace(/([^:]\/)\/+/g, "$1");
    }
}

function getUrlSearch(keyword, filtersJson) {
    if (filtersJson) {
        var fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":').replace(/:,/g, ':');
        try {
            var filters = JSON.parse(fixedJson);
            var page = parseInt(filters.page) || 1;
            if (page > 1) {
                return BASEURL + "/page/" + page + "?s=" + encodeURIComponent(keyword);
            } else {
                return BASEURL + "?s=" + encodeURIComponent(keyword);
            }
        } catch (jsonErr) {
            return BASEURL + "?s=" + encodeURIComponent(keyword);
        }
    }
}
/*
// https://hhpanda.st/page/3?s=h%E1%BA%AFn
// https://hhpanda.st/the-loai/tu-tien/page/3

var BASEURL = "https://hhpanda.st";
var filtersJson = '{page:2}';
console.log(getUrlList(getUrlSearch("ggiet", filtersJson), filtersJson));
//console.log(getUrlSearch("the boy"))
*/


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

function fixHref(href) {
    if (!href) return '';

    // 1. Loại bỏ khoảng trắng thừa ở đầu và cuối
    let cleanHref = href.trim();

    // 2. Các mẫu đường dẫn cần bỏ qua (không gắn thêm BASEURL)
    const ignorePattern = /^(#|https?:\/\/|\/\/|mailto:|tel:|javascript:|data:|blob:)/i;

    if (ignorePattern.test(cleanHref)) {
        return cleanHref;
    }

    // 3. Xử lý trường hợp đường dẫn bắt đầu bằng dấu / (server-relative path)
    if (cleanHref.startsWith('/')) {
        try {
            const urlObj = new URL(BASEURL);
            return urlObj.origin + cleanHref;
        } catch (e) {
            return BASEURL + cleanHref;
        }
    }

    // 4. Đường dẫn tương đối thông thường
    return BASEURL + cleanHref;
}


function parseListResponse(html, $url) {
    try {
        var items = [];
        _$(html).find("article").each(function() {
            var href = this.find("a").attr("href");
            href = fixHref(href);
            var title = this.find("a").attr("title");
            var src = this.find("img").attr("src");
            src = fixHref(src)

            var episode_current = this.find(".status").text().trim();
            var quality = this.find(".mc__score").text().trim();

// Hàm kiểm tra URL có phải là link thật hay chứa mã JS rác
function isValidMediaUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    var cleanUrl = url.trim();

    // 1. Loại bỏ nếu dính chuỗi nối code JS, biến hoặc hàm (như _spEsc, +, ', ${...)
    if (cleanUrl.indexOf('_spEsc') > -1 || 
        cleanUrl.indexOf("'+") > -1 || 
        cleanUrl.indexOf("+'") > -1 || 
        cleanUrl.indexOf("${") > -1 ||
        cleanUrl.indexOf("javascript:") > -1) {
        return false;
    }

    // 2. Kiểm tra định dạng URL http/https hợp lệ (không chứa khoảng trắng, ngoặc đơn/kép, dấu +)
    var httpPattern = /^https?:\/\/[^\s"'<>+]+$/i;
    return httpPattern.test(cleanUrl);
}

// =============================================================================
// ĐOẠN XỬ LÝ TRONG HÀM PARSE CỦA BẠN
// =============================================================================

            if (isValidMediaUrl(href)) {
                var cleanThumb = (src || "").replace(/&amp;/g, '&').trim();
                
                // Đảm bảo cleanThumb cũng là link ảnh hợp lệ, nếu không có thì fallback
                if (cleanThumb && cleanThumb.indexOf('http') !== 0) {
                    cleanThumb = 'https:' + cleanThumb;
                }
            
                items.push({
                    "id": href.trim(),
                    "title": (title || "").trim(),
                    "posterUrl": cleanThumb,
                    "backdropUrl": cleanThumb,
                    "quality": quality || "",
                    "lang": "",
                    "episode_current": episode_current || ""
                });
            }
        });

        return JSON.stringify({
            "items": items,
            "pagination": {
                "currentPage": 1,
                "totalPages": 999
            }
        });
    } catch (e) {
        log("parseListResponse: " + e);
        return JSON.stringify({
            "items": [{
                "id": $url || "error_url",
                "title": "Lỗi: " + e,
                "posterUrl": "",
                "backdropUrl": ""
            }],
            "pagination": {
                "currentPage": 1,
                "totalPages": 1
            }
        });
    }
}

/*
var BASEURL = "https://hhpanda.st";
//var BASEAPI = "https://k8s.onflixcdn.com/api";
JSON.parse(parseListResponse(sourceHTML, BASEURL));
//var html = outerHTML;

*/




function parseSearchResponse(html, url) {
    return parseListResponse(html, url);
}
function parseMovieDetail(html, url) {
    try {
        // === BƯỚC 1: ĐỒNG NHẤT ID PHIM BẰNG REGEX META (Y hệt tác giả) ===
        var idMatch = /<link\s+rel="canonical"\s+href="([^"]+)"/i.exec(html) ||
            /<meta\s+property="og:url"\s+content="([^"]+)"/i.exec(html);
        var id = idMatch ? idMatch[1] : (url || "");

        var slug = "";
        if (id) {
            var slugMatch = /\/phim\/([^/_.]+)/.exec(id);
            slug = slugMatch ? slugMatch[1] : id;
        }
        if (!slug) {
            var slugMatch2 = /\/phim\/([^/_.]+)/.exec(html);
            slug = slugMatch2 ? slugMatch2[1] : "";
        }

        // === BƯỚC 2: TRÍCH XUẤT THÔNG TIN PHIM ===
        var lurl = "";
        var limg = "";
        var lname = "Đang cập nhật...";
        var ldes = "Không có mô tả.";
        var ldirec = "";
        var lactor = "";
        var lduran = "";
        var status = "";
        var category = "";
        var episode_current = "";
        var rating = 5;
        var rmatch = html.match(/meta\s+property="og:url"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) lurl = rmatch[1];

        rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) limg = rmatch[1];

        if (limg.indexOf("//") === 0) {
            limg = "https:" + limg;
        } else if (limg.indexOf("http") === -1) {
            limg = BASEURL + limg;
        }
        rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) lname = rmatch[1];

        var ldes = _$(html).find(".video-item").find("article").text();
        var year = 2026;
        var extra = "";
        /*
                var rawText = _$(html).find(".aim-hero__meta").find("span:first").text();

                // 1. Dùng Regex lọc chính xác 4 chữ số năm (dạng 19xx hoặc 20xx)
                var match = rawText.match(/\b(19|20)\d{2}\b/);

                if (match) {
                    // 2. Ép kiểu về Số Nguyên bằng parseInt với cơ số 10
                    year = parseInt(match[0], 10);
                }

                // 3. Chốt chặn an toàn: Nếu parse thất bại (NaN), trả về năm mặc định
                if (isNaN(year)) {
                    year = 2026;
                }
                */
        status = _$(html).find(".hh3d-info").find("span").parent().text(" - ");

        var categoryResult = [];
        _$(html).find(".list_cate").find("a").each(function() {
            var link = this.attr("href") || this.find("a").attr("href");
            var name = this.text().replace(/\s+/g, ' ').trim();

            if (name && link) {
                var slug = typeof getSlug === 'function' ? getSlug(link) : link;
                slug = slug.replace(BASEURL, "");
                categoryResult.push("[" + name + "](" + slug + ")");
            }
        });

        // THÊM DÒNG NÀY: Chuyển mảng thành Chuỗi nối nhau bằng dấu phẩy
        category = categoryResult.join(", ");

        episode_current = _$(html).find("span.new-ep").text();
        //rating = _$(html).find(".kksr-legend").text();

        var servers = [];


        _$(html).find("#halim-list-server").find(".halim-server").each(function() {
            var $namesv = this.find(".halim-server-name").text();
            var items = [];
            this.find(".halim-list-eps").each(function() {
                this.find("a").each(function() {
                    var id = this.attr("href");
                    var name = this.attr("title");
                    var slug = this.attr("data-ep");
                    items.push({
                        id: id,
                        name: name,
                        slug: slug
                    })
                })
            })
            servers.push({
                name: $namesv,
                episodes: items
            })
        })
        servers = sortEpisodesByName(servers);
        //console.log(JSON.stringify(servers));
        // === BƯỚC 5: TRẢ VỀ KẾT QUẢ ĐỒNG NHẤT ID ===
        return JSON.stringify({
            id: id, // BẮT BUỘC: ID phải là slug rút gọn của bộ phim để cả 2 lần fetch khớp nhau
            title: lname,
            posterUrl: limg,
            backdropUrl: limg,
            description: ldes,
            quality: "HD",
            year: year,
            rating: rating,
            status: status,
            category: category,
            episode_current: episode_current,
            servers: servers, // Lần 1 (trang chi tiết) sẽ là []. Lần 2 (khi chạy qua extra) sẽ có đầy đủ tập
            duration: lduran || "",
            casts: lactor || "",
            director: ldirec || "",
            extra: extra // Lần 2 (trang xem phim) extra sẽ rỗng để dừng chu kỳ tải ngầm
        });

    } catch (e) {
        log("parseMovieDetail:" + e)
        return JSON.stringify({
            id: slug || url || "error",
            title: "error",
            servers: []
        });
    }
}

function sortEpisodesByName(data) {
    if (!Array.isArray(data)) return data;

    data.forEach(function(server) {
        if (server.episodes && Array.isArray(server.episodes)) {
            server.episodes.sort(function(a, b) {
                var nameA = a.name || '';
                var nameB = b.name || '';

                // Bắt chuỗi số đầu tiên xuất hiện trong tên (hỗ trợ cả số thập phân như 2.5)
                var matchA = nameA.match(/\d+(\.\d+)?/);
                var matchB = nameB.match(/\d+(\.\d+)?/);

                var numA = matchA ? parseFloat(matchA[0]) : null;
                var numB = matchB ? parseFloat(matchB[0]) : null;

                // 1. Nếu cả 2 đều tìm thấy số -> so sánh theo giá trị số
                if (numA !== null && numB !== null) {
                    if (numA !== numB) {
                        return numA - numB;
                    }
                }

                // 2. Nếu 1 bên có số, 1 bên không -> ưu tiên item có số đứng trước
                if (numA !== null) return -1;
                if (numB !== null) return 1;

                // 3. Nếu cả 2 không có số (hoặc số bằng nhau) -> sắp xếp tự nhiên theo chuỗi
                return nameA.localeCompare(nameB, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            });
        }
    });

    return data;
}
/*
// https://edge.narto-drama.com/e/rs/detail/watch/tro-choi-cong-so/9/refresh-source?lang=vi-VN


BASEURL = "https://hhpanda.st";
var html = sourceHTML;
var $url = "https://hhpanda.st";
JSON.parse(parseMovieDetail(sourceHTML, $url));
// https://edge.narto-drama.com/e/rs/detail/watch/tro-choi-cong-so/check-new-episodes?_t=1784684483895&_=1784684480875
*/


function parseDetailResponse(html, pageUrl) {
    try {
        var currentlink = _$(html).find("meta[property='og:url']").attr("content");
        var matchC = currentlink.match(/sv(\d+)/i);
        var currentserver = 1;
        var currenttap = 1;
        var matchA = currentlink.match(/(tap-\d+)/i);
        if (matchC && matchC[1]) {
            currentserver = matchC[1];
        }
        if (matchA && matchA[1]) {
            currenttap = matchA[1];
        }
        var currentid = _$(html).find("#main-contents").attr("data-id");
        var typecurrent = _$(html).find("#halim-ajax-list-server").find("span:first").attr("data-type");
        var framelink = `https://hhpanda.st/player/player.php?action=dox_ajax_player&post_id=${currentid}&chapter_st=${currenttap}&type=${typecurrent}&sv=${currentserver}`;
        var $dataSv = {};
        $dataSv.movieid = currentid;
        $dataSv.serverhientai = currentserver;
        $dataSv.hqhientai = typecurrent;
        $dataSv.taphientai = currenttap;

        var servers = [];
        _$(html).find(".halim-server").each(function() {
            var $namesv = this.find(".halim-server-name").text();
            var items = [];
            var type = 1;
            var maxEpi = 1;
            maxEpi = this.find(".halim-episode").find("a").length;

            this.find(".halim-episode").each(function() {
                type = this.find("a:first").attr("data-sv")
            })

            servers.push({
                name: $namesv,
                type: type,
                maxEpi: maxEpi
            })
        })
        $dataSv.servers = servers;
        // // https://hhpanda.st/player/player.php?action=dox_ajax_player&post_id=17033&chapter_st=tap-3&type=tiktik&sv=2

        //_$(html).find("#halim-ajax-list-server").find("span");
        var serverHQ = [];
        _$(html).find("#halim-ajax-list-server").find("span").each(function() {
            var name = this.text();
            var type = this.attr("data-type");
            serverHQ.push({
                nname: name,
                type: type
            })
        })
        $dataSv.HQ = serverHQ;
        
       // var bypassJs = customJS(link);
        var bypassJs = customJS($dataSv);
        return JSON.stringify({
            url: framelink,
            isEmbed: false,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": pageUrl,
                "Custom-Js": bypassJs
            },
            subtitles: []
        });
    } catch (e) {
        log("parseDetailResponse error: " + e.message);
        return JSON.stringify({
            url: "",
            isEmbed: false,
            headers: {},
            subtitles: []
        });
    }
}
/*

BASEURL = "https://animehay09.site";
var html = sourceHTML;
//JSON.parse(parseDetailResponse(sourceHTML, BASEURL))
JSON.parse(parseEmbedResponse(sourceHTML, BASEURL))
// 'AHS': 'https://ahay.stream/embed-jw/75913'

*/
function customJS(config) {
    return `
(function() {
    
    // =========================================================
    // CẤU HÌNH TOÀN CỤC (GLOBAL CONFIG)
    // =========================================================
    const ENABLE_TOAST = false;         // true: Bật Toast URL | false: Tắt
    const TOAST_DURATION = 4000;       // Thời gian hiện Toast URL (ms)
    const INITIAL_SHOW_TIME = 10000;   // Thời gian hiện rõ thanh điều khiển (ms)

    const CONFIG = ${JSON.stringify(config)};

    // --- 0. INJECT CSS STYLES ---
    let styleTag = document.getElementById('custom-player-styles');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'custom-player-styles';
        styleTag.textContent = \`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                height: 100dvh !important;
                overflow: hidden !important;
                background: #000 !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
            }

            #custom-main-player-iframe {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform-origin: center center !important;
                border: none !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: 1 !important;
                display: block !important;
                box-sizing: border-box !important;
                transition: width 0.15s ease, height 0.15s ease, transform 0.15s ease !important;
            }

            .floating-control-ui {
                opacity: 0 !important;
                transition: opacity 0.5s ease, transform 0.2s ease, background-color 0.2s ease !important;
            }
            
            .floating-control-ui:hover, 
            .floating-control-ui:focus-within, 
            .floating-control-ui:active,
            .floating-control-ui.initial-show {
                opacity: 1 !important;
            }

            .floating-nav-item:hover {
                background-color: #e50914 !important;
                border-color: #e50914 !important;
                transform: translate(-50%, -50%) scale(1.15) !important;
            }

            .dim-btn {
                background: #333;
                color: #fff;
                border: none;
                border-radius: 4px;
                width: 22px;
                height: 22px;
                cursor: pointer;
                font-size: 13px;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                transition: background 0.2s;
            }
            .dim-btn:hover {
                background: #e50914 !important;
            }
            .dim-input {
                width: 48px !important;
                background: transparent !important;
                border: none !important;
                color: #fff !important;
                text-align: center !important;
                font-size: 12px !important;
                font-weight: bold !important;
                outline: none !important;
            }
            .dim-input::-webkit-outer-spin-button,
            .dim-input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            .dim-input[type=number] {
                -moz-appearance: textfield;
            }
        \`;
        (document.head || document.documentElement).appendChild(styleTag);
    }

    // --- 1. OVERLAY LOADING ---
    let overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0', left: '0',
        width: '100vw', height: '100vh',
        backgroundColor: '#000',
        zIndex: '999998',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Arial, sans-serif'
    });
    
    function showLoading(msg = 'Đang tải tập phim...') {
        overlay.innerHTML = \`
            <div style="border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #e50914; border-radius: 50%; width: 45px; height: 45px; animation: spin 1s linear infinite;"></div>
            <div style="margin-top: 15px; font-size: 14px; color: #aaa;">\${msg}</div>
        \`;
        overlay.style.opacity = '1';
        overlay.style.display = 'flex';
        if (!document.getElementById('loading-overlay')) {
            document.body.appendChild(overlay);
        }
    }

    function hideLoading() {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 300);
    }

    // CHỐNG QUẢNG CÁO & MỞ TAB MỚI
    window.addEventListener('click', function(e) {
        if (!e.target.closest('#floating-select-box') && !e.target.closest('#episode-grid-popup') && !e.target.closest('#scale-grid-popup') && !e.target.closest('#url-toast-notice') && !e.target.closest('#resume-history-toast') && !e.target.closest('.floating-nav-item')) {
            let aTag = e.target.closest('a');
            if (aTag && (aTag.target === '_blank' || aTag.href)) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }, true);
    window.open = function() { return null; };

    // --- 2. BIẾN QUẢN LÝ TRẠNG THÁI & KÍCH THƯỚC / SCALE ---
    const storageKey = "anime_history_" + CONFIG.movieid;
    const widthStorageKey = "anime_player_iframe_width";
    const heightStorageKey = "anime_player_iframe_height";
    const scaleStorageKey = "anime_player_iframe_scale";

    let currentServer = CONFIG.serverhientai;
    let currentHQ = CONFIG.hqhientai;
    let currentTapStr = CONFIG.taphientai;
    let currentTapNum = parseInt(currentTapStr.replace('tap-', ''), 10) || 1;

    // Lấy thông số từ Storage (Mặc định W: 700px, H: 400px, Scale: 1.0)
    function getSavedWidth() {
        const saved = localStorage.getItem(widthStorageKey);
        return saved ? parseInt(saved, 10) : 700;
    }

    function getSavedHeight() {
        const saved = localStorage.getItem(heightStorageKey);
        return saved ? parseInt(saved, 10) : 400;
    }

    function getSavedScale() {
        const saved = localStorage.getItem(scaleStorageKey);
        return saved ? parseFloat(saved) : 1.0;
    }

    // Áp dụng kích thước Width / Height & Scale
    function applyIframeDimensions(w, h, s) {
        w = Math.max(150, parseInt(w, 10) || 700);
        h = Math.max(100, parseInt(h, 10) || 400);
        s = parseFloat(s) || 1.0;

        let iframe = document.getElementById("custom-main-player-iframe");
        if (iframe) {
            iframe.style.setProperty('width', w + 'px', 'important');
            iframe.style.setProperty('height', h + 'px', 'important');
            iframe.style.setProperty('transform', \`translate(-50%, -50%) scale(\${s})\`, 'important');
        }

        localStorage.setItem(widthStorageKey, w);
        localStorage.setItem(heightStorageKey, h);
        localStorage.setItem(scaleStorageKey, s);

        const wInput = document.getElementById("iframe-w-input");
        const hInput = document.getElementById("iframe-h-input");
        const scaleTrigger = document.getElementById("scale-select-trigger");

        if (wInput && document.activeElement !== wInput) wInput.value = w;
        if (hInput && document.activeElement !== hInput) hInput.value = h;
        if (scaleTrigger) scaleTrigger.textContent = "Scale " + s.toFixed(1) + "x ▼";

        renderScaleGrid();
    }

    function triggerInitialShow() {
        const elements = document.querySelectorAll('.floating-control-ui');
        elements.forEach(el => el.classList.add('initial-show'));

        if (window.fadeTimer) clearTimeout(window.fadeTimer);
        window.fadeTimer = setTimeout(() => {
            elements.forEach(el => el.classList.remove('initial-show'));
        }, INITIAL_SHOW_TIME);
    }

    function addTouchSupport(el) {
        if (!el) return;
        el.addEventListener('touchstart', function() {
            triggerInitialShow();
        }, { passive: true });
    }

    // --- 3. TOAST THÔNG BÁO URL ---
    function showToast(url) {
        if (!ENABLE_TOAST) return;

        let toast = document.getElementById('url-toast-notice');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'url-toast-notice';
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '20px', left: '20px',
                zIndex: '1000010',
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(229, 9, 20, 0.6)',
                color: '#fff', padding: '10px 14px', borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.9)',
                fontFamily: 'Arial, sans-serif', fontSize: '12px',
                maxWidth: '85vw', wordBreak: 'break-all',
                display: 'flex', alignItems: 'center', gap: '10px',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                opacity: '0', transform: 'translateY(20px)'
            });
            document.body.appendChild(toast);
        }

        toast.innerHTML = \`
            <span style="color: #e50914; font-weight: bold; white-space: nowrap;">🔗 Link:</span>
            <span style="color: #ddd; flex: 1; font-family: monospace; font-size: 11px;">\${url}</span>
            <span id="toast-copy-act" style="background: #e50914; color: #fff; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; white-space: nowrap; user-select: none; display: inline-block;">Sao chép</span>
        \`;

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        const copyAct = document.getElementById('toast-copy-act');
        if (copyAct) {
            copyAct.onclick = (e) => {
                e.stopPropagation();
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(() => {
                        copyAct.textContent = 'Đã chép! ✓';
                        copyAct.style.background = '#22c55e';
                        setTimeout(() => {
                            copyAct.textContent = 'Sao chép';
                            copyAct.style.background = '#e50914';
                        }, 1500);
                    });
                }
            };
        }

        if (window.toastTimer) clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => {
            if (toast) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
            }
        }, TOAST_DURATION);
    }

    function buildIframeUrl() {
        return \`https://hhpanda.st/player/player.php?action=dox_ajax_player&post_id=\${CONFIG.movieid}&chapter_st=tap-\${currentTapNum}&type=\${currentHQ}&sv=\${currentServer}\`;
    }

    function saveCurrentState() {
        const state = {
            server: currentServer,
            hq: currentHQ,
            tap: "tap-" + currentTapNum
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
    }

    // --- 4. TẠO KHUNG GIAO DIỆN CƠ BẢN ---
    function initBaseLayout() {
        document.documentElement.style.cssText = 'margin:0 !important; padding:0 !important; width:100vw !important; height:100vh !important; height:100dvh !important; overflow:hidden !important; background:#000 !important;';
        
        document.body.innerHTML = "";
        document.body.style.cssText = 'margin:0 !important; padding:0 !important; width:100vw !important; height:100vh !important; height:100dvh !important; overflow:hidden !important; background:#000 !important; position:fixed !important; top:0 !important; left:0 !important; z-index:0 !important;';

        showLoading("Đang khởi tạo trình phát...");

        // 1. Iframe
        let iframe = document.createElement("iframe");
        iframe.id = "custom-main-player-iframe";
        iframe.scrolling = "no";
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
        iframe.onload = () => {
            hideLoading();
            applyIframeDimensions(getSavedWidth(), getSavedHeight(), getSavedScale());
        };
        document.body.appendChild(iframe);

        // 2. Control Container (Thanh công cụ chính)
        let container = document.createElement("div");
        container.id = "floating-select-box";
        container.className = "floating-control-ui initial-show";
        Object.assign(container.style, {
            position: "fixed", top: "20px", right: "20px",
            zIndex: "999999",
            backgroundColor: "rgba(15, 15, 15, 0.9)",
            backdropFilter: "blur(8px)",
            padding: "8px 12px", borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
            color: "#fff", fontFamily: "Arial, sans-serif", fontSize: "13px",
            display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"
        });

        // Cụm điều chỉnh Width / Height
        function createDimensionControl(type) {
            let isW = (type === 'W');
            let group = document.createElement("div");
            Object.assign(group.style, {
                display: "flex", alignItems: "center", gap: "2px",
                backgroundColor: "#1f1f1f", padding: "3px 6px",
                borderRadius: "6px", border: "1px solid #444"
            });

            let lbl = document.createElement("span");
            lbl.textContent = isW ? "W:" : "H:";
            lbl.style.cssText = "font-size: 11px; color: #aaa; font-weight: bold; margin-right: 2px;";

            let btnMinus = document.createElement("button");
            btnMinus.className = "dim-btn";
            btnMinus.textContent = "-";
            btnMinus.title = "Giảm 20px";
            btnMinus.onclick = (e) => {
                e.stopPropagation();
                let curW = getSavedWidth();
                let curH = getSavedHeight();
                let curS = getSavedScale();
                if (isW) applyIframeDimensions(curW - 20, curH, curS);
                else applyIframeDimensions(curW, curH - 20, curS);
            };

            let input = document.createElement("input");
            input.id = isW ? "iframe-w-input" : "iframe-h-input";
            input.type = "number";
            input.className = "dim-input";
            input.value = isW ? getSavedWidth() : getSavedHeight();

            input.onchange = (e) => {
                let val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                    let curW = getSavedWidth();
                    let curH = getSavedHeight();
                    let curS = getSavedScale();
                    if (isW) applyIframeDimensions(val, curH, curS);
                    else applyIframeDimensions(curW, val, curS);
                }
            };
            input.onkeydown = (e) => e.stopPropagation();

            let btnPlus = document.createElement("button");
            btnPlus.className = "dim-btn";
            btnPlus.textContent = "+";
            btnPlus.title = "Tăng 20px";
            btnPlus.onclick = (e) => {
                e.stopPropagation();
                let curW = getSavedWidth();
                let curH = getSavedHeight();
                let curS = getSavedScale();
                if (isW) applyIframeDimensions(curW + 20, curH, curS);
                else applyIframeDimensions(curW, curH + 20, curS);
            };

            group.appendChild(lbl);
            group.appendChild(btnMinus);
            group.appendChild(input);
            group.appendChild(btnPlus);
            return group;
        }

        let widthCtrl = createDimensionControl('W');
        let heightCtrl = createDimensionControl('H');

        // --- NÚT TẢI VÀ POPUP CHỌN SCALE (GIỐNG TẬP PHIM) ---
        let scaleTrigger = document.createElement("span");
        scaleTrigger.id = "scale-select-trigger";
        scaleTrigger.textContent = "Scale " + getSavedScale().toFixed(1) + "x ▼";
        styleClickable(scaleTrigger, "#333");

        let scalePopupGrid = document.createElement("div");
        scalePopupGrid.id = "scale-grid-popup";
        Object.assign(scalePopupGrid.style, {
            position: "fixed", top: "65px", right: "20px",
            zIndex: "1000000",
            backgroundColor: "rgba(20, 20, 20, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "12px", borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.9)",
            width: "280px", maxHeight: "220px", overflowY: "auto",
            display: "none", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px"
        });

        scaleTrigger.onclick = (e) => {
            e.stopPropagation();
            let epPopup = document.getElementById("episode-grid-popup");
            if (epPopup) epPopup.style.display = "none";
            scalePopupGrid.style.display = (scalePopupGrid.style.display === "grid") ? "none" : "grid";
        };

        // Server Select
        let serverSelect = document.createElement("select");
        serverSelect.id = "server-select-box";
        styleSelect(serverSelect);
        CONFIG.servers.forEach(srv => {
            let opt = document.createElement("option");
            opt.value = srv.type;
            opt.textContent = srv.name;
            if (srv.type === currentServer) opt.selected = true;
            serverSelect.appendChild(opt);
        });
        serverSelect.onchange = (e) => {
            currentServer = e.target.value;
            const selSrv = CONFIG.servers.find(s => s.type === currentServer);
            if (selSrv && currentTapNum > selSrv.maxEpi) currentTapNum = 1;
            onSelectionChanged(true);
        };

        // HQ Select
        let hqSelect = document.createElement("select");
        hqSelect.id = "hq-select-box";
        styleSelect(hqSelect);
        CONFIG.HQ.forEach(hq => {
            let opt = document.createElement("option");
            opt.value = hq.type;
            opt.textContent = hq.nname;
            if (hq.type === currentHQ) opt.selected = true;
            hqSelect.appendChild(opt);
        });
        hqSelect.onchange = (e) => {
            currentHQ = e.target.value;
            onSelectionChanged(false);
        };

        // Nút mở Danh Sách Tập
        let epTrigger = document.createElement("span");
        epTrigger.id = "ep-select-trigger";
        epTrigger.textContent = "Tập " + currentTapNum + " ▼";
        styleClickable(epTrigger, "#e50914");

        let popupGrid = document.createElement("div");
        popupGrid.id = "episode-grid-popup";
        Object.assign(popupGrid.style, {
            position: "fixed", top: "65px", right: "20px",
            zIndex: "1000000",
            backgroundColor: "rgba(20, 20, 20, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "12px", borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.9)",
            width: "320px", maxHeight: "250px", overflowY: "auto",
            display: "none", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px"
        });

        epTrigger.onclick = (e) => {
            e.stopPropagation();
            scalePopupGrid.style.display = "none";
            popupGrid.style.display = (popupGrid.style.display === "grid") ? "none" : "grid";
        };

        // Click ngoài lề tự đóng các popup
        document.addEventListener("click", (e) => {
            if (!container.contains(e.target) && !popupGrid.contains(e.target) && !scalePopupGrid.contains(e.target)) {
                popupGrid.style.display = "none";
                scalePopupGrid.style.display = "none";
            }
        });

        // Đưa tất cả công cụ vào Container
        container.appendChild(widthCtrl);
        container.appendChild(heightCtrl);
        container.appendChild(scaleTrigger);
        container.appendChild(serverSelect);
        container.appendChild(hqSelect);
        container.appendChild(epTrigger);

        // Nút Prev
        let navPrev = document.createElement("span");
        navPrev.id = "nav-prev-item";
        navPrev.className = "floating-control-ui floating-nav-item initial-show";
        navPrev.innerHTML = "&#10094;";
        navPrev.title = "Tập trước";
        Object.assign(navPrev.style, {
            position: "fixed", top: "50%", left: "4%",
            transform: "translate(-50%, -50%)", zIndex: "999999",
            width: "48px", height: "48px", borderRadius: "50%",
            backgroundColor: "rgba(15, 15, 15, 0.85)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff", fontSize: "20px", fontWeight: "bold",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,0.8)", userSelect: "none"
        });
        navPrev.onclick = (e) => {
            e.stopPropagation();
            if (currentTapNum > 1) {
                currentTapNum--;
                onSelectionChanged(false);
            }
        };

        // Nút Next
        let navNext = document.createElement("span");
        navNext.id = "nav-next-item";
        navNext.className = "floating-control-ui floating-nav-item initial-show";
        navNext.innerHTML = "&#10095;";
        navNext.title = "Tập tiếp theo";
        Object.assign(navNext.style, {
            position: "fixed", top: "50%", left: "96%",
            transform: "translate(-50%, -50%)", zIndex: "999999",
            width: "48px", height: "48px", borderRadius: "50%",
            backgroundColor: "rgba(15, 15, 15, 0.85)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff", fontSize: "20px", fontWeight: "bold",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,0.8)", userSelect: "none"
        });
        navNext.onclick = (e) => {
            e.stopPropagation();
            const activeServerObj = CONFIG.servers.find(s => s.type === currentServer) || CONFIG.servers[0];
            const maxEpi = activeServerObj ? activeServerObj.maxEpi : 40;
            if (currentTapNum < maxEpi) {
                currentTapNum++;
                onSelectionChanged(false);
            }
        };

        addTouchSupport(container);
        addTouchSupport(navPrev);
        addTouchSupport(navNext);

        document.body.appendChild(container);
        document.body.appendChild(popupGrid);
        document.body.appendChild(scalePopupGrid);
        document.body.appendChild(navPrev);
        document.body.appendChild(navNext);

        triggerInitialShow();
        renderEpisodeGrid();
        renderScaleGrid();
        applyIframeDimensions(getSavedWidth(), getSavedHeight(), getSavedScale());
    }

    // --- RENDER POPUP SCALE GRID ---
    function renderScaleGrid() {
        let scalePopupGrid = document.getElementById("scale-grid-popup");
        if (!scalePopupGrid) return;
        scalePopupGrid.innerHTML = "";

        const curSavedScale = getSavedScale();

        for (let sVal = 0.5; sVal <= 2.05; sVal += 0.1) {
            let formattedVal = Math.round(sVal * 10) / 10;
            let valStr = formattedVal.toFixed(1) + "x";
            let item = document.createElement("span");
            item.textContent = valStr;
            let isCurrent = Math.abs(formattedVal - curSavedScale) < 0.05;
            
            styleClickable(item, isCurrent ? "#e50914" : "#2a2a2a");
            
            item.onclick = (e) => {
                e.stopPropagation();
                scalePopupGrid.style.display = "none";
                applyIframeDimensions(getSavedWidth(), getSavedHeight(), formattedVal);
            };
            scalePopupGrid.appendChild(item);
        }

        let scaleTrigger = document.getElementById("scale-select-trigger");
        if (scaleTrigger) scaleTrigger.textContent = "Scale " + curSavedScale.toFixed(1) + "x ▼";
    }

    // --- 5. TOAST LỊCH SỬ XEM ---
    function showResumeToast(savedState, savedTapNum) {
        let toast = document.getElementById('resume-history-toast');
        if (toast) toast.remove();

        toast = document.createElement('div');
        toast.id = 'resume-history-toast';
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '25px', right: '20px',
            zIndex: '2147483647',
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(229, 9, 20, 0.8)',
            color: '#fff', padding: '12px 18px', borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.9)',
            fontFamily: 'Arial, sans-serif', fontSize: '13px',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            opacity: '0', transform: 'translateY(-10px)',
            maxWidth: '380px'
        });

        const activeServerObj = CONFIG.servers.find(s => s.type === currentServer) || CONFIG.servers[0];
        const maxEpi = activeServerObj ? activeServerObj.maxEpi : 40;
        const hasNextEp = (savedTapNum + 1) <= maxEpi;

        toast.innerHTML = \`
            <div style="color: #eee; font-size: 13px; font-weight: 500;">
                📌 Bạn đang mở <b>Tập \${currentTapNum}</b>, nhưng lịch sử đã xem đến <b>Tập \${savedTapNum}</b>.
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span id="act-resume-saved" style="background: #e50914; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; user-select: none;">💾 Tập \${savedTapNum}</span>
                \${hasNextEp ? \`<span id="act-resume-next" style="background: #2563eb; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; user-select: none;">▶️ Tập \${savedTapNum + 1}</span>\` : ''}
                <span id="act-resume-cancel" style="background: #3f3f46; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; user-select: none;">❌ Không</span>
            </div>
        \`;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        const closeHistoryToast = () => {
            if (toast) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                setTimeout(() => { if (toast) toast.remove(); }, 400);
            }
            if (window.historyToastTimer) clearTimeout(window.historyToastTimer);
        };

        document.getElementById('act-resume-saved').onclick = (e) => {
            e.stopPropagation();
            currentTapNum = savedTapNum;
            if (savedState.server) currentServer = savedState.server;
            if (savedState.hq) currentHQ = savedState.hq;
            onSelectionChanged(false);
            closeHistoryToast();
        };

        if (document.getElementById('act-resume-next')) {
            document.getElementById('act-resume-next').onclick = (e) => {
                e.stopPropagation();
                currentTapNum = savedTapNum + 1;
                if (savedState.server) currentServer = savedState.server;
                if (savedState.hq) currentHQ = savedState.hq;
                onSelectionChanged(false);
                closeHistoryToast();
            };
        }

        document.getElementById('act-resume-cancel').onclick = (e) => {
            e.stopPropagation();
            closeHistoryToast();
        };

        if (window.historyToastTimer) clearTimeout(window.historyToastTimer);
        window.historyToastTimer = setTimeout(() => {
            closeHistoryToast();
        }, 30000);
    }

    // --- 6. KIỂM TRA LỊCH SỬ VÀ CHẠY TRÌNH PHÁT ---
    function checkHistoryAndStart() {
        initBaseLayout();

        const savedDataRaw = localStorage.getItem(storageKey);
        let savedState = null;
        let savedTapNum = null;

        if (savedDataRaw) {
            try {
                savedState = JSON.parse(savedDataRaw);
                savedTapNum = parseInt(savedState.tap.replace('tap-', ''), 10) || null;
            } catch(e) {}
        }

        loadPlayer();

        if (savedTapNum !== null && currentTapNum !== savedTapNum && currentTapNum !== (savedTapNum + 1)) {
            showResumeToast(savedState, savedTapNum);
        }
    }

    // --- 7. NẠP IFRAME VÀ CẬP NHẬT TRẠNG THÁI ---
    function loadPlayer() {
        saveCurrentState();
        showLoading("Đang tải tập " + currentTapNum + "...");

        const currentUrl = buildIframeUrl();
        let iframe = document.getElementById("custom-main-player-iframe");
        if (iframe) {
            iframe.src = currentUrl;
        }

        const sSelect = document.getElementById("server-select-box");
        if (sSelect) sSelect.value = currentServer;
        const hSelect = document.getElementById("hq-select-box");
        if (hSelect) hSelect.value = currentHQ;

        renderEpisodeGrid();
        renderScaleGrid();
        updateNavState();
        showToast(currentUrl);

        applyIframeDimensions(getSavedWidth(), getSavedHeight(), getSavedScale());
    }

    function onSelectionChanged(rebuildGrid = false) {
        saveCurrentState();
        showLoading("Đang chuyển kênh phát...");
        triggerInitialShow();

        let popupGrid = document.getElementById("episode-grid-popup");
        if (popupGrid) popupGrid.style.display = "none";
        let scalePopupGrid = document.getElementById("scale-grid-popup");
        if (scalePopupGrid) scalePopupGrid.style.display = "none";

        const newUrl = buildIframeUrl();
        let iframe = document.getElementById("custom-main-player-iframe");
        if (iframe) iframe.src = newUrl;

        const sSelect = document.getElementById("server-select-box");
        if (sSelect) sSelect.value = currentServer;
        const hSelect = document.getElementById("hq-select-box");
        if (hSelect) hSelect.value = currentHQ;

        if (rebuildGrid) {
            renderEpisodeGrid();
        } else {
            updateEpisodeGridState();
        }

        updateNavState();
        showToast(newUrl);

        applyIframeDimensions(getSavedWidth(), getSavedHeight(), getSavedScale());
    }

    function renderEpisodeGrid() {
        let popupGrid = document.getElementById("episode-grid-popup");
        if (!popupGrid) return;
        popupGrid.innerHTML = "";

        const activeServerObj = CONFIG.servers.find(s => s.type === currentServer) || CONFIG.servers[0];
        const maxEpi = activeServerObj ? activeServerObj.maxEpi : 40;

        for (let i = 1; i <= maxEpi; i++) {
            let epItem = document.createElement("span");
            epItem.textContent = i;
            let isCurrent = (i === currentTapNum);
            styleClickable(epItem, isCurrent ? "#e50914" : "#2a2a2a");
            epItem.onclick = () => {
                currentTapNum = i;
                popupGrid.style.display = "none";
                onSelectionChanged(false);
            };
            popupGrid.appendChild(epItem);
        }

        let epTrigger = document.getElementById("ep-select-trigger");
        if (epTrigger) epTrigger.textContent = "Tập " + currentTapNum + " ▼";
    }

    function updateNavState() {
        const navPrev = document.getElementById("nav-prev-item");
        const navNext = document.getElementById("nav-next-item");
        const activeServerObj = CONFIG.servers.find(s => s.type === currentServer) || CONFIG.servers[0];
        const maxEpi = activeServerObj ? activeServerObj.maxEpi : 40;

        if (navPrev) {
            if (currentTapNum <= 1) {
                navPrev.style.pointerEvents = "none";
                navPrev.style.filter = "grayscale(100%) opacity(0.2)";
            } else {
                navPrev.style.pointerEvents = "auto";
                navPrev.style.filter = "none";
            }
        }
        if (navNext) {
            if (currentTapNum >= maxEpi) {
                navNext.style.pointerEvents = "none";
                navNext.style.filter = "grayscale(100%) opacity(0.2)";
            } else {
                navNext.style.pointerEvents = "auto";
                navNext.style.filter = "none";
            }
        }
    }

    function updateEpisodeGridState() {
        let popupGrid = document.getElementById("episode-grid-popup");
        if (popupGrid) {
            const items = popupGrid.querySelectorAll("span");
            items.forEach(item => {
                const num = parseInt(item.textContent, 10);
                if (num === currentTapNum) {
                    styleClickable(item, "#e50914");
                } else {
                    styleClickable(item, "#2a2a2a");
                }
            });
        }
        let epTrigger = document.getElementById("ep-select-trigger");
        if (epTrigger) epTrigger.textContent = "Tập " + currentTapNum + " ▼";
    }

    function styleSelect(el) {
        Object.assign(el.style, {
            padding: "5px 8px", borderRadius: "6px",
            border: "1px solid #444", backgroundColor: "#1f1f1f",
            color: "#fff", cursor: "pointer", fontSize: "12px", outline: "none"
        });
    }

    function styleClickable(el, bgColor) {
        Object.assign(el.style, {
            padding: "5px 8px", borderRadius: "6px",
            border: "none", backgroundColor: bgColor,
            color: "#fff", cursor: "pointer", fontSize: "12px",
            fontWeight: "bold", textAlign: "center", transition: "background 0.2s",
            display: "inline-block", userSelect: "none"
        });
    }

    // KHỞI CHẠY
    checkHistoryAndStart();
})();
    `;
}



function parseCategoriesResponse(apiResponseJson) {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }

// https://hhpanda.st/moi-cap-nhat/page/3
// {\"link\":\"/moi-cap-nhat/\",\"name\":\"Phim Mới\"},
function getLISTmenu() {
    return `[{\"link\":\"/moi-cap-nhat/\",\"name\":\"Phim Mới\"},{\"link\":\"/the-loai/tu-tien\",\"name\":\"Tu Tiên\"},{\"link\":\"/the-loai/kiem-hiep\",\"name\":\"Kiếm Hiệp\"},{\"link\":\"/the-loai/co-trang\",\"name\":\"Cổ Trang\"},{\"link\":\"/the-loai/huyen-huyen\",\"name\":\"Huyền Huyễn\"},{\"link\":\"/the-loai/khoa-huyen\",\"name\":\"Khoa Huyễn\"},{\"link\":\"/the-loai/ky-ao\",\"name\":\"Kỳ Ảo\"},{\"link\":\"/the-loai/huyen-nghi\",\"name\":\"Huyền Nghi\"},{\"link\":\"/the-loai/canh-ky\",\"name\":\"Cạnh Kỹ\"},{\"link\":\"/the-loai/da-su\",\"name\":\"Dã Sử\"},{\"link\":\"/the-loai/do-thi\",\"name\":\"Đô Thị\"},{\"link\":\"/the-loai/dong-nhan\",\"name\":\"Đồng Nhân\"}]`  
}

function buildMenu(menuStr, type) { 
    var menuArray = JSON.parse(menuStr); 
    let menulist = []; 
    if (!menuArray || !Array.isArray(menuArray)) return menulist; 
    var typeStr = type !== undefined ? String(type).trim() : undefined; 
    for (var i = 0; i < menuArray.length; i++) { 
        var item = menuArray[i]; 
        if (!item) continue; 
        var link = item.link ? String(item.link).trim() : ""; 
        var name = item.name ? String(item.name).trim() : ""; 
        if (!link || !name) continue; 
        var menuItem = {}; 
        if (typeStr === "false") { 
            menuItem = { "slug": link, "title": name, "type": "Horizontal" }; 
        } else if (typeStr === "true") { 
            menuItem = { "slug": link, "title": name, "type": "Grid" }; 
        } else if(typeStr === "filter"){
          	menuItem = { "value": link, "name": name}; 
        }
        
        else { 
            menuItem = { "slug": link, "name": name }; 
        } 
        menulist.push(menuItem); 
    } 
    return menulist; 
}




function _$(htmlOrBlock){ if (htmlOrBlock && typeof htmlOrBlock === 'object' && htmlOrBlock.elements) { return htmlOrBlock; } var instance = { sourceHtml: typeof htmlOrBlock === 'string' ? htmlOrBlock : '', elements: Array.isArray(htmlOrBlock) ? htmlOrBlock : (htmlOrBlock ? [htmlOrBlock] : []), length: 0, find: function (selector) { if (selector.indexOf(',') !== -1) { var results = []; var selectors = selector.split(',').map(function (s) { return s.trim(); }); for (var s = 0; s < selectors.length; s++) { if (selectors[s] === "") continue; var subInstance = this.find(selectors[s]); for (var r = 0; r < subInstance.elements.length; r++) { var element = subInstance.elements[r]; if (results.indexOf(element) === -1) { results.push(element); } } } var multiInstance = _$(results); multiInstance.sourceHtml = this.sourceHtml; return multiInstance; } var results = []; var contentFilter = ""; if (selector.indexOf(":content(") !== -1) { var contentMatch = selector.match(/:content\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/); if (contentMatch) { contentFilter = contentMatch[1] || contentMatch[2] || contentMatch[3] || ""; selector = selector.replace(/:content\((?:"[^"]*"|'[^']*'|[^)]*)\)/, ""); } } var attrNameFilter = ""; var attrValueFilter = ""; var attrOperator = "="; var hasAttrFilter = false; var attrMatch = selector.match(/\[([a-zA-Z0-9_-]+)\s*([*^$]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]"']*))\]/); if (attrMatch) { hasAttrFilter = true; attrNameFilter = attrMatch[1]; attrOperator = attrMatch[2]; attrValueFilter = attrMatch[3] || attrMatch[4] || attrMatch[5] || ""; selector = selector.replace(/\[.*?\]/, ""); } var notSelector = ""; if (selector.indexOf(":not(") !== -1) { var notMatch = selector.match(/:not\(([^)]+)\)/); if (notMatch) { notSelector = notMatch[1]; selector = selector.replace(/:not\([^)]+\)/, ""); } } var isFirstFilter = selector.indexOf(":first") !== -1; var isLastFilter = selector.indexOf(":last") !== -1; selector = selector.replace(/:first|:last/g, ""); var targetTagName = ""; var targetId = ""; var targetClasses = []; var selectorToParse = selector.trim(); if (selectorToParse !== "") { var idIndex = selectorToParse.indexOf('#'); if (idIndex !== -1) { var afterId = selectorToParse.substring(idIndex + 1); var nextDot = afterId.indexOf('.'); targetId = nextDot === -1 ? afterId : afterId.substring(0, nextDot); selectorToParse = selectorToParse.substring(0, idIndex) + (nextDot === -1 ? "" : "." + afterId.substring(nextDot + 1)); } var classParts = selectorToParse.split('.'); var possibleTag = classParts.shift(); if (possibleTag) { targetTagName = possibleTag.toLowerCase(); } targetClasses = classParts.filter(function (c) { return c.length > 0; }); } for (var i = 0; i < this.elements.length; i++) { var currentHtml = this.elements[i]; var pos = 0; var subResults = []; while ((pos = currentHtml.indexOf('<', pos)) !== -1) { if (currentHtml.charAt(pos + 1) === '/' || currentHtml.charAt(pos + 1) === '!') { pos++; continue; } var endOpenTag = -1; var insideQuote = false; var quoteChar = ''; for (var j = pos + 1; j < currentHtml.length; j++) { var char = currentHtml.charAt(j); if ((char === '"' || char === "'") && currentHtml.charAt(j - 1) !== '\\') { if (!insideQuote) { insideQuote = true; quoteChar = char; } else if (char === quoteChar) { insideQuote = false; } } if (char === '>' && !insideQuote) { endOpenTag = j; break; } } if (endOpenTag === -1) break; var fullOpenTag = currentHtml.substring(pos, endOpenTag + 1); var tagMatch = fullOpenTag.match(/^<([a-zA-Z0-9_-]+)/); var currentTagName = tagMatch ? tagMatch[1].toLowerCase() : ""; var isMatched = true; if (targetTagName && targetTagName !== currentTagName) { isMatched = false; } var getClassAttr = fullOpenTag.match(/class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i); var classMatchStr = getClassAttr ? (getClassAttr[1] || getClassAttr[2] || getClassAttr[3] || "") : ""; var getIdAttr = fullOpenTag.match(/id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i); var idMatchStr = getIdAttr ? (getIdAttr[1] || getIdAttr[2] || getIdAttr[3] || "") : ""; if (isMatched && targetId && idMatchStr !== targetId) { isMatched = false; } if (isMatched && targetClasses.length > 0) { if (classMatchStr) { var currentClasses = classMatchStr.trim().split(/\s+/); for (var c = 0; c < targetClasses.length; c++) { if (currentClasses.indexOf(targetClasses[c]) === -1) { isMatched = false; break; } } } else { isMatched = false; } } if (isMatched && hasAttrFilter) { var actualValue = ""; if (attrNameFilter === "class") { actualValue = classMatchStr; } else if (attrNameFilter === "id") { actualValue = idMatchStr; } else { var getAnyAttr = fullOpenTag.match(new RegExp(attrNameFilter + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i')); actualValue = getAnyAttr ? (getAnyAttr[1] || getAnyAttr[2] || getAnyAttr[3] || "") : ""; } var attrExists = fullOpenTag.search(new RegExp(attrNameFilter + '\\s*=', 'i')) !== -1; if (!attrExists) { isMatched = false; } else { if (attrOperator === "=") { if (attrNameFilter === "class") { var classes = actualValue.trim().split(/\s+/); if (classes.indexOf(attrValueFilter) === -1) isMatched = false; } else if (actualValue !== attrValueFilter) { isMatched = false; } } else if (attrOperator === "*=") { if (actualValue.indexOf(attrValueFilter) === -1) isMatched = false; } else if (attrOperator === "^=") { if (actualValue.indexOf(attrValueFilter) !== 0) isMatched = false; } else if (attrOperator === "$=") { if (actualValue.slice(-attrValueFilter.length) !== attrValueFilter) isMatched = false; } } } if (isMatched) { var startTagPos = pos; var endTagPos = endOpenTag + 1; var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta']; if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) { var depth = 1; var tagRegex = new RegExp('<(/?)' + currentTagName + '(?:\\s+[^>]*|\\s*>)', 'gi'); tagRegex.lastIndex = endOpenTag + 1; var match; while ((match = tagRegex.exec(currentHtml)) !== null) { var isClose = match[1] === '/'; var fullMatched = match[0]; if (isClose) { depth--; } else if (fullMatched.indexOf('/>') === -1) { depth++; } if (depth === 0) { endTagPos = tagRegex.lastIndex; break; } } if (depth > 0) { endTagPos = currentHtml.length; } } var foundBlock = currentHtml.substring(startTagPos, endTagPos); if (contentFilter) { var pureText = ""; if (currentTagName === "script" || currentTagName === "style") { var innerStart = foundBlock.indexOf('>') + 1; var innerEnd = foundBlock.search(/<\/(?:script|style)/i); pureText = innerEnd !== -1 ? foundBlock.substring(innerStart, innerEnd) : foundBlock.substring(innerStart); } else { pureText = foundBlock.replace(/<[^>]+>/g, "").trim(); } var keywords = contentFilter.split('|'); var isContentMatched = false; for (var k = 0; k < keywords.length; k++) { if (pureText.indexOf(keywords[k].trim()) !== -1) { isContentMatched = true; break; } } if (!isContentMatched) { pos = endTagPos; continue; } } if (notSelector) { var isNotClass = notSelector.indexOf('.') === 0; var isNotId = notSelector.indexOf('#') === 0; var notValue = notSelector.substring(1); var hasNot = false; if (isNotClass && classMatchStr.indexOf(notValue) !== -1) hasNot = true; if (isNotId && idMatchStr.indexOf(notValue) !== -1) hasNot = true; if (!hasNot) subResults.push(foundBlock); } else { subResults.push(foundBlock); } pos = endTagPos; } else { pos++; } } if (isFirstFilter && subResults.length > 0) subResults = [subResults[0]]; if (isLastFilter && subResults.length > 0) subResults = [subResults[subResults.length - 1]]; results = results.concat(subResults); } var newInstance = _$(results); newInstance.sourceHtml = this.sourceHtml || currentHtml; return newInstance; }, each: function (callback) { for (var i = 0; i < this.elements.length; i++) { var childInstance = _$(this.elements[i]); childInstance.sourceHtml = this.sourceHtml; callback.call(childInstance, i, this.elements[i]); } return this; }, eq: function (index) { if (index < 0) index = this.elements.length + index; var matchedElement = this.elements[index]; this.elements = matchedElement ? [matchedElement] : []; this.length = this.elements.length; return this; }, attr: function (attrName) { if (this.elements.length === 0) return ""; var elem = this.elements[0]; var getAttr = elem.match(new RegExp(attrName + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i')); return getAttr ? (getAttr[1] || getAttr[2] || getAttr[3] || "") : ""; }, html: function () { if (this.elements.length === 0) return ""; var elem = this.elements[0]; var start = elem.indexOf('>') + 1; var matchClose = elem.match(/<\/([a-zA-Z0-9_-]+)\s*>\s*$/i); if (matchClose) { var end = elem.lastIndexOf(matchClose[0]); if (start > 0 && end >= start) return elem.substring(start, end); } return start > 0 ? elem.substring(start) : ""; }, text: function (separator) { if (this.elements.length === 0) return ""; var elem = this.elements[0]; var start = elem.indexOf('>') + 1; var end = elem.lastIndexOf('</'); if (start > 0 && end > start) { var content = elem.substring(start, end); var pureText = content.replace(/<\/?[^>]+(>|$)/g, "\n"); if (typeof separator === 'string') { return pureText .split('\n') .map(function (item) { return item.trim(); }) .filter(function (item) { return item !== ''; }) .join(separator); } return pureText .split('\n') .map(function (item) { return item.trim(); }) .filter(function (item) { return item !== ''; }) .join(' '); } return ""; }, textAll: function (separator) { if (this.elements.length === 0) return ""; var sep = typeof separator === 'string' ? separator : " "; var allTexts = []; for (var i = 0; i < this.elements.length; i++) { var elem = this.elements[i]; var start = elem.indexOf('>') + 1; var end = elem.lastIndexOf('</'); if (start > 0 && end > start) { var content = elem.substring(start, end); var pureText = content.replace(/<\/?[^>]+(>|$)/g, "\n"); var cleanText = pureText .split('\n') .map(function (item) { return item.trim(); }) .filter(function (item) { return item !== ''; }) .join(' '); if (cleanText !== '') { allTexts.push(cleanText); } } } return allTexts.join(sep); }, next: function () { var results = []; if (!this.sourceHtml) return this; for (var i = 0; i < this.elements.length; i++) { var elem = this.elements[i]; var idx = this.sourceHtml.indexOf(elem); if (idx === -1) continue; var scanPos = idx + elem.length; var nextOpen = this.sourceHtml.indexOf('<', scanPos); if (nextOpen !== -1) { if (this.sourceHtml.charAt(nextOpen + 1) === '/') continue; var endOpenTag = this.sourceHtml.indexOf('>', nextOpen); if (endOpenTag === -1) continue; var fullOpenTag = this.sourceHtml.substring(nextOpen, endOpenTag + 1); var spacePos = fullOpenTag.indexOf(' '); var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1, spacePos).toLowerCase(); var startTagPos = nextOpen; var endTagPos = endOpenTag + 1; var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta']; if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) { var depth = 1; var tagRegex = new RegExp('<(/?)' + currentTagName + '(?:\\s+[^>]*|\\s*>)', 'gi'); tagRegex.lastIndex = endOpenTag + 1; var match; while ((match = tagRegex.exec(this.sourceHtml)) !== null) { if (match[1] === '/') depth--; else if (match[0].indexOf('/>') === -1) depth++; if (depth === 0) { endTagPos = tagRegex.lastIndex; break; } } } results.push(this.sourceHtml.substring(startTagPos, endTagPos)); } } var nextInstance = _$(results); nextInstance.sourceHtml = this.sourceHtml; this.elements = results; this.length = results.length; return this; }, parent: function () { var results = []; if (!this.sourceHtml) return this; for (var i = 0; i < this.elements.length; i++) { var elem = this.elements[i]; var idx = this.sourceHtml.indexOf(elem); if (idx <= 0) continue; var scanPos = idx - 1; while (scanPos >= 0) { var openTagPos = this.sourceHtml.lastIndexOf('<', scanPos); if (openTagPos === -1) break; if (this.sourceHtml.charAt(openTagPos + 1) !== '/' && this.sourceHtml.charAt(openTagPos + 1) !== '!') { var endOpenTag = this.sourceHtml.indexOf('>', openTagPos); if (endOpenTag !== -1 && endOpenTag > openTagPos) { var fullOpenTag = this.sourceHtml.substring(openTagPos, endOpenTag + 1); var spacePos = fullOpenTag.indexOf(' '); var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1, spacePos).toLowerCase(); var endTagPos = endOpenTag + 1; var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta']; if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) { var depth = 1; var tagRegex = new RegExp('<(/?)' + currentTagName + '(?:\\s+[^>]*|\\s*>)', 'gi'); tagRegex.lastIndex = endOpenTag + 1; var match; while ((match = tagRegex.exec(this.sourceHtml)) !== null) { if (match[1] === '/') depth--; else if (match[0].indexOf('/>') === -1) depth++; if (depth === 0) { endTagPos = tagRegex.lastIndex; break; } } } if (endTagPos >= idx + elem.length) { var parentBlock = this.sourceHtml.substring(openTagPos, endTagPos); if (results.indexOf(parentBlock) === -1) results.push(parentBlock); break; } } } scanPos = openTagPos - 1; } } var parentInstance = _$(results); parentInstance.sourceHtml = this.sourceHtml; this.elements = results; this.length = results.length; return this; }, closest: function (selector) { var results = []; if (!this.sourceHtml || this.elements.length === 0) return _$([]); for (var i = 0; i < this.elements.length; i++) { var currentElem = this.elements[i]; var currentObj = _$(currentElem); currentObj.sourceHtml = this.sourceHtml; var selfCheck = _$(this.sourceHtml).find(selector); var isSelfMatched = false; for (var s = 0; s < selfCheck.elements.length; s++) { if (selfCheck.elements[s] === currentElem) { isSelfMatched = true; break; } } if (isSelfMatched) { if (results.indexOf(currentElem) === -1) results.push(currentElem); continue; } var parentObj = currentObj.parent(); while (parentObj.elements.length > 0) { var parentElem = parentObj.elements[0]; var checkMatch = _$(this.sourceHtml).find(selector); var isMatched = false; for (var j = 0; j < checkMatch.elements.length; j++) { if (checkMatch.elements[j] === parentElem) { isMatched = true; break; } } if (isMatched) { if (results.indexOf(parentElem) === -1) results.push(parentElem); break; } parentObj = parentObj.parent(); } } var closestInstance = _$(results); closestInstance.sourceHtml = this.sourceHtml; return closestInstance; } }; instance.length = instance.elements.length; return instance; };