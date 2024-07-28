<script setup lang="ts">
    import {ref} from "vue";
    const checked = ref(false);

    const emit = defineEmits<{
        (e: 'emitWindVariable', checked: boolean): void
    }>()
    const onChange = () => {
        emit('emitWindVariable', checked.value);
    }
    onChange();
</script>

<template>
    <label class="switch">Wind Variable?
        <input
            id="checkbox"
            type="checkbox"
            v-model.boolean="checked"
            @change="onChange"
        >
    </label>
</template>
