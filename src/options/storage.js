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
		return true;
	};
});
const enabledMaps = Vue.observable(_.zipObject(mapNames, mapChecks));

init();

module.exports = {
  init,
  observableEnabledMaps: enabledMaps,
  setMapEnabled,
};

function init() {
  storageArea.get('enabledMaps').then((stored) => {
    _.extend(enabledMaps, stored.enabledMaps);
  });
  storage.onChanged.addListener(onChanged);
}

function setMapEnabled(map, enabled) {
  enabledMaps[map.name] = enabled;
  storageArea.set({enabledMaps});
}

function onChanged(changes) {
  _.extend(enabledMaps, changes.enabledMaps.newValue);
}
