var treeData = {
  // 复选框change事件
  onchange: function (input, yntree){
    // console.log(this);
    console.log(input);
    console.log(yntree.data);
    let data=yntree.data
    var checkedArr=[]
    function foo(arr){
      arr.forEach(item=>{
        if(item.checked){
          checkedArr.push(item.value)
        }
        if(item.children && item.children.length){
          foo(item.children)
        }
      })
    }
    foo(data)
    console.log(checkedArr)
  },
  // 是否严格的遵循父子互相关联的做法
  checkStrictly: true,
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
  });


// chrome.devtools.inspectedWindow.eval()方法，在网页的上下文中执行js代码
document.getElementById('setVueStore').addEventListener('click', function(){
  let auth=JSON.stringify([10000,10001,10002])
  chrome.devtools.inspectedWindow.eval(`TravelToState(${auth})`)

  yntree.reInit([	{
    name: "我的公司",
    inputName: "company",
    value: "我的公司",
    children: [
      {
        name: "公司管理",
        inputName: "company manage",
        value: "公司管理"
      },
      {
        name: "部门管理",
        inputName: "department manage",
        value: "部门管理"
      }
    ]
  }]);
})





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
