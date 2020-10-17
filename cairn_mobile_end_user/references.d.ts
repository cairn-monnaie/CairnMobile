/// <reference path="./node_modules/@nativescript/types-ios/lib/ios.d.ts" />
/// <reference path="./node_modules/@nativescript/types-android/lib/android-28.d.ts" />
/// <reference path="./vue.shim.d.ts" />

// import { SmsListener } from '~/common/receivers/SMSReceiver';

declare module '*.scss';

declare const gVars: {
    sentry: boolean;
    internalApp: boolean;
    platform: 'ios' | 'android';
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
declare const PRIVACY_POLICY_URL: string;
declare const TERMS_CONDITIONS_URL: string;
declare const SUPPORT_URL: string;
declare const CREDIT_URL: string;
declare const GIT_URL: string;
declare const STORE_LINK: string;
declare const STORE_REVIEW_LINK: string;
declare const CUSTOM_URL_SCHEME: string;
declare const CAIRN_TRANSFER_QRCODE: string;
declare const CAIRN_TRANSFER_QRCODE_PARAMS: string;
declare const CAIRN_TRANSFER_QRCODE_AMOUNT_PARAM: string;
declare const CAIRN_FULL_QRCODE_FORMAT: string;
declare const WITH_PUSH_NOTIFICATIONS: boolean;
declare const FAKE_ALL: boolean;

declare namespace com {
    export namespace akylas {
        export namespace cairnmobile {
            class SmsReceiver extends globalAndroid.content.BroadcastReceiver {
                static bindListener(listener: { messageReceived(msg, address) });
            }

            class OkhttpCallback {
                onStringResponse(responseString, statusCode, headers);
                onFailure(call, error);
            }
            class FloatingActivity extends androidx.appcompat.app.AppCompatActivity {}
        }
    }
}
