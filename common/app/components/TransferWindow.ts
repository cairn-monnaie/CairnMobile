import { PropertyChangeData } from '@nativescript/core/data/observable';
import { Component, Watch } from 'vue-property-decorator';
import { alert, prompt } from 'nativescript-material-dialogs';
import { AccountInfo, Benificiary, User } from '~/services/AuthService';
import PageComponent from './PageComponent';
import UserPicker from './UserPicker';
import { ComponentIds } from './App';
import { TextField } from 'nativescript-material-textfield';
import { showSnack } from 'nativescript-material-snackbar';
import { BarcodeScanner } from 'nativescript-barcodescanner';
import { isSimulator } from 'nativescript-extendedinfo';
import { NoNetworkError } from '~/services/NetworkService';

@Component({})
export default class TransferWindow extends PageComponent {
    navigateUrl = ComponentIds.Transfer;
    reason: string = this.$t('default_reason');
    description: string = null;
    amountStr: string = null;
    amount: number;
    account: AccountInfo = null;
    recipient: User = null;
    benificiaries: Benificiary[] = [];
    refreshing = false;
    canStartTransfer = false;
    amountError: string = null;
    reasonError: string = this.$t('reason_required');
    accounts: AccountInfo[] = [];

    @Watch('reason')
    onReasonChanged() {
        this.checkForm();
    }
    checkForm() {
        console.log('checkForm', this.reason);
        if (!this.reason ||  this.reason.length === 0) {
            this.reasonError = this.$t('reason_required');
        } else {
            this.reasonError = null;
            // this.showError(this.reasonError);
        }
        // if (this.amount <= 0) {
        //     this.amountError = this.$t('amount_required');
        // } else {
        //     this.amountError = null;
        // }
        // if (!this.account) {
        // }
        console.log('checkForm', this.amount, !!this.account, !!this.recipient);
        this.canStartTransfer = this.amount > 0 && !!this.account && !!this.recipient && !this.reasonError;
    }
    onInputChange(e: PropertyChangeData, value) {
        this.checkForm();
    }
    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
    }
    onLoaded() {
        this.refresh();
    }
    chooseAccount() {}
    onAmountTFLoaded(e) {
        const textField = e.object as TextField;
        textField.requestFocus();
        if (gVars.isIOS) {
            textField.nativeTextViewProtected.keyboardType = 8;
        }
    }
    oldAmountStr = null;
    validateAmount(e) {
        if (!e.value) {
            this.amountStr = null;
            this.amount = 0;
            return;
        }
        const value = parseFloat(e.value);
        if (value + '' !== this.amountStr) {
            setTimeout(() => {
                this.amountStr = value + '';
            }, 0);
            this.amount = value;
        } else if (isNaN(value)) {
            setTimeout(() => {
                this.amountStr = this.oldAmountStr;
            }, 0);
        } else {
            this.amount = value;
            this.oldAmountStr = this.amountStr;
            this.amountStr = e.value;
        }
        this.log('validateAmount', e.value, this.amount, this.amountStr, value);
        this.checkForm();
    }
    refresh() {
        this.refreshing = true;
        return Promise.all([
            this.$authService.getAccounts().then(r => {
                // console.log('got accounts', r);
                this.accounts = r;
                if (r.length === 1) {
                    this.account = r[0];
                    this.checkForm();
                }
            }),
            this.$authService.getBenificiaries().then(r => {
                // console.log('got benificiaries', r);
                this.benificiaries = r;
                if (this.benificiaries.length === 1) {
                    this.recipient = this.benificiaries[0].user;
                }
            })
        ])
            .then(r => {
                this.refreshing = false;
            })
            .catch(this.showError);
        // this.$authService
        //     .getAccounts()
        //     .then(r => {
        //         console.log('got accounts', r);
        //         this.accounts = r;
        //         if (r.length === 1) {
        //             this.account = r[0];
        //         }
        //         this.refreshing = false;
        //     })
        //     .catch(this.showError);
    }
    submit() {
        if (!this.$authService.connected) {
            this.showError(new NoNetworkError());
        }
        this.$securityService.validateSecurity(this).then(() => {
            this.$authService
                .createTransaction(this.account, this.recipient, this.amount, this.reason, this.description)
                .then(
                    r => this.$authService.confirmOperation(r.operation.id)
                    // if (this.$securityService.enabled) {
                    //     this.$securityService.verifyFingerprint();
                    // } else {
                    //     prompt({
                    //         autoFocus: true,
                    //         cancelable: false,
                    //         hintText: this.$t('confirmation_code'),
                    //         title: this.$t('confirmation'),
                    //         message: this.$t('confirmation_code_description'),
                    //         okButtonText: this.$t('confirm'),
                    //         cancelButtonText: this.$t('cancel')
                    //     }).then(result => {
                    //         if (result && result.text && result.text.length > 0) {
                    // return this.$authService.confirmOperation(r.operation.id);
                    //         } else {
                    //             return Promise.reject(this.$t('wrong_confirmation_code'));
                    //         }
                    //     });
                    // }
                )
                .then(() => {
                    this.close();
                    showSnack({
                        message: this.$t('transaction_done', this.amount, this.recipient)
                    });
                })
                .catch(this.showError);
        });
    }
    selectAccount() {}
    selectRecipient() {
        this.$showModal(UserPicker, {
            props: {
                beneficiaries: this.benificiaries
            },
            fullscreen: true
        }).then(r => {
            this.log('close', 'TransferRecipientPicker', r);
            if (r) {
                this.recipient = r;
                this.checkForm();
            }
        });
    }
    handleQRCode(text: string) {
        this.log('handleQRCode', text);

        const splitedString = text.split('#');
        if (splitedString.length === 2 && /[0-9]{9}/.test(splitedString[0])) {
            const beneficiary = this.benificiaries.find(b => b.ICC === splitedString[0]);
            if (beneficiary) {
                this.recipient = beneficiary.user;
                this.checkForm();
            }
        } else {
            this.showError(new Error(this.$t('wrong_scancode')));
        }
    }
    scanQRCode() {
        if (isSimulator) {
            return this.handleQRCode('622593501#La Bonne Pioche');
        }
        new BarcodeScanner()
            .scan({
                formats: 'QR_CODE, EAN_13',
                cancelLabel: this.$t('close'), // iOS only, default 'Close'
                message: '', // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                showFlipCameraButton: true, // default false
                preferFrontCamera: false, // default false
                showTorchButton: true, // default false
                beepOnScan: true, // Play or Suppress beep on scan (default true)
                fullScreen: true, // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
                torchOn: false, // launch with the flashlight on (default false)
                closeCallback: () => {
                    console.log('Scanner closed');
                }, // invoked when the scanner was closed (success or abort)
                resultDisplayDuration: 0, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
                presentInRootViewController: true // iOS-only; If you're sure you're not presenting the (non embedded) scanner in a modal, or are experiencing issues with fi. the navigationbar, set this to 'true' and see if it works better for your app (default false).
            })
            .then(result => this.handleQRCode(result.text))
            .catch(this.showError);
    }
}
