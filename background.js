// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onConnect.addListener(function(port) {
  // console.log(port.name) // from-dector
  port.onMessage.addListener(function(msg) {
    if (msg.data.type==="data-from-inject"){
      chrome.runtime.sendMessage({auth: msg.data.auth})
    }
  });
});
  