const maps = require('./maps');

function getLatLonZoom(url) {
  for (const map of Object.values(maps)) {
    if (map.urlPattern && map.urlPattern.test(url)) {
      return map.getLatLonZoom(url);
    }
  }
}

for (const id of Object.keys(maps)) {
  const element = document.getElementById(id);
  element.onclick = function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      const tab = tabs[0];
      const [lat, lon, zoom] = getLatLonZoom(tab.url);
      const mapUrl = maps[id].getUrl(lat, lon, zoom);
      chrome.tabs.executeScript(tab.id, {
        code: 'window.location.href =' + JSON.stringify(mapUrl) + ';',
      });
      window.close();
    });
  };
}
