import Vue from 'nativescript-vue';
import { knownFolders } from 'tns-core-modules/file-system';

import { getBuildNumber, getVersionName } from 'nativescript-extendedinfo';
import { cerror, clog, cwarn } from '~/utils/logging';
import { Client } from 'nativescript-bugsnag';
import { setMapPosKeys } from 'nativescript-carto/core/core';
import * as application from 'tns-core-modules/application';

setMapPosKeys('lat', 'lon');

/* DEV-START */
const currentApp = knownFolders.currentApp();
require('source-map-support').install({
    environment: 'node',
    handleUncaughtExceptions: false,
    retrieveSourceMap(source) {
        const sourceMapPath = source + '.map';
        const sourceMapRelativePath = sourceMapPath.replace('file://', '').replace(currentApp.path + '/', '');

        return {
            url: sourceMapRelativePath + '/',
            map: currentApp.getFile(sourceMapRelativePath).readTextSync()
        };
    }
});
/* DEV-END */

if (TNS_ENV === 'production') {
    const bugsnag = (Vue.prototype.$bugsnag = new Client());
    Promise.all([getVersionName(), getBuildNumber()])
        .then(result => {
            console.log('did get Versions', result);
            let fullVersion = result[0];
            if (!/[0-9]+\.[0-9]+\.[0-9]+/.test(fullVersion)) {
                fullVersion += '.0';
            }
            fullVersion += ` (${result[1]})`;
            return bugsnag.init({ appVersion: result[0], apiKey: gVars.BUGNSAG, codeBundleId: result[1].toFixed(), automaticallyCollectBreadcrumbs: false, detectAnrs: false });
        })
        .then(() => {
            bugsnag.enableConsoleBreadcrumbs();
            bugsnag.handleUncaughtErrors();
            console.log('bugsnag did init');
        })
        .catch(err => {
            console.log('bugsnag  init failed', err);
        });
}

import MixinsPlugin from './vue.mixins';
Vue.use(MixinsPlugin);


import { primaryColor } from './variables';
import { install, themer } from 'nativescript-material-core';
import { install as installBottomSheets } from 'nativescript-material-bottomsheet';
import { install as installGestures } from 'nativescript-gesturehandler';
if (gVars.isIOS) {
    themer.setPrimaryColor(primaryColor);
}
install();
installBottomSheets();
installGestures();


import ViewsPlugin from './vue.views';
Vue.use(ViewsPlugin);


let drawerInstance: MultiDrawer;
export function getDrawerInstance() {
    return drawerInstance;
}
export function setDrawerInstance(instance: MultiDrawer) {
    drawerInstance = instance;
}


// importing filters
import FiltersPlugin from './vue.filters';
Vue.use(FiltersPlugin);

// adding to Vue prototype
import PrototypePlugin from './vue.prototype';
Vue.use(PrototypePlugin);

import { TNSFontIcon } from 'nativescript-akylas-fonticon';
// TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    mdi: './assets/materialdesignicons.min.css',
    cairn: './assets/cairn.css'
};
TNSFontIcon.loadCssSync();

// application.on(application.uncaughtErrorEvent, args => {
//     const error = args.error;
//     // const nErrror = args.android as java.lang.Exception;
//     // clog('onNativeError', error, Object.keys(args), Object.keys(error), error.message, error.stackTrace);
//     // clog('nErrror', nErrror);
//     clog('uncaughtErrorEvent', error);
// });
// application.on(application.discardedErrorEvent, args => {
//     const error = args.error;
//     // const nErrror = args.android as java.lang.Exception;
//     // clog('onNativeError', error, Object.keys(args), Object.keys(error), error.message, error.stackTrace);
//     // clog('nErrror', nErrror);
//     clog('discardedErrorEvent', error);
// });

// import './app.scss'

// Prints Vue logs when --env.production is *NOT* set while building
// Vue.config.silent = !DEV_LOG;
// Vue.config['debug'] = DEV_LOG;
Vue.config.silent = true;
Vue.config['debug'] = false;

Vue.config.errorHandler = (e, vm, info) => {
    throw e;
};

Vue.config.warnHandler = function(msg, vm, trace) {
    cwarn(msg, trace);
};

/* DEV-START */
// const VueDevtools = require('nativescript-vue-devtools');
// Vue.use(VueDevtools
// , { host: '192.168.1.43' }
// );
/* DEV-END */

import App from '~/components/App';
import MultiDrawer from './components/MultiDrawer';
new Vue({
    render: h => {
        return h(App);
    }
}).$start();
