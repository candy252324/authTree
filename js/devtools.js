

let box=document.getElementById('box')


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(request)
    // if(request.type==="emitData"){
      box.innerHTML=JSON.stringify(request)
    // }
  });


// chrome.devtools.inspectedWindow.eval()方法，在网页的上下文中执行js代码
document.getElementById('setVueStore').addEventListener('click', function(){
  let num=JSON.stringify([Math.random(),1002])
  chrome.devtools.inspectedWindow.eval(`TravelToState(${num})`)
})





// 1. inject backend code into page
injectScript(chrome.runtime.getURL('js/inject.js'), () => {
  // 2. connect to background to setup proxy
  // const port = chrome.runtime.connect({
  //   name: '' + chrome.devtools.inspectedWindow.tabId
  // })
  // // let disconnected = false
  // // port.onDisconnect.addListener(() => {
  // //   disconnected = true
  // // })
  // port.onMessage.addListener(function(msg){
  //   console.log(msg)
  //   if (msg.question == "Who's there?"){
  //     port.postMessage({answer: "yisheng"});
  //   }
  // })
  // port.postMessage({name:123132})
})

function injectScript (scriptName, cb) {
  const src = `
    (function() {
      var script = document.constructor.prototype.createElement.call(document, 'script');
      script.src = "${scriptName}";
      document.documentElement.appendChild(script);
      script.parentNode.removeChild(script);
    })()
  `
  chrome.devtools.inspectedWindow.eval(src, function (res, err) {
    if (err) {
      console.log(err)
    }
    cb()
  })
}
