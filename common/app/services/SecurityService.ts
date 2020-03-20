// import { getBoolean, getNumber, getString, remove, setBoolean, setNumber, setString } from '@nativescript/core/application-settings';
import { Observable } from '@nativescript/core/data/observable';
import { FingerprintAuth } from 'nativescript-fingerprint-auth';
import { booleanProperty, stringProperty } from './BackendService';
import NativeScriptVue from 'nativescript-vue';
import PasscodeWindow from '~/components/PasscodeWindow';
/**
 * Parent service class. Has common configs and methods.
 */
export default class SecurityService extends Observable {
    private fingerprintAuth = new FingerprintAuth();
    @stringProperty storedPassword: string;
    @booleanProperty biometricEnabled: boolean;
    available() {
        return this.fingerprintAuth.available().then(r => {
            if (!r.touch || !r.face) {
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
        return (
            parent
                .$showModal(PasscodeWindow, {
                    fullscreen: true,
                    // animated: false,
                    props: {
                        creation: true
                    }
                })
                // .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
                .then((r: string) => {
                    // console.log('test createPasscode', r);
                    this.storedPassword = r;
                    // console.log('test createPasscode done ', this.storedPassword);
                })
        );
    }
    shouldReAuth() {
        if (this.biometricEnabled !== true) {
            return Promise.resolve(false);
        }
        return this.fingerprintAuth.didFingerprintDatabaseChange().then(changed => !changed);
    }
    validateSecurity(parent: NativeScriptVue) {
        if (this.biometricEnabled) {
            return this.verifyFingerprint();
        } else {
            return (
                parent
                    .$showModal(PasscodeWindow, {
                        fullscreen: true
                    })
                    // .then(() => )
                    .then((r: string) => this.storedPassword === r)
            );
        }
    }
    verifyFingerprint() {
        return this.fingerprintAuth
            .verifyFingerprint({
                //   title: 'Android title', // optional title (used only on Android)
                //   message: 'Scan yer finger', // optional (used on both platforms) - for FaceID on iOS see the notes about NSFaceIDUsageDescription
                authenticationValidityDuration: 10, // optional (used on Android, default 5)
                useCustomAndroidUI: false // set to true to use a different authentication screen (see below)
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
