<template>
  <div id="mapmenu">
    <span class="options-link" @click="openOptionsPage">⚙</span>
    <div
      v-for="(maps, columnName) in columns"
      :key="columnName"
      class="column"
    >
      <p class="title">{{ columnName }}</p>
      <p
        v-for="map in maps"
        class="map"
        :key="map.name"
        @click.left="openMapInCurrentTab(map)"
        @click.middle="openMapInOtherTab(map)"
      >
        <img :src="'http://www.google.com/s2/favicons?domain=' + map.domain">
        {{ map.name }}
      </p>
    </div>
  </div>
</template>
<script>
const _ = require('lodash');
const browser = require("webextension-polyfill");
const {getLatLonZoom, getAllMaps} = require('../maps');
const storage = require('../options/storage');

module.exports = {
  computed: {
    columns() {
      const enabledMaps = _.filter(getAllMaps(), map => storage.observableEnabledMaps[map.name]);
      return _.groupBy(enabledMaps, 'category');
    },
  },
  methods: {
    openMapInCurrentTab(map) {
      this.open(map, mapUrl => 'window.location.href =' + JSON.stringify(mapUrl) + ';');
    },
    openMapInOtherTab(map) {
      this.open(map, mapUrl => 'window.open(' + JSON.stringify(mapUrl) + ');');
    },
    open(map, getCode) {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        const tab = tabs[0];
        const [lat, lon, zoom] = getLatLonZoom(tab.url);
        const mapUrl = map.getUrl(lat, lon, zoom);
        const code = getCode(mapUrl);
        chrome.tabs.executeScript(tab.id, {code});
        window.close();
      });
    },
    openOptionsPage() {
      browser.runtime.openOptionsPage();
    },
  },
};
</script>
<style>
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    font-size: 10pt;
    display: table;
    padding: 0;
    margin: 0;
  }

  p.map {
    padding: 5px;
    margin: 5px;
  }

  p.map img {
    vertical-align: text-bottom;
    margin-right: 5px;
  }

  p.map:hover {
    cursor: pointer;
    background-color: #eee;
  }

  .title, .options-link {
    background-color: #eee;
    font-weight: bold;
    font-size: larger;
    text-align: center;
    padding: 5px;
    margin: 0;
  }

  .column:last-child .title {
    margin-right: 1ex;
  }

  .options-link {
    position: fixed;
    top: 0;
    right: 0;
    text-decoration: none;
  }

  .options-link:hover {
    cursor: pointer;
  }

  .column {
    display: inline-block;
	vertical-align: top;
    white-space: nowrap;
	width: 150px;
	//float:left;
	//clear:both;
	overflow: hidden;
  }
  
  #mapmenu {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	//width: 450px;
	//column-count: 3;
  	//display:flex;
	//flex-direction: row;
	//flex-wrap: wrap;
	//flex-flow: 3 wrap;

  }
</style>
