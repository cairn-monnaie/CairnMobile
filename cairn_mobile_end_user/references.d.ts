/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android-26.d.ts" />
/// <reference path="./vue.shim.d.ts" />

// import { SmsListener } from '~/receivers/SMSReceiver';

declare module '*.scss';

declare const gVars: {
    sentry: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    internalApp: boolean;
};

declare const TNS_ENV: string;
declare const LOG_LEVEL: string;
declare const SENTRY_DSN: string;
declare const TEST_LOGS: boolean;
declare const PRODUCTION: boolean;
declare const SENTRY_PREFIX: string;
declare const CAIRN_CLIENT_ID: string;
declare const CAIRN_CLIENT_SECRET: string;
declare const SHA_SECRET_KEY: string;
declare const CAIRN_URL: string;
declare const CAIRN_SMS_NUMBER: string;

declare namespace com {
    export namespace akylas {
        export namespace cairnmobile {
            class SmsReceiver extends globalAndroid.content.BroadcastReceiver {
                static bindListener(listener: { messageReceived(msg, address) });
            }
        }
    }
}
