const dev = TNS_ENV === 'development';

import Vue, { registerElement } from 'nativescript-vue';

require('nativescript-platform-css');

import './styles.scss';
import { isAndroid, isIOS } from 'tns-core-modules/platform';

import AuthService, { LoggedinEvent, LoggedoutEvent } from './services/AuthService';

export const authService = new AuthService();

// if (TNS_ENV !== "production") {
//   import("nativescript-vue-devtools").then(VueDevtools => Vue.use(VueDevtools));
// }

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !dev;
Vue.config['debug'] = dev;

Vue.prototype.$authService = authService;

authService.on(LoggedinEvent, () => {
    Vue.prototype.$navigateTo(App, { clearHistory: true });
});
authService.on(LoggedoutEvent, () => {
    Vue.prototype.$navigateTo(Login, { clearHistory: true });
});

// import CollectionView from "nativescript-collectionview/vue";
// Vue.use(CollectionView);

import { primaryColor } from './variables';
import { themer } from '~/nativescript-material-components/material';
import { alert } from '~/nativescript-material-components/dialog';
if (isIOS) {
    // material theme
    console.log('setPrimaryColor', primaryColor);
    themer.setPrimaryColor(primaryColor);
}

import CActionBar from '~/components/CActionBar.vue';

Vue.component('CActionBar', CActionBar);

registerElement('MDCButton', () => require('~/nativescript-material-components/button').Button);
registerElement('MDCActivityIndicator', () => require('~/nativescript-material-components/activityindicator').ActivityIndicator);
registerElement('CardView', () => require('~/nativescript-material-components/cardview').CardView);
registerElement('HTMLLabel', () => require('~/nativescript-htmllabel/label').Label);
registerElement('MDCTextField', () => require('~/nativescript-material-components/textfield').TextField, {
    model: {
        prop: 'text',
        event: 'textChange'
    }
});
registerElement('PullToRefresh', () => require('nativescript-pulltorefresh').PullToRefresh);

registerElement('BottomNavigation', () => require('nativescript-bottom-navigation').BottomNavigation);
registerElement('BottomNavigationTab', () => require('nativescript-bottom-navigation').BottomNavigationTab);

// registerElement(
//     "PreviousNextView",
//     () => require("nativescript-iqkeyboardmanager").PreviousNextView
// )

import RadListViewPlugin from 'nativescript-ui-listview/vue';
Vue.use(RadListViewPlugin);

import App from '~/components/App.vue';
import Login from '~/components/Login.vue';

// import { SVGImage } from '@teammaestro/nativescript-svg';
// registerElement('SVGImage', () => SVGImage);

import { fonticon, TNSFontIcon } from 'nativescript-fonticon';
TNSFontIcon.paths = {
    mdi: './assets/mdi.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

import VueStringFilter from 'vue-string-filter/VueStringFilter';
Vue.use(VueStringFilter);

import { localize } from 'nativescript-localize';
Vue.filter('L', localize);

import { format, formatRelative } from 'date-fns';
// import * as enLocale from 'date-fns/locale/en';
import * as frLocale from 'date-fns/locale/fr';

Vue.filter('date', function(value, formatStr?: string) {
    if (value) {
        return format(value, formatStr || '[Today is a] dddd', {
            locale: frLocale
        });
    }
});
Vue.filter('dateRelative', function(value, formatStr?: string) {
    if (value) {
        return formatRelative(value, Date.now(), {
            locale: frLocale
        });
    }
});

function formatCurrency(num, showZeroCents = true) {
    // num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) {
        num = 0;
    }
    console.log('formatCurrency', num, num ===  Math.abs(num));
    const sign = num ===  Math.abs(num);
    num =  Math.abs(num);
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

Vue.filter('currency', function(value: number, showZeroCents = true) {
    return formatCurrency(value, showZeroCents);
});

// Vue.directive('tkRadialGaugeScales', {
//     inserted: function(el) {
//       var scale = el._nativeView
//       var gauge = el.parentNode._nativeView
//       if (gauge.scales) {
//         gauge.scales.push(scale)
//       } else {
//         gauge.scales = new observable_array.ObservableArray([scale])
//       }
//     }
//   })

Vue.prototype.$isAndroid = isAndroid;
Vue.prototype.$isIOS = isIOS;
const filters = (Vue.prototype.$filters = Vue['options'].filters);
Vue.prototype.$ltc = function(s: string, ...args) {
    return filters.titlecase(localize(s, ...args));
};
Vue.prototype.$luc = function(s: string, ...args) {
    return filters.uppercase(localize(s, ...args));
};
Vue.prototype.$showError = function(err: Error) {
    console.log('showError', err, err.toString());
    return alert({
        title: Vue.prototype.$ltc('error'),
        okButtonText: Vue.prototype.$ltc('ok'),
        message: err.toString()
    });
};
Vue.prototype.$alert = function(message) {
    return alert({
        okButtonText: Vue.prototype.$ltc('ok'),
        message
    });
};

const currentlyLoggedin = authService.isLoggedIn();

if (currentlyLoggedin) {
    authService.login(); // login async to refresh token
}

new Vue({
    render: h => {
        return h('frame', [h(currentlyLoggedin ? App : Login)]);
    }
}).$start();
