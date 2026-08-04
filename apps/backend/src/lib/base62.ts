const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE = BigInt(ALPHABET.length)


export function encode(value: bigint): string {
    if(value < 0n){
        throw new Error("base62 encode: value must be non-negative");
    }

    if(value === 0n){
        return ALPHABET[0]!;
    }

    let n = value;
    let out = "";

    while(n > 0n){
        const remainder = Number(n % BASE);
        out = ALPHABET[remainder]! + out;
        n = n / BASE;
    }
    
    return out;
}

export function decode(code: string): bigint {
    let result = 0n;
    
    for(const char of code){
        let index = ALPHABET.indexOf(char)
        if(index === -1){
            throw new Error(`base62 decode: invalid character "${char}"`);
        }
        result = result * BASE + BigInt(index);
    }
    return result;
}