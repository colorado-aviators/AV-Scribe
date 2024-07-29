<script setup lang="ts">
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
    import CloudCoveragePicker from './components/CloudCoveragePicker.vue'
    import CeilingPicker from './components/CeilingPicker.vue'
    import TemperaturePicker from './components/TemperaturePicker.vue'
    import DewpointPicker from './components/DewpointPicker.vue'
    import AltimeterPicker from './components/AltimeterPicker.vue'
    import ElevationPicker from './components/ElevationPicker.vue'
    import DensityAltitude from './components/DensityAltitude.vue'
    import Transcript from './components/Transcript.vue'

    var airport = ref("");
    var information = ref("");
    var time = ref("");
    var windVariable = ref(false);
    var windVel = ref(0.0);
    var windDir = ref(0.0);
    var windGust = ref(0.0);
    var visibility = ref(10.0);
    var cloudCoverage = ref("");
    var ceiling = ref(0);
    var temperature = ref(0.0);
    var dewpoint = ref(0.0);
    var altimeter = ref(29.92);
    var elevation = ref(0);
    var densityAltitude = ref(0);
    var transcript = ref("");
</script>

<template>
  <header>
    <div>
      <h1 align="center">AVWX Scribe</h1>
      <Disclaimer/>
    </div>
  </header>

  <main align="center">
    <AirportPicker @emit-airport="(payload: string) => {airport = payload}"/>
    <InformationPicker @emit-information="(payload: string) => {information = payload}"/>
    <TimePicker @emit-time="(payload: string) => {time = payload}"/>
    <WindVariable @emit-wind-variable="(payload: boolean) => {windVariable = payload}"/>
    <WindDirPicker @emit-wind-dir="(payload: number) => {windDir = payload}" :disabled="windVariable"/>
    <WindVelPicker @emit-wind-vel="(payload: number) => {windVel = payload}"/>
    <WindGustPicker @emit-wind-gust="(payload: number) => {windGust = payload}" :disabled="!windVariable&&windVel==0.0"/>
    <VisibilityPicker @emit-visibility="(payload: number) => {visibility = payload}"/>
    <CloudCoveragePicker @emit-cloud-coverage="(payload: string) => {cloudCoverage = payload}"/>
    <CeilingPicker :cloud-coverage="cloudCoverage" @emit-ceiling="(payload: number) => {ceiling = payload}"/>
    <TemperaturePicker @emit-temperature="(payload: number) => {temperature = payload}"/>
    <DewpointPicker :temp="temperature" @emit-dewpoint="(payload: number) => {dewpoint = payload}"/>
    <AltimeterPicker @emit-altimeter="(payload: number) => {altimeter = payload}"/>
    <ElevationPicker @emit-elevation="(payload: number) => {elevation = payload}"/>
    <DensityAltitude
        @emit-density-altitude="(payload: number) => {densityAltitude = payload}"
        :elevation="elevation"
        :altimeter="altimeter"
        :dewpoint="dewpoint"
        :temperature="temperature"
    />
    <Transcript
        :information="information"
        :altimeter="altimeter"
        :airport="airport"
        :visibility="visibility"
        :cloudCoverage="cloudCoverage"
        :ceiling="ceiling"
        :time="time"
        :windDir="windDir"
        :windGust="windGust"
        :windVel="windVel"
        :windVariable="windVariable"
        :dewpoint="dewpoint"
        :temperature="temperature"
        :densityAltitude="densityAltitude"
    />
  </main>
  <footer>
    <p>Version: 0.3.1</p>
    <p>Author: McGregor Joyner</p>
  </footer>
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
    footer {
        text-align: right;
        margin-bottom: 12px;
    }
    footer>p {
        font-size: 12px;
    }
</style>
