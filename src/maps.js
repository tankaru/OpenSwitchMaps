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
		is_gcj_in_china: true,
		getUrl(lat, lon, zoom, extra) {
			
			function Num2DMS(num){
				
				//numは正数
				const d = Math.trunc(num);
				const dec = num - d;
				const m = Math.trunc(dec * 60);
				const sub_dec = dec*60 - m;
				const s = sub_dec * 60;
				//console.log(num, d, dec, m, sub_dec, s);
				return d + '%C2%B0' + m + "'" + s.toFixed(1);
			}

			function LatLon2DMS(lat, lon){
				const num_lat = Number(lat);
				const num_lon = Number(lon);

				let dms_lat = Num2DMS(Math.abs(num_lat)) + '%22' + ((num_lat > 0) ? 'N' : 'S');
				let dms_lon = Num2DMS(Math.abs(num_lon)) + '%22' + ((num_lon > 0) ? 'E' : 'W');
				return `${dms_lat}+${dms_lon}`;
			}
			return `https://www.google.com/maps/${extra && extra.pin_lat ? 'place/' + LatLon2DMS(extra.pin_lat, extra.pin_lon) +'/': ''}@${lat},${lon},${zoom}z`;
		},
		getLatLonZoom(url) {
			let match, lat, lon, zoom;
			if ((match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/))) {
				 [, lat, lon, zoom] = match;
			} else if ((match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)[m]/))) {
				 [, lat, lon, zoom] = match;
				zoom = Math.round(-1.4436 * Math.log(zoom) + 26.871);
			} else if ((match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),([0-9]*)[a],[0-9.]*y/))) {
				 [, lat, lon, zoom] = match;
				zoom = Math.round(-1.44 * Math.log(zoom) + 27.5);
			}
			if (match){
				//pinned map
				//https://www.google.com/maps/place/%E5%8F%B0%E5%8C%97/@25.0484312,121.5016642,15z/data=!4m5!3m4!1s0x3442a9727e339109:0xc34a31ce3a4abecb!8m2!3d25.0480075!4d121.5170613
				/*
				function DMS_str_to_latlon(dms_str){
					const p = dms_str.match(/([0-9]*)%C2%B0([0-9]*)'([0-9.]*)%22(.)\+([0-9]*)%C2%B0([0-9]*)'([0-9.]*)%22(.)/);
					if (p) {
						const lat = ((p[4] == 'N') ? 1 : -1) * (Number(p[1]) + Number(p[2])/60.0 + Number(p[3])/60/60) ;
						const lon = ((p[8] == 'E') ? 1 : -1) * (Number(p[5]) + Number(p[6])/60.0 + Number(p[7])/60/60)  ;
						return [lat,lon];
					} else {

					}
					
				}
				*/
				let pin_match = url.match(/google.*maps\/place\/.*!3d(-?\d[0-9.]*)!4d(-?\d[0-9.]*)/);
				if (pin_match){
					const extra = {
						pin_lat: pin_match[1],
						pin_lon: pin_match[2],
					};
					return [lat, lon, zoom, extra];
				}
				
				//unpinned map
				return [lat, lon, zoom];
			}
		},
	},
	{
		name: "Google Street View",
		category: MAIN_CATEGORY,
		default_check: false,
		domain: "www.google.com",
		is_gcj_in_china: true,
		getUrl(lat, lon, zoom) {
			return `https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=${lat},${lon}`;
		},
		getLatLonZoom(url) {
			let match;
			if ((match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})[.z]/))) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, zoom];
			} else if ((match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)[m]/))) {
				let [, lat, lon, zoom] = match;
				zoom = Math.round(-1.4436 * Math.log(zoom) + 26.871);
				return [lat, lon, zoom];
			} else if ((match = url.match(/google.*maps.*@(-?\d[0-9.]*),(-?\d[0-9.]*),([0-9]*)[a],[0-9.]*y/))) {
				let [, lat, lon, zoom] = match;
				zoom = Math.round(-1.44 * Math.log(zoom) + 27.5);
				return [lat, lon, zoom];
			}
		},
	},

	{ //https://www.openstreetmap.org/changeset/127728858?mlat=35.7220&mlon=139.6376#map=10/35.7220/139.6376
		name: "OpenStreetMap",
		category: MAIN_CATEGORY,
		default_check: true,
		domain: "www.openstreetmap.org",
		getUrl(lat, lon, zoom, extra) {
			return `https://www.openstreetmap.org/${extra && extra.changeset ? 'changeset/' + extra.changeset : ''}${extra && extra.pin_lat ? '?mlat=' + extra.pin_lat : ''}${extra && extra.pin_lon ? '&mlon=' + extra.pin_lon : ''}#map=${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			//for changeset 
			const changeset_match = url.match(/www\.openstreetmap\.org\/changeset\/(\d[0-9.]*)/);
			if (changeset_match) {
				const [, changeset] = changeset_match;
				return [ null, null, null, {changeset}];
			}
			//for pinned map
			const pin_match = url.match(/www\.openstreetmap\.org\/.*mlat=(-?\d[0-9.]*)&mlon=(-?\d[0-9.]*).*map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (pin_match) {
				const [, pin_lat, pin_lon, zoom, lat, lon] = pin_match;
				return [lat, lon, zoom, {pin_lat, pin_lon}];
			}

			//for unpinned map
			const match = url.match(/www\.openstreetmap\.org.*map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
		getChangesetUrl(changeset){
			return `https://www.openstreetmap.org/changeset/${changeset}`;
		}
	},
	{
		name: "Mapillary",
		category: MAIN_CATEGORY,
		default_check: true,
		domain: "www.mapillary.com",
		description: "Crowdsourced street-level imagery available as CC BY-SA",
		getUrl(lat, lon, zoom) {
			return "https://www.mapillary.com/app/?lat=" + lat + "&lng=" + lon + "&z=" + zoom;
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
			return "https://maps.gsi.go.jp/#" + zoom + "/" + lat + "/" + lon + "/";
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
			return `https://kartaview.org/map/@${lat},${lon},${zoom}z`;
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
			return "https://demo.f4map.com/#lat=" + lat + "&lon=" + lon + "&zoom=" + zoom;
		},
		getLatLonZoom(url) {
			const match = url.match(/demo\.f4map\.com.*#lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&zoom=(\d{1,2})/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{ //https://yandex.com/maps/?ll=139.588169%2C35.424138&whatshere%5Bpoint%5D=139.576626%2C35.417882&z=15.8
		name: "Yandex",
		category: MAIN_CATEGORY,
		default_check: true,
		domain: "yandex.com",
		getUrl(lat, lon, zoom, extra) {
			return `https://yandex.com/maps/?ll=${lon}%2C${lat}${extra && extra.pin_lat ? '&whatshere%5Bpoint%5D=' + extra.pin_lon + '%2C' + extra.pin_lat : ''}&z=${zoom}`;
		},
		getLatLonZoom(url) {
			//https://yandex.com/maps/21433/yokohama/?ll=139.579830%2C35.423841&mode=whatshere&whatshere%5Bpoint%5D=139.576626%2C35.417882&whatshere%5Bzoom%5D=null&z=15.6
			const match = url.match(/yandex.*maps.*ll=(-?\d[0-9.]*)%2C(-?\d[0-9.]*).*&z=(\d{1,2})/);
			if (match) {
				const [, lon, lat, zoom] = match;
				const pin_match = url.match(/whatshere%5Bpoint%5D=(-?\d[0-9.]*)%2C(-?\d[0-9.]*)/);
				if (pin_match){
					return [lat, lon, zoom, {pin_lat: pin_match[2], pin_lon: pin_match[1]}];
				}
				return [lat, lon, zoom];
			}
		},
	},

	//https://www.qwant.com/maps/#map=15.76/35.4256258/139.5906212
	//https://www.qwant.com/maps/place/latlon:35.42128:139.57313#map=16.16/35.4229916/139.5795312
	{ 
		name: "Qwant Maps",
		category: MAIN_CATEGORY,
		default_check: true,
		domain: "qwant.com",
		description: "Vector map based on OpenStreetMap data",
		getUrl(lat, lon, zoom, extra) {
			return `https://www.qwant.com/maps/${extra && extra.pin_lat ? 'place/latlon:' + extra.pin_lat + ':' + extra.pin_lon : ''}#map=${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/www\.qwant\.com.*#map=(\d{1,2})[0-9.]*\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				const pin_match = url.match(/latlon:(-?\d[0-9.]*):(-?\d[0-9.]*)/);
				if (pin_match){
					return [lat, lon, zoom, {pin_lat: pin_match[1], pin_lon: pin_match[2]}];
				}
				return [lat, lon, zoom];
			}
		},
	},
	{
		name: "Bing",
		category: MAIN_CATEGORY,
		default_check: true,
		domain: "www.bing.com",
		is_gcj_in_china: true,
		getUrl(lat, lon, zoom, extra) {
			// https://learn.microsoft.com/en-us/bingmaps/articles/create-a-custom-map-url#collections-categories 
			let pin = ''
			if (extra && extra.pin_lat) {
				pin = `&sp=point.${extra.pin_lat}_${extra.pin_lon}` // + `${name}_${note}`;
			}
			return "https://www.bing.com/maps?cp=" + lat + "~" + lon + "&lvl=" + zoom + pin;
		},
		
		getLatLonZoom(url) {
			// https://www.bing.com/maps?osid=7b4e7fbd-4878-44fa-8302-421100f0d920&cp=23.295311~120.807682&lvl=13&v=2&sV=2&form=S00027
			const urlobj = new URL(url);
			const u = new URLSearchParams(urlobj.search);
			const center = u.get('cp');

			if (!center) return;
			const [lat, lon] = center.split('~')
			let zoom = '14';
			if (u.has('lvl')) zoom = u.get('lvl');
			const ret = [lat, lon, zoom];
			
			const pin = u.get('sp');
			if (pin) {
				const scan = pin.match(/point\.([\d.]+)_([\d.]+)/);
				if (scan) ret.push({pin_lat: scan[1], pin_lon: scan[2]});
			}
			return ret;
		}
		
	},
	{
		name: "Overpass-turbo",
		category: UTILITY_CATEGORY,
		default_check: true,
		domain: "overpass-turbo.eu",
		description: "Power search tool for OpenStreetMap data",
		getUrl(lat, lon, zoom) {
			return "http://overpass-turbo.eu/?Q=&C=" + lat + ";" + lon + ";" + zoom;
		},
	},
	{
		name: "Osmose",
		category: UTILITY_CATEGORY,
		default_check: true,
		domain: "osmose.openstreetmap.fr",
		description: "OpenStreetMap QA tool",
		getUrl(lat, lon, zoom) {
			return "http://osmose.openstreetmap.fr/map/#zoom=" + zoom + "&lat=" + lat + "&lon=" + lon;
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
			return "https://www.keepright.at/report_map.php?zoom=" + zoom + "&lat=" + lat + "&lon=" + lon;
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
			return "http://tools.geofabrik.de/osmi/?view=geometry&lon=" + lon + "&lat=" + lat + "&zoom=" + zoom;
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
			return "http://simon04.dev.openstreetmap.org/whodidit/?zoom=" + zoom + "&lat=" + lat + "&lon=" + lon;
		},
	},
	{
		name: "Map compare",
		category: UTILITY_CATEGORY,
		default_check: true,
		domain: "tools.geofabrik.de",
		description: "Compare maps side-by-side",
		getUrl(lat, lon, zoom) {
			return "http://tools.geofabrik.de/mc/#" + zoom + "/" + lat + "/" + lon;
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
		name: "Map compare (BBBike)",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "mc.bbbike.org",
		description: "Compare maps side-by-side",
		getUrl(lat, lon, zoom) {
			return "http://mc.bbbike.org/mc/#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/mc\.bbbike\.org\/mc\/#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
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
			return "http://javier.jimenezshaw.com/mapas/mapas.html?z=" + zoom + "&c=" + lat + "," + lon;
		},
	},

	{
		name: "Ingress Intel map",
		category: SPECIAL_CATEGORY,
		default_check: true,
		domain: "ingress.com",
		getUrl(lat, lon, zoom) {
			return "https://intel.ingress.com/intel?ll=" + lat + "," + lon + "&z=" + zoom;
		},
	},
	{
		name: "Waymarked Trails",
		category: OTHER_CATEGORY,
		default_check: true,
		domain: "hiking.waymarkedtrails.org",
		description: "Show hiking, cycling, ski routes",
		getUrl(lat, lon, zoom) {
			return "https://hiking.waymarkedtrails.org/#?map=" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/waymarkedtrails\.org\/#.*\?map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
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
			return "http://bigmap.osmz.ru/index.html#map=" + zoom + "/" + lat + "/" + lon;
		},
	},
	/* Pic4Carto obsoleted
	{
		name: "Pic4Carto",
		category: UTILITY_CATEGORY,
		default_check: true,
		domain: "pavie.info",
		description: "OpenStreetMap editor using open street level photos",
		getUrl(lat, lon, zoom) {
			return "http://projets.pavie.info/pic4carto/index.html?#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/projets\.pavie\.info\/pic4carto\/index\.html.*#(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	*/

	{
		name: "JapanMapCompare",
		category: UTILITY_CATEGORY,
		default_check: true,
		domain: "mapcompare.jp",
		description: "Compare maps side-by-side",
		getUrl(lat, lon, zoom) {
			return "https://mapcompare.jp/3/" + zoom + "/" + lat + "/" + lon + "/osm/gRoad/mapSatellite";
		},
		getLatLonZoom(url) {
			const match = url.match(/mapcompare\.jp\/\d+\/(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	
	//https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/#5/111.84/47.09
	{
		name: "Tiles à la Google Maps",
		category: UTILITY_CATEGORY,
		default_check: true,
		domain: "maptiler.com",
		description: "Different kind of map tile number in Google Map",
		getUrl(lat, lon, zoom) {
			return "https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/#" + zoom + "/" + lon + "/" + lat;
		},
		getLatLonZoom(url) {
			const match = url.match(/maptiler\.com\/google-maps-coordinates-tile-bounds-projection\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lon, lat] = match;
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
			return "https://mapfan.com/map/spots/search?c=" + lat + "," + lon + "," + zoom;
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
			return "https://www.mapion.co.jp/m2/" + lat + "," + lon + "," + zoom;
		},
	},
	{//https://openstreetmap.de/karte/?zoom=12&lat=35.69527&lon=139.63071&layers=B00TT
		name: "OSM.de",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "www.openstreetmap.de",
		description: "OpenStreetMap German local chapter",
		getUrl(lat, lon, zoom) {
			return "https://www.openstreetmap.de/karte/?zoom=" + zoom + "&lat=" + lat + "&lon=" + lon;
		},
	},
	{
		name: "OSM.ru",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "openstreetmap.ru",
		description: "OpenStreetMap Russia local chapter",
		getUrl(lat, lon, zoom) {
			return "https://openstreetmap.ru/#map=" + zoom + "/" + lat + "/" + lon;
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
		//https://tile.openstreetmap.jp/styles/osm-bright/#12.37/35.66916/139.7817
		name: "OSM.jp",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "openstreetmap.jp",
		description: "OpenStreetMap Japan local chapter",
		getUrl(lat, lon, zoom) {
			return `https://tile.openstreetmap.jp/styles/osm-bright/#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/tile\.openstreetmap\.jp\/.*#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
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
			return "https://www.openstreetmap.ch/?zoom=" + Math.min(Number(zoom), 18) + "&lat=" + lat + "&lon=" + lon;
		},
	},

	{
		name: "OSM.in",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "openstreetmap.in",
		description: "OpenStreetMap India local chapter",
		getUrl(lat, lon, zoom) {
			return "https://openstreetmap.in/#" + zoom + "/" + lat + "/" + lon;
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
		//https://map.osmchina.org/#map=14/35.6806/139.7371
		name: "OSMChina",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "osmchina.org",
		description: "OpenStreetMap China local chapter",
		getUrl(lat, lon, zoom) {
			return "https://map.osmchina.org/#map=" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/osmchina\.org\/#map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},

	{
		name: "osm.kr",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "osm.kr",
		description: "OpenStreetMap Korea local chapter",
		getUrl(lat, lon, zoom) {
			return "https://tiles.osm.kr/#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/osm\.kr\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},

	{
		name: "osm.bzh",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "openstreetmap.bzh",
		description: "OpenStreetMap Breizh local chapter",
		getUrl(lat, lon, zoom) {
			return "https://kartenn.openstreetmap.bzh/#map=" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/openstreetmap\.bzh\/#map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
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
			return "https://www.openstreetmap.cl/#" + zoom + "/" + lat + "/" + lon;
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
			return "https://www.geoportail.gouv.fr/carte?c=" + lon + "," + lat + "&z=" + zoom + "&l0=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR.CV::GEOPORTAIL:OGC:WMTS(1)&permalink=yes";
		},
	},
	{
		name: "Satellite Tracker 3D",
		category: SPECIAL_CATEGORY,
		default_check: true,
		domain: "stdkmd.net",
		description: "Satellite tracker",
		getUrl(lat, lon, zoom) {
			const d = Math.round(Math.exp((Number(zoom) - 17.7) / -1.4));
			return "https://stdkmd.net/sat/?cr=" + d + "&lang=en&ll=" + lat + "%2C" + lon;
		},
	},
	{
		name: "earth",
		category: SPECIAL_CATEGORY,
		default_check: true,
		domain: "earth.nullschool.net",
		getUrl(lat, lon, zoom) {
			return "https://earth.nullschool.net/#current/wind/surface/level/orthographic=" + lon + "," + lat + "," + 11.1 * zoom ** 3.12;
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
			return "https://www.windy.com/?" + Number(lat).toFixed(3) + "," + Number(lon).toFixed(3) + "," + Math.round(zoom) + ",i:pressure";
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
		//https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=35.4157&lon=139.6212&zoom=5
		name: "OpenWeatherMap.org",
		category: SPECIAL_CATEGORY,
		default_check: true,
		domain: "openweathermap.org",
		getUrl(lat, lon, zoom) {
			return `https://openweathermap.org/weathermap?lat=${lat}&lon=${lon}&zoom=${zoom}`;
		},
	},
	{
		name: "flightradar24",
		category: SPECIAL_CATEGORY,
		default_check: true,
		domain: "flightradar24.com",
		description: "Airplane tracker",
		getUrl(lat, lon, zoom) {
			return "https://www.flightradar24.com/" + Math.round(lat * 100) / 100 + "," + Math.round(lon * 100) / 100 + "/" + Math.round(zoom);
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
			return "https://www.marinetraffic.com/en/ais/home/centerx:" + lon + "/centery:" + lat + "/zoom:" + zoom;
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
			return "https://www.cyclosm.org/#map=" + zoom + "/" + lat + "/" + lon + "/cyclosm";
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
			return "https://opentopomap.org/#map=" + zoom + "/" + lat + "/" + lon;
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
			return "https://apps.sentinel-hub.com/eo-browser/?lat=" + lat + "&lng=" + lon + "&zoom=" + zoom;
		},
		getLatLonZoom(url) {
			const match = url.match(/apps\.sentinel-hub\.com\/eo-browser\/\?zoom=(\d{1,2})&lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)/);
			if (match) {
				let [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},

	{//https://macrostrat.org/map/#x=139.835&y=35.886&z=7.44
		name: "Macrostrat",
		category: SPECIAL_CATEGORY,
		default_check: true,
		domain: "macrostrat.org",
		description: "Geological map",
		getUrl(lat, lon, zoom) {
			return `https://macrostrat.org/map/#x=${lon}&y=${lat}&z=${zoom}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/macrostrat\.org\/map\/#x=(-?\d[0-9.]*)&y=(-?\d[0-9.]*)&z=(\d[0-9.]*)/);
			if (match) {
				const [, lon, lat, zoom] = match;
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
			return "https://www.oldmapsonline.org/#bbox=" + minlon + "," + minlat + "," + maxlon + "," + maxlat + "&q=&date_from=0&date_to=9999&scale_from=&scale_to=";
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
			return "https://maps.wikimedia.org/#" + zoom + "/" + lat + "/" + lon;
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
			return "https://opentripmap.com/en/#" + zoom + "/" + lat + "/" + lon;
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
			return "https://openinframap.org/#" + zoom + "/" + lat + "/" + lon;
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
		name: "OpenStationMap",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "openstationmap.org",
		getUrl(lat, lon, zoom) {
			return "https://openstationmap.org/#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/openstationmap\.org\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
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
			return "https://osmbuildings.org/?lat=" + lat + "&lon=" + lon + "&zoom=" + zoom + "&tilt=30";
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
			return "https://maps.openrouteservice.org/directions?n1=" + lat + "&n2=" + lon + "&n3=" + zoom;
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
			return "https://www.openrailwaymap.org/?lat=" + lat + "&lon=" + lon + "&zoom=" + zoom;
		},
	},

	{
		name: "聖地巡礼マップ",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "seichimap.jp",
		description: "Anime location search",
		getUrl(lat, lon, zoom) {
			return "https://seichimap.jp/spots?order=nearer&lat=" + lat + "&lng=" + lon;
		},
	},

	{
		name: "OpenAerialMap",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "openaerialmap.org",
		getUrl(lat, lon, zoom) {
			return "https://map.openaerialmap.org/#/" + lon + "," + lat + "," + zoom;
		},
	},

	{
		//https://gbank.gsj.jp/geonavi/geonavi.php#14,35.51047,139.64054
		name: "地質図Navi (JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "gbank.gsj.jp",
		description: "Geological map in Japan",
		getUrl(lat, lon, zoom) {
			return "https://gbank.gsj.jp/geonavi/geonavi.php#" + zoom + "," + lat + "," + lon;
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
			const url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon + "&zoom=10&addressdetails=1";
			let localwiki = "https://localwiki.org/"
			cacheDb.ajaxCallback(url, function (json) {
				const data = JSON.parse(json);
				localwiki = "https://localwiki.org/_search/?q=" + data.display_name;
				const elem = document.getElementById("a_Localwiki");
				if (elem) elem.href = localwiki;
			});
			return localwiki;
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
			return "https://www.openstreetmap.org/edit?editor=remote#map=" + z + "/" + lat + "/" + lon;
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
			return "https://www.openstreetmap.org/edit?editor=id#map=" + z + "/" + lat + "/" + lon;
		},
	},

	{
		//https://mapwith.ai/rapid#background=fb-mapwithai-maxar&disable_features=boundaries&map=17.60/38.00488/140.85905
		name: "Launch RapiD editor",
		category: APP_CATEGORY,
		default_check: false,
		domain: "mapwith.ai",
		description: "Facebook AI assisted OSM editor",
		getUrl(lat, lon, zoom) {
			return "https://mapwith.ai/rapid#background=fb-mapwithai-maxar&disable_features=boundaries&map=" + zoom + "/" + lat + "/" + lon;
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
			return "http://maps.apple.com/?ll=" + lat + "," + lon + "&z=" + zoom;
		},
	},

	{
		name: "mapbox Cartogram",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "mapbox.com",
		description: "Create colorful map from your photo",
		getUrl(lat, lon, zoom) {
			return "https://apps.mapbox.com/cartogram/#" + zoom + "/" + lat + "/" + lon;
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
			return "https://www.waze.com/ul?ll=" + lat + "%2C" + lon + "&navigate=yes&zoom=" + zoom;
		},
	},
	{
		name: "Launch waze map editor",
		category: APP_CATEGORY,
		default_check: false,
		domain: "waze.com",
		getUrl(lat, lon, zoom) {
			return "https://www.waze.com/editor?lon=" + lon + "&lat=" + lat + "&zoom=7";
		},
	},
	{
		name: "map.orhyginal",
		category: PORTAL_CATEGORY,
		default_check: false,
		domain: "orhyginal.fr",
		description: "Portal of many map services",
		getUrl(lat, lon, zoom) {
			return "http://map.orhyginal.fr/#" + zoom + "/" + lat + "/" + lon;
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
			return "https://wego.here.com/?map=" + lat + "," + lon + "," + zoom + ",normal";
		},
		getLatLonZoom(url) {
			const match = url.match(/.*\.here\.com\/\?map=(-?\d[0-9.]*),(-?\d[0-9.]*),(\d{1,2})/);
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
			return "https://wikimapia.org/#lat=" + lat + "&lon=" + lon + "&z=" + zoom;
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
			return "https://copernix.io/#?where=" + lon + "," + lat + "," + zoom + "&?query=&?map_type=roadmap";
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
			return "https://zoom.earth/#view=" + lat + "," + lon + "," + zoom + "z";
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
			return "https://tools.wmflabs.org/geohack/geohack.php?params=" + lat + "_N_" + lon + "_E_scale:" + Math.round(100000 * Math.pow(2, 12 - Number(zoom)));
		},
	},
	{ //https://geohack.toolforge.org/geohack.php?language=de&params=48.137222222222_N_11.575555555556_E
		name: "GeoHack(local)",
		category: PORTAL_CATEGORY,
		default_check: false,
		domain: "wmflabs.org",
		description: "Map links for Wikipedia articles with lang support",
		getUrl(lat, lon, zoom) {
			return `https://tools.wmflabs.org/geohack/geohack.php?${navigator.language ? 'language='+ navigator.language + '&' : ''}params=${lat}_N_${lon}_E_scale:${Math.round(100000 * Math.pow(2, 12 - Number(zoom)))}`;
		},
	},

	{
		name: "Google Earth",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "earth.google.com",
		getUrl(lat, lon, zoom) {
			let d = Math.exp((zoom - 27) / -1.44);
			return "https://earth.google.com/web/@" + lat + "," + lon + "," + d + "d";
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
		//https://livingatlas.arcgis.com/wayback/#ext=29.37336,59.60122,31.43192,60.27332&active=16245
		name: "World Imagery Wayback",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "arcgis.com",
		description: "Historic satellite images since 2014",
		getUrl(lat, lon, zoom) {
			const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
			return "https://livingatlas.arcgis.com/wayback/#ext=" + minlon + "," + minlat + "," + maxlon + "," + maxlat;
		},
		getLatLonZoom(url) {
			let match;
			if ((match = url.match(/livingatlas\.arcgis\.com\/wayback\/\#ext=(-?\d[0-9.]*),(-?\d[0-9.]*),(-?\d[0-9.]*),(-?\d[0-9.]*)/))) {
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
			return "https://opengeofiction.net/#map=" + zoom + "/" + lat + "/" + lon;
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
			return "https://mydrive.tomtom.com/en_gb/#mode=viewport+viewport=" + lat + "," + lon + "," + zoom + ",0,-0+ver=3";
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
			return "https://twitter.com/search?q=geocode%3A" + lat + "%2C" + lon + "%2C5km";
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
			return "https://www.flickr.com/map?&fLat=" + lat + "&fLon=" + lon + "&zl=" + zoom;
		},
	},

	{
		//http://osm-analytics.org/#/show/bbox:136.68676,34.81081,137.11142,34.93364/buildings/recency
		name: "OpenStreetMap Analytics",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "osm-analytics.org",
		description: "Analyse when/who edited the OSM data in a specific region",
		getUrl(lat, lon, zoom) {
			[minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
			return "http://osm-analytics.org/#/show/bbox:" + minlon + "," + minlat + "," + maxlon + "," + maxlat + "/buildings/recency";
		},
	},

	{

		//https://firms.modaps.eosdis.nasa.gov/map/#t:adv;d:7days;@139.8,35.6,11z
		name: "FIRMS",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "nasa.gov",
		description: "Realtime fire information of satellite observation",
		getUrl(lat, lon, zoom) {
			let z = Number(zoom);
			if (z > 14) z = 14;
			return `https://firms.modaps.eosdis.nasa.gov/map/#t:adv;d:7days;@${lon},${lat},${Math.round(Math.min(Number(zoom), 14))}z`;
		},
		getLatLonZoom(url) {
			const match = url.match(/firms\.modaps\.eosdis\.nasa\.gov\/map\/.*@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)z/);
			if (match) {
				const [,  lon, lat, zoom] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{
		//https://www.openstreetbrowser.org/#map=16/35.3512/139.5310
		name: "OpenStreetBrowser",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "openstreetbrowser.org",
		description: "OSM POI viewer",
		getUrl(lat, lon, zoom) {
			return "https://www.openstreetbrowser.org/#map=" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/www\.openstreetbrowser\.org\/#map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{
		//https://map.meurisse.org/?lon=139.642839&lng=139.642839&lat=35.520631&zoom=14
		name: "Distance calculator",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "map.meurisse.org",
		description: "Distance calculator on OSM map",
		getUrl(lat, lon, zoom) {
			return "https://map.meurisse.org/?lon=" + lon + "&lng=" + lon + "&lat=" + lat + "&zoom=" + Math.min(Number(zoom), 18);
		},
	},
	{ //https://disaster.ninja/active/?map=11.162/35.622/139.786
		name: "Kontur",
		category: UTILITY_CATEGORY,
		default_check: true,
		domain: "disaster.ninja",
		description: "The most active OSM contributor",
		getUrl(lat, lon, zoom) {
			return `https://disaster.ninja/active/?map=${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/disaster\.ninja\/.*?map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);

			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{
		//https://en.mapy.cz/zakladni?x=139.7624242&y=35.6819532&z=16
		name: "MAPY.CZ",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "mapy.cz",
		description: "",
		getUrl(lat, lon, zoom) {
			return "https://en.mapy.cz/zakladni?x=" + lon + "&y=" + lat + "&z=" + zoom;
		},
		getLatLonZoom(url) {
			const match = url.match(/mapy\.cz\/zakladni\?x=(-?\d[0-9.]*)&y=(-?\d[0-9.]*)&z=(\d{1,2})/);

			if (match) {
				const [, lon, lat, zoom] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{
		//https://www.maptiler.com/maps/#streets//vector/12.82/139.62724/35.44413
		name: "maptiler",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "maptiler.com",
		description: "vextor map provider",
		getUrl(lat, lon, zoom) {
			return "https://www.maptiler.com/maps/#streets//vector/" + zoom + "/" + lon + "/" + lat;
		},
		getLatLonZoom(url) {
			const match = url.match(/maptiler.*\/([0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);

			if (match) {
				const [, zoom, lon, lat] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://www.jawg.io/en/maps#8/48.863/2.359
		name: "jawg.io",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "jawg.io",
		description: "vector map provider",
		getUrl(lat, lon, zoom) {
			return "https://www.jawg.io/en/maps/#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/jawg.*\/#([0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);

			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://js.protomaps.com/examples/leaflet.html#12/25.0578/121.5115
		name: "protomaps.com",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "protomaps.com",
		description: "vector map provider",
		getUrl(lat, lon, zoom) {
			return "https://js.protomaps.com/examples/leaflet.html#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/protomaps.*\/#([0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);

			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://tracesmap.com/#8/36.6338/139.5915
		name: "tracesmap.com",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "tracesmap.com",
		description: "raster map provider",
		getUrl(lat, lon, zoom) {
			return "https://tracesmap.com/#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/tracesmap.*\/#([0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);

			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://labs.mapple.com/mapplevt.html?#8.47/35.7472/139.9546
		name: "MαPPLE",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "labs.mapple.com",
		description: "experimental vector map in Japan",
		getUrl(lat, lon, zoom) {
			return "https://labs.mapple.com/mapplevt.html?#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/labs\.mapple\.com.*#([0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);

			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://maps.omniscale.com/en/p/map#map=2/24.6/121.2/3857/B
		name: "Omniscale",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "maps.omniscale.com",
		description: "Interactive map with different projections",
		getUrl(lat, lon, zoom) {
			return "https://maps.omniscale.com/en/p/map#map=" + zoom + "/" + lat + "/" + lon + "3857/B";
		},
		getLatLonZoom(url) {
			const match = url.match(/maps\.omniscale\.com.*#map=([0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);

			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{
		//https://gribrouillon.fr/#15/35.4484/139.6179
		name: "Gribrouillon",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "gribrouillon.fr",
		description: "Draw on a map and share it",
		getUrl(lat, lon, zoom) {
			return "https://gribrouillon.fr/#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/gribrouillon\.fr\/.*(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);

			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{
		//https://www.strava.com/heatmap#9.41/139.72884/35.84051/hot/all
		name: "STRAVA",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "strava.com",
		description: "Heatmap of athletes activities",
		getUrl(lat, lon, zoom) {
			return "https://www.strava.com/heatmap#" + zoom + "/" + lon + "/" + lat + "/hot/all";
		},
		getLatLonZoom(url) {
			const match = url.match(/www\.strava\.com\/heatmap#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lon, lat] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://www.peakfinder.org/?lat=46.6052&lng=8.3217&azi=0&zoom=4&ele=1648
		name: "PeakFinder",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "peakfinder.org",
		description: "Mountain landscape view map",
		getUrl(lat, lon, zoom) {
			return "https://www.peakfinder.org/?lat=" + lat + "&lng=" + lon + "&azi=0&zoom=" + zoom;
		},
		getLatLonZoom(url) {
			const match = url.match(/www\.peakfinder\.org\/.*\?lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)&azi=[0-9]*&zoom=(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://resultmaps.neis-one.org/osm-change-tiles#14/35.6726/139.7576
		name: "Latest OSM Edits per Tile",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "neis-one.org",
		description: "Latest OpenStreetMap Edits per Tile",
		getUrl(lat, lon, zoom) {
			return "https://resultmaps.neis-one.org/osm-change-tiles#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/resultmaps\.neis-one\.org\/osm-change-tiles#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://www.viamichelin.com/web/maps?position=35;135.8353;12
		name: "ViaMichelin",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "viamichelin.com",
		description: "Michelin Travel map",
		getUrl(lat, lon, zoom) {
			return "https://www.viamichelin.com/web/maps?position=" + lat + ";" + lon + ";" + zoom;
		},
	},

	{
		//http://map.baidu.com/?latlng=35.6777,139.7588
		name: "Baidu",
		category: MAIN_CATEGORY,
		default_check: false,
		domain: "map.baidu.com",
		is_gcj_in_china: "bd",

		getUrl(lat, lon, zoom) {
			return "http://map.baidu.com/?latlng=" + lat + "," + lon;
		},
	},
	{
		//https://osmaps.ordnancesurvey.co.uk/51.39378,0.13892,10
		name: "Ordnance Survey(UK)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "ordnancesurvey.co.uk",

		getUrl(lat, lon, zoom) {
			return "https://osmaps.ordnancesurvey.co.uk/" + lat + "," + lon + "," + zoom;
		},
		getLatLonZoom(url) {
			const match = url.match(/osmaps\.ordnancesurvey\.co\.uk\/(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},

	{
		//http://www.opensnowmap.org/?zoom=17&lat=43.08561&lon=141.33047
		name: "OpenSnowMap",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "opensnowmap.org",
		description: "Winter sports map",
		getUrl(lat, lon, zoom) {
			return "http://www.opensnowmap.org/?zoom=" + zoom + "&lat=" + lat + "&lon=" + lon;
		},
	},
	{
		//http://www.opencyclemap.org/?zoom=17&lat=43.08561&lon=141.33047
		name: "OpenCycleMap",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "opencyclemap.org",
		description: "Cycling map",
		getUrl(lat, lon, zoom) {
			return "http://www.opencyclemap.org/?zoom=" + zoom + "&lat=" + lat + "&lon=" + lon;
		},
	},
	{
		//http://gk.historic.place/historische_objekte/translate/en/index-en.html?zoom=5&lat=50.37522&lon=11.5
		name: "Historic Place",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "gk.historic.place",
		description: "Historic objects",
		getUrl(lat, lon, zoom) {
			return "http://gk.historic.place/historische_objekte/translate/en/index-en.html?zoom=" + zoom + "&lat=" + lat + "&lon=" + lon;
		},
	},
	{
		//http://ktgis.net/kjmapw/kjmapw.html?lat=35.680202&lng=139.758840&zoom=14
		name: "今昔マップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "ktgis.net",
		description: "Historic map compare in Japan",
		getUrl(lat, lon, zoom) {
			return "http://ktgis.net/kjmapw/kjmapw.html?lat=" + lat + "&lng=" + lon + "&zoom=" + zoom;
		},
		getLatLonZoom(url) {
			const match = url.match(/ktgis\.net\/kjmapw\/kjmapw\.html\?lat=(-?\d[0-9.]*)\&lng=(-?\d[0-9.]*)\&zoom=(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://openstreetmap.org.ar/#8.93/35.5727/139.4429
		name: "OSM.org.ar",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "openstreetmap.org.ar",
		description: "",
		getUrl(lat, lon, zoom) {
			return "https://openstreetmap.org.ar/#" + zoom + "/" + lat + "/" + lon;
		},
		getLatLonZoom(url) {
			const match = url.match(/openstreetmap\.org\.ar\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://www.yelp.com/search?l=g%3A139.74862972962964%2C35.60176325581224%2C139.64666287171949%2C35.483875357833384
		name: "yelp",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "yelp.com",
		description: "Local review",
		getUrl(lat, lon, zoom) {
			const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
			return "https://www.yelp.com/search?l=g%3A" + maxlon + "%2C" + maxlat + "%2C" + minlon + "%2C" + minlat;
		},
	},
	{
		//http://map.openseamap.org/?zoom=6&lat=53.32140&lon=2.86829
		name: "OpenSeaMap",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "openseamap.org",
		description: "",
		getUrl(lat, lon, zoom) {
			return "http://map.openseamap.org/?zoom=" + Math.min(Number(zoom), 18) + "&lat=" + lat + "&lon=" + lon;
		},
	},
	{
		//https://disaportal.gsi.go.jp/maps/index.html?ll=35.371135,138.713379&z=5
		name: "重ねるハザードマップ(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "gsi.go.jp",
		description: "Hazard map in Japan",
		getUrl(lat, lon, zoom) {
			return "https://disaportal.gsi.go.jp/maps/index.html?ll=" + lat + "," + lon + "&z=" + Math.min(Number(zoom), 18);
		},
		getLatLonZoom(url) {
			const match = url.match(/disaportal\.gsi\.go\.jp\/maps\/index.html\?ll=(-?\d[0-9.]*),(-?\d[0-9.]*)\&z=(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://mapps.gsi.go.jp/history.html#ll=35.6936743,139.4884086&z=15&target=t25000
		name: "地形図・地勢図図歴(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "gsi.go.jp",
		description: "Historic topo map in Japan",
		getUrl(lat, lon, zoom) {
			return "https://mapps.gsi.go.jp/history.html#ll=" + lat + "," + lon + "&z=" + Math.min(Number(zoom), 15);
		},
		getLatLonZoom(url) {
			const match = url.match(/mapps\.gsi\.go\.jp\/history\.html#ll=(-?\d[0-9.]*),(-?\d[0-9.]*)&z=(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, Math.round(Number(zoom))];
			}
		},
	},

	{
		//https://earthquake.usgs.gov/earthquakes/map/#{"autoUpdate":["autoUpdate"],"basemap":"grayscale","feed":"1day_m25","listFormat":"default","mapposition":[[32.2313896627376,126.71630859375],[40.421860362045194,143.27270507812497]],"overlays":["plates"],"restrictListToMap":["restrictListToMap"],"search":null,"sort":"newest","timezone":"utc","viewModes":["settings","map"],"event":null}
		name: "USGS earthquakes",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "usgs.gov",
		description: "Latest earthquakes",
		getUrl(lat, lon, zoom) {
			const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
			const url = 'https://earthquake.usgs.gov/earthquakes/map/#{"autoUpdate":["autoUpdate"],"basemap":"grayscale","feed":"1day_m25","listFormat":"default","mapposition":[[' + minlat + "," + minlon + "],[" + maxlat + "," + maxlon + ']],"overlays":["plates"],"restrictListToMap":["restrictListToMap"],"search":null,"sort":"newest","timezone":"utc","viewModes":["settings","map"],"event":null}';
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
	{
		//https://2gis.ru/?m=138.383832%2C42.890091%2F6
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

	{
		//https://www.openhistoricalmap.org/#map=10/35.6149/139.2593&layers=O
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
	{
		//https://armd-02.github.io/mapmaker/#12.5/35.7059/139.7616
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
	{
		//http://qa.poole.ch/?zoom=13&lat=35.42723&lon=139.58851
		name: "qa.poole.ch",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "poole.ch",
		description: "Streets with no names",
		getUrl(lat, lon, zoom) {
			return `http://qa.poole.ch/?zoom=${Math.min(zoom, 18)}&lat=${lat}&lon=${lon}`;
		},
	},
	{
		//http://www.xn--pnvkarte-m4a.de/?#139.781;35.4722;10
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
	{
		//http://www.lightningmaps.org/#m=oss;t=3;s=0;o=0;b=;ts=0;y=35.5065;x=139.8395;z=10;d=2;dl=2;dc=0;
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
	{
		//https://trailrouter.com/#wps=35.68107,139.76553&ss=&rt=true&td=5000&aus=false&aus2=false&ah=0&ar=true&pga=0.8&im=false
		name: "Trail Router",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "trailrouter.com",
		description: "Green area routing",
		getUrl(lat, lon, zoom) {
			return `https://trailrouter.com/#wps=${lat},${lon}&ss=&rt=true&td=5000&aus=false&aus2=false&ah=0&ar=true&pga=0.8&im=false`;
		},
	},
	{
		//https://cmap.dev/#9/36.0757/139.8477
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
	{
		//http://beacons.schmirler.de/en/world.html#map=11/35.315176983316775/139.7419591178308&layers=OS5&details=18
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

	{
		//https://nakarte.me/#m=9/35.29383/139.30252&l=O
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

	{
		//https://www.komoot.com/plan/@35.6837927,139.8906326,11z
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

	{
		//https://tile.openstreetmap.fr/?zoom=7&lat=37.03262&lon=138.14182&layers=B00000000FFFFFF
		name: "osm.fr",
		category: OSM_LOCAL_CATEGORY,
		default_check: false,
		domain: "openstreetmap.fr",
		description: "OSM.fr",
		getUrl(lat, lon, zoom) {
			return `https://tile.openstreetmap.fr/?zoom=${zoom}&lat=${lat}&lon=${lon}&layers=B00000000FFFFFF`;
		},
	},
	{
		//https://maps.nls.uk/geo/explore/#zoom=8&lat=35.73020&lon=139.68615&layers=100611144&b=1
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

	{
		//https://maps.qchizu.xyz/#15/35.686773/139.753990/&base=pale&ls=pale%7Cmlit_road2019_bridge_01&disp=11&lcd=mlit_road2019_bridge_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
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
	{
		//https://maps.qchizu.xyz/#15/35.686773/139.753990/&base=pale&ls=pale%7Cmlit_road2019_tunnel_01&disp=11&lcd=mlit_road2019_tunnel_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
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

	{
		//https://maps.qchizu.xyz/#15/35.686773/139.753969/&base=pale&ls=pale%7Cmlit_road2019_shed_01&disp=11&lcd=mlit_road2019_shed_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
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

	{
		//https://maps.qchizu.xyz/#14/35.682294/139.766135/&base=pale&ls=pale%7Cmlit_road2019_culvert_01&disp=11&lcd=mlit_road2019_culvert_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
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

	{
		//https://maps.qchizu.xyz/#14/35.682294/139.766135/&base=pale&ls=pale%7Cmlit_road2019_footbridge_01&disp=11&lcd=mlit_road2019_footbridge_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
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

	{
		//https://maps.qchizu.xyz/#15/35.685692/139.756329/&base=pale&ls=pale%7Cmlit_road2019_sign_01&disp=11&lcd=mlit_road2019_sign_01&vs=c1j0h0k0l0u0t0z0r0s0m0f1
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

	{
		//https://maps.qchizu.xyz/#15/35.685692/139.756329/&base=pale&ls=pale%7Cmaff-pond20200925-1&disp=11&lcd=maff-pond20200925-1&vs=c1j0h0k0l0u0t0z0r0s0m0f1
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
	{
		//https://dammaps.jp/?ll=36.181776,139.708654&z=10
		name: "DamMaps(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "dammaps.jp",
		description: "Dams in Japan",
		getUrl(lat, lon, zoom) {
			return `https://dammaps.jp/?ll=${lat},${lon}&z=${Math.min(Number(zoom), 19)}`;
		},
	},

	{
		//https://www.river.go.jp/kawabou/pc/tm?zm=15&clat=35.545950195567315&clon=139.64511394500735
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

	{
		//https://plateauview.jp/#start={"initSources":[{"initialCamera":{"west":139.6,"south":35.6,"east":139.7,"north":35.7}}]}
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

	{
		//https://openlevelup.net/#12/35.6884/139.6323
		name: "OpenLevelUp!",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "openlevelup.net",
		description: "Indoor viewer",
		getUrl(lat, lon, zoom) {
			return `https://openlevelup.net/#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/openlevelup\.net\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://shademap.app/@35.68102,139.76313,14.21596z,1647848172422t,0b,0p
		name: "ShadeMap",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "shademap.app",
		description: "View shadows of buildings at specified time",
		getUrl(lat, lon, zoom) {
			return `https://shademap.app/@${lat},${lon},${zoom}z`;
		},
		getLatLonZoom(url) {
			const match = url.match(/shademap\.app\/@(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)z/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},

	
	  { //https://app.shadowmap.org/?lat=48.15646&lng=16.39107&zoom=15
		name: "Shadowmap",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "shadowmap.org",
		description: "Visualize sunlight and shadows of terrains and buildings at specified time",
		getUrl(lat, lon, zoom) {
		  return `https://app.shadowmap.org/?lat=${lat}&lng=${lon}&zoom=${zoom}`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/shadowmap\.org\/\?lat=(-?\d[0-9.]*)&lng=(-?\d[0-9.]*)&zoom=(\d[0-9.]*)/);
		  if (match) {
			const [, lat, lon, zoom] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },


	{
		//https://yuiseki.github.io/osm-address-editor-vite/#16.79/35.683021/139.749329
		name: "OSM address editor",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "github.io",
		description: "View the editor of buidling and edit address",
		getUrl(lat, lon, zoom) {
			return `https://yuiseki.github.io/osm-address-editor-vite/#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/osm-address-editor-vite\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	/* Suncalc doesn't move to specified coordinates
	  { //http://suncalc.net/#/35.514,139.6201,12
		name: "SunCalc",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "suncalc.net",
		description: "Sunrise, sunset, sun direction",
		getUrl(lat, lon, zoom) {
		  return `http://suncalc.net/#/${lat},${lon},${zoom}`;
  
		},
		getLatLonZoom(url) {
		  const match = url.match(/#\/(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)/);
		  if (match) {
			const [, lat, lon, zoom] = match;
			return [lat, normalizeLon(lon), Math.round(Number(zoom))];
		  }
		},
	  },
	  */
	{
		//https://www.wolframalpha.com/input?i=35.514N+139.6201E
		name: "Wolfram Alpha",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "wolframalpha.com",
		description: "Scientific information at the location",
		getUrl(lat, lon, zoom) {
			return `https://www.wolframalpha.com/input?i=${lat}N+${lon}E`;
		},
	},
	{
		//https://map.what3words.com/35.89182,140.49066
		name: "what3words",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "what3words.com",
		description: "Specify location with 3 words",
		getUrl(lat, lon, zoom) {
			return `https://map.what3words.com/${lat},${lon}`;
		},
	},
	{
		//https://boulter.com/gps/#35.89182%2C140.49066
		name: "boulter",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "boulter.com",
		description: "GPS Coordinate Converter",
		getUrl(lat, lon, zoom) {
			return `https://boulter.com/gps/#${lat}%2C${lon}`;
		},
	},
	{
		//https://www.gpxeditor.co.uk/?location=35.89182,140.49066&zoom=17
		name: "GPX Editor",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "gpxeditor.co.uk",
		description: "GPX Editor",
		getUrl(lat, lon, zoom) {
			return `https://www.gpxeditor.co.uk/?location=${lat},${lon}&zoom=${zoom}`;
		},
	},
	{
		//https://yandex.com/maps/?l=stv%2Csta&ll=37.615268%2C55.750168&panorama%5Bdirection%5D=0%2C0&panorama%5Bfull%5D=true&panorama%5Bpoint%5D=37.615268%2C55.750168&panorama%5Bspan%5D=0%2C0&z=15
		name: "Yandex panorama",
		category: MAIN_CATEGORY,
		default_check: false,
		domain: "yandex.com",
		description: "Yandex street view",
		getUrl(lat, lon, zoom) {
			return `https://yandex.com/maps/?l=stv%2Csta&ll=${lon}%2C${lat}&panorama%5Bdirection%5D=0%2C0&panorama%5Bfull%5D=true&panorama%5Bpoint%5D=${lon}%2C${lat}&panorama%5Bspan%5D=0%2C0&z=${zoom}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/(-?\d[0-9.]*)%2C(-?\d[0-9.]*)&panorama%5Bspan%5D=(\d[0-9.]*)%2C(\d[0-9.]*)&z=(\d[0-9.]*)$/);
			if (match) {
				const [, lon, lat, dummy1, dummy2, zoom] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://hanishina.github.io/maps/historymap.html?y=34.7935&x=134.8956&z=8
		name: "市区町村境界時系列マップ(仮)(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "github.io",
		description: "Transition of administrative boundaries in Japan",
		getUrl(lat, lon, zoom) {
			return `https://hanishina.github.io/maps/historymap.html?y=${lat}&x=${lon}&z=${zoom}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/historymap\.html\?y=(-?\d[0-9.]*)&x=(-?\d[0-9.]*)&z=(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://www.its-mo.com/maps/?lat=35.626534167&lon=139.841299444
		name: "いつもNAVI(JP)",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "its-mo.com",
		description: "Zenrin map in Japan",
		getUrl(lat, lon, zoom) {
			return `https://www.its-mo.com/maps/?lat=${lat}&lon=${lon}`;
		},
	},
	{
		//https://duckduckgo.com/?q=-35%2C-135&iaxm=maps
		name: "DuckDuckGo",
		category: MAIN_CATEGORY,
		default_check: false,
		domain: "duckduckgo.com",
		description: "Privacy secured search service",
		getUrl(lat, lon, zoom) {
			return `https://duckduckgo.com/?q=${lat}%2C${lon}&iaxm=maps`;
		},
	},
	/* No good result
	  { //https://anvaka.github.io/city-roads/?q=-23.55095%2C%20-46.63296
		name: "city roads",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "github.io",
		description: "Create a map every single road within a city",
		getUrl(lat, lon, zoom) {
		  return `https://anvaka.github.io/city-roads/?q=${lat}%2C%20${lon}`;
  
		},
	  },
	  */
	{
		//https://skyvector.com/?ll=34.735668976405066,139.33731081107155&chart=301&zoom=2
		name: "SkyVector",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "skyvector.com",
		description: "Aeronautical chart",
		getUrl(lat, lon, zoom) {
			return `https://skyvector.com/?ll=${lat},${lon}&chart=301&zoom=2`;
		},
	},
	{
		//https://osmapp.org/#8.36/35.5586/139.5846
		name: "OsmAPP",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "osmapp.org",
		description: "",
		getUrl(lat, lon, zoom) {
			return `https://osmapp.org/#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/osmapp\.org\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	
	{
		//https://www.geoportal.bayern.de/bayernatlas/?topic=ba&lang=de&bgLayer=atkis&catalogNodes=11&E=604510.08&N=5337130.40&zoom=3
		//https://geoportal.bayern.de/bayernatlas?lon=11.575556&lat=48.137222&zoom=10
		name: "BayernAtlas",
		category: LOCAL_CATEGORY,
		domain: "geoportal.bayern.de",
		description: "der Kartenviewer des Freistaates Bayern",
		getUrl(lat, lon, zoom) {
			return `https://geoportal.bayern.de/bayernatlas?lon=${lon}&lat=${lat}&zoom=${Number(zoom)-5}`;
		},
		/*
		getLatLonZoom(url) {
			const match = url.match(/geoportal\.bayern\.de.*E=(\d[0-9.]*)&N=(\d[0-9.]*)&zoom=(\d[0-9.]*)/);
			if (match) {
				const [, gk4_lon, gk4_lat, gk4_zoom] = match;
				const lat = (Number(gk4_lat) - 7222)/110681;
				const lon = (Number(gk4_lon) + 154177)/72721;
				const zoom = Number(gk4_zoom) +5;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
		*/
	},
	
	{
		//https://hgis.pref.miyazaki.lg.jp/hinata/hinata.html#10/35.640127/139.624164
		name: "ひなたGIS",
		category: LOCAL_CATEGORY,
		default_check: false,
		domain: "pref.miyazaki.lg.jp",
		description: "",
		getUrl(lat, lon, zoom) {
			return `https://hgis.pref.miyazaki.lg.jp/hinata/hinata.html#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/pref\.miyazaki\.lg\.jp\/hinata\/hinata\.html#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://notes-heatmap.openstreetmap.fr/?pos=48.25,15.39,6
		name: "OSM Notes Heatmap",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "openstreetmap.fr",
		description: "",
		getUrl(lat, lon, zoom) {
			return `https://notes-heatmap.openstreetmap.fr/?pos=${lat},${lon},${zoom}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/pos=(-?\d[0-9.]*),(-?\d[0-9.]*),(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://osmand.net/map?pin=23.000245%2C121.000097#18/23/121
		name: "OsmAnd",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "osmand.net",
		description: "",
		getUrl(lat, lon, zoom, extra) {
			let pin = ''
			if (extra != null && extra.pin_lat != null) {
				pin = '?pin=' + encodeURIComponent(`${extra.pin_lat},${extra.pin_lon}`);
			}
			return `https://osmand.net/map${pin}#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			let array;
			const match = url.match(/osmand\.net\/map.*?#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				array = [lat, normalizeLon(lon), Math.round(Number(zoom))];
				const u = new URL(url);
				if (u.search && u.searchParams.has('pin')) {
					const pin = decodeURIComponent(
						u.searchParams.get('pin')
					);
					const pin_latlon = pin.split(',');
					array.push({pin_lat: pin_latlon[0], pin_lon:pin_latlon[1]});
				}
				return array;
			}
		},
	},
	{
		//https://rene78.github.io/latest-changes/#12/43.0991/141.3772
		name: "OSM Latest Changes",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "github.io",
		description: "Shows recent changes on OpenStreetMap",
		getUrl(lat, lon, zoom) {
			return `https://rene78.github.io/latest-changes/#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/latest-changes\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},

	{
		//geo:37.786971,-122.399677?z=16&q=([\d\.]+,[\d\.]+|.*)
		//https://en.wikipedia.org/wiki/Geo_URI_scheme
		name: "geo URI",
		category: UTILITY_CATEGORY,
		default_check: false,
		domain: "",
		description: "A URI schema to represent a point in a coordinate reference system, which may show the location on the default map application.",
		getUrl(lat, lon, zoom, extra) {
			// Usually, geo uri represent a point(pin),
			// not a map view. Therefore, if the source have pin, 
			// use the pin and discard the lat and lon.
			if (extra && extra.pin_lat != null) {
				[lat, lon] = [extra.pin_lat, extra.pin_lon];
			}
			return `geo:${lat},${lon}?z=${zoom}`;
		},
		getLatLonZoom(url) {
			let lat, lon, zoom = 16; // 16 as default zoom level
			
			const u = new URL(url);
			const latlonRegexp = /(-?\d[0-9.]*),(-?\d[0-9.]*)/;
			const latlon = u.pathname.match(latlonRegexp);
			if (!latlon) return;
			[, lat, lon] = latlon;
			if (u.search) {
				const z = u.searchParams.get('z');
				if (z) zoom = z;
				
				// some android device use 0,0?q=${lat},${lon}
				// to represent a pin.
				// https://en.wikipedia.org/wiki/Geo_URI_scheme#Unofficial_extensions
				const q = u.searchParams.get('q');
				let latlon;
				if (Number(lat) == 0 && Number(lon) == 0 && q) {
					latlon = q.match(latlonRegexp);
				}
				if (latlon) [, lat, lon] = latlon;
			}
			lon = normalizeLon(lon);
			return [
				lat, lon, zoom,
				{pin_lat: lat, pin_lon: lon} // treat geo uri as a pin url
			];
		},

	},
	{
		//https://app.openindoor.io/#17.48/35.689768/139.700802
		name: "OpenIndoor",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "openindoor.io",
		description: "Shows Indoor information of buildings",
		getUrl(lat, lon, zoom) {
			return `https://app.openindoor.io/#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/app\.openindoor\.io\/#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://indoorequal.org/#map=16.13/35.681577/139.766966&level=-5
		name: "indoor=",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "indoorequal.org",
		description: "display indoor data",
		getUrl(lat, lon, zoom) {
			return `https://indoorequal.org/#map=${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/indoorequal\.org\/#map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},

	{
		//https://liveuamap.com/?zoom=10&ll=52.30637946442471,32.53189086914063
		name: "Live Universal Awareness Map",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "liveuamap.com",
		description: "",
		getUrl(lat, lon, zoom) {
			return `https://liveuamap.com/?zoom=${zoom}&ll=${lat},${lon}`;
		},

	},

	{
		//https://tankaru.github.io/OpenSwitchMapsWeb/index.html#https://www.openstreetmap.org/#map=6/49.852/34.909
		name: "OpenSwitchMapsWeb",
		category: PORTAL_CATEGORY,
		default_check: false,
		domain: "github.io",
		description: "Web version of OpenSwitchMaps",
		getUrl(lat, lon, zoom) {
			return `https://tankaru.github.io/OpenSwitchMapsWeb/index.html#https://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`;//use osm as dummy
		},

	},

	{
		//https://www.deepstatemap.live/en#7.5/53.313/28.872
		name: "DeepState Map",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "deepstatemap.live",
		description: "",
		getUrl(lat, lon, zoom) {
			return `https://www.deepstatemap.live/en#${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/deepstatemap\.live\/en#(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},

	{
		//https://soar.earth/maps?pos=35.693278997339895%2C139.70266210333696%2C10.75
		name: "Soar.Earth",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "soar.earth",
		description: "",
		getUrl(lat, lon, zoom) {
			return `https://soar.earth/maps?pos=${lat}%2C${lon}%2C${zoom}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/soar\.earth\/maps\?pos=(-?\d[0-9.]*)%2C(-?\d[0-9.]*)%2C(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},

	{
		//https://worldview.earthdata.nasa.gov/?v=138.8410066163944,35.10024365499317,140.89540523118063,36.180516769442114
		name: "EOSDIS Worldview",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "nasa.gov",
		description: "",
		getUrl(lat, lon, zoom) {
			const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
			return `https://worldview.earthdata.nasa.gov/?v=${minlon},${minlat},${maxlon},${maxlat}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/worldview\.earthdata\.nasa\.gov\/\?v=(-?\d[0-9.]*),(-?\d[0-9.]*),(-?\d[0-9.]*),(-?\d[0-9.]*)/);
			if (match) {
				const [, minlon, minlat, maxlon, maxlat] = match;
				const [lat, lon, zoom] = bboxToLatLonZoom(minlon, minlat, maxlon, maxlat);
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		//https://github.com/tankaru/OpenSwitchMaps/pull/82
		name: "BRouter-Web",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "brouter.de",
		getUrl(lat, lon, zoom) {
			return "https://brouter.de/brouter-web/#map=" + zoom + "/" + lat + "/" + lon + "/cyclosm";
		},
		getLatLonZoom(url) {
			const match = url.match(/brouter\.de\/brouter-web\/#map=(\d{1,2})\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				let [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{
		//https://onthegomap.com/?lat=35.68386&lng=139.74132&zoom=12.5
		name: "On The Go Map",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "onthegomap.com",
		description: "a route planner for running, walking, biking, or driving",
		getUrl(lat, lon, zoom) {
			const [minlon, minlat, maxlon, maxlat] = latLonZoomToBbox(lat, lon, zoom);
			return `https://onthegomap.com/?lat=${lat}&lng=${lon}&zoom=${zoom}`;
		},

	},
	{
		// https://satellites.pro/#48.060184,37.677612,14
		name: "Satellites.pro",
		category: OTHER_CATEGORY,
		default_check: false,
		domain: "satellites.pro",
		description: "",
		getUrl(lat, lon, zoom) {
			return `https://satellites.pro/#${lat},${lon},${zoom}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/satellites\.pro\/(\w+)#(-?\d[0-9.]*)\,(-?\d[0-9.]*)\,(\d[0-9.]*)/);
			if (match) {
				const [, map, lat, lon, zoom] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{
		name: "ProjectOwl: Ukraine",
		category: SPECIAL_CATEGORY,
		default_check: false,
		domain: "www.google.com",
		is_gcj_in_china: true,
		getUrl(lat, lon, zoom) {
			return `https://www.google.com/maps/d/u/0/viewer?mid=180u1IkUjtjpdJWnIC0AxTKSiqK4G6Pez&ll=${lat}%2C${lon}&z=${zoom}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/www\.google\.com\/maps\S{2,6}\/viewer\?mid=180u1IkUjtjpdJWnIC0AxTKSiqK4G6Pez&ll=(-?\d[0-9.]*)%2C(-?\d[0-9.]*)&z=(\d[0-9]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, normalizeLon(lon), Math.round(Number(zoom))];
			}
		},
	},
	{//https://zelonewolf.github.io/openstreetmap-americana/#map=15.76/37.90132/139.073283
		name: "OpenStreetMap Americana",
		category: OTHER_CATEGORY,
		domain: "github.io",
		description: "American style vector map",
		getUrl(lat, lon, zoom) {
			return `https://zelonewolf.github.io/openstreetmap-americana/#map=${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/zelonewolf\.github\.io\/.*\/#map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{//https://openaedmap.org/#map=12/35.67503/139.80664
		name: "OpenAEDMap",
		category: OTHER_CATEGORY,
		domain: "openaedmap.org",
		description: "AED map",
		getUrl(lat, lon, zoom) {
			return `https://openaedmap.org/#map=${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/openaedmap\.org\/#map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},
	{//https://sunders.uber.space/?lat=34.76737826&lon=134.84250069&zoom=16
		name: "Surveillance under Surveillance",
		category: OTHER_CATEGORY,
		domain: "uber.space",
		description: "Survey camera map",
		getUrl(lat, lon, zoom) {
			return `https://sunders.uber.space/?lat=${lat}&lon=${lon}&zoom=${zoom}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/unders\.uber\.space\/\?lat=(-?\d[0-9.]*)&lon=(-?\d[0-9.]*)&zoom=(\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, zoom];
			}
		},
	},

	{//https://geojson.io/#map=13.62/35.68351/139.74025
		name: "geojson.io",
		category: UTILITY_CATEGORY,
		domain: "geojson.io",
		description: "geojson viewer/editor",
		getUrl(lat, lon, zoom) {
			return `https://geojson.io/#map=${zoom}/${lat}/${lon}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/geojson\.io\/#map=(\d[0-9.]*)\/(-?\d[0-9.]*)\/(-?\d[0-9.]*)/);
			if (match) {
				const [, zoom, lat, lon] = match;
				return [lat, lon, zoom];
			}
		},
	},

	{//https://www.wunderground.com/weather/35.45,139.62
		name: "Weather Underground",
		category: SPECIAL_CATEGORY,
		domain: "wunderground.com",
		description: "Local weather information",
		getUrl(lat, lon, zoom) {
			return `https://www.wunderground.com/weather/${lat},${lon}`;
		},
	},

	{//https://www.ventusky.com/?p=36.41;139.21;6
		name: "Ventusky",
		category: SPECIAL_CATEGORY,
		domain: "ventusky.com",
		description: "Weather map",
		getUrl(lat, lon, zoom) {
			return `https://www.ventusky.com/?p=${lat};${lon};${Math.min(10, Number(zoom))}`;
		},
		getLatLonZoom(url) {
			const match = url.match(/ventusky\.com\/?p=(-?\d[0-9.]*);(-?\d[0-9.]*);(-?\d[0-9.]*)/);
			if (match) {
				const [, lat, lon, zoom] = match;
				return [lat, lon, zoom];
			}
		},
	},

];

