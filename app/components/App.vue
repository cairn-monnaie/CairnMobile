<template>
    <Page ref="page" @navigatingTo="onNavigatingTo" actionBarHidden="true" backgroundColor="yellow">
        <MultiDrawer ref="drawer" :options="drawerOptions">
            <GridLayout slot="left" rows="auto, *, auto" height="100%" backgroundColor="white">
                <ScrollView row="1" paddingTop="10" @tap="noop">
                    <StackLayout ref="menu" @tap="noop">
                        <GridLayout v-for="(item) in menuItems" :key="item.url" height="50" columns="50, *" class="menu" :active="isActiveUrl(item.url)">
                            <Label col="0" class="menuIcon" :text="('mdi-' + item.icon) | fonticon" verticalAlignment="center" />
                            <Label col="1" class="menuText" :text="item.title | titlecase" verticalAlignment="center" :active="activatedUrl  === item.url" />
                            <MDRipple borderRadius="4" col="0" colSpan="2" @tap="onNavItemTap(item.url)" />
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
            <StackLayout class="page" backgroundColor="red" iosOverflowSafeArea="false">
                <Frame ref="innerFrame">
                    <Home v-if="loggedInOnStart" />
                    <Login v-else />
                </Frame>
            </StackLayout>

            <!-- <GridLayout rows="*, auto" iosOverflowSafeArea="true">
                    <TabView row="0" :selectedIndex="selectedTabIndex" androidTabsPosition="bottom" ref="tabView" class="mdi">
                        <TabViewItem :title="'home' | L | titlecase">
                            <Frame>
                                <Home />
                            </Frame>
                        </TabViewItem>
                        <TabViewItem :title="'profile' | L | titlecase ">
                            <Frame>
                                <Profile />
                            </Frame>
                        </TabViewItem>
                    </TabView>
                    <!-- <BottomNavigation ref="bottomNavigation" row="1" @tabSelected="onBottomNavigationTabSelected">
                        <BottomNavigationTab :title="'home' | L | titlecase" icon="logo" />
                        <BottomNavigationTab :title="'profile' | L | titlecase " icon="logo" />
                    </BottomNavigation> -->
            </GridLayout> -->
        </MultiDrawer>
    </Page>
</template>

<script lang="ts" src="./App.ts" />
