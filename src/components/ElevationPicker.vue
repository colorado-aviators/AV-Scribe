<script setup lang="ts">
    import {ref} from "vue"

    const title = "Field Elevation (ft)"
    // https://en.wikipedia.org/wiki/List_of_highest_airports
    const high = 14472;  // Daocheng Yading Airport
    const low = -1266;  // Bar Yehuda Airfield
    const start = 0;
    const realValue = ref();

    function get_read_out() {
        return realValue.value.toFixed(0);
    };

    const emit = defineEmits<{
        (e: 'emitElevation', realValue: number): void
    }>()
    const onInput = () => {

        realValue.value = Math.round(realValue.value)
        emit('emitElevation', realValue.value);
    }

    onInput();
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
                id="elevationPicker"
                type="number"
                v-model.number="elevation"
                @change="onChange"
                :max="high"
                :min="low"
                inputmode="numeric"
            >
        </div>
    </div>
</template>
