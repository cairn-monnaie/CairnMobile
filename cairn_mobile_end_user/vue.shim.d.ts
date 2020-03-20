import Vue from 'vue';
import AuthService from '~/services/AuthService';
import SecurityService from '~/services/SecurityService';
// import { ToastDuration, ToastPosition } from 'nativescript-toasty';
import { Client } from 'nativescript-bugsnag';
import App from '~/components/App';
import * as Sentry from 'nativescript-akylas-sentry';

declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $authService: AuthService;
        $securityService: SecurityService;
        $sentry: typeof Sentry;

        $isAndroid: boolean;
        $isIOS: boolean;
        $t: (s: string, ...args) => string;
        $tc: (s: string, ...args) => string;
        $tu: (s: string, ...args) => string;
        $filters: {
            titleclase(s: string): string;
            uppercase(s: string): string;
            L(s: string, ...args): string;
        };
        $showError(err: Error | string);
        $alert(message: string);
        // $showToast(message: string, duration?: ToastDuration, position?: ToastPosition);
        $setAppComponent(comp: App);
        $getAppComponent(): App;
    }
}
