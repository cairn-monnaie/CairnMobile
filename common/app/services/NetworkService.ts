import * as connectivity from '@nativescript/core/connectivity';
import { EventData, Observable } from '@nativescript/core/data/observable';
import * as http from '@nativescript/core/http';
import { clog } from '~/utils/logging';
import { $t } from '~/helpers/locale';
import { stringProperty } from './BackendService';
// import { TNSHttpFormData, TNSHttpFormDataParam, TNSHttpFormDataResponse } from 'nativescript-http-formdata';
import { BaseError } from 'make-error';
import * as https from 'nativescript-https';

import { knownFolders, path } from '@nativescript/core/file-system';

export interface CacheOptions {
    diskLocation: string;
    diskSize: number;
    memorySize?: number;
}
// export type CachePolicy = 'noCache' | 'onlyCache' | 'ignoreCache';
// export function setCache(options?: CacheOptions) {
//     if (gVars.isIOS) {
//         NSURLCache.sharedURLCache = NSURLCache.alloc().initWithMemoryCapacityDiskCapacityDirectoryURL(options.memorySize, options.diskSize, NSURL.URLWithString(options.diskLocation));
//     } else {
//         try {
//             const httpCacheDir = new java.io.File(options.diskLocation);
//             android.net.http.HttpResponseCache.install(httpCacheDir, options.diskSize);
//         } catch (e) {
//             console.log('error creating cache', e);
//         }
//     }
// }
// https.setCache({
//     diskLocation: path.join(knownFolders.documents().path, 'httpcache'),
//     diskSize: 10 * 1024 * 1024 // 10 MiB
// });
// function timeout(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
type HTTPOptions = https.HttpsRequestOptions;

export const NetworkConnectionStateEvent = 'NetworkConnectionStateEvent';
export interface NetworkConnectionStateEventData extends EventData {
    data: {
        connected: boolean;
        connectionType: connectivity.connectionType;
    };
}

export interface HttpRequestOptions extends HTTPOptions {
    body?;
    cachePolicy?: https.CachePolicy;
    queryParams?: {};
    apiPath?: string;
    multipartParams?;
}

function evalTemplateString(resource: string, obj: {}) {
    if (!obj) {
        return resource;
    }
    const names = Object.keys(obj);
    const vals = Object.keys(obj).map(key => obj[key]);
    return new Function(...names, `return \`${resource}\`;`)(...vals);
}

export function queryString(params, location) {
    const obj = {};
    let i, len, key, value;

    if (typeof params === 'string') {
        value = location.match(new RegExp('[?&]' + params + '=?([^&]*)[&#$]?'));
        return value ? value[1] : undefined;
    }

    const locSplit = location.split(/[?&]/);
    // _params[0] is the url

    const parts = [];
    for (i = 0, len = locSplit.length; i < len; i++) {
        const theParts = locSplit[i].split('=');
        if (!theParts[0]) {
            continue;
        }
        if (theParts[1]) {
            parts.push(theParts[0] + '=' + theParts[1]);
        } else {
            parts.push(theParts[0]);
        }
    }
    if (Array.isArray(params)) {
        let data;

        for (i = 0, len = params.length; i < len; i++) {
            data = params[i];
            if (typeof data === 'string') {
                parts.push(data);
            } else if (Array.isArray(data)) {
                parts.push(data[0] + '=' + data[1]);
            }
        }
    } else if (typeof params === 'object') {
        for (key in params) {
            value = params[key];
            if (typeof value === 'undefined') {
                delete obj[key];
            } else {
                if (typeof value === 'object') {
                    obj[key] = encodeURIComponent(JSON.stringify(value));
                } else {
                    obj[key] = encodeURIComponent(value);
                }
            }
        }
        for (key in obj) {
            parts.push(key + (obj[key] === true ? '' : '=' + obj[key]));
        }
    }

    return parts.splice(0, 2).join('?') + (parts.length > 0 ? '&' + parts.join('&') : '');
}

