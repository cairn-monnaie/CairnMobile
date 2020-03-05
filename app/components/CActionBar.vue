<template>
    <GridLayout class="actionBar" columns="auto,*, auto" rows="auto,auto">
        <StackLayout col="1" colSpan="3" orientation="horizontal" :height="height">
            <StackLayout verticalAlignment="center">
                <Label class="actionBarTitle" v-if="title" textAlignment="left" :text="title | capitalize" />
                <Label :visibility="!!subtitle ? 'visible' : 'collapse'" textAlignment="left" class="actionBarSubtitle" :text="subtitle" />
            </StackLayout>
        </StackLayout>
        <ContentView col="1" colSpan="2" :height="height">
            <slot name="title">
                <Label v-if="!!showLogo && !title" :fontFamily="cairnFontFamily" :fontSize="Math.min(height, 200)" color="white" text="cairn-full_logo" verticalAlignment="center" @tap="$emit('titleTap', $event)" />
            </slot>
        </ContentView>
        <slot row="1" colSpan="3" name="subView" />

        <StackLayout orientation="horizontal" col="2" verticalAlignment="top" :height="height">
            <slot name="rightButtons" />
        </StackLayout>
        <StackLayout col="0" verticalAlignment="top" :height="height" orientation="horizontal">
            <MDButton verticalAlignment="center" rippleColor="white" variant="flat" v-show="menuIconVisible" class="icon-btn" :text="menuIcon" @tap="onMenuIcon" />
        </StackLayout>
        <!-- <StackLayout col="2" orientation="horizontal"> -->
        <!-- </StackLayout> -->
        <!-- <ContentView > -->
        <!-- </ContentView> -->
    </GridLayout>
</template>

 <script lang="ts" src="./CActionBar.ts"/>

