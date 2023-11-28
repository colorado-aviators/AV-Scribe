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

const tempText = document.querySelector("#tempText");
const temp = document.querySelector("#tempPicker");
tempText.textContent = temp.value;
temp.addEventListener("input", (event) => {
    tempText.textContent = event.target.value;
    update_spread();
});

const dewText = document.querySelector("#dewText");
const dew = document.querySelector("#dewPicker");
dewText.textContent = dew.value;
dew.addEventListener("input", (event) => {
    dewText.textContent = event.target.value;
    update_spread();
});

const altimeterText = document.querySelector("#altimeterText");
const altimeter = document.querySelector("#altimeterPicker");
altimeterText.textContent = altimeter.valueAsNumber.toFixed(2);
altimeter.addEventListener("input", (event) => {
    altimeterText.textContent = event.target.valueAsNumber.toFixed(2);
});

set_information_alphabet();


var checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener('change', function () {
    update_ranges(checkbox.checked);
});
update_ranges(false);

const downloadButton = document.querySelector("#downloadButton");
downloadButton.addEventListener("click", (event) => {
    download_transcript();
});
