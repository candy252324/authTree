
var port = chrome.runtime.connect({name: "from-dector"});

window.addEventListener('message', e => {
  if (e.data.type === "emitData") {
    port.postMessage({data: e.data});
  }
})
