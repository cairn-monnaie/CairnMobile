// import { getBoolean, getNumber, getString, remove, setBoolean, setNumber, setString } from '@nativescript/core/application-settings';
import { Observable } from '@nativescript/core/data/observable';
import { FingerprintAuth } from 'nativescript-fingerprint-auth';
import { booleanProperty, stringProperty } from './BackendService';
import NativeScriptVue from 'nativescript-vue';
import PasscodeWindow, { PasscodeWindowOptions } from '~/components/PasscodeWindow';
/**
 * Parent service class. Has common configs and methods.
 */
export default class SecurityService extends Observable {
    private fingerprintAuth = new FingerprintAuth();
    @stringProperty storedPassword: string;
    @booleanProperty biometricEnabled: boolean;
    @booleanProperty autoLockEnabled: boolean;
    biometricsAvailable() {
        console.log('biometricsAvailable');
        return this.fingerprintAuth.available().then((r) => {
            console.log('fingerprintAuth', 'available', r);
            if (!r.touch && !r.face) {
                return false;
            }
            return true;
        });
    }
    clear() {
        this.storedPassword = null;
        this.biometricEnabled = false;
    }
    passcodeSet() {
        return !!this.storedPassword;
    }
    createPasscode(parent: NativeScriptVue) {
        return this.showPasscodeWindow(parent, {
            creation: true,
        }).then((r) => {
            this.storedPassword = r.passcode;
        });
    }
    changePasscode(parent: NativeScriptVue) {
        return this.showPasscodeWindow(parent, {
            storePassword:this.storedPassword,
            change: true,
        }).then((r) => {
            if (this.storedPassword === r.oldPasscode) {
                this.storedPassword = r.passcode;
                return true;
            }
            return false;
        });
    }

    showPasscodeWindow(parent: NativeScriptVue, options?: PasscodeWindowOptions) {
        return parent.$showModal(PasscodeWindow, {
            fullscreen: true,
            props: options,
        }) as Promise<{ passcode: string; oldPasscode?: string }>;
    }
    shouldReAuth() {
        if (this.biometricEnabled !== true) {
            return Promise.resolve(false);
        }
        return this.fingerprintAuth.didFingerprintDatabaseChange().then((changed) => !changed);
    }
    validateSecurity(parent: NativeScriptVue, options?: PasscodeWindowOptions) {
        if (this.biometricEnabled) {
            return this.verifyFingerprint();
        } else {
            return this.showPasscodeWindow(parent, { storePassword: this.storedPassword, allowClose: false, ...options }).then((r) => this.storedPassword === r.passcode);
        }
    }
    verifyFingerprint() {
        return this.fingerprintAuth
            .verifyFingerprint({
                //   title: 'Android title', // optional title (used only on Android)
                //   message: 'Scan yer finger', // optional (used on both platforms) - for FaceID on iOS see the notes about NSFaceIDUsageDescription
                authenticationValidityDuration: 10, // optional (used on Android, default 5)
                useCustomAndroidUI: false, // set to true to use a different authentication screen (see below)
            })
            .then((enteredPassword?: string) => {
                if (enteredPassword === undefined) {
                    return true;
                    // } else if (this.storedPassword === enteredPassword) {
                    //     return true;
                    // compare enteredPassword to the one the user previously configured for your app (which is not the users system password!)
                }
                return false;
            });
    }
}
