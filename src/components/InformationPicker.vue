<script setup lang="ts">
    import {ref} from "vue"
    const information = ref();
    const myOptionsArray = Array.from(new Array(26),(val,index)=> String.fromCharCode(65 + index) );

    const emit = defineEmits<{
        (e: 'emitDensityAltitude', information: string): void
    }>()
    const onChange = () => {
        emit('emitDensityAltitude', information.value);
    }
</script>

<template>
    <label class="switch">Information:
        <select v-model.string="information" @change="onChange">
          <option v-for="(item , index) in myOptionsArray" v-bind:key="index">
            {{item}}
          </option>
        </select>
    </label>
</template>
