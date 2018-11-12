a<template>
    <Page ref="page" @navigatingTo="onNavigatingTo" actionBarHidden="true">
        <GridLayout rows="*, auto">
            <TabView row="0" :selectedIndex="selectedTabIndex" androidTabsPosition="bottom" ref="tabView" class="mdi" @loaded="tabviewLoaded">
                <TabViewItem :title="'home' | L | titlecase">
                    <Frame>
                        <Home />
                    </Frame>
                </TabViewItem>
                <TabViewItem title="Second">
                    <Frame>
                        <Profile />
                    </Frame>
                </TabViewItem>
            </TabView>
            <!-- <BottomNavigation ref="bottomNavigation" row="1"  @tabSelected="onBottomNavigationTabSelected">
                <BottomNavigationTab title="First" icon="logo"></BottomNavigationTab>
                <BottomNavigationTab title="Second" icon="logo"></BottomNavigationTab>
            </BottomNavigation> -->
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from "./BaseVueComponent"
import Home from "./Home.vue"
import Login from "./Login.vue"
import Profile from "./Profile.vue"
import { Component } from "vue-property-decorator"
import { Frame } from "ui/frame/frame"
import { TabView } from "ui/tab-view/tab-view"
import Vue from "nativescript-vue"
import { EventData } from "data/observable"

@Component({
    components: {
        Home: Home,
        Profile: Profile
    }
})
export default class App extends BaseVueComponent {
    selectedTabIndex: number = 0
    constructor() {
        super()
    }
    mounted() {
        super.mounted()
        this.page.actionBarHidden = true

        // setTimeout(
        //     () =>
        //         this.$navigateTo(Login, {
        //             animated: false
        //         }),
        //     0
        // )
    }
    // onBottomNavigationTabSelected(e) {
    //     console.log("onTabSelected", e.newIndex, this.selectedTabIndex)
    //     this.selectedTabIndex = e.newIndex;
    // }
    // tabviewLoaded(args: EventData) {
    //     var tabview = <any>args.object
    //     if (this.$isAndroid) {
    //         var tabViewgrid = tabview._grid
    //         tabViewgrid.removeViewAt(0)
    //     } else if (this.$isIOS) {
    //         tabview._ios.tabBar.hidden = true
    //     }
    // }
    getTabView() {
        return this.getRef("tabView") as TabView
    }
    // getCurrenFrame() {
    //     const tabView = this.getTabView();
    //     return tabView.items[tabView.selectedIndex].getViewById('frame');
    // }
    onNavigatingTo() {
        // this.$navigateTo(Login, {
        //         animated: false
        //     })
        // setTimeout(() =>
        //     this.$navigateBack(), 5000)
    }
}
</script>
