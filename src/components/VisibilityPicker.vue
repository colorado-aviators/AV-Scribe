<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Visibility"
    const numDigits = 0;

    const start = ref(10);
    const high = 10.0;
    const low = 0.0;
    const optimum = 5.0;
    const gradient = 0.5;
    const sketchy = 5;
    const bad = 3;
    const realValue = ref(10);

    const props = defineProps({
        metarData: {type: weather_data.Metar, required: false, default: null},
    })

    function get_read_out() {
        return `${realValue.value} SM`;
    };

    const emit = defineEmits<{
        (e: 'emitVisibility', realValue: number): void
    }>()
    const onInput = (val: number) => {
        let rounded = Math.round(val);
        realValue.value = rounded;
        emit('emitVisibility', rounded);
    }

    watch(() => props.metarData, (newVal) => {
        if (newVal === null) {
            return;
        }
        if (newVal.visibility === null) {
            return;
        }
        if (typeof newVal.visibility.toNumeric !== 'function') {
            return;
        }
        let miles = newVal.visibility.toNumeric("mile");
        if (miles > high.value || miles < low.value) {
            return;
        }
        start.value = miles;
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
