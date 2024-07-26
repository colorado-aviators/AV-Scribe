<script setup lang="ts">
    import {ref, watch} from "vue"
    import { onUpdate } from '../lib/functions.js'

    const start = -1.0;
    const high = 201.0
    const low = 0.0;
    const optimum = 5.0;
    const gradient = 0.1;
    const sketchy = 15;
    const bad = 25;

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    var sliderText = ref("");
    function get_slider_text(val: number) {
        var rounded = Math.round(val);
        return 'Wind Velocity: ' + (rounded == 0.0 ? 'Calm' : `${rounded} KT`);
    };
    watch(realValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
    })
    sliderText.value = get_slider_text(realValue.value);
</script>

<template>
    <label id="windVelPickerLabel">
        <input @change="$emit('emitWindVel', realValue)"  class="custom-slider custom-slider-wind-vel" v-model="sliderValue" type="range" min="-1" max="1" step=".001" id="windVelPicker" />
    <span id="windVelPickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-wind-vel {
      accent-color: v-bind("cautionColor");
      background: v-bind("cautionColor");
    }
</style>
