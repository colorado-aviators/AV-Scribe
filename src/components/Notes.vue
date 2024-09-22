<script setup lang="ts">
    import {ref, reactive} from "vue"
    const title = "Notes"
    const notes = ref('');

    const textColor = ref("var(--color-text-untouched)");

    const emit = defineEmits<{
        (e: 'emitNotes', notes: string): void
    }>()
    const onChange = () => {
        textColor.value = "var(--color-text)";
        emit('emitNotes', notes.value);
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
                id="notesPicker"
                type="text"
                v-model.string="notes"
                @change="onChange"
                :style="styleObject"
            >
        </div>
    </div>
</template>