<template>
    <Page :id="id" ref="page" :navigateUrl="navigateUrl" @navigatedTo="$emit('navigatedTo', $event)" @loaded="$emit('loaded', $event)">
        <GridLayout rows="auto,*">
            <GridLayout row="1" class="pageContent">
                <slot />
            </GridLayout>
            <CActionBar v-if="!actionBarHidden" row="0" :title="title" :subtitle="subtitle" :showMenuIcon="showMenuIcon" :backgroundColor="actionBarBackroundColor" :height="actionBarHeight" :elevation="actionBarElevation" :showLogo="actionBarShowLogo" :modalWindow="modal" @titleTap="$emit('actionBarTitleTap', $event)">
                <slot name="actionBarRightButtons" slot="rightButtons" />
                <slot name="actionBarSubView" slot="subView" />
            </CActionBar>
            <MDActivityIndicator v-show="loading" row="1" :busy={loading} verticalAlignment="center" horizontalAlignment="center" />
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./CairnPage.ts"/>