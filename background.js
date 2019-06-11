// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  //插件安装完成时的事件触发，下方执行了一次设置了storage的操作，特别注意到的是谷歌的storage是沙盒内的，不能通过H5的获取到
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // 这里定义的是 何时执行popup.js+popup.html的脚本和作用域，默认情况下 点击弹出窗体执行脚本
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        // 当访问此url时候，图标变彩色
        pageUrl: {hostEquals: 'localhost'},
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    // //             "from the extension");
    // if (request.greeting == "hello")
    //   sendResponse({farewell: "I'm backgroud,goodbye!"});
    if(request.type==="emitData"){
      console.log(request)
      chrome.storage.sync.set({count: request.count})
      // chrome.storage.sync.get("count", function(result) {
      //   console.log('Value currently is ' + result.count);
      // });
    }
  });
