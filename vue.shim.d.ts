import Vue from "vue"
import AuthService from "~/services/authService"
import { ToastDuration, ToastPosition } from 'nativescript-toasty';
import { Client } from 'nativescript-bugsnag';
import App from '~/components/App';

declare module "vue/types/vue" {
    // 3. Declare augmentation for Vue
    interface Vue {
        $authService: AuthService

        $bugsnag: Client;

        $isAndroid: boolean
        $isIOS: boolean
        $t: (s: string, ...args) => string;
        $ltc: (s: string, ...args) => string
        $luc: (s: string, ...args) => string
        $filters: {
            titleclase(s: string): string
            uppercase(s: string): string
            L(s: string, ...args): string
        }
        $showError(err: Error | string);
        $alert(message: string)
        $showToast(message: string, duration?: ToastDuration, position?: ToastPosition);
        $setAppComponent(comp: App);
        $getAppComponent(): App;
    }
}
