import ActivityIndicatorPlugin from 'nativescript-material-activityindicator/vue';
import ButtonPlugin from 'nativescript-material-button/vue';
import CardViewPlugin from 'nativescript-material-cardview/vue';
import ProgressPlugin from 'nativescript-material-progress/vue';
import RipplePlugin from 'nativescript-material-ripple/vue';
import SliderPlugin from 'nativescript-material-slider/vue';
import TextFieldPlugin from 'nativescript-material-textfield/vue';
import BottomSheetPlugin from 'nativescript-material-bottomsheet/vue';
import CartoPlugin from 'nativescript-carto/vue';
import CollectionViewPlugin from 'nativescript-collectionview/vue';
import FabPlugin from 'nativescript-vue-fab';
import CActionBar from '~/components/CActionBar';
const Plugin = {
    install(Vue) {
        Vue.component('CActionBar', CActionBar);
        Vue.use(ActivityIndicatorPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(CardViewPlugin);
        Vue.use(ProgressPlugin);
        Vue.use(RipplePlugin);
        Vue.use(SliderPlugin);
        Vue.use(TextFieldPlugin);
        Vue.use(BottomSheetPlugin);
        Vue.use(CartoPlugin);
        Vue.use(FabPlugin);
        Vue.use(CollectionViewPlugin);

        Vue.registerElement('HTMLLabel', () => require('nativescript-htmllabel').Label);
        Vue.registerElement('PullToRefresh', () => require('nativescript-pulltorefresh').PullToRefresh);
        // registerElement('SVGImage', () => require('@teammaestro/nativescript-svg').SVGImage);
    }
};

export default Plugin;