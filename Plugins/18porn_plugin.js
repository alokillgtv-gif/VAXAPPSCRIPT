// =============================================================================
// CONFIGURATION & METADATA - 18 PORN (Độc lập hoàn toàn)
// =============================================================================

BaseURL = "https://www.18porn.sex";

function getManifest() {
    return JSON.stringify({
        "id": "newporn",          
        "name": "18porn",
        "description": "Nguồn xem phim XXX ổn định",
        "version": "1.0",             
        "baseUrl": BaseURL,
        "iconUrl": "https://raw.githubusercontent.com/alokillgtv-gif/VAXAPPSCRIPT/main/img/18porn.jpg", 
        "isEnabled": true,
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
     name: "Server",
     episodes: [{ id: elink, name: "Xem Ngay", slug: "full" }]
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
  }, 
  subtitles: [] 
 });
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

function CustomjQ(html, url) {
 var $cutom1 = `
    function runBegin(){
        customAlert("2412421", "Alo alo");
    }
    `;
 var $custom2 = `
    function customAlert(title, message) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: '99999', opacity: '0', transition: 'opacity 0.2s ease'
        });
        
        const box = document.createElement('div');
        Object.assign(box.style, {
            backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)', maxWidth: '380px', width: '85%',
            boxSizing: 'border-box', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            transform: 'scale(0.8)', transition: 'transform 0.2s ease'
        });
        
        const titleEl = document.createElement('input');
        titleEl.type = 'text'; 
        titleEl.value = title;
        Object.assign(titleEl.style, {
            display: 'block', width: '100%', boxSizing: 'border-box',
            margin: '0 0 12px 0', padding: '6px 10px', color: '#222222',
            fontSize: '15px', fontWeight: '600', border: '1px solid #ddd', borderRadius: '6px'
        });
        
        const msgEl = document.createElement('textarea');
        msgEl.value = message;
        Object.assign(msgEl.style, {
            display: 'block', width: '100%', boxSizing: 'border-box',
            margin: '0 0 20px 0', padding: '8px 10px', color: '#555555',
            fontSize: '14px', height: '200px', lineHeight: '1.5',
            border: '1px solid #ddd', borderRadius: '6px', resize: 'none'
        });
        
        const btn = document.createElement('button');
        btn.innerText = 'OK';
        Object.assign(btn.style, {
            display: 'block', margin: '0 auto', padding: '10px 28px',
            fontSize: '15px', fontWeight: '600', color: '#ffffff',
            backgroundColor: '#007bff', border: 'none', borderRadius: '6px',
            cursor: 'pointer', outline: 'none', transition: 'background-color 0.1s'
        });
        
        btn.onmouseover = () => btn.style.backgroundColor = '#0056b3';
        btn.onmouseout = () => btn.style.backgroundColor = '#007bff';
        
        const closeAlert = () => {
            overlay.style.opacity = '0';
            box.style.transform = 'scale(0.8)';
            setTimeout(() => { overlay.remove(); }, 200);
        };
        
        btn.onclick = closeAlert;
        overlay.onclick = (e) => { if (e.target === overlay) closeAlert(); };
        
        box.appendChild(titleEl);
        box.appendChild(msgEl);
        box.appendChild(btn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        
        setTimeout(() => { overlay.style.opacity = '1'; box.style.transform = 'scale(1)'; }, 10);
    }

    function initCustomVideoFix() {
        const style = document.createElement('style');
        var customcss = 'body {overflow: hidden; }#comments,header,footer,.entry-actions,.entry-header,.entry-info,.entry-content,#related-posts,.entry-content + .mt-2 {display:none}body * {background: black;}';
        style.innerHTML = customcss;
        document.head.appendChild(style);
        
        if (typeof jwplayer === "function") {
            const player = jwplayer("previewPlayer");
            if (player && typeof player.getMute === "function") {
                if (player.getMute()) {
                    player.setMute(false);
                }
                player.setVolume(100);
            }
        }
        
        const checkAndClick = setInterval(() => {
            const skipButton = document.getElementById("skip-ad");
            if (skipButton) {
                skipButton.click();
                clearInterval(checkAndClick);
            }
        }, 200);
        
        setTimeout(() => { clearInterval(checkAndClick); }, 20000);
        runBegin();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomVideoFix);
    } else {
        initCustomVideoFix();
    }
`
 return $cutom1 + $cutom2;
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