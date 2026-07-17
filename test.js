// =============================================================================
// CONFIGURATION & METADATA
// =============================================================================

function getManifest() {
    return JSON.stringify({
        "id": "animevietsub",
        "name": "AnimeVietSub",
        "version": "1.0.7",
        "baseUrl": "https://animevietsub.love",
        "iconUrl": "https://animevietsub.love/statics/default/images/logo.png",
        "isEnabled": true,
        "type": "MOVIE",
        "playerType": "embedtoexoplay"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { slug: 'anime-moi-cap-nhat', title: 'Anime Mới Cập Nhật', type: 'Grid', path: '/' },
        { slug: 'anime-bo', title: 'Anime Bộ', type: 'Horizontal', path: 'anime-bo' },
        { slug: 'anime-le', title: 'Anime Lẻ/Movie', type: 'Horizontal', path: 'anime-le' },
        { slug: 'hoat-hinh-trung-quoc', title: 'HH Trung Quốc', type: 'Horizontal', path: 'hoat-hinh-trung-quoc' },
        { slug: 'anime-sap-chieu', title: 'Anime Sắp Chiếu', type: 'Horizontal', path: 'anime-sap-chieu' }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { name: 'Anime Bộ', slug: 'anime-bo' },
        { name: 'Anime Lẻ', slug: 'anime-le' },
        { name: 'HH Trung Quốc', slug: 'hoat-hinh-trung-quoc' },
        { name: 'Anime Sắp Chiếu', slug: 'anime-sap-chieu' },
        { name: 'Hành Động', slug: 'the-loai/hanh-dong' },
        { name: 'Phiêu Lưu', slug: 'the-loai/phieu-luu' },
        { name: 'Hài Hước', slug: 'the-loai/hai-huoc' },
        { name: 'Phép Thuật', slug: 'the-loai/phep-thuat' }
    ]);
}

function getFilterConfig() {
    return JSON.stringify({
        sort: [
            { name: 'Mới cập nhật', value: 'latest' },
            { name: 'Lượt xem', value: 'view' },
            { name: 'Bình chọn', value: 'rating' }
        ]
    });
}

// Helper log
function log(msg) {
    if (typeof console !== 'undefined' && console.log) {
        console.log("[AnimeVsubPlugin] " + msg);
    }
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        var sort = filters.sort || "latest";

        var targetSlug = slug;
        if (filters.category) {
            targetSlug = "the-loai/" + filters.category;
        }

        // Clean slug
        if (targetSlug.startsWith("/")) targetSlug = targetSlug.substring(1);
        if (targetSlug.endsWith("/")) targetSlug = targetSlug.substring(0, targetSlug.length - 1);

        var baseUrl = "https://animevietsub.love";
        
        // Handle Trang chủ (phim mới cập nhật)
        if (targetSlug === 'anime-moi-cap-nhat' || targetSlug === '') {
            if (page === 1) return baseUrl + "/";
            return baseUrl + "/anime-moi-cap-nhat/trang-" + page + ".html";
        }

        // Handle path format
        if (page === 1) {
            return baseUrl + "/" + targetSlug + "/";
        } else {
            return baseUrl + "/" + targetSlug + "/trang-" + page + ".html";
        }
    } catch (e) {
        return "https://animevietsub.love/";
    }
}

function getUrlSearch(keyword, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        var cleanKeyword = encodeURIComponent(keyword.trim());
        
        if (page === 1) {
            return "https://animevietsub.love/tim-kiem/" + cleanKeyword + "/";
        } else {
            return "https://animevietsub.love/tim-kiem/" + cleanKeyword + "/trang-" + page + ".html";
        }
    } catch (e) {
        return "https://animevietsub.love/";
    }
}

function getUrlDetail(slug) {
    if (slug.indexOf("http") === 0) return slug;
    // Clean slug
    var cleanSlug = slug;
    if (cleanSlug.startsWith("/")) cleanSlug = cleanSlug.substring(1);
    if (cleanSlug.startsWith("phim/")) cleanSlug = cleanSlug.substring(5);
    
    return "https://animevietsub.love/phim/" + cleanSlug;
}

