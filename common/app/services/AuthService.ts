import { numberProperty, objectProperty, stringProperty } from './BackendService';
import { EventData } from '@nativescript/core/data/observable';
import dayjs from 'dayjs';
import { MapBounds } from 'nativescript-carto/core';
import { HTTPError, HttpRequestOptions, NetworkService } from './NetworkService';
import { ImageAsset } from '@nativescript/core/image-asset';
import mergeOptions from 'merge-options';
import { ImageSource } from '@nativescript/core/image-source/image-source';
import { alert, login } from 'nativescript-material-dialogs';
import { $t, $tc, $tt, $tu } from '~/helpers/locale';

const tokenEndpoint = '/oauth/tokens';

export const LoggedinEvent = 'loggedin';
export const LoggedoutEvent = 'loggedout';
export const AccountInfoEvent = 'accountinfo';
export const UserProfileEvent = 'userprofile';
export const UserNeedsPasswordChangeEvent = 'userneedspasswordchange';

export interface NominatimAddress {
    city?: string;
    village?: string;
    city_district: string;
    country: string;
    country_code: string;
    house_number: string;
    neighbourhood: string;
    postcode: string;
    pedestrian?: string;
    street?: string;
    road?: string;
    state: string;
    suburb: string;
}
export interface NominatimResult {
    address: NominatimAddress;
    boundingbox: string[];
    class: string;
    display_name: string;
    importance: number;
    lat: string;
    lon: string;
    osm_id: string;
}

export interface AccountInfoEventData extends EventData {
    data: AccountInfo[];
}
export interface UserProfileEventData extends EventData {
    data: UserProfile;
}

export interface PhoneNumber {
    id: number;
    phoneNumber: string;
}
export interface SmsId {
    id: number;
    identifier: string;
}

export interface QrCodeTransferData {
    ICC: string;
    id: number;
    name: string;
    amount?: string;
}

export enum TransactionType {
    EXECUTED = 0,
    RECURRING = 1,
    SCHEDULED = 2,
    BDC = 3,
    HELLOASSO = 4,
    DEPOSIT = 5,
    WITHDRAWAL = 6,
    SCHEDULED_FAILED = 7,
    SMS_PAYMENT = 8,
    MANDATE = 9,
    ONLINE_PAYMENT = 10,
    RECONVERSION = 11,
    MOBILE_APP = 12,
    DIRECT_DEBITING = 13
}

