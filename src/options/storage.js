const browser = require("webextension-polyfill");
const _ = require('lodash');
const Vue = require('vue').default;
const {getAllMaps} = require('../maps');

const storage = browser.storage;
const storageArea = storage.sync || storage.local;

const mapNames = _.map(getAllMaps(), 'name');
const mapChecks = _.map(getAllMaps(), function (map){
	if ('default_check' in map) {
		return map['default_check'];
	} else {
		return false;
	};
});
const enabledMaps = Vue.observable(_.zipObject(mapNames, mapChecks));
const preferences = Vue.observable({
	'alwaysOpenInNewTab': false,
});

init();

module.exports = {
  init,
  observableEnabledMaps: enabledMaps,
  observablePreferences: preferences,
  setMapEnabled,
  setPreference,
};

function init() {
  storageArea.get('enabledMaps').then((stored) => {
    _.extend(enabledMaps, stored.enabledMaps);
  });
  storageArea.get('preferences').then((stored) => {
    _.extend(preferences, stored.preferences);
  });
  storage.onChanged.addListener(onChanged);
}

function setMapEnabled(map, enabled) {
  enabledMaps[map.name] = enabled;
  storageArea.set({enabledMaps});
}
function setPreference(item, preference) {
	preferences[item] = preference;
	storageArea.set({preferences});
}

function onChanged(changes) {
  _.extend(enabledMaps, changes.enabledMaps.newValue);
  _.extend(preferences, changes.preferences.newValue);
}
