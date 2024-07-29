<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'

    const start = 1.0;
    const high = 10.0
    const low = 0.0;
    const optimum = 5.0;
    const gradient = 0.5;
    const sketchy = 5;
    const bad = 3;
    const realValue = ref();

    function get_slider_text() {
        return `Visibility: ${realValue.value} SM`;
    };

    const emit = defineEmits<{
        (e: 'emitVisibility', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        emit('emitVisibility', realValue.value);
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
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload; onInput();}"
        :sliderText = "get_slider_text()"
        :numDigits = 0
    />
</template>
