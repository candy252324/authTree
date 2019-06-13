
var port = chrome.runtime.connect({name: "from-dector"});

window.addEventListener('message', e => {
  console.log("dector.js",e)
  if (e.data.type === "data-from-hook" || e.data.type==="data-from-inject") {
    port.postMessage({data: e.data});
  }
})