function getUrlCategories() { return "https://animevietsub.love"; }
function getUrlCountries() { return "https://animevietsub.love"; }
function getUrlYears() { return "https://animevietsub.love"; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(htmlContent) {
    try {
        var movies = [];
        var seen = {};

        // Helper: extract movie from card HTML
        function extractMovie(cardHtml) {
        }

        // Pattern 1: <article class="TPost C ..."> (trang danh mục)
        var articlePattern = /<article class="TPost[^"]*">[\s\S]*?<\/article>/gi;
        var match;
        while ((match = articlePattern.exec(htmlContent)) !== null) {
            var movie = extractMovie(match[0]);
            if (movie) movies.push(movie);
        }

        // Pattern 2: <li> trong <ul class="MovieList Newepisode"> (trang chủ)
        if (movies.length === 0) {
            var listBlock = /<ul class="MovieList Newepisode">[\s\S]*?<\/ul>/i.exec(htmlContent);
            if (listBlock) {
                var liPattern = /<li>[\s\S]*?<\/li>/gi;
                while ((match = liPattern.exec(listBlock[0])) !== null) {
                    var movie = extractMovie(match[0]);
                    if (movie) movies.push(movie);
                }
            }
        }

        // Pattern 3: Fallback - <div class="TPost B"> (sidebar cards)
        if (movies.length === 0) {
            var divPattern = /<div class="TPost[^"]*">[\s\S]*?<\/div>\s*<\/div>/gi;
            while ((match = divPattern.exec(htmlContent)) !== null) {
                var movie = extractMovie(match[0]);
                if (movie) movies.push(movie);
            }
        }

        // Parse phân trang
        var totalPages = 1;
        var lastPageMatch = /href="[^"]*trang-(\d+)\.html"[^>]*>Trang Cuối<\/a>/i.exec(htmlContent);
        if (lastPageMatch) {
            totalPages = parseInt(lastPageMatch[1]);
        } else {
            var pagePattern = /class="page[^"]*">(\d+)<\/a>/gi;
            var pMatch;
            while ((pMatch = pagePattern.exec(htmlContent)) !== null) {
                var pNum = parseInt(pMatch[1]);
                if (pNum > totalPages) totalPages = pNum;
            }
        }

        var currentPage = 1;
        var curPageMatch = /class="[^"]*current[^"]*">(\d+)<\/span>/i.exec(htmlContent);
        if (curPageMatch) currentPage = parseInt(curPageMatch[1]);

        return JSON.stringify({
            items: movies,
            pagination: {
                currentPage: currentPage,
                totalPages: totalPages
            }
        });
    } catch (e) {
        log("parseListResponse error: " + e.message);
        return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
    }
}

function parseSearchResponse(htmlContent) {
    return parseListResponse(htmlContent);
}

