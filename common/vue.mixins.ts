import { clog } from '~/common/utils/logging';
import { BackstackEntry, Frame as NSFrame } from '@nativescript/core/ui/frame';
import { Page } from '@nativescript/core/ui/page';
import { navigateUrlProperty } from './components/App';

declare module '@nativescript/core/ui/frame' {
    interface Frame {
        _onNavigatingTo(backstackEntry: BackstackEntry, isBack: boolean);
    }
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);

            if (name === 'constructor') return;
            if (descriptor && (descriptor.get || descriptor.set)) {
                Object.defineProperty(derivedCtor.prototype, name, descriptor);
            } else {
                const oldImpl = derivedCtor.prototype[name];
                if (!oldImpl) {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                } else {
                    derivedCtor.prototype[name] = function(...args) {
                        oldImpl.apply(this, args);
                        baseCtor.prototype[name].apply(this, args);
                    };
                }
            }
        });
        Object.getOwnPropertySymbols(baseCtor.prototype).forEach(symbol => {
            const oldImpl: Function = derivedCtor.prototype[symbol];
            if (!oldImpl) {
                derivedCtor.prototype[symbol] = baseCtor.prototype[symbol];
            } else {
                derivedCtor.prototype[symbol] = function(...args) {
                    oldImpl.apply(this, args);
                    baseCtor.prototype[symbol].apply(this, args);
                };
            }
        });
    });
}

class FrameWithEvents extends NSFrame {
    _updateBackstack(entry: BackstackEntry, navigationType) {
        // console.log('_updateBackstack', !!entry);
        const isBack = navigationType === 'back';
        // super._onNavigatingTo(backstackEntry, isBack);
        this.notify({
            eventName: Page.navigatingToEvent,
            object: this,
            isBack,
            entry
        });
        // console.log('_onNavigatingTo2', backstackEntry.resolvedPage[navigateBackToUrlProperty], isBack);
    }
}

const Plugin = {
    install(Vue) {
        const NSFrame = require('@nativescript/core/ui/frame').Frame;
        applyMixins(NSFrame, [FrameWithEvents]);
    }
};

export default Plugin;
