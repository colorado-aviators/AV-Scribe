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
    airport = document.querySelector("#airport");
    val = airport.value.toUpperCase();
    const regex = /^[A-Z0-9]+$/;
    if (val == "") {
        return
    }
    if (!regex.test(val)) {
        alert("Airport code invalid");
    }
    // overwrite the value with the uppercase version!
    airport.value = val;
}

function get_airport_val() {
    return document.querySelector("#airport").value;
}

function get_information_val() {
    return document.querySelector("#information").value;
}

function get_time_val() {
    return document.querySelector("#timePicker").value;
}

function get_wind_variable() {
    return document.querySelector("#windVariableBox").checked;
}

function get_wind_dir_val() {
    return document.querySelector("#windDirPicker").value;
}

function get_wind_vel_val() {
    // copying records from the wind gust section...
    x = document.querySelector("#windVelPicker").value;
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
    x = document.querySelector("#windGustPicker").value;
    const high = 201;
    const low = 0;
    const optimum = 5;
    const gradient = .1;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    return Math.round(val);
}

function get_visibility_val() {
    return document.querySelector("#visibilityPicker").value;
}

function get_altimeter_val(){
    x = document.querySelector("#altimeterPicker").valueAsNumber;
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

function get_elevation_val(){
    x = document.querySelector("#elevationPicker").valueAsNumber;
    // https://en.wikipedia.org/wiki/List_of_highest_airports
    const high = 14472;  // Daocheng Yading Airport
    const low = -1266;  // Bar Yehuda Airfield
    // standard pressure at sea level
    const optimum = 3000;
    const gradient = .4;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    return val.toFixed(0);
}

function get_ceiling_val(){
    x = document.querySelector("#ceilingPicker").valueAsNumber;
    const high = 40000;
    const low = -1000;
    const optimum = 5000;
    const gradient = .4;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    val = Math.round(val / 1000.0, 3) * 1000;
    return val.toFixed(0);
}

function get_temperature_val(){
    x = document.querySelector("#tempPicker").valueAsNumber;
    const high = 57;
    const low = -83;
    const optimum = 0;  // standard temperature
    const gradient = .9;
    val = map_slider_to_weighted_range(x, high, low, optimum, gradient);
    return Math.round(val);
}

function get_dewpoint_val() {
    x = document.querySelector("#dewpointPicker").valueAsNumber;
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
    wind_variable = get_wind_variable();

    windVelPickerLabel = document.querySelector("#windVelPickerLabel");
    windDirPickerLabel = document.querySelector("#windDirPickerLabel");
    windGustPickerLabel = document.querySelector("#windGustPickerLabel");

    if (wind_vel_val == 0) {
        windDirPickerLabel.style.display = "none";
        windGustPickerLabel.style.display = "none";
    } else {
        display = windVelPickerLabel.style.display;
        if (wind_variable) {
            windDirPickerLabel.style.display = "none";
        } else {
            windDirPickerLabel.style.display = display;
        }
        windGustPickerLabel.style.display = display;

    }

    document.querySelector("#windVelPicker").style.accentColor = get_caution_color(wind_vel_val, 15, 25);
    document.querySelector("#windGustPicker").style.accentColor = get_caution_color(wind_gust_val, 5, 15);

    document.querySelector("#windVelPickerSpan").innerText = get_wind_vel_text();
    document.querySelector("#windDirPickerSpan").innerText = get_wind_dir_text();
    document.querySelector("#windGustPickerSpan").innerText = get_wind_gust_text();
}

function update_visibility() {
    document.querySelector("#visibilityPickerSpan").innerText = get_visibility_text();
    color = get_caution_color(get_visibility_val(), 5, 3);
    document.querySelector("#visibilityPicker").style.accentColor = color;
}

function update_spread() {
    temp = document.querySelector("#tempPickerSpan");
    dew = document.querySelector("#dewpointPickerSpan")

    temp.innerText = get_temperature_text();
    dew.innerText = get_dewpoint_text();

    spread = get_temperature_val() - get_dewpoint_val();
    color = get_caution_color(spread, 5, 0);
    document.querySelector("#dewpointPicker").style.accentColor = color;
}

function update_altimeter() {
    document.querySelector("#altimeterPickerSpan").innerText = get_altimeter_text();
}

function update_elevation() {
    document.querySelector("#elevationPickerSpan").innerText = get_elevation_text();
}

function update_ceiling() {
    document.querySelector("#ceilingPickerSpan").innerText = get_ceiling_text();
}

function update_atis_text() {
    document.querySelector("#atisText").innerText = get_atis_text();
}

function update_density_altitude_text() {
    document.querySelector("#densityAltitudeText").innerText = get_density_altitude_text();
}

function get_airport_text() {
    return `Airport: ${get_airport_val()}`;
}

function get_information_text() {
    return `Information: ${get_information_val()}`
}

function get_time_text() {
    return `Time: ${get_time_val()} Z`;
}

function get_wind_dir_text() {
    var windDirText = 'Wind Direction: ';
    wind_dir_val = get_wind_dir_val();
    wind_variable = get_wind_variable();
    if (get_wind_vel_val() == 0) {
        windDirText += 'Calm';
    }
    else if (wind_variable) {
        windDirText += 'VRB';
    }
    else {
        windDirText += wind_dir_val.toString().padStart(3, '0') + '\u00B0'
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
    wind_variable = get_wind_variable();
    if (wind_vel_val == 0) {
        windText += 'Calm';
        return windText;
    }
    if (wind_variable) {
        windText += 'VRB';
    }
    else {
        wind_dir_val = get_wind_dir_val();
        windText += wind_dir_val.toString().padStart(3, '0') + '\u00B0'
    }
    windText += ` @ ${wind_vel_val} KT`;
    if (wind_gust_val > 0) {
        windText += ` G ${wind_gust_val} KT`;
    }
    return windText;
}

function get_visibility_text() {
    return `Visibility: ${get_visibility_val()} SM`;
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

function get_elevation_text() {
    return `Field elevation: ${get_elevation_val()}`;
}

function get_ceiling_text() {
    var tmp = get_ceiling_val() / 100;
    var tmp = tmp.toString().padStart(3, '0')
    return `Ceiling: ${tmp}`;
}

function get_atis_text() {
    windChunk = '00000';
    wind_vel_val = get_wind_vel_val();
    wind_gust_val = get_wind_gust_val();
    const wind_variable = get_wind_variable();
    if (wind_vel_val > 0) {
        wind_dir_val = get_wind_dir_val();
        windChunk = wind_variable ? 'VRB' : wind_dir_val.toString().padStart(3, '0');
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


    var tmp = get_ceiling_val() / 100;
    var tmp = tmp.toString().padStart(3, '0');

    const chunks = [
        get_airport_val(),
        `INFO ${get_information_val()}`,
        get_time_val().replaceAll(/\s/g, '') + 'Z',
        windChunk,
        get_visibility_val().toString() + 'SM',
        `${format_temp(get_temperature_val())}/${format_temp(get_dewpoint_val())}`,
        'A' + get_altimeter_val().replace('.', ''),
        'CLG' + tmp,
    ];
    return chunks.join(' ');
}

function get_pressure_altitude_feet() {
    var pa = Number.parseFloat(get_elevation_val());
    var alt = Number.parseFloat(get_altimeter_val());
    pa += 145442.2 * (1 - (alt / 29.92126) ** .190261);
    return pa;
}

function get_temperature_isa() {
    const standard_temp = 15.0;
    var temperature_isa = standard_temp - 2.0 * get_elevation_val() / 1000.0;
    return temperature_isa;
}

function get_density_altitude() {
    // Density Altitude in Feet = Pressure Altitude in Feet + (120 x (OAT°C – ISA Temperature °C))
    var da = get_pressure_altitude_feet();
    temperature = get_temperature_val();
    var tmp = 120.0 * temperature - get_temperature_isa();
    da += tmp;
    return da;
}

function get_density_altitude_text() {
    return `Density alt.: ${Math.round(get_density_altitude())}`
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
        get_information_val(),
        get_airport_val(),
        get_time_val().replaceAll(' ','') + 'z',
    ]
    link.download = `information-${tags.join('-')}.txt`.toLowerCase();

    // Add click event to tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}
