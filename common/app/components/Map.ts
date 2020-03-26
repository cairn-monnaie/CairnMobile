import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import InteractiveMap from './InteractiveMap';
import { ComponentIds } from './App';

@Component({
    components: {
        InteractiveMap
    }
})
export default class Map extends PageComponent {
    navigateUrl = ComponentIds.Map;

}
