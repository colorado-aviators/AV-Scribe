<script setup lang="ts">
    import {ref, watch} from "vue"
    import { onUpdate } from '../lib/functions.js'

    const sketchy = 100;
    const bad = 100;

    const start = 0;
    const high = 57;
    const low = -83;
    const optimum = 0;  // standard temperature
    const gradient = .9;

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    var sliderText = ref("");
    function get_slider_text(val) {
        var rounded = Math.round(val, 1);
        return `Temperature: ${rounded}\u00B0C`;
    };
    watch(realValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
    })
    sliderText.value = get_slider_text(realValue.value);
</script>

<template>
    <label id="temperaturePickerLabel">
        <input @change="$emit('emitTemperature', realValue)" class="custom-slider custom-slider-temperature" v-model="sliderValue" type="range" min="-1" max="1" step=".001" id="temperaturePicker" />
    <span id="temperaturePickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-temperature {
      accent-color: v-bind("cautionColor");
      background: v-bind("cautionColor");
    }
</style>
