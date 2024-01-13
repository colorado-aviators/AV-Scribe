function set_information_alphabet() {
    const informationPicker = document.querySelector("#information");
    for (letter = 0; letter < 26; letter++) {
        var option = document.createElement("option");
        option.text = String.fromCharCode(65 + letter);
        informationPicker.add(option);
    }
}

function set_time_selector() {
    var now = new Date();
    const timePicker = document.querySelector("#timePicker");
    for (m = 0; m < 60; m++) {
        var option = document.createElement("option");
        time = new Date(now - 1000 * 60 * m);
        dd = time.getUTCDate().toString().padStart(2, '0');
        hh = time.getUTCHours().toString().padStart(2, '0');
        mm = time.getUTCMinutes().toString().padStart(2, '0');
        option.text = `${dd} ${hh} ${mm}`;
        timePicker.add(option);
    }
}

function validate_airport() {
    airportText = document.querySelector("#airport");
    airportText.value = airportText.value.toUpperCase();
    const regex = /^[A-Z0-9]+$/;
    if (airportText.value == "") {
        return
    }
    if (!regex.test(airportText.value)) {
        alert("Airport code invalid");
    }
}

function get_wind_vel_val() {
    // copying records from the wind gust section...
    x = windVel.value;
    const high = 201;
    const low = 0;
    const optimum = 5;
    const gradient = .1;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    return Math.round(val);
}

function get_wind_gust_val() {
    /*
    // Excluding inside cyclones, the highest surface wind speed ever officially recorded is 200.733 kn
    at the Mount Washington (New Hampshire) Observatory 1,917 m (6,288 ft) above sea level in the US on 12 April 1934
    Source: https://en.wikipedia.org/wiki/Wind_speed
    */
    x = windGust.value;
    const high = 201;
    const low = 0;
    const optimum = 5;
    const gradient = .1;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    return Math.round(val);
}

function get_altimeter_val(){
    x = altimeter.valueAsNumber;
    // https://www.wunderground.com/blog/weatherhistorian/world-and-us-anticyclonic-high-barometric-pressure-records.html
    const high = 32.01;  // Agata, Russia (in Siberia) registered on December 31, 1968
    // https://www.wunderground.com/blog/weatherhistorian/world-and-us-lowest-barometric-pressure-records.html
    // record excludes tropical storms
    // const low = 25.69;  // Guam, Super Typhoon "Tip" 10/12/1979
    const low = 27.31;  // Dutch Harbor, AK, on 10/25/1977
    // standard pressure at sea level
    const optimum = 29.92;
    const gradient = .9;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    return val.toFixed(2);
}

function get_temperature_val(){
    x = temp.valueAsNumber;
    const high = 57;
    const low = -83;
    const optimum = 0;  // standard temperature
    const gradient = .9;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    return Math.round(val);
}

function get_dewpoint_val() {
    x = dew.valueAsNumber;
    const high = 35;  // https://www.noaa.gov/jetstream/synoptic/heat-index
    // const low = -62;  // https://en.wikipedia.org/wiki/U.S._state_and_territory_temperature_extremes
    const low = -83;  // same as temperature low... i think this is how it works
    const optimum = 0;  // not sure where to put this...
    const gradient = .9;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    return Math.round(val);
}

function map_slider_to_weighted_range(
        slider_position,
        high,
        low,
        optimum,
        gradient,
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
    if (gradient <= 0 || gradient >= 1) {
        throw new Error('Gradient parameter must be in unit interval (0-1)!');
    }

    // convert gradient to a percentage of the tangent function's vertical asymptote
    c = gradient * Math.PI / 2;

    // the bias shifts the tangent function along the x axis
    scale_up = high - optimum;
    scale_down = optimum - low;
    bias = (1 - Math.atan(scale_up/scale_down * Math.tan(c))/c) / 2;
    weighted_x = slider_position * (1 - bias) - bias;
    tangent = Math.tan(weighted_x * c) / Math.tan(c);

    // apply y-axis scaling and translation
    val = scale_down * tangent + optimum;
    return val;
}

function update_wind() {
    wind_vel_val = get_wind_vel_val();
    wind_gust_val = get_wind_gust_val();
    if (wind_vel_val == 0) {
        document.querySelector("#windDirPickerLabel").style.display = "none";
        document.querySelector("#windGustPickerLabel").style.display = "none";
    } else {
        if (windVariableBox.checked) {
            document.querySelector("#windDirPickerLabel").style.display = "none";
        } else {
            display = document.querySelector("#windVelPickerLabel").style.display;
            document.querySelector("#windDirPickerLabel").style.display = display;
        }
        display = document.querySelector("#windVelPickerLabel").style.display;
        document.querySelector("#windGustPickerLabel").style.display = display;
    }
    windVel.style.accentColor = get_caution_color(wind_vel_val, 15, 25);
    windGust.style.accentColor = get_caution_color(wind_gust_val, 5, 15);
    document.querySelector("#windVelPickerSpan").innerText = get_wind_vel_text();
    document.querySelector("#windDirPickerSpan").innerText = get_wind_dir_text();
    document.querySelector("#windGustPickerSpan").innerText = get_wind_gust_text();
}

function update_visibility() {
    document.querySelector("#visibilityPickerSpan").innerText = get_visibility_text();
    color = get_caution_color(visibility.value, 5, 3);
    visibility.style.accentColor = color;
}

