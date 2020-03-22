import { NavigatedData } from '@nativescript/core/ui/frame';
import { Component, Prop } from 'vue-property-decorator';
import { UpdateUserProfile, UserProfile, UserProfileEvent, UserProfileEventData } from '~/services/AuthService';
import { ComponentIds } from './App';
import PageComponent from './PageComponent';
import * as imagepicker from 'nativescript-imagepicker';
import * as perms from 'nativescript-perms';
import { confirm, prompt } from 'nativescript-material-dialogs';
import { ImageAsset } from '@nativescript/core/image-asset/image-asset';
import { ImageSource } from '@nativescript/core/image-source/image-source';
import Vue from 'nativescript-vue';
import MapComponent from './MapComponent';
import { CartoMap } from 'nativescript-carto/ui';

@Component({
    components: {
        MapComponent
    }
})
export default class Profile extends PageComponent {
    navigateUrl = ComponentIds.Profile;
    editing = false;
    @Prop({ default: true }) editable;
    // canSave = false;
    @Prop() propUserProfile: UserProfile;
    updateUserProfile: UpdateUserProfile = null;

    image: string | ImageAsset | ImageSource = null;
    get canSave() {
        return !!this.updateUserProfile && Object.keys(this.updateUserProfile).length > 0;
    }

    userProfile: UserProfile = Vue.prototype.$authService.userProfile;

    // get image() {
    //     console.log('get image');
    //     if (!!this.updateUserProfile && !!this.updateUserProfile.image) {
    //         return this.updateUserProfile.image;
    //     }
    //     return this.userProfile.image;
    // }

    constructor() {
        super();
        if (this.propUserProfile) {
            this.userProfile = this.propUserProfile;
        } else {
            this.userProfile = this.$authService.userProfile;
        }
    }
    destroyed() {
        super.destroyed();
        this.$authService.off(UserProfileEvent, this.onProfileUpdate, this);
    }
    mounted() {
        super.mounted();
        this.$authService.on(UserProfileEvent, this.onProfileUpdate, this);
    }
    updateMapCenter() {
        if (this.$refs.mapComp && this.userProfile.address && this.userProfile.address.latitude) {
            const map = this.$refs.mapComp.cartoMap;
            map.setFocusPos(this.userProfile.address, 0);
        }
    }
    onMapReady(e) {
        this.updateMapCenter();
    }
    onProfileUpdate(event: UserProfileEventData) {
        this.loading = false;
        this.userProfile = event.data;
        this.image = this.userProfile.image;
        this.updateMapCenter();
    }
    switchEditing() {
        this.editing = !this.editing;
        if (!this.editing) {
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
                this.editing = false;
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
    onTextChange(value: string, key: string) {
        this.log('onTextChange', key, value);
        this.updateUserProfile = this.updateUserProfile || {};
        this.updateUserProfile[key] = value;
    }

    chooseImage() {
        console.log('chooseImage');

        perms
            .request('storage')
            .then(() =>
                imagepicker
                    .create({
                        mode: 'single' // use "multiple" for multiple selection
                    })
                    .present()
            )
            .then(selection => {
                if (selection.length > 0) {
                    return new Promise((resolve, reject) => {
                        selection[0].getImageAsync((image, error) => {
                            if (error) {
                                reject(error);
                            } else {
                                this.updateUserProfile = this.updateUserProfile || {};
                                this.updateUserProfile.image = this.image = new ImageSource(image);
                            }
                        });
                    });
                }
            })
            .catch(this.showError);
    }
}
