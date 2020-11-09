import  XRegExp  from 'xregexp';
const QR_CODE_TRANSFER_REGEXP_STR =
    CAIRN_TRANSFER_QRCODE_PARAMS.replace(/%\((.*?)\)s/g, '(?<$1>[^#]*)') +
    '(?:' +
    CAIRN_TRANSFER_QRCODE_AMOUNT_PARAM.replace(/%\((.*?)\)s/g, '(?<$1>[^#]*)') +
    ')?';
const QR_CODE_TRANSFER_REGEXP = XRegExp(QR_CODE_TRANSFER_REGEXP_STR);
export function parseUrlScheme(url: string) {
    if (!url || !url.startsWith(CUSTOM_URL_SCHEME)) {
        return null;
    }
    const array = url.substring(CUSTOM_URL_SCHEME.length + 3).split('/');
    console.log('handleReceivedAppUrl', CUSTOM_URL_SCHEME, url, array);
    let result;
    switch (array[0]) {
        case 'transfer': {
            const data = XRegExp.exec(array[1], QR_CODE_TRANSFER_REGEXP);
            result = {};
            Object.keys(data).forEach(k => {
                if (isNaN(parseFloat(k)) && k !== 'index' && k !== 'input' && k !== 'groups') {
                    result[k] = data[k];
                }
            });
        }
    }
    return { command: array[0], data: result };
}
