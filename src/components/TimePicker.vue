<script setup lang="ts">
    import {ref, defineEmits} from "vue"
    function get_time_string(time_elapsed: number) {
        var now = new Date();
        var time = new Date(now.getTime() - 1000 * 60 * time_elapsed);
        var dd = time.getUTCDate().toString().padStart(2, '0');
        var hh = time.getUTCHours().toString().padStart(2, '0');
        var mm = time.getUTCMinutes().toString().padStart(2, '0');
        var timeString = `${dd} ${hh} ${mm}`;
        return timeString;
    };
    const myOptionsArray = Array.from(new Array(60),(val,index) => get_time_string(index));
    const selected = ref(myOptionsArray[0]);

    const emit = defineEmits<{
        (e: 'emitTime', selected: string): void
    }>()
    const onChange = (selected: string) => {
        emit('emitTime', selected);
    }
    onChange(selected);
</script>

<template>
    <label class="switch">ATIS Time:
        <select id="timePicker" v-model="selected">
          <option v-for="(item , index) in myOptionsArray" v-bind:key="index">
            {{item}}
          </option>
        </select>
    </label>
</template>
