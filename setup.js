const airport = document.querySelector("#airport");
airport.addEventListener("input", (event) => {
    validate_airport();
    update_atis_text();
});

const windVariableBox = document.querySelector("#windVariableBox");
windVariableBox.addEventListener("change", function () {
    update_wind();
    update_atis_text();
});

const windDir = document.querySelector("#windDirPicker");
windDir.addEventListener("input", (event) => {
    update_wind();
    update_atis_text();
});

const windVel = document.querySelector("#windVelPicker");
windVel.addEventListener("input", (event) => {
    update_wind();
    update_atis_text();
});

const windGust = document.querySelector("#windGustPicker");
windGust.addEventListener("input", (event) => {
    update_wind();
    update_atis_text();
});

const visibility = document.querySelector("#visibilityPicker");
visibility.addEventListener("input", (event) => {
    update_visibility();
    update_atis_text();
});

const temp = document.querySelector("#tempPicker");
temp.addEventListener("input", (event) => {
    update_spread();
    update_atis_text();
});

const dew = document.querySelector("#dewpointPicker");
dew.addEventListener("input", (event) => {
    update_spread();
    update_atis_text();
});

const altimeter = document.querySelector("#altimeterPicker");
altimeter.addEventListener("input", (event) => {
    update_altimeter();
    update_atis_text();
});

set_information_alphabet();
set_time_selector();
update_wind();
update_visibility();
update_spread();
update_atis_text();
update_altimeter();

var checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener('change', function () {
    update_ranges(checkbox.checked);
    update_atis_text();
});
update_ranges(false);

const downloadButton = document.querySelector("#downloadButton");
downloadButton.addEventListener("click", (event) => {
    download_transcript();
    update_atis_text();
});
