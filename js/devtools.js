// chrome.devtools.inspectedWindow.eval()方法，在网页的上下文中执行js代码
// 面板开启，调用injectJS 的方法, 主动获取数据
// 解决页面刷新完成后再打开面板，接收不到hook.emit 发送的消息，导致没数据的问题
chrome.devtools.inspectedWindow.eval(`getCurAuth()`)




var treeData = {
  // 复选框change事件
  onchange: function (input, yntree){
    let data=yntree.data
    setTimeout(()=>{
     let checkedArr = getSelectedValue(data)
      let auth=JSON.stringify(checkedArr)
      chrome.devtools.inspectedWindow.eval(`TravelToState(${auth})`)
    },100)
  },
  checkStrictly: true, // 是否严格的遵循父子互相关联的做法
  data:window.allTreeData
};
var yntree = new YnTree(document.getElementById("tree"), treeData);







chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let data=setSelectedValue(treeData.data, request.auth)
    yntree.reInit(data)
});






















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

// 判断某个对象或者该对象的某个下级节点是否符合某个表达式
function incluedeValue(obj,exp){
  let bool=false
  function fn(obj){
    if(exp(obj)){
      bool=true
      return
    }else if(obj.children && obj.children.length){
      for(it of obj.children){
        fn(it)
      }
    }
  }
  fn(obj)
  return bool
}

// 根据选中的id设置tree
function setSelectedValue(oldData,selectedArr){
  let newData=JSON.parse(JSON.stringify(oldData))
  function foo(arr){
    arr.forEach((item,index)=>{
      if(incluedeValue(item, item=>selectedArr.includes(item.value))){
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

// 节点过滤
// this.treeData = filterTree(this.treeData_backup, node => node.title.indexOf(this.searchVal)>-1)
function filterTree(nodes, predicate){
  if (!(nodes && nodes.length)) {
    return [];
  }
  const newChildren = [];
  for (const node of nodes) {
    if (predicate(node)) {
      newChildren.push(node);
      node.children = filterTree(node.children, predicate);
    } else {
      newChildren.push(...filterTree(node.children, predicate));
    }
  }
  return newChildren;
}