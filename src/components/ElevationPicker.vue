<script setup lang="ts">
    import {ref, reactive} from "vue"
    import * as airport_data from '../lib/fetch_airport_data.ts'

    const title = "Field Elevation (ft MSL)"
    // https://en.wikipedia.org/wiki/List_of_highest_airports
    const high = 14472;  // Daocheng Yading Airport
    const low = -1266;  // Bar Yehuda Airfield
    const start = 0;
    const realValue = ref(0);
    const textColor = ref("var(--color-text-untouched)");
    const disabled = ref(false);

    const props = defineProps({
        airportData: {type: airport_data.AirportData, required: false, default: null},
    });

    function get_read_out() {
        return realValue.value.toFixed(0);
    };

    const emit = defineEmits<{
        (e: 'emitElevation', realValue: number): void
    }>()
    const onInput = () => {
        textColor.value = "var(--color-text)";
        realValue.value = Math.round(realValue.value)
        emit('emitElevation', realValue.value);
    }
    const styleObject = reactive({
        color: textColor,
    })

    if (props.airportData !== null){
        let elevation = props.airportData.elevation_in_feet;
        realValue.value = elevation == null ? 0 : elevation;
        disabled.value = elevation !== null;
        textColor.value = "var(--color-text)";
    }
</script>

<template>
    <div class="inputContainer">
        <label>
            <span class="title">
                {{ title }}:
            </span>
        </label>
        <div class="inputArea">
            <input
                id="elevationPicker"
                type="number"
                v-model.number="realValue"
                @input="onInput"
                :max="high"
                :min="low"
                inputmode="numeric"
                :style="styleObject"
                :disabled="disabled"
            >
        </div>
    </div>
</template>
