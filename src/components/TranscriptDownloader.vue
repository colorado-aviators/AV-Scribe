<script setup lang="ts">
    import {ref, watch} from "vue"

    const props = defineProps({
        atisText: {type: String, required: true},
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
    });
    const disablingCoverages = ["SKC", "NCD", "CLR", "VV"];

    const ADDRESS = "https://mcgsjoyner.github.io/AVWX-Scribe/";

    function get_airport_text() {
        return `Airport: ${props.airport}`;
    }

    function get_information_text() {
        return props.information ? `Information: ${props.information}` : null;
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
        if (props.windCondition) {
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
        let isNotNull = (value: any) => value != null;

        // Add file name
        let tags = [
            props.airport,
            props.information,
            props.time.replace(/\s/g, "") + 'Z',
        ]
        tags = tags.filter(isNotNull);

        // Create a blob object with the file content which you want to add to the file
        let lines = [
            props.atisText,
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
        let content = lines.filter(isNotNull).join("<br>");

        let computedStyle = getComputedStyle(document.documentElement);
        let transcriptStyle = `
            background-color: ${computedStyle.getPropertyValue('--color-background')};
            color: ${computedStyle.getPropertyValue('--color-text')};
        `
        let title = `Information ${tags.join(" ")}`;
        let html_code = `
            <body style="${transcriptStyle}">
                <title>${title}</title>
                <h1>${title}</h1>
                <div>
                    ${content}
                </div>
            </body>
        `

        let file = new Blob([html_code], { type: 'html' });

        // Create element with <a> tag
        let link = document.createElement("a");
        link.download = `information-${tags.join('-')}.html`.toLowerCase();

        // Add file content in the object URL
        link.href = URL.createObjectURL(file);

        // Add click event to tag to save file.
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const styleObject = ({
        marginBottom: "30px",
        marginTop: "30px",
        padding: "10px",
        borderRadius: "4px",
    })
</script>

<template>
    <button @click="download_transcript" id="downloadButton" :style="styleObject">
        Download Transcript
    </button>
</template>
