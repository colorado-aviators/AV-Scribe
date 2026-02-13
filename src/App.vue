<script setup lang="ts">
    import { ref, onMounted } from 'vue';

    import * as airport_data from "./lib/fetch_airport_data"
    import * as weather_data from './lib/fetch_weather_data'

    import Disclaimer from './components/Disclaimer.vue'
    import AirportPicker from './components/AirportPicker.vue'
    import AirportStatus from './components/AirportStatus.vue'
    import InformationPicker from './components/InformationPicker.vue'
    import TimePicker from './components/TimePicker.vue'
    import WindCondition from './components/WindCondition.vue'
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
    import Remarks from './components/Remarks.vue'
    import DensityAltitude from './components/DensityAltitude.vue'
    import Transcript from './components/Transcript.vue'
    import Logo from './components/Logo.vue'

    // These references will be used to capture the user's input and dispatch it to the transcript
    var airportID = ref("");
    var airportData = ref();
    var wxModel = ref();
    var metarData = ref();
    var information = ref("");
    var time = ref("");
    var windCondition = ref("");
    var windVel = ref(0);
    var windDir = ref(0);
    var windGust = ref(0);
    var visibility = ref(0);
    var cloudCoverage = ref("");
    var ceiling = ref(0);
    var temperature = ref(0);
    var dewpoint = ref(0);
    var altimeter = ref(0);
    var elevation = ref(0);
    var remarks = ref("");
    var densityAltitude = ref(0);
    var transcript = ref("");

    function isWindVariable() {
        return windCondition.value == "Variable";
    }

    function isWindCalm() {
        return windVel.value == 0.0;
    }

    export type UserTheme = 'light' | 'dark';
    const userTheme = ref("");
    function setTheme(theme: UserTheme) {
        console.log("Setting theme:" + theme)
        localStorage.setItem('user-theme', theme);
        userTheme.value = theme;
        document.documentElement.className = theme;
    }

    function switchAirport(newAirportData: airport_data.AirportData) {
        airportData.value = newAirportData;
        if (newAirportData == null) {
            airportID = '';
        }
        else {
            if (newAirportData.location !== null) {
                wxModel.value = null;
                weather_data.loadWeatherData(newAirportData.location).then((response) => {
                    wxModel.value = response;
                }).catch((error) => console.error(error));
                metarData.value = null;
                weather_data.loadMetar(newAirportData.icao, newAirportData.location).then((response) => {
                    metarData.value = response;
                }).catch((error) => console.error(error));
            }
            airportID = newAirportData.id;
        }
    }

    const colorSchemeIsDark = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeIsDark.addEventListener('change', e => {
        setTheme(e.matches ? 'dark' : 'light');
    });
    onMounted(() => setTheme(colorSchemeIsDark.matches ? 'dark' : 'light'));
</script>

<template>
  <header>
    <Logo :user-theme="userTheme"/>
    <Disclaimer/>
  </header>

  <main align="center">
    <AirportPicker @emit-airport="(payload: airport_data.AirportData | null) => {switchAirport(payload)}"/>
    <AirportStatus
        :metarData="metarData"
        :wxModel="wxModel"
        :key="airportID"
    />
    <ElevationPicker
        @emit-elevation="(payload: number) => {elevation = payload}"
        :airportData="airportData"
        :key="airportID"
    />
    <InformationPicker @emit-information="(payload: string) => {information = payload}" :key="airportID"/>
    <TimePicker @emit-time="(payload: string) => {time = payload}" :key="airportID"/>
    <WindCondition @emit-wind-condition="(payload: string) => {windCondition = payload}" :key="airportID"/>
    <WindDirPicker
        @emit-wind-dir="(payload: number) => {windDir = payload}"
        :disabled="isWindVariable()"
        :metarData="metarData"
        :key="airportID"
    />
    <WindVelPicker
        @emit-wind-vel="(payload: number) => {windVel = payload}"
        :metarData="metarData"
        :key="airportID"
    />
    <WindGustPicker
        @emit-wind-gust="(payload: number) => {windGust = payload}"
        :disabled="isWindCalm() && !isWindVariable()"
        :metarData="metarData"
        :key="airportID"
    />
    <VisibilityPicker
        @emit-visibility="(payload: number) => visibility = payload"
        :metarData="metarData"
        :key="airportID"
    />
    <CloudCoveragePicker
        @emit-cloud-coverage="(payload: string) => {cloudCoverage = payload}"
        :metarData="metarData"
        :key="airportID"
    />
    <CeilingPicker
        @emit-ceiling="(payload: number) => {ceiling = payload}"
        :cloud-coverage="cloudCoverage"
        :metarData="metarData"
        :key="airportID"
    />
    <TemperaturePicker
        @emit-temperature="(payload: number) => temperature = payload"
        :wxModel="wxModel"
        :metarData="metarData"
        :key="airportID"
    />
    <DewpointPicker
        @emit-dewpoint="(payload: number) => dewpoint = payload"
        :wxModel="wxModel"
        :metarData="metarData"
        :key="airportID"
        :temperature="temperature"
    />
    <AltimeterPicker
        @emit-altimeter="(payload: number) => altimeter = payload"
        :key="airportID"
        :wxModel="wxModel"
        :metarData="metarData"
    />
    <Remarks @emit-remarks="(payload: string) => {remarks = payload}" :key="airportID"/>
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
        :airportID="airportID"
        :visibility="visibility"
        :cloudCoverage="cloudCoverage"
        :ceiling="ceiling"
        :time="time"
        :windDir="windDir"
        :windGust="windGust"
        :windVel="windVel"
        :windCondition="windCondition"
        :dewpoint="dewpoint"
        :temperature="temperature"
        :densityAltitude="densityAltitude"
        :remarks="remarks"
    />
  </main>
  <footer>
    <a href="https://github.com/colorado-aviators/AV-Scribe/wiki/UI-guide">User Guide</a>
    <p>Version: 0.7.1</p>
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
    footer {
        text-align: right;
        margin-bottom: 12px;
    }
    footer>p {
        font-size: 12px;
    }
</style>
