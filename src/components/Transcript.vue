<script setup lang="ts">
    import {ref, watch} from "vue"

    const props = defineProps({
        airport: {type: String, required: true},
        information: {type: String, required: true},
        time:  {type: String, required: true},
        windVariable: {type: Boolean, required: true},
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
    });
    const disablingCoverages = ["SKC", "NCD", "CLR", "VV"];

    const ADDRESS = "https://mcgsjoyner.github.io/AVWX-Scribe/";
    var atisText = ref("");
    watch(() =>
    [
        props.visibility,
        props.cloudCoverage,
        props.ceiling,
        props.airport,
        props.information,
        props.time,
        props.altimeter,
        props.windVel,
        props.windVariable,
        props.windGust,
        props.windDir,
        props.temperature,
        props.dewpoint,
    ] as const,
    ([
        visibilityVal,
        cloudCoverageVal,
        ceilingVal,
        airportVal,
        informationVal,
        timeVal,
        altimeterVal,
        windVelVal,
        windVariableVal,
        windGustVal,
        windDirVal,
        temperatureVal,
        dewpointVal,
    ]) =>
    {
        var windChunk = '00000';
        if (windVelVal > 0) {
            windChunk = windVariableVal ? 'VRB' : windDirVal.toString().padStart(3, '0');
            windChunk += windVelVal.toFixed(0).padStart(2, '0');
            if (windGustVal != 0) {
                windChunk += `G${windGustVal.toFixed(0)}`;
            }
        }
        windChunk += 'KT';
        function format_temp(val: number) {
            const negative = val.toFixed(0).startsWith('-');
            var formatted = val.toFixed(0).replace('-','').padStart(2, '0');
            if (negative) {
                formatted = 'M' + formatted;
            }
            return formatted;
        }

        var cloudChunk = cloudCoverageVal;
        if (!disablingCoverages.includes(cloudCoverageVal)) {
            cloudChunk += Math.round(ceilingVal / 100).toFixed(0).padStart(3, '0');
        }

        const chunks = [
            airportVal,
            `INFO ${informationVal}`,
            timeVal.replace(/\s/g, '') + 'Z',
            windChunk,
            (visibilityVal).toFixed(0) + 'SM',
            cloudChunk,
            `${format_temp(temperatureVal)}/${format_temp(dewpointVal)}`,
            'A' + (altimeterVal).toFixed(2).replace('.', ''),
        ];
        atisText.value = chunks.join(' ');
    });

    function get_airport_text() {
        return `Airport: ${props.airport}`;
    }

    function get_information_text() {
        return `Information: ${props.information}`
    }

    function get_time_text() {
        return `Time: ${props.time} Z`;
    }

    function get_wind_text() {
        var windText = 'Wind: ';
        if (props.windVel == 0) {
            windText += 'Calm';
            return windText;
        }
        if (props.windVariable) {
            windText += 'VRB';
        }
        else {
            windText += props.windDir.toString().padStart(3, '0') + '&deg;'
        }
        let val = props.windVel.toFixed(0);
        windText += ` @ ${val} KT`;
        if (props.windGust > 0) {
            val = props.windGust.toFixed(0);
            windText += ` G ${val} KT`;
        }
        return windText;
    }

    function get_visibility_text() {
        let val = props.visibility.toFixed(0);
        return `Visibility: ${val} SM`;
    }

    function get_cloud_text() {
        let cloudChunk = props.cloudCoverage;
        if (!disablingCoverages.includes(props.cloudCoverage)) {
            let val = Math.round(props.ceiling);
            cloudChunk += `@ ${val} ft AGL`;
        }
        return `Cloud Coverage: ${cloudChunk}`;
    }

    function get_temperature_text() {
        let val = props.temperature.toFixed(0);
        return `Temperature: ${val}&deg;C`;
    }

    function get_dewpoint_text() {
        let val = props.dewpoint.toFixed(0);
        return `Dew Point: ${val}&deg;C`;
    }

    function get_spread_text() {
        let spread = props.temperature - props.dewpoint;
        let val = spread.toFixed(0);
        return `Spread: ${val}&deg;C`
    }

    function get_altimeter_text() {
        let val = props.altimeter.toFixed(2);
        return `Altimeter Setting: ${val} inHg`;
    }

    function get_density_altitude_text() {
        let val = props.densityAltitude.toFixed(0);
        return `Density Altitude (est.): ${val} ft`;
    }

    function download_transcript() {
        // Create element with <a> tag
        const link = document.createElement("a");

        // Add file name
        var tags = [
            props.airport,
            props.information,
            props.time.replace(/\s/g, "") + 'Z',
        ]
        const filename = `information-${tags.join('-')}.html`.toLowerCase()
        link.download = filename;

        // Create a blob object with the file content which you want to add to the file
        var content = [
            atisText.value,
            '',
            get_airport_text(),
            get_information_text(),
            get_time_text(),
            get_wind_text(),
            get_visibility_text(),
            get_cloud_text(),
            get_temperature_text(),
            get_dewpoint_text(),
            get_spread_text(),
            get_altimeter_text(),
            get_density_altitude_text(),
            '',
            `Generated using <a href=${ADDRESS}>AVWX Scribe</a>`
        ]
        const title = `Information ${tags.join(" ")}`;
        const html_code = `
        <body style="background-color:black;color:white">
        <title>${title}</title>
        <h1>${title}</h1>
        <div>
        ${content.join("<br>")}
        </div>
        </body>
        `
        const file = new Blob([html_code], { type: 'html'});

        // Add file content in the object URL
        link.href = URL.createObjectURL(file);

        // Add click event to tag to save file.
        link.click();
        URL.revokeObjectURL(link.href);
    };
</script>

<template>
    <p id="atisText">{{atisText}}</p>
    <button @click="download_transcript" id="downloadButton"> Download Transcript </button>
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