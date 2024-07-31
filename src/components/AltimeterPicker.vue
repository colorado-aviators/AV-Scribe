<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'

    const title = "Altimeter"
    const numDigits = 2;
    const resolution = 10 ** numDigits;
    const sketchy = 100;
    const bad = 100;
    // https://www.wunderground.com/blog/weatherhistorian/world-and-us-anticyclonic-high-barometric-pressure-records.html
    const high = 32.01;  // Agata, Russia (in Siberia) registered on December 31, 1968
    // https://www.wunderground.com/blog/weatherhistorian/world-and-us-lowest-barometric-pressure-records.html
    // record excludes tropical storms
    // const low = 25.69;  // Guam, Super Typhoon "Tip" 10/12/1979
    const low = 27.31;  // Dutch Harbor, AK, on 10/25/1977
    // standard pressure at sea level
    const optimum = 29.92;
    const gradient = .9;
    const start = 0;
    const realValue = ref(29.92);

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
