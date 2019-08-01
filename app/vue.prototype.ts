import * as application from 'application';
import { Label as HTMLLabel } from 'nativescript-htmllabel';
import * as imageModule from 'nativescript-image';
import localize from 'nativescript-localize';
import { alert } from 'nativescript-material-dialogs';
import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty';
import { device, screen } from 'tns-core-modules/platform';
import App from '~/components/App';
import AuthService from '~/services/AuthService';
import { clog } from './utils/logging';
import { screenHeightDips, screenWidthDips } from './variables';

const Plugin = {
    install(Vue) {
        const authService = new AuthService();
        authService.start();

        Vue.prototype.$authService = authService;

        imageModule.setDebug(true);
        application.on(application.launchEvent, () => {
            imageModule.initialize({ isDownsampleEnabled: true });
        });

        application.on(application.exitEvent, args => {
            imageModule.shutDown();
        });
        // if (gVars.isAndroid) {
        //     application.on(application.launchEvent, () => {
        //         // bgService.start();
        //         // networkService.start();
        //     });
        // } else {
        //     // bgService.start();
        //     // networkService.start();
        // }
        let appComponent: App;
        Vue.prototype.$setAppComponent = function(comp: App) {
            appComponent = comp;
        };
        Vue.prototype.$getAppComponent = function() {
            return appComponent;
        };

        Vue.prototype.$isSimulator = false;
        Vue.prototype.$isAndroid = gVars.isAndroid;
        Vue.prototype.$isIOS = gVars.isIOS;
        const filters = (Vue.prototype.$filters = Vue['options'].filters);
        Vue.prototype.$t = localize;
        Vue.prototype.$tc = function(s: string, ...args) {
            return filters.capitalize(localize(s, ...args));
        };
        Vue.prototype.$tt = function(s: string, ...args) {
            return filters.titlecase(localize(s, ...args));
        };
        Vue.prototype.$tu = function(s: string, ...args) {
            return filters.uppercase(localize(s, ...args));
        };
        Vue.prototype.$showError = function(err: Error) {
            clog('showError', err, err.constructor.name, Object.keys(err), Object.getOwnPropertyNames(err));
            const message = typeof err === 'string' ? err : err.message || err.toString();
            const label = new HTMLLabel();
            label.style.padding = 20;
            // label.style.backgroundColor = new Color(255, 255,0,0);
            label.style.fontSize = 13;
            label.html = `<span style="color:rgb(138,138,138)">${Vue.prototype.$tc(message.trim())}</span>`;
            return alert({
                title: Vue.prototype.$tc('error'),
                okButtonText: Vue.prototype.$tc('ok'),
                view: label
            });
        };
        Vue.prototype.$showToast = function(text: string, duration?: ToastDuration, position?: ToastPosition) {
            const toasty = new Toasty({ text, duration, position });
            toasty.show();
            return toasty;
        };
        Vue.prototype.$alert = function(message) {
            return alert({
                okButtonText: Vue.prototype.$tc('ok'),
                message
            });
        };

        /* DEV-START */
        clog('model', device.model);
        clog('os', device.os);
        clog('osVersion', device.osVersion);
        clog('manufacturer', device.manufacturer);
        clog('deviceType', device.deviceType);
        clog('widthPixels', screen.mainScreen.widthPixels);
        clog('heightPixels', screen.mainScreen.heightPixels);
        clog('widthDIPs', screenWidthDips);
        clog('heightDIPs', screenHeightDips);
        clog('scale', screen.mainScreen.scale);
        clog('ratio', screen.mainScreen.heightDIPs / screenWidthDips);
        /* DEV-END */
    }
};

export default Plugin;
