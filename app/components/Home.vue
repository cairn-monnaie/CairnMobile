<template>
    <Page ref="page" class="page">
        <ActionBar :title="'home' | L | titlecase" />
        <StackLayout>
            <MDCButton text="openMain" @tap="openMain" />
            <MDCButton text="openIn" @tap="openIn" />
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import BasePageComponent from "./BasePageComponent"
import { Component } from "vue-property-decorator"
import { isAndroid } from "platform"
import { CustomTransition } from "~/transitions/custom-transition"
import { topmost } from "tns-core-modules/ui/frame"
import Login from "./Login.vue"

const HomePage = {
    template: `
<Page>
    <ActionBar title="Inner Page" />
	<Label class="m-20" textWrap="true" text="You have successfully authenticated. This is where you build your core application functionality."></Label>
</Page>
`
}

@Component({})
export default class Home extends BasePageComponent {
    constructor() {
        super()
    }
    mounted() {
        super.mounted()
        // console.log('test home page', this.page);
    }
    onNavigatingTo() {
        // if (isAndroid) {
        //     const page = this.page
        //     // page.androidStatusBarBackground = null;
        //     // page.androidStatusBarBackground = new Color(this.darkColor);
        // }
    }
    openMain() {
        this.$navigateTo(Login, { clearHistory: true })
    }
    openIn() {
        this.navigateTo(HomePage as any)
    }
}
</script>