export class CustomError extends BaseError {
    customErrorConstructorName: string;
    isCustomError = true;
    assignedLocalData: any;
    silent?: boolean;
    constructor(props?, customErrorConstructorName?: string) {
        super(props.message);
        this.message = props.message;
        delete props.message;

        this.silent = props.silent;
        delete props.silent;
        // Error.captureStackTrace && Error.captureStackTrace(this, (this as any).constructor);
        // console.log('creating custom error', props, typeof props, props instanceof Error, props instanceof CustomError);

        // we need to understand if we are duplicating or not
        const isError = props instanceof Error;
        if (customErrorConstructorName || isError) {
            // duplicating
            // use getOwnPropertyNames to get hidden Error props
            const keys = Object.getOwnPropertyNames(props);
            // if (isError) {
            //     keys = keys.concat(['fileName', 'stack', 'lineNumber', 'type']);
            // }
            // console.log('duplicating error', keys, props.stack);
            for (let index = 0; index < keys.length; index++) {
                const k = keys[index];
                if (!props[k] || typeof props[k] === 'function') continue;
                // console.log('assigning', k, props[k], this[k]);
                this[k] = props[k];
            }
            // } else {
            // console.log('creating new CustomError', props);
        }
        this.assignedLocalData = props;

        if (!this.customErrorConstructorName) {
            this.customErrorConstructorName = customErrorConstructorName || (this as any).constructor.name; // OR (<any>this).constructor.name;
        }
    }

    localData() {
        const res = {};
        for (const key in this.assignedLocalData) {
            res[key] = this.assignedLocalData[key];
        }
        return res;
    }

    toJSON() {
        const error = {
            message: this.message
        };
        Object.getOwnPropertyNames(this).forEach(key => {
            if (typeof this[key] !== 'function') {
                error[key] = this[key];
            }
        });
        return error;
    }
    toData() {
        return JSON.stringify(this.toJSON());
    }
    toString() {
        // console.log('customError to string', this.message, this.assignedLocalData, localize);
        const result = evalTemplateString($t(this.message), Object.assign({ localize: $t }, this.assignedLocalData));
        // console.log('customError to string2', result);
        return result;
        // return evalMessageInContext.call(Object.assign({localize}, this.assignedLocalData), localize(this.message))
        // return this.message || this.stack;
    }

    getMessage() {}
}
export class TimeoutError extends CustomError {
    constructor(props?) {
        super(
            Object.assign(
                {
                    message: 'timeout_error'
                },
                props
            ),
            'TimeoutError'
        );
    }
}

export class NoNetworkError extends CustomError {
    constructor(props?) {
        super(
            Object.assign(
                {
                    message: 'no_network'
                },
                props
            ),
            'NoNetworkError'
        );
    }
}
export interface HTTPErrorProps {
    statusCode: number;
    message: string;
    requestParams: HTTPOptions;
}
export class HTTPError extends CustomError {
    statusCode: number;
    requestParams: HTTPOptions;
    constructor(props: HTTPErrorProps | HTTPError) {
        super(
            Object.assign(
                {
                    message: 'httpError'
                },
                props
            ),
            'HTTPError'
        );
    }
}

function jsonObjectToKeepOrderString(obj) {
    // console.log('jsonObjectToKeepOrderString', typeof obj, obj);
    // if (typeof obj === 'string') {
    //     return obj;
    // }
    if (Array.isArray(obj)) {
        // console.log('jsonObjectToKeepOrderString array', obj);
        return obj
            .filter(v => v !== undefined && v !== null)
            .map(v => jsonObjectToKeepOrderString(v))
            .sort()
            .join('');
    } else if (typeof obj === 'object') {
        return Object.keys(obj)
            .filter(k => obj[k] !== undefined && obj[k] !== null)
            .map(k => k + ':' + jsonObjectToKeepOrderString(obj[k]))
            .sort()
            .join('');
    }
    return obj;
}

