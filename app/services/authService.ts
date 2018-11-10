import * as http from "tns-core-modules/http"
import BackendService, {
    stringProperty,
    objectProperty
} from "./BackendService"
// import firebase from 'nativescript-plugin-firebase'
import { localize } from "nativescript-localize"

function evalMessageInContext(message: string, data) {
    console.log("evalMessageInContext", message, this)
    // const result = eval("`" + message + "`");
    try {
        const result = eval(`\`${message}\``)
        console.log("evalMessageInContext result", result)
        return result
    } catch (e) {
        console.log("evalMessageInContext error", e)
    }
}

// function interpolate(str, params) {
//     const names = Object.keys(params);
//     const vals = Object.values(params);
//     return new Function(...names, `return \`${str}\`;`)(...vals);
//   }
function evalTemplateString(resource: string, obj: {}) {
    const names = Object.keys(obj)
    const vals = Object.keys(obj).map(key => obj[key])
    return new Function(...names, `return \`${resource}\`;`)(...vals)
}

const clientId = "1_5p4cdcuh4hkwgcokwgcwc0ooo0o800kscsksww40gw8cwkw448"
const clientSecret = "1k4hh9wp7jq8okgss80w8gsso4scowgwgwg4kc4oo0g8844sos"
const authority = "https://moncompte.cairn-monnaie.com"
const tokenEndpoint = "/oauth/v2/token"

export const LoggedinEvent = "loggedin"
export const LoggedoutEvent = "loggedout"

export interface LoginParams {
    username: string
    password: string
}

export interface HttpRequestOptions extends http.HttpRequestOptions {
    queryParams?: {}
}

export function queryString(params, location) {
    var obj = {},
        i,
        parts,
        len,
        key,
        value

    if (typeof params === "string") {
        value = location.match(new RegExp("[?&]" + params + "=?([^&]*)[&#$]?"))
        return value ? value[1] : undefined
    }

    var locSplit = location.split(/[?&]/)
    //_params[0] is the url

    parts = []
    for (i = 0, len = locSplit.length; i < len; i++) {
        var theParts = locSplit[i].split("=")
        if (!theParts[0]) {
            continue
        }
        if (theParts[1]) {
            parts.push(theParts[0] + "=" + theParts[1])
        } else {
            parts.push(theParts[0])
        }
    }
    if (Array.isArray(params)) {
        let data

        for (i = 0, len = params.length; i < len; i++) {
            data = params[i]
            if (typeof data === "string") {
                parts.push(data)
            } else if (Array.isArray(data)) {
                parts.push(data[0] + "=" + data[1])
            }
        }
    } else if (typeof params === "object") {
        for (key in params) {
            value = params[key]
            if (typeof value === "undefined") {
                delete obj[key]
            } else {
                if (typeof value === "object") {
                    obj[key] = JSON.stringify(value)
                } else {
                    obj[key] = value
                }
            }
        }
        for (key in obj) {
            parts.push(key + (obj[key] === true ? "" : "=" + obj[key]))
        }
    }

    return (
        parts.splice(0, 2).join("?") +
        (parts.length > 0 ? "&" + parts.join("&") : "")
    )
}

export class CustomError extends Error {
    customErrorConstructorName: string
    isCustomError = true
    assignedLocalData: any
    silent?: boolean
    constructor(props?, customErrorConstructorName?: string) {
        super(props.message)
        this.message = props.message
        delete props.message

        this.silent = props.silent
        delete props.silent
        // Error.captureStackTrace && Error.captureStackTrace(this, (this as any).constructor);
        // console.log('creating custom error', props, typeof props, props instanceof Error, props instanceof CustomError);

        //we need to understand if we are duplicating or not
        const isError = props instanceof Error
        if (props.customErrorConstructorName || isError) {
            //duplicating
            //use getOwnPropertyNames to get hidden Error props
            let keys = Object.getOwnPropertyNames(props)
            // if (isError) {
            //     keys = keys.concat(['fileName', 'stack', 'lineNumber', 'type']);
            // }
            // console.log('duplicating error', keys, props.stack);
            for (var index = 0; index < keys.length; index++) {
                var k = keys[index]
                if (!props[k] || typeof props[k] === "function") continue
                // console.log('assigning', k, props[k], this[k]);
                this[k] = props[k]
            }
        } else {
            // console.log('creating new CustomError', props);
            this.assignedLocalData = props
        }

        if (!this.customErrorConstructorName) {
            this.customErrorConstructorName =
                customErrorConstructorName || (this as any).constructor.name // OR (<any>this).constructor.name;
        }
    }

    localData = () => {
        var res = {}
        for (let key in this.assignedLocalData) {
            res[key] = this.assignedLocalData[key]
        }
        return res
    }

