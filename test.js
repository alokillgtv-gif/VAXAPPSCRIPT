// Tắt browser scroll restoration để tránh xung đột khi navigate back/forward
        if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
        $(document).ready(function() {
            var _epHash = 'rwZEFti5OakBVvm4b_mh7qBlH7ZGFSMB_0X38Cz_3vhpaTJiv9Ffn5upLsyfwCyNRG2Dq3xELT6fjU4MD_Lm7v-Yb1QdNtEToN1L5uOXHMtfJXw78a_2tK3U-4Nh4HGM';
            var _epID   = 114455;
            console.log('[DEBUG] EpisodeURL hash:', _epHash);
            console.log('[DEBUG] episode_id:', _epID);
            console.log('[DEBUG] filmInfo:', filmInfo);

            // Inline player data optimization — use inline data if available
            if (window.PLAYER_DATA && window.PLAYER_DATA.playTech) {
                try {
                    console.log('[PERF] Using inline player data');
                    var f = window.PLAYER_DATA;
                    var episodeId = filmInfo.episodeID;

                    // Active class + scroll handled below after player init

                    if (f.playTech == "api" || f.playTech == "all") {
                        if (typeof f.link === "string") {
                            jQuery("#media-player").empty().html('<span style="vertical-align: middle;text-align: center;display: table-cell;font-style: normal;font-variant: normal;font-weight: normal;font-stretch: normal;font-size: 23px;line-height: 20px;">' + f.link + "</span>").css({
                                "display": "table",
                                "background": "#000"
                            });
                        } else {
                            var sources = [];
                            jQuery.each(f.link, function(dataAndEvents, file) {
                                file.file = file.file.replace("&http", "http");
                                sources.push(file);
                            });

                            // Get next episode URL from DOM (no AJAX needed)
                            var nextEpUrl = _getNextEpisodeUrl(episodeId);
                            setupJWPlayer(sources, episodeId, null);
                            if (nextEpUrl) {
                                window.currentXMLFile = nextEpUrl;
                                pautonext = true;
                                jQuery("#autonext-status").html("Bật");
                            } else {
                                pautonext = false;
                                jQuery("#autonext-status").html("Tắt");
                            }
                        }
                    } else if (f.playTech == "embed") {
                        // For embed, wrap URL in sources array format expected by PLTV.Player
                        var embedSources = [{
                            file: f.link,
                            type: "mp4",
                            mimeType: "video/mp4",
                            default: true,
                            label: "720"
                        }];
                        var href = $(".list-episode a[data-hash='" + _epHash + "']").attr("href");
                        PLTV.Player(f.playTech, embedSources, href);
                    } else if (f.playTech == "iframe") {
                        jQuery("#media-player").empty().html('<iframe src="' + f.link + '" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen allow="autoplay; fullscreen"></iframe>');
                    }
                } catch (e) {
                    console.error('[PERF] Inline player data error, falling back to AJAX:', e);
                    AnimeVsub(_epHash, filmInfo.filmID);
                }
            } else {
                console.log('[PERF] Falling back to AJAX');
                AnimeVsub(_epHash, filmInfo.filmID);
            }

            // Deferred backup links loading — removed from page load
            // LoadLinksBackup(_epID);  // Commented out — will load on-demand

            // Highlight tập đang xem bằng JS — dựa vào filmInfo.episodeID
            var curEpID = filmInfo.episodeID;
            if (curEpID) {
                var $activeEp = $('.episode-link[data-id="' + curEpID + '"]');
                $(".list-episode a").attr("data-movie", "");
                $activeEp.attr("data-movie", "playing");
                $(EPISODE_LINK_ID + " a").removeClass(EPISODE_CLASS_ACTIVE).addClass(EPISODE_CLASS_NOACTIVE);
                $activeEp.removeClass(EPISODE_CLASS_NOACTIVE).addClass(EPISODE_CLASS_ACTIVE)
                    .closest('li.episode').addClass('playing');
                // Scroll list episode đến tập đang active
                if ($activeEp.length) {
                    var el = $activeEp[0];
                    var container = $activeEp.closest('ul.list-episode')[0];
                    if (container) {
                        container.scrollTop = el.offsetTop - container.offsetTop - container.clientHeight / 2 + el.offsetHeight / 2;
                    }
                }
            }
            // Scroll đến player sau 300ms
            setTimeout(function() { fx.scrollTo("#watch-block", 1000); }, 300);

            // Deferred backup links loading
            var backupLinksLoaded = false;
            var _epID_forBackup = _epID;

            // Load backup links on-demand when #links-backup area is clicked or becomes visible
            $(document).on('click focus mouseenter', '#links-backup', function() {
                if (!backupLinksLoaded && _epID_forBackup) {
                    console.log('[PERF] Loading backup links on-demand');
                    backupLinksLoaded = true;
                    LoadLinksBackup(_epID_forBackup);
                }
            });

            // Also load if user scrolls near the backup links area
            var backupObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting && !backupLinksLoaded && _epID_forBackup) {
                        console.log('[PERF] Loading backup links (scroll trigger)');
                        backupLinksLoaded = true;
                        LoadLinksBackup(_epID_forBackup);
                        backupObserver.disconnect();
                    }
                });
            }, { rootMargin: '100px' });

            var backupEl = document.getElementById('links-backup');
            if (backupEl) {
                backupObserver.observe(backupEl);
            }
        });