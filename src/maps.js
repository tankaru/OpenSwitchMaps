const _ = require('lodash');

const MAIN_CATEGORY = "Main maps";
const UTILITY_CATEGORY = "Utilities";
const OTHER_CATEGORY = "Other maps";

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

function bboxToLatLonZoom(minlon, minlat, maxlon, maxlat) {
	const lon = (Number(minlon) + Number(maxlon))/2.0;
	const lat = (Number(minlat) + Number(maxlat))/2.0;
	const part = (Number(maxlat) - Number(minlat))/360.0;
	const zoom = Math.log(part)/Math.log(0.5); //0.5^zoom=part
	return [lat, lon, zoom];

}

function latLonZoomToBbox(lat, lon, zoom) {
	const part = Math.pow(0.5,zoom);
	const minlon = Number(lon) - 360*part/2;
	const maxlon = Number(lon) + 360*part/2;
	const minlat = Number(lat) - 180*part/2;
	const maxlat = Number(lat) + 180*part/2;
	return [minlon, minlat, maxlon, maxlat];

}



const maps = [{
    name: "Google Maps",
    category: MAIN_CATEGORY,
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
    name: "OpenStreetMap",
    category: MAIN_CATEGORY,
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
    domain: "www.mapillary.com",
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
    domain: "maps.gsi.go.jp",
    getUrl(lat, lon, zoom) {
      return 'https://maps.gsi.go.jp/#' + zoom + '/' + lat + '/' + lon + '/';
    },
    getLatLonZoom(url) {
      const match = url.match(/maps\.gsi\.go\.jp.*#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      if (match) {
        const [, zoom, lat, lon] = match;
        return [lat, lon, zoom];
      }
    },
  },
  {
    name: "OpenStreetCam",
    category: MAIN_CATEGORY,
    domain: "openstreetcam.org",
    getUrl(lat, lon, zoom) {
      return 'https://openstreetcam.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
    },
    getLatLonZoom(url) {
      const match = url.match(/openstreetcam\.org.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
      if (match) {
        const [, lat, lon, zoom] = match;
        return [lat, lon, zoom];
      }
    },
  },
  {
    name: "F4map",
    category: MAIN_CATEGORY,
    domain: "f4map.com",
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
    domain: "qwant.com",
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
    domain: "www.bing.com",
    getUrl(lat, lon, zoom) {
      return 'https://www.bing.com/maps?cp=' + lat + '~' + lon + '&lvl=' + zoom;
    },
  },
  {
    name: "Overpass-turbo",
    category: UTILITY_CATEGORY,
    domain: "overpass-turbo.eu",
    getUrl(lat, lon, zoom) {
      return 'http://overpass-turbo.eu/?Q=&C=' + lat + ';' + lon + ';' + zoom;
    },
  },
  {
    name: "Osmose",
    category: UTILITY_CATEGORY,
    domain: "osmose.openstreetmap.fr",
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
    domain: "www.keepright.at",
    getUrl(lat, lon, zoom) {
      if (Number(zoom) > 18) zoom = 18;
      return 'https://www.keepright.at/report_map.php?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  {
    name: "OSM Inspector",
    category: UTILITY_CATEGORY,
    domain: "tools.geofabrik.de",
    getUrl(lat, lon, zoom) {
      if (Number(zoom) > 18) zoom = 18;
      return 'http://tools.geofabrik.de/osmi/?view=geometry&lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
    },
  },
  {
    name: "Who did it?",
    category: UTILITY_CATEGORY,
    domain: "simon04.dev.openstreetmap.org",
    getUrl(lat, lon, zoom) {
      if (Number(zoom) > 18) zoom = 18;
      if (Number(zoom) < 12) zoom = 12;
      return 'http://simon04.dev.openstreetmap.org/whodidit/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  {
    name: "Map compare",
    category: UTILITY_CATEGORY,
    domain: "tools.geofabrik.de",
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
    domain: "javier.jimenezshaw.com",
    getUrl(lat, lon, zoom) {
      return 'http://javier.jimenezshaw.com/mapas/mapas.html?z=' + zoom + '&c=' + lat + ',' + lon;
    },
  },
  {
    name: "Waymarked Trails",
    category: UTILITY_CATEGORY,
    domain: "hiking.waymarkedtrails.org",
    getUrl(lat, lon, zoom) {
      return 'https://hiking.waymarkedtrails.org/#?map=' + zoom + '!' + lat + '!' + lon;
    },
    getLatLonZoom(url) {
      const match = url.match(/waymarkedtrails\.org.*#\?map=(\d{1,2})!(-?\d[0-9.]*)!(-?\d[0-9.]*)/);
      if (match) {
        const [, zoom, lat, lon] = match;
        return [lat, lon, zoom];
      }
    },
  },
  {
    name: "BigMap 2",
    category: UTILITY_CATEGORY,
    domain: "osmz.ru",
    getUrl(lat, lon, zoom) {
      return 'http://bigmap.osmz.ru/index.html#map=' + zoom + '/' + lat + '/' + lon;
    },
  },
  {
    name: "Pic4Carto",
    category: UTILITY_CATEGORY,
    domain: "pavie.info",
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
    domain: "mapcompare.jp",
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

  {
    name: "Yahoo Map JP",
    category: OTHER_CATEGORY,
    domain: "map.yahoo.co.jp",
    getUrl(lat, lon, zoom) {
      return 'https://map.yahoo.co.jp/maps?lat=' + lat + '&lon=' + lon + '&z=' + zoom;
    },
  },
  {
    name: "MapFan",
    category: OTHER_CATEGORY,
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
    name: "Mapion",
    category: OTHER_CATEGORY,
    domain: "www.mapion.co.jp",
    getUrl(lat, lon, zoom) {
      return 'https://www.mapion.co.jp/m2/' + lat + ',' + lon + ',' + zoom;
    },
  },
  {
    name: "OSM.de",
    category: OTHER_CATEGORY,
    domain: "www.openstreetmap.de",
    getUrl(lat, lon, zoom) {
      return 'https://www.openstreetmap.de/karte.html?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  {
    name: "IGN Géoportail (FR)",
    category: OTHER_CATEGORY,
    domain: "geoportail.gouv.fr",
    getUrl(lat, lon, zoom) {
      return 'https://www.geoportail.gouv.fr/carte?c=' + lon + ',' + lat + '&z=' + zoom + '&l0=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR.CV::GEOPORTAIL:OGC:WMTS(1)&permalink=yes';
    },
  },
  {
    name: "Ingress Intel map",
    category: OTHER_CATEGORY,
    domain: "intel.ingress.com",
    getUrl(lat, lon, zoom) {
      return 'https://intel.ingress.com/intel?ll=' + lat + ',' + lon + '&z=' + zoom;
    },
  },
  {
    name: "flightradar24",
    category: OTHER_CATEGORY,
    domain: "flightradar24.com",
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
  {
    name: "MarineTraffic",
    category: OTHER_CATEGORY,
    domain: "marinetraffic.com",
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
    name: "Windy.com",
    category: OTHER_CATEGORY,
    domain: "windy.com",
    getUrl(lat, lon, zoom) {
      return 'https://www.windy.com/?' + lat + ',' + lon + ',' + Math.round(zoom) + ',i:pressure';
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
    name: "earth",
    category: OTHER_CATEGORY,
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
    name: "CyclOSM",
    category: OTHER_CATEGORY,
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
    category: OTHER_CATEGORY,
    domain: "sentinel-hub.com",
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
    category: OTHER_CATEGORY,
    domain: "macrostrat.org",
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
    category: OTHER_CATEGORY,
    domain: "oldmapsonline.org",
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
    name: "Satellite Tracker 3D",
    category: OTHER_CATEGORY,
    domain: "stdkmd.net",
    getUrl(lat, lon, zoom) {
		const d = Math.round(Math.exp((Number(zoom) - 17.7)/(-1.4)));
      return 'https://stdkmd.net/sat/?cr=' + d + '&lang=en&ll=' + lat + '%2C' + lon ;
    },

  },  
  {
    name: "Traze",
    category: OTHER_CATEGORY,
    domain: "traze.app",
    getUrl(lat, lon, zoom) {
      return 'https://traze.app/#/@' + lat + ',' + lon + ',' + zoom ;
    },
    getLatLonZoom(url) {
      const match = url.match(/traze\.app\/#\/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
      if (match) {
        let [, lat, lon, zoom] = match;
        return [lat, lon, Math.round(zoom)];
      }
    },

  },  
  {//http://osm-analytics.org/#/show/bbox:136.68676,34.81081,137.11142,34.93364/buildings/recency
    name: "OpenStreetMap Analytics",
    category: UTILITY_CATEGORY,
    domain: "osm-analytics.org",
	description: "Analyse when/who edited the OSM data in a specific region",
    getUrl(lat, lon, zoom) {
	  [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
      return 'http://osm-analytics.org/#/show/bbox:' + minlon + ',' + minlat + ',' + maxlon + ',' + maxlat + '/buildings/recency';

    },

  },
/*   {
    //name: "uMap(Exit only)",
    //category: OTHER_CATEGORY,
    //domain: "umap.openstreetmap.fr",

    getLatLonZoom(url) {
      const match = url.match(/umap\.openstreetmap\.fr.*#(\d[0-9]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      if (match) {
        const [, zoom, lat, lon] = match;
        return [lat, lon, zoom];
      }
    },
  },
*/
  /* {
    name: "map.orhyginal",
    category: OTHER_CATEGORY,
    domain: "orhyginal.fr",
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
 */
   {
    name: "... and more maps",
    category: OTHER_CATEGORY,
    //domain: "",
	description: "OpenSwitchMaps web",
    getUrl(lat, lon, zoom) {
		return 'https://tankaru.github.io/OpenSwitchMapsWeb/index.html#dummy://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;

    },

  },
];