<template>
    <MDCardView class="actionBar" isUserInteractionEnabled="false" elevation="4">
        <GridLayout columns="auto,*, auto" paddingLeft="5" paddingRight="5">
            <StackLayout col="1" colSpan="3" verticalAlignment="center">
                <Label class="actionBarTitle" v-if="title" textAlignment="left" :text="title | titlecase" />
                <Label :visibility="!!subtitle ? 'visible' : 'collapse'" textAlignment="left" class="actionBarSubtitle" :text="subtitle" />
            </StackLayout>
            <Label col="1" colSpan="2" v-if="!!showLogo && !title" class="cairn" fontSize="60" color="white" :text="'cairn-full_logo' | fonticon" verticalAlignment="center" horizontalAlignment="left" marginLeft="0" />
            <MDButton col="0" variant="flat" :visibility="menuIconVisibility" class="icon-btn" :text="menuIcon | fonticon" @tap="onMenuIcon" />
            <StackLayout col="2" orientation="horizontal">
                <slot />
            </StackLayout>
        </GridLayout>
    </MDCardView>
</template>

 <script lang="ts" src="./CActionBar.ts"/>

