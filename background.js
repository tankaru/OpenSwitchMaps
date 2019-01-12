chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: 'google.*maps'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'www.mapillary.com'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'maps.gsi.go.jp'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'www.openstreetcam.org'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: '(yandex.com/maps)'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'demo.f4map.com'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'www.openstreetmap.org'},})
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});