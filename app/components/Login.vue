<template>
    <Page ref="page" class="page" actionBarHidden @loaded="onLoaded">
        <ScrollView class="pageContent">
            <StackLayout horizontalAlignment="center">
                <StackLayout @tap="animateLogoView" ref="logoView" class="themedBack logoView" :height="logoViewHeight">
                    <Label @tap="animateLogoView" width="100%" textAlignment="center" class="cairn" :text="'cairn-full_logo' | fonticon" color="white" :fontSize="Math.min(logoViewHeight, 200)"/>
                </StackLayout>
                <StackLayout class="form">
                    <MDTextField class="input" :hint="'username' | L | titlecase" keyboardType="email" autocorrect="false" autocapitalizationType="none" v-model="user.username" returnKeyType="next" @returnPress="focusPassword" @textChange="onInputChange" :error="usernameError" />

                    <MDTextField ref="password" class="input" :hint="'password' | L | titlecase" secure="true" v-model="user.password" :returnKeyType="isLoggingIn ? 'done' : 'next'" @returnPress="focusConfirmPassword" @textChange="onInputChange" :error="passwordError" />

                    <MDTextField v-show="!isLoggingIn" ref="confirmPassword" class="input" :hint="'confirm_password' | L | titlecase" secure="true" v-model="user.confirmPassword" returnKeyType="done" @textChange="onInputChange" @returnPress="submit" :error="passwordError" />

                    <MDButton v-show="!loading" :text="isLoggingIn ? 'login' : 'register' | L | titlecase" @tap="submit" :isEnabled="canLoginOrRegister" />
                    <MDActivityIndicator v-show="loading" :busy="loading" width="45" height="45" />
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

<script lang="ts" src="./Login.ts" />

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
