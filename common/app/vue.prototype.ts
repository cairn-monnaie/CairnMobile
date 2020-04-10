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

        Vue.prototype.$scanQRCode = function() {
            console.log('scanQRCode');
            if (gVars.isIOS && isSimulator()) {
                return Promise.resolve({ ICC: '622593501', name: 'La Bonne Pioche' });
            }
            return new Promise((resolve, reject) => {
                (this as NativescriptVue).$showBottomSheet(BarCodeBottomSheet, { closeCallback: r => resolve(r || {}), transparent: true });
            });
            // return barCodeScanner
            //     .scan({
            //         formats: 'QR_CODE, EAN_13',
            //         cancelLabel: this.$t('close'), // iOS only, default 'Close'
            //         message: '', // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
            //         showFlipCameraButton: false, // default false
            //         preferFrontCamera: false, // default false
            //         showTorchButton: true, // default false
            //         beepOnScan: true, // Play or Suppress beep on scan (default true)
            //         fullScreen: true, // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
            //         torchOn: false, // launch with the flashlight on (default false)
            //         closeCallback: () => {
            //             console.log('Scanner closed');
            //         }, // invoked when the scanner was closed (success or abort)
            //         resultDisplayDuration: 0, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
            //         openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
            //         presentInRootViewController: true // iOS-only; If you're sure you're not presenting the (non embedded) scanner in a modal, or are experiencing issues with fi. the navigationbar, set this to 'true' and see if it works better for your app (default false).
            //     })
            //     .then(result => {
            //         const text = result.text;
            //         console.log('scanned', result);
            //         const splitedString = text.split('#');
            //         if (splitedString.length === 2 && /[0-9]{9}/.test(splitedString[0])) {
            //             return {
            //                 ICC: splitedString[0],
            //                 name: splitedString[1]
            //             };
            //         } else {
            //             return Promise.reject(new Error(this.$t('wrong_scancode')));
            //         }
            //     });
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
