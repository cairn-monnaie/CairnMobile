// import { getBoolean, getNumber, getString, remove, setBoolean, setNumber, setString } from '@nativescript/core/application-settings';
import { Observable } from '@nativescript/core/data/observable';
import { FingerprintAuth } from 'nativescript-fingerprint-auth';
import { booleanProperty, stringProperty } from './BackendService';
/**
 * Parent service class. Has common configs and methods.
 */
export default class SecurityService extends Observable {
    private fingerprintAuth = new FingerprintAuth();
    // @stringProperty storedPassword: string;
    @booleanProperty enabled: boolean;
    available() {
        return this.fingerprintAuth.available().then(r => {
            if (!r.touch || !r.face) {
                return false;
            }
            return true;
        });
    }
    shouldReAuth() {
        if (!this.enabled) {
            return Promise.resolve(false);
        }
        return this.fingerprintAuth.didFingerprintDatabaseChange().then(changed => !changed);
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
