import { openUrl } from '@nativescript/core/utils/utils';
import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import { ComponentIds } from './App';
import { showSnack } from 'nativescript-material-snackbar';
import { share } from '~/utils/share';

@Component({
    components: {}
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
                openUrl(PRIVACY_POLICY_URL);
                break;
            case 'terms':
                openUrl(TERMS_CONDITIONS_URL);
                break;
            case 'support':
                openUrl(SUPPORT_URL);
                break;
            case 'github':
                openUrl(GIT_URL);
                break;
            case 'share':
                share({
                    message: STORE_LINK
                });
                break;
            case 'review':
                openUrl(STORE_REVIEW_LINK);
                break;
        }
    }
}
