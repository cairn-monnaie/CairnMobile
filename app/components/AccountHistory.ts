import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { NavigatedData } from 'tns-core-modules/ui/frame';
import { Component, Prop } from 'vue-property-decorator';
import { AccountInfo, Transaction } from '~/services/authService';
import BasePageComponent from './BasePageComponent';

@Component({})
export default class AccountHistory extends BasePageComponent {
    dataItems: ObservableArray<Transaction> = new ObservableArray();

    @Prop({  })
    public accountInfo: AccountInfo;

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
        // console.log("refreshing")
        this.loading = true;
        this.$authService
            .getAccountHistory(this.accountInfo)
            .then(r => {
                this.dataItems = new ObservableArray(r);
                this.loading = false;
            })
            .catch(err => this.showError(err));
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
