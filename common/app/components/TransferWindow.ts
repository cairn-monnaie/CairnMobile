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

        // console.log('created', this.qrCodeData, this.account, this.recipient);
        // this.log('mounted', this.account, this.beneficiaries);
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

    amountRegexp = /^\d*(,\d{0,2})?$/;
    validateAmount(e) {
        if (!e.value) {
            this.amount = 0;
            return;
        }
        if (!this.amountRegexp.test(e.value)) {
            setTimeout(() => {
                (this.$refs.amountTF.nativeView as TextField).text = this.oldAmountStr;
            }, 0);
            return;
        }
        const value = parseFloat(e.value.replace(/,/g, '.')) || 0;
        this.oldAmountStr = e.value;
        this.amount = value;
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
        sms([CAIRN_SMS_NUMBER], `PAYER ${this.amount} ${this.recipient.smsIds[0].identifier}`).then((response: any) => {
            console.log('on sms response', response);
            if (response === 'success') {
                this.close();
                this.$authService.getAccounts();
                showSnack({
                    message: this.$t('transaction_done', this.amount, this.recipient),
                });
            }
        });
    }

    get accountBalanceText() {
        if (this.account) {
            return `<font color=${this.accentColor}>${formatCurrency(this.account.balance, true)}<font face="${this.cairnFontFamily}">cairn-currency</font></font>`;
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
            const r = await this.$authService.createTransaction(this.account, this.recipient, this.amount, this.reason, this.description);
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
            //     // isValidSecurity = await this.$securityService.validateSecurity(this);
            //     // }
            //     // }
            // }
            await this.$authService.confirmOperation(r.operation.id, code);
            this.hideLoading();
            this.close();
            showSnack({
                message: this.$t('transaction_done', this.amount, this.recipient)
            });
        } catch (err) {
            this.showError(err);
        } finally {
            this.hideLoading();
        }
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
