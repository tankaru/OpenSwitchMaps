module.exports = {
  google: {
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
  openstreetmap: {
    urlPattern: /www\.openstreetmap\.org/,
    getUrl(lat, lon, zoom) {
      return 'https://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;
    },
    getLatLonZoom(url) {
      const [, zoom, lat, lon] = url.match(/map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      return [lat, lon, zoom];
    },
  },
  mapillary: {
    urlPattern: /www\.mapillary\.com/,
    getUrl(lat, lon, zoom) {
      return 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom;
    },
    getLatLonZoom(url) {
      const [, lat, lon, zoom] = url.match(/lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)&z=(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  openstreetcam: {
    urlPattern: /www\.openstreetcam\.org/,
    getUrl(lat, lon, zoom) {
      return 'https://www.openstreetcam.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
    },
    getLatLonZoom(url) {
      const [, lat, lon, zoom] = url.match(/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  gsimaps: {
    urlPattern: /maps\.gsi\.go\.jp/,
    getUrl(lat, lon, zoom) {
      return 'https://maps.gsi.go.jp/#' + zoom + '/' + lat + '/' + lon + '/';
    },
    getLatLonZoom(url) {
      const [, zoom, lat, lon] = url.match(/#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
      return [lat, lon, zoom];
    },
  },
  yahoo: {
    getUrl(lat, lon, zoom) {
      return 'https://map.yahoo.co.jp/maps?lat=' + lat + '&lon=' + lon + '&z=' + zoom;
    },
  },
  mapfan: {
    getUrl(lat, lon, zoom) {
      return 'https://mapfan.com/map/spots/search?c=' + lat + ',' + lon + ',' + zoom;
    },
  },
  bing: {
    getUrl(lat, lon, zoom) {
      return 'https://www.bing.com/maps?cp=' + lat + '~' + lon + '&lvl=' + zoom;
    },
  },
  overpassturbo: {
    getUrl(lat, lon, zoom) {
      return 'http://overpass-turbo.eu/?Q=&C=' + lat + ';' + lon + ';' + zoom;
    },
  },
  osmose: {
    getUrl(lat, lon, zoom) {
      return 'http://osmose.openstreetmap.fr/map/#zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  whodidit: {
    getUrl(lat, lon, zoom) {
      return 'http://simon04.dev.openstreetmap.org/whodidit/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  mapcompare: {
    getUrl(lat, lon, zoom) {
      return 'http://tools.geofabrik.de/mc/#' + zoom + '/' + lat + '/' + lon;
    },
  },
  multimapas: {
    getUrl(lat, lon, zoom) {
      return 'http://javier.jimenezshaw.com/mapas/mapas.html?z=' + zoom + '&c=' + lat + ',' + lon;
    },
  },
  yandex: {
    urlPattern: /yandex.*maps/,
    getUrl(lat, lon, zoom) {
      return 'https://yandex.com/maps/?ll=' + lon + '%2C' + lat + '&z=' + zoom;
    },
    getLatLonZoom(url) {
      const [, lon, lat, zoom] = url.match(/ll=(-?\d[0-9.]*)%2C(-?\d[0-9.]*)&z=(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  ingress: {
    getUrl(lat, lon, zoom) {
      return 'https://intel.ingress.com/intel?ll=' + lat + ',' + lon + '&z=' + zoom;
    },
  },
  f4map: {
    urlPattern: /demo\.f4map\.com/,
    getUrl(lat, lon, zoom) {
      return 'https://demo.f4map.com/#lat=' + lat + '&lon=' + lon + '&zoom=' + zoom;
    },
    getLatLonZoom(url) {
      const [, lat, lon, zoom] = url.match(/#lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&zoom=(\d{1,2})/);
      return [lat, lon, zoom];
    },
  },
  keepright: {
    getUrl(lat, lon, zoom) {
      return 'https://www.keepright.at/report_map.php?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
  osminspector: {
    getUrl(lat, lon, zoom) {
      return 'http://tools.geofabrik.de/osmi/?view=geometry&lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
    },
  },
  mapion: {
    getUrl(lat, lon, zoom) {
      return 'https://www.mapion.co.jp/m2/' + lat + ',' + lon + ',' + zoom;
    },
  },
  waymarkedtrails: {
    getUrl(lat, lon, zoom) {
      return 'https://hiking.waymarkedtrails.org/#?map=' + zoom + '!' + lat + '!' + lon;
    },
  },
  openstreetmapde: {
    getUrl(lat, lon, zoom) {
      return 'https://www.openstreetmap.de/karte.html?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
    },
  },
};
