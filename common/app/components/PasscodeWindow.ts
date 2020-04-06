import { PropertyChangeData } from '@nativescript/core/data/observable';
import { Component, Prop } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import { TextField } from 'nativescript-material-textfield';
import { AndroidActivityBackPressedEventData, AndroidApplication, android as androidApp } from '@nativescript/core/application';

enum State {
    CurrentPasswordQuery,
    PasswordQuery,
    ConfirmPasswordQuery,
}

export interface PasscodeWindowOptions {
    creation?: boolean;
    change?: boolean;
    closeOnBack?: boolean;
    allowClose?: boolean;
    storePassword?: string;
}
@Component({})
export default class PasscodeWindow extends PageComponent {
    @Prop({ default: false }) creation: boolean;
    @Prop({ default: false }) change: boolean;
    @Prop({ default: false }) closeOnBack: boolean;
    @Prop({ default: false }) allowClose: boolean;
    @Prop() storePassword: string;

    title: string = null;
    message: string = null;
    state: State = null;
    oldPasscode: string;
    mounted() {
        super.mounted();
        if (this.change) {
            this.state = State.CurrentPasswordQuery;
        } else {
            this.state = State.PasswordQuery;
        }
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
        if (this.creation || this.change) {
            data.cancel = true;
        } else if (this.closeOnBack) {
            androidApp.foregroundActivity.finish();
        }
    }
    onLoaded() {}

    passCodeArray = [];
    passCodeConfirmationArray = [];

    get currentArray() {
        if (this.state === State.ConfirmPasswordQuery) {
            return this.passCodeConfirmationArray;
        }
        return this.passCodeArray;
    }

    onTextChange(i: number, text: string) {
        // console.log('onTextChange', i, text);
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
        switch (this.state) {
            case State.CurrentPasswordQuery:
                this.message = this.$t('current_passcode');
                break;
            case State.PasswordQuery:
                if (this.change) {
                    this.message = this.$t('new_passcode');
                } else if (this.creation) {
                    this.message = this.$t('enter_passcode');
                } else {
                    this.message = null;
                }
                break;
            case State.ConfirmPasswordQuery:
                this.message = this.$t('confirm_passcode');
                break;
        }
    }
    clear() {
        this.passCodeArray = [];
        this.passCodeConfirmationArray = [];
        this.updateMessage();
    }
    setState(state: State) {
        if (this.state !== state) {
            this.state = state;
            switch (state) {
                case State.CurrentPasswordQuery:
                    this.passCodeArray = [];
                    break;
                case State.PasswordQuery:
                    this.passCodeArray = [];
                    this.passCodeConfirmationArray = [];
                    break;
                case State.ConfirmPasswordQuery:
                    this.passCodeConfirmationArray = [];
                    break;
            }
        }
    }
    passwordsMatches() {
        return this.passCodeArray.join('') === this.passCodeConfirmationArray.join('');
    }
    onButtonTap(str: string) {
        // console.log('onButtonTap', str, this.confirmingPassword, this.passCodeArray.length, this.passCodeConfirmationArray.length);

        if (this.state === State.ConfirmPasswordQuery) {
            if (this.passCodeConfirmationArray.length < 4) {
                this.passCodeConfirmationArray.push(str);
            }
            if (this.passCodeConfirmationArray.length === 4) {
                if (this.passwordsMatches()) {
                    this.$modal.close({ passcode: this.passCodeArray.join(''), oldPasscode: this.oldPasscode });
                } else {
                    this.message = this.$t('confirm_passcode_dont_match');
                    setTimeout(() => {
                        if (this.change) {
                            this.$modal.close();
                        } else {
                            this.setState(State.PasswordQuery);
                        }
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
                switch (this.state) {
                    case State.CurrentPasswordQuery:
                        const current = this.passCodeArray.join('');
                        if (this.storePassword === current) {
                            this.oldPasscode = current;
                            this.setState(State.PasswordQuery);
                            this.updateMessage();
                        } else {
                            this.message = this.$t('wrong_passcode');
                            setTimeout(() => {
                                this.$modal.close();
                            }, 50);
                        }
                        break;
                    case State.PasswordQuery:
                        if (this.creation || this.change) {
                            setTimeout(() => {
                                this.setState(State.ConfirmPasswordQuery);
                                this.updateMessage();
                            }, 50);
                        } else {
                            const current = this.passCodeArray.join('');
                            if (this.allowClose) {
                                this.$modal.close({ passcode: current });
                            } else if (this.storePassword === current) {
                                this.$modal.close({ passcode: current });
                            } else {
                                this.message = this.$t('wrong_passcode');

                                setTimeout(() => {
                                    this.updateMessage();
                                }, 1000);
                                setTimeout(() => {
                                    this.passCodeArray = [];
                                }, 50);
                            }
                        }
                        break;
                }
            }
        }
        // console.log('onButtonTap done ', str, this.confirmingPassword, this.passCodeArray, this.passCodeConfirmationArray);
    }
}
