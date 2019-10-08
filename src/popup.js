const _ = require('lodash');
const maps = require('./maps');

const body = document.querySelector('body');
const columns = {};
maps.forEach(map => {
  const element = makeMapElement(map);
  let column = columns[map.category];
  if (!column) {
    column = columns[map.category] = makeColum(map.category);
    body.appendChild(column);
  }
  column.appendChild(element);
});

function getLatLonZoom(url) {
  const map = _.find(maps, map => _.invoke(map, 'getLatLonZoom', url));
  if (map) {
    return map.getLatLonZoom(url);
  }
}

function makeColum(name) {
  const columnElement = document.createElement('div');
  columnElement.classList.add('column');
  const titleElement = document.createElement('p');
  titleElement.classList.add('title');
  titleElement.innerHTML = name;
  columnElement.appendChild(titleElement);
  return columnElement;
}

function makeMapElement(map) {
  const element = document.createElement('p');
  element.classList.add('map');
  const img = new Image();
  img.src = "http://www.google.com/s2/favicons?domain=" + map.domain;
  element.appendChild(img);
  const textnode = document.createTextNode(map.name);
  element.appendChild(textnode);
  element.onmousedown = function(event) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      const tab = tabs[0];
      const [lat, lon, zoom] = getLatLonZoom(tab.url);
      const mapUrl = map.getUrl(lat, lon, zoom);
	  if (event.button == 0)
      chrome.tabs.executeScript(tab.id, {
        code: 'window.location.href =' + JSON.stringify(mapUrl) + ';',
      });
	  else if (event.button == 1)
      chrome.tabs.executeScript(tab.id, {
        code: 'window.open(' + JSON.stringify(mapUrl) + ');',
      });
      window.close();
    });
  };
  return element;
}
