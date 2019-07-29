<template>
    <Page ref="page" class="page" @loaded="onLoaded">
        <StackLayout>
            <CActionBar :title="$t('beneficiaries')" />
            <GridLayout class="pageContent">
                
                <PullToRefresh @refresh="refresh" col="0" row="1" colSpan="3" rowSpan="2">
                    <CollectionView :items="dataItems" backgroundColor="transparent" separatorColor="transparent" rowHeight="80">
                        <v-template>
                            <ListItem :avatar="item.image" :title="item.name" :subtitle="item.address | address"/>
                        </v-template>
                    </CollectionView>
                </PullToRefresh>
                <MDActivityIndicator v-show="loading" row="2" col="1" :busy="loading" horizontalAlignment="center" verticalAlignment="center"/>
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script lang="ts" src="./Beneficiaries.ts" />