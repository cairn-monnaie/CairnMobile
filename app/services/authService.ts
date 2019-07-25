// import * as http from 'tns-core-modules/http';
import * as http from 'tns-core-modules/http';

type HTTPOptions = http.HttpRequestOptions;
import BackendService, { numberProperty, objectProperty, stringProperty } from './BackendService';
// import firebase from 'nativescript-plugin-firebase'
import { localize } from 'nativescript-localize';
import dayjs from 'dayjs';

// function evalMessageInContext(message: string, data) {
//     console.log('evalMessageInContext', message, this);
//     // const result = eval("`" + message + "`");
//     try {
//         const result = eval(`\`${message}\``);
//         console.log('evalMessageInContext result', result);
//         return result;
//     } catch (e) {
//         console.log('evalMessageInContext error', e);
//     }
// }

// function interpolate(str, params) {
//     const names = Object.keys(params);
//     const vals = Object.values(params);
//     return new Function(...names, `return \`${str}\`;`)(...vals);
//   }
function evalTemplateString(resource: string, obj: {}) {
    if (!obj) {
        return resource;
    }
    const names = Object.keys(obj);
    const vals = Object.keys(obj).map(key => obj[key]);
    return new Function(...names, `return \`${resource}\`;`)(...vals);
}

const clientId = '3_2gd9gnkf3pj4g4c0wkkwcsskskcwk40o8c4w8w8gko0o08gcog';
const clientSecret = '2062ors5k8xwgsk8kw0gg48cg4swg40k8o04ogscg0ww8kc00w';
const authority = 'https://test.cairn-monnaie.com';
const tokenEndpoint = '/oauth/tokens';

export const LoggedinEvent = 'loggedin';
export const LoggedoutEvent = 'loggedout';

export class User {
    // webPushSubscriptions: string[] = null;
    phoneNumbers: string[] = null;
    // adherent: true = null;
    // admin: false = null;
    mainICC: string = null;
    name: string = null;
    creationDate: number = null; // timestamp
    address: Address = null;
    description: string = null;
    image: string = null;
    // identityDocument: {
    //     id: number;
    //     webPath: string;
    // } = null;
    firstname: string = null;
    id: number = null;
    username: string = null;
    email: string = null;
    roles: Roles[] = null;
    enabled: boolean = null;
    groups: string[] = null;
    groupNames: string[] = null;
}

const UserKeys = Object.getOwnPropertyNames(new User());

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const ret: any = {};
    keys.forEach(key => {
        ret[key] = obj[key];
    });
    return ret;
}

function cleanupUser(user: any) {
    const result = pick(user, UserKeys);

    if (result.creationDate) {
        result.creationDate = result.creationDate.timestamp;
    }
    if (result.image) {
        result.image = `${authority}/${result.image.webPath}`;
    }
    if (result.address) {
        result.address = {
            street1: result.address.street1,
            street2: result.address.street2,
            latitude: result.address.latitude,
            longitude: result.address.longitude,
            zipCity: {
                zipCode: result.address.zipCity.zipCode,
                city: result.address.zipCity.city,
                name: result.address.zipCity.name
            }
        };
    }
    return result as User;
}

export interface LoginParams {
    username: string;
    password: string;
}

export enum Roles {
    PRO = 'ROLE_PPRO',
    PERSON = 'ROLE_PERSON',
    USER = 'ROLE_USER'
}
export interface Address {
    id: number;
    street1: string;
    street2: string;
    latitude: number;
    longitude: number;
    zipCity: {
        id: number;
        zipCode: string;
        city: string;
        name: string;
    };
}
export interface AccountInfo {
    balance?: number;
    id: string;
    name: string;
}

export interface UserProfile extends User {}

export interface Benificiary {
    autocompleteLabel: string;
    id: number;
    ICC: string;
    user: User;
}

export interface TransactionConfirmation {
    confirmation_url: string;
    operation: {
        smsPayment: boolean;
        id: number;
        type: number;
        paymentID: number;
        submissionDate: number;
        executionDate: number;
        description: string;
        reason: string;
        amount: number;
        fromAccountNumber: string;
        toAccountNumber: string;
        creditor: {
            name: string;
            id: number;
        };
        creditorName: string;
        debitor: {
            name: string;
            id: number;
        };
        debitorName: string;
    };
}

