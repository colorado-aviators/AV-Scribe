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
    <div>
      <h1 align="center">AVWX Scribe</h1>
      <Disclaimer/>
    </div>
  </header>

  <main align="center">
    <AirportPicker @emit-airport="(payload: string) => {airport = payload}"/>
    <InformationPicker @emit-information="(payload: string) => {information = payload}"/>
    <TimePicker @emit-time="(payload: string) => {time = payload}"/>
    <WindVariable @windVariable="(payload: boolean) => {windVariable = payload}"/>
    <WindVelPicker @emit-windVel="(payload: number) => {windVel = payload}"/>
    <WindDirPicker @emit-windDir="(payload: number) => {windDir = payload}" v-if="!windVariable&&windVel>0.0"/>
    <WindGustPicker @emit-windGust="(payload: number) => {windGust = payload}" v-if="windVariable||windVel>0.0"/>
    <VisibilityPicker @emit-visibility="(payload: number) => {visibility = payload}"/>
    <TemperaturePicker @emit-temperature="(payload: number) => {temperature = payload}"/>
    <DewpointPicker :temp="temperature" @emit-dewpoint="(payload: number) => {dewpoint = payload}"/>
    <AltimeterPicker @emit-altimeter="(payload: number) => {altimeter = payload}"/>
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
