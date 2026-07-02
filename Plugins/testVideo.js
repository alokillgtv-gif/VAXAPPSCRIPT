// =============================================================================
// VAAPP Plugin - Crophim Pro (Đồng bộ cấu trúc 100% theo chuẩn RophimFake)
// Tên file bắt buộc khi lưu: crophim_plugin.js
// =============================================================================
BaseURL = "https://script.google.com/macros/s/AKfycbwen0-k5gXcj4UNeKMGVY1zQQ_KPepFCfM7aSXHnnyhLOJ_ViI0KzN6YLqrUAsYyD-qAg/exec";
function getManifest() {
    return JSON.stringify({
        "id": "testvideo",          
        "name": "Test",
        "description": "Nguồn xem phim Online ổn định",
        "version": "1.3",             
        "baseUrl": BaseURL,
        "iconUrl": "https://crimescenesolutions.co.za/wp-content/uploads/2026/04/phimhayok-io-fav.jpg", 
        "isEnabled": true,
        "type": "MOVIE",
        "playerType": "exoplayer"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "", "title": "Phim Lẻ", "type": "Horizontal" }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { "name": "Hành Động", "slug": "" }
    ]);
}

function getFilters() {
    return JSON.stringify({
        "sort": [
            { "name": "Mới nhất", "value": "newest" }
        ]
    });
}

// =============================================================================
// URL GENERATION (Bóc tách slug sạch theo khuôn mẫu mới)
// =============================================================================

function getUrlList(slug, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    
    if (slug === "hanh-dong" || slug === "kinh-di" || slug === "phim-18" || slug === "hai-huoc" || slug === "chien-tranh" || slug === "hoat-hinh" || slug === "vien-tuong") {
        return BaseURL;
    }
    return BaseURL;
}

function getUrlSearch(keyword, filtersJson) {
    return BaseURL;
}

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf('http') === 0) return slug;
    return BaseURL;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS
// =============================================================================

function parseListResponse(html) {
    try {
        var items = [];
            items.push({
                "id": BaseURL,          
                "title": "testvideo", 
                "posterUrl": "https://img-cdn.phimhayok.net/filmhayok/1782912263995/20260701/ChatGPT-Image-19_29_49-1-thg-7-2026_a20d108246f140ad8be82acb9bca2606.png",  
                "backdropUrl": "https://img-cdn.phimhayok.net/filmhayok/1782912263995/20260701/ChatGPT-Image-19_29_49-1-thg-7-2026_a20d108246f140ad8be82acb9bca2606.png"
            });
        
        var totalPages = 1; 
        var currentPage = 1; 

        return JSON.stringify({
            "items": items,
            "pagination": { "currentPage": currentPage, "totalPages": totalPages }
        });
    } catch (e) {
        return JSON.stringify({ "items": [], "pagination": { "currentPage": 1, "totalPages": 1 } });
    }
}

function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(html) {
    try {
        var id = BaseURL;
        var title = "Chưa rõ tên phim";
        var year = "2026";
        var des = "Chưa có mô tả.";
        var img = "https://img-cdn.phimhayok.net/filmhayok/1782912263995/20260701/ChatGPT-Image-19_29_49-1-thg-7-2026_a20d108246f140ad8be82acb9bca2606.png";
        var movieUrl = "";
        var episodes = [{ id: id, name: "Xem Ngay", slug: "full" }];
		    var linkfrist = "";
        
        return JSON.stringify({
            "id": id,
            "title": title,
            "posterUrl": img,
            "backdropUrl": img,
            "description": des,
            "year": year,
            "rating": 10,
            "quality": "HD",
            "servers": [{ "name": "Server Vietsub", "episodes": episodes }]
        });

    } catch (e) {
        return JSON.stringify({ "id": "error", "title": "Lỗi tải dữ liệu", "servers": [] });
    }
}
//  <a onclick="chooseStreamingServer(this)" data-type="m3u8" id="streaming-sv" data-id="1" data-link="https://cdn.phimhayok.net/filmhayok/hls/6a3a9626d63a92f33ffa0063/20260623142024/playlist.m3u8" class="streaming-server tag-link" style="background: #232328;color: #FFF">
function parseDetailResponse(html) {
    try {
        var videoUrl = "";
        var $obj = JSON.parse(html);
        videoUrl = $obj[0].link;
        
        return JSON.stringify({
            "url": videoUrl, 
            "headers": {
                "Referer": $obj[0].ref,
                "Origin": $obj[0].ref,
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            },
            "subtitles": []
        });

    } catch (e) {
        return JSON.stringify({ "url": "", "headers": {} });
    }
}

// KHỚP MẪU ROPHIMFAKE: Trả về chuỗi text thuần túy thay vì gọi JSON.stringify
function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
