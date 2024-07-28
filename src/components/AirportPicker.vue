<script setup lang="ts">
    import {ref} from "vue"
    const airport = ref('');

    function format_airport(orig: string) {
        var val = orig.toUpperCase();
        const regex = /^[A-Z0-9]+$/;
        if (val == "") {
            return
        }
        if (!regex.test(val)) {
            alert("Airport code invalid");
        }
        return val;
    }

    const emit = defineEmits<{
        (e: 'emitAirport', airport: string): void
    }>()
    const onChange = () => {
        // overwrite the value with the uppercase version!
        var formatted = format_airport(airport.value);
        airport.value = formatted;
        emit('emitAirport', formatted);
    }
</script>

<template>
    <label class="switch">
        Airport:
        <input
            id="airportPicker"
            type="text"
            v-model.string="airport"
            @change="onChange"
            class="airportInput"
            minlength=4
            maxlength=4
        >
    </label>
</template>

<style>
    .airportInput {
        width: 100px;
    }
</style>