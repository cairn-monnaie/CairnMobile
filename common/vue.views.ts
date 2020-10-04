import { installMixins } from '@nativescript-community/ui-material-core';
installMixins();
import { installMixins as installUIMixins } from '@nativescript-community/systemui';
installUIMixins();
import { install as installBottomSheets } from '@nativescript-community/ui-material-bottomsheet';
installBottomSheets();
import { install as installGestures } from '@nativescript-community/gesturehandler';
installGestures();
import { Label as HTMLLabel, enableIOSDTCoreText } from '@nativescript-community/ui-label'; // require first to get Font res loading override

import ActivityIndicatorPlugin from '@nativescript-community/ui-material-activityindicator/vue';
import BottomSheetPlugin from '@nativescript-community/ui-material-bottomsheet/vue';
import CartoPlugin from '@nativescript-community/ui-carto/vue';
import CollectionViewPlugin from '@nativescript-community/ui-collectionview/vue';
import ImagePlugin from '@nativescript-community/ui-image/vue';
import CActionBar from '~/common/components/CActionBar';
import ListItem from '~/common/components/ListItem';
import EditableListItem from '~/common/components/EditableListItem';
import CairnPage from '~/common/components/CairnPage';
import Pager from '@nativescript-community/ui-pager/vue';

const Plugin = {
    install(Vue) {
        Vue.component('CActionBar', CActionBar);
        Vue.component('ListItem', ListItem);
        Vue.component('EditableListItem', EditableListItem);
        Vue.component('CairnPage', CairnPage);
        Vue.use(ActivityIndicatorPlugin);
        Vue.use(ImagePlugin);
        Vue.use(BottomSheetPlugin);
        Vue.use(CartoPlugin);
        Vue.use(CollectionViewPlugin);
        // Vue.use(CanvasLabelPlugin)
        Vue.use(Pager);

        Vue.registerElement('Button', () => require('@nativescript-community/ui-material-button').Button);
        Vue.registerElement('TextField', () => require('@nativescript-community/ui-material-textfield').TextField, {
            model: {
                prop: 'text',
                event: 'textChange'
            }
        });
        Vue.registerElement('Slider', () => require('@nativescript-community/ui-material-slider').Slider, {
            model: {
                prop: 'value',
                event: 'valueChange'
            }
        });
        Vue.registerElement('Label', () => HTMLLabel);
        enableIOSDTCoreText();
        Vue.registerElement('PullToRefresh', () => require('@akylas/nativescript-pulltorefresh').PullToRefresh);
        Vue.registerElement('BarcodeView', () => require('@nativescript-community/ui-barcodeview').BarcodeView);
        Vue.registerElement('AWebView', () => require('@nativescript-community/ui-webview').AWebView);
        // registerElement('SVGImage', () => require('@teammaestro/nativescript-svg').SVGImage);
    }
};

export default Plugin;
