import { Observable } from '@nativescript/core/data/observable';
import { booleanProperty } from './BackendService';
import * as Sentry from 'nativescript-akylas-sentry';
import { getBuildNumber, getVersionName } from 'nativescript-extendedinfo';
import { device } from '@nativescript/core/platform';
import { alert, confirm } from 'nativescript-material-dialogs';
import { Label as HTMLLabel } from 'nativescript-htmllabel';
import { l as $t, lc as $tc, lt as $tt, lu as $tu } from 'nativescript-l';
import { CustomError, HTTPError, NoNetworkError } from './NetworkService';
import { Color } from '@nativescript/core/ui/frame';

export default class CrashReportService extends Observable {
    @booleanProperty({ default: true }) sentryEnabled: boolean;
    sentry: typeof Sentry;
    async start() {
        console.log('CrashReportService', 'start', gVars.sentry, this.sentryEnabled);
        if (gVars.sentry && this.sentryEnabled) {
            const Sentry = await import('nativescript-akylas-sentry');
            this.sentry = Sentry;
            const versionName = await getVersionName();
            const buildNumber = await getBuildNumber();
            Sentry.init({
                dsn: SENTRY_DSN,
                appPrefix: SENTRY_PREFIX,
                release: `${versionName}`,
                dist: `${buildNumber}.${gVars.isAndroid ? 'android' : 'ios'}`
            });
            Sentry.setTag('locale', device.language);
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
                    scope.setUser({ errorData: err.assignedLocalData });
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
        const isString = realError === null;
        const message = isString ? (err as string) : realError.message || realError.toString();
        let title = $tc('error');
        const reporterEnabled = this.sentryEnabled;
        let showSendBugReport = reporterEnabled && !isString && !!realError.stack;
        if (realError instanceof HTTPError) {
            title = `${title} (${realError.statusCode})`;
        } else if (realError instanceof NoNetworkError) {
            showSendBugReport = false;
        }
        console.log('$showError', err, err['stack']);
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
