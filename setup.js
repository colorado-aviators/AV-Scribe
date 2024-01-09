const windVariableBox = document.querySelector("#windVariableBox");
windVariableBox.addEventListener("change", function () {
  update_wind();
});

const windDir = document.querySelector("#windDirPicker");
windDir.addEventListener("input", (event) => {
  update_wind();
});

const windVel = document.querySelector("#windVelPicker");
windVel.addEventListener("input", (event) => {
  update_wind();
});

const windGust = document.querySelector("#windGustPicker");
windGust.addEventListener("input", (event) => {
  update_wind();
});

const visibility = document.querySelector("#visibilityPicker");
visibility.addEventListener("input", (event) => {
  update_visibility();
});

const temp = document.querySelector("#tempPicker");
temp.addEventListener("input", (event) => {
    update_spread();
});

const dew = document.querySelector("#dewpointPicker");
dew.addEventListener("input", (event) => {
    update_spread();
});

const altimeterText = document.querySelector("#altimeterText");
const altimeter = document.querySelector("#altimeterPicker");
altimeterText.textContent = altimeter.valueAsNumber.toFixed(2);
altimeter.addEventListener("input", (event) => {
    altimeterText.textContent = event.target.valueAsNumber.toFixed(2);
});

set_information_alphabet();
set_time_selector();
update_wind();
update_visibility();
update_spread();

var checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener('change', function () {
    update_ranges(checkbox.checked);
});
update_ranges(false);

const downloadButton = document.querySelector("#downloadButton");
downloadButton.addEventListener("click", (event) => {
    download_transcript();
});
