<script setup lang="ts">
    import {ref, reactive} from "vue"
    function get_time_string(time_elapsed: number) {
        var now = new Date();
        var time = new Date(now.getTime() - 1000 * 60 * time_elapsed);
        var dd = time.getUTCDate().toString().padStart(2, '0');
        var hh = time.getUTCHours().toString().padStart(2, '0');
        var mm = time.getUTCMinutes().toString().padStart(2, '0');
        var timeString = `${dd} ${hh} ${mm}`;
        return timeString;
    };
    const title = "ATIS Time"
    const myOptionsArray = Array.from(new Array(60),(val,index) => get_time_string(index));
    const selected = ref(myOptionsArray[0]);
    const textColor = ref("var(--color-text-untouched)");

    const emit = defineEmits<{
        (e: 'emitTime', selected: string): void
    }>()
    const onChange = () => {
        textColor.value = "var(--color-text-dark)"
        emit('emitTime', selected.value);
    }
    const styleObject = reactive({
        color: textColor,
    })

    function initialize() {
        emit('emitTime', selected.value);
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
            <select id="timePicker" v-model="selected" @change="onChange" :style="styleObject">
              <option v-for="(item , index) in myOptionsArray" v-bind:key="index">
                {{item}}
              </option>
            </select>
        </div>
    </div>
</template>
