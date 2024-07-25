<script setup lang="ts">
    import {ref} from "vue"
    const information = ref();
    const myOptionsArray = Array.from(new Array(26),(val,index)=> String.fromCharCode(65 + index) );
</script>

<template>
    <label class="switch">Information:
        <select @change="$emit('emitInformation', information)" v-model="information">
          <option v-for="(item , index) in myOptionsArray" v-bind:key="index">
            {{item}}
          </option>
        </select>
    </label>
</template>
