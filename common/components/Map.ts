import { Component } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import InteractiveMap from './InteractiveMap';

@Component({
    components: {
        InteractiveMap
    }
})
export default class Map extends PageComponent {
    navigateUrl = ComponentIds.Map;

}
