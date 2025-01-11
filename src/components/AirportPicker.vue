<script setup lang="ts">
    import {ref, reactive} from "vue"
    import * as airport_data from "../lib/fetch_airport_data"
    const title = "Airport";

    const airportID = ref('');

    const textColor = ref("var(--color-text-untouched)");

    class GeocodeSystem{
        name: string;
        regex: RegExp;
        constructor(name: string, regex: RegExp) {
            this.name = name;
            this.regex = regex;
        }
    }

    const FAA = new GeocodeSystem("FAA", /^[A-Z0-9]{3,4}$/);
    const ICAO = new GeocodeSystem("ICAO", /^[A-Z]{4}$/);
    const IATA = new GeocodeSystem("IATA", /^[A-Z]{4}$/);
    const codices = ref([FAA, ICAO]);
    const codex = ref(FAA);

    function format_airport(orig: string) {
        var val = orig.toUpperCase();
        const regex = codex.value.regex;
        if (!regex.test(val)) {
            alert(`Entry is not a valid ${codex.value.name} airport code`);
        }
        return val;
    }

    const emit = defineEmits<{
        (e: 'emitAirport', airport: airport_data.AirportData): void
    }>()
    const onChange = () => {
        airportID.value = format_airport(airportID.value);

        airport_data.loadAirportData(airportID.value, codex.value.name.toLowerCase()).then((airportData) => {
            emit('emitAirport', airportData);
        }).catch((error) => console.error(error));

        textColor.value = "var(--color-text)";
    }
    const updateCodex = () => {
        airportID.value = format_airport(airportID.value);
    }
    const styleObject = reactive({
        color: textColor,
    })
</script>

<template>
    <div class="inputContainer">
        <label>
            <span class="title">
                {{ title }}:
            </span>
        </label>
        <div class="inputArea">
            <input
                id="airportPicker"
                type="text"
                v-model.string="airportID"
                @change="onChange"
                minlength=3
                maxlength=4
                :style="styleObject"
            >
            <div class="inputArea" @change="onChange">
                <input type="radio" v-model="codex" :value="FAA" :id="FAA.name"/>
                <label class="blah" :for="FAA.name">FAA</label>
                <input type="radio" v-model="codex" :value="ICAO" :id="ICAO.name"/>
                <label class="blah" :for="ICAO.name">ICAO</label>
            </div>
        </div>
    </div>
</template>

<style>
    label.blah {
        font-size: 16px;
    }
</style>