<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'

    const title = "Dewpoint"
    const realValue = ref(0);
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
        :start = 0
        :high = 35
        :low = -83
        :optimum = 0
        :gradient = .9
        :sketchy = "sketchy"
        :bad = "bad"
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload}"
        :readOut = "get_read_out()"
    />
</template>