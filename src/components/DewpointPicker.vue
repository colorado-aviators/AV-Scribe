<script setup lang="ts">
    import {ref, watch} from "vue"
    import CustomRange from './CustomRange.vue'

    const realValue = ref(0);

    function get_slider_text() {
        return `Dewpoint: ${realValue.value}\u00B0C`;
    };

    const emit = defineEmits<{
        (e: 'emitDewpoint', realValue: number): void
    }>()
    const onInput = () => {
        realValue.value = Math.round(realValue.value);
        emit('emitDewpoint', realValue.value);
    }

    onInput();

    const sketchy = ref();
    const bad = ref();

    const props = defineProps({
        temp: {
            type: Number,
            required: true,
        },
    });

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
</script>

<template>
    <CustomRange
        :start = 0
        :high = 35
        :low = -83
        :optimum = 0
        :gradient = .9
        :sketchy = "sketchy"
        :bad = "bad"
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload}"
        :sliderText = "get_slider_text()"
    />
</template>