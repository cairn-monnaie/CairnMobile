import { TextField } from 'nativescript-material-textfield';
import { Component, Prop } from 'vue-property-decorator';
import { Benificiary, User } from '~/services/authService';
import BasePageComponent from './BasePageComponent';

interface Recipient extends User {
    isBeneficiary?: boolean;
}

@Component({})
export default class UserPicker extends BasePageComponent {
    @Prop() beneficiaries: Benificiary[];

    dataItems: Recipient[] = [];
    constructor() {
        super();
        if (this.beneficiaries) {
            this.beneficiaries.forEach(b => {
                this.dataItems.push({ isBeneficiary: true, ...b.user });
            });
        }
    }
    get menuIcon() {
        return gVars.isIOS ? 'mdi-chevron-left' : 'mdi-arrow-left';
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
    loading = false;
    onBlur(e) {
        this.log('onBlur');
        this.hasFocus = false;
    }
    searchUsers(query: string) {
        this.loading = true;
        const regexp = new RegExp(query, 'i');
        console.log('searchUsers', query, regexp);
        const items = [];
        const addedItemNames = [];
        if (this.beneficiaries) {
            this.beneficiaries.forEach(b => {
                if (regexp.test(b.autocompleteLabel)) {
                    addedItemNames.push(b.user.name);
                    items.push({ isBeneficiary: true, ...b.user });
                }
            });
        }
        this.$authService
            .getUsers()
            .then(r => {
                r.forEach(user => {
                    if (user.id !== this.$authService.userId && regexp.test(user.name) && addedItemNames.indexOf(user.username) === -1) {
                        items.push(user);
                    }
                });
                // return r;
                // return r.reduce((accumulator: User[], currentValue) => {
                //     console.log('test user', query, regexp, currentValue.name, currentValue.username);
                //     if (regexp.test(currentValue.name) && addedItemNames.indexOf(currentValue.username) === -1) {
                //         accumulator.push({
                //             name: currentValue.name,
                //             isBeneficiary: false,
                //             id: currentValue.username
                //         });
                //     }
                //     return accumulator;
                // }, items);
            })
            .catch(err => this.showError(err))
            .then(res => {
                this.loading = false;
                console.log(items);
                this.dataItems = items;
            });
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
                this.searchUsers(query);
            }, 500);
        } else {
            this.dataItems = [];
            if (this.beneficiaries) {
                this.beneficiaries.forEach(b => {
                    this.dataItems.push({ isBeneficiary: true, ...b.user });
                });
            }
        }
        // this.currentSearchText = query;
    }
    chooseRecipient(item: Recipient) {
        this.$modal.close(item);
    }
}
