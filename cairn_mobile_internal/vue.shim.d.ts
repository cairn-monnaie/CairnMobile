import Vue from 'vue';
import AuthService from '~/common/services/AuthService';
// import { ToastDuration, ToastPosition } from 'nativescript-toasty';
import { Client } from 'nativescript-bugsnag';
import App from '~/common/components/App';
import * as Sentry from '@nativescript-community/sentry';

declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $authService: AuthService;
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
