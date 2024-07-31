<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'

    const title = "Dewpoint";
    const start = ref(0);
    const high = ref(35);
    const low = ref(-83);
    const optimum = ref(0);
    const gradient = ref(.9);
    const realValue = ref();
    const sketchy = ref();
    const bad = ref();
    const props = defineProps({
        temp: {
            type: Number,
            required: true,
        },
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
    function updateCautionColor() {
        sketchy.value = props.temp - 5;
        bad.value = props.temp;
    }
    watch(() => props.temp as number, (newVal, oldVal) => {
        // avoids changing color on initialization
        if (oldVal !== Infinity) {
            updateCautionColor();
        }
    })

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