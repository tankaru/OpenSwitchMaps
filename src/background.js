const {isMatchingAMap} = require('./maps');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (isMatchingAMap(tab.url)) {
    chrome.pageAction.show(tabId);
  } else {
    chrome.pageAction.hide(tabId);
  }
});
