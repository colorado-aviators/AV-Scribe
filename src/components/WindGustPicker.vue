<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    import { onUpdate } from '../lib/slider-utils.js'

    const props = defineProps({
      disabled: Boolean,
    });

    const start = -1.0;
    const high = 201.0
    const low = 0.0;
    const optimum = 5.0;
    const gradient = 0.1;
    const sketchy = 15;
    const bad = 25;
    const disabledSliderColor = "rgba(255.0,255.0,255.0,.1)";
    const sliderColor = ref(disabledSliderColor);
    const sliderText = ref("");

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    function set_slider_text() {
        sliderText.value = 'Wind Gust: ' + (realValue.value == 0.0 ? 'None' : `${realValue.value} KT`);
    };
    function set_slider_color() {
        sliderColor.value = props.disabled ? disabledSliderColor : cautionColor.value;
    }

    function update_slider() {
        set_slider_text();
        set_slider_color();
    }

    watch(() => props.disabled, async (newVal) => {
        sliderValue.value = start;
        realValue.value = low;
        update_slider();
    })

    const emit = defineEmits<{
        (e: 'emitWindGust', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        set_slider_text();
        set_slider_color();
        emit('emitWindGust', realValue.value);
    }
    const styleObject = reactive({
        background: sliderColor,
        accentColor: sliderColor,
    })
    onInput();
    update_slider();
</script>

<template>
    <label id="windVelPickerLabel">
        <input
            id="windVelPicker"
            type="range"
            v-model="sliderValue"
            @input="onInput"
            class="custom-slider"
            :style="styleObject"
            min=-1
            max=1
            step=.001
            :disabled=props.disabled
        >
        <span id="windVelPickerSpan" v-text="sliderText"></span>
    </label>
</template>
