var BASEURL = "https://www.thepornbang.com"; 
function getManifest() {
    return JSON.stringify({
        "id": "thepornbang",
        "name": "Thepornbang 4K XXX",
        "description": "XXX 4K",
        "version": "1.0.1",
        "BASEURL": "https://www.thepornbang.com",
        "iconUrl": "https://raw.githubusercontent.com/alokillgtv-gif/VAXAPPSCRIPT/main/img/cnporn.jpg",
        "isEnabled": true,
        "isAdult": true,
        "type": "MOVIE",
        "playerType": "exoplayer"
    });
}

function log(msg) {
    if (typeof nativeLog !== 'undefined') {
        nativeLog("[gamomephim] " + msg);
    } else if (typeof console !== 'undefined' && console.log) {
        console.log("[gamomephim] " + msg);
    }
}

function getHomeSections() {
    var listurl = "[{\"link\":\"/category/4k_c15/\",\"name\":\"4K\"}]";
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
		if (slug && slug.indexOf("http") > -1) {
			if (slug.indexOf("search") > -1) {
				if (filtersJson) {
					var fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":').replace(/:,/g, ':');
					try {
						var filters = JSON.parse(fixedJson);
						var page = parseInt(filters.page) || 1;
						if (page > 1) {
							return slug + page + "/";
						} else {
							return slug;
						}
					} catch (jsonErr) {
						return slug;
					}
				}
			}
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
			resultUrl += page + "/";
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
	return BASEURL + "/search/" + encodeURIComponent(keyword) + "/";
}

// https://www.thepornbang.com/videos_30/4/
// https://www.thepornbang.com/search/blacked/
// /category/big-tits_c18/
//var html = sourceHTML;
//BASEURL = window.location.host;
//var filtersJson = '{page:22}';
//getUrlSearch("naruto", filtersJson)
//console.log(getUrlList("/search/blacked/", filtersJson));

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
function parseListResponse(html, $url) {
	try {
		var items = [];
		_$(html).find("#list_videos_latest_videos_list_items").find(".item").each(function() {
			var year = "";
			var lang = "";
			var current = this.find("meta[itemprop='duration']").attr("content")
			var href = this.attr("href");
			if (href.indexOf("http") == -1) {
				href = BASEURL + href;
			}
			if (!href.match(/video/) && href.indexOf(BASEURL) < 0) {
				href = "";
			}
			var quality = this.find('span.hd-icon').text();
			var title = this.attr("title");
			var src = this.find('img[itemprop="thumbnail"]').attr("src");
			if (src.indexOf("http") == -1) {
				src = BASEURL + src;
			}
			if (src.indexOf("data:image") > -1) {
				src = this.find('img[itemprop="thumbnail"]').attr("data-original");
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
//$url = window.location.href;
//BASEURL = window.location.host;
//var html = sourceHTML;
//JSON.parse(parseListResponse(html, $url))

function parseSearchResponse(html, url) {
    return parseListResponse(html, url);
}

function parseScript(rawScript) {
	const result = {
		success: false,
		data: {},
		embedHtml: ''
	};
	
	// Kiểm tra đầu vào cơ bản
	if (!rawScript || typeof rawScript !== 'string') {
		return result;
	}
	
	try {
		// 1. Trích xuất hàm getEmbed nếu bạn cần dùng code iframe của họ
		const embedMatch = rawScript.match(/return\s+('(?:[^'\\]|\\.)*')/);
		if (embedMatch) {
			// Loại bỏ dấu nháy ở đầu/cuối chuỗi iframe được tìm thấy
			result.embedHtml = embedMatch[1].slice(1, -1);
		}
		
		// 2. Tìm phần nội dung bên trong dấu ngoặc nhọn của biến object (var xxxx = { ... })
		const objectContentMatch = rawScript.match(/var\s+\w+\s*=\s*\{([\s\S]*?)\};/);
		
		if (objectContentMatch) {
			const objectBody = objectContentMatch[1];
			
			// 3. Regex quét các cặp key: 'value' hoặc key: value (phòng khi họ bỏ dấu nháy cho số)
			// Group 1: Key, Group 2: Value dạng chuỗi có nháy, Group 3: Value không nháy (số/boolean)
			const pairRegex = /(\w+)\s*:\s*(?:'((?:[^'\\]|\\.)*)'|([^,\s}]+))/g;
			let match;
			
			while ((match = pairRegex.exec(objectBody)) !== null) {
				const key = match[1];
				let value = match[2] !== undefined ? match[2] : match[3];
				
				// Nếu là chuỗi, xử lý các ký tự bị escape (ví dụ \' đổi lại thành ')
				if (match[2] !== undefined) {
					value = value.replace(/\\'/g, "'").replace(/\\"/g, '"');
				} else {
					// Nếu là số hoặc boolean thuần (không nằm trong nháy) thì ép kiểu tương ứng
					if (value === 'true') value = true;
					else if (value === 'false') value = false;
					else if (!isNaN(value)) value = Number(value);
				}
				
				result.data[key] = value;
			}
			
			// Đánh dấu thành công nếu lấy được dữ liệu
			if (Object.keys(result.data).length > 0) {
				result.success = true;
			}
		}
	} catch (error) {
		// Ghi nhận lỗi nội bộ ra console để debug nhưng KHÔNG làm sập script của bạn
		console.error("SafeParser Error:", error);
	}
	
	return result;
}

function parseMovieDetail(html, url) {
	cachedMovieDetailId = "";
	try {
		log(url);
		var id = "";
		var lname = "Đang cập nhật...";
		var limg = "";
		var ldes = "Không có mô tả.";
		var category = "";
		var episode_current = "";
		var quality = "";
		var year = 2026;
		var rating = 0;
		var servers = [];
		var extra = "";
		var lactor = "";
		var ldirec = "";
		var lduran = "";
		var status = "";
		var script = _$(html).find("script:content('generate_mp4')").html();
		var $dataVD = parseScript(script);
		if ($dataVD.success == false) {
			return JSON.stringify({
				id: cachedMovieDetailId || url || "error",
				title: "Đây là video riêng tư",
				description: "Video riêng tư nên bi cấm xem đó bạn ơi. Kiếm video khác nhé.",
				posterUrl: "",
				backdropUrl: "",
				servers: []
			});
		}
		var idMatch = /<link\s+rel="canonical"\s+href="([^"]+)"/i.exec(html) ||
			/<meta\s+property="og:url"\s+content="([^"]+)"/i.exec(html);
		id = idMatch ? idMatch[1] : (url || "");
		
		// Lưu ID vào bộ nhớ tạm toàn cục để Lượt 2 lấy ra đối chiếu
		cachedMovieDetailId = id;
		lname = $dataVD.data.video_title;
		limg = $dataVD.data.preview_url;
		ldes = $dataVD.data.video_tags;
		category = $dataVD.data.video_categories;
		lactor = $dataVD.data.video_models;
		var episodes = [];
		var servers = [];
		if ($dataVD.data.video_alt_url3) {
			var link = $dataVD.data.video_alt_url3;
			episodes.push({
				id: link.replace(/[\s\S]*?http/i, "http") + "#.m3u8",
				name: "HQ: " + $dataVD.data.video_alt_url3_text,
				slug: "hd3"
			})
		}
		if ($dataVD.data.video_alt_url2) {
			var link = $dataVD.data.video_alt_url2;
			episodes.push({
				id: link.replace(/[\s\S]*?http/i, "http") + "#.m3u8",
				name: "HQ: " + $dataVD.data.video_alt_url2_text,
				slug: "hd2"
			})
		}
		if ($dataVD.data.video_alt_url) {
			var link = $dataVD.data.video_alt_url;
			episodes.push({
				id: link.replace(/[\s\S]*?http/i, "http") + "#.m3u8",
				name: "HQ: " + $dataVD.data.video_alt_url_text,
				slug: "hd3"
			})
		}
		if ($dataVD.data.video_url) {
			var link = $dataVD.data.video_url;
			episodes.push({
				id: link.replace(/[\s\S]*?http/i, "http") + "#.m3u8",
				name: "HQ: " + $dataVD.data.video_url_text,
				slug: "hd4"
			})
		}
		servers.push({
			name: "Server",
			episodes: episodes
		})
		log(JSON.stringify(servers))
		return JSON.stringify({
			id: id,
			title: lname,
			posterUrl: limg,
			backdropUrl: limg,
			description: ldes,
			quality: quality,
			year: year,
			rating: rating,
			status: status,
			category: category,
			episode_current: episode_current,
			servers: servers,
			duration: lduran || "",
			casts: lactor || "",
			director: ldirec || "",
			extra: extra
		});
		
	} catch (e) {
		log(e);
		return JSON.stringify({
			id: cachedMovieDetailId || url || "error",
			title: "error",
			servers: []
		});
	}
}
//$url = window.location.href;
//BASEURL = window.location.host;
//var html = sourceHTML;
//JSON.parse(parseMovieDetail(html, $url))

