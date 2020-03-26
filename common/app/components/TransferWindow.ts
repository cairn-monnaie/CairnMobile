import { PropertyChangeData } from '@nativescript/core/data/observable';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { alert, prompt } from 'nativescript-material-dialogs';
import { AccountInfo, Benificiary, User } from '~/services/AuthService';
import PageComponent from './PageComponent';
import UserPicker from './UserPicker';
import { ComponentIds } from './App';
import { TextField } from 'nativescript-material-textfield';
import { showSnack } from 'nativescript-material-snackbar';
import { sms } from 'nativescript-phone';
import { NoNetworkError } from '~/services/NetworkService';

@Component({})
export default class TransferWindow extends PageComponent {
    @Prop() qrCodeData: { ICC: string; id: number; name: string };

    navigateUrl = ComponentIds.Transfer;
    reason: string = this.$t('default_reason');
    description: string = null;
    amountStr: string = null;
    amount: number;
    account: AccountInfo = null;
    recipient: User = null;
    beneficiaries: Benificiary[] = [];
    refreshing = false;
    canStartTransfer = false;
    amountError: string = null;
    reasonError: string = this.$t('reason_required');
    accounts: AccountInfo[] = [];

    constructor() {
        super();
    }

    @Watch('reason')
    onReasonChanged() {
        this.checkForm();
    }
    checkForm() {
        if (!this.reason || this.reason.length === 0) {
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

        this.beneficiaries = this.$authService.beneficiaries;
        this.accounts = this.$authService.accounts || [];
        if (this.accounts.length > 0) {
            this.account = this.accounts[0];
            this.checkForm();
        }
        if (this.qrCodeData) {
            this.handleQRData(this.qrCodeData);
        }

        console.log('created', this.qrCodeData, this.account, this.recipient);
        this.log('mounted', this.account, this.beneficiaries);
        if (!this.account || !this.beneficiaries) {
            this.refresh();
        }
    }
    onLoaded() {}
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
                this.beneficiaries = r;
                console.log('got benificiaries', r.length, this.recipient);
                if (this.beneficiaries.length === 1 && !this.recipient) {
                    this.recipient = this.beneficiaries[0].user;
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
    sendSMS() {
        sms([CAIRN_SMS_NUMBER], `PAYER ${this.amount} LECAIRN`);
    }
    submit() {
        if (!this.$authService.connected) {
            this.showError(new NoNetworkError());
        }
        this.$securityService
            .validateSecurity(this)
            .then(() => {
                this.showLoading(this.$t('loading'));
                return this.$authService
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
                    });
            })
            .catch(this.showError)
            .finally(this.hideLoading);
    }
    selectAccount() {}
    selectRecipient() {
        this.$showModal(UserPicker, {
            props: {
                beneficiaries: this.beneficiaries
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
    handleQRData({ ICC, name, id }: { ICC: string; id: number; name: string }) {
        if (ICC && name) {
            this.log('handleQRData1', ICC, name);
            const beneficiary = this.beneficiaries && this.beneficiaries.find(b => b.id === id);
            if (beneficiary) {
                this.recipient = beneficiary.user;
            } else {
                this.recipient = { mainICC: ICC, id, name } as any;
            }
            this.log('handleQRData', ICC, name, beneficiary, this.recipient);
            this.checkForm();
        }
    }
    scanQRCode() {
        this.$scanQRCode()
            .then(this.handleQRData)
            .catch(this.showError);
    }
}
