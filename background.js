chrome.runtime.onInstalled.addListener(function () {
  chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, {
      code: 'var selectedHTML = document.querySelector("' + selector + '").outerHTML; selectedHTML'
    }, function(selection) {
      var htmlContent = selection[0];
      if (htmlContent) {
        downloadFile(htmlContent);
      } else {
        alert('No element found with the specified CSS selector.');
      }
    });
  });
});

