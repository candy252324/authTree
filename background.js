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

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(request)
//     if(request.type==="emitData"){
//       chrome.runtime.sendMessage(e.data)
//       // chrome.storage.sync.set({count: request.count})
//     }
//   });

  chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
      if (msg.data.type == "emitData"){
        console.log(msg)
        chrome.runtime.sendMessage({auth: msg.data.auth})
        // port.postMessage({auth: msg.data.auth});
      }
        //     port.postMessage({question: "Who's there?"});
        // else if (msg.answer == "Madame")
        //     port.postMessage({question: "Madame who?"});
        // else if (msg.answer == "Madame... Bovary")
        //     port.postMessage({question: "I don't get it."});
    });
  });
  