function parseMovieDetail(htmlContent) {
    try {
        var idMatch = /<link\s+rel="canonical"\s+href="([^"]+)"/i.exec(htmlContent) || /<meta\s+property="og:url"\s+content="([^"]+)"/i.exec(htmlContent);
        var id = idMatch ? idMatch[1] : "";

        var titleMatch = /<h1[^>]* itemprop="name">([\s\S]*?)<\/h1>/i.exec(htmlContent) || /<h1 class="title">([\s\S]*?)<\/h1>/i.exec(htmlContent);
        var title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "").trim() : "";

        var descMatch = /<div class="Description[^"]*" itemprop="description">([\s\S]*?)<\/div>/i.exec(htmlContent) || /<div id="film-info-desc"[^>]*>([\s\S]*?)<\/div>/i.exec(htmlContent);
        var description = descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim() : "";

        var posterMatch = /<img[^>]*class="[^"]*attachment-img-mov-md[^"]*"[^>]*(?:src|data-src)="([^"]+)"/i.exec(htmlContent) || /<img class="poster"[^>]*(?:src|data-src)="([^"]+)"/i.exec(htmlContent);
        var posterUrl = posterMatch ? posterMatch[1] : "";

        var genres = [];
        var genreBlockMatch = /<li>\s*<span class="info-title">Thể loại:<\/span>([\s\S]*?)<\/li>/i.exec(htmlContent) || /Thể loại:([\s\S]*?)(?:<br|<\/li>)/i.exec(htmlContent);
        if (genreBlockMatch) {
            var genreMatch;
            var genrePattern = /<a[^>]*>([^<]+)<\/a>/gi;
            while ((genreMatch = genrePattern.exec(genreBlockMatch[1])) !== null) {
                genres.push(genreMatch[1].trim());
            }
        }

        var countries = [];
        var countryBlockMatch = /<li>\s*<span class="info-title">Quốc gia:<\/span>([\s\S]*?)<\/li>/i.exec(htmlContent);
        if (countryBlockMatch) {
            var countryMatch;
            var countryPattern = /<a[^>]*>([^<]+)<\/a>/gi;
            while ((countryMatch = countryPattern.exec(countryBlockMatch[1])) !== null) {
                countries.push(countryMatch[1].trim());
            }
        }

        var year = 0;
        var yearMatch = /<li>\s*<span class="info-title">Năm phát hành:<\/span>[\s\S]*?<a[^>]*>(\d{4})<\/a>/i.exec(htmlContent) || /Season:[\s\S]*?- (\d{4})/i.exec(htmlContent);
        if (yearMatch) year = parseInt(yearMatch[1]);

        var statusMatch = /<li>\s*<span class="info-title">Trạng thái:<\/span>\s*([\s\S]*?)<\/li>/i.exec(htmlContent);
        var status = statusMatch ? statusMatch[1].replace(/<[^>]*>/g, "").trim() : "";

        var episode_current = "";
        if (status) {
            var epMatch2 = /(Tập \d+|Full|Hoàn Tất)/i.exec(status);
            if (epMatch2) episode_current = epMatch2[1];
        }

        // Parse danh sách tập phim
        var episodes = [];
        var epPattern = /<a\s+[^>]*href="([^"]*\/tap-[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
        var epMatch;
        while ((epMatch = epPattern.exec(htmlContent)) !== null) {
            var epUrl = epMatch[1];
            var epName = epMatch[2].replace(/<[^>]*>/g, "").trim();
            
            if (epUrl.indexOf('http') !== 0) {
                epUrl = "https://animevietsub.love" + (epUrl.startsWith('/') ? '' : '/') + epUrl;
            }
            
            // Tránh add trùng tập
            var isDuplicate = false;
            for (var i = 0; i < episodes.length; i++) {
                if (episodes[i].id === epUrl) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                episodes.push({
                    id: epUrl,
                    name: epName,
                    slug: epUrl
                });
            }
        }

        // Sắp xếp các tập phim theo thứ tự tăng dần (ví dụ Tập 1 -> Tập 13)
        episodes.sort(function(a, b) {
            var epA = parseInt(a.name) || 0;
            var epB = parseInt(b.name) || 0;
            return epA - epB;
        });

        var servers = [];
        if (episodes.length > 0) {
            servers.push({
                name: "AnimeVsub",
                episodes: episodes
            });
        }

// Trích xuất slug từ canonical URL hoặc og:url (id)
// Bước 1: Khởi tạo biến 'slug' với giá trị rỗng để lưu trữ tên định danh (slug) của bộ phim.
var idMatch = /<link\s+rel="canonical"\s+href="([^"]+)"/i.exec(htmlContent) || /<meta\s+property="og:url"\s+content="([^"]+)"/i.exec(htmlContent);
var id = idMatch ? idMatch[1] : "";
var slug = "";

// Bước 2: Kiểm tra xem biến 'id' (thường là URL canonical hoặc đường dẫn của trang hiện tại) có tồn tại hay không.
if (id) {
    /**
     * Sử dụng biểu thức chính quy (Regular Expression) để tìm kiếm cấu trúc "/phim/[chuỗi_slug]" trong biến 'id'.
     * - \/phim\/ : Tìm chính xác cụm "/phim/"
     * - ([^/]+)  : Nhóm bắt giữ (Capture Group 1) để lấy tất cả các ký tự liên tiếp KHÔNG chứa dấu gạch chéo "/".
     *              Đây chính là phần slug của bộ phim (ví dụ: "naruto-shippuden").
     */
    var slugMatch = /\/phim\/([^/]+)/.exec(id);
    
    /**
     * Nếu tìm thấy kết quả khớp (slugMatch không null):
     *   - Gán 'slug' bằng nhóm bắt giữ thứ nhất (slugMatch[1]).
     * Nếu không tìm thấy kết quả khớp:
     *   - Dự phòng gán luôn giá trị của 'id' cho 'slug'.
     */
    slug = slugMatch ? slugMatch[1] : id;
}

// Bước 3: Nếu vẫn chưa tìm thấy slug (biến 'slug' vẫn rỗng sau bước trên):
if (!slug) {
    /**
     * Tiếp tục tìm kiếm cấu trúc "/phim/[chuỗi_slug]" nhưng lần này quét trên toàn bộ nội dung HTML của trang (htmlContent).
     * Điều này hữu ích khi URL của trang không chứa slug, nhưng trong nội dung trang (như các thẻ meta, link) lại có chứa nó.
     */
    var slugMatch2 = /\/phim\/([^/]+)/.exec(htmlContent);
    
    /**
     * Nếu tìm thấy trong HTML:
     *   - Gán 'slug' bằng kết quả khớp tìm được (slugMatch2[1]).
     * Nếu vẫn không tìm thấy:
     *   - Giữ nguyên giá trị của 'slug' là chuỗi rỗng "".
     */
    slug = slugMatch2 ? slugMatch2[1] : "";
}

// =========================================================================
// Tạo URL phụ (extra url) để tải đầy đủ các tập phim từ trang xem phim trực tiếp.
// =========================================================================

// Bước 4: Khởi tạo biến 'extra' chứa URL phụ, mặc định ban đầu là chuỗi rỗng.
var extra = "";

/**
 * Bước 5: Xác định xem người dùng có đang ở sẵn trong trang phát video (trang xem phim) hay không.
 * Trang được coi là "trang xem phim" (isPlayPage = true) nếu thỏa mãn 1 trong 2 điều kiện sau:
 * 
 * Điều kiện A: Biến 'id' tồn tại VÀ trong 'id' có chứa từ khóa "xem-phim".
 *   - (id && id.indexOf("xem-phim") > -1)
 * 
 * Điều kiện B: Trong nội dung HTML (htmlContent) có chứa đoạn script khai báo biến "window.PLAYER_DATA".
 *   - (htmlContent.indexOf("window.PLAYER_DATA") > -1)
 */
var isPlayPage = (id && id.indexOf("xem-phim") > -1) || htmlContent.indexOf("window.PLAYER_DATA") > -1;

/**
 * Bước 6: Nếu thỏa mãn đồng thời các điều kiện sau:
 * 1. KHÔNG phải là trang xem phim trực tiếp (!isPlayPage) -> Tức là người dùng đang ở trang giới thiệu/thông tin chi tiết (Detail page).
 * 2. Đã tìm thấy tên định danh hợp lệ (slug có giá trị).
 * 3. Tên định danh này không phải là chuỗi báo lỗi "error" (slug !== "error").
 * 
 * -> Thì hệ thống sẽ tự động ghép nối và tạo ra đường dẫn trực tiếp đến trang xem phim của bộ phim đó.
 */
if (!isPlayPage && slug && slug !== "error") {
    // Ghép slug vào cấu trúc URL chuẩn của web animevietsub để tạo link xem phim trực tiếp.
    extra = "https://animevietsub.love/phim/" + slug + "/xem-phim.html";
}


        return JSON.stringify({
            id: slug,
            title: title,
            posterUrl: posterUrl,
            backdropUrl: posterUrl,
            description: description,
            year: year,
            servers: servers,
            episode_current: episode_current,
            lang: "Vietsub",
            quality: "FHD",
            category: genres.join(", "),
            country: countries.join(", "),
            status: status,
            extra: extra
        });
    } catch (e) {
        log("parseMovieDetail error: " + e.message);
        return JSON.stringify({ id: "error", title: "", servers: [] });
    }
}