    toJSON = () => {
        var error = {
            message: this.message
        }
        Object.getOwnPropertyNames(this).forEach(key => {
            if (typeof this[key] !== "function") {
                error[key] = this[key]
            }
        })
        return error
    }
    toData = () => {
        return JSON.stringify(this.toJSON())
    }
    toString = () => {
        return evalTemplateString(
            localize(this.message),
            Object.assign({ localize }, this.assignedLocalData)
        )
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
                    message: "timeout_error"
                },
                props
            ),
            "TimeoutError"
        )
    }
}

export class NoNetworkError extends CustomError {
    constructor(props?) {
        super(
            Object.assign(
                {
                    message: "no_network"
                },
                props
            ),
            "NoNetworkError"
        )
    }
}
export class HTTPError extends CustomError {
    statusCode: number
    errorMessage: string
    requestParams: http.HttpRequestOptions
    constructor(
        props:
            | {
                  statusCode: number
                  errorMessage: string
                  requestParams: http.HttpRequestOptions
              }
            | HTTPError
    ) {
        super(
            Object.assign(
                {
                    message: "httpError"
                },
                props
            ),
            "HTTPError"
        )
    }
}

export default class AuthService extends BackendService {
    @stringProperty token: string
    @stringProperty userId: string
    @objectProperty loginParams: LoginParams

    getMessage() {
        // firebase.addOnMessageReceivedCallback(function (data) {
        //   alert(JSON.stringify(data));
        // })
    }

    isLoggedIn() {
        return !!this.token && !!this.loginParams && !!this.userId
    }

    request(requestParams: HttpRequestOptions) {
        if (requestParams.queryParams) {
            requestParams.url = queryString(
                requestParams.queryParams,
                requestParams.url
            )
            delete requestParams.queryParams
        }
        // if (!requestParams.method) {
        //     requestParams.method = "GET";
        // }
        requestParams.headers = requestParams.headers || {}
        if (!requestParams.headers["Content-Type"]) {
            requestParams.headers["Content-Type"] = "application/json"
        }
        if (this.token) {
            requestParams.headers["Authorization"] = "Bearer " + this.token
        }
        console.log("request", requestParams)

        return http.request(requestParams).then(response => {
            if (response.statusCode !== 200) {
                try {
                    const jsonReturn = JSON.parse(response.content.toString())
                    console.log("request error", jsonReturn)
                    if (
                        response.statusCode === 401 &&
                        jsonReturn.error === "invalid_grant"
                    ) {
                        //refresh token
                    }
                    const error = jsonReturn.error || jsonReturn
                    return Promise.reject(
                        new HTTPError({
                            statusCode: response.statusCode,
                            errorMessage:
                                error.error_description ||
                                error.message ||
                                error.error ||
                                error,
                            requestParams
                        })
                    )
                } catch (e) {
                    console.log("request error", response.content.toString())
                    var match = /<title>(.*)<\/title>/.exec(
                        response.content.toString()
                    )
                    if (match) {
                        // result = {
                        //     error: {}
                        // }
                        // if (match[1] === 'Invalid Access Token') {
                        //     result.error.code = 'INVALID_TOKEN';
                        // }
                        return Promise.reject(
                            new HTTPError({
                                statusCode: response.statusCode,
                                errorMessage: match[1],
                                requestParams
                            })
                        )
                    }
                    return Promise.reject(
                        new HTTPError({
                            statusCode: response.statusCode,
                            errorMessage: "HTTP error",
                            requestParams
                        })
                    )
                }
            }
            return response.content.toJSON()
        })
    }
    getUserId() {
        return this.request({
            url: authority + "/api/user.json",
            method: "GET"
        }).then(result => {
            this.userId = result.current_user_id + ""
        })
    }
    getAccounts() {
        return this.request({
            url: authority + `/banking/accounts/overview/${this.userId}.json`,
            method: "GET"
        })
    }
    getToken(user: LoginParams) {
        return this.request({
            url: authority + tokenEndpoint,
            method: "GET",
            queryParams: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "password",
                username: user.username,
                password: user.password
            }
        })
            .then(result => {
                this.token = result.access_token
            })
            .catch(err => {
                this.token = undefined
                return Promise.reject(err)
            })
    }
    login(user: LoginParams = this.loginParams) {
        if (!user) {
            return Promise.reject("missing_login_params")
        }
        const wasLoggedin = this.isLoggedIn()
        return this.getToken(user)

            .then(() => this.getUserId())
            .then(() => {
                this.loginParams = user
                if (!wasLoggedin) {
                    this.notify({
                        eventName: LoggedinEvent,
                        object: this
                    })
                }
                
            })
            .catch(err => {
                this.onLoggedOut()
                return Promise.reject(err)
            })
    }

    onLoggedOut() {
        const wasLoggedin = this.isLoggedIn()
        this.token = undefined
        this.loginParams = undefined
        this.userId = undefined
        if (wasLoggedin) {
            this.notify({
                eventName: LoggedoutEvent,
                object: this
            })
        }
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

    logout() {
        this.onLoggedOut()
        // backendService.token = "";
        // return firebase.logout();
    }
}
