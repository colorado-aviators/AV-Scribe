import * as math from 'mathjs'

export function decodeFloat(min, max, code, depth){
    let range = max - min;
    let step = range / math.pow(2, depth);
    var val = min + step * code;
    return val
}
