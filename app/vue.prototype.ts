import * as application from 'application';
import localize from 'nativescript-localize';
import { device, screen } from 'tns-core-modules/platform';
import { Color } from 'tns-core-modules/color';
import App from '~/components/App';
import Login from '~/components/Login';
import { clog } from './utils/logging';
import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty';
import AuthService, { LoggedinEvent, LoggedoutEvent } from '~/services/authService';
import { alert } from 'nativescript-material-dialogs';
import { Label as HTMLLabel } from 'nativescript-htmllabel';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout/stack-layout';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout/grid-layout';
import * as imageModule from 'nativescript-image';

const Plugin = {
    install(Vue) {
        const authService = new AuthService();

        Vue.prototype.$authService = authService;
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
        Vue.prototype.$ltc = function(s: string, ...args) {
            return filters.titlecase(localize(s, ...args));
        };
        Vue.prototype.$luc = function(s: string, ...args) {
            return filters.uppercase(localize(s, ...args));
        };
        Vue.prototype.$showError = function(err: Error) {
            // clog('showError', err, Object.keys(err), err.toString(), err['stack']);
            const message = typeof err === 'string' ? err : err.message || err.toString();
            const label = new HTMLLabel();
            label.style.padding = 20;
            // label.style.backgroundColor = new Color(255, 255,0,0);
            label.style.fontSize = 13;
            label.html = `<span style="color:rgb(138,138,138)">${message.trim()}</span>`;
            return alert({
                title: Vue.prototype.$ltc('error'),
                okButtonText: Vue.prototype.$ltc('ok'),
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
                okButtonText: Vue.prototype.$ltc('ok'),
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
        clog('widthDIPs', screen.mainScreen.widthDIPs);
        clog('heightDIPs', screen.mainScreen.heightDIPs);
        clog('scale', screen.mainScreen.scale);
        clog('ratio', screen.mainScreen.heightDIPs / screen.mainScreen.widthDIPs);
        /* DEV-END */
    }
};

export default Plugin;
