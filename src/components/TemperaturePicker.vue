<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    import { onUpdate } from '../lib/slider-utils.js'

    const sketchy = 100;
    const bad = 100;

    const start = 0;
    const high = 57;
    const low = -83;
    const optimum = 0;  // standard temperature
    const gradient = .9;
    const sliderText = ref("");

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    function get_slider_text() {
        return `Temperature: ${realValue.value}\u00B0C`;
    }

    const emit = defineEmits<{
        (e: 'emitTemperature', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        sliderText.value = get_slider_text();
        emit('emitTemperature', realValue.value);
    }
    const styleObject = reactive({
        background: cautionColor,
        accentColor: cautionColor
    })

    onInput();
</script>

<template>
    <label id="temperaturePickerLabel">
        <input
            id="temperaturePicker"
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider"
            :style="styleObject"
            min=-1
            max=1
            step=.001
        >
        <span id="temperaturePickerSpan" v-text="sliderText"></span>
    </label>
</template>