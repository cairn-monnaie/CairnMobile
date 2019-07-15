import BasePageComponent from './BasePageComponent';
import { Component } from 'vue-property-decorator';
import { isAndroid } from 'platform';
import { CustomTransition } from '~/transitions/custom-transition';
import { Color, NavigatedData, topmost } from 'tns-core-modules/ui/frame';
import Login from './Login';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { UserProfile } from '~/services/AuthService';
import { ComponentIds } from './App';

@Component({})
export default class Profile extends BasePageComponent {
    navigateUrl = ComponentIds.Profile;
    loading = false;
    userProfile: UserProfile;

    constructor() {
        super();
        this.userProfile = this.$authService.userPorfile || ({
            image: 'https://moncompte.cairn-monnaie.com/bundles/cairnuser/img/usager.png'
        } as any);
    }
    mounted() {
        super.mounted();
    }

    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        console.log('refreshing');
        this.loading = true;
        this.$authService
            .getUserProfile()
            .then(r => {
                this.userProfile = r;
                this.loading = false;
            })
            .catch(this.$showError);
    }
    onNavigatedTo(args: NavigatedData) {
        if (!args.isBackNavigation) {
            this.refresh();
        }
    }
    // openMain() {
    //     this.$navigateTo(Login, { clearHistory: true })
    // }
    // openIn() {
    // this.navigateTo(HomePage as any)
    // }
}
