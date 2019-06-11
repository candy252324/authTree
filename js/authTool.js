

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
  let num=Math.random()
  let str=`
    let state=hook.store.state;
    state.count=${num};
    hook.emit('vuex:travel-to-state', state)
  `
  chrome.devtools.inspectedWindow.eval(str)

  // chrome.runtime.sendMessage({type: "change",newData:{count:1000}}, function(response) {
  //   console.log(response);
    // box.innerHTML=response.currentUser.Authority
  // });
})


// 1. inject backend code into page
injectScript(chrome.runtime.getURL('js/backend.js'), () => {
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

  // const bridge = new Bridge({
  //   listen (fn) {
  //     port.onMessage.addListener(fn)
  //   },
  //   send (data) {
  //     if (!disconnected) {
  //       port.postMessage(data)
  //     }
  //   }
  // })
  // // 3. send a proxy API to the panel
  // cb(bridge)
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
