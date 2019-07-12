<template>
    <Page ref="page" class="page" @navigatedTo="onNavigatedTo">
        <StackLayout class="pageContent">
            <CActionBar title="profile">
                <StackLayout verticalAlignment="center">
                    <GridLayout borderRadius="50" width="100" height="100" borderColor="white" borderWidth="3">
                        <Label class="mdi" :text="'mdi-account' | fonticon" color="white" fontSize="70" verticalAlignment="center" textAlignment="center" />
                        <Image :src="userProfile.image" />
                    </GridLayout>
                    <Label :text="userProfile.username" paddingTop="15" textAlignment="center" verticalAlignment="center" fontSize="20" color="white" fontWeight="bold" />
                    <Label :text="userProfile.email" paddingTop="5" paddingBottom="15" textAlignment="center" verticalAlignment="center" fontSize="16" color="#88ffffff" />
                </StackLayout>
            </CActionBar>
            <GridLayout columns="*,50,*" rows="*,50,*">
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
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script lang="ts" src="./Profile.ts" />