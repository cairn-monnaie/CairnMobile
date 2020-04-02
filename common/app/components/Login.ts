import { prompt } from 'nativescript-material-dialogs';
import { TextField } from 'nativescript-material-textfield';
import { PropertyChangeData } from '@nativescript/core/data/observable';
import { isAndroid } from '@nativescript/core/platform/platform';
import { NavigatedData } from '@nativescript/core/ui/page/page';
import { Component, Watch } from 'vue-property-decorator';
import { actionBarHeight, screenHeightDips, statusBarHeight } from '../variables';
import { ComponentIds } from './App';
import { TWEEN } from 'nativescript-tween';
import PageComponent from './PageComponent';
import InteractiveMap from './InteractiveMap';

const logoViewHeight = isAndroid ? screenHeightDips : screenHeightDips - statusBarHeight - 0.3;
@Component({
    components: {
        InteractiveMap
    }
})
export default class Login extends PageComponent {
    navigateUrl = ComponentIds.Login;
    isLoggingIn = true;
    user = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    // logoViewHeight = logoViewHeight;
    logoViewHeight = 200;
    usernameError?: string = null;
    mailError?: string = null;
    passwordError?: string = null;
    canLoginOrRegister = false;

    showLogin = false;
    showLoginAlpha = 0;
    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
    }
    onLoaded(args: NavigatedData) {
        this.checkForm();
        // if (!args.isBackNavigation) {
        //     setTimeout(this.animateLogoView, 300); // delay for now as the first run is "jumping"
        // }
    }
    hideMap() {
        this.showLogin = true;
        // this.animateLogoView();
        return new Promise(resolve => {
            new TWEEN.Tween({ opacity: this.showLoginAlpha })
                .to({ opacity: 1 }, 300)
                .onComplete(resolve)
                .onUpdate(object => {
                    this.showLoginAlpha = object.opacity;
                    // Object.assign(view.style, object)
                })
                .start();
        }).catch(this.showError);
    }
    showMap() {
        // this.animateLogoViewOut();
        return new Promise(resolve => {
            new TWEEN.Tween({ opacity: this.showLoginAlpha })
                .to({ opacity: 0 }, 300)
                .onComplete(resolve)
                .onUpdate(object => {
                    this.showLoginAlpha = object.opacity;
                })
                .start();
        })
            .then(() => (this.showLogin = false))
            .catch(this.showError);
    }
    @Watch('user', { deep: true })
    onUserChange() {
        // console.log('onUserChange', this.user);
    }

    animateLogoView() {
        // const view = this.getRef('logoView');
        return new Promise(resolve => {
            new TWEEN.Tween({ height: this.logoViewHeight })
                .to({ height: 200 }, 1000)
                .easing(TWEEN.Easing.Elastic.Out)
                .onComplete(resolve)
                .onUpdate(object => {
                    this.logoViewHeight = object.height;
                    // Object.assign(view.style, object)
                })
                .start();
        }).catch(this.showError);
    }
    animateLogoViewOut() {
        // const view = this.getRef('logoView');
        return new Promise(resolve => {
            new TWEEN.Tween({ height: this.logoViewHeight }) // ratio 2.94
                .to({ height: actionBarHeight }, 1000)
                .easing(TWEEN.Easing.Elastic.Out)
                .onComplete(resolve)
                .onUpdate(object => {
                    this.logoViewHeight = object.height;
                    // Object.assign(view.style, object)
                })
                .start();
        }).catch(this.showError);
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
        // this.animateLogoViewOut();
        return this.$authService
            .login(this.user)
            .catch(err => {
                // this.animateLogoView();
                this.showError(err);
            })
            .finally(() => {
                this.loading = false;
            });
    }
    register() {
        if (!this.canLoginOrRegister) {
            return this.$alert('missing_parameters');
        }
        // this.loading = true;
        // this.$authService
        //     .register(this.user)
        //     .then(() => {
        //         this.$alert('account_created');
        //         this.isLoggingIn = true;
        //     })
        //     .catch(this.showError)
        //     .finally(() => {
        //         this.loading = false;
        //     });
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
                    .catch(this.showError);
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
