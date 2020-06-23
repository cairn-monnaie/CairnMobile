<template>
    <GridLayout :opacity="opacity" @layoutChanged="onLayoutChange">
        <MapComponent ref="mapComp" rowSpan="2" showLocationButton="true" @mapReady="onMapReady" @mapStable="onMapStable" @elementClick="onElementClick" :vectorTileClicked="onVectorTileClicked"/>
        <GridLayout verticalAlignment="bottom" :translateY="-bottomSheetTranslation" :opacity="scrollingWidgetsOpacity">
            <Button @tap="askUserLocation" class="floating-btn" margin="8" text="mdi-crosshairs-gps" horizontalAlignment="right" verticalAlignment="bottom" />
        </GridLayout>
        <BottomSheetHolder rowSpan="2" ref="bottomSheetHolder" :peekerSteps="bottomSheetSteps" isPassThroughParentEnabled="true" @close="unselectItem" @scroll="onBottomSheetScroll" >
            <MapBottomSheet slot="bottomSheet" :item="selectedItem" :steps="bottomSheetSteps" />
        </BottomSheetHolder>
        <MDActivityIndicator v-show="loading" row="1" :busy="{ loading }" verticalAlignment="center" horizontalAlignment="center" />
    </GridLayout>
</template>

<script lang="ts" src="./InteractiveMap.ts" />
