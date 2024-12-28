import { unit } from 'mathjs'
import { Coordinate, stationPressureToAltimeterSetting, Location } from './physics'

const keyDatabase = "weather-data";
const keyObjectStore = "weather-data";
const keyStationID = "id";
const keyLatitude = "latitude";
const keyLongitude = "longitude";
const keyElevation = "elevation";
const keyAltimeterSetting = "altimeterSetting";
const keyMeanMaxTemp = "meanMaxTemp";
const keyMeanMinTemp = "meanMinTemp";

export const StandardConditions = {
    temperature: unit(0, "C"),
    pressure: unit(29.92, "inHg"),
}

export const WeatherRecords = {
    /* These are world records. We can use them to set the max and min possible values,
    regardless of the airport's location.
    */
    temperatureHigh: unit(57, "C"),
    temperatureLow: unit(-83, "C"),
    dewpointHigh: unit(35, "C"),
    // I'm assuming this is the same as temp, but I haven't found a record.
    dewpointLow: unit(-83, "C"),
    // Agata, Russia (in Siberia) registered on December 31, 1968
    altimeterSettingHigh: unit(32.01, "inHg"),
    // https://www.wunderground.com/blog/weatherhistorian/world-and-us-lowest-barometric-pressure-records.html
    // Dutch Harbor, AK, on 10/25/1977 (record excludes tropical storms)
    altimeterSettingLow: unit(27.31, "inHg"),
    // Guam, Super Typhoon "Tip" 10/12/1979
    // altimeterSettingLow: unit(25.69, "inHg"),
}

class WeatherData{
    constructor(location: Location, elevation: unit, altimeterSetting: unit, meanMinTemp: unit, meanMaxTemp: unit) {
        this.location = location;
        this.elevation = elevation;
        this.altimeterSetting = altimeterSetting;
        this.meanMinTemp = meanMinTemp;
        this.meanMaxTemp = meanMaxTemp;
    }
}

function nanmean(array2D) {
    let result = new Int32Array(12);
    for (let i = 0; i < array2D[0].length ; i++ ) {
        let sum = 0;
        let count = 0;
        for (let row of array2D) {
            if (!Number.isNaN(row[i])) {
                sum += row[i];
                count += 1;
            }
        }
        if (count > 0) {
            result[i] = sum / count;
        }
    }
    return result;
}

function getDataForString(stringVal) {
    return stringVal == "     " ? NaN : Number(stringVal);
}

async function downloadDatabase(db) {
    var os = db.createObjectStore(keyObjectStore, {keyPath: keyStationID});

    var xhttp = new XMLHttpRequest();
    let url = "https://www.ncei.noaa.gov/data/world-weather-records/series-11/access/data/WWR_Region00_2011-2016.txt";
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var objectStore = db.transaction(keyObjectStore, "readwrite").objectStore(keyObjectStore);
            let lines = xhttp.responseText.split("\n");
            var currentId = null;
            var data = {};
            var featureData = [];
            var currentFeatureIndex = null;
            var elevation = null;
            for (let i in lines) {
                let line = lines[i];
                let stationId = Number(line.substring(2, 7));
                let stationChanged = stationId != currentId;
                let featureIndex = stationChanged ? null : Number(line[7]);
                let featureChanged = featureIndex !== currentFeatureIndex;

                if (featureChanged && featureData.length > 0) {
                    let means = nanmean(featureData);
                    featureData = [];
                    let currentFeature = null;
                    switch (currentFeatureIndex) {
                        case 2:
                            means = Int16Array.from(means, (val) => {
                                let stationPressure = unit(val / 10, "mbar");
                                let altimeterSetting = stationPressureToAltimeterSetting(
                                    stationPressure, elevation
                                );
                                return altimeterSetting.toNumeric("inHg") * 100;
                            });
                            currentFeature = keyAltimeterSetting;
                            break;
                        case 3:
                            means = Int16Array.from(means, (val) => {
                                let stationPressure = unit(val / 10, "mbar");
                                let altimeterSetting = stationPressureToAltimeterSetting(
                                    stationPressure, unit(0, "m")
                                );
                                return altimeterSetting.toNumeric("inHg") * 100;
                            });
                            currentFeature = keyAltimeterSetting;
                            break;
                        case 6: // mean daily maximum air temperature in tenths of Celsius degree
                            means = new Int16Array(means);
                            currentFeature = "meanMaxTemp";
                            break;
                        case 7: // mean daily minimum air temperature in tenths of Celsius degree
                            means = new Int16Array(means);
                            currentFeature = "meanMinTemp";
                            break;
                        default:
                            currentFeatureIndex = featureIndex;
                    }
                    if (currentFeature !== null) {
                        data[currentFeature] = means;
                    }
                }
                currentFeatureIndex = featureIndex;

                if (stationChanged) {
                    currentId = stationId;
                    if (Object.keys(data).length > 0) {
                        let request = objectStore.add(data);
                        data = {};
                    }
                    elevation = unit(getDataForString(line.substring(67, 72)), "m");
                    data[keyStationID] = stationId;
                    data[keyLatitude] = Coordinate.fromString(line.substring(8, 13)).toInt();
                    data[keyLongitude] = Coordinate.fromString(line.substring(13, 19)).toInt();
                    data[keyElevation] = elevation.toNumber();
                    featureData = [];
                }
                else {
                    let monthlyData = Array.from(
                        new Array(12), (val, index) => getDataForString(
                            line.substring(index * 5 + 13, index * 5 + 18)
                        )
                    );
                    featureData.push(monthlyData);
                }

                if (i == lines.length) {
                    let request = objectStore.add(data);
                }
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

async function upgradeDatabase(event) {
    // the existing database version is less than current (or it doesn't exist)
    switch(event.oldVersion) { // existing db version
        case 0:
            // version 0 means that the client had no database
            downloadDatabase(event.target.result);
    }
};

async function queryDatabase(event, location, RESOLVE, REJECT) {
    let db = event.target.result;
    const getRequest = db.transaction(keyObjectStore).objectStore(keyObjectStore).getAll();

    getRequest.onsuccess = (e) => {
        const values = e.target.result;
        let minDistance = 100000;
        let now = new Date();
        let currentMonth = now.getUTCMonth();
        let weatherData = null;
        for (let entry of values) {
            if ("meanMaxTemp" in entry && "meanMinTemp" in entry && keyAltimeterSetting in entry) {
                let entryLocation = new Location(
                    Coordinate.fromInt(entry[keyLatitude]),
                    Coordinate.fromInt(entry[keyLongitude])
                )
                let distance = entryLocation.distanceTo(location);
                if (distance < minDistance) {
                    minDistance = distance;
                    weatherData = new WeatherData(
                        entryLocation,
                        unit(entry[keyElevation], "m"),
                        unit(entry[keyAltimeterSetting][currentMonth] / 100.0, "inHg"),
                        unit(entry[keyMeanMinTemp][currentMonth] / 10.0, "C"),
                        unit(entry[keyMeanMaxTemp][currentMonth] / 10.0, "C"),
                    )
                }
            }
        }
        RESOLVE(weatherData);
    };

    getRequest.onerror = (err) => {
        REJECT(`Error to get student information: ${err}`);
    };
}

export function loadWeatherData(location) {
    return new Promise((RESOLVE, REJECT) => {
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        let openRequest = indexedDB.open(keyDatabase, 1);

        openRequest.onupgradeneeded = (event) => upgradeDatabase(event);
        openRequest.onerror = () => {console.error("Error", openRequest.error)};
        openRequest.onsuccess = (event) => queryDatabase(event, location, RESOLVE, REJECT);
    });
}