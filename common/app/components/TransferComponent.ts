import BaseVueComponent from './BaseVueComponent';
import { AccountInfo, Benificiary, QrCodeTransferData, User } from '~/services/AuthService';
import { NoNetworkError } from '~/services/NetworkService';
import { formatCurrency } from '~/helpers/formatter';
import { showSnack } from 'nativescript-material-snackbar';
import { sms } from 'nativescript-phone';

import { Component, Prop, Watch } from 'vue-property-decorator';
import { PropertyChangeData } from '@nativescript/core/ui/frame';
import { TextField } from 'nativescript-material-textfield';
import UserPicker from './UserPicker';

import { Vibrate } from 'nativescript-vibrate';

const amountRegexp = /^\d*([,\.]\d{0,2})?$/;

@Component({})
export default class TransferComponent extends BaseVueComponent {
    @Prop() qrCodeData: QrCodeTransferData;

    reason: string = this.$t('default_reason');
    description: string = null;
    amount: number;
    account: AccountInfo = null;
    accounts: AccountInfo[] = [];
    recipient: User = null;
    beneficiaries: Benificiary[] = [];
    refreshing = false;
    canStartTransfer = false;
    amountError: string = null;
    reasonError: string = this.$t('reason_required');
    oldAmountStr = null;
    // loading = false;

    // public height = '100%';
    public constructor() {
        super();
    }

    get canSendSMS() {
        return this.canStartTransfer && this.recipient.smsIds && this.recipient.smsIds.length > 0;
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
        // appOff(QRCodeDataEvent, this.onQrCodeDataEvent, this);
        super.destroyed();
    }
    onQrCodeDataEvent(e) {
        this.handleQRData(e.data);
    }
    mounted() {
        super.mounted();
        // appOn(QRCodeDataEvent, this.onQrCodeDataEvent, this);
        this.beneficiaries = this.$authService.beneficiaries;
        this.accounts = this.$authService.accounts || [];
    }
    onLoaded() {
        // cant do this on mounted because subclass would class because inheritance does not seem to be up
        if (this.accounts.length > 0) {
            this.account = this.accounts[0];
            this.checkForm();
        }
        if (this.qrCodeData) {
            this.handleQRData(this.qrCodeData);
        }

        // console.log('created', this.qrCodeData, this.account, this.recipient);
        // this.log('mounted', this.account, this.beneficiaries);
        if (!this.account || !this.beneficiaries) {
            this.refresh();
        }
    }
    chooseAccount() {}

    amountTF: TextField;
    ignoreNextTextChange = false;
    setTextField(tf: TextField) {
        this.amountTF = tf;
    }
    setTextFieldValue(value, tf?: TextField) {
        const amountTF = tf || this.amountTF;
        // console.log('setTextFieldValue', value, amountTF);
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
            // this.setTextFieldValue(realvalueStr);
        }
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
    async sendSMS() {
        const response: any = await sms([CAIRN_SMS_NUMBER], `PAYER ${this.amount} ${this.recipient.smsIds[0].identifier}`);
        if (response === 'success') {
            this.close();
            this.$authService.getAccounts();
            this.showTransactionDone(this.amount, this.recipient);
        }
    }

    get accountBalanceText() {
        if (this.account) {
            return `<font color=${this.accentColor}>${formatCurrency(this.account.balance, true)}<font face="${
                this.cairnFontFamily
            }">cairn-currency</font></font>`;
        }
    }
    async submit() {
        if (!this.canStartTransfer) {
            return;
        }
        if (!this.$authService.connected) {
            return this.showError(new NoNetworkError());
        }
        try {
            const canSubmit = await this.$securityService.validateSecurity(this, { allowClose: true });
            if (!canSubmit) {
                throw new Error(this.$t('wrong_security'));
            }
            this.showLoading(this.$t('loading'));
            const r = await this.$authService.createTransaction(
                this.account,
                this.recipient,
                this.amount,
                this.reason,
                this.description
            );
            // createTransaction returns a response with 3 fields :
            // * confirmation_url
            // * operation object
            // * secure_validation, which value is either false if no threshold has been reached (amount, number of daily payments), or true otherwise. If a threshold is reached, validation with PIN code is required
            let code;
            // if (r.secure_validation) {
            //     // let isValidSecurity = false;
            //     // let nbTries = 0;
            //     // while (!isValidSecurity) {
            //     //     nbTries++;
            //     //     if (nbTries > 3) {
            //     //         throw new Error(this.$t('too_many_attemps'));
            //     //     } else {
            //     const resultPConfirm = await prompt({
            //         // title: localize('stop_session'),
            //         message: this.$tc('enter_confirmation_code_sms'),
            //         okButtonText: this.$tc('confirm'),
            //         cancelButtonText: this.$tc('cancel'),
            //         textFieldProperties: {
            //             keyboardType: 'number'
            //         }
            //     });
            //     if (resultPConfirm && resultPConfirm.text && resultPConfirm.text.length > 0) {
            //         code = resultPConfirm.text;
            //     }
            //     // }
            //     // }
            // }
            await this.$authService.confirmOperation(r.operation.id, code);
            this.hideLoading();
            this.close();
            this.showTransactionDone(this.amount, this.recipient);
            new Vibrate().vibrate(500);
        } catch (err) {
            this.showError(err);
        } finally {
            this.hideLoading();
        }
    }
    showTransactionDone(amount, recipient) {
        showSnack({
            message: this.$t('transaction_done', amount, recipient)
        });
    }
    close() {
        this.$emit('close');
    }
    selectAccount() {}
    selectRecipient() {
        this.$showModal(UserPicker, {
            props: {
                beneficiaries: this.beneficiaries
            },
            fullscreen: true
        }).then(r => {
            if (r) {
                this.recipient = r;
                this.checkForm();
            }
        });
    }
    handleQRData({ ICC, name, id, amount }: QrCodeTransferData) {
        if (amount) {
            this.validateAmount({ value: amount, object:this.amountTF }, true);
        }
        if (ICC && name) {
            // this.log('handleQRData1', ICC, name);
            const beneficiary = this.beneficiaries && this.beneficiaries.find(b => b.id === id);
            if (beneficiary) {
                this.recipient = beneficiary.user;
            } else {
                this.recipient = { mainICC: ICC, id, name } as any;
            }
            // this.log('handleQRData', ICC, name, beneficiary, this.recipient);
            this.checkForm();
        }
    }
    scanQRCode() {
        this.$scanQRCode().catch(this.showError);
    }
}
