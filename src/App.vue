<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import * as math from "mathjs"

    import * as airport_data from "./lib/fetch_airport_data"
    import * as weather_data from "./lib/fetch_weather_data"

    import Disclaimer from './components/Disclaimer.vue'
    import AirportPicker from './components/AirportPicker.vue'
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

    /*
    These references set the active slider ranges for each input.
    They can be updated using local historical averages via useAirportData()
    */
    var temperatureLow = ref();
    var temperatureHigh = ref();
    var temperatureOptimum = ref();
    var temperatureGradient = ref();
    var dewpointLow = ref();
    var dewpointHigh = ref();
    var dewpointBad = ref();
    var dewpointSketchy = ref();
    var altimeterLow = ref();
    var altimeterHigh = ref();
    var altimeterOptimum = ref();
    var altimeterGradient = ref();

    // These references will be used to capture the user's input and dispatch it to the transcript
    var airport = ref();
    var information = ref();
    var time = ref();
    var windCondition = ref();
    var windVel = ref();
    var windDir = ref();
    var windGust = ref();
    var visibility = ref();
    var cloudCoverage = ref();
    var ceiling = ref();
    var temperature = ref();
    var dewpoint = ref();
    var altimeter = ref();
    var elevation = ref();
    var remarks = ref();
    var densityAltitude = ref();
    var transcript = ref();

    function setDefaults() {
        temperatureLow.value = weather_data.WeatherRecords.temperatureLow.toNumber("C");
        temperatureHigh.value = weather_data.WeatherRecords.temperatureHigh.toNumber("C");
        temperatureOptimum.value = weather_data.StandardConditions.temperature.toNumber("C");
        temperatureGradient.value = .9;
        dewpointLow.value = weather_data.WeatherRecords.dewpointLow.toNumber("C");
        dewpointHigh.value = weather_data.WeatherRecords.dewpointHigh.toNumber("C");
        altimeterLow.value = weather_data.WeatherRecords.altimeterSettingLow.toNumber("inHg");
        altimeterHigh.value = weather_data.WeatherRecords.altimeterSettingHigh.toNumber("inHg");
        altimeterOptimum.value = weather_data.StandardConditions.pressure.toNumber("inHg");
        altimeterGradient.value = .9;
        airport.value = "";
        information.value = "";
        time.value = "";
        windCondition.value = "";
        windVel.value = 0;
        windDir.value = 0;
        windGust.value = 0;
        visibility.value = 0;
        cloudCoverage.value = "";
        ceiling.value = 0;
        temperature.value = Infinity;
        dewpoint.value = 0;
        altimeter.value = 0;
        elevation.value = 0;
        remarks.value = "";
        densityAltitude.value = 0;
        transcript.value = "";
    }

    function isWindVariable() {
        return windCondition.value == "Variable";
    }

    function isWindCalm() {
        return windVel.value == 0.0;
    }

    function updateWeatherRanges(weatherData: weather_data.WeatherData) {
        /* Admittedly, this involves some guess work.
        Setting the range of each input based on monthly average or average min / max
        is imperfect, but I've tried to leave a generous range to accommodate temporal extremes.
        */
        temperatureLow.value = math.evaluate(`${weatherData.meanMinTemp} - 25 C`).toNumber("C");
        temperatureHigh.value = math.evaluate(`${weatherData.meanMaxTemp} + 25 C`).toNumber("C");
        let meanMeanTemp = math.evaluate(`mean(${weatherData.meanMinTemp}, ${weatherData.meanMaxTemp})`);
        temperatureOptimum.value = meanMeanTemp.toNumber("C");
        temperature.value = meanMeanTemp.toNumber("C");
        temperatureGradient.value = .5;

        dewpointHigh.value = dewpointHigh.value < temperatureHigh.value? dewpointHigh.value : temperatureHigh.value;
        dewpointLow.value = temperatureLow.value;

        altimeterLow.value = math.evaluate(`${weatherData.altimeterSetting} - 1.0 inHg`).toNumber("inHg");
        altimeterHigh.value = math.evaluate(`${weatherData.altimeterSetting} + 1.0 inHg`).toNumber("inHg");
        altimeterOptimum.value = weatherData.altimeterSetting.toNumber("inHg");
        altimeter.value = weatherData.altimeterSetting.toNumber("inHg");
        altimeterGradient.value = .85;
    }

    function useAirportData(airportData: airport_data.AirportData) {
        /*
        Based on the airport, we can retrieve some cached data to update slider ranges.
        */
        setDefaults();
        airport.value = airportData.id;
        if (typeof airportData.elevation_in_feet !== 'undefined'){
            elevation.value = airportData.elevation_in_feet;
        }
        if (typeof airportData.location !== 'undefined' && airportData.location !== null){
            weather_data.loadWeatherData(airportData.location).then((weatherData) => {
                updateWeatherRanges(weatherData);
            }).catch((error) => console.error(error));
        }
    }

    function useTemperature(val: number) {
        temperature.value = val;
        dewpointSketchy.value = val - 5;
        dewpointBad.value = val;
    }

    export type UserTheme = 'light' | 'dark';
    const userTheme = ref("");
    function setTheme(theme: UserTheme) {
        console.log("Setting theme:" + theme)
        localStorage.setItem('user-theme', theme);
        userTheme.value = theme;
        document.documentElement.className = theme;
    }

    setDefaults();
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
    <AirportPicker @emit-airport="(payload: airport_data.AirportData) => useAirportData(payload)"/>
    <ElevationPicker
        @emit-elevation="(payload: number) => {elevation = payload}"
        :elevation-cached="elevation"
    />
    <InformationPicker @emit-information="(payload: string) => {information = payload}"/>
    <TimePicker @emit-time="(payload: string) => {time = payload}"/>
    <WindCondition @emit-wind-condition="(payload: string) => {windCondition = payload}"/>
    <WindDirPicker
        @emit-wind-dir="(payload: number) => {windDir = payload}"
        :disabled="isWindVariable()"
    />
    <WindVelPicker @emit-wind-vel="(payload: number) => {windVel = payload}"/>
    <WindGustPicker
        @emit-wind-gust="(payload: number) => {windGust = payload}"
        :disabled="isWindCalm() && !isWindVariable()"
    />
    <VisibilityPicker @emit-visibility="(payload: number) => {visibility = payload}"/>
    <CloudCoveragePicker @emit-cloud-coverage="(payload: string) => {cloudCoverage = payload}"/>
    <CeilingPicker
        @emit-ceiling="(payload: number) => {ceiling = payload}"
        :cloud-coverage="cloudCoverage"
    />
    <TemperaturePicker
        @emit-temperature="(payload: number) => useTemperature(payload)"
        :gradient="temperatureGradient"
        :optimum="temperatureOptimum"
        :low="temperatureLow"
        :high="temperatureHigh"
    />
    <DewpointPicker
        @emit-dewpoint="(payload: number) => {dewpoint = payload}"
        :gradient="temperatureGradient"
        :optimum="temperatureOptimum"
        :low="dewpointLow"
        :high="dewpointHigh"
        :bad="dewpointBad"
        :sketchy="dewpointSketchy"
    />
    <AltimeterPicker
        @emit-altimeter="(payload: number) => {altimeter = payload}"
        :gradient="altimeterGradient"
        :optimum="altimeterOptimum"
        :low="altimeterLow"
        :high="altimeterHigh"
    />
    <Remarks @emit-remarks="(payload: string) => {remarks = payload}"/>
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
