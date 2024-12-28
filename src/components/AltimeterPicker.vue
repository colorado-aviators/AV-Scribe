<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'

    const title = "Altimeter"
    const numDigits = 2;
    const resolution = 10 ** numDigits;
    const sketchy = 100;
    const bad = 100;

    const props = defineProps({
        low: {type: Number, required: false},
        high: {type: Number, required: false},
        optimum: {type: Number, required: false},
        gradient: {type: Number, required: false},
    })

    const start = 0;
    const realValue = ref();

    function get_read_out() {
        return realValue.value.toFixed(numDigits);
    };

    const emit = defineEmits<{
        (e: 'emitAltimeter', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value*resolution)/resolution;
        emit('emitAltimeter', realValue.value);
    }
    onInput();
</script>

<template>
    <CustomRange
        :title = "title"
        :start = "start"
        :high = "high"
        :low = "low"
        :optimum = "optimum"
        :gradient = "gradient"
        :sketchy = "sketchy"
        :bad = "bad"
        :numDigits = 2
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload; onInput();}"
        :readOut = "get_read_out()"
    />
</template>
