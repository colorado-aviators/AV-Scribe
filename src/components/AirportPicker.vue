<script setup language="js">
    import {ref} from "vue"
    const airport = ref('');

    function validate_airport() {
        var val = airport.value.toUpperCase();
        const regex = /^[A-Z0-9]+$/;
        if (val == "") {
            return
        }
        if (!regex.test(val)) {
            alert("Airport code invalid");
        }
        // overwrite the value with the uppercase version!
        airport.value = val;
    }
</script>

<template>
    <label class="switch">
        Airport:
        <input class="blah" type="text" v-model="airport" @change="validate_airport();$emit('emitAirport', airport)" minlength="4" maxlength="4">
    </label>
</template>

<style>
    .blah {
        width: 100px;
    }
</style>