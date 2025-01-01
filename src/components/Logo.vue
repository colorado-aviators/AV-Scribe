<script setup lang="ts">
    import {ref, watch} from "vue"

    let logoRoot = "../src/assets/";
    const filePathLight = logoRoot + "logo-light.svg";
    const filePathDark = logoRoot + "logo-dark.svg";
    const filePath = ref(filePathDark);

    const props = defineProps({
        userTheme: {type: String, required: true},
    });
    watch(() => props.userTheme, (newVal) => {
        filePath.value = newVal == 'dark' ? filePathDark : filePathLight;
    })
</script>

<template>
    <div align="center">
        <img align="center" alt="AV Scribe logo" class="logo" :src="filePath"/>
    </div>
</template>

<style>
    img.logo {
        max-width: 100%;
        min-width: 100%;
    }
</style>