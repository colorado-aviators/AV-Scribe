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
    function get_slider_text(val: number) {
        var rounded = Math.round(val);
        return `Visibility: ${rounded} SM`;
    };
    watch(realValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
    })
    sliderText.value = get_slider_text(realValue.value);

    const emit = defineEmits<{
        (e: 'emitVisibility', realValue: number): void
    }>()
    const onChange = () => {
        emit('emitVisibility', realValue.value);
    }
    onChange();
</script>

<template>
    <label id="visibilityPickerLabel">
        <input
            id="visibilityPicker"
            type="range"
            v-model.number="sliderValue"
            @change="onChange"
            class="custom-slider custom-slider-visibility"
            min=-1
            max=1
            step=.001
        >
        <span id="visibilityPickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-visibility {
      accent-color: v-bind("cautionColor");
      background: v-bind("cautionColor");
    }
</style>
