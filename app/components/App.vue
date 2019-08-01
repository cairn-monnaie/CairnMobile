<template>
    <Page ref="page" @navigatingTo="onNavigatingTo" actionBarHidden="true">
        <StatusBar ios:barStyle="light" :barColor="darkColor" />
        <NavigationBar :barColor="themeColor" />
        <MultiDrawer ref="drawer" :options="drawerOptions">
            <GridLayout slot="left" rows="auto, *, auto" height="100%" backgroundColor="white">
                <GridLayout v-if="userProfile" height="150" padding="15" borderBottomWidth="1" borderBottomColor="#E0E0E0" rows="50,10,*,*" columns="50,*" marginBottom="10">
                    <Label class="mdi" borderRadius="25" borderWidth="1" color="#888" borderColor="#888" fontSize="40" textAlignment="center" :text="'mdi-account' | fonticon" v-show="!userProfile.image" />
                    <Image :src="userProfile.image" v-show="!!userProfile.image" />
                    <Label row="2" colSpan="2" fontSize="20" fontWeight="500" verticalAlignment="bottom" :text="userProfile.name" />
                    <Label row="3" colSpan="2" fontSize="15" color="#686868" verticalAlignment="top" :text="userProfile.email" />
                </GridLayout>
                <ScrollView row="1" paddingTop="10" @tap="noop">
                    <StackLayout ref="menu" @tap="noop">
                        <GridLayout v-for="(item) in menuItems" :key="item.url" columns="50, *" class="menu" :active="isActiveUrl(item.url)"  @tap="onNavItemTap(item.url)">
                            <Label col="0" class="menuIcon" :text="('mdi-' + item.icon) | fonticon" verticalAlignment="center" :active="activatedUrl  === item.url" />
                            <Label col="1" class="menuText" :text="item.title | capitalize" verticalAlignment="center" :active="activatedUrl  === item.url" />
                        </GridLayout>
                    </StackLayout>
                </ScrollView>
                <StackLayout row="2" width="100%" padding="10">
                    <StackLayout class="menuButtons" orientation="horizontal">
                        <MDButton variant="flat" :text="'mdi-email' | fonticon" @tap="onTap('sendFeedback')" />
                        <MDButton variant="flat" :text="'mdi-bug' | fonticon" @tap="onTap('sendBugReport')" />
                        <MDButton variant="flat" :text="'mdi-logout' | fonticon" @tap="onTap('logout')" />
                    </StackLayout>
                    <StackLayout class="menuInfos">
                        <Label :text="'App version: ' + (appVersion || '')" />
                        <!-- <Label :visibility="glassesVersion ? 'visible' : 'collapsed'" :text="'Glasses firmware: ' + glassesVersion" /> -->
                        <!-- <Label :visibility="glassesSerialNumber ? 'visible' : 'collapsed'" :text="'Glasses Serial Number: ' + glassesSerialNumber" /> -->
                    </StackLayout>
                </StackLayout>
            </GridLayout>
            <StackLayout iosOverflowSafeArea="false">
                <Frame ref="innerFrame">
                    <Home v-if="loggedInOnStart" />
                    <Login v-else />
                </Frame>
            </StackLayout>

            <!-- <GridLayout rows="*, auto" iosOverflowSafeArea="true">
                    <TabView row="0" :selectedIndex="selectedTabIndex" androidTabsPosition="bottom" ref="tabView" class="mdi">
                        <TabViewItem :title="$t('home') | capitalize">
                            <Frame>
                                <Home />
                            </Frame>
                        </TabViewItem>
                        <TabViewItem :title="$t('profile') | capitalize ">
                            <Frame>
                                <Profile />
                            </Frame>
                        </TabViewItem>
                    </TabView>
                    <!-- <BottomNavigation ref="bottomNavigation" row="1" @tabSelected="onBottomNavigationTabSelected">
                        <BottomNavigationTab :title="$t('home') | capitalize" icon="logo" />
                        <BottomNavigationTab :title="$t('profile') | capitalize " icon="logo" />
                    </BottomNavigation> -->
            </GridLayout> -->
        </MultiDrawer>
    </Page>
</template>

<script lang="ts" src="./App.ts" />
