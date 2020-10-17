import { TextField } from '@nativescript-community/ui-material-textfield';
import { Component, Prop } from 'vue-property-decorator';
import { QrCodeTransferData } from '../services/AuthService';
import { ComponentIds, off as appOff, on as appOn, QRCodeDataEvent } from './App';
import PageComponent from './PageComponent';
import TransferComponent from './TransferComponent';

@Component({
    components: {
        TransferComponent
    }
})
export default class TransferWindow extends PageComponent {
    @Prop() qrCodeData: QrCodeTransferData;
    amountError: string = null;
    navigateUrl = ComponentIds.Transfer;
    onLoaded() {}

    mounted() {
        super.mounted();
        appOn(QRCodeDataEvent, this.onQrCodeDataEvent, this);
        const transferComponent = this.getTransferComponent();
        transferComponent.showLoading = this.showLoading.bind(this);
        transferComponent.hideLoading = this.hideLoading.bind(this);
        // this.amountError = transferComponent.amountError;
    }

    destroyed() {
        appOff(QRCodeDataEvent, this.onQrCodeDataEvent, this);
        super.destroyed();
    }

    getTransferComponent() {
        return this.$refs['transferComponent'] as TransferComponent;
    }
    submit() {
        this.getTransferComponent().submit();
    }

    onAmountTFLoaded(e) {
        const textField = e.object as TextField;
        const amount = this.getTransferComponent().amount;
        this.getTransferComponent().setTextField(textField);
        // console.log('onAmountTFLoaded', amount, !!textField);
        if (amount === undefined || amount === null) {
            textField.requestFocus();
        } else {
            this.getTransferComponent().setTextFieldValue(amount + '', textField);
        }
        if (global.isIOS) {
            textField.nativeTextViewProtected.keyboardType = 8;
        }
    }
    validateAmount(e) {
        this.getTransferComponent().validateAmount(e);
    }
    onQrCodeDataEvent(e) {
        this.getTransferComponent().onQrCodeDataEvent(e);
    }
}
