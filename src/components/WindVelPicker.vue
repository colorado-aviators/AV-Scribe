<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Wind Velocity"
    const displayUnit = "kt";
    const defaultValue = 0;
    const start = ref(defaultValue);
    const high = ref(201.0);
    const low = 0.0;
    const optimum = ref(5.0);
    const gradient = 0.1;
    const sketchy = 15;
    const bad = 25;
    const realValue = ref();

    const props = defineProps({
        metarData: {type: weather_data.Metar, required: false, default: null},
    });

    function get_read_out() {
        return realValue.value == 0.0 ? 'Calm' : `${realValue.value} KT`;
    }

    const emit = defineEmits<{
        (e: 'emitWindVel', realValue: number): void
    }>()

    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        emit('emitWindVel', realValue.value);
    }

    watch(() => props.metarData, (newVal) => {
        let value = defaultValue;
        if (newVal !== null) {
            let field = newVal.windSpeed;
            if (field !== null) {
                if (typeof field.toNumeric === 'function') {
                    value = field.toNumeric(displayUnit);
                    if (value > high.value || value < low) {
                        value = defaultValue;
                    }
                    else {
                        high.value = Math.max(value, 10) * 2
                        optimum.value = value;
                    }
                }
            }
        }
        start.value = value;
        emit('emitWindVel', value);
    })

    onInput();
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
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload; onInput();}"
        :readOut = "get_read_out()"
    />
</template>
