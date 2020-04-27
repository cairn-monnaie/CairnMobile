import { openUrl } from '@nativescript/core/utils/utils';
import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import SettingLabelIcon from '~/components/SettingLabelIcon';
import ThirdPartySoftwareBottomSheet from '~/components/ThirdPartySoftwareBottomSheet';
import { ComponentIds } from './App';
import { share } from '~/utils/share';
import InAppBrowser from 'nativescript-inappbrowser';
import { primaryColor } from '~/variables';

@Component({
    components: {
        SettingLabelIcon
    }
})
export default class About extends PageComponent {
    navigateUrl = ComponentIds.About;
    mounted() {
        super.mounted();
    }

    destroyed() {
        super.destroyed();
    }

    get appVersion() {
        return this.$getAppComponent().appVersion;
    }

    showThirdPartySoftwares() {}
    async openLink(url: string) {
        try {
            const available = await InAppBrowser.isAvailable();
            if (available) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: primaryColor,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    // modalPresentationStyle: 'fullScreen',
                    // modalTransitionStyle: 'partialCurl',
                    // modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: primaryColor,
                    secondaryToolbarColor: 'white',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    // animations: {
                    //     startEnter: 'slide_in_right',
                    //     startExit: 'slide_out_left',
                    //     endEnter: 'slide_in_left',
                    //     endExit: 'slide_out_right'
                    // },
                    // headers: {
                    //     'my-custom-header': 'my custom header value'
                    // }
                });
                // alert({
                //     title: 'Response',
                //     message: JSON.stringify(result),
                //     okButtonText: 'Ok'
                // });
            } else {
                openUrl(url);
            }
        } catch (error) {
            alert({
                title: 'Error',
                message: error.message,
                okButtonText: 'Ok'
            });
        }
    }
    onTap(command: string) {
        switch (command) {
            case 'privacy':
                this.openLink(PRIVACY_POLICY_URL);
                break;
            case 'terms':
                this.openLink(TERMS_CONDITIONS_URL);
                break;
            case 'support':
                this.openLink(SUPPORT_URL);
                break;
            case 'github':
                this.openLink(GIT_URL);
                break;
            case 'share':
                share({
                    message: STORE_LINK
                });
                break;
            case 'review':
                openUrl(STORE_REVIEW_LINK);
                break;
            case 'third_party':
                this.$showBottomSheet(ThirdPartySoftwareBottomSheet, {
                    ignoreTopSafeArea: true,
                    trackingScrollView: 'trackingScrollView'
                });
                break;
        }
    }
}
