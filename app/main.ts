import { getBuildNumber, getVersionName } from 'nativescript-extendedinfo';
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
import { cwarn } from '~/utils/logging';
import MultiDrawer from './components/MultiDrawer';
import { accentColor } from './variables';
// importing filters
import FiltersPlugin from './vue.filters';
import MixinsPlugin from './vue.mixins';
// adding to Vue prototype
import PrototypePlugin from './vue.prototype';
import ViewsPlugin from './vue.views';


// setMapPosKeys('lat', 'lon');

/* SOURCEMAP-START */
console.log('installing sourcemap support');
const currentApp = require('@nativescript/core/file-system').knownFolders.currentApp();
process.cwd = function() {
    return '';
};
require('source-map-support').install({
    environment: 'node',
    handleUncaughtExceptions: false,
    retrieveSourceMap(source) {
        console.log('retrieveSourceMap', source);
        const sourceMapPath = source + '.map';
        const appPath = currentApp.path;
        let sourceMapRelativePath = sourceMapPath
            // .replace('file:///', '')
            .replace('file://', '')
            .replace(appPath + '/', '')
            .replace(appPath + '/', '');
        if (sourceMapRelativePath.startsWith('app/')) {
            sourceMapRelativePath = sourceMapRelativePath.slice(4);
        }
        return {
            url: sourceMapRelativePath,
            map: currentApp.getFile(sourceMapRelativePath).readTextSync()
        };
    }
});
/* SOURCEMAP-END */

if (PRODUCTION) {
    const bugsnag = (Vue.prototype.$bugsnag = new (require('nativescript-bugsnag')).Client());
    Promise.all([getVersionName(), getBuildNumber()])
        .then(result => {
            console.log('did get Versions', result);
            let fullVersion = result[0];
            if (!/[0-9]+\.[0-9]+\.[0-9]+/.test(fullVersion)) {
                fullVersion += '.0';
            }
            fullVersion += ` (${result[1]})`;
            return bugsnag.init({ appVersion: result[0], apiKey: gVars.BUGSNAG_KEY, codeBundleId: result[1].toFixed(), automaticallyCollectBreadcrumbs: false, detectAnrs: false });
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

import { TNSFontIcon } from 'nativescript-akylas-fonticon';
// TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    mdi: './assets/materialdesignicons.min.css',
    cairn: './assets/cairn.css'
};
TNSFontIcon.loadCssSync();

// application.on(application.uncaughtErrorEvent, args => clog('uncaughtErrorEvent', args.error));
// application.on(application.discardedErrorEvent, args => clog('discardedErrorEvent', args.error));

// import './app.scss'

// Prints Vue logs when --env.production is *NOT* set while building
// Vue.config.silent = !DEV_LOG;
// Vue.config['debug'] = DEV_LOG;
Vue.config.silent = true;
Vue.config['debug'] = false;

function throwVueError(err) {
    Vue.prototype.$showError(err);
    // throw err;
}

Vue.config.errorHandler = (e, vm, info) => {
    if (e) {
        console.log('[Vue]', `[${info}]`, e);
        setTimeout(() => throwVueError(e), 0);
    }
};;

Vue.config.warnHandler = function(msg, vm, trace) {
    cwarn(msg, trace);
};

new Vue({
    render: h => {
        return h(App);
    }
}).$start();
