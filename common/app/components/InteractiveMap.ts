import { throttle } from 'helpful-decorators';
import { ClickType, MapBounds, MapPos } from 'nativescript-carto/core';
import { VectorTileEventData } from 'nativescript-carto/layers/vector';
import { CartoMap } from 'nativescript-carto/ui';
import * as appSettings from '@nativescript/core/application-settings';
import { Component, Prop } from 'vue-property-decorator';
import { User } from '~/services/AuthService';
import BottomSheetHolder, { BottomSheetHolderScrollEventData } from './BottomSheet/BottomSheetHolder';
import MapBottomSheet from './MapBottomSheet';
import MapComponent from './MapComponent';
import BaseVueComponent from './BaseVueComponent';
import { layout } from '@nativescript/core/utils/utils';

@Component({
    components: {
        MapComponent,
        MapBottomSheet,
        BottomSheetHolder
    }
})
export default class InteractiveMap extends BaseVueComponent {
    @Prop({ default: 1 }) opacity: number;
    _cartoMap: CartoMap;
    currentBounds: MapBounds;
    selectedItem: User = null;

    bottomSheetTranslation = 0;
    bottomSheetPercentage = 0;
    shownUsers: User[] = [];
    loading = false;

    get scrollingWidgetsOpacity() {
        if (this.bottomSheetPercentage <= 0.5) {
            return 1;
        }
        return 4 * (2 - 2 * this.bottomSheetPercentage) - 3;
    }
    onBottomSheetScroll(e: BottomSheetHolderScrollEventData) {
        this.bottomSheetTranslation = e.height;
        this.bottomSheetPercentage = e.percentage;
    }

    get bottomSheetSteps() {
        const result = [80];

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
        // this.log('onMapReady');
        const map = (this._cartoMap = e.object as CartoMap);
        const pos = JSON.parse(appSettings.getString('mapFocusPos', '{"latitude":45.2002,"longitude":5.7222}')) as MapPos;
        const zoom = appSettings.getNumber('mapZoom', 10);
        map.setFocusPos(pos, 0);
        map.setZoom(zoom, 0);
    }
    onLayoutChange() {
        // sometimes onMapStable is not called at first so we need this
        // to make sure the map refreshes
        if (!this.currentBounds && this._cartoMap) {
            // we need to delay a bit or the map wont have its size
            setTimeout(() => {
                const map = this._cartoMap;
                this.currentBounds = new MapBounds(
                    map.screenToMap({ x: this.nativeView.getMeasuredWidth(), y: 0 }),
                    map.screenToMap({ x: 0, y: this.nativeView.getMeasuredHeight() })
                );
                this.refresh(this.currentBounds);
            }, 10);
        }
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
        this.saveSettings();
        const map = e.object as CartoMap;
        const currentBounds = new MapBounds(
            map.screenToMap({ x: this.nativeView.getMeasuredWidth(), y: 0 }),
            map.screenToMap({ x: 0, y: this.nativeView.getMeasuredHeight() })
        );
        // console.log('onMapStable', currentBounds);
        if (!this.currentBounds || !currentBounds.equals(this.currentBounds)) {
            this.currentBounds = currentBounds;
            this.refresh(currentBounds);
        }
    }

    onElementClick(...args) {
        this.log('onElementClick', args);
    }

    onVectorTileClicked(data: VectorTileEventData) {
        const { clickType, position, featureLayerName, featureData, featurePosition } = data;
        if (clickType === ClickType.SINGLE) {
            // const map = this._cartoMap;
            const user = this.shownUsers.find(u => u.id === (featureData.id as any));
            if (user) {
                this.selectItem(user);
            }
        }
        return true;
    }
    @throttle(2000)
    refresh(mapBounds: MapBounds) {
        // console.log('refresh', this._cartoMap.zoom, mapBounds);
        this.loading = true;
        this.$authService
            .getUsersForMap(mapBounds)
            .then(r => {
                // console.log('received', r.length, 'users for map');
                this.shownUsers = r;
                if (r.length > 0) {
                    // const geojson = GeoJSON.parse(r, { Point: ['address.latitude', 'address.longitude'], include: ['name', 'id'] });
                    this.mapComp.addGeoJSONPoints(r);
                    // this.ignoreStable = true;
                    // this.mapComp.localVectorTileDataSource.setLayerGeoJSON(1, geojson);
                }
            })
            .catch(this.showError)
            .finally(() => {
                this.loading = false;
            });
    }
    selectItem(item: User) {
        this.selectedItem = item;
        this.cartoMap.setFocusPos(item.address, 200);
        this.mapComp.localVectorTileLayer.getTileDecoder().setStyleParameter('selected_id', item.id + '');
        this.bottomSheetHolder.peek();
    }
    unselectItem() {
        if (!!this.selectedItem) {
            this.selectedItem = null;
            this.mapComp.localVectorTileLayer.getTileDecoder().setStyleParameter('selected_id', '');

            this.bottomSheetHolder.close();
        }
    }
    askUserLocation() {
        return this.mapComp.askUserLocation();
    }
}
