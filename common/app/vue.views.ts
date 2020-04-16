import { installMixins } from 'nativescript-material-core';
installMixins();
import { installMixins as installUIMixins } from 'nativescript-systemui';
installUIMixins();
import { Label as HTMLLabel } from 'nativescript-htmllabel'; // require first to get Font res loading override

import ActivityIndicatorPlugin from 'nativescript-material-activityindicator/vue';
// import ButtonPlugin from 'nativescript-material-button/vue';
// import CardViewPlugin from 'nativescript-material-cardview/vue';
// import ProgressPlugin from 'nativescript-material-progress/vue';
// import RipplePlugin from 'nativescript-material-ripple/vue';
// import SliderPlugin from 'nativescript-material-slider/vue';
import TextFieldPlugin from 'nativescript-material-textfield/vue';
import BottomSheetPlugin from 'nativescript-material-bottomsheet/vue';
import CartoPlugin from 'nativescript-carto/vue';
import CollectionViewPlugin from 'nativescript-collectionview/vue';
// import FabPlugin from 'nativescript-vue-fab';
import ImagePlugin from 'nativescript-image/vue';
import CActionBar from '~/components/CActionBar';
import ListItem from '~/components/ListItem';
import EditableListItem from '~/components/EditableListItem';
import CairnPage from '~/components/CairnPage';
import Pager from 'nativescript-pager/vue';

const Plugin = {
    install(Vue) {
        Vue.component('CActionBar', CActionBar);
        Vue.component('ListItem', ListItem);
        Vue.component('EditableListItem', EditableListItem);
        Vue.component('CairnPage', CairnPage);
        Vue.use(ActivityIndicatorPlugin);
        Vue.use(ImagePlugin);
        // Vue.use(ButtonPlugin);
        // Vue.use(CardViewPlugin);
        // Vue.use(ProgressPlugin);
        // Vue.use(RipplePlugin);
        // Vue.use(SliderPlugin);
        Vue.use(TextFieldPlugin);
        Vue.use(BottomSheetPlugin);
        Vue.use(CartoPlugin);
        // Vue.use(FabPlugin);
        Vue.use(CollectionViewPlugin);
        Vue.use(Pager);

        Vue.registerElement('Button',() => require('nativescript-material-button').Button);
        Vue.registerElement('TextField',() => require('nativescript-material-textfield').TextField);
        Vue.registerElement('Label', () => HTMLLabel);
        Vue.registerElement('PullToRefresh', () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh);
        Vue.registerElement('BarcodeView', () => require('nativescript-barcodeview').BarcodeView);
        // registerElement('SVGImage', () => require('@teammaestro/nativescript-svg').SVGImage);
    }
};

export default Plugin;
