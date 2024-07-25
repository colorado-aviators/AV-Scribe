<script setup language="ts">
    import {ref} from "vue"

    import Disclaimer from './components/Disclaimer.vue'
    import AirportPicker from './components/AirportPicker.vue'
    import InformationPicker from './components/InformationPicker.vue'
    import TimePicker from './components/TimePicker.vue'
    import WindVariable from './components/WindVariable.vue'
    import WindVelPicker from './components/WindVelPicker.vue'
    import WindDirPicker from './components/WindDirPicker.vue'
    import WindGustPicker from './components/WindGustPicker.vue'
    import VisibilityPicker from './components/VisibilityPicker.vue'
    import TemperaturePicker from './components/TemperaturePicker.vue'
    import DewpointPicker from './components/DewpointPicker.vue'
    import AltimeterPicker from './components/AltimeterPicker.vue'
    import Transcript from './components/Transcript.vue'

    var airport = ref("");
    var information = ref("");
    var time = ref("");
    var windVariable = ref(false);
    var windVel = ref(0.0);
    var windDir = ref(0.0);
    var windGust = ref(0.0);
    var visibility = ref(10.0);
    var temperature = ref(0.0);
    var dewpoint = ref(0.0);
    var altimeter = ref(29.92);
    var transcript = ref("");
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <div>
      <h1 align="center">AVWX Scribe</h1>
      <Disclaimer/>
    </div>
  </header>

  <main>
    <AirportPicker @emit-airport="(payload) => {airport = payload}"/>
    <InformationPicker @emit-information="(payload) => {information = payload}"/>
    <TimePicker @emit-time="(payload) => {time = payload}"/>
    <WindVariable @windVariable="(payload) => {windVariable = payload}"/>
    <WindVelPicker @emit-windVel="(payload) => {windVel = payload}"/>
    <WindDirPicker @emit-windDir="(payload) => {windDir = payload}" v-if="!windVariable&windVel>0.0"/>
    <WindGustPicker @emit-windGust="(payload) => {windGust = payload}" v-if="windVariable|windVel>0.0"/>
    <VisibilityPicker @emit-visibility="(payload) => {visibility = payload}"/>
    <TemperaturePicker @emit-temperature="(payload) => {temperature = payload}"/>
    <DewpointPicker :temp="temperature" @emit-dewpoint="(payload) => {dewpoint = payload}"/>
    <AltimeterPicker @emit-altimeter="(payload) => {altimeter = payload}"/>
    <Transcript
        :information="information"
        :altimeter="altimeter"
        :airport="airport"
        :visibility="visibility"
        :time="time"
        :windDir="windDir"
        :windGust="windGust"
        :windVel="windVel"
        :windVariable="windVariable"
        :dewpoint="dewpoint"
        :temperature="temperature"
    />
  </main>
</template>

<style scoped>
    h1 {
        font-size: 72px;
    }

    header {
      line-height: 1.5;
    }

    .logo {
      display: block;
      margin: 0 auto 2rem;
    }

    @media (min-width: 1024px) {
      header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
      }

      .logo {
        margin: 0 2rem 0 0;
      }

      header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
      }
    }
</style>
