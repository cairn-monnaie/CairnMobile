import { openUrl } from '@nativescript/core/utils/utils';
import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import SettingLabelIcon from '~/components/SettingLabelIcon';
import ThirdPartySoftwareBottomSheet from '~/components/ThirdPartySoftwareBottomSheet';
import { ComponentIds } from './App';
import { share } from '~/utils/share';
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
