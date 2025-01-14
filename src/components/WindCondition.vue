<script setup lang="ts">
    import {ref, reactive} from "vue";
    const title = "Wind Condition";
    const windCondition = ref("Stable");
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
        <div class="inputArea" @change=onChange>
            <input type="radio" v-model="windCondition" value="Stable" id="Stable"/>
            <label for="Stable">Stable</label>
            <input type="radio" v-model="windCondition" value="Variable" id="Variable"/>
            <label for="Variable">Variable</label>
        </div>
    </div>
</template>
