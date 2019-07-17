import { fonticon } from 'nativescript-akylas-fonticon';
import { localize } from 'nativescript-localize';
import VueStringFilter from 'vue-string-filter/VueStringFilter';
import { GeoLocation } from 'nativescript-gps';
import { convertTime, formatValueToUnit, UNITS } from '~/helpers/formatter';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

function formatCurrency(num, showZeroCents = true) {
    // num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) {
        num = 0;
    }
    console.log('formatCurrency', num, num === Math.abs(num));
    const sign = num === Math.abs(num);
    num = Math.abs(num);
    num = Math.floor(num * 100 + 0.50000000001);
    let cents: any = num % 100;
    num = Math.floor(num / 100).toString();

    if (cents < 10) {
        cents = '0' + cents;
    }
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }

    let result = (sign ? '' : '-') + num;
    if (cents !== '00' || showZeroCents) {
        result += '.' + cents;
    }

    return result;
}
const Plugin = {
    install(Vue) {
        Vue.filter('fonticon', fonticon);

        Vue.use(VueStringFilter);

        Vue.filter('concat', (value, ln) => `${value} ${ln}`);
        Vue.filter('preconcat', (value, ln) => `${ln} ${value}`);
        Vue.filter('L', localize);

        Vue.filter('currency', function(value: number, showZeroCents = true) {
            return formatCurrency(value, showZeroCents);
        });

        Vue.filter('date', function(value, formatStr?: string) {
            return convertTime(value, formatStr || 'LLL');
            // if (value) {
            //     return format(value, formatStr || '[Today is a] dddd', {
            //         locale: frLocale
            //     });
            // }
        });
        Vue.filter('dateRelative', function(value, formatStr?: string) {
            return dayjs(value).fromNow();
            // if (value) {
            //     return formatRelative(value, Date.now(), {
            //         locale: frLocale
            //     });
            // }
        });
    }
};

export default Plugin;
