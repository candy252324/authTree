

let box=document.getElementById('box')


document.getElementById('getTreeData').addEventListener('click', function(){
  chrome.runtime.sendMessage({msgType: "getTreeData"}, function(response) {
    if(response){
      box.innerHTML=response.currentUser.Authority
    }
  });
})

document.getElementById('setVueStore').addEventListener('click', function(){
  chrome.runtime.sendMessage({msgType: "setTreeData",newTreeData:[10000]}, function(response) {
    // console.log(response);
    // box.innerHTML=response.currentUser.Authority
  });
})
