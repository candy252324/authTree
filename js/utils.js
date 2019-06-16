
window.getSelectedValue=getSelectedValue
function getSelectedValue(arr){
  var checkedArr=[]
  function foo(arr){
    debugger
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
