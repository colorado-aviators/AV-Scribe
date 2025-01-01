<script setup lang="ts">
    import {ref, watch} from "vue"

    const fileNameLight = "logo-light";
    const fileNameDark = "logo-dark";
    const filePath = ref(getImageUrl(fileNameDark));

    const props = defineProps({
        userTheme: {type: String, required: true},
    });
    watch(() => props.userTheme, (newVal) => {
        filePath.value = getImageUrl(newVal == 'dark' ? fileNameDark : fileNameLight);
    })
    function getImageUrl(name: String) {
        return new URL(`../assets/${name}.svg`, import.meta.url).href;
    }
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