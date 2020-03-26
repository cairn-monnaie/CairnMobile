const SHA_SECRET_KEY = 'FuckYouCoronavirus';
// const sha256 = require('js-sha256');
const sha256 = require('hash.js/lib/hash/sha/256');
const crypto = require('crypto');

function sha(...args) {
    const test = sha256();
    args.forEach(a => test.update(a));
    return test.digest('hex');
}

console.log('test', sha(''), Date.now().toString());
console.log('test2', sha(SHA_SECRET_KEY, '1584921064'));
console.log('test4', sha(SHA_SECRET_KEY, '1584982215167', 'GET', '/mobile/accounts.json'));
console.log('test5', crypto.createHmac('sha256', SHA_SECRET_KEY).update('1584982215167').update('GET').update('/mobile/accounts.json').digest('hex'));
