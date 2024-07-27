<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    var sliderText = ref("");
    var sliderValue = ref(360);
    const defaultSliderColor = "rgba(0.0, 0.0, 255.0)";
    const disabledSliderColor = "rgba(255.0,255.0,255.0,.1)";

    const props = defineProps({
      disabled: Boolean,
    });

    function get_slider_text(val: number) {
        var text = 'Wind Dir: '
        var formattedDirection = val.toString().padStart(3, '0') + '\u00B0';
        formattedDirection = props.disabled ? "VARIABLE" : formattedDirection;
        return `Wind Dir: ${formattedDirection}`;
    };
    watch(sliderValue, async (newVal, oldVal) => {
        sliderText.value = get_slider_text(newVal);
        styleObject.background = props.disabled ? disabledSliderColor : defaultSliderColor;
    })
    watch(() => props.disabled, async (newVal, oldVal) => {
        styleObject.background = newVal ? disabledSliderColor : defaultSliderColor;
        sliderText.value = get_slider_text(sliderValue.value);
    })

    const emit = defineEmits<{
        (e: 'emitWindDir', sliderValue: number): void
    }>()
    const onChange = () => {
        emit('emitWindDir', sliderValue.value);
    }
    const styleObject = reactive({
        background: defaultSliderColor,
        accentColor: defaultSliderColor,
    })
    sliderText.value = get_slider_text(sliderValue.value);
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
            :style="styleObject"
            :disabled="disabled"
            min=10
            max=360
            step=10
        >
        <span id="windDirPickerSpan" v-text="sliderText"></span>
    </label>
</template>
