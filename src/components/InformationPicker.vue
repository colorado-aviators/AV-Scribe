<script setup lang="ts">
    import {ref} from "vue"
    const title = "Information"
    const information = ref();
    const myOptionsArray = Array.from(new Array(26),(val,index)=> String.fromCharCode(65 + index) );

    const emit = defineEmits<{
        (e: 'emitInformation', information: string): void
    }>()
    const onChange = () => {
        emit('emitInformation', information.value);
    }
</script>

<template>
    <div class="inputContainer">
        <label>
            <span class="title">
                {{ title }}:
            </span>
        </label>
        <div class="inputArea">
            <select v-model.string="information" @change="onChange">
                <option v-for="(item , index) in myOptionsArray" v-bind:key="index">
                    {{item}}
                </option>
            </select>
        </div>
    </div>
</template>
