<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as airport_data from '../lib/fetch_airport_data.ts'
    import * as weather_data from '../lib/fetch_weather_data.ts'

    const title = "Temperature";
    const numDigits = 0;

    const gradient = ref(.9);
    const high = ref(weather_data.WeatherRecords.temperatureHigh.toNumber("C"));
    const low = ref(weather_data.WeatherRecords.temperatureLow.toNumber("C"));
    const optimum = ref(weather_data.StandardConditions.temperature.toNumber("C"));
    const start = ref(weather_data.StandardConditions.temperature.toNumber("C"));
    const realValue = ref(weather_data.StandardConditions.temperature.toNumber("C"));

    const props = defineProps({
        airportData: {type: airport_data.AirportData, required: false, default: null},
    })

    function get_read_out() {
        return realValue.value + "\u00B0C";
    }

    const emit = defineEmits<{
        (e: 'emitTemperature', realValue: number): void
    }>()
    const onInput = (val) => {
        let rounded = Math.round(val);
        emit('emitTemperature', rounded);
        realValue.value = rounded;
    }

    if (props.airportData !== null){
        /* Admittedly, this involves some guess work.
        Setting the range of each input based on monthly average or average min / max
        is imperfect, but I've tried to leave a generous range to accommodate temporal extremes.
        */
        weather_data.loadWeatherData(props.airportData.location).then((weatherData) => {
            let meanMaxTemp = weatherData.meanMaxTemp.toNumber("C");
            let meanMinTemp = weatherData.meanMinTemp.toNumber("C");
            let meanMeanTemp = (meanMaxTemp + meanMinTemp) / 2;

            high.value = meanMaxTemp + 25;
            low.value = meanMinTemp - 25;
            optimum.value = meanMeanTemp;
            start.value = meanMeanTemp;
            gradient.value = .5;
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
