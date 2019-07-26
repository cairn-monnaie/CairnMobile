import { PropertyChangeData } from 'tns-core-modules/data/observable';
import { Component } from 'vue-property-decorator';
import { alert, prompt } from 'nativescript-material-dialogs';
import { AccountInfo, Benificiary, User } from '~/services/authService';
import BasePageComponent from './BasePageComponent';
import UserPicker from './UserPicker';
import { ComponentIds } from './App';
import { TextField } from 'nativescript-material-textfield';
import { showSnack } from 'nativescript-material-snackbar';

@Component({})
export default class TransferWindow extends BasePageComponent {
    navigateUrl = ComponentIds.Transfer;
    reason: string = null;
    description: string = null;
    amountStr: string = null;
    amount: number;
    account: AccountInfo = null;
    recipient: User = null;
    benificiaries: Benificiary[] = [];
    refreshing = false;
    canStartTransfer = false;
    amountError: string = null;
    reasonError: string = null;
    accounts: AccountInfo[] = [];
    checkForm() {
        if (this.reason !== null) {
            this.reasonError = null;
        }
        // if (this.amount <= 0) {
        //     this.amountError = this.$t('amount_required');
        // } else {
        //     this.amountError = null;
        // }
        if (!this.account) {
        }

        this.canStartTransfer = this.amount > 0 && !!this.account && !!this.recipient;
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
            })
        ])
            .then(r => {
                this.refreshing = false;
            })
            .catch(err => this.showError(err));
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
        //     .catch(err => this.showError(err));
    }
    submit() {
        if (!this.reason) {
            this.reasonError = this.$t('reason_required');
            this.showError(this.reasonError);
        }
        this.$authService
            .createTransaction(this.account, this.recipient, this.amount, this.reason, this.description)
            .then(r => {
                return prompt({
                    autoFocus: true,
                    cancelable: false,
                    hintText: this.$t('confirmation_code'),
                    title: this.$t('confirmation'),
                    message: this.$t('confirmation_code_description'),
                    okButtonText: this.$t('confirm'),
                    cancelButtonText: this.$t('cancel')
                }).then(result => {
                    if (result && result.text && result.text.length > 0) {
                        return this.$authService.confirmOperation(r.operation.id, result.text).then(() => {
                            this.close();
                            showSnack({
                                message: this.$t('transaction_done', this.amount, this.recipient)
                            });
                        });
                    } else {
                        this.showError(this.$t('wrong_confirmation_code'));
                    }
                });
            })
            .catch(err => this.showError(err));
    }
    selectAccount() {}
    selectRecipient() {
        this.$showModal(UserPicker, {
            props: {
                beneficiaries: this.benificiaries
            }
        }).then(r => {
            this.log('close', 'TransferRecipientPicker', r);
            if (r) {
                this.recipient = r;
                this.checkForm();
            }
        });
    }
}