export enum TransactionType {
    TRANSACTION_EXECUTED = 1, // virement exécuté)
    TRANSACTION_SCHEDULED, // virement programmé, en attente )
    CONVERSION_BDC, // conversion physique)
    CONVERSION_HELLOASSO, // conversion par virement helloasso)
    DEPOSIT, // dépôt)
    WITHDRAWAL, // retrait)
    SCHEDULED_FAILED, // virement programmé échoué)
    SMS_PAYMENT, // paiement par SMS)
    ONLINE_PAYMENT // achat en ligne)
}
export interface Transaction {
    credit: boolean;
    smsPayment: boolean;
    id: number;
    type: TransactionType;
    paymentID: string;
    submissionDate: number;
    creditorame: string;
    description: string;
    reason: string;
    amount: number;
    fromAccountNumber: string;
    toAccountNumber: string;
    creditor: {
        name: string;
        id: number;
    };
    creditorName: string;
    debitor: {
        name: string;
        id: number;
    };
    debitorName: string;
}

export interface HttpRequestOptions extends HTTPOptions {
    queryParams?: {};
}

export function queryString(params, location) {
    const obj = {};
    let i, parts, len, key, value;

    if (typeof params === 'string') {
        value = location.match(new RegExp('[?&]' + params + '=?([^&]*)[&#$]?'));
        return value ? value[1] : undefined;
    }

    const locSplit = location.split(/[?&]/);
    // _params[0] is the url

    parts = [];
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

    localData = () => {
        const res = {};
        for (const key in this.assignedLocalData) {
            res[key] = this.assignedLocalData[key];
        }
        return res;
    }

    toJSON = () => {
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
    toData = () => {
        return JSON.stringify(this.toJSON());
    }
    toString = () => {
        // console.log('customError to string', this.message, this.assignedLocalData, localize);
        const result = evalTemplateString(localize(this.message), Object.assign({ localize }, this.assignedLocalData));
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
export class HTTPError extends CustomError {
    statusCode: number;
    requestParams: HTTPOptions;
    constructor(
        props:
            | {
                statusCode: number;
                message: string;
                requestParams: HTTPOptions;
            }
            | HTTPError
    ) {
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

export default class AuthService extends BackendService {
    @stringProperty token: string;
    @numberProperty userId: number;
    @objectProperty userProfile: UserProfile;
    @objectProperty loginParams: LoginParams;

    getMessage() {
        // firebase.addOnMessageReceivedCallback(function (data) {
        //   alert(JSON.stringify(data));
        // })
    }

    isLoggedIn() {
        return !!this.token && !!this.loginParams && !!this.userId;
    }

    request(requestParams: HttpRequestOptions, retry = 0) {
        if (requestParams.queryParams) {
            requestParams.url = queryString(requestParams.queryParams, requestParams.url);
            delete requestParams.queryParams;
        }
        // if (!requestParams.method) {
        //     requestParams.method = "GET";
        // }
        requestParams.headers = requestParams.headers || {};
        if (!requestParams.headers['Content-Type']) {
            requestParams.headers['Content-Type'] = 'application/json';
        }
        if (this.token) {
            requestParams.headers['Authorization'] = 'Bearer ' + this.token;
        }
        console.log('request', requestParams);

        return http.request(requestParams).then(response => {
            console.log('request response', response.statusCode, Math.round(response.statusCode / 100));
            if (Math.round(response.statusCode / 100) !== 2) {
                try {
                    const jsonReturn = JSON.parse(response.content.toString().replace('=>', ':'));
                    console.log('request error', response.statusCode, jsonReturn, response.content);

                    if (
                        (response.statusCode === 401 && jsonReturn.error === 'invalid_grant') ||
                        (response.statusCode === 400 &&
                            jsonReturn.error &&
                            jsonReturn.error.message === 'Un problème technique est survenu. Notre service technique en a été informé et traitera le problème dans les plus brefs délais.')
                    ) {
                        // refresh token
                        if (retry === 2) {
                            this.logout();
                            return Promise.reject(
                                new HTTPError({
                                    statusCode: 401,
                                    message: 'not_authorized',
                                    requestParams
                                })
                            );
                        }
                        return this.getToken(this.loginParams).then(() => this.request(requestParams, retry++));
                    }
                    const error = jsonReturn.error_description || jsonReturn.error || jsonReturn;
                    return Promise.reject(
                        new HTTPError({
                            statusCode: error.code || response.statusCode,
                            message: error.error_description || error.form || error.message || error.error || error,
                            requestParams
                        })
                    );
                } catch (e) {
                    // error result might html
                    console.log('request error1', response.content.toString());
                    const match = /<title>(.*)\n*<\/title>/.exec(response.content.toString());
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
                                message: match[1],
                                requestParams
                            })
                        );
                    }
                    return Promise.reject(
                        new HTTPError({
                            statusCode: response.statusCode,
                            message: 'HTTP error',
                            requestParams
                        })
                    );
                }
            }
            return response.content.toJSON();
        });
    }
    // getUserId() {
    //     return this.request({
    //         url: authority + '/user.json',
    //         method: 'GET'
    //     }).then(result => {
    //         this.userId = result.current_user_id + '';
    //     });
    // }
    isProUser() {
        return this.userProfile.roles.indexOf(Roles.PRO) !== -1;
    }
    getUserProfile() {
        return this.request({
            url: authority + `/mobile/users/${this.userId}`,
            method: 'GET'
        }).then(result => {
            this.userProfile = cleanupUser(result);
            return this.userProfile;
        });
    }
    getAccounts(): Promise<AccountInfo[]> {
        return this.request({
            url: authority + `/mobile/accounts.json`,
            method: 'GET'
        }).then(r => {
            return r.map(a => {
                return {
                    balance: parseFloat(a.status.balance),
                    id: a.number.toString(),
                    name: a.type.name.toString()
                } as AccountInfo;
            });
        });
    }
    getBenificiaries(): Promise<Benificiary[]> {
        return this.request({
            url: authority + `/mobile/beneficiaries`,
            method: 'GET'
        }).then(r => {
            return r.map(b => {
                b.user = cleanupUser(b.user);
                return b;
            });
        });
    }
    getUsers(): Promise<User[]> {
        return this.request({
            url: authority + `/mobile/users`,
            method: 'POST'
        }).then(r => {
            return r.map(cleanupUser);
        });
    }
    addBeneficiary(cairn_user_email: string): Promise<TransactionConfirmation> {
        return this.request({
            url: authority + '/mobile/beneficiaries',
            method: 'POST',
            content: JSON.stringify({
                cairn_user: cairn_user_email
            })
        });
    }
    createTransaction(account: AccountInfo, user: User, amount: number, reason: string, description: string): Promise<TransactionConfirmation> {
        return this.request({
            url: authority + '/mobile/transaction/request/new-unique.json',
            method: 'POST',
            content: JSON.stringify({
                fromAccount: account.id,
                toAccount: user.email,
                amount: amount + '',
                executionDate: dayjs().format('YYYY-MM-DD'),
                reason,
                description
            })
        });
    }
    confirmOperation(oprationId, code: string) {
        return this.request({
            url: authority + `/transaction/confirm/${oprationId}.json`,
            method: 'POST',
            content: JSON.stringify({
                save: 'true'
            })
        });
    }
    getAccountHistory(accountId: string): Promise<Transaction[]> {
        return this.request({
            url: authority + `/mobile/account/operations/${accountId}`,
            content: JSON.stringify({
                begin: dayjs()
                    .subtract(2, 'month')
                    .format('YYYY-MM-DD'),
                end: dayjs().format('YYYY-MM-DD'),
                // minAmount: '',
                // maxAmount: '',
                // keywords: '',
                types: {
                    '0': 'DEPOSIT'
                },
                orderBy: 'ASC'
            }),
            method: 'POST'
        }).then(r => {
            return r.map(t => {
                t.submissionDate = t.submissionDate.timestamp * 1000;
                t.executionDate = t.executionDate.timestamp * 1000;
                t.credit = t.type === TransactionType.CONVERSION_BDC || t.type === TransactionType.CONVERSION_HELLOASSO || t.type === TransactionType.DEPOSIT;
                return t as Transaction;
            });
        });
    }
    getToken(user: LoginParams) {
        return this.request({
            url: authority + tokenEndpoint,
            method: 'POST',
            content: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'password',
                username: user.username,
                password: user.password
            })
        })
            .then(result => {
                this.token = result.access_token;
                this.userId = result.user_id;
            })
            .catch(err => {
                this.token = undefined;
                console.error(err);
                return Promise.reject(err);
            });
    }
    login(user: LoginParams = this.loginParams) {
        if (!user) {
            return Promise.reject('missing_login_params');
        }
        const wasLoggedin = this.isLoggedIn();
        return this.getToken(user)

            .then(() => this.getUserProfile())
            .then(() => {
                this.loginParams = user;
                if (!wasLoggedin) {
                    this.notify({
                        eventName: LoggedinEvent,
                        object: this,
                        data: this.userProfile
                    });
                }
            })
            .catch(err => {
                this.onLoggedOut();
                return Promise.reject(err);
            });
    }

    onLoggedOut() {
        const wasLoggedin = this.isLoggedIn();
        this.token = undefined;
        this.loginParams = undefined;
        this.userId = undefined;
        if (wasLoggedin) {
            this.notify({
                eventName: LoggedoutEvent,
                object: this
            });
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
        this.onLoggedOut();
        // backendService.token = "";
        // return firebase.logout();
    }
}
