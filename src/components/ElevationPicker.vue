<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'

    const title = "Field Elevation"
    const sketchy = 100000;
    const bad = 100000;
    // https://en.wikipedia.org/wiki/List_of_highest_airports
    const high = 14472;  // Daocheng Yading Airport
    const low = -1266;  // Bar Yehuda Airfield
    // standard pressure at sea level
    const optimum = 3000;
    const gradient = .4;
    const start = 0;
    const realValue = ref();

    function get_read_out() {
        return realValue.value.toFixed(0);
    };

    const emit = defineEmits<{
        (e: 'emitElevation', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value)
        emit('emitElevation', realValue.value);
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
        :numDigits = 0
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload; onInput();}"
        :readOut = "get_read_out()"
    />
</template>
