// https://bilutv.asia
BASEURL = "https://motchille.cx";

function getManifest() {
    return JSON.stringify({
        "id": "motchill",
        "name": "Nguồn Phim Motchill",
        "description": "Mochill Trang Xem Phim.",
        "version": "1.0",
        "BASEURL": "https://motchille.cx",
        "iconUrl": "https://motchille.cx/motchill.png",
        "isEnabled": true,
        "type": "MOVIE",
        "playerType": "exoplayer"
    });
}

function log(msg) {
    if (typeof nativeLog !== 'undefined') {
        nativeLog("[motchille] " + msg);
    } else if (typeof console !== 'undefined' && console.log) {
        console.log("[motchille] " + msg);
    }
}

// https://yanhh3d.ac/moi-cap-nhat?page=2
function getHomeSections() {
    var listurl = `
/danh-sach@@Phim Mới@@true
`;
    var menulist = buildMenu(listurl);
    log(menulist)
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
		// 1. Kiểm tra nếu slug là link tuyệt đối (chứa http)
		if (slug && slug.indexOf("http") > -1) {
			
			// Xử lý riêng cho link search tuyệt đối
			if (slug.indexOf("search") > -1) {
				if (filtersJson) {
					// Sửa lỗi JSON thiếu dấu ngoặc kép trước khi parse (đưa lên đây dùng chung)
					let fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":').replace(/:,/g, ':');
					
					try {
						var filters = JSON.parse(fixedJson);
						var page = parseInt(filters.page) || 1;
						
						if (page > 1) {
							// Sửa lại Regex ([^&]+) để lấy trọn vẹn keyword sau q=
							var keyword = slug.match(/\?q=([^&]+)/i);
							if (keyword && keyword[1]) {
								return "https://motchille.cx/search/" + page + "?q=" + keyword[1];
							}
						} else {
							return slug;
						}
					} catch (jsonErr) {
						// Nếu parse JSON vẫn lỗi, trả về slug gốc an toàn luôn
						return slug;
					}
				}
			}
			return slug;
		}
		
		var page = 1;
		var path = slug || "";
		
		// 2. Xử lý an toàn filtersJson cho các trường hợp link tương đối (không chứa http)
		if (filtersJson) {
			let fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":').replace(/:,/g, ':');
			
			try {
				let filters = JSON.parse(fixedJson);
				page = parseInt(filters.page) || 1;
				
				if (filters.category) {
					if (Array.isArray(filters.category) && filters.category.length > 0) {
						path = filters.category[0].slug;
					} else if (typeof filters.category === 'string') {
						path = filters.category;
					}
				}
			} catch (jsonErr) {
				// Coi như bỏ qua nếu lỗi JSON
			}
		}
		
		// 3. Nối chuỗi URL kết quả cho link tương đối
		let resultUrl = BASEURL;
		if (path) {
			resultUrl += path;
		}
		if (page > 1) {
			resultUrl += "/" + page;
		}
		
		return resultUrl.replace(/([^:]\/)\/+/g, "$1");
		
	} catch (e) {
		// SỬA LỖI TẠI ĐÂY: Nếu slug đã có http thì trả về chính nó, không cộng thêm BASEURL nữa
		console.log(e)
		if (slug && slug.indexOf("http") > -1) {
			return slug;
		}
		let fallback = BASEURL + (slug ? "/" + slug : "");
		return fallback.replace(/([^:]\/)\/+/g, "$1");
	}
}

function getUrlSearch(keyword, filtersJson) {
	return BASEURL + "/search?q=" + encodeURIComponent(keyword);
}

// https://motchille.cx/danh-sach/4
// https://motchille.cx/the-loai/kinh-di/4
// https://motchille.cx/search/?q=girl
//var BASEURL = "https://motchille.cx";
//var filtersJson = '{page:11,category:[{"slug":"/movies?sort=year_desc&limit=24&category=18-plus","name":"Thiếu niên"}]}'; 
//var filtersJson = '{page:22}';
//getUrlSearch("naruto", filtersJson)
//console.log(getUrlList("/the-loai/kinh-di", filtersJson));

function getUrlDetail(slug) {
    if (!slug) return "";
    if (slug.indexOf('http') === 0) return slug;
    return BASEURL + "/" + slug;
}

