import { android as androidApp, } from '@nativescript/core/application';
import Vue from 'nativescript-vue';
import App from '~/components/App';
@JavaProxy('com.akylas.cairnmobile.QRCodeTileService')
class QRCodeTileService extends android.service.quicksettings.TileService {

    onClick() {
        super.onClick();
        if (!this.isSecure()) {
            this.handleClick();
        } else {
            this.unlockAndRun(new java.lang.Runnable({
                run: ()=>this.handleClick()
            }));
        }

        // androidApp.context.overridePendingTransition(0,0);
    }
    handleClick() {
        const appComp = Vue.prototype.$getAppComponent() as App;
        console.log('handleClick', appComp.isVisisble());
        if (appComp && appComp.isVisisble()) {
            appComp.askToScanQrCode();
            const activityClass = (com as any).tns.NativeScriptActivity.class;
            const tapActionIntent = new android.content.Intent(this, activityClass);
            tapActionIntent.setAction(android.content.Intent.ACTION_MAIN);
            tapActionIntent.addCategory(android.content.Intent.CATEGORY_LAUNCHER);
            tapActionIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_SINGLE_TOP | android.content.Intent.FLAG_ACTIVITY_CLEAR_TOP);
            this.startActivityAndCollapse(tapActionIntent);
            return;
        }
        // Called when the user click the tile
        const intent = new android.content.Intent(this, com.akylas.cairnmobile.FloatingActivity.class);
        // intent.putExtra('data', JSON.stringify(result));
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        this.startActivityAndCollapse(intent);
    }

    onTileRemoved() {
        super.onTileRemoved();
        // Do something when the user removes the Tile
    }

    onTileAdded() {
        super.onTileAdded();
        // Do something when the user add the Tile
    }

    onStartListening() {
        super.onStartListening();
        // Called when the Tile becomes visible
    }

    onStopListening() {
        super.onStopListening();
        // Called when the tile is no longer visible
    }
}
