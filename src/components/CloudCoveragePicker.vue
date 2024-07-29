<script setup lang="ts">
    import {ref} from "vue"
    const cloudCoverage = ref("SKC");
    // https://en.wikipedia.org/wiki/METAR#Cloud_reporting
    const myOptionsArray = ["SKC", "NCD", "CLR", "FEW", "SCT", "BKN", "OVC", "VV"];

    const emit = defineEmits<{
        (e: 'emitCloudCoverage', cloudCoverage: string): void
    }>()
    const onChange = () => {
        emit('emitCloudCoverage', cloudCoverage.value);
    }
    onChange();
</script>

<template>
    <label class="switch">Clouds:
        <select v-model.string="cloudCoverage" @change="onChange">
          <option v-for="(item , index) in myOptionsArray" v-bind:key="index">
            {{item}}
          </option>
        </select>
    </label>
</template>

<style scoped>
    .switch {
        margin-top: 30px;
        margin-bottom: 30px;
    }
</style>
