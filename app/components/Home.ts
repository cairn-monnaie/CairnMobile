import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { Color, NavigatedData } from 'tns-core-modules/ui/frame';
import { ItemEventData } from 'tns-core-modules/ui/list-view';
import { Component } from 'vue-property-decorator';
import { AccountInfo, User } from '~/services/authService';
import AccountHistory from './AccountHistory';
import { ComponentIds } from './App';
import BasePageComponent from './BasePageComponent';
import TransferWindow from './TransferWindow';
import UserPicker from './UserPicker';
import { showSnack } from 'nativescript-material-snackbar';

@Component({})
export default class Home extends BasePageComponent {
    navigateUrl = ComponentIds.Situation;
    amountError: string = null;
    loading = true;
    accounts: ObservableArray<AccountInfo> = new ObservableArray();
    constructor() {
        super();
    }
    mounted() {
        super.mounted();
    }
    showError(err) {
        this.loading = false;
        super.showError(err);
    }

    onNavigatedTo(args: NavigatedData) {
        if (!args.isBackNavigation && this.$authService.isLoggedIn()) {
            this.refresh();
        }
    }
    onItemLoading(args) {
        if (this.$isIOS) {
            const newcolor = new Color(0, 255, 255, 255);
            if (args.ios.backgroundView) {
                args.ios.backgroundView.backgroundColor = newcolor.ios;
            }
        }
    }
    onCardTap(accountInfo: AccountInfo) {
        // console.log("onCardTap", accountInfo)
        this.navigateTo(AccountHistory, {
            props: {
                accountInfo
            }
        });
    }
    onItemTap(args: ItemEventData) {
        const accountInfo = this.accounts.getItem(args.index);
        // console.log("onItemTap", args.index, JSON.stringify(accountInfo))
        this.navigateTo(AccountHistory, {
            props: {
                accountInfo
            }
        });
    }

    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        // console.log('refreshing');
        this.loading = true;
        this.$authService
            .getAccounts()
            .then(r => {
                // console.log('got accounts', r);
                this.accounts = new ObservableArray(r) as any;
                this.loading = false;
            })
            .catch(this.showError);
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
    openTransferWindow() {
        this.navigateTo(TransferWindow, {
            // fullscreen: true
        });
    }
    addBeneficiary() {
        this.$showModal(UserPicker)
            .then((r: User) => {
                if (r) {
                    this.showLoading('working');
                    return this.$authService.addBeneficiary(r.email).then(() => {
                        this.hideLoading();
                        showSnack({
                            message: this.$t('beneficiary_added', r.name)
                        });
                    });
                }
            })
            .catch(err => this.showError(err));
    }
}
