import { numberProperty, objectProperty } from './BackendService';
import { EventData } from '@nativescript/core/data/observable';
import dayjs from 'dayjs';
import { MapBounds } from 'nativescript-carto/core';
import { HTTPError, HttpRequestOptions, NetworkService } from './NetworkService';
import { TNSHttpFormData, TNSHttpFormDataParam, TNSHttpFormDataResponse } from 'nativescript-http-formdata';
import { ImageAsset } from '@nativescript/core/image-asset';
import mergeOptions from 'merge-options';
import { ImageSource } from '@nativescript/core/image-source/image-source';

const SHA_SECRET_KEY = 'FuckYouCoronavirus';
const clientId = '1_1vr46xqj1fmswgw0kkgw0os8okow8wcoow040sws8wsoc4kkk0';
const clientSecret = '3xh9mdtavh44ws888w88s88osc8cgskokoc0o0cwgocwwsg488';
const authority = 'https://test.cairn-monnaie.com';
const tokenEndpoint = '/oauth/tokens';

export const LoggedinEvent = 'loggedin';
export const LoggedoutEvent = 'loggedout';
export const AccountInfoEvent = 'accountinfo';
export const UserProfileEvent = 'userprofile';

import sha256 from 'hash.js/lib/hash/sha/256';

function sha(text: string | number) {
    return sha256()
        .update(SHA_SECRET_KEY + text)
        .digest('hex');
}

// const sha256 = require('hash.js');
// export function sha256(text: string) {
//     if (gVars.isAndroid) {
//         const md = java.security.MessageDigest.getInstance('SHA-256');
//         md.update(new java.lang.String(text).getBytes());
//         const digest = md.digest();
//         return android.util.Base64.encodeToString(digest, android.util.Base64.DEFAULT);
//     } else {
//         const data = NSString.stringWithString(text).dataUsingEncoding(NSUTF8StringEncoding);

//         unsigned char result[CC_SHA256_DIGEST_LENGTH];
//         CC_SHA256(data.bytes, data.length, result);

//         return [TiUtils convertToHex:(unsigned char *)&result length:CC_SHA256_DIGEST_LENGTH];
//     }
// }

export interface AccountInfoEventData extends EventData {
    data: AccountInfo[];
}
export interface UserProfileEventData extends EventData {
    data: UserProfile;
}

