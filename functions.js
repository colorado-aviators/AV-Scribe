function set_information_alphabet() {
    const informationPicker = document.querySelector("#information");
    for (letter = 0; letter < 26; letter++) {
        var option = document.createElement("option");
        option.text = String.fromCharCode(65 + letter);
        informationPicker.add(option);
    }
}

function update_wind() {
    const windText = document.querySelector("#windText");
    if (windVel.value == 0) {
        document.querySelector("#windDirPickerLabel").style.display = "none";
        document.querySelector("#windGustPickerLabel").style.display = "none";
        windText.textContent = 'Calm';
    } else {
        windDirText = windDir.value
        if (windVariableBox.checked) {
            document.querySelector("#windDirPickerLabel").style.display = "none";
            windDirText = "VRB";
        } else {
            display = document.querySelector("#windVelPickerLabel").style.display;
            document.querySelector("#windDirPickerLabel").style.display = display;
        }
        display = document.querySelector("#windVelPickerLabel").style.display
        document.querySelector("#windGustPickerLabel").style.display = display;
        windText.textContent = `${windDirText} @ ${windVel.value} KT`
        if (windGust.value > 0) {
            windText.textContent = windText.textContent + ` G ${windGust.value} KT`
        }
    }
    windVel.style.accentColor = get_caution_color(windVel.value, 15, 25);
    windGust.style.accentColor = get_caution_color(windGust.value, 5, 15);
}

function update_visibility() {
    const visibilityText = document.querySelector("#visibilityText");
    visibilityText.textContent = visibility.value;
    color = get_caution_color(visibility.value, 5, 3);
    visibility.style.accentColor = color;
    visibilityText.style.color = color;
}

function update_visibility2() {
    const visibilityText = document.querySelector("#visibilityText2");
    visibilityText.textContent = visibility.value;
}

function update_spread() {
    spread = temp.value - dew.value;
    const spreadText = document.querySelector("#spreadText");
    spreadText.textContent = spread;
    color = get_caution_color(spread, 5, 0);
    dew.style.accentColor = color;
    spreadText.style.color = color;
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

    const informationPicker = document.querySelector("#information");
    // Create a blog object with the file content which you want to add to the file
    var content = [
        `Information: ${informationPicker.value}`,
        document.querySelector("#windLine").innerText,
        document.querySelector("#visibilityLine").innerText,
        document.querySelector("#tempLine").innerText,
        document.querySelector("#spreadLine").innerText,
        document.querySelector("#altimeterLine").innerText,
    ]
    const file = new Blob([content.join("\r\n")], { type: 'text/plain'});

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    link.download = "information_a.txt";

    // Add click event to tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}