<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as airport_data from '../lib/fetch_airport_data.ts'
    import * as weather_data from '../lib/fetch_weather_data.ts'

    const title = "Altimeter"
    const numDigits = 2;

    const gradient = ref(.9);
    const high = ref(weather_data.WeatherRecords.altimeterSettingHigh.toNumber("inHg"));
    const low = ref(weather_data.WeatherRecords.altimeterSettingLow.toNumber("inHg"));
    const optimum = ref(weather_data.StandardConditions.pressure.toNumber("inHg"));
    const start = ref(weather_data.StandardConditions.pressure.toNumber("inHg"));
    const realValue = ref(weather_data.StandardConditions.pressure.toNumber("inHg"));

    const props = defineProps({
        airportData: {type: airport_data.AirportData, required: false, default: null},
    })

    function get_read_out() {
        return realValue.value.toFixed(numDigits);
    };

    const emit = defineEmits<{
        (e: 'emitAltimeter', realValue: number): void
    }>()
    const onInput = (val) => {
        let resolution = 10 ** numDigits;
        let rounded = Math.round(val * resolution) / resolution;
        emit('emitAltimeter', rounded);
        realValue.value = rounded;
    }
    if (props.airportData !== null){
        weather_data.loadWeatherData(props.airportData.location).then((weatherData) => {
            let meanVal = weatherData.altimeterSetting.toNumber("inHg");

            high.value = meanVal + 1.0;
            low.value = meanVal - 1.0;
            optimum.value = meanVal;
            start.value = meanVal;
            gradient.value = .85;
        }).catch((error) => console.error(error));
    }
</script>

<template>
    <CustomRange
        :title = "title"
        :start = "start"
        :high = "high"
        :low = "low"
        :optimum = "optimum"
        :gradient = "gradient"
        :numDigits = "numDigits"
        @emit-value="(payload: number) => onInput(payload)"
        :readOut = "get_read_out()"
    />
</template>
