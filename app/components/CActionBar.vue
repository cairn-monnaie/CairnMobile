<template>
    <StackLayout class="actionBar">
        <GridLayout class="actionBarBar" orientation="horizontal" ios:paddingTop="0.001" columns="auto,*">
            <MDButton col="0" variant= "text" :visibility="canGoBack ? 'visible' : 'hidden'" class="actionBarButton" :text="($isIOS? 'mdi-chevron-left' : 'mdi-arrow-left') | fonticon" @tap="onBackButton" />
            <StackLayout :col="$isIOS && !canGoBack ? 0 : 1" ios:colSpan="2" verticalAlignment="center">
                <Label class="actionBarTitle" :textAlignment="$isIOS && !canGoBack ? 'center' : 'left'" verticalAlignment="center" :text="title | L | titlecase"/>
                <Label :visibility="!!subtitle ? 'visible' : 'hidden'"  :textAlignment="$isIOS && !canGoBack ? 'center' : 'left'" class="actionBarSubtitle" verticalAlignment="center" :text="subtitle" />
            </StackLayout>
        </GridLayout>
        <slot />
    </StackLayout>
</template>

 <script lang="ts" src="./CActionBar.ts" />
