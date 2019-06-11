
const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__
window.addEventListener('message', e => {
  if (e.data.type === "change") {
    hook.emit('vuex:travel-to-state', e.data.data)
  }
})
