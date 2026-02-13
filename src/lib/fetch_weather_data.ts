import { unit, Unit } from 'mathjs'
import { Coordinate, stationPressureToAltimeterSetting, Location } from './physics'
import * as airport_data from './fetch_airport_data'

export const StandardConditions = {
    temperature: unit(15, "C"),
    pressure: unit(29.92, "inHg"),
}

export const WeatherRecords = {
    /*
    These are world records. We can use them to set the max and min possible values,
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

    // Mount Washington (New Hampshire) Observatory on 12 April 1934
    // https://en.wikipedia.org/wiki/Wind_speed#Non-tornadic
    windVelocityHigh: unit(200.733, "kt"),
}

export class WeatherData{
    station: string;
    location: Location;
    elevation: Unit;
    altimeterSetting: Unit;
    meanMinTemp: Unit;
    meanMaxTemp: Unit;
    constructor(station: string, location: Location, elevation: Unit, altimeterSetting: Unit, meanMinTemp: Unit, meanMaxTemp: Unit) {
        this.station = station;
        this.location = location;
        this.elevation = elevation;
        this.altimeterSetting = altimeterSetting;
        this.meanMinTemp = meanMinTemp;
        this.meanMaxTemp = meanMaxTemp;
    }
}

export class Metar{
    location: Location;
    station: string;
    elevation: Unit;
    altimeterSetting: Unit;
    temperature: Unit;
    dewpoint: Unit;
    visibility: Unit;
    cloudBase: Unit | null;
    cloudAmount: string;
    windDirection: Unit | null;
    windSpeed: Unit | null;
    windGust: Unit | null;
    constructor(
        location: Location,
        station: string,
        elevation: Unit,
        altimeterSetting: Unit,
        temperature: Unit,
        dewpoint: Unit,
        visibility: Unit,
        cloudBase: Unit | null,
        cloudAmount: string,
        windDirection: Unit | null,
        windSpeed: Unit | null,
        windGust: Unit | null,
    ) {
        this.location = location;
        this.station = station;
        this.elevation = elevation;
        this.altimeterSetting = altimeterSetting;
        this.temperature = temperature;
        this.dewpoint = dewpoint;
        this.visibility = visibility;
        this.cloudBase = cloudBase;
        this.cloudAmount = cloudAmount;
        this.windDirection = windDirection;
        this.windSpeed = windSpeed;
        this.windGust = windGust;
    }
}

const indexedDB = window.indexedDB;

// These keys are used to store various data in the weather-data database.
const keyDatabase = "weather-data";
const keyObjectStore = "weather-data";
const keyStationID = "id";
const keyLatitude = "latitude";
const keyLongitude = "longitude";
const keyElevation = "elevation";
const keyAltimeterSetting = "altimeterSetting";
const keyMeanMaxTemp = "meanMaxTemp";
const keyMeanMinTemp = "meanMinTemp";

function getDataForString(stringVal: string) : number {
    /*
    A special helper function is used to decode NCEI's World Weather Records data.
    */
    return stringVal == "     " ? NaN : Number(stringVal);
}

