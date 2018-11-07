import { getString, setString } from "tns-core-modules/application-settings"

const tokenKey = "token"

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService {
    _token: string
    constructor() {
        this._token = getString(tokenKey)
    }

    get token() {
        return this._token
    }

    set token(newToken) {
        this._token = newToken
        setString(tokenKey, newToken)
    }
}
