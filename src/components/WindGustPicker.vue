<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Wind Gust";
    const displayUnit = "kt";
    const defaultValue = 0;
    const numDigits = 0;
    const start = ref(defaultValue);
    const high = ref(201.0);
    const low = 0.0;
    const optimum = ref(5.0);
    const gradient = 0.1;
    const sketchy = 15;
    const bad = 25;
    const realValue = ref();

    const props = defineProps({
        disabled: Boolean,
        metarData: {type: weather_data.Metar, required: false, default: null},
    });

    function get_read_out() {
        return realValue.value == 0.0 ? 'None' : `${realValue.value} KT`;
    };

    const emit = defineEmits<{
        (e: 'emitWindGust', realValue: number): void
    }>()

    const onInput = (val: number) => {
        realValue.value = val;
        emit('emitWindGust', realValue.value);
    }

    watch(() => props.metarData, (newVal) => {
        let value = defaultValue;
        if (newVal !== null) {
            let field = newVal.windGust;
            if (field !== null) {
                if (typeof field.toNumber === 'function') {
                    value = field.toNumber(displayUnit);
                    if (value > high.value || value < low) {
                        value = defaultValue;
                    }
                }
            }
            high.value = Math.max(value, 10) * 2
            optimum.value = value;
        }
        start.value = value;
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
        :sketchy = "sketchy"
        :bad = "bad"
        :numDigits = "numDigits"
        @emit-value="(payload: number) => onInput(payload)"
        :readOut = "get_read_out()"
        :disabled=props.disabled
    />
</template>
