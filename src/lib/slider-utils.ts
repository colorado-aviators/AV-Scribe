import {ref, watch} from "vue"

export function map_slider_to_weighted_range(
        slider_position: number,
        high: number,
        low: number,
        optimum: number,
        gradient: number,
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
    if (gradient <= 0.0 || gradient >= 1.0) {
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

export function get_caution_color(value: number, low: number, high: number) {
    // high|low values are associated with red|blue, high|low caution level
    // value = 10
    // low = 15
    // high = 25
    var step = 1.0 / (high - low); // 25
    var caution_level = value - low; // -5
    var red = caution_level * step; // -125
    var blue = 1.0 - red;

    // clipping
    blue = blue < 0.0 ? 0.0 : blue;
    blue = blue > 1.0 ? 1.0 : blue;
    red = red < 0.0 ? 0.0 : red;
    red = red > 1.0 ? 1.0 : red;

    return `rgba(${red**.5 * 255.0}, 0, ${blue**.5 * 255.0})`;
}

export function onUpdate(
    start: number,
    high: number,
    low: number,
    optimum: number,
    gradient: number,
    sketchy: number,
    bad: number
) {
    var sliderValue = ref(start);

    var realValue = ref(map_slider_to_weighted_range(start, high, low, optimum, gradient));
    var cautionColor = ref('rgba(0, 0, 255.0)');

    watch(sliderValue, async (newVal, oldVal) => {
      realValue.value = map_slider_to_weighted_range(newVal, high, low, optimum, gradient);
      cautionColor.value = get_caution_color(realValue.value, sketchy, bad);
    })

    return {sliderValue, realValue, cautionColor};
}
