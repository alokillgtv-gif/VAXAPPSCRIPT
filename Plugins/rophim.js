// =============================================================================
// VAAPP Plugin - Rophim Fake (Bản vá chuẩn hóa theo cấu trúc Core mới nhất)
// =============================================================================
BASEURL = "https://script.google.com/macros/s/AKfycbyxM6-_Q-DG_2l1hm1bM_ASVA74OPywVPk3hpm2FbpT78gGzBEpDN81Ty6tla8DTO27/exec?&type=html&render=false&check=true&url=https://phimvn2y.com"


function getManifest() {
    return JSON.stringify({
        "id": "rophim",          
        "name": "RophimFake",
        "description": "Nguồn xem phim PhimVN2Y ổn định",
        "version": "1.0",             
        "baseUrl": "https://phimvn2y.com",
        "iconUrl": "https://phimvn2y.com/wp-content/themes/rophim-2/assets/images/logo.svg", 
        "isEnabled": true,
        "type": "VIDEO",
        "playerType": "exoplayer"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "phim-le", "title": "Phim Lẻ Mới", "type": "Horizontal" },
        { "slug": "phim-bo", "title": "Phim Bộ Mới", "type": "Horizontal" },
        { "slug": "phim-18", "title": "Phim 18+", "type": "Horizontal" },
        { "slug": "phim-hai", "title": "Phim Hài", "type": "Horizontal" },
        { "slug": "hoat-hinh", "title": "Hoạt Hình", "type": "Horizontal" },
        { "slug": "hanh-dong", "title": "Hành Động", "type": "Horizontal" },
        { "slug": "kinh-di", "title": "Kinh Dị", "type": "Grid" }
    ]);
}

function getPrimaryCategories() {
    return JSON.stringify([
        { "name": "Hành Động", "slug": "hanh-dong" },
        { "name": "Kinh Dị", "slug": "kinh-di" },
        { "slug": "phim-18", "name": "Phim 18+"},
        { "slug": "phim-hai", "name": "Hài Hước"},
        { "slug": "chien-tranh", "name": "Chiến Tranh"},
        { "slug": "hoat-hinh", "name": "Hoạt Hình"},
        { "slug": "vien-tuong", "name": "Viễn Tưởng"}
    ]);
}

function getFilters() {
    return JSON.stringify({
        "sort": [
            { "name": "Mới nhất", "value": "newest" }
        ]
    });
}

function getFilterConfig() {
    return JSON.stringify({
        sort: [
            { name: 'Mới cập nhật', value: 'update' },
            { name: 'Năm xuất bản', value: 'year' },
            { name: 'Lượt xem', value: 'view' }
        ]
    });
}

// =============================================================================
// URL GENERATION
// =============================================================================

