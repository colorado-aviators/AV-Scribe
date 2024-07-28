<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    import { onUpdate } from '../lib/slider-utils.js'

    const start = 1.0;
    const high = 10.0
    const low = 0.0;
    const optimum = 5.0;
    const gradient = 0.5;
    const sketchy = 5;
    const bad = 3;

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    var sliderText = ref("");

    function get_slider_text() {
        return `Visibility: ${realValue.value} SM`;
    };

    const emit = defineEmits<{
        (e: 'emitVisibility', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        sliderText.value = get_slider_text();
        emit('emitVisibility', realValue.value);
    }
    const styleObject = reactive({
        background: cautionColor,
        accentColor: cautionColor,
    })

    onInput();
</script>

<template>
    <label id="visibilityPickerLabel">
        <input
            id="visibilityPicker"
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider"
            :style="styleObject"
            min=-1
            max=1
            step=.001
        >
        <span id="visibilityPickerSpan" v-text="sliderText"></span>
    </label>
</template>
