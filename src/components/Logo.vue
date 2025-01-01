<script setup lang="ts">
    import {ref, watch} from "vue"

    const fileNameLight = "logo-light";
    const fileNameDark = "logo-dark";
    const filePath = ref();

    const props = defineProps({
        userTheme: {type: String, required: true},
    });
    function getImageUrl(name: String) {
        return new URL(`../assets/${name}.svg`, import.meta.url).href;
    }
    function setFilePath(theme: String){
        filePath.value = getImageUrl(theme == 'dark' ? fileNameDark : fileNameLight);
    }
    watch(() => props.userTheme, (newVal) => {
        setFilePath(newVal);
    })
    setFilePath(props.userTheme.value);
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