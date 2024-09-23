<script setup lang="ts">
    import {ref, watch} from "vue"
    import TranscriptDownloader from "./TranscriptDownloader.vue"

    const atisText = ref("");
    const disablingCoverages = ["SKC", "NCD", "CLR", "VV"];
    const props = defineProps({
        airport: {type: String, required: true},
        information: {type: String, required: false},
        time:  {type: String, required: true},
        windCondition: {type: String, required: true},
        windVel: {type: Number, required: true},
        windDir: {type: Number, required: true},
        windGust: {type: Number, required: true},
        visibility: {type: Number, required: true},
        cloudCoverage: {type: String, required: true},
        ceiling: {type: Number, required: true},
        temperature: {type: Number, required: true},
        dewpoint: {type: Number, required: true},
        altimeter:  {type: Number, required: true},
        densityAltitude:  {type: Number, required: true},
        notes: {type: String, required: false},
    });

    function get_airport_chunk() {
        return props.airport;
    }

    function get_information_chunk() {
        return props.information ? `INFO ${props.information}` : null;
    }

    function get_time_chunk() {
        return props.time.replace(/\s/g, '') + 'Z';
    }

    function get_wind_chunk() {
        var windChunk = '00000';
        if (props.windVel > 0) {
            let windDirString = props.windDir.toString().padStart(3, '0');
            let windVelString = props.windVel.toFixed(0).padStart(2, '0');
            let windGustString = "G" + props.windGust.toFixed(0);
            let windVariable = props.windCondition == "Variable";

            windChunk = windVariable ? 'VRB' : windDirString;
            windChunk += windVelString;
            if (props.windGust != 0) {
                windChunk += windGustString;
            }
        }
        windChunk += 'KT';
        return windChunk;
    }

    function get_visibility_chunk() {
        return props.visibility.toFixed(0) + 'SM';
    }

    function get_cloud_chunk() {
        let noClouds = disablingCoverages.includes(props.cloudCoverage);
        var cloudChunk = props.cloudCoverage;
        if (!noClouds) {
            cloudChunk += Math.round(props.ceiling / 100).toFixed(0).padStart(3, '0');
        }
        return cloudChunk;
    }

    function get_temperatures_chunk() {
        function format_temp(val: number) {
            const negative = val.toFixed(0).startsWith('-');
            var formatted = val.toFixed(0).replace('-','').padStart(2, '0');
            if (negative) {
                formatted = 'M' + formatted;
            }
            return formatted;
        }
        return [format_temp(props.temperature), format_temp(props.dewpoint)].join("/");
    }

    function get_altimeter_chunk() {
        return 'A' + props.altimeter.toFixed(2).replace('.', '');
    }

    function update_atis_text() {
        let chunks = [
            get_airport_chunk(),
            get_information_chunk(),
            get_time_chunk(),
            get_wind_chunk(),
            get_visibility_chunk(),
            get_cloud_chunk(),
            get_temperatures_chunk(),
            get_altimeter_chunk(),
        ];
        let isNotNull = (value: any) => value != null;
        atisText.value = chunks.filter(isNotNull).join(' ');
    }

    watch(
        () =>
        [
            props.visibility,
            props.cloudCoverage,
            props.ceiling,
            props.airport,
            props.information,
            props.time,
            props.altimeter,
            props.windVel,
            props.windCondition,
            props.windGust,
            props.windDir,
            props.temperature,
            props.dewpoint,
        ], () =>
        { update_atis_text(); }
    );
</script>

<template>
    <p id="atisText">{{atisText}}</p>
    <TranscriptDownloader
        :atisText="atisText"
        :information="information"
        :altimeter="altimeter"
        :airport="airport"
        :visibility="visibility"
        :cloudCoverage="cloudCoverage"
        :ceiling="ceiling"
        :time="time"
        :windDir="windDir"
        :windGust="windGust"
        :windVel="windVel"
        :windCondition="windCondition"
        :dewpoint="dewpoint"
        :temperature="temperature"
        :densityAltitude="densityAltitude"
        :notes="notes"
    />
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