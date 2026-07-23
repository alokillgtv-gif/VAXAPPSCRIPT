Bên dưới là 2 hàm gốc bạn hãy ghi nhớ nó.

function log(msg) {
    if (typeof nativeLog !== 'undefined') {
        nativeLog("["+BASEURL+"] " + msg);
    } else if (typeof console !== 'undefined' && console.log) {
        console.log("["+BASEURL+"] " + msg);
    }
}


function getUrlList(slug, filtersJson) {
		log("list url: " + slug)
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
            resultUrl += "/trang-" + page + ".html";
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
                return BASEURL + "/tim-kiem/trang-" + page + ".html?keyword=" + keyword;
            } else {
                return BASEURL + "/tim-kiem/?keyword=" + encodeURIComponent(keyword);
            }
        } catch (jsonErr) {
            return BASEURL + "/tim-kiem/?keyword=" + encodeURIComponent(keyword);
        }
    }
}

Dưới này là 2 hàm cần sửa, bạn hãy sửa nó dựa theo cấu trúc của 2 hàm gốc

function getUrlList(slug, filtersJson) {
	try {
		// 1. Kiểm tra nếu slug là link tuyệt đối (chứa http) và không có bộ lọc thì trả về luôn
		if (slug && slug.indexOf("http") > -1 || slug.indexOf("search") > -1) {
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
		if (page > 1) {
			resultUrl += "/" + page;
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
// /tags/adorable-anal/
// https://www.bemyhole.com/tags/
// https://www.bemyhole.com/search/blacked/
//var BASEURL = "https://www.bemyhole.com/";
// JSON lỗi cú pháp (thiếu nháy kép) của bạn
//var filtersJsonNoCat = '{page:11,category:[{"slug":"/hiep-dam/","name":"Thiếu niên"}]}'; 
//var filtersJsonNoCat = '{page:22}';
//console.log(getUrlList("https://www.bemyhole.com/search/blacked/", filtersJsonNoCat));

function getUrlSearch(keyword, filtersJson) {
    return BASEURL + "/search/" + encodeURIComponent(keyword);
}