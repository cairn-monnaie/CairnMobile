import * as application from '@nativescript/core/application';
import * as imageModule from 'nativescript-image';
import { $t, $tc, $tt, $tu } from '~/helpers/locale';
import { device, screen } from '@nativescript/core/platform';
import App from '~/components/App';
import { getAuthInstance } from '~/services/AuthService';
import SecurityService from '~/services/SecurityService';
import { clog } from './utils/logging';
import { screenHeightDips, screenWidthDips } from './variables';
import { alert } from 'nativescript-material-dialogs';
import { isSimulator } from 'nativescript-extendedinfo';
import BarCodeBottomSheet from './components/BarCodeBottomSheet';
import NativescriptVue from 'nativescript-vue';
import CrashReportService from './services/CrashReportService';
import { sprintf } from 'sprintf-js';
import { openUrl } from '@nativescript/core/utils/utils';

const Plugin = {
    install(Vue) {
        const authService = getAuthInstance();
        authService.start();

        Vue.prototype.$authService = authService;
        Vue.prototype.$securityService = new SecurityService();

        // imageModule.setDebug(true);
        imageModule.initialize({ isDownsampleEnabled: true });
        // application.on(application.launchEvent, () => {
        //     console.log('about to init image module');
        // });

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
        Vue.prototype.$t = $t;

        Vue.prototype.$tc = $tc;
        Vue.prototype.$tt = $tt;
        Vue.prototype.$tu = $tu;

        const crashReporter = Vue.prototype.$crashReportService as CrashReportService;

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

        Vue.prototype.$scanQRCode = async function(manualHandle = false) {
            // console.log('scanQRCode');
            let result;
            if (gVars.isIOS && isSimulator()) {
                result = sprintf(CAIRN_FULL_QRCODE_FORMAT, {
                    ICC: '622593501',
                    name: 'La Bonne Pioche',
                    id: 'test'
                });
            } else {
                result = await new Promise(resolve => {
                    (this as NativescriptVue).$showBottomSheet(BarCodeBottomSheet, { closeCallback: resolve, transparent: true });
                });
            }
            // console.log('scanQRCode result', result);
            if (result) {
                if (!manualHandle) {
                    openUrl(result);

                }
                // (this as NativescriptVue).$getAppComponent().handleReceivedAppUrl(result);
            }
            return result;
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
