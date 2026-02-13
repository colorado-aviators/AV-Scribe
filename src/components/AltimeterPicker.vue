<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Altimeter"
    const numDigits = 2;
    const displayUnit = "inHg";
    const defaultValue = weather_data.StandardConditions.pressure.toNumber(displayUnit);

    const gradient = ref(.9);
    const high = ref(weather_data.WeatherRecords.altimeterSettingHigh.toNumber(displayUnit));
    const low = ref(weather_data.WeatherRecords.altimeterSettingLow.toNumber(displayUnit));
    const optimum = ref(defaultValue);
    const start = ref(defaultValue);
    const realValue = ref(defaultValue);

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
        realValue.value = val;
        emit('emitAltimeter', val);
    }

    watch(() => props.wxModel, (newVal) => {
        if (props.metarData == null && newVal !== null){
            let meanVal = newVal.altimeterSetting.toNumber(displayUnit);

            high.value = meanVal + 1.0;
            low.value = meanVal - 1.0;
            optimum.value = meanVal;
            start.value = meanVal;
            gradient.value = .85;
        }
    })
    watch(() => props.metarData, (newVal) => {
        let value = defaultValue;
        if (newVal !== null) {
            if (newVal.altimeterSetting !== null) {
                value = newVal.altimeterSetting.toNumber(displayUnit);

                high.value = value + 0.2;
                low.value = value - 0.2;
                optimum.value = value;
                start.value = value;
                gradient.value = .85;
            }
        }
        onInput(value);
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
