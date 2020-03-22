/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android-26.d.ts" />
/// <reference path="./vue.shim.d.ts" />

// import { SmsListener } from '~/receivers/SMSReceiver';

declare module '*.scss';

declare const gVars: {
    SENTRY_DSN: string;
    SENTRY_PREFIX: string;
    sentry: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    internalApp: boolean;
    CARTO_TOKEN: string;
};

declare const TNS_ENV: string;
declare const LOG_LEVEL: string;
declare const TEST_LOGS: boolean;
declare const PRODUCTION: boolean;

declare namespace com {
    export namespace akylas {
        export namespace cairnmobile {
            class SmsReceiver extends globalAndroid.content.BroadcastReceiver {
                static bindListener(listener: { messageReceived(msg, address) });
            }
        }
    }
}
