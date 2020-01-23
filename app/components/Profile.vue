<template>
    <CairnPage @navigatedTo="onNavigatedTo" :actionBarShowLogo="false">
        <StackLayout slot="actionBarRightButtons" verticalAlignment="center" orientation="horizontal" v-if="editable">
            <MDButton variant="flat" v-show="canSave" class="icon-btn" :text="'mdi-content-save' | fonticon" @tap="saveProfile()" />
            <MDButton variant="flat" class="icon-btn" :text="editing? 'mdi-close-circle' : 'mdi-pencil' | fonticon" @tap="switchEditing()" />
        </StackLayout>
        <GridLayout slot="actionBarSubView" height="150" col="0" colSpan="3" verticalAlignment="top" rows="*,3*,*,*">
            <Label row="1" horizontalAlignment="center" verticalTextAlignment="center" textAlignment="center" class="mdi" width="75" borderRadius="75" borderWidth="2" color="white" borderColor="white" fontSize="60" :text="'mdi-account' | fonticon" v-show="!image" @tap="chooseImage" :isUserInteractionEnabled="editing" />
            <NSImg row="0" rowSpan="2" width="150" height="140" marginTop="10" horizontalAlignment="center" verticalAlignment="center" v-show="!!image" :src="image" @tap="chooseImage" :isUserInteractionEnabled="editing" stretch="aspectFit" />
            <Label row="2" rowSpan="2" fontSize="20" fontWeight="500" horizontalAlignment="center" verticalAlignment="center" color="white" :text="userProfile.name" />
        </GridLayout>
        <GridLayout columns="*,50,*" rows="*,50,*">
            <PullToRefresh @refresh="refresh" colSpan="3" rowSpan="3">
                <ScrollView>
                    <StackLayout v-if="editing" backgroundColor="white">
                        <EditableListItem v-if="userProfile.description" leftIcon="mdi-android-messages" :title="userProfile.description" :overText="$t('description')" @textChange="onTextChange($event.value, 'description')" />
                        <EditableListItem leftIcon="mdi-email" :title="userProfile.email" :overText="$t('email')" @textChange="onTextChange($event.value, 'email')" />
                        <EditableListItem v-for="(phone) in userProfile.phoneNumbers" leftIcon="mdi-phone" rightButton="mdi-delete" :title="phone" :overText="$t('phone')" @rightTap="deletePhoneNumber(phone)" :key="phone" />
                        <MDButton :text="$tc('add_phone')" @tap="addPhoneNumber" />

                        <EditableListItem leftIcon="mdi-map-marker" :title="userProfile.address.street1" :overText="$t('street')" @textChange="onTextChange($event.value, 'address.street1')" />
                        <EditableListItem :title="userProfile.address.zipCity.city" :overText="$t('city')" @textChange="onTextChange($event.value, 'address.zipCity.city')" />
                        <EditableListItem :title="userProfile.address.zipCity.zipCode" :overText="$t('zipcode')" @textChange="onTextChange($event.value, 'address.zipCity.zipCode')" />
                    </StackLayout>
                    <StackLayout v-else>
                        <ListItem v-if="userProfile.description" leftIcon="mdi-android-messages" :title="userProfile.description" :overText="$t('description')" />
                        <ListItem leftIcon="mdi-email" :title="userProfile.email" :overText="$t('email')" />
                        <ListItem v-for="(phone) in userProfile.phoneNumbers" :key="phone" leftIcon="mdi-phone" :title="phone" :overText="$t('phone')" />
                        <ListItem v-if="userProfile.address" leftIcon="mdi-map-marker" :title="userProfile.address | address" :overText="$t('address')" />
                    </StackLayout>
                </ScrollView>

            </PullToRefresh>
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./Profile.ts" />