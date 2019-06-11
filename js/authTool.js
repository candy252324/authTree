
let created = false
// 创建自定义面板，同一个插件可以创建多个自定义面板
// 几个参数依次为：panel标题、图标（其实并没有显示）、要加载的页面、加载成功后的回调
if(!created){
  chrome.devtools.panels.create('AuthTool', 'img/icon.png', 'authToolReal.html', panel => {
    // panel loaded
    panel.onShown.addListener(onPanelShown)
    panel.onHidden.addListener(onPanelHidden)
  });
  created=true
}

function onPanelShown () {
  console.log("show")
  // chrome.runtime.sendMessage('authTool-panel-shown')
}

function onPanelHidden () {
  console.log("hide")
  // chrome.runtime.sendMessage('authTool-panel-hidden')
}