import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import { ComponentIds } from './App';
import { showSnack } from 'nativescript-material-snackbar';

@Component({
    components: {},
})
export default class Settings extends PageComponent {
    navigateUrl = ComponentIds.Settings;
    biometricsAvailable = false;
    innerBiometricsEnabled = false;
    mounted() {
        super.mounted();
        this.$securityService.biometricsAvailable().then((r) => {
            this.biometricsAvailable = r;
        });
        this.innerBiometricsEnabled = this.$securityService.biometricEnabled;
    }

    ignoreNextCheckEvent = false;
    get biometricsEnabled() {
        return this.innerBiometricsEnabled;
    }
    set biometricsEnabled(value: boolean) {
        this.innerBiometricsEnabled = value;
        if (this.ignoreNextCheckEvent) {
            this.ignoreNextCheckEvent = false;
            return;
        }
        if (value) {
            this.$securityService
                .verifyFingerprint()
                .then((r) => {
                    this.$securityService.biometricEnabled = this.innerBiometricsEnabled = r;
                })
                .catch((err) => {
                    this.ignoreNextCheckEvent = true;
                    this.innerBiometricsEnabled = false;
                });
        } else {
            if (this.$securityService.biometricEnabled) {
                this.$securityService
                    .verifyFingerprint()
                    .then((r) => {
                        this.$securityService.biometricEnabled = this.innerBiometricsEnabled = false;
                    })
                    .catch((err) => {
                        this.ignoreNextCheckEvent = true;
                        this.innerBiometricsEnabled = true;
                    });
            }
        }

        console.log('set biometricsEnabled', value);
    }
    get autoLockEnabled() {
        return this.$securityService.autoLockEnabled;
    }
    set autoLockEnabled(value: boolean) {
        console.log('set autoLockEnabled', value);
        this.$securityService.autoLockEnabled = value;
    }

    destroyed() {
        super.destroyed();
    }

    changePinCode() {
        this.$securityService.changePasscode(this).then((result) => {
            if (result) {
                showSnack({
                    message: this.$t('pin_changed'),
                });
            }
        });
    }
}
