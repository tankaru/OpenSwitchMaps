const maps = require('./maps');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (isMatchingAMap(tab.url)) {
    chrome.pageAction.show(tabId);
  } else {
    chrome.pageAction.hide(tabId);
  }
});

function isMatchingAMap(url) {
  return maps
    .find(map => map.urlPattern && map.urlPattern.test(url));
}
