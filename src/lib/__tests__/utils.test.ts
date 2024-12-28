import {decodeFloat} from "../utils"
import { test, expect } from 'vitest'

test('decodeFloat', () => {
    let min = 0;
    let max = 8;
    let code = 3;
    let depth = 4;
    var val = decodeFloat(min, max, code, depth);
    expect(val).toBeCloseTo(1.5);
})
