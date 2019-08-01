import * as Platform from 'platform';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Address } from '~/services/AuthService';
dayjs.extend(LocalizedFormat);
// const dayjs: (...args) => Dayjs = require('dayjs');
const Duration = require('duration');

const supportedLanguages = ['en', 'fr'];

export enum UNITS {
    Duration = 'duration',
    Date = 'date',
    Distance = 'm',
    DistanceKm = 'km',
    Speed = 'km/h',
    Pace = 'min/km',
    Cardio = 'bpm'
}

export function getCurrentDateLanguage() {
    const deviceLang = Platform.device.language;
    if (supportedLanguages.indexOf(deviceLang) !== -1) {
        return deviceLang;
    }
    return 'en-US';
}

export function convertTime(date, formatStr: string) {
    // clog('convertTime', date, formatStr);
    return dayjs(date).format(formatStr);
}

// function createDateAsUTC(date) {
//     return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
// }

export function convertDuration(date, formatStr: string) {
    const test = new Date(date);
    test.setTime(test.getTime() + test.getTimezoneOffset() * 60 * 1000);
    const result = dayjs(test).format(formatStr);
    // clog('convertDuration', date, formatStr, test, result);
    return result;
}

export function convertValueToUnit(value: any, unit: UNITS, otherParam?): [string, string] {
    if (value === undefined || value === null) {
        return ['', ''];
    }
    // clog('convertValueToUnit', value, unit, otherParam);
    switch (unit) {
        case UNITS.Duration:
            return [convertDuration(value, 'HH:mm:ss'), ''];

        case UNITS.Date:
            return [convertTime(value, 'M/d/yy h:mm a'), ''];

        case UNITS.Distance:
            return [value.toFixed(), unit];
        case UNITS.DistanceKm:
            if (value < 1000) {
                return [value.toFixed(), 'm'];
            } else if (value > 100000) {
                return [(value / 1000).toFixed(0), unit];
            } else {
                return [(value / 1000).toFixed(1), unit];
            }
        case UNITS.Speed:
            return [value.toFixed(), unit];
        case UNITS.Pace:
            let result = value < 0.001 ? 0 : 60.0 / value;

            // no point in showing Pace > 60 min/km
            if (result > 60.0) {
                result = 0;
            }
            const minutes = Math.floor(result) % 60;
            let seconds = Math.floor((result - minutes) * 60).toFixed();
            if (seconds.length === 1) {
                seconds = '0' + seconds;
            }
            return [`${minutes}:${seconds}`, unit];
        default:
            return [value.toFixed(), unit];
    }
}

export function formatValueToUnit(value: any, unit: UNITS, options?: { prefix?: string; otherParam? }) {
    let result = convertValueToUnit(value, unit, options ? options.otherParam : undefined).join('');
    if (options && options.prefix && result.length > 0) {
        result = options.prefix + result;
    }
    return result;
}

export function formatAddress(address: Address) {
    return `${address.street1} ${address.zipCity.name}`;
}
