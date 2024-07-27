<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    import { onUpdate } from '../lib/functions.js'

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

    const {sliderValue, realValue, cautionColor} = onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    var sliderText = ref("");
    function get_slider_text(val: number) {
        var rounded = Math.round(val);
        return 'Wind Gust: ' + (rounded == 0.0 ? 'None' : `${rounded} KT`);
    };
    watch(realValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
        styleObject.background = props.disabled ? disabledSliderColor : cautionColor.value;
    })
    watch(() => props.disabled, async (newVal, oldVal) => {
        styleObject.background = newVal ? disabledSliderColor : cautionColor.value;
        realValue.value = 0.0;
        sliderValue.value = -1.0;
    })
    sliderText.value = get_slider_text(realValue.value);

    const emit = defineEmits<{
        (e: 'emitWindGust', realValue: number): void
    }>()
    const onChange = () => {
        emit('emitWindGust', realValue.value);
    }
    const styleObject = reactive({
        background: disabledSliderColor,
        accentColor: disabledSliderColor,
    })
    onChange();
</script>

<template>
    <label id="windVelPickerLabel">
        <input
            id="windVelPicker"
            type="range"
            v-model="sliderValue"
            @change="onChange"
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
