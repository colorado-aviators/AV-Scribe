<script setup lang="ts">
    import {ref, watch} from "vue"
    import * as weather_data from '../lib/fetch_weather_data'

    const defaultValue = "Global WX records";
    const statusText = ref(defaultValue);
    const props = defineProps({
        metarData: {type: weather_data.Metar, required: false, default: null},
        wxModel: {type: weather_data.WeatherData, required: false, default: null},
    });

    watch(() => [props.metarData, props.wxModel], () => {
        if (props.wxModel !== null) {
            statusText.value = "Local WX model";
        }
        if (props.metarData !== null) {
            statusText.value = `METAR (${props.metarData.station})`;
        }
    });
</script>

<template>
    <p id="statusText">Source: {{statusText}}</p>
</template>

<style scoped>
    p {
        font-size: 12px;
    }
    button {
        margin-bottom: 30px;
        margin-top: 30px;
        padding: 10px;
    }
</style>