<template>
    <CairnPage @navigatedTo="onLoaded" :title="$t('beneficiaries')">

        <PullToRefresh @refresh="refresh" col="0" row="1" colSpan="3" rowSpan="2">
            <CollectionView :items="dataItems" backgroundColor="transparent" separatorColor="transparent" rowHeight="80">
                <v-template>
                    <ListItem :avatar="item.image" :title="item.name" :subtitle="item.address | address" />
                </v-template>
            </CollectionView>
        </PullToRefresh>
    </CairnPage>
</template>

<script lang="ts" src="./Beneficiaries.ts" />