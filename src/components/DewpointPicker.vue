<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Dewpoint";
    const numDigits = 0;

    const gradient = ref(.9);
    const high = ref(weather_data.WeatherRecords.dewpointHigh.toNumber("C"));
    const low = ref(weather_data.WeatherRecords.dewpointLow.toNumber("C"));
    const optimum = ref(weather_data.StandardConditions.temperature.toNumber("C") - 5);
    const start = ref(weather_data.StandardConditions.temperature.toNumber("C") - 5);
    const sketchy = ref();
    const bad = ref();
    const realValue = ref(weather_data.StandardConditions.temperature.toNumber("C") - 5);

    const props = defineProps({
        wxModel: {type: weather_data.WeatherData, required: false, default: null},
        metarData: {type: weather_data.Metar, required: false, default: null},
        temperature: {type: Number, required: false, default: null},
    })

    function get_read_out() {
        return realValue.value + "\u00B0C";
    }

    const emit = defineEmits<{
        (e: 'emitDewpoint', realValue: number): void
    }>()
    const onInput = (val: number) => {
        let rounded = Math.round(val);
        realValue.value = rounded;
        emit('emitDewpoint', rounded);
    }

    watch(() => props.temperature, (newVal) => {
        if (newVal !== null) {
            sketchy.value = newVal - 5;
            bad.value = newVal;
        }
    })

    watch(() => props.wxModel, (newVal) => {
        if (props.metarData == null & newVal !== null){
            /* Admittedly, this involves some guess work.
            Setting the range of each input based on monthly average or average min / max
            is imperfect, but I've tried to leave a generous range to accommodate temporal extremes.
            */
            let meanMaxTemp = newVal.meanMaxTemp.toNumber("C");
            let meanMinTemp = newVal.meanMinTemp.toNumber("C");
            let meanMeanTemp = (meanMaxTemp + meanMinTemp) / 2;

            high.value = high.value < meanMaxTemp + 25 ? high.value : meanMaxTemp + 25;
            low.value = meanMinTemp - 25;
            optimum.value = meanMeanTemp - 5;
            start.value = meanMeanTemp - 5;
            gradient.value = .5;
        }
    })

    watch(() => props.metarData, (newVal) => {
        if (newVal !== null && newVal.dewpoint !== null){
            let lastValue = newVal.dewpoint.toNumeric("C");

            high.value = lastValue + 10;
            low.value = lastValue - 10;
            optimum.value = lastValue;
            start.value = lastValue;
            gradient.value = .5;
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
        :sketchy = "sketchy"
        :bad = "bad"
        :numDigits = "numDigits"
        @emit-value="(payload: number) => onInput(payload)"
        :readOut = "get_read_out()"
    />
</template>