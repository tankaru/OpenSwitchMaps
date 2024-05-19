const {isMatchingAMap} = require('./maps');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//https://github.com/tankaru/OpenSwitchMaps/issues/125
	// if url is not http, skip
	if (!tab.url.startsWith('http')){
		chrome.pageAction.hide(tabId);
		return;
	}

  if (isMatchingAMap(tab.url)) {
    chrome.pageAction.show(tabId);
  } else {
    chrome.pageAction.hide(tabId);
  }
});