function parseDetailResponse(html, url) {
    try {
        return JSON.stringify({
            "url": "",
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

function sortEpisodesByName(data) {
    data.forEach(function(server) {
        if (server.episodes && Array.isArray(server.episodes)) {
            server.episodes.sort(function(a, b) {
                var matchA = a.name.match(/Tập\s*(\d+)/i);
                var matchB = b.name.match(/Tập\s*(\d+)/i);
                var numA = matchA ? parseInt(matchA[1], 10) : 0;
                var numB = matchB ? parseInt(matchB[1], 10) : 0;
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

// /vi/latest-updates/
// {\"link\":\"/videos_30/\",\"name\":\"4K\"}

function getLISTmenu() {
    return `[{\"link\":\"/category/4k_c15/\",\"name\":\"4K\"},{\"link\":\"/videos_30/\",\"name\":\"Video Mới\"},{\"link\":\"/category/big-tits_c18/\",\"name\":\"Big Tits\"},{\"link\":\"/category/blonde_c9/\",\"name\":\"Blonde\"},{\"link\":\"/category/milf_c17/\",\"name\":\"MILF\"},{\"link\":\"/category/cheating-caught_c19/\",\"name\":\"Cheating Caught\"},{\"link\":\"/category/anal_c14/\",\"name\":\"Anal\"},{\"link\":\"/category/feet_c3/\",\"name\":\"Feet\"},{\"link\":\"/category/latina_c5/\",\"name\":\"Latina\"},{\"link\":\"/category/threesome_c8/\",\"name\":\"Threesome\"},{\"link\":\"/category/big-ass_c16/\",\"name\":\"Big Ass\"},{\"link\":\"/category/squirt_c6/\",\"name\":\"Squirt\"},{\"link\":\"/category/lesbian_c5/\",\"name\":\"Lesbian\"},{\"link\":\"/category/sneaky_c14/\",\"name\":\"Sneaky\"},{\"link\":\"/category/red-head_c6/\",\"name\":\"Red Head\"},{\"link\":\"/category/creampie_c8/\",\"name\":\"Creampie\"},{\"link\":\"/category/shower_c7/\",\"name\":\"Shower\"},{\"link\":\"/category/teen18_c4/\",\"name\":\"Teen18+\"},{\"link\":\"/category/stepmom_c19/\",\"name\":\"Stepmom\"},{\"link\":\"/category/big-dick-worship_c3/\",\"name\":\"Big Dick Worship\"},{\"link\":\"/category/black_c4/\",\"name\":\"Black\"},{\"link\":\"/category/rough-sex_c7/\",\"name\":\"Rough Sex\"},{\"link\":\"/category/massage_c5/\",\"name\":\"Massage\"},{\"link\":\"/category/interracial_c2/\",\"name\":\"Interracial\"},{\"link\":\"/category/asian_c9/\",\"name\":\"Asian\"},{\"link\":\"/category/parody_c4/\",\"name\":\"Parody\"},{\"link\":\"/category/double-penetration_c4/\",\"name\":\"Double Penetration\"},{\"link\":\"/category/yoga_c7/\",\"name\":\"Yoga\"},{\"link\":\"/category/stepdaughter_c18/\",\"name\":\"Stepdaughter\"},{\"link\":\"/category/gangbang_c15/\",\"name\":\"Gangbang\"},{\"link\":\"/category/glory-hole_c7/\",\"name\":\"Glory Hole\"},{\"link\":\"/categories_16/\",\"name\":\"All Categories\"}]`;
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
        } else { 
            menuItem = { "slug": link, "name": name }; 
        } 
        menulist.push(menuItem); 
    } 
    return menulist; 
}

function _$(htmlOrBlock){ 
	if (htmlOrBlock && typeof htmlOrBlock === 'object' && htmlOrBlock.elements) { return htmlOrBlock; } var instance = { sourceHtml: typeof htmlOrBlock === 'string' ? htmlOrBlock : '', elements: Array.isArray(htmlOrBlock) ? htmlOrBlock : (htmlOrBlock ? [htmlOrBlock] : []), length: 0, find: function (selector) { if (selector.indexOf(',') !== -1) { var results = []; var selectors = selector.split(',').map(function (s) { return s.trim(); }); for (var s = 0; s < selectors.length; s++) { if (selectors[s] === "") continue; var subInstance = this.find(selectors[s]); for (var r = 0; r < subInstance.elements.length; r++) { var element = subInstance.elements[r]; if (results.indexOf(element) === -1) { results.push(element); } } } var multiInstance = _$(results); multiInstance.sourceHtml = this.sourceHtml; return multiInstance; } var results = []; var contentFilter = ""; if (selector.indexOf(":content(") !== -1) { var contentMatch = selector.match(/:content\((?:"([^"]*)"|'([^']*)'|([^)]*))\)/); if (contentMatch) { contentFilter = contentMatch[1] || contentMatch[2] || contentMatch[3] || ""; selector = selector.replace(/:content\((?:"[^"]*"|'[^']*'|[^)]*)\)/, ""); } } var attrNameFilter = ""; var attrValueFilter = ""; var attrOperator = "="; var hasAttrFilter = false; var attrMatch = selector.match(/\[([a-zA-Z0-9_-]+)\s*([*^$]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]"']*))\]/); if (attrMatch) { hasAttrFilter = true; attrNameFilter = attrMatch[1]; attrOperator = attrMatch[2]; attrValueFilter = attrMatch[3] || attrMatch[4] || attrMatch[5] || ""; selector = selector.replace(/\[.*?\]/, ""); } var notSelector = ""; if (selector.indexOf(":not(") !== -1) { var notMatch = selector.match(/:not\(([^)]+)\)/); if (notMatch) { notSelector = notMatch[1]; selector = selector.replace(/:not\([^)]+\)/, ""); } } var isFirstFilter = selector.indexOf(":first") !== -1; var isLastFilter = selector.indexOf(":last") !== -1; selector = selector.replace(/:first|:last/g, ""); var targetTagName = ""; var targetId = ""; var targetClasses = []; var selectorToParse = selector.trim(); if (selectorToParse !== "") { var idIndex = selectorToParse.indexOf('#'); if (idIndex !== -1) { var afterId = selectorToParse.substring(idIndex + 1); var nextDot = afterId.indexOf('.'); targetId = nextDot === -1 ? afterId : afterId.substring(0, nextDot); selectorToParse = selectorToParse.substring(0, idIndex) + (nextDot === -1 ? "" : "." + afterId.substring(nextDot + 1)); } var classParts = selectorToParse.split('.'); var possibleTag = classParts.shift(); if (possibleTag) { targetTagName = possibleTag.toLowerCase(); } targetClasses = classParts.filter(function (c) { return c.length > 0; }); } for (var i = 0; i < this.elements.length; i++) { var currentHtml = this.elements[i]; var pos = 0; var subResults = []; while ((pos = currentHtml.indexOf('<', pos)) !== -1) { if (currentHtml.charAt(pos + 1) === '/' || currentHtml.charAt(pos + 1) === '!') { pos++; continue; } var endOpenTag = -1; var insideQuote = false; var quoteChar = ''; for (var j = pos + 1; j < currentHtml.length; j++) { var char = currentHtml.charAt(j); if ((char === '"' || char === "'") && currentHtml.charAt(j - 1) !== '\\') { if (!insideQuote) { insideQuote = true; quoteChar = char; } else if (char === quoteChar) { insideQuote = false; } } if (char === '>' && !insideQuote) { endOpenTag = j; break; } } if (endOpenTag === -1) break; var fullOpenTag = currentHtml.substring(pos, endOpenTag + 1); var tagMatch = fullOpenTag.match(/^<([a-zA-Z0-9_-]+)/); var currentTagName = tagMatch ? tagMatch[1].toLowerCase() : ""; var isMatched = true; if (targetTagName && targetTagName !== currentTagName) { isMatched = false; } var getClassAttr = fullOpenTag.match(/class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i); var classMatchStr = getClassAttr ? (getClassAttr[1] || getClassAttr[2] || getClassAttr[3] || "") : ""; var getIdAttr = fullOpenTag.match(/id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i); var idMatchStr = getIdAttr ? (getIdAttr[1] || getIdAttr[2] || getIdAttr[3] || "") : ""; if (isMatched && targetId && idMatchStr !== targetId) { isMatched = false; } if (isMatched && targetClasses.length > 0) { if (classMatchStr) { var currentClasses = classMatchStr.trim().split(/\s+/); for (var c = 0; c < targetClasses.length; c++) { if (currentClasses.indexOf(targetClasses[c]) === -1) { isMatched = false; break; } } } else { isMatched = false; } } if (isMatched && hasAttrFilter) { var actualValue = ""; if (attrNameFilter === "class") { actualValue = classMatchStr; } else if (attrNameFilter === "id") { actualValue = idMatchStr; } else { var getAnyAttr = fullOpenTag.match(new RegExp(attrNameFilter + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i')); actualValue = getAnyAttr ? (getAnyAttr[1] || getAnyAttr[2] || getAnyAttr[3] || "") : ""; } var attrExists = fullOpenTag.search(new RegExp(attrNameFilter + '\\s*=', 'i')) !== -1; if (!attrExists) { isMatched = false; } else { if (attrOperator === "=") { if (attrNameFilter === "class") { var classes = actualValue.trim().split(/\s+/); if (classes.indexOf(attrValueFilter) === -1) isMatched = false; } else if (actualValue !== attrValueFilter) { isMatched = false; } } else if (attrOperator === "*=") { if (actualValue.indexOf(attrValueFilter) === -1) isMatched = false; } else if (attrOperator === "^=") { if (actualValue.indexOf(attrValueFilter) !== 0) isMatched = false; } else if (attrOperator === "$=") { if (actualValue.slice(-attrValueFilter.length) !== attrValueFilter) isMatched = false; } } } if (isMatched) { var startTagPos = pos; var endTagPos = endOpenTag + 1; var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta']; if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) { var depth = 1; var scanPos = endOpenTag + 1; var openStr = '<' + currentTagName; var closeStr = '</' + currentTagName + '>'; while (depth > 0 && scanPos < currentHtml.length) { var nextOpen = currentHtml.indexOf(openStr, scanPos); var nextClose = currentHtml.indexOf(closeStr, scanPos); if (nextClose === -1) { scanPos = currentHtml.length; break; } if (nextOpen !== -1 && nextOpen < nextClose) { depth++; scanPos = nextOpen + openStr.length; } else { depth--; scanPos = nextClose + closeStr.length; if (depth === 0) endTagPos = nClose = nextClose + closeStr.length; } } } var foundBlock = currentHtml.substring(startTagPos, endTagPos); if (contentFilter) { var pureText = foundBlock.replace(/<[^>]+>/g, "").trim(); var keywords = contentFilter.split('|'); var isContentMatched = false; for (var k = 0; k < keywords.length; k++) { if (pureText.indexOf(keywords[k].trim()) !== -1) { isContentMatched = true; break; } } if (!isContentMatched) { pos = endTagPos; continue; } } if (notSelector) { var isNotClass = notSelector.indexOf('.') === 0; var isNotId = notSelector.indexOf('#') === 0; var notValue = notSelector.substring(1); var hasNot = false; if (isNotClass && classMatchStr.indexOf(notValue) !== -1) hasNot = true; if (isNotId && idMatchStr.indexOf(notValue) !== -1) hasNot = true; if (!hasNot) subResults.push(foundBlock); } else { subResults.push(foundBlock); } pos = endTagPos; } else { pos++; } } if (isFirstFilter && subResults.length > 0) subResults = [subResults[0]]; if (isLastFilter && subResults.length > 0) subResults = [subResults[subResults.length - 1]]; results = results.concat(subResults); } var newInstance = _$(results); newInstance.sourceHtml = this.sourceHtml || currentHtml; return newInstance; }, each: function (callback) { for (var i = 0; i < this.elements.length; i++) { var childInstance = _$(this.elements[i]); childInstance.sourceHtml = this.sourceHtml; callback.call(childInstance, i, this.elements[i]); } return this; }, eq: function (index) { if (index < 0) index = this.elements.length + index; var matchedElement = this.elements[index]; this.elements = matchedElement ? [matchedElement] : []; this.length = this.elements.length; return this; }, attr: function (attrName) { if (this.elements.length === 0) return ""; var elem = this.elements[0]; var getAttr = elem.match(new RegExp(attrName + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i')); return getAttr ? (getAttr[1] || getAttr[2] || getAttr[3] || "") : ""; }, html: function () { if (this.elements.length === 0) return ""; var elem = this.elements[0]; var start = elem.indexOf('>') + 1; var end = elem.lastIndexOf('</'); if (start > 0 && end > start) return elem.substring(start, end); return ""; }, text: function (separator) { if (this.elements.length === 0) return ""; var elem = this.elements[0]; var start = elem.indexOf('>') + 1; var end = elem.lastIndexOf('</'); if (start > 0 && end > start) { var content = elem.substring(start, end); var pureText = content.replace(/<\/?[^>]+(>|$)/g, "\n"); if (typeof separator === 'string') { return pureText .split('\n') .map(function (item) { return item.trim(); }) .filter(function (item) { return item !== ''; }) .join(separator); } return pureText .split('\n') .map(function (item) { return item.trim(); }) .filter(function (item) { return item !== ''; }) .join(' '); } return ""; }, textAll: function (separator) { if (this.elements.length === 0) return ""; var sep = typeof separator === 'string' ? separator : " "; var allTexts = []; for (var i = 0; i < this.elements.length; i++) { var elem = this.elements[i]; var start = elem.indexOf('>') + 1; var end = elem.lastIndexOf('</'); if (start > 0 && end > start) { var content = elem.substring(start, end); var pureText = content.replace(/<\/?[^>]+(>|$)/g, "\n"); var cleanText = pureText .split('\n') .map(function (item) { return item.trim(); }) .filter(function (item) { return item !== ''; }) .join(' '); if (cleanText !== '') { allTexts.push(cleanText); } } } return allTexts.join(sep); }, next: function () { var results = []; if (!this.sourceHtml) return this; for (var i = 0; i < this.elements.length; i++) { var elem = this.elements[i]; var idx = this.sourceHtml.indexOf(elem); if (idx === -1) continue; var scanPos = idx + elem.length; var nextOpen = this.sourceHtml.indexOf('<', scanPos); if (nextOpen !== -1) { if (this.sourceHtml.charAt(nextOpen + 1) === '/') continue; var endOpenTag = this.sourceHtml.indexOf('>', nextOpen); if (endOpenTag === -1) continue; var fullOpenTag = this.sourceHtml.substring(nextOpen, endOpenTag + 1); var spacePos = fullOpenTag.indexOf(' '); var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1, spacePos).toLowerCase(); var startTagPos = nextOpen; var endTagPos = endOpenTag + 1; var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta']; if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) { var depth = 1; var sPos = endOpenTag + 1; var openStr = '<' + currentTagName; var closeStr = '</' + currentTagName + '>'; while (depth > 0 && sPos < this.sourceHtml.length) { var nOpen = this.sourceHtml.indexOf(openStr, sPos); var nClose = this.sourceHtml.indexOf(closeStr, sPos); if (nClose === -1) break; if (nOpen !== -1 && nOpen < nClose) { depth++; sPos = nOpen + openStr.length; } else { depth--; sPos = nClose + closeStr.length; if (depth === 0) endTagPos = nClose + closeStr.length; } } } results.push(this.sourceHtml.substring(startTagPos, endTagPos)); } } var nextInstance = _$(results); nextInstance.sourceHtml = this.sourceHtml; this.elements = results; this.length = results.length; return this; }, parent: function () { var results = []; if (!this.sourceHtml) return this; for (var i = 0; i < this.elements.length; i++) { var elem = this.elements[i]; var idx = this.sourceHtml.indexOf(elem); if (idx <= 0) continue; var scanPos = idx - 1; while (scanPos >= 0) { var openTagPos = this.sourceHtml.lastIndexOf('<', scanPos); if (openTagPos === -1) break; if (this.sourceHtml.charAt(openTagPos + 1) !== '/' && this.sourceHtml.charAt(openTagPos + 1) !== '!') { var endOpenTag = this.sourceHtml.indexOf('>', openTagPos); if (endOpenTag !== -1 && endOpenTag > openTagPos) { var fullOpenTag = this.sourceHtml.substring(openTagPos, endOpenTag + 1); var spacePos = fullOpenTag.indexOf(' '); var currentTagName = (spacePos === -1) ? fullOpenTag.substring(1, fullOpenTag.length - 1).toLowerCase() : fullOpenTag.substring(1, spacePos).toLowerCase(); var endTagPos = endOpenTag + 1; var selfClosingTags = ['img', 'source', 'input', 'br', 'hr', 'link', 'meta']; if (selfClosingTags.indexOf(currentTagName) === -1 && fullOpenTag.indexOf('/>') === -1) { var depth = 1; var sPos = endOpenTag + 1; var openStr = '<' + currentTagName; var closeStr = '</' + currentTagName + '>'; while (depth > 0 && sPos < this.sourceHtml.length) { var nOpen = this.sourceHtml.indexOf(openStr, sPos); var nClose = this.sourceHtml.indexOf(closeStr, sPos); if (nClose === -1) break; if (nOpen !== -1 && nOpen < nClose) { depth++; sPos = nOpen + openStr.length; } else { depth--; sPos = nClose + closeStr.length; if (depth === 0) endTagPos = nClose + closeStr.length; } } } if (endTagPos >= idx + elem.length) { var parentBlock = this.sourceHtml.substring(openTagPos, endTagPos); if (results.indexOf(parentBlock) === -1) results.push(parentBlock); break; } } } scanPos = openTagPos - 1; } } var parentInstance = _$(results); parentInstance.sourceHtml = this.sourceHtml; this.elements = results; this.length = results.length; return this; }, closest: function (selector) { var results = []; if (!this.sourceHtml || this.elements.length === 0) return _$([]); for (var i = 0; i < this.elements.length; i++) { var currentElem = this.elements[i]; var currentObj = _$(currentElem); currentObj.sourceHtml = this.sourceHtml; var selfCheck = _$(this.sourceHtml).find(selector); var isSelfMatched = false; for (var s = 0; s < selfCheck.elements.length; s++) { if (selfCheck.elements[s] === currentElem) { isSelfMatched = true; break; } } if (isSelfMatched) { if (results.indexOf(currentElem) === -1) results.push(currentElem); continue; } var parentObj = currentObj.parent(); while (parentObj.elements.length > 0) { var parentElem = parentObj.elements[0]; var checkMatch = _$(this.sourceHtml).find(selector); var isMatched = false; for (var j = 0; j < checkMatch.elements.length; j++) { if (checkMatch.elements[j] === parentElem) { isMatched = true; break; } } if (isMatched) { if (results.indexOf(parentElem) === -1) results.push(parentElem); break; } parentObj = parentObj.parent(); } } var closestInstance = _$(results); closestInstance.sourceHtml = this.sourceHtml; return closestInstance; } }; instance.length = instance.elements.length; return instance; 
	};
