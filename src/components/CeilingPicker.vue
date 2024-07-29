<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    import { onUpdate } from '../lib/slider-utils.js'

    const start = 1.0;
    const high = 20000;
    const low = 0;
    const optimum = 5000;
    const gradient = 0.8;
    const sketchy = 3000;
    const bad = 1000;
    const disabledSliderColor = "rgba(255.0,255.0,255.0,.1)";
    const sliderText = ref("");
    const sliderColor = ref(disabledSliderColor);
    const disabled = ref(true);
    const disablingCoverages = ["SKC", "NCD", "CLR", "VV"];

    const props = defineProps({
        cloudCoverage: String,
    });

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    function set_slider_text() {
        let valid = `${Math.round(realValue.value / 100).toFixed(0).padStart(3, '0')} (x 100 ft)`;
        sliderText.value = `Ceiling: ${disabled.value ? "NONE" : valid}`;
    };

    function set_slider_color() {
        sliderColor.value = disabled.value ? disabledSliderColor : cautionColor.value;
    }

    function update_slider() {
        set_slider_text();
        set_slider_color();
    }

    watch(() => props.cloudCoverage, (newVal) => {
        disabled.value = disablingCoverages.includes(newVal);
        sliderValue.value = start;
        realValue.value = high;
        update_slider();
    })

    const emit = defineEmits<{
        (e: 'emitCeiling', ceiling: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value / 100) * 100;
        set_slider_text();
        set_slider_color();
        emit('emitCeiling', realValue.value);
    }
    const styleObject = reactive({
        background: sliderColor,
        accentColor: sliderColor,
    })

    onInput();
    update_slider();
</script>

<template>
    <label id="ceilingPickerLabel">
        <input
            id="ceilingPicker"
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider"
            :style="styleObject"
            :disabled=disabled
            min=-1
            max=1
            step=.001
        >
        <span id="ceilingPickerSpan" v-text="sliderText"></span>
    </label>
</template>
