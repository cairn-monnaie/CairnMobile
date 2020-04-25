<template>
    <GridLayout height="400" @shownInBottomSheet="onShownInBottomSheet()" borderRadius="10">
        <CollectionView id="trackingScrollView" :items="dataItems" rowHeight="60">
            <v-template>
                <GridLayout @tap="onTap(item)" class="listitem" padding="10">
                    <StackLayout class="title-holder">
                        <Label class="title" :text="item.moduleName" />
                        <Label class="subtitle" :text="item.moduleUrl" />
                    </StackLayout>
                </GridLayout>
                <!-- <ListItem :title="item.moduleName" :subtitle="item.moduleUrl" :date="item.moduleVersion" @tap="onTap(item)" /> -->
            </v-template>
        </CollectionView>
    </GridLayout>
</template> 

<script src="./ThirdPartySoftwareBottomSheet.ts" />
