import BasePageComponent from './BasePageComponent';
import { Component, Prop } from 'vue-property-decorator';
import { isAndroid } from 'platform';
import { CustomTransition } from '~/transitions/custom-transition';
import { Color, NavigatedData, topmost } from 'tns-core-modules/ui/frame';
import Login from './Login';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { AccountInfo, Transaction } from '~/services/AuthService';

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
            .getAccountHistory(this.accountInfo.id)
            .then(r => {
                this.dataItems = new ObservableArray(r);
                this.loading = false;
            })
            .catch(this.$showError);
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
