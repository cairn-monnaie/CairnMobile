<template>
    <GridLayout :opacity="opacity">
        <MapComponent ref="mapComp" rowSpan="2" showLocationButton="true" @mapReady="onMapReady" @mapStable="onMapStable" @elementClick="onElementClick" />
        <BottomSheetHolder rowSpan="2" ref="bottomSheetHolder" :peekerSteps="bottomSheetSteps" isPassThroughParentEnabled="true" @close="unselectItem" @scroll="onBottomSheetScroll">
            <GridLayout :paddingBottom="bottomSheetTranslation" :opacity="scrollingWidgetsOpacity">
                <MDButton @tap="askUserLocation" class="floating-btn" margin="8" text="mdi-crosshairs-gps" horizontalAlignment="right" verticalAlignment="bottom" />
            </GridLayout>
            <MapBottomSheet slot="bottomSheet" :item="selectedItem" :steps="bottomSheetSteps" />
        </BottomSheetHolder>
            <MDActivityIndicator v-show="loading" row="1" :busy="{ loading }" verticalAlignment="center" horizontalAlignment="center" />
    </GridLayout>
</template>

<script lang="ts" src="./InteractiveMap.ts" />
