<template>
    <GridLayout>
        <CartoMap ref="mapView" zoom="16" width="100%" height="100%" @mapReady="onMapReady" @mapMoved="onMapMove" @mapStable="onMapStable" />
        <!-- <MDButton v-if="showLocationButton" @tap="askUserLocation" class="floating-btn" margin="8" :text="'mdi-crosshairs-gps' | fonticon" horizontalAlignment="right" verticalAlignment="bottom" /> -->
    </GridLayout>
</template>

<script lang="ts" src="./MapComponent.ts"/>