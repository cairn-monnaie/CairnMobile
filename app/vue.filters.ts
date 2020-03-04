import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import { fonticon } from 'nativescript-akylas-fonticon';
import { localize } from 'nativescript-localize';
import VueStringFilter from 'vue-string-filter';
import { convertTime, formatAddress, formatCurrency } from '~/helpers/formatter';
dayjs.extend(relativeTime);

const Plugin = {
    install(Vue) {
        // Vue.filter('fonticon', fonticon);

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

        Vue.filter('address', function(value) {
            if (value) {
                return formatAddress(value);
            }
        });

        Vue.filter('capitalize', function(value) {
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
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
