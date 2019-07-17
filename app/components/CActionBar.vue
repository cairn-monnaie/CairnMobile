<template>
        <GridLayout class="actionBar" columns="auto,*, auto" paddingLeft="5" paddingRight="5">
            <StackLayout col="1" colSpan="3" verticalAlignment="center">
                <Label class="actionBarTitle" :visibility="!!title ? 'visible' : 'hidden'" textAlignment="left" :text="title || '' | L | uppercase" />
                <Label :visibility="!!subtitle ? 'visible' : 'collapse'" textAlignment="left" class="actionBarSubtitle" :text="subtitle" />
            </StackLayout>
            <!-- <Image col="1"  v-if="!title" src="~/assets/microoled_logo.png" height="40%" horizontalAlignment="left" marginLeft="10"/> -->
            <Label col="0" colSpan="2"  v-if="!!showLogo && !title" class="cairn" fontSize="70" color="white" :text="'cairn-full_logo' | fonticon" verticalAlignment="center" horizontalAlignment="center" marginLeft="6"/>
            <MDButton col="0" variant="flat" :visibility="menuIconVisibility" class="icon-btn" :text="menuIcon | fonticon" @tap="onMenuIcon" />
            <StackLayout col="2" orientation="horizontal">
                <slot />
            </StackLayout>
        </GridLayout>
</template>

 <script lang="ts" src="./CActionBar.ts"/>

