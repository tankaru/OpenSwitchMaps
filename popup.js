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
let mapion = document.getElementById('mapion');


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
		window.close();
	});
}; 
openstreetmap.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'window.location.href ="' + 'https://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon + '";'});
		window.close();
	});
};
mapillary.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom + '";'});
		window.close();
	});
}; 

gsimaps.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://maps.gsi.go.jp/#' + zoom + '/' + lat + '/' + lon + '/' + '";'});
		window.close();
	});
};

f4map.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://demo.f4map.com/#lat=' + lat + '&lon=' + lon + '&zoom=' + zoom + '";'});
		window.close();
	});
}; 

yandex.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.location.href ="' + 'https://yandex.com/maps/?ll=' + lon + '%2C' + lat + '&z=' + zoom + '";'});
		window.close();
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
		window.close();
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
		window.close();
	});
};

overpassturbo.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://overpass-turbo.eu/?Q=&C=' + lat + ';' + lon + ';' + zoom + '");'});
		window.close();
	});
};

osmose.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://osmose.openstreetmap.fr/map/#zoom=' + zoom + '&lat=' + lat + '&lon=' + lon + '");'});
		window.close();
	});
};

keepright.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'https://www.keepright.at/report_map.php?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon + '");'});
		window.close();
	});
};

osminspector.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://tools.geofabrik.de/osmi/?view=geometry&lon=' + lon + '&lat=' + lat + '&zoom=' + zoom + '");'});
		window.close();
	});
};

whodidit.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://simon04.dev.openstreetmap.org/whodidit/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon + '");'});
		window.close();
	});
};

mapcompare.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://tools.geofabrik.de/mc/#' + zoom + '/' + lat + '/' + lon + '");'});
		window.close();
	});
};

multimapas.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'http://javier.jimenezshaw.com/mapas/mapas.html?z=' + zoom + '&c=' + lat + ',' + lon + '");'});
		window.close();
	});
};

ingress.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'https://intel.ingress.com/intel?ll=' + lat + ',' + lon + '&z=' + zoom + '");'});
		window.close();
	});
};

mapion.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		[lat, lon, zoom] = getLatLonZoom(tabs[0].url);
	chrome.tabs.executeScript(
		tabs[0].id,
		{code: 'window.open("' + 'https://www.mapion.co.jp/m2/' + lat + ',' + lon + ',' + zoom + '");'});
		window.close();
	});
};

