<script setup lang="ts">
    import {ref } from "vue"
    import CustomRange from './CustomRange.vue'

    const start = -1.0;
    const high = 201.0
    const low = 0.0;
    const optimum = 5.0;
    const gradient = 0.1;
    const sketchy = 15;
    const bad = 25;
    const realValue = ref();

    function get_slider_text() {
        return 'Wind Velocity: ' + (realValue.value == 0.0 ? 'Calm' : `${realValue.value} KT`);
    }

    const emit = defineEmits<{
        (e: 'emitWindVel', realValue: number): void
    }>()

    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        emit('emitWindVel', realValue.value);
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
    />
</template>