function update_spread() {
    document.querySelector("#tempPickerSpan").innerText = get_temperature_text();
    document.querySelector("#dewpointPickerSpan").innerText = get_dewpoint_text();
    spread = get_temperature_val() - get_dewpoint_val();
    color = get_caution_color(spread, 5, 0);
    dew.style.accentColor = color;
}

function update_altimeter() {
    document.querySelector("#altimeterPickerSpan").innerText = get_altimeter_text();
}

function update_atis_text() {
    const atisText = document.querySelector("#atisText");
    atisText.innerText = get_atis_text();
}

function get_airport_text() {
    const airportText = document.querySelector("#airport");
    return `Airport: ${airportText.value}`;
}

function get_information_text() {
    const informationPicker = document.querySelector("#information");
    return `Information: ${informationPicker.value}`
}

function get_time_text() {
    const timePicker = document.querySelector("#timePicker");
    return `Time: ${timePicker.value} Z`;
}

function get_wind_dir_text() {
    var windDirText = 'Wind Direction: ';
    if (get_wind_vel_val() == 0) {
        windDirText += 'Calm';
    }
    else if (windVariableBox.checked) {
        windDirText += 'VRB';
    }
    else {
        windDirText += windDir.value.toString().padStart(3, '0') + '\u00B0'
    }
    return windDirText;
}

function get_wind_vel_text() {
    var windVelText = 'Wind Velocity: ';
    wind_vel_val = get_wind_vel_val();
    windVelText += wind_vel_val == 0 ? 'Calm' : `${wind_vel_val} KT`;
    return windVelText;
}

function get_wind_gust_text() {
    var windGustText = 'Wind Gust: ';
    wind_gust_val = get_wind_gust_val();
    windGustText += wind_gust_val == 0 ? 'None' : `${wind_gust_val} KT`;
    return windGustText;
}

function get_wind_text() {
    var windText = 'Wind: ';
    wind_vel_val = get_wind_vel_val();
    wind_gust_val = get_wind_gust_val();
    if (wind_vel_val == 0) {
        windText += 'Calm';
        return windText;
    }
    if (windVariableBox.checked) {
        windText += 'VRB';
    }
    else {
        windText += windDir.value.toString().padStart(3, '0') + '\u00B0'
    }
    windText += ` @ ${wind_vel_val} KT`;
    if (wind_gust_val > 0) {
        windText += ` G ${wind_gust_val} KT`;
    }
    return windText;
}

function get_visibility_text() {
    return `Visibility: ${visibility.value} SM`;
}

function get_temperature_text() {
    return `Temperature: ${get_temperature_val()}\u00B0C`;
}

function get_dewpoint_text() {
    return `Dew Point: ${get_dewpoint_val()}\u00B0C`;
}

function get_spread_text() {
    return `Spread: ${get_temperature_val() - get_dewpoint_val()}\u00B0C`
}

function get_altimeter_text() {
    return `Altimeter Setting: ${get_altimeter_val()}`;
}

function get_atis_text() {
    windChunk = '00000';
    wind_vel_val = get_wind_vel_val();
    wind_gust_val = get_wind_gust_val();
    if (wind_vel_val > 0) {
        windChunk = windVariableBox.checked ? 'VRB' : windDir.value.toString().padStart(3, '0');
        windChunk += wind_vel_val.toString().padStart(2, '0');
        if (wind_gust_val != 0) {
            windChunk += `G${wind_gust_val}`;
        }
    }
    windChunk += 'KT';

    function format_temp(val) {
        const negative = val.toString().startsWith('-');
        var formatted = val.toString().replace('-','').padStart(2, '0');
        if (negative) {
            formatted = 'M' + formatted;
        }
        return formatted
    }

    const chunks = [
        airport.value,
        `INFO ${information.value}`,
        timePicker.value.replaceAll(/\s/g, '') + 'Z',
        windChunk,
        visibility.value.toString() + 'SM',
        `${format_temp(get_temperature_val())}/${format_temp(get_dewpoint_val())}`,
        'A' + get_altimeter_val().replace('.', ''),
    ];
    return chunks.join(' ');
}

function get_caution_color(value, low, high) {
    // high|low values are associated with red|blue, high|low caution level
    // value = 10
    // low = 15
    // high = 25
    step = 1.0 / (high - low); // 25
    caution_level = value - low; // -5
    red = caution_level * step; // -125
    blue = 1.0 - red;

    // clipping
    blue = blue < 0.0 ? 0.0 : blue;
    blue = blue > 1.0 ? 1.0 : blue;
    red = red < 0.0 ? 0.0 : red;
    red = red > 1.0 ? 1.0 : red;

    return `rgba(${red**.5 * 255.0}, 0, ${blue**.5 * 255.0})`;
}

function download_transcript () {
    // Create element with <a> tag
    const link = document.createElement("a");

    // Create a blob object with the file content which you want to add to the file

    var content = [
        get_atis_text(),
        '',
        get_airport_text(),
        get_information_text(),
        get_time_text(),
        get_wind_text(),
        get_visibility_text(),
        get_temperature_text(),
        get_dewpoint_text(),
        get_spread_text(),
        get_altimeter_text(),
    ]
    const file = new Blob([content.join("\r\n")], { type: 'text/plain'});

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    tags = [
        document.querySelector("#information").value,
        document.querySelector("#airport").value,
        document.querySelector("#timePicker").value.replaceAll(' ','') + 'z',
    ]
    link.download = `information-${tags.join('-')}.txt`.toLowerCase();

    // Add click event to tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}
