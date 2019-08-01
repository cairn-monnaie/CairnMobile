import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { NavigatedData } from 'tns-core-modules/ui/frame';
import { Component, Prop } from 'vue-property-decorator';
import { AccountInfo, Benificiary, Transaction, User } from '~/services/AuthService';
import PageComponent from './PageComponent';

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
                this.loading = false;
            })
            .catch(err => this.showError(err));
    }
    onLoaded(args: NavigatedData) {
        this.refresh();
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
