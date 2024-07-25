<script setup lang="ts">
    import {ref, watch} from "vue"
    import { onUpdate } from '../lib/functions.js'

    const start = 1.0;
    const high = 10.0
    const low = 0.0;
    const optimum = 5.0;
    const gradient = 0.5;
    const sketchy = 5;
    const bad = 3;

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    var sliderText = ref("");
    function get_slider_text(val) {
        var rounded = Math.round(val, 1);
        return `Visibility: ${rounded} SM`;
    };
    watch(realValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
    })
    sliderText.value = get_slider_text(realValue.value);
</script>

<template>
    <label id="visibilityPickerLabel">
        <input @change="$emit('emitVisibility', realValue)" class="custom-slider custom-slider-visibility" v-model="sliderValue" type="range" min="-1" max="1" step=".001" id="visibilityPicker" />
    <span id="visibilityPickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-visibility {
      accent-color: v-bind("cautionColor");
      background: v-bind("cautionColor");
    }
</style>
