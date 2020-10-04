import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { Color, NavigatedData } from '@nativescript/core';
import { ObservableArray } from '@nativescript/core/data/observable-array';
import { Component } from 'vue-property-decorator';
import { formatAddress } from '../helpers/formatter';
import { AccountInfo, AccountInfoEvent, AccountInfoEventData, User } from '../services/AuthService';
import AccountHistory from './AccountHistory';
import { ComponentIds, off as appOff, on as appOn } from './App';
import CreditAccount from './CreditAccount';
import MapComponent from './MapComponent';
import PageComponent from './PageComponent';
import Profile from './Profile';
import TransferWindow from './TransferWindow';
import UserPicker from './UserPicker';

@Component({
    components: {
        MapComponent
    }
})
export default class Home extends PageComponent {
    navigateUrl = ComponentIds.Situation;
    amountError: string = null;
    accounts: ObservableArray<AccountInfo> = new ObservableArray();
    users: User[] = [];
    constructor() {
        super();
        // this.showMenuIcon = true;
    }

    get isPro() {
        return this.$authService.isProUser();
    }
    mounted() {
        super.mounted();
        // this.$on('navigatedTo', this.onNavigatedTo)
        this.$authService.on(AccountInfoEvent, this.onAccountsData, this);
        appOn('pushMessage', this.refresh);
        // if (this.$securityService.biometricEnabled) {
        //     if (this.$securityService.shouldReAuth()) {
        //         this.$authService.logout();
        //         this.$alert(this.$t('loggedout_due_to_fingerprint_change'));
        //     }
        // }
    }
    destroyed() {
        appOff('pushMessage', this.refresh);
        super.destroyed();
        this.$authService.off(AccountInfoEvent, this.onAccountsData, this);
    }

    onLoaded() {}

    async onNavigatedTo(args: NavigatedData) {
        const loggedInOnStart = this.$authService.isLoggedIn();
        if (!args.isBackNavigation && loggedInOnStart) {
            this.refresh();
        }
        // console.log('onNavigatedTo', loggedInOnStart, new Error().stack);
        if (loggedInOnStart) {
            if (!this.$securityService.passcodeSet()) {
                try {
                    await this.$securityService.createPasscode(this);
                } catch (err) {
                    this.showError(err);
                    this.$authService.logout();
                }
            }
            if (WITH_PUSH_NOTIFICATIONS && !args.isBackNavigation) {
                this.$getAppComponent().registerForPushNotifs();
            }
        }
    }

    formatAddress = formatAddress;
    DEFAULT_IMAGE_URL = 'res://pro';
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
    onItemTap(accountInfo: AccountInfo) {
        // const accountInfo = this.accounts.getItem(args.index);
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
        this.loading = true;
        // setTimeout(() => {
        return Promise.all([
            this.$authService.getAccounts(),
            this.$authService
                .getUsers({
                    limit: 10,
                    sortKey: 'creationDate',
                    sortOrder: 'DESC'
                })
                .then(r => (this.users = r))
        ])
            .catch(this.showError)
            .finally(() => {
                this.loading = false;
            });

        // }, 1000);
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
                // modal: true
            }
            // fullscreen: true
        });
    }
    addBeneficiary() {
        this.$showModal(UserPicker, { fullscreen: true })
            .then((r: User) => {
                console.log('addBeneficiary done');
                if (r) {
                    this.showLoading(this.$t('loading'));
                    return this.$authService.addBeneficiary(r.email).then(() => {
                        this.hideLoading();
                        showSnack({
                            message: this.$t('favorite_added', r.name)
                        });
                    });
                }
            })
            .catch(this.showError);
    }
    async handleQRData(qrCodeData?: { ICC: string; id: number; name: string }) {
        if (qrCodeData) {
            this.log('handleQRData', qrCodeData);
            this.navigateTo(TransferWindow, {
                props: {
                    qrCodeData
                }
            });
        }
    }
    scanQRCode() {
        this.$scanQRCode().catch(this.showError);
    }
    showProfile(item: User) {
        this.navigateTo(Profile, {
            props: {
                propUserProfile: item,
                editable: false
            }
        });
    }
    creditAccount() {
        // this.openLink(CREDIT_URL);

        this.navigateTo(CreditAccount);
        // .then(r => {})
        // .catch(this.showError);
    }
}
