'use strict';

let env = process.env.NODE_ENV || 'development';
let config = require(__dirname + '/../../config/config.json')[env].alipay;
var Alipay = require('./alipay').Alipay;

var alipay = new Alipay (config);
 alipay.on('verify_fail',function(){console.log('index emit verify_fail')})
    .on('create_direct_pay_by_user_trade_success', function(out_trade_no, trade_no){console.log('test： callback: create_direct_pay_by_user_trade_success')})
    .on('refund_fastpay_by_platform_pwd_success', function(batch_no, success_num, result_details){console.log('test： callback: refund_fastpay_by_platform_pwd_success')})

module.exports = alipay;