import * as math from 'mathjs'

math.createUnit('inHg', `${math.unit(1, "in").toNumber("mm")} mmHg`);
math.createUnit('knot', {definition: '0.514444 m/s', aliases: ['knots', 'kt', 'kts']});
/*
A reasonable assumption that Earth is spherical... makes the math way easier.
(https://en.wikipedia.org/wiki/Earth's_circumference)
*/
export const earthCircumference = math.unit("40050 km");

export class Coordinate{
    val: math.Unit;
    constructor(val: math.Unit) {
        this.val = val;
    }
    toInt() : number {
        let [deg, arcmin] = this.val.splitUnit(["deg", "arcmin"]);
        if (typeof deg === 'undefined' || typeof arcmin === 'undefined'){
            throw new Error(`Problem with Coordinate ${this.val}`);
        }
        let result = math.round(deg.toNumber("deg") * 60.0 + arcmin.toNumber("arcmin"));
        return result;
    }
    static fromInt(int: number) : Coordinate {
        let result = new Coordinate(math.unit(int , "arcmin"));
        return result;
    }
    static fromDegArcminSign(deg: math.Unit, arcmin: math.Unit, sign: number) : Coordinate {
        let result = new Coordinate(math.evaluate(`${sign} * (${deg} + ${arcmin})`));
        return result;
    }
    static fromString(string: string) : Coordinate {
        /*
        A special string processing function for geotagged data from NCEI's World Weather Record Clearinghouse.
        */
        let result = Coordinate.fromDegArcminSign(
            math.unit(`${string.substring(0, string.length - 3)} deg`),
            math.unit(`${string.substring(string.length - 3), string.length - 1} arcmin`),
            string.endsWith("N") || string.endsWith("W") ? -1 : 1,
        );
        return result;
    }
}

export function greatCircleAngle(pointA: Location, pointB: Location) : math.Unit {
    let lat = pointA.latitude.val.toNumber("rad");
    let long = pointA.longitude.val.toNumber("rad");
    let Az = Math.sin(lat);
    let r = Math.cos(lat);
    let Ax = r * Math.sin(long);
    let Ay = r * Math.cos(long);
    lat = pointB.latitude.val.toNumber("rad");
    long = pointB.longitude.val.toNumber("rad");
    let Bz = Math.sin(lat);
    r = Math.cos(lat);
    let Bx = r * Math.sin(long);
    let By = r * Math.cos(long);
    let euclideanDistance = Math.hypot(Ax - Bx, Ay - By, Az - Bz);
    let angle = math.unit(Math.asin(euclideanDistance / 2) * 2, "rad");
    return angle;
}

export function greatCircleDistance(pointA: Location, pointB: Location) : math.Unit {
    /*
    References:
    https://en.wikipedia.org/wiki/Great-circle_distance
    */
    let angle = greatCircleAngle(pointA, pointB);
    let distance = math.evaluate(`${angle} / pi / 2 rad * ${earthCircumference}`);
    return distance;
}

export class Location{
    latitude: Coordinate;
    longitude: Coordinate;
    constructor(latitude: Coordinate, longitude: Coordinate) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    distanceTo(other: Location) : math.Unit {
        let distance = greatCircleDistance(this, other);
        return distance;
    }
}

export function stationPressureToAltimeterSetting(pressure: math.Unit, elevation: math.Unit) : math.Unit {
    const referencePressure = math.unit(1013.25, "mbar");  // static pressure at sea level
    const standardTempK = math.unit(288.15, "K");  // standard temp at sea level
    const lapseRate = math.unit(.0065, "K / m");  // Temperature lapse rate

    // not sure what these constants are about
    const pressureExponent = 0.190284;
    const pressureConstant = math.unit(0.3, "mbar");

    // https://www.weather.gov/media/epz/wxcalc/stationPressure.pdf
    let temperatureLapse = math.evaluate(`${lapseRate} / ${standardTempK} * ${elevation}`)
    let elevationAdjustment = math.evaluate( `(${referencePressure} / (${pressure} - ${pressureConstant})) ^ ${pressureExponent} * ${temperatureLapse}`)
    let result = math.evaluate(`(${pressure} - ${pressureConstant}) * (1 + ${elevationAdjustment}) ^ ( 1 / ${pressureExponent} )`);
    return result;
}

export function getDensityAltitude(
    temperature: math.Unit,
    dewpoint: math.Unit,
    altimeterSetting: math.Unit,
    elevation: math.Unit
) : math.Unit {
    /*
    temperature and dewpoint in Celsius
    References
    https://www.weather.gov/media/epz/wxcalc/stationPressure.pdf
    */
    let tmp = (288 - .0065 * (elevation.toNumber("m"))) / 288;
    let val = altimeterSetting.toNumber("inHg") * tmp ** 5.2561;
    var stationPressure = math.unit(val, "inHg");
    return estimateDensityAltitude(temperature, stationPressure, dewpoint);
}

export function estimateDensityAltitude(
    temperature: math.Unit,
    stationPressure: math.Unit,
    dewpoint: math.Unit
) : math.Unit {
    /*
    From the user, an air temperature (T), a station pressure (P ), and a dewpoint sta
    temperature (Td). The density altitude calculation is quite complex.

    To perform all the calculation for the density altitude calculation:
        - the air temperature must be in math.units of Kelvin (K),
        - the station pressure must be in math.units of inches of mercury (inHg) and millibars (mb), and
        - the dewpoint temperature must be in math.units of degrees Celsius (°C)

    References:
    https://www.weather.gov/media/epz/wxcalc/densityAltitude.pdf
    To see how to convert the temperature and pressure, see the links below:
    https://www.weather.gov/media/epz/wxcalc/pressureConversion.pdf
    https://www.weather.gov/media/epz/wxcalc/tempConvert.pdf
    */
    var virtualTemperature = getVirtualTemperature(temperature, stationPressure, dewpoint);
    var rankine = virtualTemperature.toNumber("degR");
    var tmp = Math.pow(17.326 * stationPressure.toNumber("inHg") / rankine, 0.235);
    var densityAltitude = 145366 * (1 - tmp);
    return math.unit(densityAltitude, "feet");
}

export function getVaporPressure(dewpoint: math.Unit) : math.Unit {
    /* dewpoint in Celsius
    References
    https://www.weather.gov/media/epz/wxcalc/vaporPressure.pdf
    https://en.wikipedia.org/wiki/Tetens_equation
    */
    var tmp = 7.5 * dewpoint.toNumber("degC") / (dewpoint.toNumber("degC") + 237.7);
    return math.unit(6.11 * (10 ** tmp), "mbar");
}

export function getVirtualTemperature(
    temperature: math.Unit,
    stationPressure: math.Unit,
    dewpoint: math.Unit
) : math.Unit {
    var vaporPressure = getVaporPressure(dewpoint);
    let tmp = vaporPressure.toNumber("mbar") / stationPressure.toNumber("mbar");
    tmp = 1.0 - tmp * (1 - 0.622);
    return math.divide(temperature.to("K"), tmp);
}