export class User {
    // webPushSubscriptions: string[] = null;
    phoneNumbers: string[] = null;
    // adherent: true = null;
    // admin: false = null;
    mainICC: string = null;
    autocompleteLabel?: string = null;
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
        result.creationDate = result.creationDate.timestamp * 1000;
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
export class AccountInfo {
    balance?: number;
    id: string;
    number: string;
    name: string;
}

export interface UserProfile extends User {}

export interface UpdateUserProfile extends Partial<Omit<UserProfile, 'image'>> {
    image?: ImageAsset | ImageSource;
}

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
    ONLINE_PAYMENT, // achat en ligne)
    MOBILE_APP
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

function getImageData(asset: ImageAsset | ImageSource): Promise<any> {
    return new Promise((resolve, reject) => {
        if (asset instanceof ImageAsset) {
            asset.getImageAsync((image, error) => {
                if (error) {
                    return reject(error);
                }
                let imageData: any;
                if (image) {
                    if (gVars.isIOS) {
                        imageData = UIImagePNGRepresentation(image);
                    } else {
                        // can be one of these overloads https://square.github.io/okhttp/3.x/okhttp/okhttp3/RequestBody.html
                        const bitmapImage: android.graphics.Bitmap = image;
                        const stream = new java.io.ByteArrayOutputStream();
                        bitmapImage.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, stream);
                        const byteArray = stream.toByteArray();
                        bitmapImage.recycle();

                        imageData = byteArray;
                    }
                }
                resolve(imageData);
            });
        } else {
            let imageData: any;
            if (gVars.isIOS) {
                imageData = UIImagePNGRepresentation(asset.ios);
            } else {
                // can be one of these overloads https://square.github.io/okhttp/3.x/okhttp/okhttp3/RequestBody.html
                const bitmapImage: android.graphics.Bitmap = asset.android;
                const stream = new java.io.ByteArrayOutputStream();
                bitmapImage.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, stream);
                const byteArray = stream.toByteArray();
                bitmapImage.recycle();

                imageData = byteArray;
            }
            resolve(imageData);
        }
    });
}
function flatten(arr) {
    return arr.reduce(function(flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function getFormData(actualData, prefix?: string) {
    return Promise.all(
        Object.keys(actualData).map(k => {
            const value = actualData[k];
            if (!!value) {
                if (value instanceof ImageAsset || value instanceof ImageSource) {
                    return getImageData(value).then(data => ({
                        data,
                        contentType: 'image/jpeg',
                        fileName: 'image.jpeg',
                        parameterName: `fos_user_profile_form[${k}][file]`
                    }));
                } else if (typeof value === 'object') {
                    return getFormData(value, `${prefix || ''}[${k}]`);
                } else {
                    return Promise.resolve({
                        data: value.toString(),
                        parameterName: `fos_user_profile_form${prefix || ''}[${k}]`
                    });
                }
            }

            return Promise.resolve(null);
        })
    ).then(result => flatten(result));
}

export default class AuthService extends NetworkService {
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

    // getUserId() {
    //     return this.request({
    //         url: authority + '/user.json',
    //         method: 'GET'
    //     }).then(result => {
    //         this.userId = result.current_user_id + '';
    //     });
    // }
    isProUser(profile: User = this.userProfile) {
        return profile.roles.indexOf(Roles.PRO) !== -1;
    }
    handleRequestRetry(requestParams: HttpRequestOptions, retry = 0) {
        console.log('handleRequestRetry', retry);
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
        return this.getToken(this.loginParams).then(() => this.request(requestParams, retry + 1));
    }
    getUserProfile(userId?: number) {
        return this.request({
            url: authority + `/mobile/users/${userId || this.userId}`,
            method: 'GET'
        }).then(result => {
            this.userProfile = cleanupUser(result);
            this.notify({
                eventName: UserProfileEvent,
                object: this,
                data: this.userProfile
            } as UserProfileEventData);
            return this.userProfile;
        });
    }
    updateUserProfile(data: UpdateUserProfile): Promise<any> {
        if (!data) {
            return Promise.resolve();
        }
        const currentData = pick(this.userProfile as any, ['address', 'name', 'image', 'description', 'email']);
        if (currentData.address) {
            currentData.address = pick(currentData.address, ['street1', 'street2', 'zipCity']);
            if (currentData.address.zipCity) {
                currentData.address.zipCity = `${currentData.address.zipCity.zipCode} ${currentData.address.zipCity.city}`;
                // currentData.address.zipCity = pick(currentData.address.zipCity, ['city', 'zipCode']);
            }
        }
        const actualData = mergeOptions(currentData, data);

        return getFormData(actualData).then(params =>
            this.requestMultipart({
                url: authority + '/mobile/users/profile',
                multipartParams: params.filter(s => !!s),
                method: 'POST'
            })
        );
    }
    addPhone(phoneNumber: string) {
        return this.request({
            url: authority + '/mobile/phones.json',
            method: 'POST',
            content: JSON.stringify({
                phoneNumber,
                paymentEnabled: false
            })
        }).then(() => this.getUserProfile());
    }
    deletePhone(phoneNumber: string) {
        return this.request({
            url: authority + `/mobile/phones/${this.userId}.json`,
            method: 'DELETE',
            content: JSON.stringify({
                phoneNumber,
                paymentEnabled: false
            })
        }).then(() => this.getUserProfile());
    }

    accounts: AccountInfo[];
    lastAccountsUpdateTime: number;
    async getAccounts(): Promise<AccountInfo[]> {
        if (this.accounts && this.lastAccountsUpdateTime && Date.now() - this.lastAccountsUpdateTime < 3600 * 1000) {
            return this.accounts;
        }
        return this.request({
            url: authority + '/mobile/accounts.json',
            method: 'GET'
        }).then(r => {
            const result = r.map(
                a =>
                    ({
                        balance: parseFloat(a.status.balance),
                        creditLimit: parseFloat(a.status.creditLimit),
                        number: a.number,
                        id: a.id,
                        name: a.type.name
                    } as AccountInfo)
            ) as AccountInfo[];
            this.notify({
                eventName: AccountInfoEvent,
                object: this,
                data: result
            } as AccountInfoEventData);
            this.lastAccountsUpdateTime = Date.now();
            this.accounts = result;
            return result;
        });
    }
    beneficiaries: Benificiary[];
    lastBenificiariesUpdateTime: number;
    async getBenificiaries(): Promise<Benificiary[]> {
        if (this.beneficiaries && this.lastBenificiariesUpdateTime && Date.now() - this.lastBenificiariesUpdateTime < 3600 * 1000) {
            return this.beneficiaries;
        }
        return this.request({
            url: authority + '/mobile/beneficiaries',
            method: 'GET'
        }).then(r => {
            r.map(b => {
                b.user = cleanupUser(b.user);
                return b;
            });
            this.lastBenificiariesUpdateTime = Date.now();
            this.beneficiaries = r;
            return r;
        });
    }
    getUsers(): Promise<User[]> {
        return this.request({
            url: authority + '/mobile/users',
            method: 'POST'
        }).then(r => r.filter(r => r.roles.indexOf('ROLE_PRO') !== -1).map(cleanupUser));
    }
    addBeneficiary(cairn_user_email: string): Promise<TransactionConfirmation> {
        this.lastBenificiariesUpdateTime = undefined;
        return this.request({
            url: authority + '/mobile/beneficiaries',
            method: 'POST',
            content: JSON.stringify({
                cairn_user: cairn_user_email
            })
        });
    }
    createTransaction(account: AccountInfo, user: User, amount: number, reason: string, description: string): Promise<TransactionConfirmation> {
        const date = Date.now();
        return this.request({
            url: authority + '/mobile/payment/request',
            method: 'POST',
            content: JSON.stringify({
                fromAccount: account.number,
                toAccount: user.email || user.mainICC,
                amount: amount + '',
                executionDate: date,
                // executionDate: dayjs().format('YYYY-MM-DD'),
                reason,
                description,
                api_secret: sha(date)
            })
        });
    }
    confirmOperation(oprationId, code?: string) {
        return this.request({
            url: authority + `/mobile/transaction/confirm/${oprationId}.json`,
            method: 'POST',
            content: JSON.stringify({
                save: 'true',
                confirmationCode: '1111',
                api_secret: sha(oprationId)
            })
        }).then(r => {
            // we need to refresh accounts
            this.getAccounts();
            return r;
        });
    }
    getUserForMap(mapBounds: MapBounds) {
        // console.log('getUserForMap', mapBounds);
        return this.getUsers().then(r =>
            r.filter(u => {
                // console.log('getUserForMap', 'filter', u.address);
                if (!!u.address && !!u.address.latitude) {
                    const result = mapBounds.contains({ latitude: u.address.latitude, longitude: u.address.longitude });
                    // console.log('getUserForMap', 'contains', result);
                    return result;
                }
                return false;
            })
        );
    }
    getAccountHistory(account: AccountInfo): Promise<Transaction[]> {
        return this.request({
            url: authority + `/mobile/account/operations/${account.id}`,
            content: JSON.stringify({
                begin: dayjs()
                    .subtract(2, 'month')
                    .format('YYYY-MM-DD'),
                end: dayjs().format('YYYY-MM-DD'),
                // minAmount: '',
                // maxAmount: '',
                // keywords: '',
                types: {
                    '0': 'DEPOSIT',
                    '1': 'TRANSACTION_EXECUTED'
                },
                orderBy: 'ASC'
            }),
            method: 'POST'
        }).then((r: Transaction[]) =>
            r
                .map(t => {
                    t.submissionDate = dayjs(t.submissionDate).valueOf();
                    // t.executionDate = dayjs(t.executionDate).valueOf();
                    t.credit = t.type === TransactionType.CONVERSION_BDC || t.type === TransactionType.CONVERSION_HELLOASSO || t.type === TransactionType.DEPOSIT;
                    return t;
                })
                .sort((a, b) => b.submissionDate - a.submissionDate)
        );
    }
    fakeSMSPayment(sender: string, message: string) {
        return this.request({
            url: `${authority}/sms/reception`,
            method: 'GET',
            queryParams: {
                originator: 'blabalcairn',
                recipient: sender,
                message
            }
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
                    } as UserProfileEventData);
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

let authService: AuthService;
export function getAuthInstance() {
    if (!authService) {
        authService = new AuthService();
    }
    return authService;
}
