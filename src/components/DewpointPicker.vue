<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    import * as functions from "../lib/slider-utils.ts"

    const props = defineProps({
      temp: Number,
    });

    const start = 0;
    const high = 35;  // https://www.noaa.gov/jetstream/synoptic/heat-index
    // const low = -62;  // https://en.wikipedia.org/wiki/U.S._state_and_territory_temperature_extremes
    const low = -83;  // same as temperature low... i think this is how it works
    const optimum = 0;  // not sure where to put this...
    const gradient = .9;
    const sketchy = 100;
    const bad = 100;
    const sliderText = ref("");

    const {sliderValue, realValue, cautionColor} = functions.onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    function get_slider_text() {
        return `Dewpoint: ${realValue.value}\u00B0C`;
    };

    watch(() => props.temp as number, (newVal) => {
        var spread = newVal - realValue.value;
        cautionColor.value = functions.get_caution_color(spread, 5, 0);
    })
    const emit = defineEmits<{
        (e: 'emitDewpoint', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        sliderText.value = get_slider_text();
        emit('emitDewpoint', realValue.value);
    }
    const styleObject = reactive({
        background: cautionColor,
        accentColor: cautionColor,
    })

    onInput();
</script>

<template>
    <label id="dewpointPickerLabel">
        <input
            id="dewpointPicker"
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider"
            :style="styleObject"
            min=-1
            max=1
            step=.001
        >
        <span id="dewpointPickerSpan" v-text="sliderText"></span>
    </label>
</template>