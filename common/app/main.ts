import CrashReportService from './services/CrashReportService';
const crashReportService = new CrashReportService();
// start it as soon as possible
crashReportService.start();

import { install as installGestures } from 'nativescript-gesturehandler';
import { install as installBottomSheets } from 'nativescript-material-bottomsheet';
import { install, themer } from 'nativescript-material-core';
import Vue from 'nativescript-vue';

Vue.prototype.$crashReportService = crashReportService;
// import * as trace from '@nativescript/core/trace';
// trace.addCategories(trace.categories.ViewHierarchy);
// trace.addCategories(trace.categories.Navigation);
// trace.addCategories(trace.categories.NativeLifecycle);
// trace.enable();

import { init } from 'nativescript-push';
init();

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

Vue.config.silent = true;
Vue.config['debug'] = false;

function throwVueError(err) {
    crashReportService.showError(err);
}

// firebase.init({
//     // Optionally pass in properties for database, authentication and cloud messaging,
//     // see their respective docs.
//     showNotifications: true,
//     showNotificationsWhenInForeground: true,

//     onPushTokenReceivedCallback: (token) => {
//         console.log('[Firebase] onPushTokenReceivedCallback:', { token });
//     },

//     onMessageReceivedCallback: (message: firebase.Message) => {
//         console.log('[Firebase] onMessageReceivedCallback:', { message });
//     }
// }).then(
//     () => {
//         console.log('firebase.init done');
//     },
//     error => {
//         console.log(`firebase.init error: ${error}`);
//     }
// );

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
