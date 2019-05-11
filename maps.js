module.exports = [{
    name: "Google Maps",
    category: "Main maps",
    domain: "www.google.com",
    urlPattern: /google.*maps/,
    getUrl(lat, lon, zoom) {
      return 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + 'z';
    },
    getLatLonZoom(url) {

      if (url.match(/google.*maps.*,[0-9.]*z/)) {
		const [, lat, lon, zoom] = url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/);

        return [lat, lon, zoom];
      } else if (url.match(/google.*maps.*m\//)) {
        let [, lat, lon, zoom] = url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)[m]/);
        zoom = Math.round(-1.4436 * Math.log(zoom) + 26.871);
        return [lat, lon, zoom];
      } else if (url.match(/google.*maps.*y,/)) {
        let [, lat, lon, zoom] = url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),([0-9]*)[a]/);
        zoom = Math.round(-1.44 * Math.log(zoom) + 27.5);
        return [lat, lon, zoom];
		}
		
    },
  },
  {
    name: "OpenStreetMap",
    category: "Main maps",
    domain: "www.openstreetmap.org",
    urlPattern: /www\.openstreetmap\.org/,
    getUrl(lat, lon, zoom) {
      return 'https://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;
    },
    getLatLonZoom(url) {
      const [, zoom, lat, lon] = url.match(/map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "Mapillary",
    category: "Main maps",
    domain: "www.mapillary.com",
    urlPattern: /www\.mapillary\.com/,
    getUrl(lat, lon, zoom) {
      return 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom;
    },
    getLatLonZoom(url) {
      const [, lat, lon, zoom] = url.match(/lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)&z=(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "地理院地図",
    category: "Main maps",
    domain: "maps.gsi.go.jp",
    urlPattern: /maps\.gsi\.go\.jp/,
    getUrl(lat, lon, zoom) {
      return 'https://maps.gsi.go.jp/#' + zoom + '/' + lat + '/' + lon + '/';
    },
    getLatLonZoom(url) {
      const [, zoom, lat, lon] = url.match(/#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "OpenStreetCam",
    category: "Main maps",
    domain: "openstreetcam.org",
    urlPattern: /openstreetcam\.org/,
    getUrl(lat, lon, zoom) {
      return 'https://openstreetcam.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
    },
    getLatLonZoom(url) {
      const [, lat, lon, zoom] = url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "F4map",
    category: "Main maps",
    domain: "f4map.com",
    urlPattern: /demo\.f4map\.com/,
    getUrl(lat, lon, zoom) {
      return 'https://demo.f4map.com/#lat=' + lat + '&lon=' + lon + '&zoom=' + zoom;
    },
    getLatLonZoom(url) {
      const [, lat, lon, zoom] = url.match(/#lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&zoom=(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "Yandex",
    category: "Main maps",
    domain: "yandex.com",
    urlPattern: /yandex.*maps/,
    getUrl(lat, lon, zoom) {
      return 'https://yandex.com/maps/?ll=' + lon + '%2C' + lat + '&z=' + zoom;
    },
    getLatLonZoom(url) {
      const [, lon, lat, zoom] = url.match(/ll=(-?\d[0-9.]*)%2C(-?\d[0-9.]*)&z=(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "Qwant Maps",
    category: "Main maps",
    domain: "qwant.com",
    urlPattern: /www\.qwant\.com/,
    getUrl(lat, lon, zoom) {
      return 'https://www.qwant.com/maps/#map=' + zoom + '/' + lat + '/' + lon;
    },
    getLatLonZoom(url) {
      const [, zoom, lat, lon] = url.match(/#map=(\d{1,2})[0-9.]*\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "Overpass-turbo",
    category: "OSM tools",
    domain: "overpass-turbo.eu",
    getUrl(lat, lon, zoom) {
      return 'http://overpass-turbo.eu/?Q=&C=' + lat + ';' + lon + ';' + zoom;
    },
  },
  {
    name: "Osmose",
    category: "OSM tools",
    domain: "osmose.openstreetmap.fr",
    urlPattern: /osmose\.openstreetmap\.fr/,
    getUrl(lat, lon, zoom) {
      return 'http://osmose.openstreetmap.fr/map/#zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
    getLatLonZoom(url) {
      const [, zoom, lat, lon] = url.match(/#zoom=(\d{1,2})&lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "KeepRight",
    category: "OSM tools",
    domain: "www.keepright.at",
    getUrl(lat, lon, zoom) {
      return 'https://www.keepright.at/report_map.php?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  {
    name: "OSM Inspector",
    category: "OSM tools",
    domain: "tools.geofabrik.de",
    getUrl(lat, lon, zoom) {
      return 'http://tools.geofabrik.de/osmi/?view=geometry&lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
    },
  },
  {
    name: "Who did it?",
    category: "OSM tools",
    domain: "simon04.dev.openstreetmap.org",
    getUrl(lat, lon, zoom) {
		if (Number(zoom)>18) zoom = 18;
      return 'http://simon04.dev.openstreetmap.org/whodidit/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  {
    name: "Map compare",
    category: "OSM tools",
    domain: "tools.geofabrik.de",
    getUrl(lat, lon, zoom) {
      return 'http://tools.geofabrik.de/mc/#' + zoom + '/' + lat + '/' + lon;
    },
  },
  {
    name: "Multimapas",
    category: "OSM tools",
    domain: "javier.jimenezshaw.com",
    getUrl(lat, lon, zoom) {
      return 'http://javier.jimenezshaw.com/mapas/mapas.html?z=' + zoom + '&c=' + lat + ',' + lon;
    },
  },
  {
    name: "Waymarked Trails",
    category: "OSM tools",
    domain: "hiking.waymarkedtrails.org",
    getUrl(lat, lon, zoom) {
      return 'https://hiking.waymarkedtrails.org/#?map=' + zoom + '!' + lat + '!' + lon;
    },
  },
   {
    name: "BigMap 2",
    category: "OSM tools",
    domain: "osmz.ru",
    getUrl(lat, lon, zoom) {
      return 'http://bigmap.osmz.ru/index.html#map=' + zoom + '/' + lat + '/' + lon;
    },
  },
 {
    name: "Pic4Carto",
    category: "OSM tools",
    domain: "pavie.info",
    urlPattern: /projets\.pavie\.info\/pic4carto\/index\.html/,
    getUrl(lat, lon, zoom) {
      return 'http://projets.pavie.info/pic4carto/index.html?#' + zoom + '/' + lat + '/' + lon;
    },
    getLatLonZoom(url) {
      const [, zoom, lat, lon] = url.match(/#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "Bing",
    category: "Other maps",
    domain: "www.bing.com",
    getUrl(lat, lon, zoom) {
      return 'https://www.bing.com/maps?cp=' + lat + '~' + lon + '&lvl=' + zoom;
    },
  },
  {
    name: "Yahoo Map JP",
    category: "Other maps",
    domain: "map.yahoo.co.jp",
    getUrl(lat, lon, zoom) {
      return 'https://map.yahoo.co.jp/maps?lat=' + lat + '&lon=' + lon + '&z=' + zoom;
    },
  },
  {
    name: "MapFan",
    category: "Other maps",
    domain: "mapfan.com",
    getUrl(lat, lon, zoom) {
      return 'https://mapfan.com/map/spots/search?c=' + lat + ',' + lon + ',' + zoom;
    },
  },
  {
    name: "Mapion",
    category: "Other maps",
    domain: "www.mapion.co.jp",
    getUrl(lat, lon, zoom) {
      return 'https://www.mapion.co.jp/m2/' + lat + ',' + lon + ',' + zoom;
    },
  },
  {
    name: "OSM.de",
    category: "Other maps",
    domain: "www.openstreetmap.de",
    getUrl(lat, lon, zoom) {
      return 'https://www.openstreetmap.de/karte.html?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  {
    name: "IGN GeoPortal(FR)",
    category: "Other maps",
    domain: "geoportail.gouv.fr",
    getUrl(lat, lon, zoom) {
      return 'https://www.geoportail.gouv.fr/carte?c=' + lon + ',' + lat + '&z=' + zoom + '&l0=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR.CV::GEOPORTAIL:OGC:WMTS(1)&permalink=yes';
    },
  },
  {
    name: "Ingress Intel map",
    category: "Other maps",
    domain: "intel.ingress.com",
    getUrl(lat, lon, zoom) {
      return 'https://intel.ingress.com/intel?ll=' + lat + ',' + lon + '&z=' + zoom;
    },
  },
  {
    name: "flightradar24",
    category: "Other maps",
    domain: "flightradar24.com",
    urlPattern: /www\.flightradar24\.com/,
    getUrl(lat, lon, zoom) {
      return 'https://www.flightradar24.com/' + lat + ',' + lon + '/' + Math.round(zoom);
    },
    getLatLonZoom(url) {
      const [, lat, lon, zoom] = url.match(/(-?\d[0-9.]*),(-?\d[0-9.]*)\/(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "MarineTraffic",
    category: "Other maps",
    domain: "marinetraffic.com",
    urlPattern: /www\.marinetraffic\.com/,
    getUrl(lat, lon, zoom) {
      return 'https://www.marinetraffic.com/en/ais/home/centerx:' + lon + '/centery:' + lat + '/zoom:' + zoom;
    },
    getLatLonZoom(url) {
      const [, lon, lat, zoom] = url.match(/centerx:(-?\d[0-9.]*)\/centery:(-?\d[0-9.]*)\/zoom:(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  {
    name: "Windy.com",
    category: "Other maps",
    domain: "windy.com",
    urlPattern: /www\.windy\.com/,
    getUrl(lat, lon, zoom) {
      return 'https://www.windy.com/?' + lat + ',' + lon + ',' + Math.round(zoom) + ',i:pressure';
    },
    getLatLonZoom(url) {
      const [, lat, lon, zoom] = url.match(/(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
   {
    name: "earth",
    category: "Other maps",
    domain: "earth.nullschool.net",
    urlPattern: /earth\.nullschool\.net/,
    getUrl(lat, lon, zoom) {
      return 'https://earth.nullschool.net/#current/wind/surface/level/orthographic=' + lon + ',' + lat + ',' + 11.1*zoom**3.12;
    },
    getLatLonZoom(url) {
      let [, lon, lat, zoom] = url.match(/orthographic=(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9]*)/);
	  zoom = Math.round((zoom/11.1)**(1/3.12));
      return [lat, lon, zoom];
    },
  },
   {
    name: "map.orhyginal",
    category: "Other maps",
    domain: "orhyginal.fr",
    urlPattern: /map\.orhyginal\.fr/,
    getUrl(lat, lon, zoom) {
      return 'http://map.orhyginal.fr/#' + zoom + '/' + lat + '/' + lon;
    },
    getLatLonZoom(url) {
      const [, zoom, lat, lon] = url.match(/#(\d[0-9]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      return [lat, lon, zoom];
    },
  },
 
];
