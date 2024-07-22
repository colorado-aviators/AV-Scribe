function add_event_listeners() {
    const airport = document.querySelector("#airport");
    const information = document.querySelector("#information");
    const time = document.querySelector("#timePicker");
    const windVariableBox = document.querySelector("#windVariableBox");
    const windDir = document.querySelector("#windDirPicker");
    const windVel = document.querySelector("#windVelPicker");
    const windGust = document.querySelector("#windGustPicker");
    const visibility = document.querySelector("#visibilityPicker");
    const temp = document.querySelector("#tempPicker");
    const dew = document.querySelector("#dewpointPicker");
    const altimeter = document.querySelector("#altimeterPicker");
    const elevation = document.querySelector("#elevationPicker");
    const ceiling = document.querySelector("#ceilingPicker");
    const downloadButton = document.querySelector("#downloadButton");

    airport.addEventListener("input", (event) => {validate_airport();});
    visibility.addEventListener("input", (event) => {update_visibility();});
    temp.addEventListener("input", (event) => {update_spread();});
    dew.addEventListener("input", (event) => {update_spread();});
    altimeter.addEventListener("input", (event) => {update_altimeter();});
    elevation.addEventListener("input", (event) => {update_elevation();});
    ceiling.addEventListener("input", (event) => {update_ceiling();});
    downloadButton.addEventListener("click", (event) => {download_transcript();});

    selectors = [
        windVariableBox,
        windDir,
        windVel,
        windGust,
    ];
    for (let s in selectors) {
        selectors[s].addEventListener("input", (event) => {update_wind();});
    }

    selectors = [
        tempPicker,
        altimeterPicker,
        elevationPicker,
    ];
    for (let s in selectors) {
        selectors[s].addEventListener("input", (event) => {update_density_altitude_text();});
    }

    selectors = [
        airport,
        information,
        time,
        windVariableBox,
        windDir,
        windVel,
        windGust,
        visibility,
        temp,
        dew,
        altimeter,
        ceiling,
    ];
    for (let s in selectors) {
        selectors[s].addEventListener("input", (event) => {update_atis_text();});
    }
}

function initialize_values() {
    set_information_alphabet();
    set_time_selector();
    update_wind();
    update_visibility();
    update_spread();
    update_atis_text();
    update_altimeter();
    update_elevation();
    update_ceiling();
}

add_event_listeners();
initialize_values();
