Tôi có đoạn dữ liệu như sau:
{"movieid":"9928","serverhientai":"1","hqhientai":"pro","taphientai":"tap-1","servers":[{"name":"#Vietsub","type":"1","maxEpi":40},{"name":"#Thuyết Minh:","type":"2","maxEpi":40}],"HQ":[{"nname":"1080P V2","type":"pro"},{"nname":"1080P V1","type":"tiktik"},{"nname":"4K V1","type":"vip4k"},{"nname":"4K V2","type":"vip4kv2"}]}

và tôi có js như thế này
function customJS(initialLink){
  return `
(function() {
    // 0. ĐÈ NGAY LẬP TỨC MÀN HÌNH NỀN TỐI VÀ SPINNER LOADING
    let overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: '999998',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Arial, sans-serif'
    });
    overlay.innerHTML = \`
        <div style="border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #e50914; border-radius: 50%; width: 45px; height: 45px; animation: spin 1s linear infinite;"></div>
        <div style="margin-top: 15px; font-size: 14px; color: #aaa; letter-spacing: 0.5px;">Đang tải tập phim...</div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    \`;
    
    if (document.body) {
        document.body.appendChild(overlay);
    } else {
        document.documentElement.appendChild(overlay);
    }

    // Kiểm tra lỗi Server 5xx ngay trước khi thực hiện các bước khác
    const bodyText = document.body ? document.body.innerHTML : "";
    const mainTitle = document.querySelector('.main-title');
    const isServerError = bodyText.includes("Lỗi Server 5xx") || (mainTitle && mainTitle.textContent.includes("5xx"));

    if (isServerError) {
        overlay.innerHTML = \`
            <div style="font-size: 45px; margin-bottom: 12px;">💥</div>
            <div style="font-size: 18px; font-weight: bold; color: #ff5555; margin-bottom: 8px;">Lỗi Server 5xx!</div>
            <div style="font-size: 14px; color: #aaa; text-align: center; max-width: 320px; line-height: 1.5; padding: 0 20px;">
                Hệ thống đang gặp sự cố quá tải hoặc bảo trì. Vui lòng quay lại sau khi server được sửa lại nhé!
            </div>
        \`;
        return;
    }

    // Chống nhảy trang quảng cáo nhưng cho phép bấm nút tắt (X) của quảng cáo
    window.addEventListener('click', function(e) {
        if (!e.target.closest('#floating-select-box') && !e.target.closest('#episode-grid-popup')) {
            let aTag = e.target.closest('a');
            if (aTag && (aTag.target === '_blank' || aTag.href)) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }, true);

    window.open = function() { return null; };

    function showToast(msg) {
        let old = document.getElementById('script-toast');
        if (old) old.remove();
        let toast = document.createElement('div');
        toast.id = 'script-toast';
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999999',
            background: 'rgba(0, 0, 0, 0.85)',
            color: '#4ade80',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'opacity 0.5s'
        });
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    function init() {
        showToast("🚀 Script đang chạy...");

        // 1. LẤY DANH SÁCH TẬP PHIM TRƯỚC KHI XÓA DOM
        const episodeLinks = document.querySelectorAll(".episode .episode-link");
        const allEpisodes = [];
        episodeLinks.forEach((link, index) => {
            const url = link.getAttribute("href");
            const title = link.getAttribute("title") || ("Tập " + link.textContent.trim());
            if (url) {
                allEpisodes.push({ index, title, url });
            }
        });

        let currentPlayingIndex = 0;
        const currentUrl = window.location.href;
        allEpisodes.forEach((ep) => {
            if (currentUrl.includes(ep.url) || ep.url.includes(currentUrl.split('/').pop())) {
                currentPlayingIndex = ep.index;
            }
        });

        // 2. KIỂM TRA LOCALSTORAGE & XỬ LÝ LỊCH SỬ XEM
        const storageKey = "anime_history_" + window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");
        let savedIndex = localStorage.getItem(storageKey);

        if (savedIndex !== null) {
            savedIndex = parseInt(savedIndex, 10);
            // Nếu tập hiện tại khác tập đã lưu VÀ khác tập tiếp theo ngay sau đó (savedIndex + 1)
            if (currentPlayingIndex !== savedIndex && currentPlayingIndex !== savedIndex + 1) {
                if (overlay) overlay.remove();

                let savedEpObj = allEpisodes[savedIndex] || { title: "Tập " + (savedIndex + 1) };
                let nextEpObj = allEpisodes[savedIndex + 1] || { title: "Tập " + (savedIndex + 2) };
                let currentEpObj = allEpisodes[currentPlayingIndex] || { title: "Tập " + (currentPlayingIndex + 1) };

                let modalOverlay = document.createElement('div');
                Object.assign(modalOverlay.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    zIndex: '1000005',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Arial, sans-serif'
                });

                let nextBtnHtml = (savedIndex + 1 < allEpisodes.length) ? 
                    \`<button id="btn-resume-next" style="padding: 10px 14px; border-radius: 8px; border: none; background: #27272a; color: #fff; font-weight: bold; cursor: pointer; font-size: 13px; transition: background 0.2s;">▶️ Xem tập tiếp theo (\${nextEpObj.title})</button>\` : '';

                modalOverlay.innerHTML = \`
                    <div style="background: #18181b; border: 1px solid rgba(255,255,255,0.1); padding: 24px; border-radius: 16px; width: 380px; max-width: 90vw; color: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.9); text-align: center;">
                        <div style="font-size: 22px; margin-bottom: 10px;">📌</div>
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #f43f5e;">Khôi phục lịch sử xem</div>
                        <div style="font-size: 14px; color: #a1a1aa; margin-bottom: 20px; line-height: 1.5;">
                            Bạn đang mở <b>\${currentEpObj.title}</b>, nhưng lịch sử gần đây bạn đang xem đến <b>\${savedEpObj.title}</b>. Bạn có muốn chuyển hướng không?
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button id="btn-resume-saved" style="padding: 10px 14px; border-radius: 8px; border: none; background: #e50914; color: #fff; font-weight: bold; cursor: pointer; font-size: 13px;">💾 Chuyển đến tập đã lưu (\${savedEpObj.title})</button>
                            \${nextBtnHtml}
                            <button id="btn-resume-current" style="padding: 10px 14px; border-radius: 8px; border: none; background: transparent; color: #a1a1aa; cursor: pointer; font-size: 13px;">Vẫn xem tập hiện tại (\${currentEpObj.title})</button>
                        </div>
                    </div>
                \`;
                
                if (document.body) {
                    document.body.appendChild(modalOverlay);
                } else {
                    document.documentElement.appendChild(modalOverlay);
                }

                document.getElementById('btn-resume-saved').onclick = () => {
                    localStorage.setItem(storageKey, savedIndex);
                    window.location.href = allEpisodes[savedIndex].url;
                };

                if (document.getElementById('btn-resume-next')) {
                    document.getElementById('btn-resume-next').onclick = () => {
                        localStorage.setItem(storageKey, savedIndex + 1);
                        window.location.href = allEpisodes[savedIndex + 1].url;
                    };
                }

                document.getElementById('btn-resume-current').onclick = () => {
                    localStorage.setItem(storageKey, currentPlayingIndex);
                    modalOverlay.remove();
                    // Tạo lại overlay loading để tiếp tục chạy app
                    document.documentElement.appendChild(overlay);
                    runApp(currentPlayingIndex, overlay, allEpisodes);
                };

                return; // Dừng init chờ phản hồi từ modal
            }
        }

        // Lưu mốc tập hiện tại vào localStorage
        localStorage.setItem(storageKey, currentPlayingIndex);
        runApp(currentPlayingIndex, overlay, allEpisodes);
    }

    function runApp(currentPlayingIndex, overlay, allEpisodes) {
        // 3. LẤY LINK IFRAME BAN ĐẦU
        let initLink = "` + (initialLink || '') + `";
        if (!initLink) {
            try {
                let scriptTags = document.querySelectorAll('script');
                for (let s of scriptTags) {
                    let m = s.textContent.match(/window\\.PLAYER_DATA\\s*=\\s*(\\{[\\s\\S]*?\\});/);
                    if (m) {
                        let d = JSON.parse(m[1]);
                        if (d && d.link) { initLink = d.link; break; }
                    }
                }
                if (!initLink) {
                    let f = document.querySelector('iframe');
                    if (f) initLink = f.src;
                }
            } catch(e) {}
        }
        if (initLink && initLink.indexOf('//') === 0) {
            initLink = "https:" + initLink;
        }

        // 4. TẠO GIAO DIỆN ĐIỀU KHIỂN CHÍNH (CONTAINER)
        let container = document.createElement("div");
        container.id = "floating-select-box";
        Object.assign(container.style, {
            position: "fixed",
            top: "25px",
            right: "25px",
            transform: "translateX(-50%)",
            zIndex: "999999",
            backgroundColor: "rgba(15, 15, 15, 0.85)",
            backdropFilter: "blur(6px)",
            padding: "10px 16px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "opacity 0.3s ease",
            opacity: "0",
            pointerEvents: "auto"
        });
        container.innerHTML = "<span style='color: #aaa; font-size: 13px;'>⏳ Đang tải...</span>";

        // 5. TẠO BẢNG POPUP LƯỚI CHỌN TẬP (5 CỘT, RỘNG 380px)
        let popupGrid = document.createElement("div");
        popupGrid.id = "episode-grid-popup";
        Object.assign(popupGrid.style, {
            position: "fixed",
            bottom: "85px",
            left: "50%",
            transform: "translateX(-50%) translateY(10px)",
            zIndex: "1000000",
            backgroundColor: "rgba(18, 18, 18, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "14px",
            borderRadius: "16px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.9)",
            width: "380px",
            maxHeight: "260px",
            overflowY: "auto",
            display: "none",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "8px",
            transition: "all 0.25s ease",
            opacity: "0",
            pointerEvents: "none"
        });

        // 6. XOÁ SẠCH BODY VÀ CHÈN IFRAME MỚI
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.documentElement.style.width = '100vw';
        document.documentElement.style.height = '100vh';
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.background = '#000';

        document.body.innerHTML = "";
        Object.assign(document.body.style, {
            margin: '0',
            padding: '0',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: '#000',
            position: 'relative'
        });

        if (overlay) {
            document.body.appendChild(overlay);
        }

        if (initLink) {
            let newIframe = document.createElement("iframe");
            newIframe.className = "frameMain";
            let autoUrl = initLink.includes("?") ? initLink + "&autoplay=1" : initLink + "?autoplay=1";
            newIframe.src = autoUrl;
            newIframe.width = "100%";
            newIframe.height = "100%";
            newIframe.setAttribute("frameborder", "0");
            newIframe.setAttribute("scrolling", "no");
            newIframe.setAttribute("allowfullscreen", "");
            newIframe.setAttribute("allow", "autoplay; fullscreen");
            
            Object.assign(newIframe.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#000',
                zIndex: '1'
            });

            newIframe.onload = function() {
                if (overlay) {
                    setTimeout(() => {
                        overlay.style.transition = "opacity 0.4s ease";
                        overlay.style.opacity = "0";
                        setTimeout(() => overlay.remove(), 400);
                    }, 300);
                }
            };

            document.body.appendChild(newIframe);
        } else {
            if (overlay) setTimeout(() => { overlay.remove(); }, 2000);
        }

        document.body.appendChild(container);
        document.body.appendChild(popupGrid);

        container.addEventListener("mouseenter", () => container.style.opacity = "1");
        container.addEventListener("mouseleave", () => container.style.opacity = "0.25");
        container.addEventListener("touchstart", () => container.style.opacity = "1");

        // 7. FETCH CÁC TẬP CÒN LẠI VÀ QUẢN LÝ UI
        const listFrame = new Array(allEpisodes.length);
        if (allEpisodes[currentPlayingIndex] && initLink) {
            listFrame[currentPlayingIndex] = {
                title: allEpisodes[currentPlayingIndex].title,
                link: initLink,
                index: currentPlayingIndex,
                url: allEpisodes[currentPlayingIndex].url
            };
            updateSelectUI();
        }

        function fetchPage(episodeObj) {
            if (episodeObj.index === currentPlayingIndex) return;
            fetch(episodeObj.url)
                .then(response => response.text())
                .then(htmlText => {
                    const srcNext = htmlText.match(/window\\.PLAYER_DATA[\\s\\S]*?link["'][^"']["']([^"']+)["']/i);
                    if (srcNext && srcNext[1]) {
                        const framelink = decodeURIComponent(srcNext[1].replaceAll('\\\\/', '/'));
                        listFrame[episodeObj.index] = { title: episodeObj.title, link: framelink, index: episodeObj.index, url: episodeObj.url };
                        updateSelectUI();
                    }
                })
                .catch(error => console.error("Lỗi fetch " + episodeObj.title, error));
        }

        function changeEpisode(targetIndex) {
            const ep = listFrame[targetIndex];
            if (ep && ep.link) {
                currentPlayingIndex = targetIndex;
                
                // Cập nhật lại lịch sử vào localStorage khi chuyển tập trực tiếp
                const storageKey = "anime_history_" + window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_");
                localStorage.setItem(storageKey, currentPlayingIndex);

                const targetIframe = document.querySelector(".frameMain");
                if (targetIframe) {
                    let cleanLink = ep.link.split('&autoplay=')[0].split('?autoplay=')[0];
                    let autoUrl = cleanLink.includes("?") ? cleanLink + "&autoplay=1&t=" + Date.now() : cleanLink + "?autoplay=1&t=" + Date.now();
                    targetIframe.src = autoUrl;
                }
                togglePopup(false);
                updateSelectUI();
            }
        }

        let isPopupOpen = false;
        function togglePopup(forceState) {
            isPopupOpen = forceState !== undefined ? forceState : !isPopupOpen;
            if (isPopupOpen) {
                popupGrid.style.display = "grid";
                setTimeout(() => {
                    popupGrid.style.opacity = "1";
                    popupGrid.style.transform = "translateX(-50%) translateY(0)";
                    popupGrid.style.pointerEvents = "auto";
                }, 10);
            } else {
                popupGrid.style.opacity = "0";
                popupGrid.style.transform = "translateX(-50%) translateY(10px)";
                popupGrid.style.pointerEvents = "none";
                setTimeout(() => {
                    if (!isPopupOpen) popupGrid.style.display = "none";
                }, 250);
            }
        }

        document.addEventListener("click", (e) => {
            if (!container.contains(e.target) && !popupGrid.contains(e.target)) {
                togglePopup(false);
            }
        });

        function updateSelectUI() {
            const validFrames = listFrame.filter(Boolean);
            container.innerHTML = "";

            const btnPrev = document.createElement("button");
            btnPrev.textContent = "⏮";
            btnPrev.title = "Tập trước";
            Object.assign(btnPrev.style, {
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#2a2a2a",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold"
            });
            btnPrev.onclick = () => {
                if (currentPlayingIndex > 0 && listFrame[currentPlayingIndex - 1]) {
                    changeEpisode(currentPlayingIndex - 1);
                }
            };

            let currentEpObj = listFrame[currentPlayingIndex];
            let currentTitleText = currentEpObj ? currentEpObj.title : ("Tập " + (currentPlayingIndex + 1));
            
            const btnSelector = document.createElement("button");
            btnSelector.textContent = currentTitleText + " ▼";
            Object.assign(btnSelector.style, {
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #444",
                backgroundColor: "#1c1c1c",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                outline: "none",
                minWidth: "120px"
            });
            btnSelector.onclick = (e) => {
                e.stopPropagation();
                togglePopup();
            };

            const btnNext = document.createElement("button");
            btnNext.textContent = "⏭";
            btnNext.title = "Tập tiếp theo";
            Object.assign(btnNext.style, {
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#e50914",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold"
            });
            btnNext.onclick = () => {
                if (currentPlayingIndex < listFrame.length - 1 && listFrame[currentPlayingIndex + 1]) {
                    changeEpisode(currentPlayingIndex + 1);
                }
            };

            container.appendChild(btnPrev);
            container.appendChild(btnSelector);
            container.appendChild(btnNext);

            popupGrid.innerHTML = "";
            validFrames.forEach(item => {
                const epBtn = document.createElement("button");
                let shortName = item.title.replace(/Tập\\s*/i, '');
                epBtn.textContent = shortName;
                epBtn.title = item.title;
                
                let isCurrent = (item.index === currentPlayingIndex);
                Object.assign(epBtn.style, {
                    padding: "10px 4px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: isCurrent ? "#e50914" : "#252525",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: isCurrent ? "bold" : "normal",
                    textAlign: "center",
                    transition: "background 0.2s"
                });

                epBtn.onmouseenter = () => { if (!isCurrent) epBtn.style.backgroundColor = "#333"; };
                epBtn.onmouseleave = () => { if (!isCurrent) epBtn.style.backgroundColor = "#252525"; };

                epBtn.onclick = () => {
                    changeEpisode(item.index);
                };
                popupGrid.appendChild(epBtn);
            });
        }

        if (allEpisodes.length === 0) {
            container.innerHTML = "<span style='color: #ff5555;'>⚠️ Không tìm thấy danh sách tập!</span>";
        } else {
            allEpisodes.forEach(episode => {
                fetchPage(episode);
            });
        }
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
  `;
}

