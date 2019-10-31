import { NavigatedData } from '@nativescript/core/ui/frame';
import { Component } from 'vue-property-decorator';
import { UpdateUserProfile, UserProfile, UserProfileEvent, UserProfileEventData } from '~/services/AuthService';
import { ComponentIds } from './App';
import PageComponent from './PageComponent';
import * as imagepicker from 'nativescript-imagepicker';
import * as perms from 'nativescript-perms';
import { confirm, prompt } from 'nativescript-material-dialogs';

@Component({})
export default class Profile extends PageComponent {
    navigateUrl = ComponentIds.Profile;
    editable = false;
    // canSave = false;
    userProfile: UserProfile = null;
    updateUserProfile: UpdateUserProfile = null;

    image: string = null;
    get canSave() {
        return !!this.updateUserProfile && Object.keys(this.updateUserProfile).length > 0;
    }

    // get image() {
    //     console.log('get image');
    //     if (!!this.updateUserProfile && !!this.updateUserProfile.image) {
    //         return this.updateUserProfile.image;
    //     }
    //     return this.userProfile.image;
    // }

    constructor() {
        super();
        this.userProfile = this.$authService.userProfile;
    }
    destroyed() {
        super.destroyed();
        this.$authService.off(UserProfileEvent, this.onProfileUpdate, this);
    }
    mounted() {
        super.mounted();
        this.$authService.on(UserProfileEvent, this.onProfileUpdate, this);
    }
    onProfileUpdate(event: UserProfileEventData) {
        this.loading = false;
        this.userProfile = event.data;
        this.image = this.userProfile.image;
    }
    switchEditable() {
        this.editable = !this.editable;
        if (!this.editable) {
            this.updateUserProfile = null;
        }
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        console.log('refreshing');
        this.loading = true;
        this.$authService.getUserProfile().catch(this.showError);
    }
    saveProfile() {
        this.loading = true;
        this.$authService
            .updateUserProfile(this.updateUserProfile)
            .then(result => {
                this.editable = false;
                this.loading = false;
                this.updateUserProfile = null;
            })
            .catch(this.showError);
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
    deletePhoneNumber(phoneNumber: string) {
        this.log('deletePhoneNumber', phoneNumber);
        confirm({
            // title: localize('stop_session'),
            message: this.$tc('delete_phone', phoneNumber),
            okButtonText: this.$tc('delete'),
            cancelButtonText: this.$tc('cancel')
        })
            .then(r => {
                if (r) {
                    this.loading = true;
                    return this.$authService.deletePhone(phoneNumber);
                }
            })
            .catch(this.showError);
    }
    addPhoneNumber() {
        prompt({
            // title: localize('stop_session'),
            message: this.$tc('add_phone'),
            okButtonText: this.$tc('add'),
            cancelButtonText: this.$tc('cancel'),
            textFieldProperties: {
                keyboardType: 'number'
            }
        })
            .then(r => {
                if (r && r.text && r.text.length > 0) {
                    this.loading = true;
                    return this.$authService.addPhone(r.text);
                }
            })
            .catch(this.showError);
    }
    onTextChange(key: string, value: string) {
        this.log('onTextChange', key, value);
        this.updateUserProfile = this.updateUserProfile || {};
        this.updateUserProfile[key] = value;
    }

    chooseImage() {
        console.log('chooseImage');
        const context = imagepicker.create({
            mode: 'single' // use "multiple" for multiple selection
        });
        perms
            .request('storage')
            .then(() => context.present())
            .then(selection => {
                if (selection.length > 0) {
                    this.updateUserProfile = this.updateUserProfile || {};
                    this.updateUserProfile.image = selection[0];
                    this.image = selection[0].android || selection[0].ios;
                    console.log('got image', selection[0]);
                }
            })
            .catch(this.showError);
    }
}
