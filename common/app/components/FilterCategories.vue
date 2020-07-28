<template>
    <GridLayout height="400" @shownInBottomSheet="onShownInBottomSheet()" borderRadius="10">
        <CollectionView id="trackingScrollView" :items="dataItems" rowHeight="60" :itemIdGenerator="(item,i)=>i">
            <v-template>
                <GridLayout @tap="onTap(item)" class="listitem" padding="10" columns="*,auto">
                        <Label class="title" :text="item.name" verticalAlignment="center"/>
                        <Label col="1" v-show="item.selected" class="mdi" text="mdi-check" fontSize="30" :color="accentColor" verticalAlignment="center"/>
                </GridLayout>
                <!-- <ListItem :title="item.moduleName" :subtitle="item.moduleUrl" :date="item.moduleVersion" @tap="onTap(item)" /> -->
            </v-template>
        </CollectionView>
    </GridLayout>
</template> 

<script src="./FilterCategories.ts" />
