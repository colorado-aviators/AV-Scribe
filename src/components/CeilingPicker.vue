<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Ceiling"
    const displayUnit = "feet";
    const defaultValue = 0;
    const start = ref(defaultValue);
    const realValue = ref(0);
    const high = 20000;
    const low = 0;
    const optimum = 5000;
    const gradient = 0.4;
    const sketchy = 3000;
    const bad = 1000;
    const disabled = ref(true);
    const disablingCoverages = ["SKC", "NCD", "CLR", "VV"];

    const props = defineProps({
        cloudCoverage: {
            type: String,
            default: "SKC",
            required: true,
        },
        metarData: {type: weather_data.Metar, required: false, default: null},
    });

    function get_read_out() {
        let valid = `${Math.round(realValue.value / 100).toFixed(0).padStart(3, '0')} (x 100 ft)`;
        return disabled.value ? "NONE" : valid;
    };

    const emit = defineEmits<{
        (e: 'emitCeiling', ceiling: number): void
    }>()

    const onInput = (val) => {
        realValue.value = val;
        emit('emitCeiling', val);
    }

    watch(() => props.cloudCoverage, (newVal) => {
        if (disablingCoverages.includes(newVal)) {
            disabled.value = true;
            start.value = defaultValue;
            realValue.value = defaultValue;
        }
        else {
            disabled.value = false;
        }
    })
    watch(() => props.metarData, (newVal) => {
        let value = defaultValue;
        if (newVal !== null) {
            let field = newVal.cloudBase;
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
        :numDigits = -2
        @emit-value="(payload: number) => onInput(payload)"
        :readOut = "get_read_out()"
        :disabled = "disabled"
    />
</template>
