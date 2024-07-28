<script setup lang="ts">
    import {ref, watch, reactive} from "vue"
    var sliderText = ref("");
    var sliderValue = ref(360);
    const defaultSliderColor = "rgba(0.0, 0.0, 255.0)";
    const disabledSliderColor = "rgba(255.0,255.0,255.0,.1)";

    const props = defineProps({
      disabled: Boolean,
    });

    function get_slider_text() {
        var text = 'Wind Dir: '
        var formattedDirection = sliderValue.value.toString().padStart(3, '0') + '\u00B0';
        formattedDirection = props.disabled ? "VARIABLE" : formattedDirection;
        return `Wind Dir: ${formattedDirection}`;
    };

    watch(() => props.disabled, async (newVal) => {
        styleObject.background = newVal ? disabledSliderColor : defaultSliderColor;
        sliderText.value = get_slider_text(sliderValue.value);
    })

    const emit = defineEmits<{
        (e: 'emitWindDir', sliderValue: number): void
    }>()

    const onInput = () => {
        sliderText.value = get_slider_text();
        styleObject.background = props.disabled ? disabledSliderColor : defaultSliderColor;
        emit('emitWindDir', sliderValue.value);
    }

    const styleObject = reactive({
        background: defaultSliderColor,
        accentColor: defaultSliderColor,
    })
    sliderText.value = get_slider_text(sliderValue.value);
    onInput();
</script>

<template>
    <label id="windDirPickerLabel">
        <input
            id="windDirPicker"
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider"
            :style="styleObject"
            :disabled="disabled"
            min=10
            max=360
            step=10
        >
        <span id="windDirPickerSpan" v-text="sliderText"></span>
    </label>
</template>