Tôi cần bạn dựa trên dữ liệu kia thiết kế lại nút sang tập cũ của tôi với cấu trúc dữ liệu như sau:
Nút sang trang sẽ bao gồm 3 khối chọn chính. Chọn server vietsub hay thuyết minh sẽ dựa vào name của server và dư liệu để lấy của nó là type. Và maxepi sẽ là số lượng tập trong 1 server.
Khối thứ 2 là chất lượng của mỗi tập là mỗi server riêng biệt được đấn dấu bằng dữ liêu HQ với tên gọi là nname và type là kiểu HQ. 
Khối thứ 3 là số tập trong mỗi server sẽ lấy maxEpi làm đối chiếu để tạo ra số tập.
Đường link của mỗi tập và mỗi server khi chọn sẽ như sau:
var framelink = `https://hhpanda.st/player/player.php?action=dox_ajax_player&post_id=${currentid}&chapter_st=${currenttap}&type=${typecurrent}&sv=${currentserver}`;
${currentid} => là movieid,
${currenttap} => là bạn tạo dựa trên số thứ tự của mỗi tập và số tập tối đa được quy chiêuú bằng maxEpi. dữ liêu khi tạo xong sẽ là dạng tap-1 tap-2 tap-3...
${typecurrent} => chính là dữ liệu HQ khi tạo. Nếu có 4 HQ thì sẽ có 4 server khác dữ liệu của nó là type.
${currentserver} => server chính, được quy chiếu như là server phụ đề hay lồng tiếng, dữ liệu của nó là type
Mỗi khi có thay đổi bạn phải thay đổi link iframe tương ứng với dữ liệu được chọn và bật loading screen lên. Và đóng khi tải xong iframe mới. Bạn phải đánh dấu số tập đang chọn, cũng như server và hq. Lưu dữ liệu vào localStore tập đang xem và server đang xem, sẽ thông báo khi số tập đang chọn khác với tập đã lưu. Trừ khi tập đang chọn lớn hơn tập đã lưu 1 tập. Thông báo có nút để chuyển sang tập đã lưu và tập kế tiếp. Và mỗi khi tải lại trang bạn phải check coi đang ở tập nào và đánh dấu nó lại.




#custom-main-player-iframe {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    
    /* GỘP TRANSLATE VÀ SCALE VÀO ĐÂY */
    transform: translate(-50%, -50%) scale(1.55) !important; /* 2 = Phóng to 110% */
    
    width: 66% !important;
    height: 58%!important;
    max-height: 100% !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    z-index: 1 !important;
    display: block !important;
    box-sizing: border-box !important;
    transition: width 0.3s ease, height 0.3s ease, transform 0.3s ease !important;
}

