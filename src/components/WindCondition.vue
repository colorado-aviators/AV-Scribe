<script setup lang="ts">
    import {ref} from "vue";
    const title = "Wind Condition";
    const windCondition = ref("Stable");
    const options = ["Stable", "Variable"];

    const emit = defineEmits<{
        (e: 'emitWindCondition', windCondition: string): void
    }>()
    const onChange = () => {
        console.log(windCondition.value);
        emit('emitWindCondition', windCondition.value);
    }
    onChange();
</script>

<template>
    <div class="inputContainer">
        <label>
            <span class="title">
                {{ title }}:
            </span>
        </label>
        <div class="inputArea">
            <select v-model.string="windCondition" @change="onChange">
                <option v-for="(item , index) in options" v-bind:key="index">
                    {{item}}
                </option>
            </select>
        </div>
    </div>
</template>
