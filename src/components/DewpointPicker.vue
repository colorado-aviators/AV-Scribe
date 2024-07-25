<script setup>
    import {ref, watch, defineProps} from "vue"
    import * as functions from "../lib/functions"

    const props = defineProps({
      temp: Number,
    });

    var sketchy = 100;
    var bad = 100;

    const start = 0;

    const high = 35;  // https://www.noaa.gov/jetstream/synoptic/heat-index
    // const low = -62;  // https://en.wikipedia.org/wiki/U.S._state_and_territory_temperature_extremes
    const low = -83;  // same as temperature low... i think this is how it works
    const optimum = 0;  // not sure where to put this...
    const gradient = .9;

    var {sliderValue, realValue, cautionColor} = functions.onUpdate(start, high, low, optimum, gradient, sketchy, bad);

    var sliderText = ref("");
    function get_slider_text(val) {
        var rounded = Math.round(val, 1);
        return `Dewpoint: ${rounded}\u00B0C`;
    };
    watch(realValue, async (newVal) => {
        sliderText.value = get_slider_text(newVal);
        var spread = props.temp - newVal;
        cautionColor.value = functions.get_caution_color(spread, 5, 0);
    })
    watch(() => props.temp, (newVal) => {
        sliderText.value = get_slider_text(realValue.value);
        var spread = newVal - realValue.value;
        cautionColor.value = functions.get_caution_color(spread, 5, 0);
    })
    sliderText.value = get_slider_text(realValue.value);
</script>

<template>
    <label id="dewpointPickerLabel">
        <input @change="$emit('emitDewpoint', realValue)" class="custom-slider custom-slider-dewpoint" v-model="sliderValue" type="range" min="-1" max="1" step=".001" id="dewpointPicker" />
    <span id="dewpointPickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-dewpoint {
      accent-color: v-bind("cautionColor");
      background: v-bind("cautionColor");
    }
</style>
