html = outerHTML;

// 1. Chuỗi dữ liệu ban đầu của bạn
const rawString = _$(html).find("script:content('link_m3u8')").html()

// 2. Sử dụng Regex để trích xuất phần chuỗi JSON bên trong
const match = rawString.match(/self\.__next_f\.push\(\[\d+,\"\d+:(.*)\"\]\)/s);
if (match) {
    let jsonEscaped = match[1];

    // Xử lý các ký tự xuống dòng bị thừa ở cuối chuỗi của Next.js payload nếu có
    jsonEscaped = jsonEscaped.replace(/\\n$/, '');

    try {
        // 3. Parse chuỗi thành Object và gán vào biến data
        // Trong JS, việc parse chuỗi có chứa ký tự escape dấu nháy \" bên trong một chuỗi khác 
        // đôi khi cần xử lý lại dấu gạch chéo để JSON.parse hiểu được.
        const cleanJson = JSON.parse(`"${jsonEscaped}"`); 
        const data = JSON.parse(cleanJson);

        console.log("Chuyển đổi thành công!");
        
        // --- DEMO THAO TÁC VỚI BIẾN data ---
        
        // Phần tử thứ 4 (index 3) chứa object thông tin phim
        const moviePayload = data[3]; 
        
        // Lấy tên phim
        console.log("Tên phim:", moviePayload.initialData.movie.title);
        
        // Lấy danh sách link m3u8 của các tập phim
        console.log("Link m3u8 các tập phim:");
        moviePayload.initialData.episodes.forEach(episode => {
            console.log(`- Tập ${episode.name} (${episode.server_name}): ${episode.link_m3u8}`);
        });

    } catch (error) {
        console.error("Lỗi khi parse JSON:", error.message);
    }
} else {
    console.log("Không tìm thấy cấu trúc dữ liệu phù hợp.");
}


// key decode
