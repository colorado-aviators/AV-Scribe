<script setup lang="ts">
    import {ref, watch, reactive} from "vue"

    const props = defineProps({
        sliderText: {
            type: String,
            default: "",
            required: true,
        },
        start: {
            type: Number,
            default: 0.0,
            required: false,
        },
        high: {
            type: Number,
            default: 1.0,
            required: false,
        },
        low: {
            type: Number,
            default: -1.0,
            required: false,
        },
        optimum: {
            type: Number,
            required: false,
        },
        gradient: {
            type: Number,
            required: false,
        },
        sketchy: {
            type: Number,
            required: false,
        },
        bad: {
            type: Number,
            required: false,
        },
        step: {
            type: Number,
            default: .001,
            required: false,
        },
        numDigits: {
            type: Number,
            default: 0,
            required: false,
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false,
        }
    });

    const resolution = 10 ** -props.numDigits;
    const disabledSliderColor = "rgba(255.0,255.0,255.0,.1)";
    const initialSliderColor = 'rgba(0, 0, 255.0, .2)';
    const sliderColor = ref();
    const sliderValue = ref(props.start);
    const realValue = ref();
    var updated = false;

    function map_slider_to_weighted_range(
        slider_position: number,
        high: number,
        low: number,
        optimum: number | undefined,
        gradient: number | undefined,
    ) {
        /* The goal here is to create a weighting function to map slider position onto the entire range of possible values.

        We'll implement a tangent curve with the following characteristics:
        - Translated and scaled along y dimension to convert slider input range to possible data range.
        - Translated along x dimension to optimize for tuning about the most common slider position.
        - Applies a parameterizable weighting function via the tangent curve.
        - Slider range is expected to be from -1 to 1
        */

        /* use this value to control the steepness of the slider's compression on each extreme.
        Gradient MUST be a float value in the unit interval (0 to 1).
        As gradient approaches 0, weighting function goes linear.
        As gradient approaches 1, weighting function has very steep compression on each extreme.
        */
        if (!gradient || !optimum) {
            return low + (slider_position + 1) / 2 * (high - low)
        }
        if (gradient < 0.0 || gradient >= 1.0) {
            throw new Error('Gradient parameter must be in unit interval (0-1)!');
        }

        // convert gradient to a percentage of the tangent function's vertical asymptote
        var c = gradient * Math.PI / 2.0;

        // the bias shifts the tangent function along the x axis
        var scale_up = high - optimum;
        var scale_down = optimum - low;
        var bias = (1.0 - Math.atan(scale_up/scale_down * Math.tan(c))/c) / 2.0;
        var weighted_x = slider_position * (1.0 - bias) - bias;
        var tangent = Math.tan(weighted_x * c) / Math.tan(c);

        // apply y-axis scaling and translation
        var val = scale_down * tangent + optimum;
        return val;
    }

    function map_weighted_range_to_slider(
        val: number,
        high: number,
        low: number,
        optimum: number | undefined,
        gradient: number | undefined,
    ) {
        if (!gradient || !optimum) {
            return (val - low) / (high - low) * 2 - 1;
        }
        if (gradient <= 0.0 || gradient >= 1.0) {
            throw new Error('Gradient parameter must be in unit interval (0-1)!');
        }

        // convert gradient to a percentage of the tangent function's vertical asymptote
        var c = gradient * Math.PI / 2.0;

        // the bias shifts the tangent function along the x axis
        var scale_up = high - optimum;
        var scale_down = optimum - low;
        var bias = (1.0 - Math.atan(scale_up/scale_down * Math.tan(c))/c) / 2.0;

        var slider_position = (Math.atan(Math.tan(c) * (val - optimum) / scale_down) / c + bias) / (1.0 - bias);

        return slider_position;
    }


    function get_caution_color(value: number) {
        // high|low values are associated with red|blue, high|low caution level
        // value = 10
        // low = 15
        // high = 25
        var red = 0;
        if (props.gradient && props.sketchy && props.bad) {
            let step = 1.0 / (props.bad - props.sketchy); // 25
            let caution_level = value - props.sketchy; // -5
            red = caution_level * step; // -125
        }
        var blue = 1.0 - red;

        // clipping
        blue = blue < 0.0 ? 0.0 : blue;
        blue = blue > 1.0 ? 1.0 : blue;
        red = red < 0.0 ? 0.0 : red;
        red = red > 1.0 ? 1.0 : red;

        return `rgba(${red**.5 * 255.0}, 0, ${blue**.5 * 255.0})`;
    }

    function set_slider_color() {
        if (props.disabled) {sliderColor.value = disabledSliderColor}
        else if (!updated) {sliderColor.value = initialSliderColor}
        else {sliderColor.value = get_caution_color(realValue.value)}
    }

    function fine_tune(increment: number) {
        let newVal = realValue.value + increment;
        sliderValue.value = map_weighted_range_to_slider(
            newVal,
            props.high,
            props.low,
            props.optimum,
            props.gradient,
        );
        updated = true;
        updateSlider();
    };

    watch(() => props.disabled as Boolean, () => {
        set_slider_color();
    })

    watch(() => (props.sketchy as number, props.bad as number), () => {
        updateSlider();
    })

    const emit = defineEmits<{
        (e: 'emitValue', realValue: number): void
    }>()

    function updateSlider() {
        realValue.value = map_slider_to_weighted_range(sliderValue.value, props.high, props.low, props.optimum, props.gradient);
        realValue.value = Math.round(realValue.value / resolution) * resolution;
        set_slider_color();
        emit('emitValue', realValue.value);
    }

    function onInput () {
        updated = true;
        updateSlider();
    }

    const styleObject = reactive({
        background: sliderColor,
        accentColor: sliderColor,
        marginLeft: "10px",
        marginRight: "10px",
    })

    updateSlider();
