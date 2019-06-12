
const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__

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
