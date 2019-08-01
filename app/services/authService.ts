import { numberProperty, objectProperty } from './BackendService';
import { EventData } from 'tns-core-modules/data/observable';
import dayjs from 'dayjs';
import { MapBounds } from 'nativescript-carto/core/core';
import { HTTPError, HttpRequestOptions, NetworkService } from './NetworkService';
import { TNSHttpFormData, TNSHttpFormDataParam, TNSHttpFormDataResponse } from 'nativescript-http-formdata';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import mergeOptions from 'merge-options';

const clientId = '3_2gd9gnkf3pj4g4c0wkkwcsskskcwk40o8c4w8w8gko0o08gcog';
const clientSecret = '2062ors5k8xwgsk8kw0gg48cg4swg40k8o04ogscg0ww8kc00w';
const authority = 'https://test.cairn-monnaie.com';
const tokenEndpoint = '/oauth/tokens';

export const LoggedinEvent = 'loggedin';
export const LoggedoutEvent = 'loggedout';
export const AccountInfoEvent = 'accountinfo';
export const UserProfileEvent = 'userprofile';

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
export interface AccountInfo {
    balance?: number;
    id: string;
    number: string;
    name: string;
}

export interface UserProfile extends User {}

export interface UpdateUserProfile extends Partial<Omit<UserProfile, 'image'>> {
    image?: ImageAsset;
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

function getImageData(asset: ImageAsset): Promise<any> {
    return new Promise((resolve, reject) => {
        asset.getImageAsync((image, error) => {
            if (error) {
                return reject(error);
            }
            let imageData: any;
            if (image) {
                if (image.ios) {
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
                if (value instanceof ImageAsset) {
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
    isProUser() {
        return this.userProfile.roles.indexOf(Roles.PRO) !== -1;
    }
    handleRequestRetry(requestParams: HttpRequestOptions, retry = 0) {
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
    getUserProfile() {
        return this.request({
            url: authority + `/mobile/users/${this.userId}`,
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
                currentData.address.zipCity = pick(currentData.address.zipCity, ['city', 'zipCode']);
            }
        }
        const actualData = mergeOptions(currentData, data);

        return getFormData(actualData).then(params =>
            this.requestMultipart({
                url: authority + `/mobile/users/profile`,
                multipartParams: params.filter(s => !!s),
                method: 'POST'
            })
        );
    }
    addPhone(phoneNumber: string) {
        return this.request({
            url: authority + `/mobile/phones.json`,
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
    getAccounts(): Promise<AccountInfo[]> {
        return this.request({
            url: authority + `/mobile/accounts.json`,
            method: 'GET'
        }).then(r => {
            const result = r.map(a => {
                return {
                    balance: parseFloat(a.status.balance),
                    creditLimit: parseFloat(a.status.creditLimit),
                    number: a.number,
                    id: a.id,
                    name: a.type.name
                } as AccountInfo;
            }) as AccountInfo[];
            this.notify({
                eventName: AccountInfoEvent,
                object: this,
                data: result
            } as AccountInfoEventData);
            return result;
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
                fromAccount: account.number,
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
            url: authority + `/mobile/transaction/confirm/${oprationId}.json`,
            method: 'POST',
            content: JSON.stringify({
                save: 'true'
            })
        }).then(r => {
            // we need to refresh accounts
            this.getAccounts();
            return r;
        });
    }
    getUserForMap(mapBounds: MapBounds) {
        // console.log('getUserForMap', mapBounds);
        return this.getUsers().then(r => {
            return r.filter(u => {
                // console.log('getUserForMap', 'filter', u.address);
                if (!!u.address && !!u.address.latitude) {
                    const result = mapBounds.contains({ latitude: u.address.latitude, longitude: u.address.longitude });
                    // console.log('getUserForMap', 'contains', result);
                    return result;
                }
                return false;
            });
        });
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
                    '0': 'DEPOSIT'
                },
                orderBy: 'ASC'
            }),
            method: 'POST'
        }).then(r => {
            return r.map(t => {
                // t.submissionDate = t.submissionDate.timestamp * 1000;
                // t.executionDate = t.executionDate.timestamp * 1000;
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
