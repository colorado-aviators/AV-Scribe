import {getData, decodeElevation, decodeICAO, decodeICAOElement, encodeICAO, seaLevelToAltimeterSetting} from "../fetch_airport_data"
import { test, expect } from 'vitest'

test('decodeICAO', () => {
    const encodedICAO = 4 * (2 ** 24) + 25 * (2 ** 16) + 13 * (2 ** 8) + 21;
    const val = decodeICAO(encodedICAO);
    expect(val).toBe("KCO4");
})

test('decodeICAOElement', () => {
    let val;
    val = decodeICAOElement(21);
    expect(val).toBe("K");
    val = decodeICAOElement(4);
    expect(val).toBe("4");
})

test('encodeICAO', () => {
    let icao = "KCO4";
    const val = encodeICAO(icao);
    let expected = 4 * (2 ** 24) + 25 * (2 ** 16) + 13 * (2 ** 8) + 21;
    expect(val).toBe(expected);
})
