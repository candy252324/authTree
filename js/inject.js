
const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__

// 改变页面window对象上的权限数据
function TravelToState(auth){
  let d=hook.store.state
  let authArr = auth
  let authObj=authArr.map(au=>{
    let obj={}
    obj[au]=true
    return obj
  })
  d.currentUser.Authority=authArr
  d.currentUser.AuthorityObj=authObj
  hook.emit('vuex:travel-to-state', d)
}

// 获取页面上权限数据
function getCurAuth(){
  let auth = hook.store.state.currentUser.Authority
  window.postMessage({
    type:"data-from-inject",
    auth:auth
  })
}