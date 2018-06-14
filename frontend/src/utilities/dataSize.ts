interface IIntermediateValue {
    template: string;
    value: number;
}

export interface IDisplayOptions {
    decimalPlaces?: number;
}

const oneKiloByte = 1024;
const oneMegaByte = 1048576;
const oneGigaByte = 1073741824;
const oneTeraByte = 1099511627776;
const onePetaByte = 1125899906842624;

/**
 * Creates a display string for the given number in bytes.
 * This function produces a string value meant to mimic that displyed by file explorer.
 */
export function getSize(value: number, options: IDisplayOptions = {}): string {
    if (typeof value !== 'number' || value < 0) {
        return '';
    }

    if (value === 1) {
        return '1 byte';
    }

    let info = getInfo(value);
    const decimalPlaces = options.decimalPlaces || 2;
    let numberString = info.value.toFixed(decimalPlaces);
    return numberString + info.template;
}

function getInfo(value: number): IIntermediateValue {
    // 1 byte is already handled

    // 0 bytes, 2 bytes - 1023 bytes
    if (value < oneKiloByte) {
        return { template: ' bytes', value };
    }

    // 1KB - 999 KB
    if (value < 1000 * oneKiloByte) {
        return { template: ' KB', value: value / oneKiloByte };
    }

    // 0.97 MB - 999 MB
    if (value < 1000 * oneMegaByte) {
        return { template: ' MB', value: value / oneMegaByte };
    }

    // 0.97 GB - 999 GB
    if (value < 1000 * oneGigaByte) {
        return { template: ' GB', value: value / oneGigaByte };
    }

    // 0.97 TB - 999 TB
    if (value < 1000 * oneTeraByte) {
        return { template: ' TB', value: value / oneTeraByte };
    }

    // 0.97 PB ->
    return { template: ' PB', value: value / onePetaByte };
}