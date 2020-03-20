// import { getBoolean, getNumber, getString, remove, setBoolean, setNumber, setString } from '@nativescript/core/application-settings';
import { Observable } from '@nativescript/core/data/observable';
import { SecureStorage } from 'nativescript-secure-storage';

const secureStorage = new SecureStorage();

export const stringProperty = (target: Object, key: string | symbol) => {
    // property value
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;
    target[innerKey] = secureStorage.getSync({ key: actualkey });

    // property getter
    const getter = function() {
        return this[innerKey];
    };

    // property setter
    const setter = function(newVal) {
        this[innerKey] = newVal;
        if (newVal === undefined || newVal === null) {
            return secureStorage.removeSync({ key: actualkey });
        }
        return secureStorage.setSync({ key: actualkey, value: newVal });
    };
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
};
export const objectProperty = (target: Object, key: string | symbol) => {
    // property value
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;

    const savedValue = secureStorage.getSync({ key: actualkey });
    target[innerKey] = savedValue !== undefined ? JSON.parse(savedValue) : undefined;

    // property getter
    const getter = function() {
        return this[innerKey];
    };

    // property setter
    const setter = function(newVal) {
        this[innerKey] = newVal;
        if (newVal === undefined) {
            return secureStorage.removeSync({ key: actualkey });
        }
        return secureStorage.setSync({ key: actualkey, value: JSON.stringify(newVal) });
    };
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
};
export const booleanProperty = (target: Object, key: string | symbol) => {
    // property value
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;
    target[innerKey] = !!parseInt(secureStorage.getSync({ key: actualkey }), 2);

    // property getter
    const getter = function() {
        return this[innerKey];
    };

    // property setter
    const setter = function(newVal) {
        this[innerKey] = newVal;
        if (newVal === undefined) {
            return secureStorage.removeSync({ key: actualkey });
        }
        return secureStorage.setSync({ key: actualkey, value: newVal ? '1' : '0' });
    };
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
};
export const numberProperty = (target: Object, key: string | symbol) => {
    // property value
    const actualkey = key.toString();
    const innerKey = '_' + actualkey;
    target[innerKey] = parseFloat(secureStorage.getSync({ key: actualkey }));

    // property getter
    const getter = function() {
        return this[innerKey];
    };

    // property setter
    const setter = function(newVal) {
        this[innerKey] = newVal;
        if (newVal === undefined) {
            return secureStorage.removeSync({ key: actualkey });
        }
        return secureStorage.setSync({ key: actualkey, value: newVal + '' });
    };
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
};

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService extends Observable {}
