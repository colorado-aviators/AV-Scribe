<script setup lang="ts">
    import {ref, reactive} from "vue"
    const title = "Airport"
    const airport = ref('');

    const textColor = ref("var(--color-text-untouched)");

    function format_airport(orig: string) {
        var val = orig.toUpperCase();
        const regex = /^[A-Z0-9]+$/;
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
        textColor.value = "var(--color-text)";
        airport.value = format_airport(airport.value);
        emit('emitAirport', airport.value);
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
                v-model.string="airport"
                @change="onChange"
                minlength=4
                maxlength=4
                :style="styleObject"
            >
        </div>
    </div>
</template>