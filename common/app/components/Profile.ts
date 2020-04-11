import { NavigatedData } from '@nativescript/core/ui/frame';
import { Component, Prop } from 'vue-property-decorator';
import { Address, NominatimResult, PhoneNumber, UpdateUserProfile, UserProfile, UserProfileEvent, UserProfileEventData } from '~/services/AuthService';
import { ComponentIds } from './App';
import PageComponent from './PageComponent';
import * as imagepicker from 'nativescript-imagepicker';
import * as perms from 'nativescript-perms';
import { confirm, prompt } from 'nativescript-material-dialogs';
import { ImageAsset } from '@nativescript/core/image-asset/image-asset';
import { ImageSource } from '@nativescript/core/image-source/image-source';
import Vue from 'nativescript-vue';
import MapComponent from './MapComponent';
import InteractiveMap from './InteractiveMap';
import AddressPicker from './AddressPicker';
import { CartoMap } from 'nativescript-carto/ui';
import BitmapFactory from 'nativescript-bitmap-factory';
import { generateBarCode } from 'nativescript-barcodeview';
import { showSnack } from 'nativescript-material-snackbar';

@Component({
    components: {
        InteractiveMap,
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

    get isPro() {
        return !!this.userProfile && this.$authService.isProUser(this.userProfile);
    }

    userProfile: UserProfile = null;
    myProfile = false;
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
            this.myProfile = true;
        }
        this.image = this.userProfile.image;
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
        if (this.$refs.mapComp && this.userProfile.address && this.userProfile.address.latitude) {
            this.$refs.mapComp.addGeoJSONPoints([this.userProfile]);
        }
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
        } else if (this.showingQRCode) {
            this.toggleQRCode();
        }
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        if (!this.myProfile) {
            return;
        }
        this.loading = true;
        this.$authService.getUserProfile(this.userProfile.id).catch(this.showError);
    }
    async saveProfile() {
        this.loading = true;
        try {
            // if (this.updateUserProfile.address && this.updateUserProfile.address.zipCity) {
            //     const zipCities = await this.$authService.getZipCities(Object.assign(this.userProfile.address.zipCity, this.updateUserProfile.address.zipCity));
            // }
            const result = await this.$authService.updateUserProfile(this.updateUserProfile);
            this.editing = false;
            this.updateUserProfile = null;
        } catch (err) {
            this.showError(err);
        } finally {
            this.loading = false;
        }
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

    //phoneNumber cannot be used as it is not an unique identifier
    deletePhoneNumber(phoneNumber: PhoneNumber) {
        this.log('deletePhoneNumber', phoneNumber);
        confirm({
            // title: localize('stop_session'),
            message: this.$tc('delete_phone', phoneNumber.phoneNumber),
            okButtonText: this.$tc('delete'),
            cancelButtonText: this.$tc('cancel')
        })
            .then(r => {
                if (r) {
                    return this.$authService.deletePhone(phoneNumber);
                }
            })
            .catch(this.showError)
            .finally(() => {
                this.loading = false;
            });
    }
    async changeAddress() {
        const result: Address = await this.$showModal(AddressPicker, { fullscreen: true });
        if (result) {
            this.updateUserProfile = this.updateUserProfile || {};
            this.updateUserProfile.address = result;

            //trick to get reactivity to work if this.updateUserProfile is already defined
            this.updateUserProfile = JSON.parse(JSON.stringify(this.updateUserProfile));
        }
    }
    async addPhoneNumber() {
        try {
            const r = await prompt({
                // title: localize('stop_session'),
                title: this.$tc('add_phone'),
                message: this.$tc('add_phone_desc'),
                okButtonText: this.$tc('add'),
                cancelButtonText: this.$tc('cancel'),
                textFieldProperties: {
                    keyboardType: 'number'
                }
            });
            // .then(r => {
            if (r && r.text && r.text.length > 0) {
                const phoneNumber = r.text;
                const addResult = await this.$authService.addPhone(phoneNumber, this.userProfile.id);
                console.log('addResult', addResult);
                const resultPConfirm = await prompt({
                    // title: localize('stop_session'),
                    message: this.$tc('enter_add_phone_confirmation', phoneNumber),
                    okButtonText: this.$tc('confirm'),
                    cancelButtonText: this.$tc('cancel'),
                    textFieldProperties: {
                        keyboardType: 'number'
                    }
                });
                if (resultPConfirm && resultPConfirm.text && resultPConfirm.text.length > 0) {
                    console.log('resultPConfirm', resultPConfirm.text);
                    await this.$authService.confirmPhone(addResult.validation_url, resultPConfirm.text);
                    await this.$authService.getUserProfile();
                    showSnack({
                        message: this.$t('phone_added', phoneNumber)
                    });
                }
                // return r;
                // } else {
                // return Promise.reject();
            }
            // })
            // .then(r => {

            // })
        } catch (err) {
            this.showError(err);
        } finally {
            this.loading = false;
        }
    }

    onTextChange(value: string, key: string) {
        this.log('onTextChange', key, value);
        this.updateUserProfile = this.updateUserProfile || {};
        const keysArray = key.split('.');
        const finalKey = keysArray.pop();

        let ref = this.updateUserProfile;
        for (const userKey of keysArray) {
            if (!this.updateUserProfile[userKey]) {
                this.updateUserProfile[userKey] = {};
            }
            ref = this.updateUserProfile[userKey];
        }

        // if (finalKey === 'zipCity') {
        //     if (value.length >= 4) {
        //         this.$authService
        //             .getZipCities(value)
        //             .then(zipCities => {
        //                 console.log(zipCities); //AUTOCOMPLETION CHOICES HERE
        //             })
        //             .catch(this.showError);
        //     }
        // } else {
        ref[finalKey] = value;
        // }
        this.log(this.updateUserProfile);
    }

    chooseImage() {
        if (!this.isPro) {
            // non pro users can't change their image
            return;
        }

        perms
            .request('storage')
            .then(() =>
                imagepicker
                    .create({
                        mode: 'single' // use "multiple" for multiple selection
                    })
                    // on android pressing the back button will trigger an error which we dont want
                    .present()
                    .catch(() => [])
            )
            .then(selection => {
                if (selection.length > 0) {
                    return new Promise((resolve, reject) => {
                        selection[0].getImageAsync((image, error) => {
                            if (error) {
                                reject(error);
                            } else {
                                this.updateUserProfile = this.updateUserProfile || {};
                                // we need to resize the image as our server only accept images < 500kb
                                const mutableImageSource = BitmapFactory.makeMutable(new ImageSource(image));
                                const bmp = BitmapFactory.asBitmap(mutableImageSource);
                                this.updateUserProfile.image = this.image = bmp.resizeMax(500).toImageSource();
                            }
                        });
                    });
                }
            })
            .catch(this.showError);
    }
    showingQRCode = false;
    qrCodeImage: ImageSource;
    toggleQRCode() {
        if (!this.showingQRCode) {
            if (!this.qrCodeImage) {
                try {
                    this.qrCodeImage = generateBarCode({
                        text: `${this.userProfile.mainICC}#${this.userProfile.id}#${this.userProfile.name}`,
                        type: 'QR_CODE',
                        width: 400,
                        height: 400,
                        backColor: 'transparent',
                        frontColor: 'white'
                    });
                    this.image = this.qrCodeImage;
                    this.showingQRCode = !this.showingQRCode;
                } catch (err) {
                    console.log(err);
                }
            } else {
                this.image = this.qrCodeImage;
                this.showingQRCode = !this.showingQRCode;
            }
        } else {
            this.image = this.userProfile.image;
            this.showingQRCode = !this.showingQRCode;
        }
    }
}
