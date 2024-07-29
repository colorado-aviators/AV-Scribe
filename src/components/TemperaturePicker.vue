<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'

    const sketchy = 100;
    const bad = 100;

    const start = 0;
    const high = 57;
    const low = -83;
    const optimum = 0;  // standard temperature
    const gradient = .9;
    const realValue = ref();

    function get_slider_text() {
        return `Temperature: ${realValue.value}\u00B0C`;
    }

    const emit = defineEmits<{
        (e: 'emitTemperature', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        emit('emitTemperature', realValue.value);
    }
    onInput();
</script>

<template>
    <CustomRange
        :start = "start"
        :high = "high"
        :low = "low"
        :optimum = "optimum"
        :gradient = "gradient"
        :sketchy = "sketchy"
        :bad = "bad"
        :numDigits = 0
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload; onInput();}"
        :sliderText = "get_slider_text()"
    />
</template>