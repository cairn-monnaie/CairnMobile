<template>
    <Page ref="page" class="page themedBack" actionBarHidden="true">
        <FlexboxLayout class="flex">
            <StackLayout class="form">
                <Image class="logo" src="res://icon_small" />
                <Label class="header" text="Cairn Mobile" />

                <StackLayout class="input-field" marginBottom="25">
                    <MDCTextField class="input" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" v-model="user.email" returnKeyType="next" @returnPress="focusPassword" fontSize="18" />
                    <StackLayout class="hr-light" />
                </StackLayout>

                <StackLayout class="input-field" marginBottom="25">
                    <MDCTextField ref="password" class="input" hint="Password" secure="true" v-model="user.password" :returnKeyType="isLoggingIn ? 'done' : 'next'" @returnPress="focusConfirmPassword" fontSize="18" />
                    <StackLayout class="hr-light" />
                </StackLayout>

                <StackLayout v-show="!isLoggingIn" class="input-field">
                    <MDCTextField ref="confirmPassword" class="input" hint="Confirm password" secure="true" v-model="user.confirmPassword" returnKeyType="done" fontSize="18" />
                    <StackLayout class="hr-light" />
                </StackLayout>

                <MDCButton :text="isLoggingIn ? 'Log In' : 'Sign Up'" @tap="submit" />
                <Label v-show="isLoggingIn" text="Forgot your password?" class="login-label" @tap="forgotPassword" />
            </StackLayout>

            <HTMLLabel class="login-label sign-up-label" @tap="toggleForm">
                <FormattedString>
                    <Span :text="isLoggingIn ? 'Don’t have an account? ' : 'Back to Login'" />
                    <Span :text="isLoggingIn ? 'Sign up' : ''" class="bold" />
                </FormattedString>
            </HTMLLabel>
        </FlexboxLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent'
import { Component } from 'vue-property-decorator'
import { prompt } from 'ui/dialogs'
import { TextField } from 'ui/text-field'
import * as userService from '../services/usersService'


@Component({})
export default class Login extends BaseVueComponent {
    isLoggingIn = true
    user = {
        email: "foo@foo.com",
        password: "foo",
        confirmPassword: "foo"
    }
     mounted() {
        super.mounted();
        this.page.actionBarHidden = true;
    }
    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    submit() {
        if (!this.user.email || !this.user.password) {
            this.alert(
                "Please provide both an email address and password."
            );
            return;
        }
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {
        userService
            .login(this.user)
            .then(() => {
                // import('~/components/Home.vue').then(Home =>
                //     this.$navigateTo(Home.default, {clearHistory: true})
                // )
                console.log('about to go home');
                this.$navigateBack();
            })
            .catch(() => {
                this.alert("Unfortunately we could not find your account.");
            });
    }

    register() {
        if (this.user.password != this.user.confirmPassword) {
            this.alert("Your passwords do not match.");
            return;
        }

        userService
            .register(this.user)
            .then(() => {
                this.alert("Your account was successfully created.");
                this.isLoggingIn = true;
            })
            .catch(() => {
                this.alert(
                    "Unfortunately we were unable to create your account."
                );
            });
    }

    forgotPassword() {
        prompt({
            title: "Forgot Password",
            message:
                "Enter the email address you used to register for APP NAME to reset your password.",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then(data => {
            if (data.result) {
                userService
                    .resetPassword(data.text.trim())
                    .then(() => {
                        this.alert(
                            "Your password was successfully reset. Please check your email for instructions on choosing a new password."
                        );
                    })
                    .catch(() => {
                        this.alert(
                            "Unfortunately, an error occurred resetting your password."
                        );
                    });
            }
        });
    }

    get passwordTF() {
        return (this.$refs.password as any).nativeView as TextField;
    }
    get confirmPasswordTF() {
        return (this.$refs.confirmPassword as any).nativeView as TextField;
    }

    focusPassword() {
        this.passwordTF.focus();
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPasswordTF.focus();
        }
    }

    alert(message) {
        return alert({
            title: "APP NAME",
            okButtonText: "OK",
            message: message
        });
    }
}
</script>

<style scoped>
.flex {
    align-items: center;
    flex-direction: column;
}

.form {
    margin-left: 30;
    margin-right: 30;
    flex-grow: 2;
    vertical-align: middle;
}

.logo {
    margin-bottom: 12;
    height: 90;
    font-weight: bold;
}

.header {
    horizontal-align: center;
    font-size: 25;
    font-weight: 600;
    margin-bottom: 70;
    text-align: center;
    color: #ffffff;
}

.input-field {
    margin-bottom: 25;
}

.input {
    font-size: 18;
    placeholder-color: #a8a8a8;
}

.input-field .input {
    font-size: 54;
}

.btn-primary {
    height: 50;
    margin: 30 5 15 5;
    background-color: #d51a1a;
    border-radius: 5;
    font-size: 20;
    font-weight: 600;
}

.login-label {
    background-color: transparent;
    horizontal-align: center;
    color: #a8a8a8;
    font-size: 16;
}

.sign-up-label {
    margin-bottom: 20;
}

.bold {
    color: #000000;
}
</style>
