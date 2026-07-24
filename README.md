var iframe = document.getElementsByTagName("iframe")[0];
var src = iframe.src;
var newframe = '<iframe src="'+src+'" style="position: fixed !important;bottom:0;right:0;top: 0 !important;left: 0 !important;width: 100vw !important;height: 100vh !important;border: none !important;margin: 0 !important;padding: 0 !important;z-index: 999999 !important;box-sizing: border-box !important;"><\/iframe><style>body{width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #000;}<\/style>';
document.body.innerHTML = newframe;
