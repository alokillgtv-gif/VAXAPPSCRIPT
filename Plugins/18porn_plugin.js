BaseURL18 = "https://www.18porn.sex";

function getManifest() {
 return JSON.stringify({
  "id": "newporn", 
  "name": "18 Porn", 
  "version": "1.5", 
  "baseUrl": BaseURL18, 
  "iconUrl": BaseURL18 + "/images/logo.png", 
  "isEnabled": true, 
  "type": "MOVIE", 
  "playerType": "auto"
 });
}

function getHomeSections() {
 return JSON.stringify([
  { slug: 'new', title: 'Hàng Mới', type: 'Grid' }
 ]);
}

function getPrimaryCategories() {
 return JSON.stringify([
  { name: 'Vú Bự', slug: 'categories/big-tits' },
  { name: 'Xinh Đẹp', slug: 'categories/beuatiful' },
  { name: 'Châu Á', slug: 'categories/asian' },
  { name: 'Chơi 3', slug: 'categories/threesome' },
  { name: 'Lỗ Nhị', slug: 'categories/anal' }
 ]);
}

function getFilters() {
 return JSON.stringify({
  "sort": [
   { "name": "Mới nhất", "value": "newest" }
  ]
 });
}

function getUrlList(slug, filtersJson) {
    try {
     var filters = JSON.parse(filtersJson || "{}");
     var page = filters.page || 1;
     
     if (page > 1) {
      return BaseURL18 + "/" + slug + "/" + page;
     }
     return BaseURL18 + "/" + slug;
    } catch (e) {
     return BaseURL18 + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BaseURL18 + "/search/MOM/" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    return BaseURL18 + "/" + slug;
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
        var regexList = new RegExp('<div class="module-item-pic"><a\\s+href="([^"]+)"\\s+title="([^"]+)"[\\s\\S]*?<img[^>]*data-src="([^"]+)"', 'g');
        var matchList;
        
        while ((matchList = regexList.exec(html)) !== null) {
          if(matchList[3]){
            var cleanThumb = matchList[3].replace(/&amp;/g, '&'); 
            items.push({
                "id": matchList[1],          
                "title": matchList[2].trim(), 
                "posterUrl": cleanThumb,  
                "backdropUrl": cleanThumb
            });
          }
        }
        
        var totalPages = 1; 
        var currentPage = 1; 

        if (html && html.indexOf('id="page"') > -1) {
            var pageSectionBox = html.match(new RegExp('<div id="page">([\\s\\S]*?)<\/div>', 'i'));
            if (pageSectionBox && pageSectionBox[1]) {
                var pageHtml = pageSectionBox[1];
                var currentMatch = pageHtml.match(new RegExp('class="[^"]*page-current[^"]*">(\\d+)<', 'i'));
                if (currentMatch) {
                    currentPage = parseInt(currentMatch[1], 10);
                }

                var pageNumbers = [];
                var pageRegex = new RegExp('>(\\d+)<\\/a>', 'g');
                var pageMatch;
                
                while ((pageMatch = pageRegex.exec(pageHtml)) !== null) {
                    pageNumbers.push(parseInt(pageMatch[1], 10));
                }

                if (pageNumbers.length > 0) {
                    totalPages = Math.max.apply(Math, pageNumbers);
                }
                if (totalPages < currentPage) {
                    totalPages = currentPage;
                }
            }
        }
        
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
                name: "Server 1",
                episodes: [
                    { id: lurl, name: "Xem Ngay", slug: "" }
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
                name: "Server 1",
                episodes: episodes
            }
    ];
	}        
    return JSON.stringify({
        id: lurl,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n" +lurl,
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
                "Referer": BaseURL,
                "Origin": BaseURL,
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


// KHỚP MẪU ROPHIMFAKE: Trả về chuỗi text thuần túy thay vì gọi JSON.stringify
function parseCategoriesResponse(html) { return "[]"}
function parseCountriesResponse(html) { return "[]"}
function parseYearsResponse(html) { return "[]"}
