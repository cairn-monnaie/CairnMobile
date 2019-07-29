<template>
    <Page ref="page" :navigateUrl="navigateUrl">
        <GridLayout rows="auto,*">
            <CActionBar row="0" title="map" showMenuIcon="true" />
            <GridLayout row="1" rowSpan="2" rows="*,150" class="pageContent">
                <MapComponent ref="mapComp" rowSpan="2" height="100%" width="100%" showLocationButton="true" @mapReady="onMapReady" @mapStable="onMapStable" />
                <BottomSheetHolder rowSpan="2" ref="bottomSheetHolder" width="100%" height="100%" :peekerSteps="bottomSheetSteps" isPassThroughParentEnabled="true" @close="unselectItem" @scroll="onBottomSheetScroll">
                    <GridLayout :paddingBottom="bottomSheetTranslation" :opacity="scrollingWidgetsOpacity">
                        <MDButton @tap="askUserLocation" class="floating-btn" margin="8" :text="'mdi-crosshairs-gps' | fonticon" horizontalAlignment="right" verticalAlignment="bottom" />

                    </GridLayout>
                    <MapBottomSheet slot="bottomSheet" :item="selectedItem" :steps="bottomSheetSteps" />
                </BottomSheetHolder>

            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./Map.ts"/>