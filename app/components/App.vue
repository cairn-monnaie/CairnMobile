a<template>
    <Frame ref="frame" transition="fade">
        <Page ref="page" @navigatingTo="onNavigatingTo" actionBarHidden="true">
            <ActionBar title="Login Page" />
            <TabView androidTabsPosition="bottom">
                <TabViewItem title="Home">
                    <Home />
                </TabViewItem>
                <TabViewItem title="Second">
                    <Frame>
                        <Page>
                            <ActionBar title="Second Page" />
                            <GridLayout>
                                <Label text="Default Page Content2" />
                            </GridLayout>
                        </Page>
                    </Frame>
                </TabViewItem>
            </TabView>
        </Page>
    </Frame>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent'
import Home from './Home.vue'
import Login from './Login.vue'
import { Component } from 'vue-property-decorator'
import { Frame } from 'ui/frame/frame';
import Vue from "nativescript-vue";

@Component({
    components: {
        'Home': Home
    }
})
export default class App extends BaseVueComponent {

    constructor() {
        super();
    }
    mounted() {
        super.mounted();
        this.page.actionBarHidden = true;

        setTimeout(() =>
            this.$navigateTo(Login, {
                animated: false
            }), 0)
    }
    onNavigatingTo(){
        // this.$navigateTo(Login, {
        //         animated: false
        //     })
        // setTimeout(() =>
        //     this.$navigateBack(), 5000)
    }
}
</script>
