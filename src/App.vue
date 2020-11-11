<template>
  <div id="app">
    <h1>DayZ Spawn Builder</h1>

    <b-input
      placeholder="E.g., NPCEagleScout"
      v-model="spawnNameSuffix"
      style="width: 250px"
    ></b-input>

    <br />

    <div style="display: flex; align-items: center">
      <div style="margin-right: 25px">
        <b-select
          placeholder="Type"
          v-model="selectedEventType"
          style="width: 100%"
        >
          <option
            v-for="(eventType, i) in eventTypes"
            :value="eventType.value"
            :key="i"
          >
            {{ eventType.label }}
          </option>
        </b-select>
      </div>
      <div style="margin-right: 15px; padding-top: 7px">
        <b-radio
          v-model="selectedLootType"
          name="name"
          native-value="attachment"
        >
          Attachments
        </b-radio>
      </div>
      <div style="margin-right: 15px; padding-top: 7px">
        <b-radio v-model="selectedLootType" name="name" native-value="cargo">
          Cargo
        </b-radio>
      </div>
    </div>

    <br />
    
    <div style="display:flex;">
      <div style="margin-right:25px;">
        <b-select
          placeholder="Position"
          v-model="selectedPosition"
          style="width: 100%"
        >
          <option
            v-for="(position, i) in positions"
            :value="position"
            :key="i"
          >
            {{ position }}
          </option>
        </b-select>
      </div>
      <div>
        <b-select
          placeholder="Children"
          v-model="selectedChildren"
          style="width: 100%"
        >
          <option
            v-for="(child, i) in children"
            :value="child"
            :key="i"
          >
            {{ child }}
          </option>
        </b-select>
      </div>
    </div>

    <br />

    <multiselect
      v-model="selectedLootModel"
      :options="selectableLootTypes"
      placeholder="Choose model anchor, e.g., SurvivorM_Oliver"
    >
      <template slot="singleLabel" slot-scope="props">
        <span class="option__desc"
          ><span
            class="option__title"
            style="font-weight: bold; color: rgb(224 106 106)"
            >{{ props.option.split(" ")[1].split("[")[1].split("]")[0] }}</span
          >
          <span style="color: #aaa">
            [<span style="font-style: italic">{{
              props.option.split(" ")[0]
            }}</span
            >]</span
          ></span
        ></template
      >
      <template slot="option" slot-scope="props">
        <div class="option__desc">
          <span class="option__title">
            <span style="font-weight: bold">{{
              props.option.split(" ")[1].split("[")[1].split("]")[0]
            }}</span
            >&nbsp;
            <span>{{ props.option.split(" ")[0] }}</span>
          </span>
        </div>
      </template>
    </multiselect>

    <br />

    <multiselect
      :disabled="!selectedLootType"
      v-model="selectedLootTypes"
      :options="selectableLootTypes"
      :multiple="true"
      :placeholder="`Choose loot ${
        selectedLootType ? selectedLootType : `type`
      }s, e.g., M41A`"
    >
      <template slot="singleLabel" slot-scope="props">
        <span class="option__desc"
          ><span
            class="option__title"
            style="font-weight: bold; color: #41b883"
            >{{ props.option.split(" ")[1].split("[")[1].split("]")[0] }}</span
          >
          <span style="color: #aaa">
            [<span style="font-style: italic">{{
              props.option.split(" ")[0]
            }}</span
            >]</span
          ></span
        ></template
      >
      <template slot="option" slot-scope="props">
        <div class="option__desc">
          <span class="option__title">
            <span style="font-weight: bold">{{
              props.option.split(" ")[1].split("[")[1].split("]")[0]
            }}</span
            >&nbsp;
            <span>{{ props.option.split(" ")[0] }}</span>
          </span>
        </div>
      </template>
    </multiselect>

    <br />

    <pre v-if="selectedLootModel">{{ spawnableTypesXml }}</pre>

    <br />

    <pre v-if="selectedEventType && spawnNameSuffix">{{ eventSpawnsXml }}</pre>

    <br />

    <pre v-if="selectedEventType && spawnNameSuffix && selectedLootModel">{{
      eventXml
    }}</pre>

    <br />

    <span style="font-size:10px;opacity:.5;">
      DayZ Spawn Builder <a href="https://github.com/brngdsn/dayz-spawn-builder">v{{appVersion}}</a> by <a href="https://twitter.com/brngdsn">@brngdsn</a>
    </span>

    <!-- <pre>data={{ $data }}</pre> -->

  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { classNames } from "./class-names";

export default {
  name: "App",
  components: {
    Multiselect,
  },
  computed: {
    eventSpawnsXml() {
      return `
<event name="${this.selectedEventType}${this.spawnNameSuffix}">
    <pos x="11550.8" z="3158.67" a="-1" />
</event>
      `;
    },
    spawnableTypesXml() {
      const loot = this.selectedLootTypes.map((selectedLoot) => {
        return `
  <${this.selectedLootType} chance="1.00">
    <item name="${selectedLoot.split(' ')[0]}" chance="1.00"></item>
  </${this.selectedLootType}>`;
      });
      return `
<type name="${
        this.selectedLootModel ? this.selectedLootModel.split(" ")[0] : null
      }">${loot.reduce((a, c) => `${a}${c}`, ``)}
</type>
      `;
    },
    eventXml() {
      return `
<event name="${this.selectedEventType}${this.spawnNameSuffix}">
  <nominal>50</nominal>
  <min>50</min>
  <max>50</max>
  <lifetime>300</lifetime>
  <restock>0</restock>
  <saferadius>0</saferadius>
  <distanceradius>0</distanceradius>
  <cleanupradius>0</cleanupradius>
  <flags deletable="0" init_random="0" remove_damaged="1"></flags>
  <position>${this.selectedPosition}</position>
  <limit>${this.selectedChildren}</limit>
  <active>1</active>
  <children>
    <child lootmax="0" lootmin="0" max="1" min="1" type="${
      this.selectedLootModel ? this.selectedLootModel.split(" ")[0] : null
    }"></child>
  </children>
</event>
      `;
    },
  },
  data() {
    const selectableLootTypes = classNames
      .split("\n")
      .filter((className) => className.length > 0);
    const eventTypes = [
      {
        label: "Vehicle",
        value: "Vehicle",
      },
      {
        label: "Item",
        value: "Item",
      },
      {
        label: "Infected",
        value: "Infected",
      }
    ];
    const appVersion = process.env.PACKAGE_VERSION
    return {
      appVersion,
      selectedChildren: null,
      children: ['mixed', 'child', 'custom'],
      selectedPosition: null,
      positions: ['fixed', 'player'],
      selectedLootModel: null,
      selectedLootType: null,
      selectedLootTypes: [],
      selectableLootTypes,
      spawnNameSuffix: null,
      selectedEventType: null,
      eventTypes,
    };
  },
  mounted(){
    document.title = `DayZ Spawn Builder v${this.appVersion}`
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  margin: 25px;
  padding: 25px;
}
#app > h1 {
  font-size: 40px;
  margin-bottom: 15px;
}
</style>
