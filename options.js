let form = document.getElementById('optionForm');
let okBtn = document.getElementById('okBtn');

chrome.storage.sync.get("hasInstallDevtools", function(res) {
  if(res.hasInstallDevtools === "no"){
    document.getElementById('no').checked=true;
  }
})

okBtn.addEventListener('click', function(e) {
  let status = document.getElementById('no').checked?'no':'yes'
  chrome.storage.sync.set({hasInstallDevtools: status}, function() {
    
  })
});
