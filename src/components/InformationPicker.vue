<script setup lang="ts">
    import {ref, reactive} from "vue"
    const title = "Information"
    const information = ref();
    const myOptionsArray = Array.from(new Array(26),(val,index)=> String.fromCharCode(65 + index) );
    const textColor = ref("var(--color-text-untouched)");

    const emit = defineEmits<{
        (e: 'emitInformation', information: string): void
    }>()
    const onChange = () => {
        textColor.value = "var(--color-text)"
        emit('emitInformation', information.value);
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
            <select v-model.string="information" @change="onChange" :style="styleObject">
                <option v-for="(item , index) in myOptionsArray" v-bind:key="index">
                    {{item}}
                </option>
            </select>
        </div>
    </div>
</template>
