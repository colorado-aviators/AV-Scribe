<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'

    const start = 1.0;
    const high = 360;
    const low = 10;
    const realValue = ref(high);

    const props = defineProps({
      disabled: Boolean,
    });

    function get_slider_text() {
        var text = 'Wind Dir: '
        var formattedDirection = realValue.value.toString().padStart(3, '0') + '\u00B0';
        return `Wind Dir: ${props.disabled ? "VARIABLE" : formattedDirection}`;
    };

    const emit = defineEmits<{
        (e: 'emitWindDir', realValue: number): void
    }>()

    const onInput = () => {
        emit('emitWindDir', realValue.value);
    }

    onInput();
</script>

<template>
    <CustomRange
        :start = "start"
        :high = "high"
        :low = "low"
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload; onInput();}"
        :sliderText = "get_slider_text()"
        :disabled="disabled"
        :numDigits=-1
    />
</template>
