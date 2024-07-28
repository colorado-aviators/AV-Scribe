<script setup lang="ts">
    import {ref, watch, reactive } from "vue"
    import { onUpdate } from '../lib/slider-utils.js'

    const start = -1.0;
    const high = 201.0
    const low = 0.0;
    const optimum = 5.0;
    const gradient = 0.1;
    const sketchy = 15;
    const bad = 25;
    const sliderText = ref("");
    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    function get_slider_text() {
        return 'Wind Velocity: ' + (realValue.value == 0.0 ? 'Calm' : `${realValue.value} KT`);
    };

    const emit = defineEmits<{
        (e: 'emitWindVel', realValue: number): void
    }>()

    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        sliderText.value = get_slider_text();
        emit('emitWindVel', realValue.value);
    }

    const styleObject = reactive({
        background: cautionColor,
        accentColor: cautionColor,
    })

    sliderText.value = get_slider_text();
    onInput();
</script>

<template>
    <label id="windVelPickerLabel">
        <input
            id="windVelPicker"
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider custom-slider-wind-vel"
            :style="styleObject"
            min=-1
            max=1
            step=.001
        >
        <span id="windVelPickerSpan" v-text="sliderText"></span>
    </label>
</template>
