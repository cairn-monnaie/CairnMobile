<template>
    <Page ref="page" class="page" @loaded="onLoaded">
        <StackLayout>
            <CActionBar :title="$t('account_history')" :subtitle="accountInfo.name" />
            <GridLayout columns="*,50,*" rows="auto,*,50,*" class="pageContent">
                <StackLayout height="100" row="0" colSpan="3" verticalAlignment="top" paddingLeft="50" :backgroundColor="themeColor">
                    <Label :text="$t('balance') | titlecase" verticalAlignment="center" fontSize="14" color="#88ffffff" />
                    <Label verticalAlignment="center" fontSize="30" color="white">
                        <FormattedString>
                            <Span :text="accountInfo.balance | currency"></Span>
                            <Span class="cairn" :text="'cairn-currency' | fonticon" />
                        </FormattedString>
                    </Label>
                </StackLayout>
                <PullToRefresh @refresh="refresh" col="0" row="1" colSpan="3" rowSpan="2">
                    <CollectionView :items="dataItems" backgroundColor="transparent" separatorColor="transparent" rowHeight="80">
                        <v-template>
                            <GridLayout width="100%" columns="*,auto" rows="auto,*" padding="16" borderBottomWidth="1" borderBottomColor="lightgray">
                                <!-- <Label col="0" class="historyIcon" :text="item.nature ==='PAYMENT'?'mdi-trending-up':'mdi-trending-down' | fonticon" :color="item.nature ==='PAYMENT'?'#8BB844':'#FC5457'" /> -->
                                <!-- <StackLayout col="0" margin="16 0 10 16"> -->
                                <Label verticalAlignment="top" row="1" :text="item.reason" fontSize="14" lineHeight="7" />
                                <Label verticalAlignment="top" row="0" fontSize="14" color="#6F6F6F" lineHeight="2" maxLines="3" whiteSpace="nowrap">
                                    <Span fontWeight="bold" :text="item.credit ? item.debitorName : item.creditorName" color="black"></Span>
                                    <Span :text="' - ' +  item.description">

                                    </Span>
                                </Label>
                                <!-- </StackLayout> -->
                                <!-- <DockLayout rowSpan="2" col="1" margin="16 16 10 0"> -->
                                <Label col="1" row="0" verticalAlignment="bottom" :text="item.submissionDate | dateRelative" fontSize="14" color="#6F6F6F" horizontalAlignment="right"/>
                                <Label col="1" row="1" horizontalAlignment="right" verticalAlignment="bottom" fontWeight="bold" :text=" item.amount | currency " fontSize="16" :color="item.credit ? accentColor : '#FC5457'">
                                    <Span :text="item.credit ? '+' : '-' "></Span>
                                    <Span :text="item.amount | currency | preconcat '+' "></Span>
                                    <Span class="cairn" :text="'cairn-currency' | fonticon" />
                                </Label>
                                <!-- </DockLayout> -->
                                <!-- <StackLayout colSpan="2" row="2"  marginLeft="16" backgroundColor="lightgray" /> -->
                            </GridLayout>
                        </v-template>
                    </CollectionView>
                </PullToRefresh>
                <MDActivityIndicator v-show="loading" row="2" col="1" :busy="loading" />
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script lang="ts" src="./AccountHistory.ts" />