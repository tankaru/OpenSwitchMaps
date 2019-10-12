const browser = require("webextension-polyfill");
const _ = require('lodash');
const Vue = require('vue').default;
const {getAllMaps} = require('../maps');

const storage = browser.storage;
const storageArea = storage.sync || storage.local;

const mapNames = _.map(getAllMaps(), 'name');
const enabledMaps = Vue.observable(_.zipObject(mapNames, new Array(mapNames.length).fill(true)));

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
