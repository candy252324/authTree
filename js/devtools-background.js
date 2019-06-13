
let created = false

chrome.devtools.inspectedWindow.eval(
  '!!(window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue)',
  function (hasVue) {
    if (!hasVue || created) {
      return
    }
    // 创建自定义面板，同一个插件可以创建多个自定义面板
    // 几个参数依次为：panel标题、图标（其实并没有显示）、要加载的页面、加载成功后的回调
    chrome.devtools.panels.create('AuthTool', 'img/icon.png', 'devtools.html', panel => {
      // panel loaded
      panel.onShown.addListener(onPanelShown)
      panel.onHidden.addListener(onPanelHidden)
    });
    created=true
  }
)


function onPanelShown () {
  console.log("show")
  // chrome.runtime.sendMessage('devtools-panel-shown')
}

function onPanelHidden () {
  console.log("hide")
  // chrome.runtime.sendMessage('devtools-panel-hidden')
}