<template>
    <Page ref="page" class="page">
        <ActionBar :title="'profile' | L | titlecase" />
        <GridLayout rows="*,70">
            
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import BasePageComponent from "./BasePageComponent"
import { Component } from "vue-property-decorator"
import { isAndroid } from "platform"
import { CustomTransition } from "~/transitions/custom-transition"
import { topmost, Color } from "tns-core-modules/ui/frame"
import Login from "./Login.vue"
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array"

@Component({})
export default class Profile extends BasePageComponent {
    loading = false
    accounts: any = []
    constructor() {
        super()
    }
    mounted() {
        super.mounted()
        // this.refresh()
    }

    refresh(args?) {
        // if (args && args.object) {
        //     args.object.refreshing = false
        // }
        // console.log("refreshing")
        // this.loading = true
        // this.$authService.getAccounts().then(r => {
        //     console.log("got accounts", r)
        //     const accounts = []
        //     r.accounts.forEach(a => {
        //         accounts.push({
        //             balance: parseFloat(a.status.balance),
        //             id: a.type.id.toString(),
        //             name: a.type.name.toString()
        //         })
        //     })
        //     console.log("got accounts done ", accounts)
        //     this.accounts = new ObservableArray(accounts) as any
        //     this.loading = false
        // })
    }
    onNavigatingTo() {
        // if (isAndroid) {
        //     const page = this.page
        //     // page.androidStatusBarBackground = null;
        //     // page.androidStatusBarBackground = new Color(this.darkColor);
        // }
    }
    // openMain() {
    //     this.$navigateTo(Login, { clearHistory: true })
    // }
    // openIn() {
    // this.navigateTo(HomePage as any)
    // }
}
</script>
<style lang="scss" scoped>

</style>