function getUrlList(slug, filtersJson) {
    try {
        var filters = JSON.parse(filtersJson || "{}");
        var page = filters.page || 1;
        
        if (page > 1) {
            return BASEURL + "/" + slug + "/?page=" + page;
        }
        return BASEURL + "/" + slug;
    } catch (e) {
        return BASEURL + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/tim-kiem/?q=" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    if (!slug) return "";

    // Xử lý ID phức hợp dạng movieSlug|epSlug khi người dùng bấm chọn tập trên Player
    if (slug.indexOf("|") !== -1) {
        var parts = slug.split("|");
        if (parts.length >= 2) {
            var movieSlug = parts[0];
            var epSlug = parts[1];
            return BASEURL + "/" + movieSlug + "-" + epSlug + ".html";
        }
    }

    if (slug.indexOf("http") === 0) return slug;
    if (slug.indexOf("/") === 0) return BASEURL + "/" + slug;
    return BASEURL + "/" + slug;
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
        var regex = /class="sw-item"[^>]*data-title="([^"]+)"[\s\S]*?<a\s+href="([^"]+)"[^>]*class="v-thumbnail"[\s\S]*?<img\s+src="([^"]+)"/g;
        var match;
        
        while ((match = regex.exec(html)) !== null) {
            var cleanThumb = match[3].replace(/&amp;/g, '&'); 
            var rawUrl = match[2];
            
            // ĐÃ SỬA: Bóc tách lấy slug sạch từ URL gốc (ví dụ: 'phim-abc') để đồng bộ ID với Core
            var cleanSlug = rawUrl.replace(/https?:\/\/[^\/]+\//, "").replace(/\/$/, "");

            items.push({
                "id": cleanSlug,          
                "title": match[1].trim(), 
                "posterUrl": cleanThumb,
                "backdropUrl": cleanThumb
            });
        }

        var currentPage = 1;
        var totalPages = 1;

        if (html) {
            var currentMatch = html.match(/class="[^"]*v-form-control[^"]*"[^>]*value="(\d+)"/i) 
                            || html.match(/value="(\d+)"[^>]*class="[^"]*v-form-control[^"]*"/i);
            
            var maxMatch = html.match(/class="[^"]*v-form-control[^"]*"[^>]*max="(\d+)"/i)
                        || html.match(/max="(\d+)"[^>]*class="[^"]*v-form-control[^"]*"/i);

            if (currentMatch && currentMatch[1]) {
                currentPage = parseInt(currentMatch[1], 10);
            }
            if (maxMatch && maxMatch[1]) {
                totalPages = parseInt(maxMatch[1], 10);
            }
        }

        return JSON.stringify({
            "items": items,
            "pagination": { 
                "currentPage": currentPage, 
                "totalPages": totalPages,    
                "totalItems":  24 * totalPages,
                "itemsPerPage": 24
            }
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
        var parts = html.split(/window\s*\.?\s*_\s*movie\s*=\s*(.*)/i);
        
        if (!parts || parts.length < 2) {
            return JSON.stringify({ "id": "error-split", "title": "Không tìm thấy vùng dữ liệu window._movie", "servers": [] });
        }

        var movieScriptMatch = parts[1];
        var _movieObj;
        eval("_movieObj = " + movieScriptMatch);

        if (_movieObj) {
            var title = _movieObj.title || "Chưa rõ tên phim";
            
            var posterUrl = "";
            if (_movieObj.poster) {
                posterUrl = _movieObj.poster;
            } else if (_movieObj.thumb) {
                posterUrl = _movieObj.thumb;
            }
            var movieSlug = _movieObj.slug || "";
            
            var descMatch = html.match(/class="[^"]*child-box[^"]*"[\s\S]*?class="[^"]*child-content[^"]*"[\s\S]*?class="[^"]*movie-seo-article[^"]*"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
            var description = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : "Đang cập nhật...";
            
            var appServers = [];

            if (Array.isArray(_movieObj.episodes)) {
                for (var s = 0; s < _movieObj.episodes.length; s++) {
                    var rawServer = _movieObj.episodes[s];
                    var serverName = rawServer.server_name || rawServer.name || ("Server " + (s + 1));
                    var episodes = [];

                    if (Array.isArray(rawServer.server_data)) {
                        for (var i = 0; i < rawServer.server_data.length; i++) {
                            var ep = rawServer.server_data[i];
                            
                            var epName = ep.name ? "Tập " + ep.name : "Tập " + (i + 1);
                            var epSlug = ep.slug || String(i + 1);
                            
                            var numberRegex = /^\d+$/;
                            if (numberRegex.test(epSlug)) {
                                epSlug = "tap-" + epSlug;
                            }
                            epName = epName.replace("Tập Tập","Tập");

                            // Đóng gói ID phức hợp đồng bộ hóa luồng tuyến chọn tập trên Player
                            var specialId = movieSlug + "|" + epSlug; 

                            episodes.push({
                                "id": specialId,  
                                "slug": epSlug,
                                "name": epName
                            });
                        }
                    }

                    if (episodes.length > 0) {
                        appServers.push({
                            "name": serverName.trim(),
                            "episodes": episodes
                        });
                    }
                }
            }

            if (appServers.length === 0) {
                appServers.push({
                    "name": "Nguồn Dự Phòng",
                    "episodes": [{ "id": movieSlug + "|full", "slug": "full", "name": "Full" }]
                });
            }
            
            return JSON.stringify({
                "id": movieSlug || title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                "title": title,
                "posterUrl": posterUrl,
                "backdropUrl": posterUrl,
                "description": description,
                "year": _movieObj.year || "2026",
                "rating": 10,
                "quality": "HD",
                "servers": appServers 
            });
        }

        return JSON.stringify({ "id": "error-object", "title": "Lỗi khởi tạo Object dữ liệu phim", "servers": [] });

    }  catch (error) {
        return JSON.stringify({ 
            "id": "error-" + Date.now(), 
            "title": "Lỗi: " + error.message, 
            "posterUrl": "", 
            "backdropUrl": "",
            "description": "Không thể tải thông tin phim",
            "year": "2026",
            "rating": 0,
            "quality": "SD",
            "servers": [] 
        });
    }
}

function parseDetailResponse(html) {
    try {
        var videoUrl = "";

        if (html && typeof html === 'string') {
            var m3u8Match = html.match(/(https?:\/\/[^"']+\.m3u8[^"']*)/i);
            
            if (m3u8Match) {
                videoUrl = m3u8Match[1].trim();
            } else {
                var embedMatch = html.match(/(https?:\/\/player[^"']+\/player\/\?url=[^"']+)/i);
                if (embedMatch) {
                    videoUrl = decodeURIComponent(embedMatch[1].split('url=')[1]);
                } else if (html.startsWith("http://") || html.startsWith("https://")) {
                    videoUrl = html.trim();
                }
            }
        }

        return JSON.stringify({
            "url": videoUrl,
            "headers": {
                "Referer": "https://phimvn2y.com",
                "Origin": "https://phimvn2y.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

    } catch (e) {
        return JSON.stringify({ "url": "", "headers": {} });
    }
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