export class User {
    // webPushSubscriptions: string[] = null;
    phoneNumbers: PhoneNumber[] = null;
    smsIds: SmsId[] = null;
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
        result.image = `${CAIRN_URL}/${result.image.webPath}`;
        // } else {
        // result.image = ``;
    }
    if (user.account_number) {
        // in case of perso user returned we might have account_number instead of mainICC
        result.mainICC = user.account_number;
    }
    if (user.phones) {
        result.phoneNumbers = [];
        result.smsIds = [];
        user.phones.forEach(p => {
            if (p.phoneNumber) {
                result.phoneNumbers.push({
                    id: p.id,
                    phoneNumber: p.phoneNumber
                });
            }
            if (p.identifier) {
                result.smsIds.push({
                    id: p.id,
                    identifier: p.identifier
                });
            }
        });
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
function cleanupTransaction(transaction: any, myUserId) {
    const result = pick(transaction, TransactionKeys) as Transaction;
    result.submissionDate = dayjs(result.submissionDate).valueOf();
    result.executionDate = dayjs(result.executionDate).valueOf();

    // TODO: remove
    // this is a fix for an error in the api. We need that for already done transactions.
    if (result.executionDate < result.submissionDate) {
        result.executionDate = result.submissionDate;
    }
    result.reason = result.reason.split('\n')[0];
    // t.executionDate = dayjs(t.executionDate).valueOf();
    result.credit = !result.creditor || result.creditor.id === myUserId;
    if (result.creditor) {
        result.creditor = cleanupUser(result.creditor);
    }
    if (result.debitor) {
        result.debitor = cleanupUser(result.debitor);
    }
    return result;
}

export interface LoginParams {
    username: string;
    password: string;
}

export enum Roles {
    PRO = 'ROLE_PRO',
    PERSON = 'ROLE_PERSON',
    // USER = 'ROLE_USER',
    ADMIN = 'ROLE_ADMIN',
    SUPER_ADMIN = 'ROLE_SUPER_ADMIN'
}

export interface ZipCity {
    id: number;
    zipCode: string;
    city: string;
    name: string;
}
export interface Address {
    id: number;
    street1: string;
    street2: string;
    latitude: number;
    longitude: number;
    zipCity: ZipCity;
}

export class Phone {
    id: number;
    phoneNumber: string;
    identifier?: string;
    paymentEnabled: boolean;
}

export class AccountInfo {
    balance?: number;
    id: string;
    number: string;
    name: string;
    status?: {
        balance: string;
        creditLimit: string;
    };
    type?: {
        name: string;
    };
}

export interface UserProfile extends User {}

export interface UpdateUserProfile extends Partial<Omit<UserProfile, 'image'>> {
    image?: ImageAsset | ImageSource;
}

export interface UserSettings {
    baseNotifications: [
        {
            radius: number;
            id: number;
            webPushEnabled: boolean;
            appPushEnabled: boolean;
            emailEnabled: boolean;
            smsEnabled: boolean;
            keyword: string;
        },
        {
            types: TransactionType[];
            minAmount: number;
            id: number;
            webPushEnabled: boolean;
            appPushEnabled: boolean;
            emailEnabled: boolean;
            smsEnabled: boolean;
            keyword: string;
        }
    ];
}
export interface Benificiary {
    autocompleteLabel: string;
    id: number;
    ICC: string;
    user: User;
}

export interface TransactionConfirmation {
    confirmation_url: string;
    secure_validation: boolean;
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

interface TokenRequestResult {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token: string;
    user_id: number;
    first_login: boolean;
}

export class Transaction {
    credit: boolean = null;
    smsPayment: boolean = null;
    id: number = null;
    type: TransactionType = null;
    paymentID: string = null;
    submissionDate: number = null;
    executionDate: number = null;
    creditorame: string = null;
    description: string = null;
    reason: string = null;
    amount: number = null;
    fromAccountNumber: string = null;
    toAccountNumber: string = null;
    creditor: {
        name: string;
        id: number;
    } = null;
    creditorName: string = null;
    debitor: {
        name: string;
        id: number;
    } = null;
    debitorName: string = null;
}
const TransactionKeys = Object.getOwnPropertyNames(new Transaction());

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
                        const bitmap: android.graphics.Bitmap = image;
                        const stream = new java.io.ByteArrayOutputStream();
                        // const size = bitmap.getRowBytes() * bitmap.getHeight();
                        // const byteBuffer = java.nio.ByteBuffer.allocate(size);
                        // bitmap.copyPixelsToBuffer(byteBuffer);
                        // const byteArray = byteBuffer.array();
                        bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream);
                        const byteArray = stream.toByteArray();
                        bitmap.recycle();

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
                bitmapImage.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream);
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
                        contentType: 'image/png',
                        fileName: 'image.png',
                        parameterName: `cairn_user_profile_edit[${k}][file]`
                    }));
                } else if (typeof value === 'object') {
                    return getFormData(value, `${prefix || ''}[${k}]`);
                } else {
                    return Promise.resolve({
                        data: value.toString(),
                        parameterName: `cairn_user_profile_edit${prefix || ''}[${k}]`
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
    @stringProperty pushToken: string;
    authority = CAIRN_URL;

    isLoggedIn() {
        return !!this.token && !!this.loginParams && !!this.userId;
    }

    // registerPushToken(pushToken: string) {
    //     this.pushToken = pushToken;
    //     if (this.token) {
    //         this.registerPushToken(pushToken);
    //     }
    // }
    async registerPushToken(pushToken: string) {
        this.pushToken = pushToken;
        return this.request<{ validation_url: string }>({
            apiPath: '/mobile/token-subscription',
            method: 'POST',
            body: {
                action: 'POST',
                platform: gVars.platform,
                device_token: pushToken
            }
        });
    }
    async unregisterPushToken() {
        if (this.pushToken) {
            const token = this.pushToken;
            this.pushToken = undefined;
            return this.request<{ validation_url: string }>({
                apiPath: '/mobile/token-subscription',
                method: 'POST',
                body: {
                    action: 'DELETE',
                    platform: gVars.platform,
                    device_token: token
                }
            });
        }
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
    async handleRequestRetry(requestParams: HttpRequestOptions, retry = 0) {
        // console.log('handleRequestRetry ', retry, requestParams);
        // refresh token
        if (requestParams.canRetry === false || retry === 2) {
            this.logout();
            throw new HTTPError({
                statusCode: 401,
                message: 'not_authorized',
                requestParams
            });
        }
        await this.getRefreshToken();
        return this.request(requestParams, retry + 1);
    }

    async getUserProfile(userId?: number) {
        const result = await this.request({
            apiPath: `/mobile/users/${userId || this.userId}`,
            method: 'GET'
        });
        if (!result) {
            return null;
        }
        const profile = cleanupUser(result);
        if (!userId || userId === this.userId) {
            this.userProfile = profile;
            this.notify({
                eventName: UserProfileEvent,
                object: this,
                data: profile
            } as UserProfileEventData);
        }

        return profile;
    }
    async getUserSettings() {
        const result = await this.request<UserSettings>({
            apiPath: `/mobile/notifications/${this.userId}`,
            method: 'GET'
        });
        // this.notify({
        //     eventName: UserProfileEvent,
        //     object: this,
        //     data: this.userProfile
        // } as UserProfileEventData);
        return result;
    }
    async postUserSettings(userSettings: UserSettings) {
        const result = await this.request<UserSettings>({
            apiPath: `/mobile/notifications/${this.userId}`,
            method: 'POST',
            body: { baseNotifications: userSettings.baseNotifications }
        });
        // this.notify({
        //     eventName: UserProfileEvent,
        //     object: this,
        //     data: this.userProfile
        // } as UserProfileEventData);
        return result;
    }
    async changePassword(currentPassword: string, newPassword: string) {
        const result = await this.request({
            apiPath: '/mobile/users/change-password',
            method: 'POST',
            body: {
                current_password: currentPassword,
                plainPassword: {
                    first: newPassword,
                    second: newPassword
                }
            }
        });
        if (this.loginParams) {
            this.loginParams.password = newPassword;
        }
        return result;
    }

    async updateUserProfile(data: UpdateUserProfile, userId?: number): Promise<any> {
        if (!data) {
            return Promise.resolve();
        }

        //the name cannnot be changed after account creation
        //can change logo only if adherent is a pro
        //an admin can also change name, username and id document if necessary
        const editableKeys = ['address', 'description', 'email'];
        if (this.isProUser(this.userProfile)) {
            editableKeys.push('image');
        } //if user is admin...

        const currentData = pick(this.userProfile as any, editableKeys);

        const actualData = mergeOptions(currentData, data);
        if (actualData.address) {
            actualData.address = pick(actualData.address, ['street1', 'street2', 'zipCity']);
            if (actualData.address.zipCity) {
                // actualData.address.zipCity = pick(actualData.address.zipCity, ['zipCode', 'city']);
                // currentData.address.zipCity = pick(currentData.address, ['street1', 'street2', 'zipCity']);
                actualData.address.zipCity = `${actualData.address.zipCity.zipCode} ${actualData.address.zipCity.city}`;
                // currentData.address.zipCity = pick(currentData.address.zipCity, ['city', 'zipCode']);
            }
        }
        const params = await getFormData(actualData);
        const result = await this.request({
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            apiPath: `/mobile/users/profile/${userId || this.userId}`,
            body: params.filter(s => !!s),
            method: 'POST'
        });
        // if it succeeds we need to update the user profile
        await this.getUserProfile();
        return result;
    }

    async addPhone(phoneNumber: string, userId: number) {
        return this.request<{ validation_url: string }>({
            apiPath: `/mobile/phones/add/${userId}`,
            method: 'POST',
            body: {
                phoneNumber,
                paymentEnabled: false
            }
        });
    }
    async confirmPhone(validationUrl: string, activationCode: string) {
        return this.request<{ validation_url: string }>({
            apiPath: validationUrl,
            method: 'POST',
            body: {
                activationCode
            }
        });
    }

    //Cannot use phoneNumber as URI because it is not an unique identifier :
    //a same phone number can be added to both a person and a pro
    async deletePhone(phoneNumber: PhoneNumber) {
        return this.request({
            apiPath: `/mobile/phones/${phoneNumber.id}`,
            method: 'DELETE',
            body: {
                save: 'true'
            }
        }).then(() => this.getUserProfile());
    }

    async getZipCities(zipCity: ZipCity) {
        return this.request({
            apiPath: '/zipcities',
            body: {
                search: `${zipCity.zipCode} ${zipCity.city}`
            },
            method: 'POST'
        });
    }
    async autocompleteAddress(query: string) {
        const result = await this.request({
            url: 'https://photon.komoot.de/api',
            queryParams: {
                q: query,
                // format: 'json',
                // 'accept-language': 'fr',
                // countrycodes: 'fr',
                lang: 'fr',
                // email: 'contact@akylas.fr',
                // namedetails: 0,
                // addressdetails: 1,
                // dedupe: true,
                limit: 20
            },
            method: 'GET'
        });
        const newItems = result.features
            .filter(
                r => (r.properties.osm_key === 'highway' || r.properties.street) && r.properties.city && r.properties.postcode
            )
            .map(r => ({
                longitude: r.geometry && r.geometry.coordinates[0],
                latitude: r.geometry && r.geometry.coordinates[1],
                display_name: `${r.properties.housenumber ? `${r.properties.housenumber} ` : ''}${r.properties.street ||
                    r.properties.name} ${r.properties.postcode} ${r.properties.city}`,
                street1: `${r.properties.housenumber ? `${r.properties.housenumber} ` : ''}${r.properties.street ||
                    r.properties.name}`,
                zipCity: {
                    name: `${r.properties.postcode} ${r.properties.city}`,
                    zipCode: r.properties.postcode,
                    city: r.properties.city
                }
            }));
        // const newItems = result.filter(s => s.address && (s.address.pedestrian || s.address.road || s.address.street) && (s.address.city || s.address.village));
        // newItems.forEach(s => (s.display_name = formatOsmAddress(s.address)));
        const displayNames = newItems.map(s => s.display_name);
        return newItems.filter((el, i, a) => i === displayNames.indexOf(el.display_name)) as Address[];
        // return newItems;
    }

    accounts: AccountInfo[];
    // lastAccountsUpdateTime: number;
    async getAccounts() {
        // if (!this.accounts || !this.lastAccountsUpdateTime || Date.now() - this.lastAccountsUpdateTime >= 3600 * 1000) {
        let result = await this.request<AccountInfo[]>({
            apiPath: '/mobile/accounts.json',
            method: 'GET'
        });

        result = result.map(a => ({
            balance: parseFloat(a.status.balance),
            creditLimit: parseFloat(a.status.creditLimit),
            number: a.number,
            id: a.id,
            name: a.type.name
        }));
        // this.lastAccountsUpdateTime = Date.now();
        this.accounts = result;
        // }
        this.notify({
            eventName: AccountInfoEvent,
            object: this,
            data: this.accounts
        } as AccountInfoEventData);
        return this.accounts;
    }
    beneficiaries: Benificiary[];
    // lastBenificiariesUpdateTime: number;
    async getBenificiaries() {
        // if (this.beneficiaries && this.lastBenificiariesUpdateTime && Date.now() - this.lastBenificiariesUpdateTime < 3600 * 1000) {
        // return this.beneficiaries;
        // }
        let result = await this.request<Benificiary[]>({
            apiPath: '/mobile/beneficiaries',
            method: 'GET'
        });
        console.log('beneficiaries', result);
        this.beneficiaries = result = result
            .filter(b => !!b.user)
            .map(b => {
                b.user = cleanupUser(b.user);
                return b;
            });
        // this.lastBenificiariesUpdateTime = Date.now();
        return result;
    }
    async getUsers({
        sortKey,
        sortOrder,
        limit,
        offset,
        query,
        mapBounds,
        roles,
        payment_context = true
    }: {
        sortKey?: string;
        sortOrder?: string;
        limit?: number;
        offset?: number;
        query?: string;
        mapBounds?: MapBounds;
        roles?: string[];
        payment_context?: boolean;
    }) {
        let boundingBox = {
            minLon: '',
            maxLon: '',
            minLat: '',
            maxLat: ''
        };
        if (mapBounds) {
            boundingBox = {
                minLon: mapBounds.southwest.longitude + '',
                maxLon: mapBounds.northeast.longitude + '',
                minLat: mapBounds.southwest.latitude + '',
                maxLat: mapBounds.northeast.latitude + ''
            };
        }

        const apiPath = this.isLoggedIn() ? '/mobile/users' : '/mapUsers';
        let result = await this.request<User[]>({
            apiPath,
            method: 'POST',
            body: {
                limit: limit || 100,
                offset: offset || 0,
                orderBy: {
                    key: sortKey || '',
                    order: sortOrder || ''
                },
                bounding_box: boundingBox,
                name: query || '',
                roles: roles || ['ROLE_PRO'],
                payment_context
            }
        });
        if (!Array.isArray(result)) {
            result = [result];
        }
        return result.filter(b => !!b).map(cleanupUser);
    }
    async addBeneficiary(cairn_user_email: string): Promise<TransactionConfirmation> {
        // this.lastBenificiariesUpdateTime = undefined;
        return this.request({
            apiPath: '/mobile/beneficiaries',
            method: 'POST',
            body: {
                cairn_user: cairn_user_email
            }
        });
    }
    async createTransaction(
        account: AccountInfo,
        user: User,
        amount: number,
        reason: string,
        description: string
    ): Promise<TransactionConfirmation> {
        const date = Date.now();
        const body = {
            fromAccount: account.number,
            toAccount: user.email || user.mainICC,
            amount,
            executionDate: date,
            // executionDate: dayjs().format('YYYY-MM-DD'),
            reason
            // api_secret: sha(date)
        } as any;
        if (!!description) {
            body.description = description;
        }
        return this.request({
            apiPath: '/mobile/payment/request',
            method: 'POST',
            body
        });
    }
    async confirmOperation(operationId, code?: string) {
        const result = await this.request({
            apiPath: `/mobile/transaction/confirm/${operationId}.json`,
            method: 'POST',
            body: {
                save: 'true',
                confirmationCode: '1111'
                // api_secret: sha(oprationId)
            }
        });
        // .then(r => {
        // we need to refresh accounts for he whole UI to update
        await this.getAccounts();
        return result;
        // });
    }
    async getUsersForMap(mapBounds: MapBounds) {
        // console.log('getUserForMap', mapBounds);
        return this.getUsers({ mapBounds, payment_context: false });
        // .then(r =>
        //     r.filter(u => {
        //         // console.log('getUserForMap', 'filter', u.address);
        //         if (!!u.address && !!u.address.latitude) {
        //             const result = mapBounds.contains({ latitude: u.address.latitude, longitude: u.address.longitude });
        //             // console.log('getUserForMap', 'contains', result);
        //             return result;
        //         }
        //         return false;
        //     })
        // );
    }
    accountHistory: {
        [k: string]: Transaction[];
    } = {};
    async getAccountHistory({
        accountId,
        sortKey,
        sortOrder,
        limit,
        offset,
        query
    }: {
        accountId: string;
        sortKey?: string;
        sortOrder?: string;
        limit?: number;
        offset?: number;
        query?: string;
    }) {
        const result = await this.request<Transaction[]>({
            apiPath: `/mobile/account/operations/${accountId}`,
            body: {
                begin: dayjs()
                    .subtract(2, 'month')
                    .format('YYYY-MM-DD'),
                end: dayjs().format('YYYY-MM-DD'),
                // maxAmount: '',
                // keywords: '',
                types: '',
                sortOrder: 'DESC',
                limit: limit || 100,
                offset: offset || 0
                // orderBy: {
                //     key: sortKey || '',
                //     order: sortOrder || ''
                // },
                // name: query || ''
            },
            method: 'POST'
        });
        const accountHistory = result
            .map(t => cleanupTransaction(t, this.userId))
            .sort(function(a, b) {
                return b.executionDate - a.executionDate;
            });
        this.accountHistory[accountId] = accountHistory;
        return accountHistory;
    }
    async fakeSMSPayment(sender: string, message: string) {
        return this.request({
            apiPath: '/sms/reception',
            method: 'GET',
            queryParams: {
                originator: 'blabalcairn',
                recipient: sender,
                message
            }
        });
    }
    async getToken(user: LoginParams) {
        try {
            const result = await this.request<TokenRequestResult>({
                cachePolicy: 'noCache',
                apiPath: tokenEndpoint,
                canRetry: false,
                method: 'POST',
                body: {
                    client_id: CAIRN_CLIENT_ID,
                    client_secret: CAIRN_CLIENT_SECRET,
                    grant_type: 'password',
                    username: user.username,
                    password: user.password
                }
            });
            this.token = result.access_token;
            this.refreshToken = result.refresh_token;
            this.userId = result.user_id;
            return result;
        } catch (err) {
            this.token = undefined;
            this.refreshToken = undefined;
            return Promise.reject(err);
        }
    }
    async getRefreshToken() {
        try {
            const result = await this.request<TokenRequestResult>({
                apiPath: tokenEndpoint,
                method: 'POST',
                canRetry: false,
                body: {
                    client_id: CAIRN_CLIENT_ID,
                    client_secret: CAIRN_CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken
                }
            });
            // console.log('getRefreshToken', result);
            this.token = result.access_token;
            this.refreshToken = result.refresh_token;
            return result;
        } catch (err) {
            // for now we try to get a new token there, should we?
            // Yes, we should !
            console.log('error getting refresh token', err);
            if (err.statusCode !== 'not_authorized' && this.loginParams) {
                return this.getToken(this.loginParams);
            }

            // this.token = undefined;
            // this.refreshToken = undefined;
            // return Promise.reject(err);
        }
    }
    async login(user: LoginParams = this.loginParams) {
        if (!user) {
            throw new Error('missing_login_params');
        }
        const wasLoggedin = this.isLoggedIn();
        try {
            const tokenResult = await this.getToken(user);

            if (tokenResult.first_login) {
                // we actually ask for a refresh token to see if the user needs
                // to change its password. The restult contains first_login which tells us.
                const result = await login({
                    title: $tc('password_change'),
                    message: $tc('password_change_required'),
                    userNameHint: $tc('new_password'),
                    usernameTextFieldProperties: {
                        secure: true,
                        marginBottom: 10
                    },
                    passwordHint: $tc('confirm_password')
                });
                if (!result || !result.result || result.password !== result.userName) {
                    this.onLoggedOut();
                    if (!result) {
                        return Promise.reject();
                    }
                    return Promise.reject($tc('wrong_password_confirmation'));
                } else {
                    await this.changePassword(user.password, result.password);
                    user.password = result.password;
                }
            }
            await this.getUserProfile();
            // .then(() => this.getUserProfile())
            // .then(() => {
            this.loginParams = user;
            if (!wasLoggedin) {
                // console.log('emitting loggedin event', new Error().stack);
                this.notify({
                    eventName: LoggedinEvent,
                    object: this,
                    data: this.userProfile
                } as UserProfileEventData);
            }
            // })
        } catch (err) {
            this.onLoggedOut();
            return Promise.reject(err);
        }
    }

    onLoggedOut() {
        const wasLoggedin = this.isLoggedIn();
        this.token = undefined;
        this.refreshToken = undefined;
        this.loginParams = undefined;
        this.userId = undefined;
        if (wasLoggedin) {
            this.notify({
                eventName: LoggedoutEvent,
                object: this
            });
        }
    }

    async register(user, type: string) {
        return this.request({
            apiPath: '/mobile/users/registration',
            method: 'POST',
            queryParams: {
                type
            }
        });
    }

    async resetPassword(email) {
        return this.request({
            url: `https://test.cairn-monnaie.com/resetting/check-email?username=${email}`,
            method: 'GET'
        });
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
