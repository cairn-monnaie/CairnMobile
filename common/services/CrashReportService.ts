import { Observable } from '@nativescript/core/data/observable';
import { booleanProperty } from './BackendService';
import * as Sentry from '@nativescript-community/sentry';
import { getBuildNumber, getVersionName } from '@nativescript-community/extendedinfo';
import { Device } from '@nativescript/core/platform';
import { alert, confirm } from '@nativescript-community/ui-material-dialogs';
import { Label as HTMLLabel } from '@nativescript-community/ui-label';
import { l as $t, lc as $tc, lt as $tt, lu as $tu } from '@nativescript-community/l';
import { CustomError, HTTPError, MessageError, NoNetworkError } from './NetworkService';
import { Color } from '@nativescript/core';

export default class CrashReportService extends Observable {
    @booleanProperty({ default: true }) sentryEnabled: boolean;
    sentry: typeof Sentry;
    async start() {
        console.log('CrashReportService', 'start', gVars.sentry, this.sentryEnabled);
        if (gVars.sentry && this.sentryEnabled) {
            const Sentry = await import('@nativescript-community/sentry');
            this.sentry = Sentry;
            const versionName = await getVersionName();
            const buildNumber = await getBuildNumber();
            Sentry.init({
                dsn: SENTRY_DSN,
                appPrefix: SENTRY_PREFIX,
                release: `${versionName}`,
                dist: `${buildNumber}.${global.isAndroid ? 'android' : 'ios'}`
            });
            Sentry.setTag('locale', Device.language);
            // });
        } else {
            this.sentry = null;
        }
    }
    async enable() {
        this.sentryEnabled = true;
        if (!this.sentry) {
            await this.start();
        }
    }
    async disable() {
        this.sentryEnabled = false;
    }

    captureException(err: Error | CustomError) {
        if (this.sentryEnabled && this.sentry) {
            if (err instanceof CustomError) {
                this.withScope(scope => {
                    scope.setExtra('errorData', JSON.stringify(err.assignedLocalData) );
                    this.sentry.captureException(err);
                });
            } else {
                return this.sentry.captureException(err);

            }
        }
    }
    captureMessage(message: string, level?: Sentry.Severity) {
        if (this.sentryEnabled && this.sentry) {
            return this.sentry.captureMessage(message, level);
        }
    }
    setExtra(key: string, value: any) {
        if (this.sentryEnabled && this.sentry) {
            return this.sentry.setExtra(key, value);
        }
    }
    withScope(callback: (scope: Sentry.Scope) => void) {
        if (this.sentryEnabled && this.sentry) {
            return this.sentry.withScope(callback);
        }
    }

    showError(err: Error | string) {
        const realError = typeof err === 'string' ? null : err;
        const isString = realError === null || realError === undefined;
        const message = isString ? (err as string) : realError.message || realError.toString();
        let title = $tc('error');
        const reporterEnabled = this.sentryEnabled;
        let showSendBugReport = reporterEnabled && !isString && !!realError.stack;
        if (realError instanceof HTTPError) {
            title = `${title} (${realError.statusCode})`;
        } else if (realError instanceof NoNetworkError || realError instanceof MessageError) {
            showSendBugReport = false;
        }
        console.log('showError', err, err['stack']);
        const label = new HTMLLabel();
        label.style.padding = '10 20 0 26';
        // label.style.backgroundColor = new Color(255, 255,0,0);
        label.style.fontSize = 16;
        label.style.color = new Color(255, 138, 138, 138);
        label.html = $tc(message.trim());
        return confirm({
            title,
            view: label,
            okButtonText: showSendBugReport ? $tc('send_bug_report') : undefined,
            cancelButtonText: showSendBugReport ? $tc('cancel') : $tc('ok')
        }).then(result => {
            if (result && showSendBugReport) {
                this.captureException(realError);
                alert($t('bug_report_sent'));
            }
        });
    }
}
