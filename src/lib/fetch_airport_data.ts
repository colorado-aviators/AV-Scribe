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

async function downloadDatabase(db: IDBDatabase) {
    let objectStoreCreation = db.createObjectStore(keyObjectStore, {keyPath: keyAirportID});
    objectStoreCreation.transaction.oncomplete = async (event) => {
        var recordCount = 0;
        while (recordCount % 2000 == 0) {
            let url = getAviationFacilitiesURL(recordCount);
            let response = await fetch(url);
            if (response.ok) { // if HTTP-status is 200-299
                // get the response body (the method explained below)
                let json = await response.json();
                let txn = db.transaction(keyObjectStore, "readwrite");
                let objectStore = txn.objectStore(keyObjectStore);
                for (let feat of json.features) {
                    let data = new Map();
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
                    data.set(keyAirportID, feat.attributes.ARPT_ID);
                    data.set(keyElevation, Math.round(feat.attributes.ELEV));
                    data.set(keyLatitude, latitude.toInt());
                    data.set(keyLongitude, longitude.toInt());
                    let obj = Object.fromEntries(data);
                    let request = objectStore.add(obj);
                    recordCount += 1;
                }
            }
        }
    }
}

async function queryDatabase(db: IDBDatabase, airportID: string, RESOLVE: any, REJECT: any) {
    const getRequest = db.transaction(keyObjectStore).objectStore(keyObjectStore).get(airportID);

    getRequest.onsuccess = (getEvent: any) => {
        const data = getEvent.target.result;
        if (typeof data == 'undefined') {
            RESOLVE(null);
        }
        else {
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
            console.log(`Retrieved airport data for ${airportID}.`);
        }
    };

    getRequest.onerror = (err: any) => {
        REJECT(`Error retrieving airport data for ${airportID}: ${err}.`);
    }
}

function upgradeDatabase(event: any) {
    // the existing database version is less than current (or it doesn't exist)
    switch(event.oldVersion) { // existing db version
        case 0:
            // version 0 means that the client had no database
            downloadDatabase(event.target.result);
            console.log(`Built airport database.`);
    }
};
var db: IDBDatabase;
var openRequest = indexedDB.open(keyDatabase, 1);
openRequest.onupgradeneeded = (event: any) => {upgradeDatabase(event)};
openRequest.onerror = () => {console.error("Error", openRequest.error);};
openRequest.onsuccess = (event: any) => {db = openRequest.result;};

export function loadAirportData(airportID: string): Promise<AirportData> {
    return new Promise((RESOLVE: any, REJECT: any) => {
        queryDatabase(db, airportID, RESOLVE, REJECT);
    });
}