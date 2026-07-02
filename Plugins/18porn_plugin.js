// =============================================================================
// CONFIGURATION & METADATA - 18 PORN (Độc lập hoàn toàn)
// =============================================================================

BaseURL = "https://www.18porn.sex";

function getManifest() {
    return JSON.stringify({
        "id": "newporn",          
        "name": "18porn",
        "description": "Nguồn xem phim XXX ổn định",
        "version": "1.1",             
        "baseUrl": BaseURL,
        "iconUrl": "https://crimescenesolutions.co.za/wp-content/uploads/2026/04/phimhayok-io-fav.jpg", 
        "isEnabled": true,
        "type": "MOVIE",
        "playerType": "auto"
    });
}

function getHomeSections() {
 return JSON.stringify([
  { slug: 'new/', title: 'Hàng Mới', type: 'Grid' }
 ]);
}

function getPrimaryCategories() {
 return JSON.stringify([
  { name: 'Vú Bự', slug: 'categories/big-tits/' },
  { name: 'Xinh Đẹp', slug: 'categories/beuatiful/' },
  { name: 'Châu Á', slug: 'categories/asian/' },
  { name: 'Chơi 3', slug: 'categories/threesome/' },
  { name: 'Lỗ Nhị', slug: 'categories/anal/' }
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
      return BaseURL + "/" + slug + page;
     }
     return BaseURL + "/" + slug;
    } catch (e) {
     return BaseURL + "/" + slug;
    }
}

function getUrlSearch(keyword, filtersJson) {
    return BaseURL + "/search/MOM/" + encodeURIComponent(keyword);
}

function getUrlDetail(slug) {
    return BaseURL + "/" + slug;
}

function getUrlCategories() { return ""; }
function getUrlCountries() { return ""; }
function getUrlYears() { return ""; }

// =============================================================================
// PARSERS - 18 PORN
// =============================================================================

function parseListResponse(html) {
 try {
  var items = [];
  var pattern = /(?=<div[^>]*class="[^"]*item[^"]*")/g;
  var splitItems = html.split(pattern).filter(Boolean);
  
  for (var j = 1; j < splitItems.length; j++) {
   var block = splitItems[j];
   var hrefMatch = block.match(/href="([^"]+)"/i);
   if (!hrefMatch) continue;
   
   var id = hrefMatch[1].trim().replace("/ttt/click?url=","");
   var title = "";
   
   var altMatch = block.match(/title="([^"]+)"/i);
   if (altMatch) {
    title = altMatch[1].trim();
   } else {
    var labelMatch = block.match(/alt="([^"]+)"/i); 
    title = labelMatch ? labelMatch[1].trim() : "";
   }
   
   if (!title || title === "Video không tiêu đề") {
    continue;
   }
   
   var srcMatch = block.match(/data-src="([^"]+)"/i);
   var posterUrl = srcMatch ? srcMatch[1].trim() : "";
   
   items.push({
    "id": id,
    "title": title,
    "posterUrl": posterUrl,
    "backdropUrl": posterUrl
   });
  }
  
  let currentPage = 1;
  let currentMatch = html.match(/class="page-current"[^>]*>\s*<span>\s*(\d+)/i);
  if (currentMatch) {
    currentPage = parseInt(currentMatch[1], 10);
  }
  
  let lastPage = 1;
  let lastMatch = html.match(/class="last"[^>]*>\s*<a\s+href="[^"]*\/(\d+)\/"/i);
  if (lastMatch) {
    lastPage = parseInt(lastMatch[1], 10);
  }
  
  return JSON.stringify({
   items: items,
   pagination: {
    currentPage: currentPage,
    totalPages: lastPage,
    totalItems: items.length * lastPage,
    itemsPerPage: items.length
   }
  });
 } catch (error) {
  return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
 }
}

function parseSearchResponse(html) {
 return parseListResponse(html);
}

function parseMovieDetail(html) {
 var limg = "";
 var lname = "Đang cập nhật...";
 var ldes = "Không có mô tả.";
 var year = 2026;
 var direc = "????";
 var cast = "????";
 var status = "????";
 var duration = "1:09:00 | 16 | 16";
 var servers = [];
 var categories = "????";
 
 try {
  let rmatch = html.match(/meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (rmatch && rmatch[1]) { limg = rmatch[1]; }
  
  rmatch = html.match(/meta\s+property="og:title"\s+content="([^"]+)"/i);
  if (rmatch && rmatch[1]) { lname = rmatch[1]; }
  
  rmatch = html.match(/meta\s+property="og:description"\s+content="([^"]+)"/i);
  if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
  
  rmatch = html.match(/class="item"[\s\S]*?Models:([\s\S]*?)<\/div>/i);
  if (rmatch && rmatch[1]) { cast = rmatch[1].trim().replace(/<[^>]*>|\r|Models:/g, "").replace(/\n+/g, ", "); }
  
  rmatch = html.match(/Duration:[\s\S]*?em>([\s\S]*?)<\/em>/i);
  if (rmatch && rmatch[1]) { duration = rmatch[1].trim().replace("min", "phút").replace("sec", "giây"); }
  
  var elink = "";
  var dlink = "";
  
  rmatch = html.match(/video_id[\s\S]*?\'(\d+)\'/);
  if (rmatch && rmatch[1]) { 
   var idvideo = rmatch[1].trim();
   elink = BaseURL + "/embed/" + idvideo;
  }
  
  rmatch = html.match(/video_url:\s*['"](https:\/\/[^'"]+)['"]/i);
  if (rmatch && rmatch[1]) { 
   dlink = rmatch[1].trim(); 
  }
  
  // SỬA ĐÚNG CHUẨN: Tách thành 2 Server riêng biệt để người dùng chọn nguồn
  servers = [
    {
      name: "Server Gốc (MP4)",
      episodes: [{ id: dlink || elink, name: "Xem Ngay", slug: "full" }]
    },
    {
      name: "Server Dự Phòng (Embed)",
      episodes: [{ id: elink || dlink, name: "Xem Ngay", slug: "full" }]
    }
  ];

  return JSON.stringify({
   id: dlink || elink || "",
   title: lname,
   originName: lname || "",
   posterUrl: limg,
   backdropUrl: limg,
   description: ldes,
   year: year,
   quality: "HD",
   duration: duration || "",
   servers: servers,
   category: categories,
   director: direc,
   casts: cast,
   status: status || ""
  });
  
 } catch (error) {
  return "null";
 }
}

/**
 * SỬA ĐÚNG CHUẨN: Trả về trực tiếp đường dẫn ID truyền vào để phát video
 */
function parseDetailResponse(html) {
 // linkId chính là cái id (dlink hoặc elink) được chọn từ cấu trúc episodes bên trên truyền vào
 return JSON.stringify({
  url: "", 
  headers: { 
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", 
    "Referer": BaseURL 
  }, 
  subtitles: [] 
 });
}

function parseCategoriesResponse(html) { return "[]"; }
function parseCountriesResponse(html) { return "[]"; }
function parseYearsResponse(html) { return "[]"; }
