let google = document.getElementById('google');
let openstreetmap = document.getElementById('openstreetmap');
let mapillary = document.getElementById('mapillary');
let gsimaps = document.getElementById('gsimaps');
let yahoo = document.getElementById('yahoo');
let mapfan = document.getElementById('mapfan');
let bing = document.getElementById('bing');
let overpassturbo = document.getElementById('overpassturbo');
let osmose = document.getElementById('osmose');
let whodidit = document.getElementById('whodidit');
let mapcompare = document.getElementById('mapcompare');
let multimapas = document.getElementById('multimapas');
let yandex = document.getElementById('yandex');
let ingress = document.getElementById('ingress');
let f4map = document.getElementById('f4map');
let keepright = document.getElementById('keepright');
let osminspector = document.getElementById('osminspector');

function getLatLonZoom(url){
	map_url = url;
	if (map_url.match(/(www\.openstreetmap)/)){
		[is_supported_url, zoom, lat, lon] = map_url.match(/map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
	}else if(map_url.match(/(google).*(maps).*z/)){
		[is_supported_url, lat, lon, zoom] = map_url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/);
	}else if(map_url.match(/(google).*(maps).*(1e3)$/)){
		[is_supported_url, lat, lon, zoom] = map_url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)[.m]/);
		zoom = -1.4436*Math.log(zoom)+26.871;
	}else if(map_url.match(/(mapillary)/)){
		[is_supported_url, lat, lon, zoom] = map_url.match(/lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)&z=(\d{1,2})/);
	}else if(map_url.match(/(openstreetcam)/)){
		[is_supported_url, lat, lon, zoom] = map_url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
	}else if(map_url.match(/(maps\.gsi\.go\.jp)/)){
		[is_supported_url, zoom, lat, lon] = map_url.match(/#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
	}else if(map_url.match(/(yandex).*(maps)/)){
		[is_supported_url, lon, lat, zoom] = map_url.match(/ll=(-?\d[0-9.]*)%2C(-?\d[0-9.]*)&z=(\d{1,2})/);
	}else if(map_url.match(/(demo\.f4map\.com)/)){
		[is_supported_url, lat, lon, zoom] = map_url.match(/#lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&zoom=(\d{1,2})/);
	}
	
	return [lat, lon, zoom];

};




google.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://www.google.co.jp/maps/@' + lat + ',' + lon + ',' + zoom + 'z' + '";'});
	});
}; 
openstreetmap.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'window.location.href ="' + 'https://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon + '";'});
   });
};
mapillary.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom + '";'});
	});
}; 

gsimaps.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://maps.gsi.go.jp/#' + zoom + '/' + lat + '/' + lon + '/' + '";'});
	});
};

f4map.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://demo.f4map.com/#lat=' + lat + '&lon=' + lon + '&zoom=' + zoom + '";'});
	});
}; 

yandex.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://yandex.com/maps/?ll=' + lon + '%2C' + lat + '&z=' + zoom + '";'});
	});
}; 

yahoo.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'https://map.yahoo.co.jp/maps?lat=' + lat + '&lon=' + lon + '&z=' + zoom + '");'});
	});
};

mapfan.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'https://mapfan.com/map/spots/search?c=' + lat + ',' + lon + ',' + zoom + '");'});
	});
};

bing.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'https://www.bing.com/maps?cp=' + lat + '~' + lon + '&lvl=' + zoom + '");'});
	});
};

openstreetcam.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://www.openstreetcam.org/map/@' + lat + ',' + lon + ',' + zoom + 'z' + '";'});
	});
};

overpassturbo.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://overpass-turbo.eu/?Q=&C=' + lat + ';' + lon + ';' + zoom + '");'});
	});
};

osmose.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://osmose.openstreetmap.fr/map/#zoom=' + zoom + '&lat=' + lat + '&lon=' + lon + '");'});
	});
};

keepright.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'https://www.keepright.at/report_map.php?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon + '");'});
	});
};

osminspector.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://tools.geofabrik.de/osmi/?view=geometry&lon=' + lon + '&lat=' + lat + '&zoom=' + zoom + '");'});
	});
};

whodidit.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://simon04.dev.openstreetmap.org/whodidit/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon + '");'});
	});
};

mapcompare.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://tools.geofabrik.de/mc/#' + zoom + '/' + lat + '/' + lon + '");'});
	});
};

multimapas.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://javier.jimenezshaw.com/mapas/mapas.html?z=' + zoom + '&c=' + lat + ',' + lon + '");'});
	});
};

ingress.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'https://intel.ingress.com/intel?ll=' + lat + ',' + lon + '&z=' + zoom + '");'});
	});
};
