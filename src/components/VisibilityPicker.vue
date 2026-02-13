<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Visibility"
    const displayUnit = "mile";
    const numDigits = 0;
    const defaultValue = 10;
    const start = ref(defaultValue);
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
        realValue.value = val;
        emit('emitVisibility', val);
    }

    watch(() => props.metarData, (newVal) => {
        let value = defaultValue;
        if (newVal !== null) {
            let field = newVal.visibility;
            if (field !== null) {
                if (typeof field.toNumeric === 'function') {
                    value = field.toNumeric(displayUnit);
                    if (value > high || value < low) {
                        value = defaultValue;
                    }
                }
            }
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
    />
</template>
