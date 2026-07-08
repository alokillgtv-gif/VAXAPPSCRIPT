// =============================================================================
// VAAPP Plugin-Crophim Pro (Đồng bộ cấu trúc 100% theo chuẩn RophimFake)
// Tên file bắt buộc khi lưu:s crophim_plugin.js
// =============================================================================
BASEURL = "https://phimvietsub.pro";
function getManifest() {
    return JSON.stringify({
        "id": "motchill",          
        "name": "Phim Motchill",
        "description": "Nguồn xem phim Online ổn định",
        "version": "1.0",             
        "baseUrl": BASEURL,
        "iconUrl": "https://phimvietsub.pro/images/logo.png",
        "isEnabled": true,
        "type": "MOVIE",
        "playerType": "auto"
    });
}

function getHomeSections() {
    return JSON.stringify([
        { "slug": "/phim-song-ngu", "title": "Phim Bộ", "type": "Horizontal" },
        { "slug": "/loai-phim/phim-bo", "title": "Phim Bộ", "type": "Horizontal" },
        { "slug": "/quoc-gia/viet-nam", "title": "Phim VN", "type": "Horizontal" },
        { "slug": "/loai-phim/phim-le", "title": "Phim Lẻ", "type": "Grid" }
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
// URL GENERATION (Bóc tách slug sạch theo khuôn mẫu mới)
// =============================================================================

// https://phimvietsub.pro/loai-phim/phim-le
// https://phimvietsub.pro/the-loai/kinh-di
// https://phimvietsub.pro/tim-kiem?keyword=hitman
// https://phimvietsub.pro/phim-song-ngu
// https://phimvietsub.pro/phim-song-ngu?page=3
// https://phimvietsub.pro/the-loai/kinh-di?page=4

function getUrlList(slug, filtersJson) {
    if (slug && slug.indexOf("http") !== -1) {
        var fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        var filters = JSON.parse(fixedJson);
        page = parseInt(filters.page) || 1;
        // Nếu có JSON và có page, ta có thể chèn page vào link (tùy bạn cấu hình, ở đây trả về slug gốc để tránh lỗi)
        if(page > 1){
            return slug + "?page=" + page;
        }
        return slug;
    }
    var path = "";
    // Thay thế các key không có dấu nháy bằng key có dấu nháy để sửa lỗi JSON lỏng lẻo
    if (filtersJson) {
        var fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        var filters = JSON.parse(fixedJson);
        page = parseInt(filters.page) || 1;
        // Chỉ lấy category từ JSON nếu không truyền slug vào hàm
        // https://y2mate.ink/?s=&genres=bao-thu&regions=&years=&categories=phim-ngan
        if (filters.category) {
            if (Array.isArray(filters.category) && filters.category.length > 0) {
                path = filters.category[0].slug;
            } else if (typeof filters.category === 'string') {
                path = filters.category;
            }
            //console.log("sort");
            return BASEURL + "/" + path + "?page" + page;
            
        }
        if (page > 1 && slug.indexOf("http") == -1) {
            return BASEURL + "/" + slug + "/" + page;
        }
        if (page > 1 && slug.indexOf("http") > -1) {
            return slug + "/" + page;
        }
    }
}
/*

//var BASEURL = "https://phimvietsub.pro";
// Test trường hợp của bạn (slug = "kinh-di", có kèm filter JSON)
//var filtersJson = '{"page":5,"category":[{"slug":"am-nhac","name":"Âm Nhạc"}]}';
//console.log(getUrlList("kinh-di", filtersJson)); 
// Kết quả chuẩn: https://y2mate.ink/page/5?genres=kinh-di&categories=phim-le
// (genres "kinh-di" truyền ngoài vào đã ghi đè "am-nhac" trong JSON theo đúng logic ưu tiên slug)
// Test trường hợp không có filter JSON
//var filtersJson = '{"page":6}';
//console.log(getUrlList("https://y2mate.ink/?s=b%C3%A1o+th%C3%B9", filtersJson));
// Kết quả chuẩn: https://y2mate.ink?categories=phim-bo

*/
function getUrlSearch(keyword, filtersJson) {
    var filters = JSON.parse(filtersJson || "{}");
    var page = filters.page || 1;
    return BASEURL + "/tim-kiem?keyword=" + encodeURIComponent(keyword);
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
        var regexList = /<div\s+class=["']group\s+relative[\s\S]*?<a[^>]+aria-label="([^"]+)"[^>]+href="([^"]+)"[\s\S]*?<img[^>]*src="([^"]+)"/g;
        var matchList;
        
        while ((matchList = regexList.exec(html)) !== null) {
            if (matchList[3]) {
                var cleanThumb = matchList[3].replace(/&amp;/g, '&');
                items.push({
                    "id": matchList[3],
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
        return JSON.stringify({ "items": [], "pagination": { "currentPage": 1, "totalPages": 1 } });
    }
}
//var BASEURL = "https://phimvietsub.pro";
//var html = $("html")[0].outerHTML;
//JSON.parse(parseListResponse(html));
//var regexList = /<div\s+class=["']group\s+relative[\s\S]*?<a[^>]+aria-label="([^"]+)"[^>]+href="([^"]+)"[\s\S]*?<img[^>]*src="([^"]+)"/g;
//matchItem = regexList.exec(html);
//var BASEURL = "https://phimvietsub.pro";
//var html = $("html")[0].outerHTML;
//JSON.parse(parseListResponse(html));

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
    var rating = "????";
	  var servers = [{}];
  try {
    
    rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    
    rmatch = html.match(/video-info-aux[\s\S]*?(\d+)[\s\S]*?<\/div>/i);
    if (rmatch && rmatch[1]) { year = rmatch[1]; }
    
    rmatch = html.match(/video-info-actor[\s\S]*?title="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { direc = rmatch[1]; }
    
    rmatch = html.match(/Trạng thái[\s\S]*?video-info-item">([\s\S]*?)<\/div>/i);
    if (rmatch && rmatch[1]) { status = rmatch[1].trim(); }
    
    rmatch = html.match(/Thời lượng[\s\S]*?video-info-item">([\s\S]*?)<\/div>/i);
    if (rmatch && rmatch[1]) { duration = rmatch[1].trim(); }
    
    var split = duration.replace(/\s|\s+/gi,"").split("|");
	  var stime = split[0];
	  var firstEP = Number(split[1]);
	  var lastEP = Number(split[1]);
	  duration = "Độ Dài: " + stime + ", Tập: " + firstEP + "/" + lastEP;
    

// Bước 1: Tìm vùng HTML nằm trong class video-info-actor
  const containerRegex = /Diễn viên[\s\S]*?class="[^"]*video-info-actor[^"]*"[\s\S]*?<\/div>/;
  const containerMatch = html.match(containerRegex);

if (containerMatch) {
    const actorHtml = containerMatch[0]; // Chỉ lấy đoạn HTML bên trong div này
    
    // Bước 2: Tìm tất cả tên diễn viên trong đoạn HTML đã được giới hạn
    const actorRegex = />([^<]+)<\/a>/g;
    const matches = [...actorHtml.matchAll(actorRegex)];
    
    const actors = matches.map(match => match[1]);
    cast = actors.join("").replace(/\n/gi,",").replace(/,,/gi,", ")
    // Kết quả: [ 'Kiều Minh Tuấn', 'Mạc Văn Khoa', 'Mỹ Uyên', 'Ngọc Trinh', 'Trương Thế Vinh' ]
} 

	var rmatch = html.match(/video-info-footer display[\s\S]*?href="([\s\S]*?)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1] }
	
	if(lurl.indexOf("full") > -1){
		servers = [
            {
                name: "Server",
                episodes: [
                    { id: lurl, name: "Xem Ngay", slug: "full" }
                ]
            }
        ];
	}
	else{
	var surl = lurl.match(/([\s\S]*?\/tap-)(\d+)([\s\S]*)/);
    var furl = surl[1];
    var eurl = surl[3];
    var episodes = [];
    for(var j = 1;j < firstEP;j++){
      var itemEp = {};
      itemEp.id = furl + j + eurl;
      itemEp.name = "Tập " + j;
      itemEp.slug = "tap-" + j;
      episodes.push(itemEp);
    }
    servers = [
            {
                name: "Server",
                episodes: episodes
            }
    ];
	}       
	var streamUrl = "";
	var rmatch = html.match(/id="streaming-sv"[^>]*?data-link="(https?:[^"]*)"/i);
    if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
    return JSON.stringify({
        id: streamUrl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n\r\n" + streamUrl + "\r\n\r\n\r\n" + JSON.stringify(servers),
        servers: servers,
        quality: "HD",
        year: year,
        status: status,
        duration: duration,
        casts: cast,
        director: direc
    });
  }
  catch (e) {
        return JSON.stringify({
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes,
        servers: servers,
        quality: "HD",
        year: year,
        status: status,
        duration: duration,
        casts: cast,
        director: direc
      });
    }
}
//<link rel="preload" href="https://video3.cdnsolutions.media/key=kePlMtN+ADhubUR5+oDV3A,end=1782846000/data=2405:4802:918e:9690:213f:c9b0:ee12:58e-dvp/media=hls4/multi=256x144:144p:,426x240:240p:,854x480:480p:,1280x720:720p:,1920x1080:1080p:/029/485/972/_TPL_.av1.mp4.m3u8" as="fetch" crossorigin="true">
function parseDetailResponse(html) {
    try {
        var streamUrl = "";
        
        var rmatch = html.match(/id="streaming-sv"[^>]*?data-link="(https?:[^"]*)"/i);
   	    if (rmatch && rmatch[1]) { streamUrl = rmatch[1]; }
		
          return JSON.stringify({
              url: streamUrl,
              "headers": {
                "Referer": BASEURL,
                "Origin": BASEURL,
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                // Đánh lừa thuật toán Client Hints của tường lửa
                "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                "Sec-Ch-Ua-Mobile": "?1",
                "Sec-Ch-Ua-Platform": '"Android"',
                
                // Khai báo kiểu dữ liệu được chấp nhận giống như trình duyệt thật
                "Accept": "*/*",
                "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
                "X-Requested-With": "com.android.chrome"
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

function getLISTmenu() {
    return `
/the-loai/am-nhac@@Âm Nhạc
/the-loai/bi-an@@Bí ẩn
/the-loai/co-trang@@Cổ Trang
/the-loai/chien-tranh@@Chiến Tranh
/the-loai/chinh-kich@@Chính Kịch
/the-loai/gay-can@@Gây Cấn
/the-loai/gia-dinh@@Gia Đình
/the-loai/gia-tuong@@Giả Tưởng
/the-loai/hai-huoc@@Hài Hước
/the-loai/hanh-dong@@Hành Động
/the-loai/hinh-su@@Hình Sự
/the-loai/hoat-hinh@@Hoạt Hình
/the-loai/hoc-duong@@Học Đường
/the-loai/kinh-di@@Kinh Dị
/the-loai/khoa-hoc@@Khoa Học
/the-loai/khoa-hoc-vien-tuong@@Khoa Học Viễn Tưởng
/the-loai/lang-man@@Lãng Mạn
/the-loai/lich-su@@Lịch Sử
/the-loai/mien-tay@@Miền Tây
/the-loai/phieu-luu@@Phiêu Lưu
/the-loai/phim-hai@@Phim Hài
/the-loai/phim-ngan@@Phim Ngắn
/the-loai/phim-nhac@@Phim Nhạc
/the-loai/short-drama@@Short Drama
/the-loai/tai-lieu@@Tài Liệu
/the-loai/tam-ly@@Tâm Lý
/the-loai/tinh-cam@@Tình Cảm
/the-loai/than-thoai@@Thần Thoại
/the-loai/the-thao@@Thể Thao
/the-loai/tre-em@@Trẻ Em
/the-loai/vien-tuong@@Viễn Tưởng
/the-loai/vo-thuat@@Võ Thuật
`
}


// Hàm tách menu bằng list-ĐÃ TỐI ƯU: Không dùng Regex lặp để tránh treo app
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

function trimHTML(inhtml) {
    var result = inhtml.replace(/<[^>]*>/g, '');
    result = result.replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\n|\r/gi, '-')
        .replace(/\s+/gi, ' ')
        .replace(/^,+|,+$/g, "");
    return result;
}