const _ = require('lodash');

module.exports = {
  getAllMaps,
  isMatchingAMap,
  getLatLonZoom,
};

function getAllMaps() {
  return maps;
}

function isMatchingAMap(url) {
  return _.some(maps, map => _.invoke(map, 'getLatLonZoom', url));
}

function getLatLonZoom(url) {
  const map = _.find(maps, map => _.invoke(map, 'getLatLonZoom', url));
  if (map) {
    return map.getLatLonZoom(url);
  }
}

//------------ replace below here -------------

function bboxToLatLonZoom(minlon, minlat, maxlon, maxlat) {
  const lon = (Number(minlon) + Number(maxlon)) / 2.0;
  const lat = (Number(minlat) + Number(maxlat)) / 2.0;
  const part = (Number(maxlat) - Number(minlat)) / 360.0;
  const height = screen.availHeight;
  const tile_part = part * 256 / height;
  const zoom = Math.log(tile_part) / Math.log(0.5); //0.5^zoom=part
  return [lat, lon, zoom];

}
// -180 < lon < 180
function normalizeLon(lon) {
  return ((((Number(lon) + 180) % 360) + 360) % 360) - 180;
}


function latLonZoomToBbox(lat, lon, zoom) {
  const tile_part = Math.pow(0.5, zoom);
  const part = tile_part * screen.availHeight / 256;
  const minlon = Number(lon) - 360 * part / 2;
  const maxlon = Number(lon) + 360 * part / 2;
  const minlat = Number(lat) - 180 * part / 2;
  const maxlat = Number(lat) + 180 * part / 2;
  return [minlon, minlat, maxlon, maxlat];

}

const MAIN_CATEGORY = "Main maps";
const UTILITY_CATEGORY = "Utilities";
const OTHER_CATEGORY = "Other maps";
const SPECIAL_CATEGORY = "Specials";
const LOCAL_CATEGORY = "Local maps";
const OSM_LOCAL_CATEGORY = "OSM local chapter";
const APP_CATEGORY = "External App";
const PORTAL_CATEGORY = "Map portal";

