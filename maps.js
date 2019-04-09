module.exports = [{
    name: "Google Maps",
    category: "Main maps",
    domain: "www.google.co.jp",
    urlPattern: /google.*maps/,
    getUrl(lat, lon, zoom) {
      return 'https://www.google.co.jp/maps/@' + lat + ',' + lon + ',' + zoom + 'z';
    },
    getLatLonZoom(url) {
      if (url.match(/(google).*(maps).*z/)) {
        const [, lat, lon, zoom] = url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/);
        return [lat, lon, zoom];
      } else if (url.match(/(google).*(maps).*(1e3)/)) {
        let [, lat, lon, zoom] = url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)[.m]/);
        zoom = -1.4436 * Math.log(zoom) + 26.871;
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
    domain: "www.openstreetcam.org",
    urlPattern: /www\.openstreetcam\.org/,
    getUrl(lat, lon, zoom) {
      return 'https://www.openstreetcam.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
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
    getUrl(lat, lon, zoom) {
      return 'http://osmose.openstreetmap.fr/map/#zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
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
    domain: "king.waymarkedtrails.org",
    getUrl(lat, lon, zoom) {
      return 'https://hiking.waymarkedtrails.org/#?map=' + zoom + '!' + lat + '!' + lon;
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
    name: "OSM.de",
    category: "Other maps",
    domain: "www.openstreetmap.de",
    getUrl(lat, lon, zoom) {
      return 'https://www.openstreetmap.de/karte.html?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
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
    name: "Bing",
    category: "Other maps",
    domain: "www.bing.com",
    getUrl(lat, lon, zoom) {
      return 'https://www.bing.com/maps?cp=' + lat + '~' + lon + '&lvl=' + zoom;
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
];
