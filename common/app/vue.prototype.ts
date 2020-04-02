import * as application from '@nativescript/core/application';
import { Label as HTMLLabel } from 'nativescript-htmllabel';
import * as imageModule from 'nativescript-image';
import { $t, $tc, $tt, $tu } from '~/helpers/locale';
// import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty';
import { device, screen } from '@nativescript/core/platform';
import App from '~/components/App';
import AuthService, { getAuthInstance } from '~/services/AuthService';
import SecurityService from '~/services/SecurityService';
import { clog } from './utils/logging';
import { screenHeightDips, screenWidthDips } from './variables';
import { alert, confirm } from 'nativescript-material-dialogs';
import { Color } from '@nativescript/core/ui/frame';
import { isSimulator } from 'nativescript-extendedinfo';
import BarCodeBottomSheet from './components/BarCodeBottomSheet';
import NativescriptVue from 'nativescript-vue';

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
        Vue.prototype.$showError = function showError(err: Error) {
            const message = typeof err === 'string' ? err : err.message || err.toString();
            clog('$showError', err, err.stack);
            const label = new HTMLLabel();
            label.style.padding = '0 20 20 20';
            // label.style.backgroundColor = new Color(255, 255,0,0);
            label.style.fontSize = 14;
            label.style.color = new Color(255, 138, 138, 138);
            label.html = Vue.prototype.$tc(message.trim());
            return confirm({
                title: Vue.prototype.$tc('error'),
                view: label,
                okButtonText: this.$sentry ? $tc('send_bug_report') : undefined,
                cancelButtonText: this.$sentry ? $tc('cancel') : $tc('ok')
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
