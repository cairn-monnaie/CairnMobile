<template>
    <Page ref="page" class="page" actionBarHidden="true">
        <FlexboxLayout class="flex">
            <StackLayout class="themedBack" width="100%">
                <Label class="logo cairn" text='' />
                <Label class="header" text="Cairn Mobile" />
            </StackLayout>
            <StackLayout class="form">
                <MDCTextField class="input" hint="Nom d'utilisateur" keyboardType="email" autocorrect="false" autocapitalizationType="none" v-model="user.username" returnKeyType="next" @returnPress="focusPassword" @textChange="onInputChange" :error="usernameError" />

                <MDCTextField ref="password" class="input" hint="Mot de passe" secure="true" v-model="user.password" :returnKeyType="isLoggingIn ? 'done' : 'next'" @returnPress="focusConfirmPassword" @textChange="onInputChange" :error="passwordError" />

                <MDCTextField v-show="!isLoggingIn" ref="confirmPassword" class="input" hint="Confirmer le mot de passe" secure="true" v-model="user.confirmPassword" returnKeyType="done" @textChange="onInputChange" :error="passwordError" />

                <MDCButton :text="isLoggingIn ? 'Se connecter' : 'S\'enregistrer'" @tap="submit" :isEnabled="this.canValidate" />
                <Label v-show="isLoggingIn" text="Mot de passe oublié?" class="login-label" @tap="forgotPassword" />
            </StackLayout>

            <HTMLLabel class="login-label sign-up-label" @tap="toggleForm">
                <FormattedString>
                    <Span :text="isLoggingIn ? 'Pas de compte? ' : 'Se connecter'" />
                    <Span :text="isLoggingIn ? 'Créer un compte' : ''" class="bold" />
                </FormattedString>
            </HTMLLabel>
        </FlexboxLayout>
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

@Component({})
export default class Login extends BaseVueComponent {
    isLoggingIn = true
    user = {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }
    usernameError?: string = null
    mailError?: string = null
    passwordError?: string = null
    canValidate = false
    mounted() {
        super.mounted()
        this.page.actionBarHidden = true
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
            this.usernameError = "nom d'utilisateur requis"
            // } else if (!this.validateStringProp(this.user.username)!this.validEmail(this.user.email)) {
            // this.mailError = "Valid email required."
        } else {
            this.usernameError = null
        }

        if (!this.isLoggingIn && this.user.confirmPassword !== this.user.password) {
            this.passwordError = "le mot de passe et sa confirmation ne correspondent pas"
        } else if (!this.validateStringProp(this.user.password)) {
            this.passwordError = "Mot de passe manquant"
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
            .then(() => {
                this.$navigateTo(App, { clearHistory: true })
            })
            .catch(this.showError)
    }

    register() {
        this.$authService
            .register(this.user)
            .then(() => {
                this.alert("Votre compte a éteé créé!")
                this.isLoggingIn = true
            })
            .catch(this.showError)
    }

    forgotPassword() {
        prompt({
            title: "Mot de Passe oublié",
            message: "Entrez votre email",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        }).then(data => {
            if (data.result) {
                this.$authService
                    .resetPassword(data.text.trim())
                    .then(() => {
                        this.alert("Vous devriez recevoir un mail avec les instructions pour réinitialiser votre mot de passe")
                    })
                    .catch(this.showError)
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
    showError(err: Error) {
        return alert({
            title: "Erreur",
            okButtonText: "OK",
            message: err.toString()
        })
    }
    alert(message) {
        return alert({
            // title: "APP NAME",
            okButtonText: "OK",
            message: message
        })
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
    margin-top: 20;
    margin-top: 10;
    font-size: 90;
    color: #fff;
    height: 90;
    width: 90;
}

.header {
    horizontal-align: center;
    font-size: 25;
    font-weight: 600;
    margin-top: 10;
    margin-bottom: 40;
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
