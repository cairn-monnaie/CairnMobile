import CrashReportService from '~/common/services/CrashReportService';
const crashReportService = new CrashReportService();
// start it as soon as possible
crashReportService.start();
import Vue from 'nativescript-vue';
Vue.prototype.$crashReportService = crashReportService;

// import * as trace from '@nativescript/core/trace';
// trace.addCategories(trace.categories.ViewHierarchy);
// trace.addCategories(trace.categories.VisualTreeEvents);
// trace.addCategories(trace.categories.Navigation);
// trace.addCategories(trace.categories.NativeLifecycle);
// trace.addCategories(trace.categories.Transition);
// trace.enable();

import { init } from '@nativescript-community/push';
init();

import { cwarn } from '~/common/utils/logging';

import MixinsPlugin from '~/common/vue.mixins';
Vue.use(MixinsPlugin);

import ViewsPlugin from '~/common/vue.views';
Vue.use(ViewsPlugin);

import FiltersPlugin from '~/common/vue.filters';
Vue.use(FiltersPlugin);

import PrototypePlugin from '~/common/vue.prototype';
Vue.use(PrototypePlugin);

Vue.config.silent = true;
Vue.config['debug'] = false;

function throwVueError(err) {
    crashReportService.showError(err);
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

import { accentColor, primaryColor } from '~/common/variables';
import { themer } from '@nativescript-community/ui-material-core';
if (global.isIOS) {
    themer.setPrimaryColor(accentColor);
    themer.setAccentColor(primaryColor);
}

import App from '~/common/components/App';
new Vue({
    render: h => h(App)
}).$start();
