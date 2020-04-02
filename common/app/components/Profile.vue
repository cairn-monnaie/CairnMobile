<template>
    <CairnPage @navigatedTo="onNavigatedTo" :actionBarShowLogo="false">
        <StackLayout slot="actionBarRightButtons" verticalAlignment="center" orientation="horizontal" v-if="editable">
            <MDButton variant="flat" class="icon-btn" v-show="myProfile && !editing" text="mdi-qrcode" @tap="toggleQRCode()" />
            <MDButton variant="flat" class="icon-btn" v-show="canSave" text="mdi-content-save" @tap="saveProfile()" />
            <MDButton variant="flat" class="icon-btn" :text="editing ? 'mdi-close-circle' : 'mdi-pencil'" @tap="switchEditing()" />
        </StackLayout>
        <GridLayout slot="actionBarSubView" height="150" col="0" colSpan="3" verticalAlignment="top" rows="*,3*,*,*">
            <Label
                row="1"
                horizontalAlignment="center"
                verticalTextAlignment="center"
                textAlignment="center"
                class="mdi"
                width="75"
                borderRadius="75"
                borderWidth="2"
                color="white"
                borderColor="white"
                fontSize="60"
                :text="editing && isPro ? 'mdi-account-edit' : 'mdi-account'"
                v-show="!image"
                @tap="chooseImage"
                :isUserInteractionEnabled="editing"
            />
            <NSImg row="0" rowSpan="4" margin="20" v-show="!!image" :src="image" @tap="chooseImage" :isUserInteractionEnabled="editing" stretch="aspectFit" />
            <Label row="2" rowSpan="2" fontSize="20" fontWeight="500" horizontalAlignment="center" verticalAlignment="center" color="white" :text="userProfile.name" v-show="!image" />
        </GridLayout>
        <GridLayout columns="*,50,*" rows="*,50,*">
            <PullToRefresh @refresh="refresh" colSpan="3" rowSpan="3">
                <ScrollView>
                    <StackLayout v-if="editing" backgroundColor="white">
                        <EditableListItem
                            v-if="userProfile.description"
                            leftIcon="mdi-android-messages"
                            :title="userProfile.description"
                            :overText="$t('description')"
                            @textChange="onTextChange($event.value, 'description')"
                        />
                        <EditableListItem leftIcon="mdi-email" :title="userProfile.email" :overText="$t('email')" @textChange="onTextChange($event.value, 'email')" />
                        <EditableListItem
                            v-for="phone in userProfile.phoneNumbers"
                            leftIcon="mdi-phone"
                            rightButton="mdi-delete"
                            :title="phone.phoneNumber"
                            :overText="$t('phone')"
                            @rightTap="deletePhoneNumber(phone)"
                            :key="phone.phoneNumber"
                        />
                        <MDButton :text="$tc('add_phone')" @tap="addPhoneNumber" />

                        <!-- <EditableListItem leftIcon="mdi-map-marker" :title="userProfile.address.street1" :overText="$t('street')" @textChange="onTextChange($event.value, 'address.street1')" /> -->

                        <!-- <EditableListItem :title="userProfile.address.zipCity.zipCode" :overText="$t('zipcode')" @textChange="onTextChange($event.value, 'address.zipCity')" />

                        <EditableListItem :title="userProfile.address.zipCity.city" :overText="$t('city')" @textChange="onTextChange($event.value, 'address.zipCity')" /> -->
                        <ListItem
                            v-if="(updateUserProfile && updateUserProfile.address) || userProfile.address"
                            leftIcon="mdi-map-marker"
                            :title="((updateUserProfile && updateUserProfile.address) || userProfile.address) | address"
                            :overText="$t('address')"
                        />
                        <MDButton :text="$tc('change_address')" @tap="changeAddress" />
                    </StackLayout>
                    <StackLayout v-else>
                        <MapComponent v-if="!myProfile && userProfile.address && userProfile.address.latitude" ref="mapComp" @mapReady="onMapReady" rowSpan="4" :zoom="16" width="100%" height="150" />

                        <ListItem v-if="userProfile.description" leftIcon="mdi-android-messages" :title="userProfile.description" :overText="$t('description')" />
                        <ListItem v-show="myProfile" leftIcon="mdi-email" :title="userProfile.email" :overText="$t('email')" />
                        <ListItem v-for="phone in userProfile.phoneNumbers" :key="phone.id" leftIcon="mdi-phone" :title="phone.phoneNumber" :overText="$t('phone')" />
                        <ListItem v-if="userProfile.address" leftIcon="mdi-map-marker" :title="userProfile.address | address" :overText="$t('address')" />
                    </StackLayout>
                </ScrollView>
            </PullToRefresh>
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./Profile.ts" />
