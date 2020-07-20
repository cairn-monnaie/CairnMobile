import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import SettingLabelIcon from '~/components/SettingLabelIcon';
import { TextField } from 'nativescript-material-textfield';
import { AWebView, EventNames, LoadEventData } from 'nativescript-webview-plus';
import { AndroidApplication, android as androidApp, AndroidActivityBackPressedEventData } from '@nativescript/core/application';
import { mdiFontFamily } from '~/variables';
const amountRegexp = /^\d*([,\.]\d{0,2})?$/;

@Component({
    components: {
        SettingLabelIcon
    }
})
export default class CreditAccount extends PageComponent {
    CREDIT_URL = CREDIT_URL;
    amountError: string = null;
    amount: number;
    ignoreNextTextChange = false;
    oldAmountStr = null;
    canStartTransfer = false;
    showHelloAsso = false;
    mdiFontFamily = mdiFontFamily;

    get amountTF() {
        return this.$refs.amountTF.nativeView as TextField;
    }
    get webView() {
        return this.$refs.webView.nativeView as AWebView;
    }
    onAndroidBackButton(data: AndroidActivityBackPressedEventData) {
        if (this.webView.canGoBack) {
            data.cancel = true;
            this.webView.goBack();
        }
    }
    mounted() {
        super.mounted();
        if (gVars.isAndroid) {
            androidApp.on(AndroidApplication.activityBackPressedEvent, this.onAndroidBackButton);
        }
    }

    destroyed() {
        super.destroyed();
        if (gVars.isAndroid) {
            androidApp.off(AndroidApplication.activityBackPressedEvent, this.onAndroidBackButton);
        }
    }
    checkForm() {
        this.canStartTransfer = this.amount > 0;
    }
    onAmountTFLoaded(e) {
        const textField = e.object as TextField;

        if (gVars.isIOS) {
            textField.nativeTextViewProtected.keyboardType = 8;
        }
        textField.requestFocus();
    }
    setTextFieldValue(value, tf?: TextField) {
        const amountTF = tf || this.amountTF;
        if (amountTF) {
            this.ignoreNextTextChange = true;
            amountTF.text = value;
            amountTF.setSelection(value.length);
        }
    }
    validateAmount({ value, object }, forceSetText = false) {
        if (this.ignoreNextTextChange) {
            this.ignoreNextTextChange = false;
            return;
        }
        if (!value) {
            this.amount = 0;
            return;
        }
        if (!amountRegexp.test(value)) {
            // we need to delay a bit for the cursor position to be correct
            setTimeout(() => this.setTextFieldValue(this.oldAmountStr, object), 0);
            return;
        }
        const realvalue = parseFloat(value.replace(/,/g, '.')) || 0;
        const realvalueStr = (this.oldAmountStr = realvalue + '');
        this.amount = realvalue;
        this.checkForm();
        if (forceSetText) {
            this.setTextFieldValue(realvalueStr, object);
        }
    }
    onUrlLoadStarted(e: LoadEventData) {
        this.log(e.eventName, e.navigationType, e.url);
    }
    onUrlLoadFinished(e: LoadEventData) {
        this.log(e.eventName, e.navigationType, e.url);
        if (e.url === CREDIT_URL) {
            const profile = this.$authService.userProfile;
            console.log('setting fields');
            const isPro = this.$authService.isProUser(profile);
            // const isPro = false;
            (e.object as AWebView).executeJavaScript(
                `
                function setValue(key, value) {
                    document.getElementById(key).value = value;
                    document.getElementById(key).dispatchEvent(new Event('keyup', { 'bubbles': true,
                    'cancelable': true }));
                    document.getElementById(key).dispatchEvent(new Event('input', { 'bubbles': true,
                    'cancelable': true }));
                }
                
                if (${isPro})  {
                    document.getElementById('contributor-pro').dispatchEvent(new Event('click'));
                }
                if (${!isPro}) setValue('lastname', '${profile.name || ''}');
                if (${isPro}) setValue('company', '${profile.name || ''}');
                setValue('donation_free_unique', '${this.amount}');
                setValue('firstName', '${profile.firstname || ''}');
                setValue('address', '${profile.address.street1 || ''}');
                setValue('city', '${profile.address.zipCity.city || ''}');
                setValue('zipcode', '${profile.address.zipCity.zipCode || ''}');
                setValue('email', '${profile.email || ''}');
                // document.getElementsByClassName('container')[0].scrollTop = document.getElementById('birthdate').offsetTop;
                `
            );
        }
    }
    goToHelloAsso() {
        this.amountTF.clearFocus();
        this.showHelloAsso = true;
    }
}
