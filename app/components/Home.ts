import BasePageComponent from './BasePageComponent';
import { Component } from 'vue-property-decorator';
import { isAndroid } from 'platform';
import { CustomTransition } from '~/transitions/custom-transition';
import { Color, NavigatedData, topmost } from 'tns-core-modules/ui/frame';
import { ItemEventData } from 'tns-core-modules/ui/list-view';
import Login from './Login';
import AccountHistory from './AccountHistory';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { AccountInfo } from '~/services/authService';
import Vue, { NativeScriptVue } from 'nativescript-vue';

@Component({})
export default class Home extends BasePageComponent {
    loading = true;
    accounts: ObservableArray<AccountInfo> = new ObservableArray();
    constructor() {
        super();
    }
    mounted() {
        super.mounted();
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
        console.log('refreshing');
        this.loading = true;
        this.$authService
            .getAccounts()
            .then(r => {
                console.log('got accounts', r);
                this.accounts = new ObservableArray(r) as any;
                this.loading = false;
            })
            .catch(this.$showError);
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
}
