import { android as androidApp } from '@nativescript/core/application';
import { device } from '@nativescript/core/platform';
import Vue from 'nativescript-vue';
import App from '~/components/App';
import AuthService from '~/services/AuthService';
import { $t } from '~/helpers/locale';

function isOnUiThread() {
    return android.os.Looper.myLooper() === android.os.Looper.getMainLooper();
}

const _sdkVersion = parseInt(device.sdkVersion, 10);
if (_sdkVersion >= 24) {
    @JavaProxy('com.akylas.cairnmobile.QRCodeTileService')
    class QRCodeTileService extends android.service.quicksettings.TileService {
        onClick() {
            super.onClick();
            if (!this.isSecure()) {
                this.handleClick();
            } else {
                this.unlockAndRun(
                    new java.lang.Runnable({
                        run: () => this.handleClick()
                    })
                );
            }

            // androidApp.context.overridePendingTransition(0,0);
        }

        showApp() {
            const activityClass = (com as any).tns.NativeScriptActivity.class;
            const tapActionIntent = new android.content.Intent(this, activityClass);
            tapActionIntent.setAction(android.content.Intent.ACTION_MAIN);
            tapActionIntent.addCategory(android.content.Intent.CATEGORY_LAUNCHER);
            tapActionIntent.setFlags(
                android.content.Intent.FLAG_ACTIVITY_NEW_TASK |
                    android.content.Intent.FLAG_ACTIVITY_SINGLE_TOP |
                    android.content.Intent.FLAG_ACTIVITY_CLEAR_TOP
            );
            this.startActivityAndCollapse(tapActionIntent);
        }
        handleClick() {
            const appComp = Vue.prototype.$getAppComponent() as App;
            const authService = Vue.prototype.$authService as AuthService;
            console.log('handleClick', isOnUiThread, !!authService);
            if (!authService.isLoggedIn()) {
                this.showApp();
                android.widget.Toast.makeText(
                    androidApp.context,
                    $t('loggedin_needed'),
                    android.widget.Toast.LENGTH_SHORT
                ).show();
                return;
            }
            if (appComp && appComp.isVisisble()) {
                this.showApp();
                appComp.askToScanQrCode();
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
}
