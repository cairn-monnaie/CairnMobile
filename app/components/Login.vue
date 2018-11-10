<template>
    <Page ref="page" class="page" actionBarHidden="true">
        <ScrollView>
            <StackLayout horizontalAlignment="center">
                <StackLayout @tap="animateLogoView" ref="logoView" class="themedBack logoView" :height="logoViewHeight">
                    <!-- <Label class="logo cairn" text='' /> -->
                    <!-- <Label class="header" :text="'app.name' | L" /> -->
                    <!-- <StackLayout backgroundColor="red" width="20" height="20"></StackLayout> -->
                    <Image @tap="animateLogoView" class="logo" src="res://logo" android:margin="20 13 0 13" ios:margin="-40 0 0 0" />
                </StackLayout>
                <StackLayout class="form">
                    <MDCTextField class="input" :hint="'username' | L | titlecase" keyboardType="email" autocorrect="false" autocapitalizationType="none" v-model="user.username" returnKeyType="next" @returnPress="focusPassword" @textChange="onInputChange" :error="usernameError" />

                    <MDCTextField ref="password" class="input" :hint="'password' | L | titlecase" secure="true" v-model="user.password" :returnKeyType="isLoggingIn ? 'done' : 'next'" @returnPress="focusConfirmPassword" @textChange="onInputChange" :error="passwordError" />

                    <MDCTextField v-show="!isLoggingIn" ref="confirmPassword" class="input" :hint="'confirm_password' | L | titlecase" secure="true" v-model="user.confirmPassword" returnKeyType="done" @textChange="onInputChange" :error="passwordError" />

                    <MDCButton :text="isLoggingIn ? 'login' : 'register' | L | titlecase" @tap="submit" :isEnabled="this.canValidate" />
                    <Label v-show="isLoggingIn" :text="'forgot_password' | L | titlecase" class="login-label" @tap="forgotPassword" />
                </StackLayout>

                <HTMLLabel visibility="hidden" class="login-label sign-up-label" @tap="toggleForm">
                    <FormattedString>
                        <Span :text="isLoggingIn ? 'no_account' : 'login' | L | titlecase" />
                        <Span :text="isLoggingIn ? 'register' : '' | L | titlecase" class="bold" />
                    </FormattedString>
                </HTMLLabel>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from "./BaseVueComponent"
import { Component } from "vue-property-decorator"
import { prompt } from "ui/dialogs"
import { TextField } from "ui/text-field"
import Vue from "nativescript-vue"
import App from "./App.vue"
import { PropertyChangeData } from "tns-core-modules/data/observable"
import { localize } from "nativescript-localize"
import * as Animation from "~/animation"
import { screenHeightDips } from "../variables"
import { isIOS, isAndroid } from "tns-core-modules/platform/platform"


const logoViewHeight = isAndroid ? screenHeightDips : screenHeightDips - 20 - 0.3
@Component({})
export default class Login extends BaseVueComponent {
    isLoggingIn = true
    user = {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }
    logoViewHeight = logoViewHeight
    usernameError?: string = null
    mailError?: string = null
    passwordError?: string = null
    canValidate = false
    mounted() {
        super.mounted()
        // this.page.actionBarHidden = true
        setTimeout(this.animateLogoView, 300) //delay for now as the first run is "jumping"
    }
    animateLogoView() {
        const view = this.getRef("logoView")
        new Animation.Animation({ height: logoViewHeight })
            .to({ height: 200 }, 1000)
            .easing(Animation.Easing.Elastic.Out)
            .onUpdate(object => {
                this.logoViewHeight = object.height
                // Object.assign(view.style, object)
            })
            .start()
    }
    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn
    }

    onInputChange(e: PropertyChangeData, value) {
        this.checkForm()
    }
    validateStringProp(p, minLength = 0) {
        return !!p && p.length > minLength
    }
    checkForm() {
        if (!this.validateStringProp(this.user.username)) {
            this.usernameError = this.$ltc("username_required")
            // } else if (!this.validateStringProp(this.user.username)!this.validEmail(this.user.email)) {
            // this.mailError = "Valid email required."
        } else {
            this.usernameError = null
        }

        if (!this.isLoggingIn && this.user.confirmPassword !== this.user.password) {
            this.passwordError = this.$ltc("passwords_dont_match")
        } else if (!this.validateStringProp(this.user.password)) {
            this.passwordError = this.$ltc("password_missing")
        } else {
            this.passwordError = null
        }

        this.canValidate = !this.mailError && !this.passwordError
    }
    validEmail(email) {
        var re = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
        return re.test(email)
    }
    submit() {
        if (this.isLoggingIn) {
            this.login()
        } else {
            this.register()
        }
    }

    login() {
        this.$authService
            .login(this.user)
            // .then(() => {
            //     this.$navigateTo(App, { clearHistory: true })
            // })
            .catch(this.$showError)
    }

    register() {
        this.$authService
            .register(this.user)
            .then(() => {
                this.$alert("Votre compte a éteé créé!")
                this.isLoggingIn = true
            })
            .catch(this.$showError)
    }

    forgotPassword() {
        prompt({
            title: this.$ltc("forgot_password"),
            message: this.$ltc("fill_email"),
            inputType: "email",
            defaultText: "",
            okButtonText: this.$luc("ok"),
            cancelButtonText: this.$luc("cancel")
        }).then(data => {
            if (data.result) {
                this.$authService
                    .resetPassword(data.text.trim())
                    .then(() => {
                        this.$alert(this.$ltc("password_reset_confirmation"))
                    })
                    .catch(this.$showError)
            }
        })
    }

    get passwordTF() {
        return this.getRef("password") as TextField
    }
    get confirmPasswordTF() {
        return this.getRef("confirmPassword") as TextField
    }

    focusPassword() {
        this.passwordTF.focus()
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPasswordTF.focus()
        }
    }
}
</script>

<style scoped>
.form {
    margin-top: 30;
    margin-left: 30;
    margin-right: 30;
    flex-grow: 2;
    vertical-align: center;
}

.logoView {
    width: 100%;
    horizontal-align: center;
    vertical-align: center;
}

.header {
    horizontal-align: center;
    font-size: 25;
    font-weight: 600;
    margin-top: 10;
    text-align: center;
    color: #fff;
}

.input {
    margin-bottom: 25;
    width: 90%;
    /* font-size: 18; */
    placeholder-color: #a8a8a8;
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
