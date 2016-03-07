/* *
 * MD5
 * 详细：MD5加密
 */

var crypto = require('crypto');

/**
 * 签名字符串
 * @param prestr 需要签名的字符串
 * @param key 私钥
 * return 签名结果
 */

exports.md5Sign = function(prestr, key){
    prestr = prestr + key;

    return crypto.createHash('md5').update(prestr, 'utf8').digest("hex"); //crypto.createHash('md5').update(prestr).digest("hex");
}

/**
 * 验证签名
 * @param prestr 需要签名的字符串
 * @param sign 签名结果
 * @param key 私钥
 * return 签名结果
 */

exports.md5Verify = function(prestr, sign, key){
    prestr = prestr + key;
    var mysgin = crypto.createHash('md5').update(prestr, 'utf8').digest("hex");
    if(mysgin == sign) {
        return true;
    }
    else {
        return false;
    }
}
