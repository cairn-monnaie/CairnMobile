import { NavigatedData } from '@nativescript/core';
import { ObservableArray } from '@nativescript/core/data/observable-array';
import { Component, Prop } from 'vue-property-decorator';
import { AccountInfo, Transaction } from '../services/AuthService';
import PageComponent from './PageComponent';

@Component({})
export default class AccountHistory extends PageComponent {
    dataItems: ObservableArray<Transaction> = new ObservableArray();

    @Prop({})
    public accountInfo: AccountInfo;

    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
        this.dataItems.splice(0, this.dataItems.length, ...(this.$authService.accountHistory[this.accountInfo.id] || []));
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        this.loading = true;
        this.$authService
            .getAccountHistory({
                accountId: this.accountInfo.id,
                limit: 100,
                sortOrder: 'DESC',
                sortKey: 'submissionDate',
            })
            .then((r) => {
                // console.log('getAccountHistory', r);
                this.dataItems.splice(0, this.dataItems.length, ...r);
            })
            .catch(this.showError)
            .finally(() => {
                this.loading = false;
            });
    }
    onLoaded(args: NavigatedData) {
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
}
