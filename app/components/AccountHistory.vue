<template>
    <Page ref="page" class="page" @navigatedTo="onNavigatedTo">
        <ActionBar :title="'account_history' | L(accountInfo.name)" flat="true" />
        <StackLayout class="pageContent">
            <GridLayout columns="*,50,*" rows="*,50,*">
                <PullToRefresh @refresh="refresh" col="0" row="0" colSpan="3" rowSpan="3">
                    <ListView :items="dataItems" backgroundColor="transparent" separatorColor="transparent" width="100%" height="100%">
                        <v-template>
                            <GridLayout width="100%" rows="*" columns="auto,*,auto" height="60">
                                <Label col="0" class="mdi" :text="item.nature ==='PAYMENT'?'mdi-arrow-up-bold':'mdi-arrow-down-bold' | fonticon" fontSize="30" :color="item.nature ==='PAYMENT'?'green':'red'" />
                                <StackLayout col="1">
                                    <Label :text="item.name" fontWeight="bold" fontSize="16" />
                                    <Label :text="item.description" fontWeight="bold" fontSize="14" color="gray" />
                                </StackLayout>
                                <Label col="2" :text="item.amount | currency" fontWeight="bold" fontSize="19" :color="item.nature ==='PAYMENT'?'green':'red'" />
                            </GridLayout>
                        </v-template>
                    </ListView>
                </PullToRefresh>
                <MDCActivityIndicator v-show="loading" row="1" col="1" :busy="loading" />
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import BasePageComponent from "./BasePageComponent"
import { Component, Prop } from "vue-property-decorator"
import { isAndroid } from "platform"
import { CustomTransition } from "~/transitions/custom-transition"
import { topmost, Color, NavigatedData } from "tns-core-modules/ui/frame"
import Login from "./Login.vue"
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array"
import { Transaction, AccountInfo } from "~/services/AuthService"

@Component({})
export default class AccountHistort extends BasePageComponent {
    dataItems: ObservableArray<Transaction> = new ObservableArray()
    @Prop({ required: true })
    public accountInfo: AccountInfo
    constructor() {
        super()
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false
        }
        // console.log("refreshing")
        this.loading = true
        this.$authService
            .getAccountHistory(this.accountInfo.id)
            .then(r => {
                this.dataItems = new ObservableArray(r)
                this.loading = false
            })
            .catch(this.$showError)
    }
    onNavigatedTo(args:NavigatedData) {
        if (!args.isBackNavigation) {
            this.refresh()
        }
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