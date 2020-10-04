import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { NavigatedData } from '@nativescript/core/ui';
import { Component } from 'vue-property-decorator';
import { User } from '../services/AuthService';
import PageComponent from './PageComponent';
import Profile from './Profile';
import UserPicker from './UserPicker';

@Component({})
export default class Beneficiaries extends PageComponent {
    dataItems: User[] = [];

    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        this.loading = true;
        this.$authService
            .getBenificiaries()
            .then(r => {
                this.dataItems = r.map(b => b.user);
            })
            .catch(this.showError)
            .finally(() => {
                this.loading = false;
            });
    }
    onNavigatedTo(args: NavigatedData) {
        if (!args.isBackNavigation) {
            this.refresh();
        }
    }
    onNavigatingTo() {
        // if (isAndroid) {
        //     const page = this.page
        //     // page.androidStatusBarBackground = null;
        //     // page.androidStatusBarBackground = new Color(this.darkColor);
        // }
    }
    // openMain() {
    //     this.$navigateTo(Login, { clearHistory: true })
    // }
    // openIn() {
    // this.navigateTo(HomePage as any)
    // }
    addBeneficiary() {
        this.$showModal(UserPicker, { fullscreen: true })
            .then((r: User) => {
                if (r) {
                    this.showLoading(this.$t('loading'));
                    return this.$authService.addBeneficiary(r.email || r.mainICC).then(() => {
                        this.hideLoading();
                        showSnack({
                            message: this.$t('favorite_added', r.name)
                        });
                    });
                }
            })
            .then(() => this.refresh())
            .catch(this.showError);
    }

    onItemTap(userProfile: User) {
        console.log('onItemTap', userProfile);
        if (this.$authService.isProUser(userProfile)) {
            // const accountInfo = this.dataItems[args.index];
            this.navigateTo(Profile, {
                props: {
                    propUserProfile: userProfile,
                    editable: false
                }
            });
        }
    }
}
