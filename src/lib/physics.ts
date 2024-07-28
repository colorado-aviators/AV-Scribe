import { unit, Unit, divide, createUnit } from 'mathjs'

createUnit('inHg', `${unit(1, "in").toNumeric("mm")} mmHg`)

export function getDensityAltitude(
    temperature: Unit,
    dewpoint: Unit,
    altimeterSetting: Unit,
    elevation: Unit
) {
    /*
    temperature and dewpoint in Celsius
    References
    https://www.weather.gov/media/epz/wxcalc/stationPressure.pdf
    */
    var tmp = (288 - .0065 * elevation.toNumeric("m")) / 288;
    var stationPressure = unit(altimeterSetting.toNumeric("inHg") * tmp ** 5.2561, "inHg");
    return estimateDensityAltitude(temperature, stationPressure, dewpoint);
}

export function estimateDensityAltitude(
    temperature: Unit,
    stationPressure: Unit,
    dewpoint: Unit
) {
    /*
    From the user, an air temperature (T), a station pressure (P ), and a dewpoint sta
    temperature (Td). The density altitude calculation is quite complex.

    To perform all the calculation for the density altitude calculation:
        - the air temperature must be in units of Kelvin (K),
        - the station pressure must be in units of inches of mercury (inHg) and millibars (mb), and
        - the dewpoint temperature must be in units of degrees Celsius (°C)

    References:
    https://www.weather.gov/media/epz/wxcalc/densityAltitude.pdf
    To see how to convert the temperature and pressure, see the links below:
    https://www.weather.gov/media/epz/wxcalc/pressureConversion.pdf
    https://www.weather.gov/media/epz/wxcalc/tempConvert.pdf
    */
    var virtualTemperature = getVirtualTemperature(temperature, stationPressure, dewpoint);
    var rankine = virtualTemperature.toNumeric("degR");
    var tmp = Math.pow(17.326 * stationPressure.toNumeric("inHg") / rankine, 0.235);
    var densityAltitude = 145366 * (1 - tmp);
    return unit(densityAltitude, "feet");
}

export function getVaporPressure(dewpoint: Unit) {
    /* dewpoint in Celsius
    References
    https://www.weather.gov/media/epz/wxcalc/vaporPressure.pdf
    https://en.wikipedia.org/wiki/Tetens_equation
    */
    var tmp = 7.5 * dewpoint.toNumeric("degC") / (237.7 + dewpoint.toNumeric("degC") );
    return unit(6.11 * (10 ** tmp), "mbar");
}

export function getVirtualTemperature(
    temperature: Unit,
    stationPressure: Unit,
    dewpoint: Unit
) {
    var vaporPressure = getVaporPressure(dewpoint);
    let tmp = 1 - (divide(vaporPressure, stationPressure.to("mbar"))) * (1 - 0.622);
    return divide(temperature.to("K"), tmp);
}

function get_density_altitude_text() {
    return `Density alt.: ${Math.round(get_density_altitude())}`
}
