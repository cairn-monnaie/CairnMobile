import { throttle } from 'helpful-decorators';
import { ClickType, MapBounds, MapPos } from 'nativescript-carto/core/core';
import { GeoJSONVectorTileDataSource } from 'nativescript-carto/datasources/datasource';
import { VectorTileEventData, VectorTileLayer } from 'nativescript-carto/layers/vector';
import { CartoMap } from 'nativescript-carto/ui/ui';
import { MBVectorTileDecoder } from 'nativescript-carto/vectortiles/vectortiles';
import * as appSettings from 'tns-core-modules/application-settings';
import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import { User } from '~/services/AuthService';
import { ComponentIds } from './App';
import BottomSheetHolder, { BottomSheetHolderScrollEventData } from './BottomSheet/BottomSheetHolder';
import MapBottomSheet from './MapBottomSheet';
import MapComponent from './MapComponent';
const GeoJSON = require('geojson');

@Component({
    components: {
        MapComponent,
        MapBottomSheet,
        BottomSheetHolder
    }
})
export default class Map extends PageComponent {
    navigateUrl = ComponentIds.Map;
    _cartoMap: CartoMap;
    _localVectorDataSource: GeoJSONVectorTileDataSource;
    localVectorLayer: VectorTileLayer;
    currentBounds: MapBounds;
    selectedItem: User = null;

    bottomSheetTranslation = 0;
    bottomSheetPercentage = 0;
    get scrollingWidgetsOpacity() {
        if (this.bottomSheetPercentage <= 0.5) {
            return 1;
        }
        return 4 * (2 - 2 * this.bottomSheetPercentage) - 3;
    }
    onBottomSheetScroll(e: BottomSheetHolderScrollEventData) {
        // console.log('onBottomSheetScroll', e);
        this.bottomSheetTranslation = e.height;
        this.bottomSheetPercentage = e.percentage;
    }

    get bottomSheetSteps() {
        const result = [70];

        return result;
    }
    get bottomSheetHolder() {
        return this.$refs['bottomSheetHolder'] as BottomSheetHolder;
    }

    get mapComp() {
        return this.$refs['mapComp'] as MapComponent;
    }

