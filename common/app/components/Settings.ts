import { Component, Watch } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import { ComponentIds } from './App';
import { showSnack } from 'nativescript-material-snackbar';
import { UserSettings } from '~/services/AuthService';
import SettingSwitch from './SettingSwitch';
import SettingSwitchWithSubtitle from './SettingSwitchWithSubtitle';
import { throttle } from 'helpful-decorators';

@Component({
    components: {
        SettingSwitch,
        SettingSwitchWithSubtitle
    }
})
export default class Settings extends PageComponent {
    navigateUrl = ComponentIds.Settings;
    biometricsAvailable = false;
    innerBiometricsEnabled = false;
    userSettings: UserSettings = null;
    mounted() {
        super.mounted();
        this.$securityService.biometricsAvailable().then(r => {
            this.biometricsAvailable = r;
        });
        this.innerBiometricsEnabled = this.$securityService.biometricEnabled;
        this.refreshSettings();
    }

    @Watch('userSettings', { deep: true })
    onUserSettingsChanged() {
        this.log('onUserSettingsChanged', this.userSettings);
        this.saveUserSettings();
    }

    @throttle(2000)
    saveUserSettings() {
        this.log('saveUserSettings');
        this.$authService.postUserSettings(this.userSettings);
    }

    async refreshSettings() {
        this.userSettings = await this.$authService.getUserSettings();
    }

    get paymentNotifSettings() {
        return this.userSettings && this.userSettings.baseNotifications[0];
    }
    get newproNotifSettings() {
        return this.userSettings && this.userSettings.baseNotifications[1];
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
                .then(r => {
                    this.$securityService.biometricEnabled = this.innerBiometricsEnabled = r;
                })
                .catch(err => {
                    this.ignoreNextCheckEvent = true;
                    this.innerBiometricsEnabled = false;
                });
        } else {
            if (this.$securityService.biometricEnabled) {
                this.$securityService
                    .verifyFingerprint()
                    .then(r => {
                        this.$securityService.biometricEnabled = this.innerBiometricsEnabled = false;
                    })
                    .catch(err => {
                        this.ignoreNextCheckEvent = true;
                        this.innerBiometricsEnabled = true;
                    });
            }
        }
    }
    get autoLockEnabled() {
        return this.$securityService.autoLockEnabled;
    }
    set autoLockEnabled(value: boolean) {
        this.$securityService.autoLockEnabled = value;
    }
    get sendCrashReports() {
        return this.$crashReportService.sentryEnabled;
    }
    set sendCrashReports(value: boolean) {
        this.$crashReportService.sentryEnabled = value;
    }

    destroyed() {
        super.destroyed();
    }

    changePinCode() {
        this.$securityService.changePasscode(this).then(result => {
            if (result) {
                showSnack({
                    message: this.$t('pin_changed')
                });
            }
        });
    }
}
