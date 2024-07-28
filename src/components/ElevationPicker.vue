<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    import { onUpdate } from '../lib/slider-utils.js'

    const sketchy = 100000;
    const bad = 100000;

    // https://en.wikipedia.org/wiki/List_of_highest_airports
    const high = 14472;  // Daocheng Yading Airport
    const low = -1266;  // Bar Yehuda Airfield
    // standard pressure at sea level
    const optimum = 3000;
    const gradient = .4;
    const start = 0;
    const sliderText = ref("");

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    function get_slider_text() {
        return `Field Elevation: ${realValue.value.toFixed(0)}`;
    };

    const emit = defineEmits<{
        (e: 'emitElevation', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value)
        sliderText.value = get_slider_text();
        emit('emitElevation', realValue.value);
    }
    const styleObject = reactive({
        background: cautionColor,
        accentColor: cautionColor,
    })

    onInput();
</script>

<template>
    <label id="elevationPickerLabel">
        <input
            id="elevationPicker"
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider custom-slider-elevation"
            :style="styleObject"
            min=-1
            max=1
            step=.001
        >
        <span id="elevationPickerSpan" v-text="sliderText"></span>
    </label>
</template>
