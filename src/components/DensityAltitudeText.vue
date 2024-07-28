<script setup lang="ts">
    import {ref, watch} from "vue"
    import {getDensityAltitude} from "../lib/physics"
    import {unit} from "mathjs"

    const props = defineProps({
        elevation: {type: Number, required: true},
        temperature: {type: Number, required: true},
        dewpoint: {type: Number, required: true},
        altimeter:  {type: Number, required: true},
    });

    var densityAltitudeText = ref("");
    watch(() =>
    [
        props.elevation,
        props.temperature,
        props.dewpoint,
        props.altimeter,
    ] as const,
    ([
        elevationVal,
        temperatureVal,
        dewpointVal,
        altimeterVal,
    ]) =>
    {
        var densityAltitude = getDensityAltitude(
            unit(temperatureVal, "degC"),
            unit(dewpointVal, "degC"),
            unit(altimeterVal, "inHg"),
            unit(elevationVal, "feet")
        )
        densityAltitudeText.value = `Density altitude (estimated): ${densityAltitude.toNumeric("feet").toFixed(0)}`;
    });
</script>

<template>
    <p id="densityAltitudeText">{{densityAltitudeText}}</p>
</template>

<style scoped>
    p {
        font-size: 12px;
    }
</style>