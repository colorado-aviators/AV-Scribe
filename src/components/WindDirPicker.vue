<script setup lang="ts">
    import {ref, watch} from "vue"
    var sliderText = ref("");
    var sliderValue = ref(360);

    function get_slider_text(val: number) {
        return 'Wind Dir: ' + (val.toString().padStart(3, '0') + '\u00B0');
    };
    watch(sliderValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
    })
    sliderText.value = get_slider_text(sliderValue.value);
</script>

<template>
    <label id="windDirPickerLabel">
        <input @change="$emit('emitWindDir', sliderValue)" class="custom-slider custom-slider-wind-dir" v-model="sliderValue" type="range" min="10" max="360" step="10" id="windDirPicker" />
    <span id="windDirPickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-wind-dir {
      accent-color: rgba(0.0, 0.0, 255.0);
      background: rgba(0.0, 0.0, 255.0);
    }
</style>