import hmacSHA256 from 'crypto-js/hmac-sha256';
import md5 from 'crypto-js/md5';
export class NetworkService extends Observable {
    @stringProperty token: string;
    @stringProperty refreshToken: string;
    authority: string;
    _connectionType: connectivity.connectionType = connectivity.connectionType.none;
    _connected = false;
    get connected() {
        return this._connected;
    }
    set connected(value: boolean) {
        if (this._connected !== value) {
            this._connected = value;
            this.notify({
                eventName: NetworkConnectionStateEvent,
                object: this,
                data: {
                    connected: value,
                    connectionType: this._connectionType
                }
            } as NetworkConnectionStateEventData);
        }
    }
    get connectionType() {
        return this._connectionType;
    }
    set connectionType(value: connectivity.connectionType) {
        if (this._connectionType !== value) {
            this._connectionType = value;
            this.connected = value !== connectivity.connectionType.none;
        }
    }
    constructor() {
        super();
    }
    log(...args) {
        clog(`[${this.constructor.name}]`, ...args);
    }
    start() {
        connectivity.startMonitoring(this.onConnectionStateChange.bind(this));
        this.connectionType = connectivity.getConnectionType();
    }
    stop() {
        connectivity.stopMonitoring();
    }
    onConnectionStateChange(newConnectionType: connectivity.connectionType) {
        this.connectionType = newConnectionType;
    }

    async handleRequestRetry(requestParams: HttpRequestOptions, retry = 0) {
        throw new HTTPError({
            statusCode: 401,
            message: 'HTTP error',
            requestParams
        });
    }

    getRequestHeaders(requestParams?: HttpRequestOptions) {
        const headers = (requestParams && requestParams.headers) || {};
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        if (!headers['Connection']) {
            headers['Connection'] = 'Keep-Alive';
        }
        // if (requestParams.cachePolicy) {
        //     switch (requestParams.cachePolicy) {
        //         case 'noCache':
        //             headers['Cache-Control'] = 'public, no-cache';
        //             break;
        //         case 'onlyCache':
        //             headers['Cache-Control'] = 'public, only-if-cached';

        //             break;
        //         // case "ignoreCache":
        //         //     manager.requestSerializer.cachePolicy =
        //         //         NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData;
        //         // break;
        //     }
        // }
        const signature = this.buildAuthorization(requestParams);

        headers['Authorization'] = `HMAC-SHA256 ${this.token ? `Bearer ${this.token} ` : ''}Signature=${signature[0]}:${
            signature[1]
        }`;
        // if (this.token) {
        //     headers['Authorization'] = `Bearer ${this.token}`;
        // }
        return headers;
    }
    buildAuthorization(requestParams: HttpRequestOptions) {
        const time = Date.now().toString();
        // console.log('buildAuthorization', requestParams);

        let hmacString = time + (requestParams.method || 'GET') + requestParams.apiPath;
        if (!requestParams.headers || requestParams.headers['Content-Type'] !== 'multipart/form-data') {
            let bodyStr;
            if (requestParams.body) {
                bodyStr = jsonObjectToKeepOrderString(requestParams.body).replace(/\s+/g, '');
            } else if (typeof requestParams.content === 'string') {
                bodyStr = jsonObjectToKeepOrderString(JSON.parse(requestParams.content).replace(/\s+/g, ''));
            }
            // console.log('bodyStr', bodyStr);
            if (bodyStr) {
                hmacString += md5(bodyStr);
            }
        }
        // console.log(hmacString);
        return [time, hmacSHA256(hmacString, SHA_SECRET_KEY)];
    }
    request<T = any>(requestParams: Partial<HttpRequestOptions>, retry = 0) {
        if (!this.connected) {
            return Promise.reject(new NoNetworkError());
        }
        if (requestParams.apiPath) {
            requestParams.url = this.authority + requestParams.apiPath;
        }
        // if (!this.connected && !requestParams.cachePolicy) {
        //     requestParams.cachePolicy = 'onlyCache';
        // }
        if (requestParams.queryParams) {
            requestParams.url = queryString(requestParams.queryParams, requestParams.url);
            delete requestParams.queryParams;
        }
        requestParams.useLegacy = true;

        requestParams.headers = this.getRequestHeaders(requestParams as HttpRequestOptions);
        requestParams.useLegacy = true;
        const requestStartTime = Date.now();
        // console.log('request', requestParams);
        return https
            .request(requestParams as HttpRequestOptions)
            .then(response =>
                this.handleRequestResponse(response, requestParams as HttpRequestOptions, requestStartTime, retry)
            ) as Promise<T>;
    }

