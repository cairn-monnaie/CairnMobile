<template>
    <AbsoluteLayout @layoutChanged="onLayoutChange" isPassThroughParentEnabled>
        <!-- <AbsoluteLayout isPassThroughParentEnabled> -->
        <StackLayout ref="scrollingView" width="100%" :translateY="mCurrentViewHeight" :height="translationMaxOffset" backgroundColor="#ffffff">
            <slot name="bottomSheet" />
        </StackLayout>
        <!-- </AbsoluteLayout> -->
    </AbsoluteLayout>
</template>
<script lang="ts" src="./BottomSheetHolder.ts"/>
