function parseMovieDetail(html,$url) {
    var lurl = "";
    var limg = "";
    var lname = "Đang cập nhật...";
    var ldes = "Không có mô tả.";
    var streamUrl = ""; // ĐÃ SỬA: Khai báo rõ ràng biến streamUrl tránh lỗi Global leak

    var rmatch = html.match(/link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (rmatch && rmatch[1]) { lurl = rmatch[1].replace("https://xhamster.com", BASEURL); }

    rmatch = html.match(/rel=["']preload["'][^>]+as=["']image["'][^>]+href=["']([^"']+)["']/i);
    if (rmatch && rmatch[1]) { limg = rmatch[1]; }

    rmatch = html.match(/<title>([^<]+)/i);
    if (rmatch && rmatch[1]) { lname = rmatch[1]; }

    rmatch = html.match(/meta\s+name="description"\s+content="([^"]+)"/i);
    if (rmatch && rmatch[1]) { ldes = rmatch[1]; }
    //
    var $stream = "";
    var epi = [];
    var $linkURL = html.match(/video_url[^"']+'([^"']+)'/i);
    if($linkURL && $linkURL[1]){
        $stream = $linkURL[1];
        epi.push({ id: $stream, name: "Xem Ngay", slug: "full" });
    }
    
    return JSON.stringify({
        id: $stream,
        title: lname,
        posterUrl: limg,
        backdropUrl: limg,
        description: ldes + "\r\n\r\n" + limg + "\r\n\r\n" + lurl+ "\r\n\r\n" + JSON.stringify(epi),
        servers: [
            {
                name: "Servers: ",
                episodes: epi
            }
        ],
        quality: "HD",
        year: 2026,
        rating: 8.5,
        status: "Full",
        duration: "N/A",
        casts: "N/A",
        director: "N/A",
        category: "18+"
    });
}
//BASEURL = "https://www.justporn.com";
//var html = $("html")[0].outerHTML;
//var $url = "https://www.justporn.com/video/18058/hot-babe-remy-cheats-with-bbc/";
//JSON.parse(parseMovieDetail(html,$url))
//video_url: 'https://www.trannymovs.com/get_file/3/bde2d2d3cded1a3e7e5ded4bb8322764/41000/41552/41552.mp4/?v-acctoken=MTI3OXw2Njc4M3wwfGEyMWMwNDNmZWFjNzg4Njc5ZmRkMGNiOTVmNjNmZTcz2576bd28a593d7cb'