    get bottomSheet() {
        return this.bottomSheetHolder.bottomSheet;
    }
    get cartoMap() {
        return this.mapComp.cartoMap;
    }
    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }
    // map: Mapbox;
    onMapReady(e) {
        const map = (this._cartoMap = e.object as CartoMap);
        // this.refresh();
        const pos = JSON.parse(appSettings.getString('mapFocusPos', '{"latitude":45.2002,"longitude":5.7222}')) as MapPos;
        const zoom = appSettings.getNumber('mapZoom', 10);
        console.log('map start pos', pos, zoom);
        map.setFocusPos(pos, 0);
        map.setZoom(zoom, 0);
    }

    @throttle(100)
    saveSettings() {
        if (!this._cartoMap) {
            return;
        }
        const cartoMap = this._cartoMap;
        appSettings.setNumber('mapZoom', cartoMap.zoom);
        appSettings.setString('mapFocusPos', JSON.stringify(cartoMap.focusPos));
    }

    onMapStable(e) {
        if (this.ignoreStable) {
            this.ignoreStable = false;
            return;
        }
        this.saveSettings();
        const map = e.object as CartoMap;
        const currentBounds = new MapBounds(map.screenToMap({ x: this.nativeView.getMeasuredWidth(), y: 0 }), map.screenToMap({ x: 0, y: this.nativeView.getMeasuredHeight() }));
        console.log('onMapStable', this.currentBounds, currentBounds);
        if (!this.currentBounds || !currentBounds.equals(this.currentBounds)) {
            this.currentBounds = currentBounds;
            this.refresh(currentBounds);
        }
    }

    get localVectorDataSource() {
        if (!this._localVectorDataSource && this._cartoMap) {
            this._localVectorDataSource = new GeoJSONVectorTileDataSource({
                minZoom: 0,
                maxZoom: 24
            });
            const result = this._localVectorDataSource.createLayer('cairn');
            console.log('addLayer', result);
        }
        return this._localVectorDataSource;
    }
    getOrCreateLocalVectorLayer() {
        if (!this.localVectorLayer && this._cartoMap) {
            this.localVectorLayer = new VectorTileLayer({
                preloading: true,

                dataSource: this.localVectorDataSource,
                decoder: new MBVectorTileDecoder({
                    style: 'voyager',
                    liveReload: TNS_ENV !== 'production',
                    dirPath: `~/assets/styles/cairn`
                })
            });

            // always add it at 1 to respect local order
            this.localVectorLayer.setVectorTileEventListener(this, this._cartoMap.projection);
            this._cartoMap.addLayer(this.localVectorLayer);
        }
        return this.localVectorLayer;
    }
    onVectorTileClicked(data: VectorTileEventData) {
        const { clickType, position, featureLayerName, featureData, featurePosition } = data;
        console.log('onVectorTileClicked', featureLayerName, featureData.class, featureData.subclass, featureData.name, featureData.ele, featureData);
        if (clickType === ClickType.SINGLE) {
            // const map = this._cartoMap;
            const user = this.shownUsers.find(u => u.id === (featureData.id as any));
            if (user) {
                this.selectItem(user);
            }
            console.log(`onVectorTileClicked : name:${featureData.name} layer: ${featureLayerName} class: ${featureData.class}`);
        }
        return true;
    }
    ignoreStable = false;
    shownUsers: User[] = [];
    @throttle(1000)
    refresh(mapBounds: MapBounds) {
        console.log('refresh', mapBounds);

        // console.log("refreshing")
        this.loading = true;
        this.$authService
            .getUserForMap(mapBounds)
            .then(r => {
                this.shownUsers = r;
                if (r.length > 0) {
                    const geojson = GeoJSON.parse(r, { Point: ['address.latitude', 'address.longitude'], include: ['name', 'id'] });
                    // const projection = this._cartoMap.projection;
                    // const reader = new GeoJSONGeometryReader({
                    //     targetProjection: projection
                    // });
                    // public readFeatureCollection(param0: string): com.carto.geometry.FeatureCollection;

                    this.getOrCreateLocalVectorLayer();
                    this.ignoreStable = true;
                    // const features = reader.readFeatureCollection(JSON.stringify(geojson));
                    // const feature =  features.getFeature(0);
                    // this.log('refresh result', r.length, geojson, features.getFeatureCount(), feature.properties, fromNativeMapPos(feature.geometry.getCenterPos()));
                    // this.localVectorDataSource.setLayerFeatureCollection(1, projection, features);
                    this.localVectorDataSource.setLayerGeoJSON(1, geojson);
                }

                this.loading = false;
            })
            .catch(err => this.showError(err));
    }
    selectItem(item: User) {
        this.log('selectItem', item);
        this.selectedItem = item;
        // if (item.zoomBounds) {
        //     const zoomLevel = getBoundsZoomLevel(item.zoomBounds, { width: screen.mainScreen.widthPixels, height: screen.mainScreen.heightPixels });
        //     this.cartoMap.setZoom(zoomLevel, getCenter(item.zoomBounds.northeast, item.zoomBounds.southwest), 200);
        // } else {
        this.cartoMap.setFocusPos(item.address, 200);
        this.localVectorLayer.getTileDecoder().setStyleParameter('selected_id', item.id + '');
        // }
        this.bottomSheetHolder.peek();
    }
    unselectItem() {
        this.log('unselectItem', !!this.selectedItem);
        if (!!this.selectedItem) {
            this.selectedItem = null;
            this.localVectorLayer.getTileDecoder().setStyleParameter('selected_id', '');

            this.bottomSheetHolder.close();
        }
    }
    askUserLocation() {
        return this.mapComp.askUserLocation();
    }
    // onUpdateSessionEvent(e: SessionEventData) {
    //     this.onUpdateSession(e.data);
    // }

    // onServiceLoaded(bluetoothHandler: BluetoothHandler, geoHandler: GeoHandler) {
    //     this.geoHandlerOn(SessionUpdatedEvent, this.onUpdateSessionEvent);
    //     this.onUpdateSession(geoHandler.getCurrentSession());
    // }
}
