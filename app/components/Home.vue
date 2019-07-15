<template>
    <Page ref="page" class="page" @navigatedTo="onNavigatedTo">
        <GridLayout rows="auto,*">
            <CActionBar row="0" title="home" />
            <GridLayout row="1" rowSpan="2" columns="*,50,*" rows="*,50,*" class="pageContent">
                <PullToRefresh col="0" row="0" colSpan="3" rowSpan="3" @refresh="refresh">
                    <ListView :items="accounts" backgroundColor="transparent" @itemTap="onItemTap" @itemLoading="onItemLoading" separatorColor="transparent">
                        <v-template>
                            <StackLayout backgroundColor="transparent">
                                <MDCardView margin="20" @onTap="onCardTap(item)">
                                    <GridLayout padding="10" isUserInteractionEnabled="false" columns="*, auto">
                                        <StackLayout col="0">
                                            <Label :text="item.name | titlecase" fontWeight="bold" fontSize="18" />
                                            <StackLayout orientation="horizontal" paddingTop="20">
                                                <Label col="0" class="balance" :text="item.balance | currency(false)" />
                                                <Label col="1" class="currency" text="" />
                                            </StackLayout>
                                        </StackLayout>
                                        <Label col="1" class="mdi" :text="'mdi-chevron-right' | fonticon" fontSize="30" color="gray" />
                                    </GridLayout>
                                </MDCardView>
                            </StackLayout>
                        </v-template>
                    </ListView>
                </PullToRefresh>
                <MDActivityIndicator v-show="loading" row="1" col="1" :busy="loading" />
                <transition name="fade" duration="100">
                    <Fab colSpan="3" rowSpan="3" iconClass="mdi" :icon="'mdi-plus' | fonticon" :iconOn="'mdi-close' | fonticon">
                        <!-- <FabItem :title="$t('select_language') | titlecase" iconClass="mdi" :icon="'mdi-layers' | fonticon" @tap="selectLanguage" /> -->
                        <!-- <FabItem :title="$t('select_style') | titlecase" iconClass="mdi" :icon="'mdi-layers' | fonticon" @tap="selectStyle" /> -->
                        <!-- <FabItem :title="$t('offline_packages') | titlecase" iconClass="mdi" :icon="'mdi-earth' | fonticon" @tap="downloadPackages" /> -->
                    </Fab>
                </transition>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./Home.ts" />