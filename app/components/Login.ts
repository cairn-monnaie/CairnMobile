import { prompt } from 'nativescript-material-dialogs';
import { TextField } from 'nativescript-material-textfield';
import { PropertyChangeData } from 'tns-core-modules/data/observable';
import { isAndroid } from 'tns-core-modules/platform/platform';
import { NavigatedData } from 'tns-core-modules/ui/page/page';
import { Component } from 'vue-property-decorator';
import * as Animation from '~/animation';
import { screenHeightDips } from '../variables';
import { ComponentIds } from './App';
import PageComponent from './PageComponent';

const logoViewHeight = isAndroid ? screenHeightDips : screenHeightDips - 20 - 0.3;
@Component({})
export default class Login extends PageComponent {
    navigateUrl = ComponentIds.Login;
    isLoggingIn = true;
    user = {
        username: 'gjanssens',
        email: '',
        password: '@@bbccdd',
        confirmPassword: ''
    };
    logoViewHeight = logoViewHeight;
    usernameError?: string = null;
    mailError?: string = null;
    passwordError?: string = null;
    canLoginOrRegister = false;
    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
    }
    onLoaded(args: NavigatedData) {
        this.checkForm();
        if (!args.isBackNavigation) {
            setTimeout(this.animateLogoView, 300); // delay for now as the first run is "jumping"
        }
    }
    animateLogoView() {
        // const view = this.getRef('logoView');
        new Animation.Animation({ height: logoViewHeight })
            .to({ height: 200 }, 1000)
            .easing(Animation.Easing.Elastic.Out)
            .onUpdate(object => {
                this.logoViewHeight = object.height;
                // Object.assign(view.style, object)
            })
            .start();
    }
    animateLogoViewOut() {
        // const view = this.getRef('logoView');
        return new Promise(resolve => {
            new Animation.Animation({ height: 200 })
                .to({ height: 68 }, 1000)
                .easing(Animation.Easing.Elastic.Out)
                .onComplete(resolve)
                .onUpdate(object => {
                    this.logoViewHeight = object.height;
                    // Object.assign(view.style, object)
                })
                .start();
        });
    }
    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    onInputChange(e: PropertyChangeData, value) {
        this.checkForm();
    }
    validateStringProp(p, minLength = 0) {
        return !!p && p.length > minLength;
    }
    checkForm() {
        if (!this.validateStringProp(this.user.username)) {
            this.usernameError = this.$tc('username_required');
            // } else if (!this.validateStringProp(this.user.username)!this.validEmail(this.user.email)) {
            // this.mailError = "Valid email required."
        } else {
            this.usernameError = null;
        }

        if (!this.isLoggingIn && this.user.confirmPassword !== this.user.password) {
            this.passwordError = this.$tc('passwords_dont_match');
        } else if (!this.validateStringProp(this.user.password)) {
            this.passwordError = this.$tc('password_missing');
        } else {
            this.passwordError = null;
        }

        this.canLoginOrRegister = !this.mailError && !this.passwordError;
    }
    validEmail(email) {
        const re = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        return re.test(email);
    }
    submit() {
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {
        if (!this.canLoginOrRegister) {
            return this.$alert('missing_parameters');
        }
        this.loading = true;
        this.animateLogoViewOut();
        return this.$authService.login(this.user).catch(err => {
            this.animateLogoView();
            this.showError(err);
        });
    }
    register() {
        if (!this.canLoginOrRegister) {
            return this.$alert('missing_parameters');
        }
        this.loading = true;
        this.$authService
            .register(this.user)
            .then(() => {
                this.$alert('account_created');
                this.isLoggingIn = true;
                this.loading = false;
            })
            .catch(err => this.showError(err));
    }

    forgotPassword() {
        prompt({
            autoFocus: true,
            title: this.$tc('forgot_password'),
            message: this.$tc('fill_email'),
            inputType: 'email',
            defaultText: '',
            okButtonText: this.$tu('ok'),
            cancelButtonText: this.$tu('cancel')
        }).then(data => {
            if (data.result) {
                this.$authService
                    .resetPassword(data.text.trim())
                    .then(() => {
                        this.$alert(this.$tc('password_reset_confirmation'));
                    })
                    .catch(err => this.showError(err));
            }
        });
    }

    get passwordTF() {
        return this.getRef('password') as TextField;
    }
    get confirmPasswordTF() {
        return this.getRef('confirmPassword') as TextField;
    }

    focusPassword() {
        this.passwordTF.requestFocus();
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPasswordTF.requestFocus();
        } else {
            this.submit();
        }
    }
}
