import * as http from "tns-core-modules/http"
import BackendService from "./BackendService"
// import firebase from 'nativescript-plugin-firebase'

const clientId = "1_5p4cdcuh4hkwgcokwgcwc0ooo0o800kscsksww40gw8cwkw448"
const clientSecret = "1k4hh9wp7jq8okgss80w8gsso4scowgwgwg4kc4oo0g8844sos"
const authority = "https://moncompte.cairn-monnaie.com"
const tokenEndpoint = "/oauth/v2/token"

export interface HttpRequestOptions extends http.HttpRequestOptions {
    queryParams?:{}
}

export function queryString(params, location) {
    var obj = {},
        i,
        parts,
        len,
        key,
        value;

    if (typeof params === 'string') {
        value = location.match(new RegExp('[?&]' + params + '=?([^&]*)[&#$]?'));
        return value ? value[1] : undefined;
    }

    var locSplit = location.split(/[?&]/);
    //_params[0] is the url

    parts = [];
    for (i = 0, len = locSplit.length; i < len; i++) {
        var theParts = locSplit[i].split('=');
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
                    obj[key] = JSON.stringify(value);
                } else {
                    obj[key] = value;
                }
            }
        }
        for (key in obj) {
            parts.push(key + (obj[key] === true ? '' : '=' + obj[key]));
        }
    }

    return parts.splice(0, 2).join('?') + (parts.length > 0 ? '&' + parts.join('&') : '');
}

export class CustomError extends Error {
    customErrorConstructorName: string
    isCustomError = true
    assignedLocalData: any
    silent?: boolean
    constructor(props?, customErrorConstructorName?: string) {
        super(props.message);
        this.message = props.message;
        delete props.message;

        this.silent = props.silent;
        delete props.silent;
        // Error.captureStackTrace && Error.captureStackTrace(this, (this as any).constructor);
        // console.log('creating custom error', props, typeof props, props instanceof Error, props instanceof CustomError);


        //we need to understand if we are duplicating or not
        const isError = props instanceof Error;
        if (props.customErrorConstructorName || isError) {
            //duplicating
            //use getOwnPropertyNames to get hidden Error props
            let keys = Object.getOwnPropertyNames(props);
            // if (isError) {
            //     keys = keys.concat(['fileName', 'stack', 'lineNumber', 'type']);
            // }
            // console.log('duplicating error', keys, props.stack);
            for (var index = 0; index < keys.length; index++) {
                var k = keys[index];
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

    localData = () => {
        var res = {};
        for (let key in this.assignedLocalData) {
            res[key] = this.assignedLocalData[key];
        }
        return res;
    }

    toJSON = () => {
        var error = {
            message: this.message
        };
        Object.getOwnPropertyNames(this).forEach((key) => {
            if (typeof this[key] !== 'function') {
                error[key] = this[key];
            }
        });
        return error;
    }
    toData = () => {
        return JSON.stringify(this.toJSON());
    }
    toString = () => {
        return this.toData();
        // return this.message || this.stack;
    }

    getMessage() {
        
    }
}
export class TimeoutError extends CustomError {
    constructor(props?) {
        super(Object.assign({
            message: 'timeout_error'
        }, props), 'TimeoutError');
    }
}

export class NoNetworkError extends CustomError {
    constructor(props?) {
        super(Object.assign({
            message: 'no_network'
        }, props), 'NoNetworkError');
    }
}
export class HTTPError extends CustomError {
    statusCode:number
    errorMessage:string
    requestParams:http.HttpRequestOptions
    constructor(props: {
        statusCode:number,
        errorMessage:string
        requestParams:http.HttpRequestOptions
    } | HTTPError) {
        super(Object.assign({
            message: 'httpError'
        }, props), 'HTTPError');
    }
}


export default class AuthService extends BackendService {
    constructor() {
        super();
    }
    getMessage() {
        // firebase.addOnMessageReceivedCallback(function (data) {
        //   alert(JSON.stringify(data));
        // })
    }

    isLoggedIn() {
        return !!this.token
    }

    request(requestParams:HttpRequestOptions) {
        if (requestParams.queryParams) {
            requestParams.url = queryString(requestParams.queryParams, requestParams.url);
            delete requestParams.queryParams;
        }

        console.log('request', requestParams);
        return http
            .request(requestParams)
            .then(response => {
                if (response.statusCode !== 200) {
                    
                    try {
                        const jsonReturn = response.content.toJSON();
                        if (response.statusCode === 401 && jsonReturn.error === 'invalid_grant' ) {
                            //refresh token
                            
                        }
                        return Promise.reject(new HTTPError({
                            statusCode:response.statusCode,
                            errorMessage:jsonReturn.error_description,
                            requestParams
                        }));
                    } catch (e) {
                        console.log('request error', response.content.toString());
                    var match = /<title>(.*)<\/title>/.exec(response.content.toString())
                    if (match) {
                        // result = {
                        //     error: {}
                        // }
                        // if (match[1] === 'Invalid Access Token') {
                        //     result.error.code = 'INVALID_TOKEN';
                        // }
                        return Promise.reject(new HTTPError({
                            statusCode:response.statusCode,
                            errorMessage:match[1],
                            requestParams
                        }));
                    }
                    return Promise.reject(new HTTPError({
                        statusCode:response.statusCode,
                        errorMessage:'HTTP error',
                        requestParams
                    }));
                    }
                    
                }
                return response.content.toJSON()
            })
    }
    login(user) {
        // const content =  JSON.stringify({
        //     client_id: clientId,
        //     client_secret: clientSecret,
        //     grant_type: "password",
        //     username: user.username,
        //     password: user.password
        // });
        const requestParams = {
            url: authority + tokenEndpoint,
            headers:{ "Content-Type": "application/json" },
            method: "GET",
            queryParams:{
                client_id: clientId,
            client_secret: clientSecret,
            grant_type: "password",
            username: user.username,
            password: user.password
            }
        }
        return this 
            .request(Object.assign({
                timeout:10000,
                dontFollowRedirects:false
            },requestParams))
            .then(result => {
                this.token = result.access_token
            })
        // const result = await firebase.login({
        //   type: firebase.LoginType.PASSWORD,
        //   passwordOptions: {
        //     email: user.email,
        //     password: user.password
        //   }
        // })
        // backendService.token = result.uid;
        // return JSON.stringify(result);
    }

    async register(user) {
        // const result = await firebase.createUser({
        //   email: user.email,
        //   password: user.password
        // })
        // return JSON.stringify(result);
    }

    async resetPassword(email) {
        // const result = await firebase.resetPassword({
        //   email: email
        // })
        // return JSON.stringify(result);
    }

    async logout() {
        // backendService.token = "";
        // return firebase.logout();
    }
}
