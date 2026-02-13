import { Coordinate, Location } from './physics'
import {unit} from "mathjs"

const keyDatabase = "airport-data";
const keyObjectStore = "airport-data"
const keyFAA = "faa";
const keyICAO = "icao";
const keyName = "name";
const keyElevation = "elevation-in-ft";
const keyLatitude = "latitude";
const keyLongitude = "longitude";
const indexedDB = window.indexedDB;

export class AirportData{
    id: string;
    faa: string | null;
    icao: string | null;
    elevation_in_feet: number | null;
    location: Location | null;
    constructor(
        id: string,
        faa: string | null = null,
        icao: string | null = null,
        elevation_in_feet: number | null = null,
        location: Location | null = null
    ) {
        this.id = id;
        this.faa = faa;
        this.icao = icao;
        this.elevation_in_feet = elevation_in_feet;
        this.location = location;
    }
}

function getAviationFacilitiesURL(resultOffset: number){
    let outFields = [
        //"EFF_DATE",
        "ARPT_ID",
        //"CITY",
        "ARPT_NAME",
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
        "ICAO_ID",
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

async function downloadDatabase() {
    var records = [];
    while (records.length % 2000 == 0) {
        let url = getAviationFacilitiesURL(records.length);
        let response = await fetch(url);
        if (response.ok) { // if HTTP-status is 200-299
            // get the response body (the method explained below)
            let json = await response.json();
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
                data.set(keyFAA, feat.attributes.ARPT_ID);
                data.set(keyElevation, Math.round(feat.attributes.ELEV));
                data.set(keyLatitude, latitude.toInt());
                data.set(keyLongitude, longitude.toInt());
                data.set(keyICAO, feat.attributes.ICAO_ID == "" ? null : feat.attributes.ICAO_ID);
                data.set(keyName, feat.attributes.ARPT_NAME == "" ? null : feat.attributes.ARPT_NAME);
                let obj = Object.fromEntries(data);
                records.push(obj);
            }
        }
        else {
            console.log("Failed to fetch airport data.")
        }
    }
    return records;
}

async function fillDatabase(db: IDBDatabase) {
    const objectStoreCreation = db.createObjectStore(keyObjectStore, {keyPath: keyFAA});
    objectStoreCreation.createIndex(keyICAO, keyICAO, { unique: true });
    objectStoreCreation.createIndex(keyFAA, keyFAA, { unique: true });
    objectStoreCreation.transaction.oncomplete = () => {
        downloadDatabase().then((records) => {
            let txn = db.transaction(keyObjectStore, "readwrite");
            let objectStore = txn.objectStore(keyObjectStore);
            records.forEach((record) => {
                let request = objectStore.add(record);
                request.onsuccess = () => {
                  console.log('Record added successfully');
                };
                request.onerror = () => {
                  console.error('Failed to add record');
                };
            });
        });
    }
}

async function queryDatabase(db: IDBDatabase, airportID: string, system: string, RESOLVE: any, REJECT: any) {
    const getRequest = db.transaction(keyObjectStore).objectStore(keyObjectStore).index(system).get(airportID);

    const airportData = new AirportData(airportID);

    getRequest.onsuccess = (getEvent: any) => {
        const data = getEvent.target.result;
        if (typeof data !== 'undefined') {
            airportData.location = new Location(
                Coordinate.fromInt(data[keyLatitude]),
                Coordinate.fromInt(data[keyLongitude])
            );
            airportData.id = data[keyFAA]
            airportData.faa = data[keyFAA]
            airportData.icao = data[keyICAO]
            airportData.elevation_in_feet = data[keyElevation]
            console.log(`Retrieved airport data for ${airportID}.`);
        }
        RESOLVE(airportData);
    };

    getRequest.onerror = (err: any) => {
        REJECT(`Error retrieving airport data for ${airportID}: ${err}.`);
    }
}

async function sortByProximity(db: IDBDatabase, location, RESOLVE: any, REJECT: any) {
    const getRequest = db.transaction(keyObjectStore).objectStore(keyObjectStore).index(keyICAO).getAll();

    getRequest.onsuccess = (getEvent: any) => {
        let entries = getEvent.target.result.filter((entry) => (
            Math.abs(entry.latitude - location.latitude.toInt()) + Math.abs(entry.longitude - location.longitude.toInt()) < 100
        ))
        entries.sort(function(a, b) {
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

        RESOLVE(entries);
    };

    getRequest.onerror = (err: any) => {
        REJECT(`Error retrieving airport data for ${location}: ${err}.`);
    }
}

function upgradeDatabase(event: any) {
    // the existing database version is less than current (or it doesn't exist)
    let db = event.target.result;
    switch(event.oldVersion) { // existing db version
        case 1:
            db.deleteObjectStore(keyObjectStore);
        case 0:
            // version 0 means that the client had no database
        default:
            fillDatabase(db).then(() => console.log(`Built airport database.`));
    }
};

var db: IDBDatabase;
var openRequest = indexedDB.open(keyDatabase, 2);
openRequest.onupgradeneeded = (event: any) => {upgradeDatabase(event)};
openRequest.onerror = () => {console.error("Error", openRequest.error);};
openRequest.onsuccess = (event: any) => {db = openRequest.result;};

export function loadAirportData(airportID: string, system: string): Promise<AirportData> {
    return new Promise((RESOLVE: any, REJECT: any) => {
        queryDatabase(db, airportID, system, RESOLVE, REJECT);
    });
}

export function loadNearbyAirports(location: Location): Promise<Array<AirportData>> {
    return new Promise((RESOLVE: any, REJECT: any) => {
        sortByProximity(db, location, RESOLVE, REJECT);
    });
}