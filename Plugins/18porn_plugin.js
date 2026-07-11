BaseURL = "https://www.18porn.sex";

function getManifest() {
    return JSON.stringify({
        "id": "newporn",          
        "name": "18porn",
        "description": "Nguồn xem phim XXX ổn định",
        "version": "1.1",             
        "baseUrl": "https://www.18porn.sex",
        "iconUrl": "https://raw.githubusercontent.com/alokillgtv-gif/VAXAPPSCRIPT/main/img/18porn.jpg", 
        "isEnabled": true,
        "isAdult": true,
        "type": "VIDEO",
        "playerType": "embed"
    });
}

function getHomeSections() {
 return JSON.stringify([
  { slug: 'new/', title: 'Hàng Mới', type: 'Grid' }
 ]);
}
//"/search/" + encodeURIComponent(keyword);
function getPrimaryCategories() {
 return JSON.stringify([
  { name: 'Vú Bự', slug: 'categories/big-tits/' },
  { name: 'Xinh Đẹp', slug: 'categories/beuatiful/' },
  { name: 'Châu Á', slug: 'categories/asian/' },
  { name: 'Chơi 3', slug: 'categories/threesome/' },
  { name: 'Lỗ Nhị', slug: 'categories/anal/' },
  { name: 'Black', slug: '/search/black/' },
  { name: 'Clip Hay', slug: 'best/' }
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
 var BaseURLClean = (typeof BaseURL !== 'undefined' ? BaseURL : "").replace(/\/$/, "");
 
 var page = 1;
 var path = "";
 
 // 1. Cố gắng parse JSON một cách an toàn
 try {
  if (filtersJson) {
   // Thay thế các key không có dấu nháy bằng key có dấu nháy để sửa lỗi JSON lỏng lẻo
   var fixedJson = filtersJson.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
   var filters = JSON.parse(fixedJson);
   
   page = parseInt(filters.page) || 1;
   
   // Chỉ lấy category từ JSON nếu không truyền slug vào hàm
   if (!slug && filters.category) {
    if (Array.isArray(filters.category) && filters.category.length > 0) {
     path = filters.category[0].slug;
    } else if (typeof filters.category === 'string') {
     path = filters.category;
    }
   }
  }
 } catch (e) {
  // Ghi log lỗi nếu cần thiết để debug: console.error(e);
 }
 
 // 2. Nếu có slug truyền vào, ưu tiên sử dụng slug đó
 if (slug) {
  path = slug;
 }
 
 // 3. KIỂM TRA NẾU PATH ĐÃ LÀ URL TUYỆT ĐỐI
 if (/^https?:\/\//i.test(path)) {
  path = path.replace(/\/+$/, "");
  
  if (page > 1) {
   if (path.indexOf("?") > -1) {
    return path + "/" + page;
   } else {
    return path + "/" + page;
   }
  } else {
   return path + "/";
  }
 }
 
 // 4. Xử lý cho URL tương đối (slug thông thường)
 if (!path) return BaseURLClean + "/";
 
 path = path.replace(/^\/+|\/+$/g, "");
 var targetUrl = BaseURLClean + "/" + path;
 
 if (page > 1) {
  if (targetUrl.indexOf("?") > -1) {
   targetUrl += "/" + page;
  } else {
   targetUrl += "/" + page;
  }
 } else {
  // Tránh nhân đôi dấu / nếu path thực chất là query string (ví dụ: ?view=hay-nhat)
  if (path.indexOf("?") !== 0) {
   targetUrl += "/";
  }
 }
 
 return targetUrl;
}


function getUrlSearch(keyword, filtersJson) {
 return BaseURL + "/search/" + encodeURIComponent(keyword) + "/";
}

function getUrlDetail(slug) {
 if (!slug) return "";
 if (slug.indexOf('http') === 0) return slug;
 return BaseURL + "/" + slug;
}

function getUrlCategories() { return BaseURL; }
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
     name: "Server",
     episodes: [{ id: elink, name: "Xem Ngay", slug: "full" }]
    }
  ];

  return JSON.stringify({
   id: elink,
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

function parseDetailResponse(html, url) {
 try {
 // video_url: 'https://www.18porn.sex/get_file/1/a1dfdc42b228e9e4ce0ce20e74aa2d97/1656000/1656262/1656262.mp4/?v-acctoken=MzI0M3wxfDB8MTVmZDU1OWM5MWQ4ZGU3ZTkwNThhNjUwMmZiMWIzOTE2b8fc59a9bef042a&embed=true
  var $link = "";
  var serverMatches = html.match(/video_url:\s+["']([^"']+)["']/i);
  var customjs = textJS();
  var $return = {
   "url": $link,
   "headers": {
    "Referer": url,
    "Origin": url,
    "isEmbed": true,
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    // Đánh lừa thuật toán Client Hints của tường lửa
    "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    "Sec-Ch-Ua-Mobile": "?1",
    "Sec-Ch-Ua-Platform": '"Android"',
    "Custom-Js": customjs.trim(),
    // Khai báo kiểu dữ liệu được chấp nhận giống như trình duyệt thật
    "Accept": "*/*",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    "X-Requested-With": "com.android.chrome"
   },
   "subtitles": []
  }
  if (serverMatches && serverMatches[1]) {
   $link = serverMatches[1]
  }
  if ($link == "") {
   $link = url
  }
  $return.url = $link;
  return JSON.stringify($return);
  
 } catch (e) {
  return JSON.stringify({
   "url": "",
   "headers": {}
  });
 }
}



function textJS() {
 // Sử dụng biến $url từ tham số truyền vào thay vì ghi cứng link
 return `
SCRIPTURL = "https://script.google.com/macros/s/AKfycbwsvLFzWMdxvX9ZH-3wnP3GJzS58v0CtT_0mlEYeOz6cOsgen9IR3c6VPv_EssPXMFzwQ/exec?name=18porn&type=js"; 
const style = document.createElement('style');
var customcss = 'body { background: black; overflow: hidden; }body * {background: black;display:none!important}';
style.innerHTML = customcss;
//document.head.appendChild(style);
function injectScriptAfterLoad(scriptUrl) {
    function doFetchAndInject() {
        console.log('⏳ Đang tiến hành fetch code từ:', scriptUrl);
        
        fetch(SCRIPTURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Mã phản hồi từ Server không tốt: ' + response.status);
                }
                return response.text(); // Lấy toàn bộ mã nguồn dưới dạng chuỗi chữ
            })
            .then(codeText => {
                // 1. Tạo một thẻ script trống mới hoàn toàn bằng JS
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                
                // 2. Đổ thẳng nội dung code dạng chữ vào trong thẻ script vừa tạo
                scriptElement.textContent = codeText;
                
                // 3. Nhúng (Inject) thẻ script này vào vị trí cuối cùng của thẻ body
                document.body.appendChild(scriptElement);
               // showToast('🎯 Đã fetch và nhúng thành công script vào sau body,!',5000);
            })
            .catch(error => {
                console.error('❌ Lỗi không thể fetch hoặc nhúng script:', error);
            });
    }
    
    // Kiểm tra trạng thái tải của trang web
    if (document.readyState !== 'loading') {
        // Nếu trang web đã tải xong cấu trúc DOM cơ bản, thực hiện ngay lập tức
        doFetchAndInject();
    } else {
        // Nếu trang web vẫn đang load thô, đợi sự kiện DOMContentLoaded kích hoạt rồi chạy
        document.addEventListener('DOMContentLoaded', doFetchAndInject);
    }
}

function initCustomVideoFix() {
    // SỬA: Lấy động giá trị từ tham số $url truyền vào hàm textJS bên ngoài
    if (SCRIPTURL && SCRIPTURL !== "undefined") {
        injectScriptAfterLoad(SCRIPTURL);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomVideoFix);
} else {
    initCustomVideoFix();
}

`;
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
new/@@Mới Nhất
categories/dildo/@@Dildo
categories/blonde/@@Blonde
categories/small-tits/@@Small Tits
categories/stockings/@@Stockings
categories/brunette/@@Brunette
categories/beuatiful/@@Beautiful
categories/solo/@@Solo
categories/masturbation/@@Masturbation
categories/lesbian/@@Lesbian
categories/blowjob/@@Blowjob
categories/hairy-pussy/@@Hairy Pussy
categories/redhead/@@Redhead
categories/latina/@@Latina
categories/asian/@@Asian
categories/creampie/@@Creampie
categories/fisting/@@Fisting
categories/cumshot/@@Cumshot
categories/threesome/@@Threesome
categories/big-tits/@@Big Tits
categories/cum-in-mouth/@@Cum In Mouth
categories/anal/@@Anal
categories/cum-on-face/@@Cum On Face
categories/striptease/@@Striptease
categories/webcam/@@Webcam
categories/outdoors/@@Outdoors
categories/amateur/@@Amateur
categories/toys/@@Toys
categories/teen/@@Teen
categories/pussy-licking/@@Pussy Licking
categories/shaved-pussy/@@Shaved Pussy
categories/group/@@Group
categories/hardcore/@@Hardcore
categories/rimming/@@Rimming
categories/interracial/@@Interracial
categories/old-and-young/@@Old and Young
`
}


// Hàm tách menu bằng list - ĐÃ TỐI ƯU: Không dùng Regex lặp để tránh treo app
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
  .replace(/\n|\r/gi, ' - ')
  .replace(/\s+/gi, ' ')
  .replace(/^,+|,+$/g, "");
 return result;
}