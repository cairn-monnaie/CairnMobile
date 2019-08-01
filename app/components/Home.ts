import AccountHistory from './AccountHistory';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { ItemEventData } from 'tns-core-modules/ui/list-view';
import { Component } from 'vue-property-decorator';
import { AccountInfo, AccountInfoEvent, AccountInfoEventData, User } from '~/services/AuthService';
import { Color, NavigatedData } from 'tns-core-modules/ui/frame';
import { ComponentIds } from './App';
import PageComponent from './PageComponent';
import TransferWindow from './TransferWindow';
import UserPicker from './UserPicker';
import { showSnack } from 'nativescript-material-snackbar';

@Component({})
export default class Home extends PageComponent {
    navigateUrl = ComponentIds.Situation;
    amountError: string = null;
    accounts: ObservableArray<AccountInfo> = new ObservableArray();
    constructor() {
        super();
        // this.showMenuIcon = true;
    }
    mounted() {
        super.mounted();
        // this.$on('navigatedTo', this.onNavigatedTo)
        this.$authService.on(AccountInfoEvent, this.onAccountsData, this);
    }
    destroyed() {
        super.destroyed();
        this.$authService.off(AccountInfoEvent, this.onAccountsData, this);
    }

    onNavigatedTo(args: NavigatedData) {
        if (!args.isBackNavigation && this.$authService.isLoggedIn()) {
            this.refresh();
        }
    }
    onItemLoading(args) {
        if (this.$isIOS) {
            if (args.ios.backgroundView) {
                const newcolor = new Color(0, 255, 255, 255);
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

    onAccountsData(e: AccountInfoEventData) {
        this.accounts = new ObservableArray(e.data) as any;
        this.loading = false;
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        // console.log('refreshing');
        this.loading = true;
        setTimeout(() => {
            this.$authService.getAccounts().catch(err => this.showError(err));
        }, 1000);
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
            props: {
                modal: true
            }
            // fullscreen: true
        });
    }
    addBeneficiary() {
        this.$showModal(UserPicker, { fullscreen: true })
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
