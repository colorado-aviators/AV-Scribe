<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'
    import * as weather_data from '../lib/fetch_weather_data'

    const title = "Wind Dir"
    const displayUnit = "deg";
    const numDigits = -1;
    const defaultValue = 360;
    const start = ref(defaultValue);
    const high = 360;
    const low = 10;
    const realValue = ref(high);

    const props = defineProps({
        disabled: Boolean,
        metarData: {type: weather_data.Metar, required: false, default: null},
    });

    function get_read_out() {
        var text = 'Wind Dir: '
        var formattedDirection = realValue.value.toString().padStart(3, '0') + '\u00B0';
        return props.disabled ? "VARIABLE" : formattedDirection;
    };

    const emit = defineEmits<{
        (e: 'emitWindDir', realValue: number): void
    }>()

    const onInput = (val: number) => {
        realValue.value = val;
        emit('emitWindDir', val);
    }

    watch(() => props.metarData, (newVal) => {
        let value = defaultValue;
        if (newVal !== null) {
            let field = newVal.windDirection;
            if (field !== null) {
                if (typeof field.toNumber === 'function') {
                    value = field.toNumber(displayUnit);
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
        :numDigits = "numDigits"
        @emit-value="(payload: number) => onInput(payload)"
        :readOut = "get_read_out()"
        :disabled="disabled"
    />
</template>
