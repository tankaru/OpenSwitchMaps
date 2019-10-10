<template>
  <div>
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
const {getLatLonZoom, getAllMaps} = require('../maps');

module.exports = {
  data() {
    return {
      columns: _.groupBy(getAllMaps(), 'category'),
    };
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
    }
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

  .title {
    background-color: #eee;
    font-weight: bold;
    font-size: larger;
    text-align: center;
    padding: 1px;
    margin: 0;
  }

  .column {
    display: table-cell;
    white-space: nowrap;
  }
</style>
