
const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__

console.log(aaa)
function TravelToState(num){
  let d=hook.store.state
  d.time=num
  console.log("num:",num)
  hook.emit('vuex:travel-to-state', d)
}
