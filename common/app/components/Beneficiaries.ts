import { ObservableArray } from '@nativescript/core/data/observable-array/observable-array';
import { NavigatedData } from '@nativescript/core/ui/frame';
import { Component, Prop } from 'vue-property-decorator';
import { AccountInfo, Benificiary, Transaction, User } from '~/services/AuthService';
import PageComponent from './PageComponent';
import UserPicker from './UserPicker';
import { showSnack } from 'nativescript-material-snackbar';
import { ItemEventData } from '@nativescript/core/ui/list-view/list-view';
import Profile from './Profile';

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
        console.log('refreshing');
        this.loading = true;
        this.$authService
            .getBenificiaries()
            .then(r => {
                this.dataItems = r.map(b => b.user);
            })
            .catch(this.showError).finally(()=>{
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
                console.log('addBeneficiary done');
                if (r) {
                    this.showLoading(this.$t('loading'));
                    return this.$authService.addBeneficiary(r.email).then(() => {
                        this.hideLoading();
                        showSnack({
                            message: this.$t('beneficiary_added', r.name)
                        });
                    });
                }
            })
            .then(() => this.refresh())
            .catch(this.showError);
    }

    onItemTap(userProfile: User) {
        // const accountInfo = this.dataItems[args.index];
        this.navigateTo(Profile, {
            props: {
                propUserProfile: userProfile,
                editable: false
            }
        });
    }
}
