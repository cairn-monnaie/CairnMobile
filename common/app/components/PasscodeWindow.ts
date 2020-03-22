import { PropertyChangeData } from '@nativescript/core/data/observable';
import { Component, Prop } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import { TextField } from 'nativescript-material-textfield';
import { AndroidActivityBackPressedEventData, AndroidApplication, android as androidApp } from '@nativescript/core/application';

@Component({})
export default class PasscodeWindow extends PageComponent {
    @Prop({ default: false }) creation: boolean;
    @Prop({ default: false }) closeOnBack: boolean;
    confirmingPassword = false;

    title: string = null;
    message: string = null;

    mounted() {
        super.mounted();
        if (gVars.isAndroid) {
            androidApp.on(AndroidApplication.activityBackPressedEvent, this.onAndroidBackButton);
        }
        this.title = this.creation ? this.$t('password_creation') : this.$t('enter_password');
        this.updateMessage();
    }
    destroyed() {
        super.destroyed();
        if (gVars.isAndroid) {
            androidApp.off(AndroidApplication.activityBackPressedEvent, this.onAndroidBackButton);
        }
    }
    onAndroidBackButton(data: AndroidActivityBackPressedEventData) {
        if (this.creation) {
            data.cancel = true;
        } else if (this.closeOnBack) {
            androidApp.foregroundActivity.finish();
        }
    }
    onLoaded() {}

    passCodeArray = [];
    passCodeConfirmationArray = [];

    onTextChange(i: number, text: string) {
        console.log('onTextChange', i, text);
        // if (text && text.length) {
        //     this.passCodeArray[i] = text[0];
        //     if ( i < 3) {
        //         this.$refs['field' + (i + 1)].nativeView.requestFocus();

        //     } else {
        //         this.$refs['field' + (i)].nativeView.blur();
        //     }
        // }
    }

    updateMessage() {
        this.message = this.confirmingPassword ? this.$t('confirm_password') : this.$t('enter_password');
    }
    clear() {
        this.confirmingPassword = false;
        this.passCodeArray = [];
        this.passCodeConfirmationArray = [];
        this.updateMessage();
    }
    onButtonTap(str: string) {
        // console.log('onButtonTap', str, this.confirmingPassword, this.passCodeArray.length, this.passCodeConfirmationArray.length);

        if (this.confirmingPassword) {
            if (this.passCodeConfirmationArray.length < 4) {
                this.passCodeConfirmationArray.push(str);
            }
            if (this.passCodeConfirmationArray.length === 4) {
                if (this.passCodeArray.join('') === this.passCodeConfirmationArray.join('')) {
                    console.log('closing modal');
                    this.$modal.close(this.passCodeArray.join(''));
                } else {
                    // this.$alert(this.$t('confirm_password_dont_match'));
                    this.message = this.$t('confirm_password_dont_match');
                    setTimeout(() => {
                        this.confirmingPassword = false;
                        this.passCodeArray = [];
                        this.passCodeConfirmationArray = [];
                    }, 50);
                    setTimeout(() => {
                        this.updateMessage();
                    }, 2000);
                }
            }
        } else {
            if (this.passCodeArray.length < 4) {
                this.passCodeArray.push(str);
            }
            if (this.passCodeArray.length === 4) {
                if (this.creation) {
                    setTimeout(() => {
                        this.confirmingPassword = true;
                        this.updateMessage();
                    }, 50);
                } else {
                    console.log('closing modal1');
                    this.$modal.close(this.passCodeArray.join(''));
                }
            }
        }
        // console.log('onButtonTap done ', str, this.confirmingPassword, this.passCodeArray, this.passCodeConfirmationArray);
    }
}
