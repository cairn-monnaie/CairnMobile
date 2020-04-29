import { Component, Prop } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import TransferComponent from './TransferComponent';
import { ComponentIds, QRCodeDataEvent, off as appOff, on as appOn } from './App';
import { TextField } from 'nativescript-material-textfield';
import { QrCodeTransferData } from '~/services/AuthService';

@Component({
    components:{
        TransferComponent
    }
})
export default class TransferWindow extends PageComponent {
    @Prop() qrCodeData: QrCodeTransferData;

    navigateUrl = ComponentIds.Transfer;
    onLoaded() {}

    mounted() {
        super.mounted();
        appOn(QRCodeDataEvent, this.onQrCodeDataEvent, this);
        const transferComponent = this.getTransferComponent();
        transferComponent.showLoading = this.showLoading.bind(this);
        transferComponent.hideLoading = this.hideLoading.bind(this);
    }

    destroyed() {
        appOff(QRCodeDataEvent, this.onQrCodeDataEvent, this);
        super.destroyed();
    }

    getTransferComponent() {
        return this.$refs['transferComponent'] as TransferComponent;
    }

    get canStartTransfer() {
        return this.getTransferComponent() && this.getTransferComponent().canStartTransfer;
    }
    get amountError() {
        return this.getTransferComponent() && this.getTransferComponent().amountError;
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
        }else {
            this.getTransferComponent().setTextFieldValue(amount+'', textField);
        }
        if (gVars.isIOS) {
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