const maps = [
	{
	  name: "Google Maps",
	  category: MAIN_CATEGORY,
	  default_check: true,
	  domain: "www.google.com",
	  getUrl(lat, lon, zoom) {
		return 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + 'z';
	  },
	  getLatLonZoom(url) {
		let match;
		if (match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/)) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		} else if (match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)[m]/)) {
		  let [, lat, lon, zoom] = match;
		  zoom = Math.round(-1.4436 * Math.log(zoom) + 26.871);
		  return [lat, lon, zoom];
		} else if (match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),([0-9]*)[a],[0-9.]*y/)) {
		  let [, lat, lon, zoom] = match;
		  zoom = Math.round(-1.44 * Math.log(zoom) + 27.5);
		  return [lat, lon, zoom];
		}
  
	  },
	},
	{
	  name: "Google Street View",
	  category: MAIN_CATEGORY,
	  default_check: false,
	  domain: "www.google.com",
	  getUrl(lat, lon, zoom) {
		return `https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=${lat},${lon}`;
	  },
	  getLatLonZoom(url) {
		let match;
		if (match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/)) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		} else if (match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)[m]/)) {
		  let [, lat, lon, zoom] = match;
		  zoom = Math.round(-1.4436 * Math.log(zoom) + 26.871);
		  return [lat, lon, zoom];
		} else if (match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),([0-9]*)[a],[0-9.]*y/)) {
		  let [, lat, lon, zoom] = match;
		  zoom = Math.round(-1.44 * Math.log(zoom) + 27.5);
		  return [lat, lon, zoom];
		}
  
	  },
	},
  
  
  
	{
	  name: "OpenStreetMap",
	  category: MAIN_CATEGORY,
	  default_check: true,
	  domain: "www.openstreetmap.org",
	  getUrl(lat, lon, zoom) {
		return 'https://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.openstreetmap\.org.*map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "Mapillary",
	  category: MAIN_CATEGORY,
	  default_check: true,
	  domain: "www.mapillary.com",
	  description: "Crowdsourced street-level imagery available as CC BY-SA",
	  getUrl(lat, lon, zoom) {
		return 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.mapillary\.com.*lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)&z=(\d{1,2})/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "地理院地図",
	  category: MAIN_CATEGORY,
	  default_check: true,
	  domain: "maps.gsi.go.jp",
	  description: "Japanese official map",
	  getUrl(lat, lon, zoom) {
		return 'https://maps.gsi.go.jp/#' + zoom + '/' + lat + '/' + lon + '/';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/maps\.gsi\.go\.jp.*#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
	{
	  //https://kartaview.org/map/@36.039955287882236,139.62856504534716,8z
	  name: "KartaView",
	  category: MAIN_CATEGORY,
	  default_check: false,
	  domain: "kartaview.org",
	  description: "Crowdsourced street-level imagery available as CC BY-SA",
	  getUrl(lat, lon, zoom) {
		return `https://kartaview.org/map/@${lat},${lon},${zoom}z`
	  },
	  getLatLonZoom(url) {
		const match = url.match(/kartaview\.org.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "F4map",
	  category: MAIN_CATEGORY,
	  default_check: true,
	  domain: "f4map.com",
	  description: "Dynamic 3D map",
	  getUrl(lat, lon, zoom) {
		return 'https://demo.f4map.com/#lat=' + lat + '&lon=' + lon + '&zoom=' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/demo\.f4map\.com.*#lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&zoom=(\d{1,2})/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "Yandex",
	  category: MAIN_CATEGORY,
	  default_check: true,
	  domain: "yandex.com",
	  getUrl(lat, lon, zoom) {
		return 'https://yandex.com/maps/?ll=' + lon + '%2C' + lat + '&z=' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/yandex.*maps.*ll=(-?\d[0-9.]*)%2C(-?\d[0-9.]*)&z=(\d{1,2})/);
		if (match) {
		  const [, lon, lat, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "Qwant Maps",
	  category: MAIN_CATEGORY,
	  default_check: true,
	  domain: "qwant.com",
	  description: "Vector map based on OpenStreetMap data",
	  getUrl(lat, lon, zoom) {
		return 'https://www.qwant.com/maps/#map=' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.qwant\.com.*#map=(\d{1,2})[0-9.]*\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "Bing",
	  category: MAIN_CATEGORY,
	  default_check: true,
	  domain: "www.bing.com",
	  getUrl(lat, lon, zoom) {
		return 'https://www.bing.com/maps?cp=' + lat + '~' + lon + '&lvl=' + zoom;
	  },
  
	},
	{
	  name: "Overpass-turbo",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "overpass-turbo.eu",
	  description: "Power search tool for OpenStreetMap data",
	  getUrl(lat, lon, zoom) {
		return 'http://overpass-turbo.eu/?Q=&C=' + lat + ';' + lon + ';' + zoom;
	  },
	},
	{
	  name: "Osmose",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "osmose.openstreetmap.fr",
	  description: "OpenStreetMap QA tool",
	  getUrl(lat, lon, zoom) {
		return 'http://osmose.openstreetmap.fr/map/#zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/osmose\.openstreetmap\.fr.*#zoom=(\d{1,2})&lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "KeepRight",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "www.keepright.at",
	  description: "OpenStreetMap QA tool",
	  getUrl(lat, lon, zoom) {
		if (Number(zoom) > 18) zoom = 18;
		return 'https://www.keepright.at/report_map.php?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
	  },
	},
	{
	  name: "OSM Inspector",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "tools.geofabrik.de",
	  description: "OpenStreetMap QA tool",
	  getUrl(lat, lon, zoom) {
		if (Number(zoom) > 18) zoom = 18;
		return 'http://tools.geofabrik.de/osmi/?view=geometry&lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
	  },
	},
	{
	  name: "Who did it?",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "simon04.dev.openstreetmap.org",
	  description: "OpenStreetMap QA tool",
	  getUrl(lat, lon, zoom) {
		if (Number(zoom) > 18) zoom = 18;
		if (Number(zoom) < 12) zoom = 12;
		return 'http://simon04.dev.openstreetmap.org/whodidit/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
	  },
	},
	{
	  name: "Map compare",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "tools.geofabrik.de",
	  description: "Compare maps side-by-side",
	  getUrl(lat, lon, zoom) {
		return 'http://tools.geofabrik.de/mc/#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/tools\.geofabrik\.de\/mc\/#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "Multimapas",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "javier.jimenezshaw.com",
	  description: "Compare maps by overlay",
	  getUrl(lat, lon, zoom) {
		return 'http://javier.jimenezshaw.com/mapas/mapas.html?z=' + zoom + '&c=' + lat + ',' + lon;
	  },
	},
	{
	  name: "Ingress Intel map",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "ingress.com",
	  getUrl(lat, lon, zoom) {
		return 'https://intel.ingress.com/intel?ll=' + lat + ',' + lon + '&z=' + zoom;
	  },
	},
	{
	  name: "Waymarked Trails",
	  category: OTHER_CATEGORY,
	  default_check: true,
	  domain: "hiking.waymarkedtrails.org",
	  description: "Show hiking, cycling, ski routes",
	  getUrl(lat, lon, zoom) {
		return 'https://hiking.waymarkedtrails.org/#?map=' + zoom + '!' + lat + '!' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/waymarkedtrails\.org\/#.*\?map=(\d{1,2})!(-?\d[0-9.]*)!(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "BigMap 2",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "osmz.ru",
	  description: "Obtain a composed big map image",
	  getUrl(lat, lon, zoom) {
		return 'http://bigmap.osmz.ru/index.html#map=' + zoom + '/' + lat + '/' + lon;
	  },
	},
	{
	  name: "Pic4Carto",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "pavie.info",
	  description: "OpenStreetMap editor using open street level photos",
	  getUrl(lat, lon, zoom) {
		return 'http://projets.pavie.info/pic4carto/index.html?#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/projets\.pavie\.info\/pic4carto\/index\.html.*#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
  
	{
	  name: "JapanMapCompare",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "mapcompare.jp",
	  description: "Compare maps side-by-side",
	  getUrl(lat, lon, zoom) {
		return 'https://mapcompare.jp/3/' + zoom + '/' + lat + '/' + lon + '/osm/gRoad/mapSatellite';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/mapcompare\.jp\/\d+\/(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	//https://map.yahoo.co.jp/?lat=35.76999&lon=139.41380&zoom=16&maptype=basic
	{
	  name: "Yahoo Map (JP)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "map.yahoo.co.jp",
	  getUrl(lat, lon, zoom) {
		return `https://map.yahoo.co.jp/?lat=${lat}&lon=${lon}&zoom=${zoom}`;
	  },
	  getLatLonZoom(url) {
		  const match = url.match(/lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&zoom=(\d{1,2})/);
		  if (match) {
			const [, lat, lon, zoom] = match;
			return [lat, lon, zoom];
		  }
		},
	},
	{
	  name: "MapFan (JP)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "mapfan.com",
	  getUrl(lat, lon, zoom) {
		return 'https://mapfan.com/map/spots/search?c=' + lat + ',' + lon + ',' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/mapfan\.com\/map\/spots\/search\?c=(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "Mapion (JP)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "www.mapion.co.jp",
	  getUrl(lat, lon, zoom) {
		return 'https://www.mapion.co.jp/m2/' + lat + ',' + lon + ',' + zoom;
	  },
	},
	{
	  name: "OSM.de",
	  category: OSM_LOCAL_CATEGORY,
	  default_check: false,
	  domain: "www.openstreetmap.de",
	  description: "OpenStreetMap German local chapter",
	  getUrl(lat, lon, zoom) {
		return 'https://www.openstreetmap.de/karte.html?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
	  },
	},
	{
	  name: "OSM.ru",
	  category: OSM_LOCAL_CATEGORY,
	  default_check: false,
	  domain: "openstreetmap.ru",
	  description: "OpenStreetMap Russia local chapter",
	  getUrl(lat, lon, zoom) {
		return 'https://openstreetmap.ru/#map=' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/openstreetmap\.ru\/#map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  //https://openstreetmap.jp/#zoom=15&lat=35.66838&lon=139.77208&layers=B000
	  name: "OSM.jp",
	  category: OSM_LOCAL_CATEGORY,
	  default_check: false,
	  domain: "openstreetmap.jp",
	  description: "OpenStreetMap Japan local chapter",
	  getUrl(lat, lon, zoom) {
		return `https://openstreetmap.jp/#zoom=${Math.min(Number(zoom), 19)}&lat=${lat}&lon=${lon}&layers=B000`;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/#zoom=(\d{1,2})&lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "OSM.ch",
	  category: OSM_LOCAL_CATEGORY,
	  default_check: false,
	  domain: "openstreetmap.ch",
	  description: "OpenStreetMap Switzerland local chapter",
	  getUrl(lat, lon, zoom) {
		return 'https://www.openstreetmap.ch/?zoom=' + Math.min(Number(zoom), 18) + '&lat=' + lat + '&lon=' + lon;
	  },
  
	},
  
	{
	  name: "OSM.in",
	  category: OSM_LOCAL_CATEGORY,
	  default_check: false,
	  domain: "openstreetmap.in",
	  description: "OpenStreetMap India local chapter",
	  getUrl(lat, lon, zoom) {
		return 'https://openstreetmap.in/#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/openstreetmap\.in\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		}
	  },
	},
  
	{
	  name: "OSM.cl",
	  category: OSM_LOCAL_CATEGORY,
	  default_check: false,
	  domain: "openstreetmap.cl",
	  description: "OpenStreetMap Chile local chapter",
	  getUrl(lat, lon, zoom) {
		return 'https://www.openstreetmap.cl/#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/openstreetmap\.cl\/#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  let [, zoom, lat, lon] = match;
		  return [lat, normalizeLon(lon), zoom];
		}
	  },
	},
  
	{
	  name: "IGN Géoportail (FR)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "geoportail.gouv.fr",
	  getUrl(lat, lon, zoom) {
		return 'https://www.geoportail.gouv.fr/carte?c=' + lon + ',' + lat + '&z=' + zoom + '&l0=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR.CV::GEOPORTAIL:OGC:WMTS(1)&permalink=yes';
	  },
	},
	{
	  name: "Satellite Tracker 3D",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "stdkmd.net",
	  description: "Satellite tracker",
	  getUrl(lat, lon, zoom) {
		const d = Math.round(Math.exp((Number(zoom) - 17.7) / (-1.4)));
		return 'https://stdkmd.net/sat/?cr=' + d + '&lang=en&ll=' + lat + '%2C' + lon;
	  },
  
	},
	{
	  name: "earth",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "earth.nullschool.net",
	  getUrl(lat, lon, zoom) {
		return 'https://earth.nullschool.net/#current/wind/surface/level/orthographic=' + lon + ',' + lat + ',' + 11.1 * zoom ** 3.12;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/earth\.nullschool\.net.*orthographic=(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9]*)/);
		if (match) {
		  let [, lon, lat, zoom] = match;
		  zoom = Math.round((zoom / 11.1) ** (1 / 3.12));
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "Windy.com",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "windy.com",
	  getUrl(lat, lon, zoom) {
		return 'https://www.windy.com/?' + Number(lat).toFixed(3) + ',' + Number(lon).toFixed(3) + ',' + Math.round(zoom) + ',i:pressure';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.windy\.com.*[,\?](-?\d[0-9.]+),(-?\d[0-9.]+),(\d{1,2})/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "flightradar24",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "flightradar24.com",
	  description: "Airplane tracker",
	  getUrl(lat, lon, zoom) {
		return 'https://www.flightradar24.com/' + Math.round(lat * 100) / 100 + ',' + Math.round(lon * 100) / 100 + '/' + Math.round(zoom);
	  },
	  getLatLonZoom(url) {
		const match = url.match(/flightradar24\.com.*\/(-?\d[0-9.]*),(-?\d[0-9.]*)\/(\d{1,2})/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	/*
	{
	  name: "Traze",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "traze.app",
	  description: "Train tracker",
	  getUrl(lat, lon, zoom) {
		return 'https://traze.app/#/@' + lat + ',' + lon + ',' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/traze\.app\/#\/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
		if (match) {
		  let [, lat, lon, zoom] = match;
		  return [lat, lon, Math.round(zoom)];
		}
	  },
  
	},
	*/
  
	{
	  name: "MarineTraffic",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "marinetraffic.com",
	  description: "Ship tracker",
	  getUrl(lat, lon, zoom) {
		return 'https://www.marinetraffic.com/en/ais/home/centerx:' + lon + '/centery:' + lat + '/zoom:' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.marinetraffic\.com.*centerx:(-?\d[0-9.]*)\/centery:(-?\d[0-9.]*)\/zoom:(\d{1,2})/);
		if (match) {
		  const [, lon, lat, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
  
	{
	  name: "CyclOSM",
	  category: OTHER_CATEGORY,
	  default_check: true,
	  domain: "cyclosm.org",
	  getUrl(lat, lon, zoom) {
		return 'https://www.cyclosm.org/#map=' + zoom + '/' + lat + '/' + lon + '/cyclosm';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.cyclosm\.org\/#map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)\/cyclosm/);
		if (match) {
		  let [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "OpenTopoMap",
	  category: OTHER_CATEGORY,
	  default_check: true,
	  domain: "opentopomap.org",
	  getUrl(lat, lon, zoom) {
		return 'https://opentopomap.org/#map=' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/opentopomap\.org\/#map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  let [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "EO Browser",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "sentinel-hub.com",
	  description: "Satellite sensing image viewer",
	  getUrl(lat, lon, zoom) {
		return 'https://apps.sentinel-hub.com/eo-browser/?lat=' + lat + '&lng=' + lon + '&zoom=' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/apps\.sentinel-hub\.com\/eo-browser\/\?lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)&zoom=(\d{1,2})/);
		if (match) {
		  let [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "Macrostrat",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "macrostrat.org",
	  description: "Geological map",
	  getUrl(lat, lon, zoom) {
		return 'https://macrostrat.org/map/#/z=' + zoom + '/x=' + lon + '/y=' + lat + '/bedrock/lines/';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/macrostrat\.org\/map\/#\/z=([0-9.]+)\/x=(-?\d[0-9.]+)\/y=(-?\d[0-9.]+)/);
		if (match) {
		  let [, zoom, lon, lat] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "Old maps online",
	  category: SPECIAL_CATEGORY,
	  default_check: true,
	  domain: "www.oldmapsonline.org",
	  getUrl(lat, lon, zoom) {
		const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
		return 'https://www.oldmapsonline.org/#bbox=' + minlon + ',' + minlat + ',' + maxlon + ',' + maxlat + '&q=&date_from=0&date_to=9999&scale_from=&scale_to=';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.oldmapsonline\.org\/.*#bbox=(-?\d[0-9.]+),(-?\d[0-9.]+),(-?\d[0-9.]+),(-?\d[0-9.]+)/);
		if (match) {
		  let [, minlon, minlat, maxlon, maxlat] = match;
		  let [lat, lon, zoom] = bboxToLatLonZoom(minlon, minlat, maxlon, maxlat);
		  return [lat, lon, zoom];
		}
	  },
	},
  
  
	{
	  name: "uMap",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "umap.openstreetmap.fr",
  
	  getLatLonZoom(url) {
		const match = url.match(/umap\.openstreetmap\.fr.*#(\d[0-9]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "Wikimedia maps",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "wikimedia.org",
	  getUrl(lat, lon, zoom) {
		return 'https://maps.wikimedia.org/#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/maps\.wikimedia\.org\/#(\d[0-9]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  let [, zoom, lat, lon] = match;
		  let lonnumber = Number(lon);
		  if (lonnumber < -180) lonnumber += 360;
		  return [lat, lonnumber, zoom];
		}
	  },
	},
	{
	  name: "OpenTripMap",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "opentripmap.com",
	  getUrl(lat, lon, zoom) {
		return 'https://opentripmap.com/en/#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/opentripmap\.com\/(.*)\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  let [, lang, zoom, lat, lon] = match;
		  zoom = Math.round(Number(zoom));
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "Open Infrastructure Map",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "openinframap.org",
	  getUrl(lat, lon, zoom) {
		return 'https://openinframap.org/#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/openinframap\.org\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  let [, zoom, lat, lon] = match;
		  zoom = Math.round(Number(zoom));
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "OSM Buildings",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "osmbuildings.org",
	  getUrl(lat, lon, zoom) {
		return 'https://osmbuildings.org/?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom + '&tilt=30';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/osmbuildings\.org\/\?lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&zoom=(\d[0-9.]*)/);
		if (match) {
		  let [, lat, lon, zoom] = match;
		  zoom = Math.round(Number(zoom));
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "openrouteservice",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "openrouteservice.org",
	  getUrl(lat, lon, zoom) {
		return 'https://maps.openrouteservice.org/directions?n1=' + lat + '&n2=' + lon + '&n3=' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/maps\.openrouteservice\.org\/directions\?n1=(-?\d[0-9.]*)&n2=(-?\d[0-9.]*)&n3=(\d{1,2})/);
		if (match) {
		  let [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "OpenRailwayMap",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "openrailwaymap.org",
	  getUrl(lat, lon, zoom) {
		return 'https://www.openrailwaymap.org/?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom;
	  },
  
	},
  
	{
	  name: "聖地巡礼マップ",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "seichimap.jp",
	  description: "Anime location search",
	  getUrl(lat, lon, zoom) {
		return 'https://seichimap.jp/spots?order=nearer&lat=' + lat + '&lng=' + lon;
	  },
  
	},
  
	{
	  name: "OpenAerialMap",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "openaerialmap.org",
	  getUrl(lat, lon, zoom) {
		return 'https://map.openaerialmap.org/#/' + lon + ',' + lat + ',' + zoom;
	  },
  
	},
  
	{//https://gbank.gsj.jp/geonavi/geonavi.php#14,35.51047,139.64054
	  name: "地質図Navi (JP)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "gbank.gsj.jp",
	  description: "Geological map in Japan",
	  getUrl(lat, lon, zoom) {
		return 'https://gbank.gsj.jp/geonavi/geonavi.php#' + zoom + ',' + lat + ',' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/gbank\.gsj\.jp\/geonavi\/geonavi\.php#(\d{1,2}),(-?\d[0-9.]*),(-?\d[0-9.]*)/);
		if (match) {
		  let [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "Localwiki",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "localwiki.org",
	  getUrl(lat, lon, zoom) {
  
		const url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=10&addressdetails=1';
		let request = new XMLHttpRequest();
  
		request.open('GET', url, true); //非同期処理
		request.onload = function () {
		  const data = JSON.parse(request.response);
		  const localwiki = 'https://localwiki.org/_search/?q=' + data.display_name;
		  const elem = document.getElementById("Localwiki");
  
		  elem.href = localwiki;
  
		};
		request.send();
		return 'https://localwiki.org/';
  
	  },
  
	},
  
	{
	  name: "Launch JOSM",
	  category: APP_CATEGORY,
	  default_check: false,
	  domain: "josm.openstreetmap.de",
	  description: "OpenStreetMap desktop editor",
	  getUrl(lat, lon, zoom) {
		let z = Number(zoom);
		if (z < 18) z = 18;
		return 'https://www.openstreetmap.org/edit?editor=remote#map=' + z + '/' + lat + '/' + lon;
	  },
  
	},
  
	{
	  name: "Launch iD editor",
	  category: APP_CATEGORY,
	  default_check: false,
	  domain: "ideditor.com",
	  description: "OpenStreetMap online editor",
	  getUrl(lat, lon, zoom) {
		let z = Number(zoom);
		if (z < 18) z = 18;
		return 'https://www.openstreetmap.org/edit?editor=id#map=' + z + '/' + lat + '/' + lon;
	  },
  
	},
  
	{//https://mapwith.ai/rapid#background=fb-mapwithai-maxar&disable_features=boundaries&map=17.60/38.00488/140.85905
	  name: "Launch RapiD editor",
	  category: APP_CATEGORY,
	  default_check: false,
	  domain: "mapwith.ai",
	  description: "Facebook AI assisted OSM editor",
	  getUrl(lat, lon, zoom) {
		return 'https://mapwith.ai/rapid#background=fb-mapwithai-maxar&disable_features=boundaries&map=' + zoom + '/' + lat + '/' + lon;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/mapwith\.ai\/rapid.*&map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
  
  
  
	{
	  name: "Apple maps (for Apple device)",
	  category: APP_CATEGORY,
	  default_check: false,
	  domain: "apple.com",
	  getUrl(lat, lon, zoom) {
		return 'http://maps.apple.com/?ll=' + lat + ',' + lon + '&z=' + zoom;
	  },
  
	},
  
  
	{
	  name: "mapbox Cartogram",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "mapbox.com",
	  description: "Create colorful map from your photo",
	  getUrl(lat, lon, zoom) {
		return 'https://apps.mapbox.com/cartogram/#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/apps\.mapbox\.com\/cartogram\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  let [, zoom, lat, lon] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
  
	{
	  name: "waze",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "waze.com",
	  description: "Crowdsourced route navigation map",
	  getUrl(lat, lon, zoom) {
		return 'https://www.waze.com/ul?ll=' + lat + '%2C' + lon + '&navigate=yes&zoom=' + zoom;
	  },
  
	},
	{
	  name: "Launch waze map editor",
	  category: APP_CATEGORY,
	  default_check: false,
	  domain: "waze.com",
	  getUrl(lat, lon, zoom) {
		return 'https://www.waze.com/editor?lon=' + lon + '&lat=' + lat + '&zoom=7';
	  },
  
	},
	{
	  name: "map.orhyginal",
	  category: PORTAL_CATEGORY,
	  default_check: false,
	  domain: "orhyginal.fr",
	  description: "Portal of many map services",
	  getUrl(lat, lon, zoom) {
		return 'http://map.orhyginal.fr/#' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/map\.orhyginal\.fr.*#(\d[0-9]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "here maps",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "here.com",
	  getUrl(lat, lon, zoom) {
		return 'https://wego.here.com/?map=' + lat + ',' + lon + ',' + zoom + ',normal';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/wego\.here\.com\/\?map=(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "wikimapia",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "wikimapia.org",
	  getUrl(lat, lon, zoom) {
		return 'https://wikimapia.org/#lat=' + lat + '&lon=' + lon + '&z=' + zoom;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/wikimapia\.org\/#.*&lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&z=(\d{1,2})/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "Copernix",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "copernix.io",
	  description: "Show POIs from Wikipedia",
	  getUrl(lat, lon, zoom) {
		return 'https://copernix.io/#?where=' + lon + ',' + lat + ',' + zoom + '&?query=&?map_type=roadmap';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/copernix\.io\/#\?where=(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
		if (match) {
		  const [, lon, lat, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "Zoom Earth",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "zoom.earth",
	  description: "Historic and live satellite images",
	  getUrl(lat, lon, zoom) {
		return 'https://zoom.earth/#view=' + lat + ',' + lon + ',' + zoom + 'z';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/zoom\.earth\/#view=(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})z/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{
	  name: "GeoHack",
	  category: PORTAL_CATEGORY,
	  default_check: false,
	  domain: "wmflabs.org",
	  description: "Map links for Wikipedia articles",
	  getUrl(lat, lon, zoom) {
		//https://www.mediawiki.org/wiki/GeoHack
		return 'https://tools.wmflabs.org/geohack/geohack.php?params=' + lat + '_N_' + lon + '_E_scale:' + Math.round(100000 * Math.pow(2, 12 - Number(zoom)));
	  },
  
	},
  
	{
	  name: "Google Earth",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "earth.google.com",
	  getUrl(lat, lon, zoom) {
		let d = Math.exp((zoom - 27) / (-1.44))
		return 'https://earth.google.com/web/@' + lat + ',' + lon + ',' + d + 'd';
	  },
	  getLatLonZoom(url) {
		let match;
		match = url.match(/earth\.google\.com\/web\/@(-?\d[0-9.]*),(-?\d[0-9.]*),(-?\d[0-9.]*)a,(-?\d[0-9.]*)d/);
		if (match) {
		  let [, lat, lon, , zoom] = match;
		  zoom = Math.round(-1.44 * Math.log(zoom) + 27);
		  return [lat, lon, zoom];
		}
  
	  },
	},
  
	{
	  name: "World Imagery Wayback",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "arcgis.com",
	  description: "Historic satellite images since 2014",
	  getUrl(lat, lon, zoom) {
		const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
		return 'http://livingatlas.arcgis.com/wayback/?ext=' + minlon + ',' + minlat + ',' + maxlon + ',' + maxlat;
	  },
	  getLatLonZoom(url) {
		let match;
		if (match = url.match(/livingatlas\.arcgis\.com\/wayback\/\?ext=(-?\d[0-9.]*),(-?\d[0-9.]*),(-?\d[0-9.]*),(-?\d[0-9.]*)/)) {
		  const [, minlon, minlat, maxlon, maxlat] = match;
		  const [lat, lon, zoom] = bboxToLatLonZoom(minlon, minlat, maxlon, maxlat);
		  return [lat, lon, zoom];
		}
  
	  },
	},
  
	{
	  name: "OpenGeofiction",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "opengeofiction.net",
	  description: "Crowdsoured fictional map",
	  getUrl(lat, lon, zoom) {
		return 'https://opengeofiction.net/#map=' + zoom + '/' + lat + '/' + lon;
	  },
	  getLatLonZoom(url) {
		const match = url.match(/opengeofiction\.net.*map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
  
	{
	  name: "TomTom MyDrive",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "tomtom.com",
	  description: "Traffic map",
	  getUrl(lat, lon, zoom) {
		return 'https://mydrive.tomtom.com/en_gb/#mode=viewport+viewport=' + lat + ',' + lon + ',' + zoom + ',0,-0+ver=3';
	  },
	  getLatLonZoom(url) {
		const match = url.match(/mydrive\.tomtom\.com\/[a-z_]*\/#mode=viewport\+viewport=(-?\d[0-9.]*),(-?\d[0-9.]*),(-?\d[0-9.]*)/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
  
	{
	  name: "Twitter",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "twitter.com",
	  description: "Twitter location based search",
	  getUrl(lat, lon, zoom) {
		return 'https://twitter.com/search?q=geocode%3A' + lat + '%2C' + lon + '%2C5km';
		//5km should be modified based on zoom level
	  },
  
	},
  
	{
	  name: "flickr",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "flickr.com",
	  description: "Geotagged image search",
	  getUrl(lat, lon, zoom) {
		return 'https://www.flickr.com/map?&fLat=' + lat + '&fLon=' + lon + '&zl=' + zoom;
  
	  },
  
	},
  
	{//http://osm-analytics.org/#/show/bbox:136.68676,34.81081,137.11142,34.93364/buildings/recency
	  name: "OpenStreetMap Analytics",
	  category: UTILITY_CATEGORY,
	  default_check: false,
	  domain: "osm-analytics.org",
	  description: "Analyse when/who edited the OSM data in a specific region",
	  getUrl(lat, lon, zoom) {
		[minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
		return 'http://osm-analytics.org/#/show/bbox:' + minlon + ',' + minlat + ',' + maxlon + ',' + maxlat + '/buildings/recency';
  
	  },
  
	},
  
	{//https://firms.modaps.eosdis.nasa.gov/map/#z:9;c:139.9,35.7;d:2020-01-06..2020-01-07
	  name: "FIRMS",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "nasa.gov",
	  description: "Realtime fire information of satellite observation",
	  getUrl(lat, lon, zoom) {
		let z = Number(zoom);
		if (z > 14) z = 14;
		return 'https://firms.modaps.eosdis.nasa.gov/map/#z:' + z + ';c:' + normalizeLon(lon) + ',' + lat;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/firms\.modaps\.eosdis\.nasa\.gov\/map\/#z:(\d{1,2});c:(-?\d[0-9.]*),(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lon, lat] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{//https://www.openstreetbrowser.org/#map=16/35.3512/139.5310
	  name: "OpenStreetBrowser",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "openstreetbrowser.org",
	  description: "OSM POI viewer",
	  getUrl(lat, lon, zoom) {
		return 'https://www.openstreetbrowser.org/#map=' + zoom + '/' + lat + '/' + lon;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.openstreetbrowser\.org\/#map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{//https://map.meurisse.org/?lon=139.642839&lng=139.642839&lat=35.520631&zoom=14
	  name: "Distance calculator",
	  category: UTILITY_CATEGORY,
	  default_check: false,
	  domain: "map.meurisse.org",
	  description: "Distance calculator on OSM map",
	  getUrl(lat, lon, zoom) {
		return 'https://map.meurisse.org/?lon=' + lon + '&lng=' + lon + '&lat=' + lat + '&zoom=' + Math.min(Number(zoom), 18);
  
	  },
  
	},
	{
	  name: "Kontur",
	  category: UTILITY_CATEGORY,
	  default_check: true,
	  domain: "disaster.ninja",
	  description: "The most active OSM contributor",
	  getUrl(lat, lon, zoom) {
		return 'https://disaster.ninja/live/#overlays=bivariate-custom_kontur_openstreetmap_quantity,osm-users;id=GDACS_TC_1000654_2;position=' + lon + ',' + lat + ';zoom=' + zoom;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/disaster\.ninja\/live\/#.*position=(-?\d[0-9.]*),(-?\d[0-9.]*);zoom=(\d{1,2})/);
  
		if (match) {
		  const [, lon, lat, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{//https://en.mapy.cz/zakladni?x=139.7624242&y=35.6819532&z=16
	  name: "MAPY.CZ",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "mapy.cz",
	  description: "",
	  getUrl(lat, lon, zoom) {
		return 'https://en.mapy.cz/zakladni?x=' + lon + '&y=' + lat + '&z=' + zoom;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/mapy\.cz\/zakladni\?x=(-?\d[0-9.]*)&y=(-?\d[0-9.]*)&z=(\d{1,2})/);
  
		if (match) {
		  const [, lon, lat, zoom] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{//https://www.maptiler.com/maps/#streets//vector/12.82/139.62724/35.44413
	  name: "maptiler",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "maptiler.com",
	  description: "vextor map provider",
	  getUrl(lat, lon, zoom) {
		return 'https://www.maptiler.com/maps/#streets//vector/' + zoom + '/' + lon + '/' + lat;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/maptiler.*\/([0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
  
		if (match) {
		  const [, zoom, lon, lat] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
	{//https://gribrouillon.fr/#15/35.4484/139.6179
	  name: "Gribrouillon",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "gribrouillon.fr",
	  description: "Draw on a map and share it",
	  getUrl(lat, lon, zoom) {
		return 'https://gribrouillon.fr/#' + zoom + '/' + lat + '/' + lon;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/gribrouillon\.fr\/.*(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
  
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, zoom];
		}
	  },
	},
	{//https://www.strava.com/heatmap#9.41/139.72884/35.84051/hot/all
	  name: "STRAVA",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "strava.com",
	  description: "Heatmap of athletes activities",
	  getUrl(lat, lon, zoom) {
		return 'https://www.strava.com/heatmap#' + zoom + '/' + lon + '/' + lat + '/hot/all';
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.strava\.com\/heatmap#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lon, lat] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
	{//https://www.peakfinder.org/?lat=46.6052&lng=8.3217&azi=0&zoom=4&ele=1648
	  name: "PeakFinder",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "peakfinder.org",
	  description: "Mountain landscape view map",
	  getUrl(lat, lon, zoom) {
		return 'https://www.peakfinder.org/?lat=' + lat + '&lng=' + lon + '&azi=0&zoom=' + zoom;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/www\.peakfinder\.org\/.*\?lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)&azi=[0-9]*&zoom=(\d[0-9.]*)/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
	{//https://resultmaps.neis-one.org/osm-change-tiles#14/35.6726/139.7576
	  name: "Latest OSM Edits per Tile",
	  category: UTILITY_CATEGORY,
	  default_check: false,
	  domain: "neis-one.org",
	  description: "Latest OpenStreetMap Edits per Tile",
	  getUrl(lat, lon, zoom) {
		return 'https://resultmaps.neis-one.org/osm-change-tiles#' + zoom + '/' + lat + '/' + lon;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/resultmaps\.neis-one\.org\/osm-change-tiles#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
	{//https://www.viamichelin.com/web/maps?position=35;135.8353;12
	  name: "ViaMichelin",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "viamichelin.com",
	  description: "Michelin Travel map",
	  getUrl(lat, lon, zoom) {
		return 'https://www.viamichelin.com/web/maps?position=' + lat + ';' + lon + ';' + zoom;
  
	  },
  
	},
  
	{//http://map.baidu.com/?latlng=35.6777,139.7588
	  name: "Baidu",
	  category: MAIN_CATEGORY,
	  default_check: false,
	  domain: "map.baidu.com",
  
	  getUrl(lat, lon, zoom) {
		return 'http://map.baidu.com/?latlng=' + lat + ',' + lon;
  
	  },
  
	},
	{//https://osmaps.ordnancesurvey.co.uk/51.39378,0.13892,10
	  name: "Ordnance Survey(UK)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "ordnancesurvey.co.uk",
  
	  getUrl(lat, lon, zoom) {
		return 'https://osmaps.ordnancesurvey.co.uk/' + lat + ',' + lon + ',' + zoom;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/osmaps\.ordnancesurvey\.co\.uk\/(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
  
	{//http://www.opensnowmap.org/?zoom=17&lat=43.08561&lon=141.33047
	  name: "OpenSnowMap",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "opensnowmap.org",
	  description: "Winter sports map",
	  getUrl(lat, lon, zoom) {
		return 'http://www.opensnowmap.org/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
  
	  },
	},
	{//http://www.opencyclemap.org/?zoom=17&lat=43.08561&lon=141.33047
	  name: "OpenCycleMap",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "opencyclemap.org",
	  description: "Cycling map",
	  getUrl(lat, lon, zoom) {
		return 'http://www.opencyclemap.org/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
  
	  },
	},
	{//http://gk.historic.place/historische_objekte/translate/en/index-en.html?zoom=5&lat=50.37522&lon=11.5
	  name: "Historic Place",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "gk.historic.place",
	  description: "Historic objects",
	  getUrl(lat, lon, zoom) {
		return 'http://gk.historic.place/historische_objekte/translate/en/index-en.html?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
  
	  },
	},
	{//http://ktgis.net/kjmapw/kjmapw.html?lat=35.680202&lng=139.758840&zoom=14
	  name: "今昔マップ(JP)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "ktgis.net",
	  description: "Historic map compare in Japan",
	  getUrl(lat, lon, zoom) {
		return 'http://ktgis.net/kjmapw/kjmapw.html?lat=' + lat + '&lng=' + lon + '&zoom=' + zoom;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/ktgis\.net\/kjmapw\/kjmapw\.html\?lat=(-?\d[0-9.]*)\&lng=(-?\d[0-9.]*)\&zoom=(\d[0-9.]*)/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
	{//https://openstreetmap.org.ar/#8.93/35.5727/139.4429
	  name: "OSM.org.ar",
	  category: OSM_LOCAL_CATEGORY,
	  default_check: false,
	  domain: "openstreetmap.org.ar",
	  description: "",
	  getUrl(lat, lon, zoom) {
		return 'https://openstreetmap.org.ar/#' + zoom + '/' + lat + '/' + lon;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/openstreetmap\.org\.ar\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		if (match) {
		  const [, zoom, lat, lon] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
	{//https://www.yelp.com/search?l=g%3A139.74862972962964%2C35.60176325581224%2C139.64666287171949%2C35.483875357833384
	  name: "yelp",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "yelp.com",
	  description: "Local review",
	  getUrl(lat, lon, zoom) {
		const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
		return 'https://www.yelp.com/search?l=g%3A' + maxlon + '%2C' + maxlat + '%2C' + minlon + '%2C' + minlat;
  
	  },
	},
	{//http://map.openseamap.org/?zoom=6&lat=53.32140&lon=2.86829
	  name: "OpenSeaMap",
	  category: OTHER_CATEGORY,
	  default_check: false,
	  domain: "openseamap.org",
	  description: "",
	  getUrl(lat, lon, zoom) {
		return 'http://map.openseamap.org/?zoom=' + Math.min(Number(zoom), 18) + '&lat=' + lat + '&lon=' + lon;
  
	  },
	},
	{//https://disaportal.gsi.go.jp/maps/index.html?ll=35.371135,138.713379&z=5
	  name: "重ねるハザードマップ(JP)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "gsi.go.jp",
	  description: "Hazard map in Japan",
	  getUrl(lat, lon, zoom) {
		return 'https://disaportal.gsi.go.jp/maps/index.html?ll=' + lat + ',' + lon + '&z=' + Math.min(Number(zoom), 18);
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/disaportal\.gsi\.go\.jp\/maps\/index.html\?ll=(-?\d[0-9.]*),(-?\d[0-9.]*)\&z=(\d[0-9.]*)/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
	{//https://mapps.gsi.go.jp/history.html#ll=35.6936743,139.4884086&z=15&target=t25000
	  name: "地形図・地勢図図歴(JP)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "gsi.go.jp",
	  description: "Historic topo map in Japan",
	  getUrl(lat, lon, zoom) {
		return 'https://mapps.gsi.go.jp/history.html#ll=' + lat + ',' + lon + '&z=' + Math.min(Number(zoom), 15);
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/mapps\.gsi\.go\.jp\/history\.html#ll=(-?\d[0-9.]*),(-?\d[0-9.]*)&z=(\d[0-9.]*)/);
		if (match) {
		  const [, lat, lon, zoom] = match;
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
	},
  
	{//https://earthquake.usgs.gov/earthquakes/map/#{"autoUpdate":["autoUpdate"],"basemap":"grayscale","feed":"1day_m25","listFormat":"default","mapposition":[[32.2313896627376,126.71630859375],[40.421860362045194,143.27270507812497]],"overlays":["plates"],"restrictListToMap":["restrictListToMap"],"search":null,"sort":"newest","timezone":"utc","viewModes":["settings","map"],"event":null}
	  name: "USGS earthquakes",
	  category: SPECIAL_CATEGORY,
	  default_check: false,
	  domain: "usgs.gov",
	  description: "Latest earthquakes",
	  getUrl(lat, lon, zoom) {
		const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
		const url = 'https://earthquake.usgs.gov/earthquakes/map/#{"autoUpdate":["autoUpdate"],"basemap":"grayscale","feed":"1day_m25","listFormat":"default","mapposition":[[' + minlat + ',' + minlon + '],[' + maxlat + ',' + maxlon + ']],"overlays":["plates"],"restrictListToMap":["restrictListToMap"],"search":null,"sort":"newest","timezone":"utc","viewModes":["settings","map"],"event":null}';
		return encodeURI(url);
  
	  },
  
	  getLatLonZoom(url) {
		const decoded = decodeURI(url);
		const match1 = decoded.match(/\"mapposition\"%3A\[\[(-?\d[0-9.]*)%2C(-?\d[0-9.]*)\]%2C\[(-?\d[0-9.]*)%2C(-?\d[0-9.]*)\]\]/);
		const match2 = decoded.match(/\"mapposition\":\[\[(-?\d[0-9.]*),(-?\d[0-9.]*)\],\[(-?\d[0-9.]*),(-?\d[0-9.]*)\]\]/);
		let match = false;
		if (match1) match = match1;
		if (match2) match = match2;
		if (match) {
		  const [, minlat, minlon, maxlat, maxlon] = match;
		  const [lat, lon, zoom] = bboxToLatLonZoom(minlon, minlat, maxlon, maxlat);
		  return [lat, lon, Math.round(Number(zoom))];
		}
	  },
  
	},
	{//https://2gis.ru/?m=138.383832%2C42.890091%2F6
	  name: "2gis(RU)",
	  category: LOCAL_CATEGORY,
	  default_check: false,
	  domain: "2gis.com",
	  description: "Russia and some Europe map",
	  getUrl(lat, lon, zoom) {
		return `https://2gis.ru/?m=${lon}%2C${lat}%2F${zoom}`;
  
	  },
	  getLatLonZoom(url) {
		const match = url.match(/2gis.*\?m=(-?\d[0-9.]*)%2C(-?\d[0-9.]*)%2F(\d[0-9.]*)/);
		if (match) {
		  const [, lon, lat, zoom] = match;
		  return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		}
	  },
	},
  
	  { //https://www.openhistoricalmap.org/#map=10/35.6149/139.2593&layers=O
		name: "OpenHistoricalMap",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "openhistoricalmap.org",
		description: "Crowedsourced Historical map",
		getUrl(lat, lon, zoom) {
		  return `https://www.openhistoricalmap.org/#map=${zoom}/${lat}/${lon}&layers=O`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/www\.openhistoricalmap\.org\/#map=(-?\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  { //https://armd-02.github.io/mapmaker/#12.5/35.7059/139.7616
		name: "Walking Town Map Maker",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "github.io",
		description: "Create a customized map",
		getUrl(lat, lon, zoom) {
		  return `https://armd-02.github.io/mapmaker/#${zoom}/${lat}/${lon}`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/armd-02\.github\.io\/mapmaker\/#(-?\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  { //http://qa.poole.ch/?zoom=13&lat=35.42723&lon=139.58851
		name: "qa.poole.ch",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "poole.ch",
		description: "Streets with no names",
		getUrl(lat, lon, zoom) {
		  return `http://qa.poole.ch/?zoom=${zoom}&lat=${lat}&lon=${lon}`;
  
		},
	  },
	  { //http://www.xn--pnvkarte-m4a.de/?#139.781;35.4722;10
		name: "ÖPNVKarte",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "xn--pnvkarte-m4a.de",
		description: "Public transport map",
		getUrl(lat, lon, zoom) {
		  return `http://www.xn--pnvkarte-m4a.de/?#${lon};${lat};${zoom}`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/www\.xn--pnvkarte-m4a\.de\/\?#(-?\d[0-9.]*);(-?\d[0-9.]*);(-?\d[0-9.]*)/);
		  if (match) {
			const [, lon, lat, zoom] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  { //http://www.lightningmaps.org/#m=oss;t=3;s=0;o=0;b=;ts=0;y=35.5065;x=139.8395;z=10;d=2;dl=2;dc=0;
		name: "LightningMaps.org",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "lightningmaps.org",
		description: "Realtime lightning map",
		getUrl(lat, lon, zoom) {
		  return `http://www.lightningmaps.org/#m=oss;t=3;s=0;o=0;b=;ts=0;y=${lat};x=${lon};z=${Math.min(zoom, 15)};d=2;dl=2;dc=0`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/wwww\.lightningmaps\.org\/(.*)(-?\d[0-9.]*);x=(-?\d[0-9.]*);z=(\d[0-9.]*)/);
		  if (match) {
			const [, dummy, lon, lat, zoom] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  { //https://trailrouter.com/#wps=35.68107,139.76553&ss=&rt=true&td=5000&aus=false&aus2=false&ah=0&ar=true&pga=0.8&im=false
		name: "Trail Router",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "trailrouter.com",
		description: "Green area routing",
		getUrl(lat, lon, zoom) {
		  return `https://trailrouter.com/#wps=${lat},${lon}&ss=&rt=true&td=5000&aus=false&aus2=false&ah=0&ar=true&pga=0.8&im=false`;
  
		},
  
	  },
	  { //https://cmap.dev/#9/36.0757/139.8477
		name: "cmap.dev: リアルタイム被害予測(JP)",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "cmap.dev",
		description: "Realtime disaster damage estimation",
		getUrl(lat, lon, zoom) {
		  return `https://cmap.dev/#${zoom}/${lat}/${lon}`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/cmap\.dev\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  { //http://beacons.schmirler.de/en/world.html#map=11/35.315176983316775/139.7419591178308&layers=OS5&details=18
		name: "Lights of the sea online",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "beacons.schmirler.de",
		description: "Lighthouse map",
		getUrl(lat, lon, zoom) {
		  return `http://beacons.schmirler.de/en/world.html#map=${zoom}/${lat}/${lon}&layers=OS5&details=18`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/beacons\.schmirler\.de\/([a-z]*)\/world\.html#map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, dummy, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  
	  { //https://nakarte.me/#m=9/35.29383/139.30252&l=O
		name: "nakarte",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "nakarte.me",
		description: "Global map with Russian layers",
		getUrl(lat, lon, zoom) {
		  return `https://nakarte.me/#m=${zoom}/${lat}/${lon}&l=O`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/nakarte\.me\/#m=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
  
	  { //https://www.komoot.com/plan/@35.6837927,139.8906326,11z
		name: "komoot",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "komoot.com",
		description: "Route planner for cycling and hiking",
		getUrl(lat, lon, zoom) {
		  return `https://www.komoot.com/plan/@${lat},${lon},${zoom}z`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/komoot\.com\/plan\/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)z/);
		  if (match) {
			const [, lat, lon, zoom] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
		  
	  { //https://tile.openstreetmap.fr/?zoom=7&lat=37.03262&lon=138.14182&layers=B00000000FFFFFF
		name: "osm.fr",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "openstreetmap.fr",
		description: "OSM.fr",
		getUrl(lat, lon, zoom) {
		  return `https://tile.openstreetmap.fr/?zoom=${zoom}&lat=${lat}&lon=${lon}&layers=B00000000FFFFFF`;
  
		},
  
	  },
	  { //https://maps.nls.uk/geo/explore/#zoom=8&lat=35.73020&lon=139.68615&layers=100611144&b=1
		//https://maps.nls.uk/geo/explore/#zoom=17&lat=52.56060&lon=-1.92500&layers=6&b=1
		name: "National Library of Scotland",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "maps.nls.uk",
		description: "National Library of Scotland's historic maps",
		getUrl(lat, lon, zoom) {
		  return `https://maps.nls.uk/geo/explore/#zoom=${zoom}&lat=${lat}&lon=${lon}`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/#zoom=(\d[0-9.]*)&lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
  
	  
	  { //https://maps.qchizu.xyz/#15/35.686773/139.753990/&base=pale&ls=pale%7Cmlit_road2019_bridge_01&disp=11&lcd=mlit_road2019_bridge_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
		name: "全国Q地図：橋梁マップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "maps.qchizu.xyz",
		description: "Bridges in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://maps.qchizu.xyz/#${zoom}/${lat}/${lon}/&base=pale&ls=pale%7Cmlit_road2019_bridge_01&disp=11&lcd=mlit_road2019_bridge_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/qchizu\.xyz\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  { //https://maps.qchizu.xyz/#15/35.686773/139.753990/&base=pale&ls=pale%7Cmlit_road2019_tunnel_01&disp=11&lcd=mlit_road2019_tunnel_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
		name: "全国Q地図：トンネルマップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "maps.qchizu.xyz",
		description: "Tunnels in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://maps.qchizu.xyz/#${zoom}/${lat}/${lon}/&base=pale&ls=pale%7Cmlit_road2019_tunnel_01&disp=11&lcd=mlit_road2019_tunnel_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/qchizu\.xyz\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
  
	  { //https://maps.qchizu.xyz/#15/35.686773/139.753969/&base=pale&ls=pale%7Cmlit_road2019_shed_01&disp=11&lcd=mlit_road2019_shed_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
		name: "全国Q地図：シェッドマップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "maps.qchizu.xyz",
		description: "Sheds in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://maps.qchizu.xyz/#${zoom}/${lat}/${lon}/&base=pale&ls=pale%7Cmlit_road2019_shed_01&disp=11&lcd=mlit_road2019_shed_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/qchizu\.xyz\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  
	  { //https://maps.qchizu.xyz/#14/35.682294/139.766135/&base=pale&ls=pale%7Cmlit_road2019_culvert_01&disp=11&lcd=mlit_road2019_culvert_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
		name: "全国Q地図：カルバートマップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "maps.qchizu.xyz",
		description: "Culverts in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://maps.qchizu.xyz/#${zoom}/${lat}/${lon}/&base=pale&ls=pale%7Cmlit_road2019_culvert_01&disp=11&lcd=mlit_road2019_culvert_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/qchizu\.xyz\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  
	  { //https://maps.qchizu.xyz/#14/35.682294/139.766135/&base=pale&ls=pale%7Cmlit_road2019_footbridge_01&disp=11&lcd=mlit_road2019_footbridge_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
		name: "全国Q地図：横断歩道橋マップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "maps.qchizu.xyz",
		description: "Foot bridges in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://maps.qchizu.xyz/#${zoom}/${lat}/${lon}/&base=pale&ls=pale%7Cmlit_road2019_footbridge_01&disp=11&lcd=mlit_road2019_footbridge_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/qchizu\.xyz\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  
	  { //https://maps.qchizu.xyz/#15/35.685692/139.756329/&base=pale&ls=pale%7Cmlit_road2019_sign_01&disp=11&lcd=mlit_road2019_sign_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
		name: "全国Q地図：門型標識等マップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "maps.qchizu.xyz",
		description: "Road signs in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://maps.qchizu.xyz/#${zoom}/${lat}/${lon}/&base=pale&ls=pale%7Cmlit_road2019_sign_01&disp=11&lcd=mlit_road2019_sign_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/qchizu\.xyz\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  
	  { //https://maps.qchizu.xyz/#15/35.685692/139.756329/&base=pale&ls=pale%7Cmaff-pond20200925-1&disp=11&lcd=maff-pond20200925-1&vs=c1j0h0k0l0u0t0z0r0s0m0f1
		name: "全国Q地図：農業用ため池マップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "maps.qchizu.xyz",
		description: "Ponds in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://maps.qchizu.xyz/#${zoom}/${lat}/${lon}/&base=pale&ls=pale%7Cmaff-pond20200925-1&disp=11&lcd=maff-pond20200925-1&vs=c1j0h0k0l0u0t0z0r0s0m0f1`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/qchizu\.xyz\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  { //https://dammaps.jp/?ll=36.181776,139.708654&z=10
		name: "DamMaps(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "dammaps.jp",
		description: "Dams in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://dammaps.jp/?ll=${lat},${lon}&z=${Math.min(Number(zoom), 19)}`;
  
		},
  
	  },
			  
	  { //https://www.river.go.jp/kawabou/pc/tm?zm=15&clat=35.545950195567315&clon=139.64511394500735
		name: "川の防災情報(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "www.river.go.jp",
		description: "Information on river disasters in Japan",
		getUrl(lat, lon, zoom) {
		  return `https://www.river.go.jp/kawabou/pc/tm?zm=${Math.min(Number(zoom), 18)}&clat=${lat}&clon=${lon}`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/zm=(\d[0-9.]*)&clat=(-?\d[0-9.]*)&clon=(-?\d[0-9.]*)/);
		  if (match) {
			const [, zoom, lat, lon] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
  
				
	  { //https://plateauview.jp/#start={"initSources":[{"initialCamera":{"west":139.6,"south":35.6,"east":139.7,"north":35.7}}]}
		name: "PLATEAU(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "plateauview.jp",
		description: "3D City models in Japan",
		getUrl(lat, lon, zoom) {
		  const [west, south, east, north] = latLonZoomToBbox(lat, lon, zoom);
		  const params = `{"initSources":[{"initialCamera":{"west":${west},"south":${south},"east":${east},"north":${north}}}]}`;
		  const encoded = encodeURI(params);
		  url = `https://plateauview.jp/#start=${encoded}`;
		  return url;
  
		},
  
	  },
  ];
  
