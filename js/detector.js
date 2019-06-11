

window.addEventListener('message', e => {
  if (e.data.type === "emitData") {
    chrome.runtime.sendMessage(e.data)
  }
})

// 接受来自authtool的消息
// chrome.runtime.onMessage.addListener(
// function(request, sender, sendResponse) {
//   console.log(request)
//   if(request.type==="change"){
//     console.log(request)
//     window.postMessage({
//       type:"change",
//       data:{count:999}
//     })
//     // chrome.storage.sync.get("count", function(result) {
//     //   console.log('Value currently is ' + result.count);
//     // });
//   }
// });

setInterval(()=>{
  console.log(123)
  window.postMessage({
    type:"change",
    data:{count:Math.random()}
  })
},1000)

function detect (win) {
  setTimeout(() => {
    // Method 1: Check Nuxt.js
    const nuxtDetected = Boolean(window.__NUXT__ || window.$nuxt)
    if (nuxtDetected) {
      let Vue

      if (window.$nuxt) {
        Vue = window.$nuxt.$root.constructor
      }

      win.postMessage({
        devtoolsEnabled: Vue && Vue.config.devtools,
        vueDetected: true,
        nuxtDetected: true
      }, '*')

      return
    }

    // Method 2: Scan all elements inside document
    const all = document.querySelectorAll('*')
    let el
    for (let i = 0; i < all.length; i++) {
      if (all[i].__vue__) {
        el = all[i]
        break
      }
    }
    if (el) {
      let Vue = Object.getPrototypeOf(el.__vue__).constructor
      while (Vue.super) {
        Vue = Vue.super
      }
      win.postMessage({
        devtoolsEnabled: Vue.config.devtools,
        vueDetected: true
      }, '*')
    }
  }, 100)
}

// inject the hook
if (document instanceof HTMLDocument) {
  installScript(detect)
  // installScript(installToast)
}

function installScript (fn) {
  const source = ';(' + fn.toString() + ')(window)'

  // if (isFirefox) {
  //   // eslint-disable-next-line no-eval
  //   window.eval(source) // in Firefox, this evaluates on the content window
  // } else {
    const script = document.createElement('script')
    script.textContent = source
    document.documentElement.appendChild(script)
    script.parentNode.removeChild(script)
  // }
}
