<script setup lang="ts">
    import {ref, reactive} from "vue"
    import * as airport_data from "../lib/fetch_airport_data"

    class GeocodeSystem{
        name: string;
        regex: RegExp;
        constructor(name: string, regex: RegExp) {
            this.name = name;
            this.regex = regex;
        }
    }

    const title = "Airport";
    const FAA = new GeocodeSystem("FAA", /^[A-Z0-9]{3,4}$/);
    const ICAO = new GeocodeSystem("ICAO", /^[A-Z]{4}$/);
    const systemChoice = ref(FAA);
    const airportID = ref('');
    const textColor = ref("var(--color-text-untouched)");

    function format_airport(orig: string) {
        var val = orig.toUpperCase();
        const regex = systemChoice.value.regex;
        if (!regex.test(val)) {
            alert(`Entry is not a valid ${systemChoice.value.name} airport code`);
        }
        return val;
    }

    const emit = defineEmits<{
        (e: 'emitAirport', airport: airport_data.AirportData): void
    }>()
    const onChange = () => {
        if (airportID.value.length == 0) {
            emit('emitAirport', null);
        }
        else {
            airportID.value = format_airport(airportID.value);

            airport_data.loadAirportData(airportID.value, systemChoice.value.name.toLowerCase()).then((airportData) => {
                emit('emitAirport', airportData);
            }).catch((error) => console.error(error));
            textColor.value = "var(--color-text)";
        }
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
                <input type="radio" v-model="systemChoice" :value="FAA" :id="FAA.name"/>
                <label class="system-picker" :for="FAA.name">FAA</label>
                <input type="radio" v-model="systemChoice" :value="ICAO" :id="ICAO.name"/>
                <label class="system-picker" :for="ICAO.name">ICAO</label>
            </div>
        </div>
    </div>
</template>

<style>
    label.system-picker {
        font-size: 16px;
    }
</style>