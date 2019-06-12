

let box=document.getElementById('box')


document.getElementById('getTreeData').addEventListener('click', function(){
   chrome.storage.sync.get("count", function(result) {
      console.log('Value currently is ' + result.count);
      box.innerHTML=result.count
    });
  // chrome.runtime.sendMessage({msgType: "getTreeData"}, function(response) {
  //   if(response){
  //     box.innerHTML=response.currentUser.Authority
  //   }
  // });
})


// chrome.devtools.inspectedWindow.eval()方法，在网页的上下文中执行js代码
document.getElementById('setVueStore').addEventListener('click', function(){
  let num=JSON.stringify([Math.random(),1002])
  chrome.devtools.inspectedWindow.eval(`TravelToState(${num})`)
})


// 1. inject backend code into page
injectScript(chrome.runtime.getURL('js/inject.js'), () => {
  // 2. connect to background to setup proxy
  const port = chrome.runtime.connect({
    name: '' + chrome.devtools.inspectedWindow.tabId
  })
  let disconnected = false
  // port.onDisconnect.addListener(() => {
  //   disconnected = true
  // })
  port.onMessage.addListener(function(){
    if (msg.question == "Who's there?"){
      port.postMessage({answer: "yisheng"});
    }
  })
  port.postMessage({name:123132})
})

function injectScript (scriptName, cb) {
  const src = `
    (function() {
      var script = document.constructor.prototype.createElement.call(document, 'script');
      script.src = "${scriptName}";
      document.documentElement.appendChild(script);
    })()
  `
  chrome.devtools.inspectedWindow.eval(src, function (res, err) {
    if (err) {
      console.log(err)
    }
    cb()
  })
}
