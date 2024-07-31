<script setup lang="ts">
    import {ref} from "vue"
    import CustomRange from './CustomRange.vue'

    const title = "Wind Dir"
    const start = 1.0;
    const high = 360;
    const low = 10;
    const realValue = ref(high);

    const props = defineProps({
      disabled: Boolean,
    });

    function get_read_out() {
        var text = 'Wind Dir: '
        var formattedDirection = realValue.value.toString().padStart(3, '0') + '\u00B0';
        return props.disabled ? "VARIABLE" : formattedDirection;
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
        :title = "title"
        :start = "start"
        :high = "high"
        :low = "low"
        @input = "onInput"
        @emit-value="(payload: number) => {realValue = payload; onInput();}"
        :readOut = "get_read_out()"
        :disabled="disabled"
        :numDigits=-1
    />
</template>
