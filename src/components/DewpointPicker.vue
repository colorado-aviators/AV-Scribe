<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'

    const title = "Dewpoint";
    const start = ref(0);
    const realValue = ref();
    const props = defineProps({
        low: {type: Number, required: false},
        high: {type: Number, required: false},
        sketchy: {type: Number, required: false},
        bad: {type: Number, required: false},
        optimum: {type: Number, required: false},
        gradient: {type: Number, required: false},
    });

    function get_read_out() {
        return realValue.value + "\u00B0C";
    };
    const emit = defineEmits<{
        (e: 'emitDewpoint', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        emit('emitDewpoint', realValue.value);
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