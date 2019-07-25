import { NavigatedData } from 'tns-core-modules/ui/frame';
import { Component } from 'vue-property-decorator';
import { UserProfile } from '~/services/authService';
import { ComponentIds } from './App';
import BasePageComponent from './BasePageComponent';

@Component({})
export default class Profile extends BasePageComponent {
    navigateUrl = ComponentIds.Profile;
    loading = false;
    editable = false;
    canSave = false;
    userProfile: UserProfile = null;

    constructor() {
        super();
        this.userProfile = this.$authService.userProfile;
    }
    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
    }
    switchEditable() {
        this.editable = !this.editable;
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        console.log('refreshing');
        this.loading = true;
        this.$authService
            .getUserProfile()
            .then(r => {
                this.userProfile = r;
            })
            .catch(this.showError)
            .then(r => {
                this.loading = false;
            });
    }
    onNavigatedTo(args: NavigatedData) {
        // if (!args.isBackNavigation) {
        //     this.refresh();
        // }
    }
    // openMain() {
    //     this.$navigateTo(Login, { clearHistory: true })
    // }
    // openIn() {
    // this.navigateTo(HomePage as any)
    // }
    deletePhoneNumber(phone: string) {
        this.log('deletePhoneNumber', phone);
    }
    onTextChange(key: string, value: string) {
        this.log('onTextChange', key, value);
    }
}