    // requestMultipart(requestParams: Partial<HttpRequestOptions>, retry = 0) {
    //     this.log('requestMultipart', requestParams);
    //     if (requestParams.apiPath) {
    //         requestParams.url = this.authority + requestParams.apiPath;
    //     }
    //     const requestStartTime = Date.now();
    //     return new TNSHttpFormData()
    //         .post(requestParams.url, requestParams.multipartParams, {
    //             headers: this.getRequestHeaders(requestParams as HttpRequestOptions)
    //         })
    //         .then(response => this.handleRequestResponse(response, requestParams as HttpRequestOptions, requestStartTime, retry));
    // }

    async handleRequestResponse(response: https.HttpsResponse, requestParams: HttpRequestOptions, requestStartTime, retry) {
        const statusCode = response.statusCode;
        // return Promise.resolve()
        // .then(() => {
        const content = response['content'].toJSON() || response['content'].toString();
        const isJSON = typeof content === 'object' || Array.isArray(content);
        // this.log('handleRequestResponse response', statusCode, response.reason, response.headers, isJSON, typeof content, content);
        if (Math.round(statusCode / 100) !== 2) {
            let jsonReturn;
            if (isJSON) {
                jsonReturn = content;
            } else {
                const responseStr = content.replace('=>', ':');
                try {
                    jsonReturn = JSON.parse(responseStr);
                } catch (err) {
                    // error result might html
                    const match = /<title>(.*)\n*<\/title>/.exec(responseStr);
                    return Promise.reject(
                        new HTTPError({
                            statusCode,
                            message: match ? match[1] : 'HTTP error',
                            requestParams
                        })
                    );
                }
            }
            if (jsonReturn) {
                if (Array.isArray(jsonReturn)) {
                    jsonReturn = jsonReturn[0];
                }
                // we try to handle all cases where a refreshed token would suffice
                if (
                    (statusCode === 401 && jsonReturn.error === 'invalid_grant') ||
                    (statusCode === 400 &&
                        jsonReturn.error &&
                        jsonReturn.error.message ===
                            'Un problème technique est survenu. Notre service technique en a été informé et traitera le problème dans les plus brefs délais.')
                ) {
                    return this.handleRequestRetry(requestParams, retry);
                }
                const error = jsonReturn.error_description || jsonReturn.error || jsonReturn;
                let message = $t(
                    (typeof error === 'string'
                        ? error
                        : error.error_description || error.form || error.message || error.error || error
                    )
                        .replace(/\s/g, '_')
                        .toLowerCase()
                );
                if (error.exception && error.exception.length > 0) {
                    message += ': ' + $t(error.exception[0].message.replac(/\s/g, '_').toLowerCase());
                }
                this.log('throwing http error', error.code || statusCode, message, requestParams);
                throw new HTTPError({
                    statusCode: error.code || statusCode,
                    message,
                    requestParams
                });
            }
        }
        if (isJSON) {
            return content;
        }
        try {
            // we should never go there anymore
            return JSON.parse(content);
        } catch (e) {
            // console.log('failed to parse result to JSON', e);
            return content;
        }
        // })
        // .catch(err => {
        //     const delta = Date.now() - requestStartTime;
        //     if (delta >= 0 && delta < 500) {
        //         return timeout(delta).then(() => Promise.reject(err));
        //     } else {
        //         return Promise.reject(err);
        //     }
        // });
    }
}