function parseDetailResponse(htmlContent, pageUrl) {
    try {
        log("parseDetailResponse input pageUrl: " + pageUrl);
        
        var link = "";
        // Tìm window.PLAYER_DATA
        var match = /window\.PLAYER_DATA\s*=\s*(\{.*?\});/s.exec(htmlContent);
        if (match) {
            var data = JSON.parse(match[1]);
            if (data && data.link) {
                link = data.link;
                log("Extracted player link from window.PLAYER_DATA: " + link);
            }
        }
        
        // Fallback: Quét tất cả các iframe
        if (!link) {
            var iframeMatch = htmlContent.match(/<iframe[^>]*src="([^"]+)"/i);
            if (iframeMatch) {
                link = iframeMatch[1];
                log("Fallback iframe link: " + link);
            }
        }
        
        if (link) {
            if (link.indexOf('//') === 0) link = "https:" + link;
            
            // Bypass anti-frame: inject Custom-Js để override window.top check
            // Script avs-shield.min.js kiểm tra window.self === window.top
            // Ta dùng Object.defineProperty ghi đè window.top = window.self
            var bypassJs = "try{Object.defineProperty(window,'top',{get:function(){return window.self}});}catch(e){}";
            
            return JSON.stringify({
                url: link,
                isEmbed: false,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": pageUrl || "https://animevietsub.love/",
                    "Custom-Js": bypassJs
                },
                subtitles: []
            });
        }
        
        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
    } catch (e) {
        log("parseDetailResponse error: " + e.message);
        return JSON.stringify({ url: "", isEmbed: false, headers: {}, subtitles: [] });
    }
}

