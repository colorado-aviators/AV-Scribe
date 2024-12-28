import { unit } from 'mathjs'
import { test, expect } from 'vitest'
import * as physics from "../physics"

test('stationPressureToAltimeterSetting', () => {
    let pressureMB = 830;
    let elevationMeters = 1729;
    let expected = 1022.27;
    let val = physics.stationPressureToAltimeterSetting(pressureMB, elevationMeters);
    expect(val).toBeCloseTo(expected);
})

test('CoordinateToInt', () => {
    let coord = new physics.Coordinate(168, 41, 1);
    let val = coord.toInt();
    let expected = 10121;
    expect(val).toBe(expected);
})

test('CoordinateFromInt', () => {
    let coord = physics.Coordinate.fromInt(-10121);
    expect(coord.degree).toBe(168);
    expect(coord.minute).toBe(41);
    expect(coord.sign).toBe(-1);
})

test('coordinateFromString', () => {
    let coord = physics.Coordinate.fromString("16841N");
    expect(coord.degree).toBe(168);
    expect(coord.minute).toBe(41);
    expect(coord.sign).toBe(-1);
})

test('getDensityAltitude', () => {
    /*
    References:
    https://www.weather.gov/epz/wxcalc_densityaltitude
    */
    var temperature = unit(28, "degC");
    var dewpoint = unit(9, "degC");
    var elevation = unit(5673, "feet")
    var altimeterSetting = unit(30.03, "inHg");
    var result = physics.getDensityAltitude(temperature, dewpoint, altimeterSetting, elevation);
    var val = result.toNumeric("feet");
    expect(val).toBeCloseTo(8471, 1);
})

test('estimateDensityAltitude', () => {
    /*
    References:
    https://www.weather.gov/epz/wxcalc_densityaltitude
    */
    var temperature = unit(28, "degC");
    var dewpoint = unit(9, "degC")
    var stationPressure = unit(24.36055, "inHg");
    var result = physics.estimateDensityAltitude(temperature, stationPressure, dewpoint);
    var val = result.toNumeric("feet");
    expect(val).toBeCloseTo(8471, 1);
})

test('getVaporPressure', () => {
    /*
    References:
    https://www.weather.gov/epz/wxcalc_vaporpressure
    */
    var dewpoint = unit(41.2, "degC");
    var result = physics.getVaporPressure(dewpoint);
    var val = result.toNumeric("mbar");
    //expect(val).toBeCloseTo(78.62, 2);
    expect(val).toBeCloseTo(78.34, 2);
})

test('getVirtualTemperature', () => {
    /*
    References:
    https://www.weather.gov/epz/wxcalc_vaporpressure
    */
    var temperature = unit(28, "degC");
    var dewpoint = unit(9, "degC");
    var stationPressure = unit(24.36, "inHg");
    var result = physics.getVirtualTemperature(temperature,stationPressure,dewpoint);
    var val = result.toNumeric("K");
    expect(val).toBeCloseTo(302.74, 2);
})
