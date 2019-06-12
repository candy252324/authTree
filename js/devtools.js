
var treeData = {
  // 复选框change事件
  onchange: function (input, yntree){
    let data=yntree.data
    setTimeout(()=>{
     let checkedArr = getSelectedValue(data)
      let auth=JSON.stringify(checkedArr)
      // chrome.devtools.inspectedWindow.eval()方法，在网页的上下文中执行js代码
      chrome.devtools.inspectedWindow.eval(`TravelToState(${auth})`)
    },100)
  },
  checkStrictly: true, // 是否严格的遵循父子互相关联的做法
  data:window.allTreeData
};
var yntree = new YnTree(document.getElementById("tree"), treeData);


let box=document.getElementById('box')




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(request)
    // if(request.type==="emitData"){
      // let d=foo()
      box.innerHTML=JSON.stringify(request.auth)
    // }
    let data=setSelectedValue(treeData.data, request.auth)
    console.log(data)
    yntree.reInit(data)
  });





// 1. inject backend code into page
injectScript(chrome.runtime.getURL('js/inject.js'), () => {

})

// script.parentNode.removeChild(script);
function injectScript (scriptName, cb) {
  const src = `
    (function() {
      var script = document.constructor.prototype.createElement.call(document, 'script');
      script.src = "${scriptName}";
      document.documentElement.appendChild(script);
    
    })()
  `
  chrome.devtools.inspectedWindow.eval(src, function (res, err) {
    if (err) {
      console.log(err)
    }
    cb()
  })
}





// ----------------------------- utils -----------------------------

// 获取选中的id
function getSelectedValue(arr){
  var checkedArr=[]
  function foo(arr){
    arr.forEach(item=>{
      if(item.checked){
        checkedArr.push(item.value)
        if(item.children && item.children.length){
          foo(item.children)
        }
      }
    })
  }
  foo(arr)
  return checkedArr
}


function setSelectedValue(oldData,selectedArr){
  let newData=JSON.parse(JSON.stringify(oldData))
  function foo(arr){
    arr.forEach((item,index)=>{
      if(selectedArr.includes(item.value)){
        item.checked=true
      }else{
        item.checked=false
      }
      if(item.children&&item.children.length){
        foo(item.children)
      }
    })
  }
  foo(newData)
  return newData
}