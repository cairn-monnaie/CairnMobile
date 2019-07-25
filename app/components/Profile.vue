<template>
    <Page ref="page" class="page" @navigatedTo="onNavigatedTo">
        <GridLayout rows="auto,*">

            <GridLayout row="0" rowSpan="2" columns="*,50,*" rows="auto,*,50,*" class="pageContent">
                <GridLayout height="200" colSpan="3" verticalAlignment="top" rows="2*,4*,*,*" :backgroundColor="themeColor">
                    <Label row="1" horizontalAlignment="center" verticalAlignment="center" class="mdi" borderRadius="100" borderWidth="2" color="white" borderColor="white" fontSize="90" :text="'mdi-account' | fonticon" v-show="!userProfile.image" />
                    <Image row="0" rowSpan="2" width="200" height="200" horizontalAlignment="center" verticalAlignment="center" :src="userProfile.image" />
                    <Label row="2" rowSpan="2" fontSize="20" fontWeight="500" horizontalAlignment="center" verticalAlignment="center" color="white" :text="userProfile.name" />
                    <!-- <Label row="3" fontSize="15" color="white" verticalAlignment="top" :text="userProfile.email" /> -->
                </GridLayout>
                <PullToRefresh @refresh="refresh" row="1" colSpan="3" rowSpan="3">
                    <ScrollView>
                        <StackLayout v-if="editable">
                            <EditableListItem v-if="userProfile.description" leftIcon="mdi-android-messages" :title="userProfile.description" :overText="'description' | L" @textChange="onTextChange($event.value, 'description')"/>
                            <EditableListItem leftIcon="mdi-email" :title="userProfile.email" :overText="'email' | L"  @textChange="onTextChange($event.value, 'email')"/>
                            <EditableListItem v-for="(phone) in userProfile.phoneNumbers" leftIcon="mdi-phone" rightButton="mdi-delete" :title="phone" :overText="'phone' | L" @rightTap="deletePhoneNumber(phone)" />
                            <EditableListItem leftIcon="mdi-map-marker" :title="userProfile.address.street1" :overText="'street' | L"   @textChange="onTextChange($event.value, 'address.street1')"/>
                            <EditableListItem :title="userProfile.address.zipCity.city" :overText="'city' | L"   @textChange="onTextChange($event.value, 'address.zipCity.city')"/>
                            <EditableListItem :title="userProfile.address.zipCity.zipCode" :overText="'zipcode' | L"   @textChange="onTextChange($event.value, 'address.zipCity.zipCode')"/>
                        </StackLayout>
                        <StackLayout v-else>
                            <ListItem v-if="userProfile.description" leftIcon="mdi-android-messages" :title="userProfile.description" :overText="'description' | L" />
                            <ListItem leftIcon="mdi-email" :title="userProfile.email" :overText="'email' | L" />
                            <ListItem v-for="(phone) in userProfile.phoneNumbers" leftIcon="mdi-phone" :title="phone" :overText="'phone' | L" />
                            <ListItem v-if="userProfile.address" leftIcon="mdi-map-marker" :title="userProfile.address | address" :overText="'address' | L" />
                        </StackLayout>
                    </ScrollView>

                </PullToRefresh>
                <MDActivityIndicator v-show="loading" row="2" col="1" :busy="loading" />
            </GridLayout>
            <CActionBar zIndex="10" row="0" showMenuIcon="true" backgroundColor="transparent" :showLogo="false">
                <MDButton variant="flat" v-show="canSave" class="icon-btn" :text="'mdi-content-save' | fonticon" @tap="switchEditable()" />
                <MDButton variant="flat" class="icon-btn" :text="editable? 'mdi-close-circle' : 'mdi-pencil' | fonticon" @tap="switchEditable()" />
            </CActionBar>
            <!-- <GridLayout columns="*,50,*" rows="*,50,*" class="pageContent">
                <ScrollView colSpan="3" rowSpan="3">
                    <StackLayout>

                        <GridLayout columns="auto, *">
                        <Label col="0" class="mdi" :text="'mdi-map-marker' | fonticon" color="#8F99AA" fontSize="20" verticalAlignment="center" textAlignment="center" padding="16"/>
                    <StackLayout col="1" padding="10 0 10 0" borderBottomColor="#8F99AA" borderBottomWidth="1">
                            <Label color="black" fontSize="16" :text="userProfile.street1" />
                            <Label color="#8F99AA" fontSize="15" :text="userProfile.city + ', ' + userProfile.zipcode " />
                        </StackLayout>
                    </GridLayout>
                    </StackLayout>
                </ScrollView>
                <MDActivityIndicator v-show="loading" row="1" col="1" :busy="loading" />
            </GridLayout> -->
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./Profile.ts" />