function nanmean(array2D: Array<Array<number>>) : Int16Array {
    /*
    A special helper function to process annual records from the NCEI's World Weather Records dataset.
    This function applies the following transformations to the input Array:
        - reduces the first dimension via mean
        - converts the result to a 16-bit integer array for storage efficiency
    */
    let result = new Int16Array(12);
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

async function downloadDatabase(db: IDBDatabase) {
    /*
    Download and parse relevant weather record data from the World Weather Records dataset
    provided by the National Centers for Environmental Information.

    References:
    https://www.ncei.noaa.gov/data/world-weather-records/series-11/doc/WWR-data-format.txt
    */
    var os = db.createObjectStore(keyObjectStore, {keyPath: keyStationID});

    var xhttp = new XMLHttpRequest();
    let url = "https://www.ncei.noaa.gov/data/world-weather-records/series-11/access/data/WWR_Region00_2011-2016.txt";
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var objectStore = db.transaction(keyObjectStore, "readwrite").objectStore(keyObjectStore);
            let lines = xhttp.responseText.split("\n");
            var currentId = null;
            var data = new Map();
            var featureData = [];
            var currentFeatureIndex = null;
            var elevation = unit(0, "m");
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if (line.length == 0) {
                    continue;
                }
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
                            if (!means.includes(0)){
                                means = Int16Array.from(means, (val) => {
                                    let stationPressure = unit(val / 10, "mbar");
                                    let altimeterSetting = stationPressureToAltimeterSetting(
                                        stationPressure, elevation
                                    );
                                    return altimeterSetting.toNumber("inHg") * 100;
                                });
                                currentFeature = keyAltimeterSetting;
                                break;
                            }
                        case 3:
                            if (!means.includes(0)){
                                means = Int16Array.from(means, (val) => {
                                    let stationPressure = unit(val / 10, "mbar");
                                    let altimeterSetting = stationPressureToAltimeterSetting(
                                        stationPressure, unit(0, "m")
                                    );
                                    return altimeterSetting.toNumber("inHg") * 100;
                                });
                                currentFeature = keyAltimeterSetting;
                                break;
                            }
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
                        data.set(currentFeature, means);
                    }
                }
                currentFeatureIndex = featureIndex;

                if (stationChanged) {
                    currentId = stationId;
                    if (data.size > 0) {
                        let obj = Object.fromEntries(data);
                        let request = objectStore.add(obj);
                        data = new Map();
                    }
                    elevation = unit(getDataForString(line.substring(67, 72)), "m");
                    data.set(keyStationID, stationId);
                    data.set(keyLatitude, Coordinate.fromString(line.substring(8, 13)).toInt());
                    data.set(keyLongitude, Coordinate.fromString(line.substring(13, 19)).toInt());
                    data.set(keyElevation, elevation.toNumber());
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

                if (i == lines.length - 1) {
                    let obj = Object.fromEntries(data);
                    let request = objectStore.add(obj);
                }
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

async function upgradeDatabase(event: any) {
    // What to do if the existing database version is less than current (or it doesn't exist)
    switch(event.oldVersion) { // existing db version
        case 0:
            // version 0 means that the client had no database
            downloadDatabase(event.target.result);
            console.log(`Built weather database.`);
    }
};

function getClosestWeatherData(entries: Array<any>, location: Location) : WeatherData | null {
    /*
    The idea here is to use the given airport location to look up weather records from the nearest
    measurement location in the database. These records are returned as a WeatherData object.
    */
    let now = new Date();
    let currentMonth = now.getUTCMonth();
    let weatherData = null;

    entries = entries.filter((entry) => (
        "meanMaxTemp" in entry && "meanMinTemp" in entry && keyAltimeterSetting in entry
    )).filter((entry) => (
        Math.abs(entry.latitude - location.latitude.toInt()) + Math.abs(entry.longitude - location.longitude.toInt()) < 250
    )).sort(function(a, b) {
        let aDistance = new Location(
            Coordinate.fromInt(a[keyLatitude]),
            Coordinate.fromInt(a[keyLongitude])
        ).distanceTo(location).toNumeric("m");
        let bDistance = new Location(
            Coordinate.fromInt(b[keyLatitude]),
            Coordinate.fromInt(b[keyLongitude])
        ).distanceTo(location).toNumeric("m");
        return aDistance - bDistance;
    });
    let closestEntry = entries[0];

    if (typeof closestEntry == "undefined") {
        console.error("Problem getting closest weather data.");
    }
    else {
        let entryLocation = new Location(
            Coordinate.fromInt(closestEntry[keyLatitude]),
            Coordinate.fromInt(closestEntry[keyLongitude])
        )
        weatherData = new WeatherData(
            closestEntry[keyStationID],
            entryLocation,
            unit(closestEntry[keyElevation], "m"),
            unit(closestEntry[keyAltimeterSetting][currentMonth] / 100.0, "inHg"),
            unit(closestEntry[keyMeanMinTemp][currentMonth] / 10.0, "C"),
            unit(closestEntry[keyMeanMaxTemp][currentMonth] / 10.0, "C"),
        )
    }
    return weatherData;
}

async function queryDatabase(db: IDBDatabase, location: Location, RESOLVE: any, REJECT: any) {
    const getRequest = db.transaction(keyObjectStore).objectStore(keyObjectStore).getAll();

    getRequest.onsuccess = (event: any) => {
        const values = event.target.result;
        let weatherData = getClosestWeatherData(event.target.result, location);
        let locationString = `location ${weatherData.location.latitude.toInt()} x ${weatherData.location.longitude.toInt()}`
        RESOLVE(weatherData);
        console.log(`Retrieved weather data for ${locationString}.`);
    };

    getRequest.onerror = (err: any) => {
        let locationString = `location ${location.latitude.toInt()} x ${location.longitude.toInt()}`
        REJECT(`Error retrieving weather data for ${locationString}: ${err}.`);
    };
}

export function loadWeatherData(location: Location): Promise<WeatherData> {
    return new Promise((RESOLVE: any, REJECT: any) => {
        queryDatabase(db, location, RESOLVE, REJECT);
    });
}

async function queryMetar(icao: string, location: Location, RESOLVE: any, REJECT: any) {
    try {
        var closestIcao = icao;
        var metarUrl = `https://api.weather.gov/stations/${closestIcao}/observations/latest?require_qc=false`;
        var response = await fetch(metarUrl);

        if (!response.ok) {
            if (response.status === 404) {
                let entries = await airport_data.loadNearbyAirports(location);
                for (let entry of entries){
                    metarUrl = `https://api.weather.gov/stations/${entry.icao}/observations/latest?require_qc=false`
                    response = await fetch(metarUrl);
                    if (response.ok) {
                        closestIcao = entry.icao;
                        break;
                    }
                }
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const jsonData = await response.json();
        const rawMetarData = jsonData.properties;
        console.log(rawMetarData)
        let metar = new Metar(
            location,
            closestIcao,
            rawMetarData.elevation.value == null ? null : unit(rawMetarData.elevation.value, "m"),
            rawMetarData.barometricPressure.value == null ? null : unit(rawMetarData.barometricPressure.value, "Pa"),
            rawMetarData.temperature.value == null ? null : unit(rawMetarData.temperature.value, "C"),
            rawMetarData.dewpoint.value == null ? null : unit(rawMetarData.dewpoint.value, "C"),
            rawMetarData.visibility.value == null ? null : unit(rawMetarData.visibility.value, "m"),
            rawMetarData.cloudLayers.length == 0 ? null : (rawMetarData.cloudLayers[0].base.value == null ? null : unit(rawMetarData.cloudLayers[0].base.value, "m")),
            rawMetarData.cloudLayers.length == 0 ? "SKC" : rawMetarData.cloudLayers[0].amount,
            rawMetarData.windDirection.value == null ? null : unit(rawMetarData.windDirection.value, "deg"),
            rawMetarData.windSpeed.value == null ? null : unit(rawMetarData.windSpeed.value, "km/h"),
            rawMetarData.windGust.value == null ? null : unit(rawMetarData.windGust.value, "km/h"),
        )
        RESOLVE(metar);
        console.log(`Retrieved METAR data for ${closestIcao}.`);
    } catch (error) {
        REJECT(`Error retrieving METAR data for ${icao}: ${error}.`);
    }
}

export function loadMetar(icao: string, location: Location): Promise<Metar> {
    return new Promise((RESOLVE: any, REJECT: any) => {
        queryMetar(icao, location, RESOLVE, REJECT);
    });
}

var db: IDBDatabase;
let openRequest = indexedDB.open(keyDatabase, 1);
openRequest.onupgradeneeded = (event: any) => {upgradeDatabase(event)};
openRequest.onerror = () => {console.error("Error", openRequest.error);};
openRequest.onsuccess = (event: any) => {db = openRequest.result;};
