<template>
  <div>
	<h2>Preferences</h2>
	<div>
		<ul :key="preferenceChecks">
			<li>
				<input
					type="checkbox"
					:checked="preferences.alwaysOpenInNewTab"
					@change="setPreference('alwaysOpenInNewTab', $event.target.checked)"
				>Always open in new tab
			</li>
		</ul>
	</div>
    <h2>Enabled maps</h2>
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
      >
        <label>
          <input
            type="checkbox"
            :checked="enabledMaps[map.name]"
            @change="setMapEnabled(map, $event.target.checked)"
          >
          <img :src="'https://www.google.com/s2/favicons?domain=' + map.domain" width="16px">
          {{ map.name }}
        </label>
      </p>
    </div>
  </div>
</template>
<script>
const _ = require('lodash');
const storage = require('./storage');
const {getAllMaps} = require('../maps');

module.exports = {
  data() {
    return {
      columns: _.groupBy(getAllMaps(), 'category'),
      enabledMaps: storage.observableEnabledMaps,
	  preferences: storage.observablePreferences,
    };
  },
  methods: {
    setMapEnabled(map, enabled) {
      storage.setMapEnabled(map, enabled);
    },
	setPreference(item, preference){
		storage.setPreference(item, preference);
		//alert('setPreference'+item+preference);
	}
  },
};
</script>
<style>
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    font-size: 10pt;
  }

  .maps {
    display: table;
  }

  .map img {
    vertical-align: text-bottom;
    margin-right: 5px;
  }

  .map input {
    vertical-align: middle;
  }

  .title {
    font-weight: bold;
    font-size: larger;
	text-align: center;
  }

  .column {
    display: table-cell;
    white-space: nowrap;
  }
</style>