function parseEmbedResponse(htmlContent, url) {
    try {
        // Thử trích xuất direct HLS stream từ player page
        var m3u8Match = /["'](https?:\/\/[^"'\s]*\.m3u8[^"'\s]*?)["']/i.exec(htmlContent);
        if (m3u8Match) {
            log("Found m3u8 stream: " + m3u8Match[1]);
            return JSON.stringify({
                url: m3u8Match[1],
                isEmbed: false,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": "https://animevietsub.love/"
                },
                subtitles: []
            });
        }

        // Không tìm thấy m3u8 → trả embed với Block-Scripts chặn avs-shield
        // Trích xuất nextUrl từ URL embed hiện tại để làm Referer chuẩn
        var nextUrlMatch = url.match(/nextUrl=([^&]+)/);
        var referer = nextUrlMatch ? decodeURIComponent(nextUrlMatch[1]) : "https://animevietsub.love/";

        return JSON.stringify({
            url: url,
            isEmbed: false,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": referer,
                "Block-Scripts": "avs-shield"
            },
            subtitles: []
        });
    } catch (e) {
        log("parseEmbedResponse error: " + e.message);
        return JSON.stringify({ url: url, isEmbed: true, headers: {}, subtitles: [] });
    }
}

// =============================================================================
// CATEGORIES
// =============================================================================

function parseCategoriesResponse(htmlContent) {
    try {
        var categories = [];
        // Parse menu thể loại từ trang chủ
        var menuBlock = /<ul class="sub-menu[^"]*">([\s\S]*?)<\/ul>/i.exec(htmlContent);
        if (menuBlock) {
            var catPattern = /<a\s+href="[^"]*\/the-loai\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
            var catMatch;
            while ((catMatch = catPattern.exec(menuBlock[1])) !== null) {
                var catSlug = catMatch[1].replace(/\//g, "");
                var catName = catMatch[2].trim();
                if (catSlug && catName) {
                    categories.push({ name: catName, slug: catSlug });
                }
            }
        }
        // Fallback: quét toàn trang nếu không tìm thấy trong submenu
        if (categories.length === 0) {
            var fallbackPattern = /<a\s+href="[^"]*\/the-loai\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
            var fbMatch;
            while ((fbMatch = fallbackPattern.exec(htmlContent)) !== null) {
                var fbSlug = fbMatch[1].replace(/\//g, "");
                var fbName = fbMatch[2].trim();
                var exists = false;
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i].slug === fbSlug) { exists = true; break; }
                }
                if (!exists && fbSlug && fbName) {
                    categories.push({ name: fbName, slug: fbSlug });
                }
            }
        }
        return JSON.stringify(categories);
    } catch (e) {
        log("parseCategoriesResponse error: " + e.message);
        return "[]";
    }
}

function parseCountriesResponse(htmlContent) { return "[]"; }
function parseYearsResponse(htmlContent) { return "[]"; }