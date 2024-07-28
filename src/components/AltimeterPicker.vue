<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    import { onUpdate } from '../lib/slider-utils.js'

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
    const sliderText = ref("");

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    function get_slider_text() {
        return `Altimeter Setting: ${realValue.value.toFixed(2)}`;
    };
    const emit = defineEmits<{
        (e: 'emitAltimeter', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value*100)/100;
        sliderText.value = get_slider_text();
        emit('emitAltimeter', realValue.value);
    }
    const styleObject = reactive({
        background: cautionColor,
        accentColor: cautionColor,
    })

    realValue.value = 29.92;
    onInput();
</script>

<template>
    <label id="altimeterPickerLabel">
        <input
            id="altimeterPicker"
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider custom-slider-altimeter"
            :style="styleObject"
            min=-1
            max=1
            step=.001
        >
        <span id="altimeterPickerSpan" v-text="sliderText"></span>
    </label>
</template>
