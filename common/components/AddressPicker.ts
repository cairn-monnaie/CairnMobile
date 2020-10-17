import { TextField } from '@nativescript-community/ui-material-textfield';
import { Component, Prop } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { Address } from '../services/AuthService';

@Component({})
export default class AddressPicker extends PageComponent {
    dataItems: Address[] = [];
    constructor() {
        super();
        // this.beneficiaries = this.$authService.beneficiaries;
    }
    get menuIcon() {
        return global.isIOS ? 'mdi-chevron-left' : 'mdi-arrow-left';
    }
    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
    }
    onTFLoaded() {
        this.textField.requestFocus();
    }
    close() {
        this.log('close');
        this.$modal.close();
    }

    get textField() {
        return this.getRef('textField') as TextField;
    }
    hasFocus = false;
    onFocus(e) {
        this.log('onFocus');
        this.hasFocus = true;
        // if (this.currentSearchText && this.searchResultsCount === 0) {
        //     this.instantSearch(this.currentSearchText);
        // }
    }
    searchAsTypeTimer;
    onBlur(e) {
        this.log('onBlur');
        this.hasFocus = false;
    }
    async searchAddress(query: string) {
        this.loading = true;
        try {
            const result = await this.$authService.autocompleteAddress(query);
            // const newItems = result.filter(s => s.address && s.importance <= 0.6);
            this.dataItems = result;
            // .then(r => {
            //     // r.forEach(user => {
            //     //     if (user.id !== this.$authService.userId && regexp.test(user.name) && addedItemNames.indexOf(user.name) === -1) {
            //     items.push(...r);
            //     // }
            //     // });
            //     // return r;
            //     // return r.reduce((accumulator: User[], currentValue) => {
            //     //     console.log('test user', query, regexp, currentValue.name, currentValue.username);
            //     //     if (regexp.test(currentValue.name) && addedItemNames.indexOf(currentValue.username) === -1) {
            //     //         accumulator.push({
            //     //             name: currentValue.name,
            //     //             isBeneficiary: false,
            //     //             id: currentValue.username
            //     //         });
            //     //     }
            //     //     return accumulator;
            //     // }, items);
            // })
        } catch (err) {
            this.showError(err);
        } finally {
            this.loading = false;
        }
    }
    onTextChange(e) {
        const query = e.value;
        if (this.searchAsTypeTimer) {
            clearTimeout(this.searchAsTypeTimer);
            this.searchAsTypeTimer = null;
        }
        if (query && query.length > 2) {
            this.searchAsTypeTimer = setTimeout(() => {
                this.searchAsTypeTimer = null;
                this.searchAddress(query);
            }, 1000);
        } else {
            this.dataItems = [];
            // if (this.beneficiaries) {
            //     this.beneficiaries.forEach(b => {
            //         this.dataItems.push({ isBeneficiary: true, ...b.user });
            //     });
            // }
        }
        // this.currentSearchText = query;
    }
    chooseAddress(item: Address) {
        this.$modal.close(item);
    }
}
