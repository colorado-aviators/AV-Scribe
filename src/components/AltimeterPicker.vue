<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Altimeter"
    const numDigits = 2;

    const gradient = ref(.9);
    const high = ref(weather_data.WeatherRecords.altimeterSettingHigh.toNumber("inHg"));
    const low = ref(weather_data.WeatherRecords.altimeterSettingLow.toNumber("inHg"));
    const optimum = ref(weather_data.StandardConditions.pressure.toNumber("inHg"));
    const start = ref(weather_data.StandardConditions.pressure.toNumber("inHg"));
    const realValue = ref(weather_data.StandardConditions.pressure.toNumber("inHg"));

    const props = defineProps({
        wxModel: {type: weather_data.WeatherData, required: false, default: null},
        metarData: {type: weather_data.Metar, required: false, default: null},
    })

    function get_read_out() {
        return realValue.value.toFixed(numDigits);
    };

    const emit = defineEmits<{
        (e: 'emitAltimeter', realValue: number): void
    }>()
    const onInput = (val: number) => {
        let resolution = 10 ** numDigits;
        let rounded = Math.round(val * resolution) / resolution;
        emit('emitAltimeter', rounded);
        realValue.value = rounded;
    }

    watch(() => props.wxModel, (newVal) => {
        if (props.metarData == null & newVal !== null){
            let meanVal = newVal.altimeterSetting.toNumber("inHg");

            high.value = meanVal + 1.0;
            low.value = meanVal - 1.0;
            optimum.value = meanVal;
            start.value = meanVal;
            gradient.value = .85;
        }
    })
    watch(() => props.metarData, (newVal) => {
        if (newVal !== null && newVal.altimeterSetting !== null){
            let lastValue = newVal.altimeterSetting.toNumber("inHg");

            high.value = lastValue + 0.2;
            low.value = lastValue - 0.2;
            optimum.value = lastValue;
            start.value = lastValue;
            gradient.value = .85;
        }
    })
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
