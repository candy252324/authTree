

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


// hook.emit('vuex:travel-to-state', {count:100})
document.getElementById('setVueStore').addEventListener('click', function(){
  // hook.emit('vuex:travel-to-state', {count:100})
  chrome.runtime.sendMessage({msgType: "setTreeData",newTreeData:[10000]}, function(response) {
    // console.log(response);
    // box.innerHTML=response.currentUser.Authority
  });
})
