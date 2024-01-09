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

function update_wind() {
    if (windVel.value == 0) {
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
    windVel.style.accentColor = get_caution_color(windVel.value, 15, 25);
    windGust.style.accentColor = get_caution_color(windGust.value, 5, 15);
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
    spread = temp.value - dew.value;
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
    if (windVel.value == 0) {
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
    windVelText += windVel.value == 0 ? 'Calm' : `${windVel.value} KT`;
    return windVelText;
}

function get_wind_gust_text() {
    var windGustText = 'Wind Gust: ';
    windGustText += windGust.value == 0 ? 'None' : `${windGust.value} KT`;
    return windGustText;
}

function get_wind_text() {
    var windText = 'Wind: ';
    if (windVel.value == 0) {
        windText += 'Calm';
        return windText;
    }
    if (windVariableBox.checked) {
        windText += 'VRB';
    }
    else {
        windText += windDir.value.toString().padStart(3, '0') + '\u00B0'
    }
    windText += ` @ ${windVel.value} KT`;
    if (windGust.value > 0) {
        windText += ` G ${windGust.value} KT`;
    }
    return windText;
}

function get_visibility_text() {
    return `Visibility: ${visibility.value} SM`;
}

function get_temperature_text() {
    return `Temperature: ${temp.value}\u00B0C`;
}

function get_dewpoint_text() {
    return `Dew Point: ${dew.value}\u00B0C`;
}

function get_spread_text() {
    return `Spread: ${temp.value - dew.value}\u00B0C`
}

function get_altimeter_text() {
    return `Altimeter Setting: ${altimeter.valueAsNumber.toFixed(2)}`;
}

function get_atis_text() {
    windChunk = windDir.value.toString().padStart(3, '0');
    windChunk += windVel.value.toString().padStart(2, '0');
    if (windGust.value != 0) {
        windChunk += `G${windGust.value}`;
    }
    windChunk += 'KT';

    function format_temp(temp) {
        const negative = temp.value.startsWith('-');
        var formatted = temp.value.replace('-','').padStart(2, '0');
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
        `${format_temp(temp)}/${format_temp(dew)}`,
        'A' + parseFloat(altimeter.value).toFixed(2).replace('.', ''),
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

function update_ranges (useUSRecords) {
    if (useUSRecords) {
        // https://www.wunderground.com/blog/weatherhistorian/world-and-us-lowest-barometric-pressure-records.html
        // record excludes tropical storms
        altimeter.min = 27.31;
        altimeter.max = 31.85;
        // https://en.wikipedia.org/wiki/U.S._state_and_territory_temperature_extremes
        temp.min = -62;
        temp.max = 57;
        https://homework.study.com/explanation/what-is-the-highest-dew-point-recorded-in-the-u-s.html
        dew.max = 32;
    } else {
        altimeter.min = 25.69;
        // https://www.wunderground.com/blog/weatherhistorian/world-and-us-anticyclonic-high-barometric-pressure-records.html
        altimeter.max = 32.01;
        temp.min = -83;
        temp.max = 57;
        // https://www.noaa.gov/jetstream/synoptic/heat-index
        dew.max = 35;
    }
    // i think this is how it works...
    dew.min = temp.min
}

function download_transcript () {
    // Create element with <a> tag
    const link = document.createElement("a");

    // Create a blog object with the file content which you want to add to the file

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
    const informationPicker = document.querySelector("#information");
    link.download = `information_${informationPicker.value}.txt`;

    // Add click event to tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}
