import * as connectivity from '@nativescript/core/connectivity';
import { EventData, Observable } from '@nativescript/core/data/observable';
import * as http from '@nativescript/core/http';
import { clog } from '~/utils/logging';
import { $t } from '~/helpers/locale';
import { stringProperty } from './BackendService';
import { TNSHttpFormData, TNSHttpFormDataParam, TNSHttpFormDataResponse } from 'nativescript-http-formdata';
import { BaseError } from 'make-error';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
type HTTPOptions = http.HttpRequestOptions;

export interface HttpRequestOptions extends HTTPOptions {
    queryParams?: {};
}

export const NetworkConnectionStateEvent = 'NetworkConnectionStateEvent';
export interface NetworkConnectionStateEventData extends EventData {
    data: {
        connected: boolean;
        connectionType: connectivity.connectionType;
    };
}

export interface HttpRequestOptions extends HTTPOptions {
    queryParams?: {};
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
        if (props.customErrorConstructorName || isError) {
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
        } else {
            // console.log('creating new CustomError', props);
            this.assignedLocalData = props;
        }

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

export class NetworkService extends Observable {
    @stringProperty token: string;
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
        this.log('creating NetworkHandler Handler');
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
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + this.token;
        }
        return headers;
    }
    request(requestParams: HttpRequestOptions, retry = 0) {
        if (!this.connected) {
            return Promise.reject(new NoNetworkError());
        }
        if (requestParams.queryParams) {
            requestParams.url = queryString(requestParams.queryParams, requestParams.url);
            delete requestParams.queryParams;
        }
        requestParams.headers = this.getRequestHeaders(requestParams);

        this.log('request', requestParams);
        const requestStartTime = Date.now();
        return http.request(requestParams).then(response => this.handleRequestResponse(response, requestParams, requestStartTime, retry));
    }

    requestMultipart(requestParams: HttpRequestOptions, retry = 0) {
        this.log('requestMultipart', requestParams);
        const requestStartTime = Date.now();
        return new TNSHttpFormData()
            .post(requestParams.url, requestParams.multipartParams, {
                headers: this.getRequestHeaders(requestParams)
            })
            .then(response => this.handleRequestResponse(response, requestParams, requestStartTime, retry));
    }

    async handleRequestResponse(response: http.HttpResponse | TNSHttpFormDataResponse, requestParams: HttpRequestOptions, requestStartTime, retry) {
        const statusCode = response.statusCode;
        // return Promise.resolve()
        // .then(() => {
        const content = response['content'] ? response['content'].toString() : response['body'];
        const isJSON = typeof content === 'object' || Array.isArray(content);
        this.log('handleRequestResponse response', statusCode, Math.round(statusCode / 100), response['content'], response['body'], isJSON, typeof content, content.error);
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
                    this.log('request error1', responseStr, match);
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
                if (
                    (statusCode === 401 && jsonReturn.error === 'invalid_grant') ||
                    (statusCode === 400 &&
                        jsonReturn.error &&
                        jsonReturn.error.message === 'Un problème technique est survenu. Notre service technique en a été informé et traitera le problème dans les plus brefs délais.')
                ) {
                    return this.handleRequestRetry(requestParams, retry);
                }
                const error = jsonReturn.error_description || jsonReturn.error || jsonReturn;
                let message = error.error_description || error.form || error.message || error.error || error;
                if (error.exception && error.exception.length > 0) {
                    message += ': ' + error.exception[0].message;
                }
                this.log('throwing http error', error.code || statusCode, message);
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
            return response['content'].toJSON();
        } catch (e) {
            // console.log('failed to parse result to JSON', e);
            return response['content'];
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
