
var port = chrome.runtime.connect({name: "from-dector"});

window.addEventListener('message', e => {
  if (e.data.type==="data-from-inject") {
    port.postMessage({data: e.data});
  }
})


injectCustomJs('js/inject.js')
function injectCustomJs(jsPath) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  script.src = chrome.runtime.getURL(jsPath);
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}