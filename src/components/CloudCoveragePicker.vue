<script setup lang="ts">
    import {ref, reactive} from "vue"
    const title = "Cloud condition"
    const cloudCoverage = ref("SKC");
    // https://en.wikipedia.org/wiki/METAR#Cloud_reporting
    const myOptionsArray = ["SKC", "NCD", "CLR", "FEW", "SCT", "BKN", "OVC", "VV"];
    const textColor = ref("var(--color-text-untouched)");

    const emit = defineEmits<{
        (e: 'emitCloudCoverage', cloudCoverage: string): void
    }>()
    const onChange = () => {
        textColor.value = "var(--color-text-dark)"
        emit('emitCloudCoverage', cloudCoverage.value);
    }
    function initialize() {
        emit('emitCloudCoverage', cloudCoverage.value);
    }
    const styleObject = reactive({
        color: textColor,
    })
    initialize();
</script>

<template>
    <div class="inputContainer">
        <label>
            <span class="title">
                {{ title }}:
            </span>
        </label>
        <div class="inputArea">
            <select v-model.string="cloudCoverage" @change="onChange" :style="styleObject">
              <option v-for="(item , index) in myOptionsArray" v-bind:key="index">
                {{item}}
              </option>
            </select>
        </div>
    </div>
</template>
