<script setup>
    import {ref, watch} from "vue"
    import { onUpdate } from '../lib/functions.js'

    const sketchy = 100;
    const bad = 100;

    // https://www.wunderground.com/blog/weatherhistorian/world-and-us-anticyclonic-high-barometric-pressure-records.html
    const high = 32.01;  // Agata, Russia (in Siberia) registered on December 31, 1968
    // https://www.wunderground.com/blog/weatherhistorian/world-and-us-lowest-barometric-pressure-records.html
    // record excludes tropical storms
    // const low = 25.69;  // Guam, Super Typhoon "Tip" 10/12/1979
    const low = 27.31;  // Dutch Harbor, AK, on 10/25/1977
    // standard pressure at sea level
    const optimum = 29.92;
    const gradient = .9;
    const start = 0;

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    var sliderText = ref("");
    function get_slider_text(val) {
        var rounded = val.toFixed(2);
        return `Altimeter Setting: ${rounded}`;
    };
    watch(realValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
    })
    sliderText.value = get_slider_text(realValue.value);
</script>

<template>
    <label id="altimeterPickerLabel">
        <input @change="$emit('emitAltimeter', realValue)" class="custom-slider custom-slider-altimeter" v-model="sliderValue" type="range" min="-1" max="1" step=".001" id="altimeterPicker" />
    <span id="altimeterPickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-altimeter {
      accent-color: v-bind("cautionColor");
      background: v-bind("cautionColor");
    }
</style>
