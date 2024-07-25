<script setup>
    import {ref} from "vue";
    const checked = ref(false);
</script>

<template>
    <label class="switch">Wind Variable?
        <input @change="$emit('windVariable', checked)" type="checkbox" id="checkbox" v-model="checked">
    </label>
</template>