function getUrlCategories() {
    return BASEURL;
}

function getUrlCountries() {
    return "";
}

function getUrlYears() {
    return "";
}

// =============================================================================
// PARSERS
// =============================================================================
function parseListResponse(html, $url) {
	try {
		var items = [];
		_$(html).find(".block.relative").each(function() {
			var year = "";
			var lang = this.find(".absolute.top-0.left-1").text();
			var current = this.find(".absolute.bottom-1").text();
			var href = this.attr("href");
			if (href.indexOf("http") == -1) {
				href = BASEURL + href;
			}
			var quality = this.find(".absolute.top-0.right-1").text();
			var title = this.attr("title");
			var src = this.find("img").attr("src");
			if (src.indexOf("http") == -1) {
				src = BASEURL + src;
			}
			
			if (href && href.indexOf("http") > -1) {
				var cleanThumb = src.replace(/&amp;/g, '&');
				
				items.push({
					"id": href,
					"title": title.trim(),
					"posterUrl": cleanThumb,
					"backdropUrl": cleanThumb,
					"quality": quality,
					"lang": lang,
					"episode_current": current
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
		log(e);
		return JSON.stringify({
			"items": [{
				"id": $url,
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
// https://motchille.cx/danh-sach/4
// https://motchille.cx/the-loai/kinh-di/4
// https://motchille.cx/search/4?q=girl
//var BASEURL = "https://motchille.cx";

//var htmlsource = $("#labHtmlEditorWrap #labHtmlTreeContainer .lab-dom-pure-text").html();
//JSON.parse(parseListResponse(outerHTML, BASEURL));
//var html = outerHTML;


function parseSearchResponse(html) {
    return parseListResponse(html);
}

function parseMovieDetail(htmlContent, url) {
    try {
        // === BƯỚC 1: ĐỒNG NHẤT ID PHIM BẰNG REGEX META (Y hệt tác giả) ===
        var idMatch = /<link\s+rel="canonical"\s+href="([^"]+)"/i.exec(htmlContent) ||
            /<meta\s+property="og:url"\s+content="([^"]+)"/i.exec(htmlContent);
        var id = idMatch ? idMatch[1] : (url || "");

        var slug = "";
        if (id) {
            var slugMatch = /\/phim\/([^/_.]+)/.exec(id);
            slug = slugMatch ? slugMatch[1] : id;
        }
        if (!slug) {
            var slugMatch2 = /\/phim\/([^/_.]+)/.exec(htmlContent);
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

        var rmatch = htmlContent.match(/meta\s+property="og:url"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) lurl = rmatch[1];

        rmatch = htmlContent.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) limg = rmatch[1];

        rmatch = htmlContent.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) lname = rmatch[1];

        rmatch = htmlContent.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) ldes = rmatch[1];


        rmatch = htmlContent.match(/meta\s+property="video:duration"\s+content="([^"]+)"/i);
        if (rmatch && rmatch[1]) lduran = rmatch[1];

        status = _$(htmlContent).find("span:content('Trạng thái:')").next().text();
        year = _$(htmlContent).find("span:content('Năm:')").next().text();
        category = _$(htmlContent).find("span:content('Thể loại:')").parent().text(", ").replace('Thể loại:, ', '');
        episode_current = _$(htmlContent).find("span:content('Tập mới nhất:')").next().text();
        var servers = [];
        $parent = _$(htmlContent).find('.detail-infor-content');
        $child = $parent.find("li");
        $child.find("a").each(function() {
            var nameServer = this.text();
            var idserver = this.attr("href");
            var items = [];
            $parent.find(idserver).find("a").each(function() {
                var name = this.find("div").text();
                var item = {
                    id: this.attr("href"),
                    name: name,
                    slug: "tap-" + name.replace(/\s/, "-")
                }
                items.push(item)
            })
            servers.push({
                name: nameServer,
                episodes: items
            })
        });

        function getEpisodeNumber(name) {
            // Tìm số đầu tiên trong chuỗi (kể cả số trong chuỗi dạng "1-5" hoặc "163 TL")
            const match = name.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
        }

        // Duyệt qua từng server (Thuyết Minh, Vietsub...) để sort mảng episodes bên trong
        servers.forEach(server => {
            if (server.episodes && Array.isArray(server.episodes)) {
                server.episodes.sort((a, b) => {
                    return getEpisodeNumber(a.name) - getEpisodeNumber(b.name);
                });
            }
        });


        var extra = "";

        var isPlayPage = /\/tap-/.test(id)

        if (!isPlayPage) {
            // Đang ở trang chi tiết -> Lấy link nút "Xem phim" để gán vào extra
            var playBtnMatch = _$(htmlContent).find(".film-buttons").find("a").attr("href");
            if (playBtnMatch) {
                extra = playBtnMatch;
            }
        }
        // Tạo chuỗi mô tả ẩn JSON servers giống hệt tác giả
        // === BƯỚC 5: TRẢ VỀ KẾT QUẢ ĐỒNG NHẤT ID ===
        return JSON.stringify({
            id: id, // BẮT BUỘC: ID phải là slug rút gọn của bộ phim để cả 2 lần fetch khớp nhau
            title: lname,
            posterUrl: limg,
            backdropUrl: limg,
            description: ldes,
            quality: "HD",
            year: year,
            rating: 8.5,
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
        return JSON.stringify({
            id: slug || url || "error",
            title: "error",
            servers: []
        });
    }
}


//BASEURL = "https://phimnganhdc.com";
//var html = outerHTML;
//var $url = "https://phimnganhdc.com/hot-babe-remy-cheats-with-bbc/";
//JSON.parse(parseMovieDetail(outerHTML,$url));


function parseDetailResponse(html, url) {
	try {
		var allLink = [];
		_$(html).find('div[class*="list-severs"]').find("a").each(function() {
			var name = this.text();
			var link = this.attr("data-src");
			allLink.push({ link: link, name: name })
		});
		let selectedLink = null;
		const pool = { k4: null, hd: null, anyM3u8: null, anyEmbed: null };
		allLink.forEach((item) => {
			if (item.name.match(/4k/i) && item.link.endsWith('.m3u8')) {
				pool.k4 = item.link;
			} else if (item.name.match(/1080/i) && item.link.endsWith('.m3u8')) {
				pool.hd = item.link;
			} else if (item.link.endsWith('.m3u8')) {
				pool.anyM3u8 = item.link;
			} else if (item.link.includes('abyss')) {
				pool.anyEmbed = item.link;
			}
		});
		selectedLink =  pool.hd || pool.k4 ||pool.anyM3u8 || pool.anyEmbed;
		var streamlink = selectedLink.replace(/(https?:\/\/[^\/]+)\/[^]+?\/([^\/]+\.m3u8)$/, '$1/stream/m3u8/$2')
		return JSON.stringify({
			"url": streamlink,
			"isEmbed": false,
			"mimeType": "application/x-mpegURL",
			"headers": {
				"Referer": BASEURL,
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
			},
			"subtitles": []
		});
		
	} catch (e) {
		return JSON.stringify({ "url": "", "headers": {} });
	}
}
/*
var html = outerHTML;
var url = "https://bilutv.asia/phim/kinh-thanh-ky-tham/tap-tap-01-398150?tapplay=12&type=m3u8";
JSON.parse(parseEmbedResponse(html, url))
function textJS(typevideo, checkepi){
    return `
    typevideo = '${typevideo}';
    checkepi = '${checkepi}';
    `
}
*/

function sortEpisodesByName(data) {
    data.forEach(server => {
        if (server.episodes && Array.isArray(server.episodes)) {
            server.episodes.sort((a, b) => {
                // Sử dụng Regex để tìm số đứng ngay sau chữ "Tập" (Không phân biệt hoa thường)
                const matchA = a.name.match(/Tập\s*(\d+)/i);
                const matchB = b.name.match(/Tập\s*(\d+)/i);

                // Nếu tìm thấy số thì chuyển thành kiểu Int, nếu không thấy thì mặc định là 0
                const numA = matchA ? parseInt(matchA[1], 10) : 0;
                const numB = matchB ? parseInt(matchB[1], 10) : 0;

                // Sắp xếp tăng dần: Số nhỏ xếp trước (lên trên), số lớn xếp sau (xuống dưới)
                return numA - numB;
            });
        }
    });
    return data;
}

function parseCategoriesResponse(apiResponseJson) {
    var listurl = getLISTmenu();
    var menulist = buildMenu(listurl);
    return JSON.stringify(menulist);
}

function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
// https://k8s.onflixcdn.com/api/movies?sort=year_desc&limit=24&category=chien-tranh
function getLISTmenu() {
    return `
/danh-sach/phim-le@@Phim Lẻ
/danh-sach/phim-Bộ@@Phim Bộ
/the-loai/hanh-dong@@Hành Động
/the-loai/tinh-cam@@Tình Cảm
/the-loai/hai-huoc@@Hài Hước
/the-loai/co-trang@@Cổ Trang
/the-loai/tam-ly@@Tâm Lý
/the-loai/hinh-su@@Hình Sự
/the-loai/chien-tranh@@Chiến Tranh
/the-loai/the-thao@@Thể Thao
/the-loai/vo-thuat@@Võ Thuật
/the-loai/vien-tuong@@Viễn Tưởng
/the-loai/phieu-luu@@Phiêu Lưu
/the-loai/khoa-hoc@@Khoa Học
/the-loai/kinh-di@@Kinh Dị
/the-loai/am-nhac@@Âm Nhạc
/the-loai/than-thoai@@Thần Thoại
/the-loai/tai-lieu@@Tài Liệu
/the-loai/gia-dinh@@Gia Đình
/the-loai/chinh-kich@@Chính kịch
/the-loai/bi-an@@Bí ẩn
/the-loai/hoc-duong@@Học Đường
/the-loai/kinh-dien@@Kinh Điển
/the-loai/phim-18@@Phim 18+
/the-loai/hoat-hinh@@Anime & Hoạt Hình
/the-loai/tv-shows@@TV Shows
`
}

function buildMenu(listurl){let menulist=[];if (!listurl)return menulist;let lines=listurl.split('\n');for (let i=0;i < lines.length;i++){let line=lines[i].trim();if (!line||line.indexOf('@@')===-1)continue;let parts=line.split('@@');let link=parts[0]?parts[0].trim():"";let name=parts[1]?parts[1].trim():"";let check=parts[2]?parts[2].trim():undefined;if (!link||!name)continue;let item={};if (check==="false"){item={"slug":link,"title":name,"type":"Horizontal"};}else if (check==="true"){item={"slug":link,"title":name,"type":"Grid"};}else{item={"slug":link,"name":name};}menulist.push(item);}return menulist;}
function _$(htmlOrBlock){if (htmlOrBlock && typeof htmlOrBlock === 'object' && htmlOrBlock.elements) {return htmlOrBlock;} var instance = {sourceHtml: typeof htmlOrBlock === 'string' ? htmlOrBlock : '',elements: Array.isArray(htmlOrBlock) ? htmlOrBlock : (htmlOrBlock ? [htmlOrBlock] : []),find: function (selector) {if (selector.indexOf(',') !== -1) {var results = [];var selectors = selector.split(',').map(function (s) {return s.trim();});for (var s = 0;s < selectors.length;s++) {if (selectors[s] === "") continue;var subInstance = this.find(selectors[s]);for (var r = 0;r < subInstance.elements.length;r++) {var element = subInstance.elements[r];if (results.indexOf(element) === -1) {results.push(element);}}} var multiInstance = _$(results);multiInstance.sourceHtml = this.sourceHtml;return multiInstance;} var results = [];var contentFilter = "";if (selector.indexOf(":content(") !== -1) {var contentMatch = selector.match(/:content\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/);if (contentMatch) {contentFilter = contentMatch[1] || contentMatch[2] || contentMatch[3] || "";selector = selector.replace(/:content\((?:"[^"]*"|'[^']*'|[^)]*)\)/,"");}} var attrNameFilter = "";var attrValueFilter = "";var attrOperator = "=";var hasAttrFilter = false;var attrMatch = selector.match(/\[([a-zA-Z0-9_-]+)\s*([*^$]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]"']*))\]/);if (attrMatch) {hasAttrFilter = true;attrNameFilter = attrMatch[1];attrOperator = attrMatch[2];attrValueFilter = attrMatch[3] || attrMatch[4] || attrMatch[5] || "";selector = selector.replace(/\[.*?\]/,"");} var notSelector = "";if (selector.indexOf(":not(") !== -1) {var notMatch = selector.match(/:not\(([^)]+)\)/);if (notMatch) {notSelector = notMatch[1];selector = selector.replace(/:not\([^)]+\)/,"");}} var isFirstFilter = selector.indexOf(":first") !== -1;var isLastFilter = selector.indexOf(":last") !== -1;selector = selector.replace(/:first|:last/g,"");var targetTagName = "";var targetId = "";var targetClasses = [];var selectorToParse = selector.trim();if (selectorToParse !== "") {var idIndex = selectorToParse.indexOf('#');if (idIndex !== -1) {var afterId = selectorToParse.substring(idIndex + 1);var nextDot = afterId.indexOf('.');targetId = nextDot === -1 ? afterId : afterId.substring(0,nextDot);selectorToParse = selectorToParse.substring(0,idIndex) + (nextDot === -1 ? "" : "." + afterId.substring(nextDot + 1));} var classParts = selectorToParse.split('.');var possibleTag = classParts.shift();if (possibleTag) {targetTagName = possibleTag.toLowerCase();} targetClasses = classParts.filter(function (c) {return c.length > 0;});} for (var i = 0;i < this.elements.length;i++) {var currentHtml = this.elements[i];var pos = 0;var subResults = [];while ((pos = currentHtml.indexOf('<',pos)) !== -1) {if (currentHtml.charAt(pos + 1) === '/' || currentHtml.charAt(pos + 1) === '!') {pos++;continue;} var endOpenTag = -1;var insideQuote = false;var quoteChar = '';for (var j = pos + 1;j < currentHtml.length;j++) {var char = currentHtml.charAt(j);if ((char === '"' || char === "'") && currentHtml.charAt(j - 1) !== '\\') {if (!insideQuote) {insideQuote = true;quoteChar = char;} else if (char === quoteChar) {insideQuote = false;}} if (char === '>' && !insideQuote) {endOpenTag = j;break;}} if (endOpenTag === -1) break;var fullOpenTag = currentHtml.substring(pos,endOpenTag + 1);var tagMatch = fullOpenTag.match(/^<([a-zA-Z0-9_-]+)/);var currentTagName = tagMatch ? tagMatch[1].toLowerCase() : "";var isMatched = true;if (targetTagName && targetTagName !== currentTagName) {isMatched = false;} var getClassAttr = fullOpenTag.match(/class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);var classMatchStr = getClassAttr ? (getClassAttr[1] || getClassAttr[2] || getClassAttr[3] || "") : "";var getIdAttr = fullOpenTag.match(/id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);var idMatchStr = getIdAttr ? (getIdAttr[1] || getIdAttr[2] || getIdAttr[3] || "") : "";if (isMatched && targetId && idMatchStr !== targetId) {isMatched = false;} if (isMatched && targetClasses.length > 0) {if (classMatchStr) {var currentClasses = classMatchStr.trim().split(/\s+/);for (var c = 0;c < targetClasses.length;c++) {if (currentClasses.indexOf(targetClasses[c]) === -1) {isMatched = false;break;}}} else {isMatched = false;}} if (isMatched && hasAttrFilter) {var actualValue = "";if (attrNameFilter === "class") {actualValue = classMatchStr;} else if (attrNameFilter === "id") {actualValue = idMatchStr;} else {var getAnyAttr = fullOpenTag.match(new RegExp(attrNameFilter + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','i'));actualValue = getAnyAttr ? (getAnyAttr[1] || getAnyAttr[2] || getAnyAttr[3] || "") : "";} var attrExists = fullOpenTag.search(new RegExp(attrNameFilter + '\\s*=','i')) !== -1;if (!attrExists) {isMatched = false;} else {if (attrOperator === "=") {if (attrNameFilter === "class") {var classes = actualValue.trim().split(/\s+/);if (classes.indexOf(attrValueFilter) === -1) isMatched = false;} else if (actualValue !== attrValueFilter) {isMatched = false;}} else if (attrOperator === "*=") {if (actualValue.indexOf(attrValueFilter) === -1) isMatched = false;} else if (attrOperator === "^=") {if (actualValue.indexOf(attrValueFilter) !== 0) isMatched = false;} else if (attrOperator === "$=") {if (actualValue.slice(-attrValueFilter.length) !== attrValueFilter) isMatched = false;}}} if (isMatched) {var startTagPos = pos;var endTagPos = endOpenTag + 1;var selfClosingTags = ['img','source','input','br','hr','link','meta'];if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {var depth = 1;var scanPos = endOpenTag + 1;var openStr = '<' + currentTagName;var closeStr = '</' + currentTagName + '>';while (depth > 0 && scanPos < currentHtml.length) {var nextOpen = currentHtml.indexOf(openStr,scanPos);var nextClose = currentHtml.indexOf(closeStr,scanPos);if (nextClose === -1) {scanPos = currentHtml.length;break;} if (nextOpen !== -1 && nextOpen < nextClose) {depth++;scanPos = nextOpen + openStr.length;} else {depth--;scanPos = nextClose + closeStr.length;if (depth === 0) endTagPos = nextClose + closeStr.length;}}} var foundBlock = currentHtml.substring(startTagPos,endTagPos);if (contentFilter) {var pureText = foundBlock.replace(/<[^>]+>/g,"").trim();if (pureText.indexOf(contentFilter) === -1) {pos = endTagPos;continue;}} if (notSelector) {var isNotClass = notSelector.indexOf('.') === 0;var isNotId = notSelector.indexOf('#') === 0;var notValue = notSelector.substring(1);var hasNot = false;if (isNotClass && classMatchStr.indexOf(notValue) !== -1) hasNot = true;if (isNotId && idMatchStr.indexOf(notValue) !== -1) hasNot = true;if (!hasNot) subResults.push(foundBlock);} else {subResults.push(foundBlock);} pos = endTagPos;} else {pos++;}} if (isFirstFilter && subResults.length > 0) subResults = [subResults[0]];if (isLastFilter && subResults.length > 0) subResults = [subResults[subResults.length - 1]];results = results.concat(subResults);} var newInstance = _$(results);newInstance.sourceHtml = this.sourceHtml || currentHtml;return newInstance;},each: function (callback) {for (var i = 0;i < this.elements.length;i++) {var childInstance = _$(this.elements[i]);childInstance.sourceHtml = this.sourceHtml;callback.call(childInstance,i,this.elements[i]);} return this;},eq: function (index) {if (index < 0) index = this.elements.length + index;var matchedElement = this.elements[index];this.elements = matchedElement ? [matchedElement] : [];return this;},attr: function (attrName) {if (this.elements.length === 0) return "";var elem = this.elements[0];var getAttr = elem.match(new RegExp(attrName + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','i'));return getAttr ? (getAttr[1] || getAttr[2] || getAttr[3] || "") : "";},html: function () {if (this.elements.length === 0) return "";var elem = this.elements[0];var start = elem.indexOf('>') + 1;var end = elem.lastIndexOf('</');if (start > 0 && end > start) return elem.substring(start,end);return "";},text: function (separator) {if (this.elements.length === 0) return "";var elem = this.elements[0];var start = elem.indexOf('>') + 1;var end = elem.lastIndexOf('</');if (start > 0 && end > start) {var content = elem.substring(start,end);var pureText = content.replace(/<\/?[^>]+(>|$)/g,"");if (typeof separator === 'string') {return pureText .split('\n') .map(function (item) {return item.trim();}) .filter(function (item) {return item !== '';}) .join(separator);} return pureText.trim();} return "";},next: function () {var results = [];if (!this.sourceHtml) return this;for (var i = 0;i < this.elements.length;i++) {var elem = this.elements[i];var idx = this.sourceHtml.indexOf(elem);if (idx === -1) continue;var scanPos = idx + elem.length;var nextOpen = this.sourceHtml.indexOf('<',scanPos);if (nextOpen !== -1) {if (this.sourceHtml.charAt(nextOpen + 1) === '/') continue;var endOpenTag = this.sourceHtml.indexOf('>',nextOpen);if (endOpenTag === -1) continue;var fullOpenTag = this.sourceHtml.substring(nextOpen,endOpenTag + 1);var spacePos = fullOpenTag.indexOf(' ');var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1,fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1,spacePos).toLowerCase();var startTagPos = nextOpen;var endTagPos = endOpenTag + 1;var selfClosingTags = ['img','source','input','br','hr','link','meta'];if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {var depth = 1;var sPos = endOpenTag + 1;var openStr = '<' + currentTagName;var closeStr = '</' + currentTagName + '>';while (depth > 0 && sPos < this.sourceHtml.length) {var nOpen = this.sourceHtml.indexOf(openStr,sPos);var nClose = this.sourceHtml.indexOf(closeStr,sPos);if (nClose === -1) break;if (nOpen !== -1 && nOpen < nClose) {depth++;sPos = nOpen + openStr.length;} else {depth--;sPos = nClose + closeStr.length;if (depth === 0) endTagPos = nClose + closeStr.length;}}} results.push(this.sourceHtml.substring(startTagPos,endTagPos));}} var nextInstance = _$(results);nextInstance.sourceHtml = this.sourceHtml;this.elements = results;return this;},parent: function () {var results = [];if (!this.sourceHtml) return this;for (var i = 0;i < this.elements.length;i++) {var elem = this.elements[i];var idx = this.sourceHtml.indexOf(elem);if (idx <= 0) continue;var scanPos = idx - 1;while (scanPos >= 0) {var openTagPos = this.sourceHtml.lastIndexOf('<',scanPos);if (openTagPos === -1) break;if (this.sourceHtml.charAt(openTagPos + 1) !== '/' && this.sourceHtml.charAt(openTagPos + 1) !== '!') {var endOpenTag = this.sourceHtml.indexOf('>',openTagPos);if (endOpenTag !== -1 && endOpenTag > openTagPos) {var fullOpenTag = this.sourceHtml.substring(openTagPos,endOpenTag + 1);var spacePos = fullOpenTag.indexOf(' ');var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1,fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1,spacePos).toLowerCase();var endTagPos = endOpenTag + 1;var selfClosingTags = ['img','source','input','br','hr','link','meta'];if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) {var depth = 1;var sPos = endOpenTag + 1;var openStr = '<' + currentTagName;var closeStr = '</' + currentTagName + '>';while (depth > 0 && sPos < this.sourceHtml.length) {var nOpen = this.sourceHtml.indexOf(openStr,sPos);var nClose = this.sourceHtml.indexOf(closeStr,sPos);if (nClose === -1) break;if (nOpen !== -1 && nOpen < nClose) {depth++;sPos = nOpen + openStr.length;} else {depth--;sPos = nClose + closeStr.length;if (depth === 0) endTagPos = nClose + closeStr.length;}}} if (endTagPos >= idx + elem.length) {var parentBlock = this.sourceHtml.substring(openTagPos,endTagPos);if (results.indexOf(parentBlock) === -1) results.push(parentBlock);break;}}} scanPos = openTagPos - 1;}} var parentInstance = _$(results);parentInstance.sourceHtml = this.sourceHtml;this.elements = results;return this;},closest: function (selector) {var results = [];if (!this.sourceHtml || this.elements.length === 0) return _$([]);for (var i = 0;i < this.elements.length;i++) {var currentElem = this.elements[i];var currentObj = _$(currentElem);currentObj.sourceHtml = this.sourceHtml;var selfCheck = _$(this.sourceHtml).find(selector);var isSelfMatched = false;for (var s = 0;s < selfCheck.elements.length;s++) {if (selfCheck.elements[s] === currentElem) {isSelfMatched = true;break;}} if (isSelfMatched) {if (results.indexOf(currentElem) === -1) results.push(currentElem);continue;} var parentObj = currentObj.parent();while (parentObj.elements.length > 0) {var parentElem = parentObj.elements[0];var checkMatch = _$(this.sourceHtml).find(selector);var isMatched = false;for (var j = 0;j < checkMatch.elements.length;j++) {if (checkMatch.elements[j] === parentElem) {isMatched = true;break;}} if (isMatched) {if (results.indexOf(parentElem) === -1) results.push(parentElem);break;} parentObj = parentObj.parent();}} var closestInstance = _$(results);closestInstance.sourceHtml = this.sourceHtml;return closestInstance;}};return instance;}