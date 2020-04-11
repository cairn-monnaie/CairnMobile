<template>
    <GridLayout height="400" @shownInBottomSheet="onShownInBottomSheet()" borderRadius="10">
        <CollectionView :items="dataItems" rowHeight="80">
            <v-template>
                <ListItem :title="item.moduleName" :subtitle="item.moduleUrl" :date="item.moduleVersion" @tap="onTap(item)" />
            </v-template>
        </CollectionView>
    </GridLayout>
</template>

<script src="./ThirdPartySoftwareBottomSheet.ts" />
