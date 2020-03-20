import { install as installGestures } from 'nativescript-gesturehandler';
import { install as installBottomSheets } from 'nativescript-material-bottomsheet';
import { install, themer } from 'nativescript-material-core';
import Vue from 'nativescript-vue';
/* DEV-START */
// const VueDevtools = require('nativescript-vue-devtools');
// Vue.use(VueDevtools
// , { host: '192.168.1.43' }
// );
/* DEV-END */
import App from '~/components/App';
import { DEV_LOG, cwarn } from '~/utils/logging';
import MultiDrawer from './components/MultiDrawer';
import { accentColor } from './variables';
// importing filters
import FiltersPlugin from './vue.filters';
import MixinsPlugin from './vue.mixins';
// adding to Vue prototype
import PrototypePlugin from './vue.prototype';
import ViewsPlugin from './vue.views';
import { device } from '@nativescript/core/platform';

// setMapPosKeys('lat', 'lon');

import { getBuildNumber, getVersionName } from 'nativescript-extendedinfo';
if (PRODUCTION || gVars.sentry) {
    import('nativescript-akylas-sentry').then(Sentry => {
        Vue.prototype.$sentry = Sentry;
        Promise.all([getVersionName(), getBuildNumber()]).then(res => {
            Sentry.init({
                dsn: gVars.SENTRY_DSN,
                appPrefix: gVars.SENTRY_PREFIX,
                release: `${res[0]}`,
                dist: `${res[1]}.${gVars.isAndroid ? 'android' : 'ios'}`
            });
            Sentry.setTag('locale', device.language);
        });
    });
}

Vue.use(MixinsPlugin);

if (gVars.isIOS) {
    themer.setPrimaryColor(accentColor);
}
install();
installBottomSheets();
installGestures();

Vue.use(ViewsPlugin);

let drawerInstance: MultiDrawer;
export function getDrawerInstance() {
    return drawerInstance;
}
export function setDrawerInstance(instance: MultiDrawer) {
    drawerInstance = instance;
}

Vue.use(FiltersPlugin);

Vue.use(PrototypePlugin);

// import { TNSFontIcon } from 'nativescript-akylas-fonticon';
// // TNSFontIcon.debug = true;
// TNSFontIcon.paths = {
//     mdi: './assets/materialdesignicons.min.css',
//     cairn: './assets/cairn.css'
// };
// TNSFontIcon.loadCssSync();

// application.on(application.uncaughtErrorEvent, args => clog('uncaughtErrorEvent', args.error));
// application.on(application.discardedErrorEvent, args => clog('discardedErrorEvent', args.error));

// import './app.scss'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !DEV_LOG;
Vue.config['debug'] = DEV_LOG;
// Vue.config.silent = true;
// Vue.config['debug'] = false;

function throwVueError(err) {
    Vue.prototype.$showError(err);
    // throw err;
}

Vue.config.errorHandler = (e, vm, info) => {
    if (e) {
        console.log('[Vue]', `[${info}]`, e);
        setTimeout(() => throwVueError(e), 0);
    }
};

Vue.config.warnHandler = function(msg, vm, trace) {
    cwarn(msg, trace);
};

new Vue({
    render: h => h(App)
}).$start();
