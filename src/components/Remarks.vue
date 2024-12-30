<script setup lang="ts">
    import {ref, reactive} from "vue"
    const title = "Remarks"
    const remarks = ref('');

    const textColor = ref("var(--color-text-untouched)");

    const emit = defineEmits<{
        (e: 'emitRemarks', remarks: string): void
    }>()
    const onChange = () => {
        textColor.value = "var(--color-text)";
        emit('emitRemarks', remarks.value);
    }
    const styleObject = reactive({
        color: textColor,
    })
</script>

<template>
    <div class="inputContainer">
        <label>
            <span class="title">
                {{ title }}:
            </span>
        </label>
        <div class="inputArea">
            <input
                id="remarksPicker"
                type="text"
                v-model.string="remarks"
                @change="onChange"
                :style="styleObject"
            >
        </div>
    </div>
</template>