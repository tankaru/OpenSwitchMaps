chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: 'google.*maps'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: 'mapillary'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: 'https://maps.gsi.go.jp'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: 'https://www.openstreetcam.org/map'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: 'https://yandex.com/maps'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: 'https://demo.f4map.com/'},}),
			new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlMatches: 'www.openstreetmap.org'},})
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});