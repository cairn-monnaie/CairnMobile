<template>
    <CairnPage @navigatedTo="onLoaded" actionBarHidden :actionBarHeight="logoViewHeight">
        <InteractiveMap />
        <StackLayout verticalAlignment="top">
            <Label
                :height="logoViewHeight"
                :fontFamily="cairnFontFamily"
                :fontSize="logoViewHeight"
                color="white"
                text="cairn-full_logo"
                textAlignment="center"
                verticalTextAlignment="center"
                :backgroundColor="themeColor"
            />
            <Button
                v-show="!showLogin"
                verticalAlignment="top"
                :text="(isLoggingIn ? $t('login') : $t('register')) | capitalize"
                @tap="hideMap"
            />
        </StackLayout>
        <Button
            verticalAlignment="top"
            horizontalAlignment="right"
            rippleColor="white"
            variant="flat"
            class="icon-btn"
            text="mdi-information-outline"
            @tap="showAbout"
        />
        <ScrollView v-show="showLogin" :opacity="showLoginAlpha" class="pageContent">
            <StackLayout>
                <Label
                    :height="logoViewHeight"
                    :fontFamily="cairnFontFamily"
                    :fontSize="logoViewHeight"
                    color="white"
                    text="cairn-full_logo"
                    textAlignment="center"
                    verticalTextAlignment="center"
                    :backgroundColor="themeColor"
                />
                <StackLayout class="form" horizontalAlignment="center">
                    <TextField
                        ref="username"
                        class="input"
                        :hint="$t('username') | capitalize"
                        keyboardType="email"
                        autocorrect="false"
                        autocapitalizationType="none"
                        v-model="user.username"
                        returnKeyType="next"
                        @returnPress="focusPassword"
                        @textChange="onInputChange"
                        :error="usernameError"
                    />

                    <TextField
                        ref="password"
                        class="input"
                        :hint="$t('password') | capitalize"
                        secure="true"
                        v-model="user.password"
                        :returnKeyType="isLoggingIn ? 'done' : 'next'"
                        @returnPress="focusConfirmPassword"
                        @textChange="onInputChange"
                        :error="passwordError"
                    />

                    <TextField
                        v-show="!isLoggingIn"
                        ref="confirmPassword"
                        class="input"
                        :hint="$t('confirm_password') | capitalize"
                        secure="true"
                        v-model="user.confirmPassword"
                        returnKeyType="done"
                        @textChange="onInputChange"
                        @returnPress="submit"
                        :error="passwordError"
                    />

                    <Button
                        v-show="!loading"
                        :text="(isLoggingIn ? $t('login') : $t('register')) | capitalize"
                        @tap="submit"
                        :isEnabled="canLoginOrRegister"
                    />
                    <Button v-show="!loading" :text="$t('cancel') | capitalize" @tap="showMap" />
                    <Label
                        v-show="isLoggingIn"
                        :text="$t('forgot_password') | capitalize"
                        class="login-label"
                        @tap="forgotPassword"
                    />
                </StackLayout>

                <Label visibility="hidden" class="login-label sign-up-label" @tap="toggleForm()">
                    <Span :text="(isLoggingIn ? $t('no_account') : $t('login')) | capitalize" />
                    <Span :text="isLoggingIn ? $t('register') : '' | capitalize" fontWeight="bold" />
                </Label>
            </StackLayout>
        </ScrollView>
    </CairnPage>
</template>

<script lang="ts" src="./Login.ts" />

<style scoped>
.form {
    margin-top: 30;
    margin-left: 30;
    margin-right: 30;
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
