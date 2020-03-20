import * as application from '@nativescript/core/application';
import { Label as HTMLLabel } from 'nativescript-htmllabel';
import * as imageModule from 'nativescript-image';
import localize from 'nativescript-localize';
// import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty';
import { device, screen } from '@nativescript/core/platform';
import App from '~/components/App';
import AuthService, { getAuthInstance } from '~/services/AuthService';
import SecurityService from '~/services/SecurityService';
import { clog } from './utils/logging';
import { screenHeightDips, screenWidthDips } from './variables';
import { alert, confirm } from 'nativescript-material-dialogs';
import { Color } from '@nativescript/core/ui/frame';

const Plugin = {
    install(Vue) {
        const authService = getAuthInstance();
        authService.start();

        Vue.prototype.$authService = authService;
        Vue.prototype.$securityService = new SecurityService();

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

        Vue.prototype.$isAndroid = gVars.isAndroid;
        Vue.prototype.$isIOS = gVars.isIOS;
        const filters = (Vue.prototype.$filters = Vue['options'].filters);
        Vue.prototype.$t = function(s: string, ...args): string {
            return localize(s, ...args);
        };

        function $tc(s: string, ...args): string {
            return filters.capitalize(localize(s, ...args));
        }
        Vue.prototype.$tc = $tc;

        function $tt(s: string, ...args): string {
            return filters.titlecase(localize(s, ...args));
        }
        Vue.prototype.$tt = $tt;

        function $tu(s: string, ...args) {
            return filters.uppercase(localize(s, ...args));
        }
        Vue.prototype.$tu = $tu;
        Vue.prototype.$showError = function showError(err: Error) {
            clog('$showError', err, err.constructor.name, Object.keys(err), Object.getOwnPropertyNames(err));
            const message = typeof err === 'string' ? err : err.message || err.toString();
            const label = new HTMLLabel();
            label.style.padding = '0 20 20 20';
            // label.style.backgroundColor = new Color(255, 255,0,0);
            label.style.fontSize = 14;
            label.style.color = new Color(255, 138, 138, 138);
            label.html = Vue.prototype.$tc(message.trim());
            return confirm({
                title: Vue.prototype.$tc('error'),
                view: label,
                okButtonText: $tc('send_bug_report'),
                cancelButtonText: $tc('cancel')
                // message
            }).then(result => {
                if (result && this.$sentry) {
                    (this as Vue).$sentry.captureException(err);
                    // .notify({
                    //     error: err
                    // })
                    // .then(() => {
                    this.$alert(this.$t('bug_report_sent'));
                    // })
                    // .catch(this.$showError);
                }
            });
        };
        // Vue.prototype.$showToast = function(text: string, duration?: ToastDuration, position?: ToastPosition) {
        //     const toasty = new Toasty({ text, duration, position });
        //     toasty.show();
        //     return toasty;
        // };
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
