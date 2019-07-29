<template>
    <Page ref="page" class="page" @navigatedTo="onNavigatedTo">
        <GridLayout rows="auto,*">
            <CActionBar row="0" showMenuIcon="true" />
            <GridLayout row="1" rowSpan="2" columns="*,50,*" rows="*,50,*" class="pageContent">
                <PullToRefresh col="0" row="0" colSpan="3" rowSpan="3" @refresh="refresh">
                    <CollectionView :items="accounts" @itemTap="onItemTap" rowHeight="180">
                        <v-template>
                            <StackLayout backgroundColor="transparent">
                                <MDCardView margin="20" @onTap="onCardTap(item)">
                                    <GridLayout padding="10" isUserInteractionEnabled="false" columns="*, auto" rows="auto, *">
                                            <Label row="0" :text="item.name | titlecase" fontWeight="bold" fontSize="18" />
                                            <Label row="1" class="balance" :text="item.balance | currency(false)" paddingTop="20">
                                                <Span :text="item.balance | currency(false)" />
                                                <Span class="cairn" :text="'cairn-currency' | fonticon" />
                                            </Label>
                                        <Label col="1" rowSpan="2" class="mdi" :text="'mdi-chevron-right' | fonticon" fontSize="30" color="gray" verticalAlignment="center" />
                                    </GridLayout>
                                </MDCardView>
                            </StackLayout>
                        </v-template>
                    </CollectionView>
                </PullToRefresh>
                <MDActivityIndicator v-show="loading" row="1" col="1" :busy="loading" />
                <transition name="fade" duration="100">
                    <Fab colSpan="3" rowSpan="3" iconClass="mdi" :icon="'mdi-plus' | fonticon" :iconOn="'mdi-close' | fonticon">
                        <FabItem :title="$t('transfer') | titlecase" iconClass="mdi" :icon="'mdi-bank-transfer' | fonticon" @tap="openTransferWindow" />
                        <FabItem :title="$t('add_beneficiary') | titlecase" iconClass="mdi" :icon="'mdi-account-plus' | fonticon" @tap="addBeneficiary" />
                    </Fab>
                </transition>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./Home.ts" />