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

    const emit = defineEmits<{
        (e: 'emitWindDir', sliderValue: number): void
    }>()
    const onChange = () => {
        emit('emitWindDir', sliderValue.value);
    }
    onChange();
</script>

<template>
    <label id="windDirPickerLabel">
        <input
            id="windDirPicker"
            type="range"
            v-model.number="sliderValue"
            @change="onChange"
            class="custom-slider custom-slider-wind-dir"
            min=10
            max=360
            step=10
        >
        <span id="windDirPickerSpan" v-text="sliderText"></span>
    </label>
</template>

<style>
    .custom-slider-wind-dir {
      accent-color: rgba(0.0, 0.0, 255.0);
      background: rgba(0.0, 0.0, 255.0);
    }
</style>
