import { Coordinate, Location } from './physics'
import {unit} from "mathjs"

const keyDatabase = "airport-data";
const keyObjectStore = "airport-data"
const keyAirportID = "id";
const keyElevation = "elevation-in-ft";
const keyLatitude = "latitude";
const keyLongitude = "longitude";
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

class AirportData{
    constructor(airportID, elevation_in_feet, location) {
        this.id = airportID;
        this.elevation_in_feet = elevation_in_feet;
        this.location = location;
    }
    get elevation_in_feet() {
        return this._elevation_in_feet;
    }
    set elevation_in_feet (val) {
        this._elevation_in_feet = val;
    }
    get id () {
        return this._id;
    }
    set id (val) {
        this._id = val;
    }
}

function getAviationFacilitiesURL(resultOffset){
    let outFields = [
        //"EFF_DATE",
        "ARPT_ID",
        //"CITY",
        //"ARPT_NAME",
        //"LAT_SEC",
        "LAT_HEMIS",
        //"LAT_DECIMAL",
        "LAT_DEG",
        "LAT_MIN",
        //"LONG_SEC",
        "LONG_HEMIS",
        //"LONG_DECIMAL",
        "LONG_DEG",
        "LONG_MIN",
        "ELEV",
        //"TPA",
        //"ARPT_STATUS",
        //"ICAO_ID",
        //"CTA"
    ]
    var url = "https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_Aviation_Facilities/FeatureServer/0/query?";
    var query = [
        "where=1%3D1",
        "outFields=" + outFields.join(","),
        "outSR=4326",
        "f=json",
        "resultOffset=" + resultOffset.toString(),
    ].join("&");
    return url + query;
}

async function downloadDatabase(db) {
    db.createObjectStore(keyObjectStore, {keyPath: keyAirportID});
    var recordCount = 0;
    while (recordCount % 2000 == 0) {
        let url = getAviationFacilitiesURL(recordCount);
        let response = await fetch(url);
        if (response.ok) { // if HTTP-status is 200-299
            // get the response body (the method explained below)
            let json = await response.json();
            var objectStore = db.transaction(keyObjectStore, "readwrite").objectStore(keyObjectStore);
            for (let feat of json.features) {
                let airport = {};
                let latitude = Coordinate.fromDegArcminSign(
                    unit(`${feat.attributes.LAT_DEG} deg`),
                    unit(`${feat.attributes.LAT_MIN} arcmin`),
                    feat.attributes.LAT_HEMIS == "N" ? -1 : 1
                );
                let longitude = Coordinate.fromDegArcminSign(
                    unit(`${feat.attributes.LONG_DEG} deg`),
                    unit(`${feat.attributes.LONG_MIN} arcmin`),
                    feat.attributes.LONG_HEMIS == "W" ? -1 : 1
                );
                airport[keyAirportID] = feat.attributes.ARPT_ID;
                airport[keyElevation] = Math.round(feat.attributes.ELEV);
                airport[keyLatitude] = latitude.toInt();
                airport[keyLongitude] = longitude.toInt();
                let request = objectStore.add(airport);
                recordCount += 1;
            }
        }
    }
}

async function queryDatabase(event, airportID, RESOLVE, REJECT) {
    let db = event.target.result;
    const getRequest = db.transaction(keyObjectStore).objectStore(keyObjectStore).get(airportID);

    getRequest.onsuccess = (getEvent) => {
        const data = getEvent.target.result;
        let location = new Location(
            Coordinate.fromInt(data[keyLatitude]),
            Coordinate.fromInt(data[keyLongitude])
        );
        const airportData = new AirportData(
            data[keyAirportID],
            data[keyElevation],
            location,
        );
        RESOLVE(airportData);
    };

    getRequest.onerror = (err) => {
        REJECT(`Error to get student information: ${err}`);
    }
}

async function upgradeDatabase(event) {
    // the existing database version is less than current (or it doesn't exist)
    switch(event.oldVersion) { // existing db version
        case 0:
            // version 0 means that the client had no database
            downloadDatabase(event.target.result);
    }
};

export function loadAirportData(airportID) {
    return new Promise((RESOLVE, REJECT) => {
        let openRequest = indexedDB.open(keyDatabase, 1);
        openRequest.onupgradeneeded = (event) => {upgradeDatabase(event)};
        openRequest.onsuccess = (event) => queryDatabase(event, airportID, RESOLVE, REJECT);
        openRequest.onerror = () => {console.error("Error", openRequest.error);};
    });
}

// UNUSED CODE FOR CHECKING VALIDITY OF ENTRIES

const cacheShelfLifeDays = 31;
function cacheIsValid() {
    if (!cacheExists()) {
        return false;
    }
    let now = new Date();
    let effectiveDate = getCacheEffectiveDate();
    let age = now.getTime() - Date.parse(effectiveDate);
    let ms_per_day = 24 * 60 * 60 * 1000;
    let limit = cacheShelfLifeDays * ms_per_day;
    return age < limit;
}

// UNUSED CODE FOR ENCODING ICAO IDS EFFICIENTLY

export function decodeICAOElement(encoded) {
    let charCode = encoded + 48;
    if (encoded > 9) {
        charCode += 6;
    }
    let decoded = String.fromCharCode(charCode);
    return decoded;
}

export function decodeICAO(encoded) {
    let decoded = "";
    let tmp = encoded;
    for (let i = 1; i < 5; i ++) {
        let element = tmp % 256;
        decoded += decodeICAOElement(element);
        tmp = (tmp - element) / 256;
    }
    return decoded;
}

export function encodeICAO(icao) {
    let encoded = 0;
    for (let i = 0; i < 4; i ++) {
        let charCode = icao.charCodeAt(i) - 48;
        if (charCode > 9) {
            charCode -= 6;
        }
        encoded += charCode * (256 ** i);
    }
    return encoded;
}
