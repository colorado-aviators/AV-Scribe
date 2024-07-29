import * as math from 'mathjs'

math.createUnit('inHg', `${math.unit(1, "in").toNumeric("mm")} mmHg`)

export function getDensityAltitude(
    temperature: math.Unit,
    dewpoint: math.Unit,
    altimeterSetting: math.Unit,
    elevation: math.Unit
) {
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
) {
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

export function getVaporPressure(dewpoint: math.Unit) {
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
) {
    var vaporPressure = getVaporPressure(dewpoint);
    let tmp = vaporPressure.toNumber("mbar") / stationPressure.toNumber("mbar");
    tmp = 1.0 - tmp * (1 - 0.622);
    return math.divide(temperature.to("K"), tmp);
}
