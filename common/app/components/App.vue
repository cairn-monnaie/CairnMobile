<template>
    <Page ref="page" @navigatingTo="onNavigatingTo" actionBarHidden="true" :statusBarColor="darkColor" ios:barStyle="light" :navigationBarColor="themeColor" @loaded="onLoaded">
        <MultiDrawer ref="drawer" :options="drawerOptions">
            <GridLayout slot="left" rows="auto,*,auto" height="100%" backgroundColor="white">
                <GridLayout v-if="userProfile" height="130" padding="15 15 5 15" borderBottomWidth="1" borderBottomColor="#E0E0E0" rows="50,4,*,*" columns="50,*" marginBottom="4">
                    <MDButton variant="flat" class="menu-btn" row="0" col="1" horizontalAlignment="right" text="mdi-logout" @tap="onTap('logout')" />
                    <Label class="mdi" borderRadius="25" borderWidth="1" color="#888" borderColor="#888" fontSize="40" textAlignment="center" text="mdi-account" v-show="!userProfile.image" />
                    <Image :src="userProfile.image" v-show="!!userProfile.image" />
                    <Label row="2" colSpan="2" fontSize="20" fontWeight="500" verticalAlignment="bottom" :text="userProfile.name" />
                    <Label row="3" colSpan="2" fontSize="15" color="#686868" verticalAlignment="top" :text="userProfile.email" />
                </GridLayout>
                <ScrollView row="1" @tap="noop">
                    <StackLayout ref="menu" @tap="noop">
                        <GridLayout v-for="item in menuItems" :key="item.url" columns="50, *" class="menu" :active="isActiveUrl(item.url)" @tap="onNavItemTap(item.url)">
                            <Label col="0" class="menuIcon" :text="item.icon" verticalAlignment="center" :active="activatedUrl === item.url" />
                            <Label col="1" class="menuText" :text="item.title | capitalize" verticalAlignment="center" :active="activatedUrl === item.url" />
                        </GridLayout>
                    </StackLayout>
                </ScrollView>
                <GridLayout columns="*,auto" row="2" width="100%" class="menuInfos menuButtons">
                    <Label :text="'App version: ' + (appVersion || '')" padding="10 0 10 0" verticalTextAlignment="center"/>
                    <!-- <MDButton variant="flat" text="mdi-email" @tap="onTap('sendFeedback')" /> -->
                    <MDButton col="1" variant="flat" v-if="$crashReportService.sentryEnabled" text="mdi-bug" @tap="onTap('sendBugReport')" />
                </GridLayout>
            </GridLayout>
            <!-- <GridLayout> -->
            <Frame ref="innerFrame" id="innerFrame">
                <Home v-if="loggedInOnStart" />
                <Login v-else />
            </Frame>
            <!-- <Label :text="$t('no_network_desc')"  verticalAlignment="bottom" textAlignment="center" color="white" backgroundColor="red" padding="10"/> -->
            <!-- </GridLayout> -->
        </MultiDrawer>
    </Page>
</template>

<script lang="ts" src="./App.ts" />
