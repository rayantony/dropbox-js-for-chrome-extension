/*
 * Copyright (c) 2011, IWAMURO Motonori
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *   1. Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 * 
 *   2. Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

//// Utilities

// HTMLize object
function object2table(data) {
  var table = $("<table/>");
  if (typeof data === "string") {
    table.append($("<tr/>").append($("<td/>").text(data)));
  } else if (data.type && data.type.match("^image/")) {
    var img = document.createElement("img");
    img.onload = function() {
      webkitURL.revokeOjbectURL(this.src);
    };
    img.src = webkitURL.createObjectURL(data);
    table.append($("<tr/>").append($("<td/>").append(img)));
  } else {
    for (var k in data) {
      var v = data[k];
      var th = $("<th/>").text(k);
      var td = $("<td/>");
      if (typeof v != "object") {
	td.text(v);
      } else {
	td.html(object2table(v));
      }
      table.append($("<tr/>").append(th, td));
    }
  }
  return table;
}

// Show result data
function showResult(button, data) {
  getElem(button, "result").empty().append(object2table(data));
}

// Get 'class'ed element around button
function getElem(button, clazz) {
  return $(button).parent().find("[class=" + clazz + "]");
}

//// Initialize

var dropbox = null;

// Initialize example page
function init() {
  var consumerKnS = localStorage["Dropbox:consumerKnS"];
  if (consumerKnS) {
    $("#consumerKnS").val(consumerKnS);
    $("#consumerKnS2").val(consumerKnS);
    construct();
  }
}

// Create base64 encoded consumer key and secret
function createConsumerKnS() {
  var consumerKey = $("#consumerKey").val();
  var consumerSecret = $("#consumerSecret").val();
  if (!consumerKey || !consumerSecret) {
    alert("Missing consumerKey or consumerSecret.");
    return;
  }
  var consumerKnS = btoa(consumerKey + "\n" + consumerSecret);
  $("#consumerKnS").val(consumerKnS);
  $("#consumerKnS2").val(consumerKnS);
  localStorage["Dropbox:consumerKnS"] = consumerKnS;
}

// Construct Dropbox object
function construct() {
  if (!dropbox) {
    var consumerKnS = $("#consumerKnS2").val();
    if (!consumerKnS) {
      alert("Missing base64 encoded consumer key and secret.");
      return;
    }
    dropbox = new Dropbox(consumerKnS);
    $("#status").html('<span class="inited">OK</span>');
  }
}

// Clear consumer key and consumer secret
function clearKey() {
  delete localStorage["Dropbox:consumerKnS"];
  $("#consumerKnS").val("");
  dropbox = null;
  $("#status").html('Not constructed.');
}

//// Example functions

function exampleAuthorize(button) {
  dropbox.authorize(function() {
    var data = {
      requestToken: dropbox.oauth.requestToken,
      requestTokenSecret: dropbox.oauth.requestTokenSecret,
      accessToken: dropbox.oauth.accessToken,
      accessTokenSecret: dropbox.oauth.accessTokenSecret
    };
    showResult(button, data);
  });
}

function exampleUnauthorize(button) {
  dropbox.unauthorize();
  var data = {
    requestToken: dropbox.oauth.requestToken,
    requestTokenSecret: dropbox.oauth.requestTokenSecret,
    accessToken: dropbox.oauth.accessToken,
    accessTokenSecret: dropbox.oauth.accessTokenSecret
  };
  showResult(button, data);
}

function exampleGetAccountInfo(button) {
  dropbox.getAccountInfo(function(data) {
    showResult(button, data);
  });
}

function exampleGetMetadata(button) {
  var path = getElem(button, "path").val();
  dropbox.getMetadata(path, function(data) {
    showResult(button, data);
  });
}

function exampleGetFolderContents(button) {
  var path = getElem(button, "path").val();
  dropbox.getFolderContents(path, function(data) {
    showResult(button, data);
  });
}

function exampleGetFile(button) {
  var path = getElem(button, "path").val();
  dropbox.getFile(path, function(data) {
    showResult(button, data);
  });
}

function exampleGetThumbnail(button) {
  var path = getElem(button, "path").val();
  dropbox.getThumbnail(path, "large", "JPEG", function(data) {
    showResult(button, data);
  });
}

function exampleUploadFile(button) {
  var path = getElem(button, "path").val();
  var text = getElem(button, "text").val();
  dropbox.uploadFile(path, text, function(data) {
    showResult(button, data);
  });
}

function exampleCreateFolder(button) {
  var path = getElem(button, "path").val();
  dropbox.createFolder(path, function(data) {
    showResult(button, data);
  });
}

function exampleMoveItem(button) {
  var fromPath = getElem(button, "fromPath").val();
  var toPath = getElem(button, "toPath").val();
  dropbox.moveItem(fromPath, toPath, function(data) {
    showResult(button, data);
  });
}

function exampleCopyItem(button) {
  var fromPath = getElem(button, "fromPath").val();
  var toPath = getElem(button, "toPath").val();
  dropbox.copyItem(fromPath, toPath, function(data) {
    showResult(button, data);
  });
}

function exampleDeleteItem(button) {
  var path = getElem(button, "path").val();
  dropbox.deleteItem(path, function(data) {
    showResult(button, data);
  });
}