</script>

<template>
    <label>
        <button @click="fine_tune(-resolution)" :disabled="disabled || realValue <= low"> - </button>
        <input
            type="range"
            v-model.number="sliderValue"
            @input="onInput"
            class="custom-slider"
            :style="styleObject"
            min=-1
            max=1
            :step="step"
            :disabled="disabled"
        >
        <span v-text="sliderText"></span>
        <button @click="fine_tune(resolution)" :disabled="disabled || realValue >= high"> + </button>
    </label>
</template>

<style>
    /* style the input element with type "range" */
    .custom-slider {
        -webkit-appearance: none;
        --trackHeight: 30px;
        --thumbRadius: 45px;
        width: 100%;
        margin-left: 0px;
        margin-right: 0px;
        margin-top: 30px;
        margin-bottom: 30px;
        position: relative;
        /* pointer-events: none; */
        border-radius: 999px;
        z-index: 0;
    }

    /* ::before element to replace the slider track */
    .custom-slider input[type="range"]::before {
        -webkit-appearance: none;
        content: "";
        position: absolute;
        width: var(--ProgressPercent, 100%);
        height: 100%;
        background: rgba(0.0, 0.0, 255.0);
        /* z-index: -1; */
        pointer-events: none;
        border-radius: 999px;
    }

    custom-slider:disabled input[type="range"]::before {
        accent-color: #cccccc;
    }

    /* `::-webkit-slider-runnable-track` targets the track (background) of a range slider in chrome and safari browsers. */
    .custom-slider::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: var(--trackHeight);
        border-radius: 999px;
    }

    /* `::-moz-range-track` targets the track (background) of a range slider in Mozilla Firefox. */
    .custom-slider input[type="range"]::-moz-range-track {
        -webkit-appearance: none;
        background: #005a3c;
        height: var(--trackHeight);
        border-radius: 999px;
    }

    .custom-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        position: relative;
        top: 50%;
        transform: translate(0, -50%);
        width: var(--thumbRadius);
        height: var(--thumbRadius);
        /* margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2); */
        background: white;
        border-radius: 999px;
        pointer-events: all;
        z-index: 1;
    }
</style>