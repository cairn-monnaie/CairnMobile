import AuthService, { getAuthInstance } from '~/services/AuthService';

@JavaProxy('com.akylas.cairnmobile.SmsReceiver')
export class SmsReceiver extends android.content.BroadcastReceiver {
    public onReceive(context: android.content.Context, intent: android.content.Intent) {
        console.log('onReceive ', intent.getAction());
        if (intent.getAction() !== 'android.provider.Telephony.SMS_RECEIVED') {
            return;
        }
        const msgs = android.provider.Telephony.Sms.Intents.getMessagesFromIntent(intent);
        for (let index = 0; index < msgs.length; index++) {
            const msg = msgs[index];
            let sender = msg.getDisplayOriginatingAddress();
            const text = msg.getMessageBody();

            if (/PAYER\s+([0-9]+)\s+([A-Z]|[0-9])+/.test(text)) {
                console.log('received sms', sender, text);
                if (/0[0-9]{9}/.test(sender)) {
                    sender = `+33${sender.slice(1)}`;
                }

                getAuthInstance().fakeSMSPayment(sender, text).then(() =>{ 
                    const intent = new android.content.Intent('com.akylas.cairnmobile.SMS_RECEIVED');
                    intent.putExtra('message', text);
                    intent.putExtra('sender', sender);
                    // androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(context).sendBroadcast(intent);
                    context.sendBroadcast(intent);
                })
                
            }

            // }
        }
    }
}
