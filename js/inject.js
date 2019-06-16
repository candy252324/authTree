
const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__
const checkStoreInterval = setInterval(checkHookHasStore, 1000)

checkHookHasStore()
function checkHookHasStore(){
  if(hook.store){
    hook.on("vuex:mutation",listenToVuexChange)
    hook.on("vuex:init",listenToVuexChange)
    clearInterval(checkStoreInterval)
  }
}


function listenToVuexChange(){
  try {
    if(arguments[1]){
      let auth=arguments[1].currentUser.Authority
      window.postMessage({
        type:"data-from-inject",
        auth:auth
      })
    }
  } catch (error) {
    console.log(error)
  }
}




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

// AuthTree面板打开时获取页面上权限数据
function getCurAuth(){
  try {
    let auth = hook.store.state.currentUser.Authority
    window.postMessage({
      type:"data-from-inject",
      auth:auth
    })
  } catch (error) { 
    console.log(error)
  }
}