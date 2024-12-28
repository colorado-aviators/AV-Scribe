import { Coordinate, Location } from './physics'
import {unit} from "mathjs"

const keyDatabase = "airport-data";
const keyObjectStore = "airport-data"
const keyAirportID = "id";
const keyElevation = "elevation-in-ft";
const keyLatitude = "latitude";
const keyLongitude = "longitude";
const indexedDB = window.indexedDB;

export class AirportData{
    id: string;
    elevation_in_feet: number;
    location: Location;
    constructor(airportID: string, elevation_in_feet: number, location: Location) {
        this.id = airportID;
        this.elevation_in_feet = elevation_in_feet;
        this.location = location;
    }
}

function getAviationFacilitiesURL(resultOffset: number){
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

async function downloadDatabase(db: IndexedDB) {
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

async function queryDatabase(event: any, airportID: string, RESOLVE: any, REJECT: any) {
    let db = event.target.result;
    const getRequest = db.transaction(keyObjectStore).objectStore(keyObjectStore).get(airportID);

    getRequest.onsuccess = (getEvent: any) => {
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

    getRequest.onerror = (err: any) => {
        REJECT(`Error to get student information: ${err}`);
    }
}

async function upgradeDatabase(event: any) {
    // the existing database version is less than current (or it doesn't exist)
    switch(event.oldVersion) { // existing db version
        case 0:
            // version 0 means that the client had no database
            downloadDatabase(event.target.result);
    }
};

export function loadAirportData(airportID: string) {
    return new Promise((RESOLVE: any, REJECT: any) => {
        let openRequest = indexedDB.open(keyDatabase, 1);
        openRequest.onupgradeneeded = (event: any) => {upgradeDatabase(event)};
        openRequest.onsuccess = (event: any) => queryDatabase(event, airportID, RESOLVE, REJECT);
        openRequest.onerror = () => {console.error("Error", openRequest.error);};
    });
}