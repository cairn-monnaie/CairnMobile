<template>
    <Page :id="id" ref="page" class="cairn-page" :navigateUrl="navigateUrl" @navigatedTo="$emit('navigatedTo', $event)" @loaded="$emit('loaded', $event)">
        <GridLayout rows="auto,*,auto,auto">
            <GridLayout row="1" rowSpan="2" class="pageContent">
                <slot />
            </GridLayout>
            <CActionBar
                v-if="!actionBarHidden"
                row="0"
                :title="title"
                :subtitle="subtitle"
                :showMenuIcon="showMenuIcon"
                :backgroundColor="actionBarBackroundColor"
                :height="actionBarHeight"
                :elevation="actionBarElevation"
                :showLogo="actionBarShowLogo"
                :modalWindow="modal"
                @titleTap="$emit('actionBarTitleTap', $event)"
            >
                <slot name="actionBarRightButtons" slot="rightButtons" />
                <slot name="actionBarSubView" slot="subView" />
            </CActionBar>
            <CActionBar v-if="!bottomActionBarHidden" row="3" :showMenuIcon="showMenuIcon" :showLogo="false" :backgroundColor="actionBarBackroundColor" :height="actionBarButtonHeight" :elevation="actionBarElevation">
                <slot name="bottomActionBarRightButtons" slot="rightButtons" />
                <slot name="bottomActionBarLeftButtons" slot="leftButtons" />
            </CActionBar>
            <Label  row="2" v-if="mdiAction" height="24"/>
            <Button v-if="mdiAction" class="floating-btn" row="2" rowSpan="2" :fontSize="mdiActionFontSize" :class="mdiActionClass" :text="mdiAction" horizontalAlignment="center" verticalAlignment="top" @tap="$emit('actionTap', $event)"/>

            <MDActivityIndicator v-show="loading" row="1" :busy="{ loading }" verticalAlignment="center" horizontalAlignment="center" />
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./CairnPage.ts" />
