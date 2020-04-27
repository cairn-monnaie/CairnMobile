import { Component, Prop } from 'vue-property-decorator';
import ListItem from '~/components/ListItem';
import { iconColor } from '~/variables';

@Component({
    inheritAttrs: false
})
export default class EditableListItem extends ListItem {
    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }
}
