import * as application from '@nativescript/core/application';
import * as imageModule from '@nativescript-community/ui-image';
import { $t, $tc, $tt, $tu } from '~/common/helpers/locale';
import { Device, Screen } from '@nativescript/core/platform';
import App from '~/common/components/App';
import { getAuthInstance } from '~/common/services/AuthService';
import SecurityService from '~/common/services/SecurityService';
import { screenHeightDips, screenWidthDips } from './variables';
import { alert } from '@nativescript-community/ui-material-dialogs';
import { isSimulator } from '@nativescript-community/extendedinfo';
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
        // if (global.isAndroid) {
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

        Vue.prototype.$isAndroid = global.isAndroid;
        Vue.prototype.$isIOS = global.isIOS;
        // const filters = (Vue.prototype.$filters = Vue['options'].filters);
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
            // console.log('scanQRCode', sprintf(CAIRN_FULL_QRCODE_FORMAT, {
            //     ICC: '622593501',
            //     name: 'La Bonne Pioche',
            //     id: 'test'
            // }));
            let result;
            if (global.isIOS && isSimulator()) {
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
                    if (global.isAndroid) {
                        // ios does not seem to allow to call openURL with our own scheme
                        openUrl(result);
                    } else {
                        (this as NativescriptVue).$getAppComponent().handleReceivedAppUrl(result);
                    }

                }
            }
            return result;
        };

        /* DEV-START */
        console.log('model', Device.model);
        console.log('os', Device.os);
        console.log('osVersion', Device.osVersion);
        console.log('manufacturer', Device.manufacturer);
        console.log('deviceType', Device.deviceType);
        console.log('widthPixels', Screen.mainScreen.widthPixels);
        console.log('heightPixels', Screen.mainScreen.heightPixels);
        console.log('widthDIPs', screenWidthDips);
        console.log('heightDIPs', screenHeightDips);
        console.log('scale', Screen.mainScreen.scale);
        console.log('ratio', Screen.mainScreen.heightDIPs / screenWidthDips);
        /* DEV-END */
    }
};

export default Plugin;
END */
    }
};

export default Plugin;
