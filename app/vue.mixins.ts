import { clog } from '~/utils/logging';
import { BackstackEntry, Frame as NSFrame } from 'tns-core-modules/ui/frame';
import { Page } from 'tns-core-modules/ui/page';
import { navigateUrlProperty } from './components/App';

declare module 'tns-core-modules/ui/frame' {
    interface Frame {
        _onNavigatingTo(backstackEntry: BackstackEntry, isBack: boolean);
    }
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);

            if (name === 'constructor') return;
            if (descriptor && (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable || descriptor.get || descriptor.set)) {
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
        clog('installing view mixins');
        const NSFrame = require('tns-core-modules/ui/frame').Frame;
        applyMixins(NSFrame, [FrameWithEvents]);
    }
};

export default Plugin;
