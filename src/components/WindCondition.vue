<script setup lang="ts">
    import {ref, reactive} from "vue";
    const title = "Wind Condition";
    const windCondition = ref("Stable");
    const options = ["Stable", "Variable"];
    const textColor = ref("var(--color-text-untouched)");

    const emit = defineEmits<{
        (e: 'emitWindCondition', windCondition: string): void
    }>()
    const onChange = () => {
        textColor.value = "var(--color-text)"
        emit('emitWindCondition', windCondition.value);
    }
    const styleObject = reactive({
        color: textColor,
    })

    function initialize() {
        emit('emitWindCondition', windCondition.value);
    }

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
            <select v-model.string="windCondition" @change="onChange" :style="styleObject">
                <option v-for="(item , index) in options" v-bind:key="index">
                    {{item}}
                </option>
            </select>
        </div>
    </div>
</template>
