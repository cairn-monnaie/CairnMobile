<template>
    <Page ref="page" class="page" @navigatedTo="onNavigatedTo">
        <StackLayout class="pageContent">
            <CActionBar title="account_history" :subtitle="accountInfo.name" canGoBack="true">
                <StackLayout height="100" verticalAlignment="center" paddingLeft="60">
                    <Label :text="'balance' | L | titlecase" verticalAlignment="center" fontSize="14" color="#88ffffff" />
                    <Label verticalAlignment="center" fontSize="30" color="white">
                        <FormattedString>
                            <Span :text="accountInfo.balance | currency"></Span>
                            <Span class="cairn" text="" fontSize="13"></Span>
                        </FormattedString>
                    </Label>
                </StackLayout>
            </CActionBar>
            <GridLayout columns="*,50,*" rows="*,50,*">
                <PullToRefresh @refresh="refresh" col="0" row="0" colSpan="3" rowSpan="3">
                    <ListView :items="dataItems" backgroundColor="transparent" separatorColor="transparent">
                        <v-template>
                            <GridLayout width="100%" columns="*,auto" rows="auto,1">
                                <!-- <Label col="0" class="historyIcon" :text="item.nature ==='PAYMENT'?'mdi-trending-up':'mdi-trending-down' | fonticon" :color="item.nature ==='PAYMENT'?'#8BB844':'#FC5457'" /> -->
                                <StackLayout col="0" margin="16 0 10 16">
                                    <Label :text="item.name"  fontSize="16" lineHeight="7" />
                                    <HTMLLabel fontSize="14" color="#6F6F6F" lineHeight="2" maxLines="3" whiteSpace="nowrap" padding="0 0 0 -4">
                                        <Span fontWeight="bold" :text="item.nature ==='PAYMENT'? item.from.name : item.to.name" color="black"></Span>
                                        <Span :text="' - ' +  item.description"></Span>
                                    </HTMLLabel>
                                </StackLayout>
                                <DockLayout rowSpan="2" col="1" margin="16 16 10 0">
                                    <Label dock="top" :text="item.date | dateRelative" fontSize="14" color="#6F6F6F" />
                                    <Label dock="bottom" horizontalAlignment="right" verticalAlignment="bottom" fontWeight="bold" :text="item.amount | currency" fontSize="16" :color="item.nature ==='PAYMENT'?'#8BB844':'#FC5457'" />
                                </DockLayout>
                                <StackLayout colSpan="2" row="1" marginLeft="16" backgroundColor="lightgray" />
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
import BasePageComponent from './BasePageComponent';
import { Component, Prop } from 'vue-property-decorator';
import { isAndroid } from 'platform';
import { CustomTransition } from '~/transitions/custom-transition';
import { topmost, Color, NavigatedData } from 'tns-core-modules/ui/frame';
import Login from './Login.vue';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { Transaction, AccountInfo } from '~/services/AuthService';

@Component({})
export default class AccountHistort extends BasePageComponent {
    dataItems: ObservableArray<Transaction> = new ObservableArray();
    @Prop({ required: true })
    public accountInfo: AccountInfo;
    constructor() {
        super();
    }
    mounted() {
        super.mounted();
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        // console.log("refreshing")
        this.loading = true;
        this.$authService
            .getAccountHistory(this.accountInfo.id)
            .then(r => {
                this.dataItems = new ObservableArray(r);
                this.loading = false;
            })
            .catch(this.$showError);
    }
    onNavigatedTo(args: NavigatedData) {
        if (!args.isBackNavigation) {
            this.refresh();
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
@import '../styles';

.historyIcon {
    @extend .mdi;
    // background-color:#eee;
    text-align: center;
    margin-left: 10;
    margin-right: 10;
    font-size: 30;
    width: 40;
    height: 40;
    // border-radius: 20;
}
</style>