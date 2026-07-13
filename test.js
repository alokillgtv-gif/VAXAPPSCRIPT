
function parseMovieDetail(html,url) {
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
    var $info = "";
  //try {
    $info = _$(html).find(".dinfo").html().replace(/\t|\r|\n|\s\s/g,"");
    // Năm sản xuất
    rmatch = $info.match(/Năm sản xuất[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
    if (rmatch && rmatch[1]) { year = rmatch[1];}
    // Đạo diễn
    rmatch = $info.match(/Đạo diễn[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
        if (rmatch && rmatch[1]) { direc = rmatch[1]; }
    // Tinh Trang
    rmatch = $info.match(/Tình trạng[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
        if (rmatch && rmatch[1]) { status = rmatch[1]; }
    // Thời lượng
    rmatch = $info.match(/Thời lượng[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
        if (rmatch && rmatch[1]) { duration = rmatch[1]; }
    // Dien vien
    rmatch = $info.match(/Diễn viên:[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
        if (rmatch && rmatch[1]) { 
            cast = $(rmatch[1]).text(); 
    }
	var streamUrl = "";
      
	
    return JSON.stringify({
        id: streamUrl,
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
  /*  
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
    */
}


BASEURL = "https://phimnganhdc.com";
var html = outerHTML;
var $url = "https://phimnganhdc.com/hot-babe-remy-cheats-with-bbc/";
//JSON.parse(parseMovieDetail(outerHTML,$url))
$info = _$(html).find(".dinfo").text().replace(/\t|\r|\n|\s\s/g,"");
    // Năm sản xuất
    rmatch = $info.match(/Năm sản xuất[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
    if (rmatch && rmatch[1]) { year = rmatch[1];}
    // Đạo diễn
    rmatch = $info.match(/Đạo diễn[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
        if (rmatch && rmatch[1]) { direc = rmatch[1]; }
    // Tinh Trang
    rmatch = $info.match(/Tình trạng[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
        if (rmatch && rmatch[1]) { status = rmatch[1]; }
    // Thời lượng
    rmatch = $info.match(/Thời lượng[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
        if (rmatch && rmatch[1]) { duration = rmatch[1]; }
    // Dien vien
    rmatch = $info.match(/Diễn viên:[\s\S]*?\/dt>[^>]+>([\s\S]*?)<\/dd>/i);
        if (rmatch && rmatch[1]) { 
            cast = $(rmatch[1]).text(); 
    }

$info = $(html).find(".dinfo");
