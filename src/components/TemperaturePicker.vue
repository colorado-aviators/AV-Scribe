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
    function get_slider_text(val: number) {
        var rounded = Math.round(val);
        return `Temperature: ${rounded}\u00B0C`;
    };
    watch(realValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
    })
    sliderText.value = get_slider_text(realValue.value);

    const emit = defineEmits<{
        (e: 'emitTemperature', realValue: number): void
    }>()
    const onChange = () => {
        emit('emitTemperature', realValue.value);
    }

    onChange();
</script>

<template>
    <label id="temperaturePickerLabel">
        <input
            id="temperaturePicker"
            type="range"
            v-model.number="sliderValue"
            @change="onChange"
            class="custom-slider custom-slider-temperature"
            min=-1
            max=1
            step=.001
        >
        <span id="temperaturePickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-temperature {
      accent-color: v-bind("cautionColor");
      background: v-bind("cautionColor");
    }
</style>
