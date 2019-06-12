
window.getSelectedValue=getSelectedValue
function getSelectedValue(arr){
  var checkedArr=[]
  function foo(arr){
    debugger
    arr.forEach(item=>{
      if(item.checked){
        checkedArr.push(item.value)
        if(item.children && item.children.length){
          console.log(item.children)
          foo(item.children)
        }
      }
    })
  }
  foo(arr)
  return checkedArr
}
