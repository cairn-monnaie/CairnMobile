import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';
import { showSnack } from 'nativescript-material-snackbar';
import { AndroidActivityBackPressedEventData, AndroidApplication, android as androidApp } from '@nativescript/core/application';

@Component
export default class BarCodeBottomSheet extends BaseVueComponent {
    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }
    onShownInBottomSheet() {
        console.log('onShownInBottomSheet');
        setTimeout(() => {
            this.$refs.cameraView.nativeView.resumeScanning();
        }, 10);
    }
    onScanResult(evt) {
        console.log(`onScanResult: ${evt.text} (${evt.format})`);
        this.$closeBottomSheet(evt.text);
        // const splitedString = evt.text.split('#');
        // if (splitedString.length === 3 && /[0-9]{9}/.test(splitedString[0]) && /[0-9]{9}/.test(splitedString[1])) {
        //     this.$closeBottomSheet({
        //         ICC: splitedString[0],
        //         id: parseInt(splitedString[1], 10),
        //         name: splitedString[2]
        //     });
        // } else {
        //     if (gVars.isIOS) {
        //         showSnack({
        //             view: this.$refs.cameraView.nativeView,
        //             message: this.$t('wrong_scancode')
        //         });
        //     } else {
        //         // on android the snack would not show over the camera
        //         android.widget.Toast.makeText(androidApp.context, this.$t('wrong_scancode'), android.widget.Toast.LENGTH_SHORT).show();
        //     }
        // }
    }
    toggleTorch() {
        this.$refs.cameraView.nativeView.torchOn = !this.$refs.cameraView.nativeView.torchOn;
    }
}
