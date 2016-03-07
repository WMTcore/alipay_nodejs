'use strict';

let env = process.env.NODE_ENV || 'development';
let _ = require('lodash');
let express = require('express');
let router = express.Router();
let alipay = require('../../lib');
let moment = require('moment');

let PARAM_CONFIG = {
	'direct_check': ['out_trade_no', 'subject', 'total_fee', 'body', 'show_url'],
	'refund_check': ['refund_date', 'batch_no', 'batch_num', 'detail_data'],
	'customs_check': ['trade_no', 'out_request_no', 'amount', 'merchant_customs_code', 'merchant_customs_name', 'customs_place', 'is_split']
};

/**
 * 即时到帐
 * query{
 *  out_trade_no:'' //商户订单号, 商户网站订单系统中唯一订单号，必填
 *  ,subject:'' //订单名称 必填
 *  ,total_fee:'' //付款金额,必填
 *  ,body:'' //订单描述
 *  ,show_url:'' //商品展示地址 需以http://开头的完整路径，例如：http://www.xxx.com/myorder.html
 *  }
 */
router.get('/create_direct_pay_by_user', function(req, res, next) {
	let e = req.query;
	console.info('alipay create_direct_pay_by_user params:', e);
	let args = _.pick(e, PARAM_CONFIG.direct_check);
	if (_.keys(args).length === PARAM_CONFIG.direct_check.length) {
		try {
			return alipay.create_direct_pay_by_user(e, res);
		} catch (error) {
			console.error('create_direct_pay_by_user error:', error);
			return res.status(500).json({
				'message': '服务端错误'
			});
		}
	} else {
		return res.status(400).json({
			'message': '参数错误'
		})
	}

});


/**
 * 即时到帐有密退款
 * query{
 *  refund_date: moment().format('YYYY-MM-DD hh:mm:ss'),//退款请求时间 2011-01-12 11:21:00
 *  batch_no: moment().format('YYYYMMDD') + '01001' ,//   退款批次号，要用此格式，唯一
 *  batch_num: 2,// 总笔数
 *  detail_data: '2016012021001004120038398572^0.01^退款测试#2016012021001004120037983109^0.01^退款测试' //单笔数据集
 * }
 */
router.get('/refund_fastpay_by_platform_pwd', function(req, res, next) {
	let e = req.query;
	console.info('alipay refund_fastpay_by_platform_pwd params:', e);
	let args = _.pick(e, PARAM_CONFIG.refund_check);
	if (_.keys(args).length === PARAM_CONFIG.refund_check.length) {
		try {
			return alipay.refund_fastpay_by_platform_pwd(e, res);
		} catch (error) {
			console.error('refund_fastpay_by_platform_pwd error:', error);
			return res.status(500).json({
				'message': '服务端错误'
			})
		}
	} else {
		return res.status(400).json({
			'message': '参数错误'
		})
	}
});

/**
 *支付宝报关接口
 * query{
 *  trade_no: '2016012021001004120038398572', //支付宝交易号
 *  out_request_no: moment().format('YYYYMMDD') + '0001', //报关流水号
 *  amount: 0.01, //报关金额
 *  merchant_customs_code: 'hanguo', //商户海关备案编号
 *  merchant_customs_name: 'HANGZHOU', //商户海关备案名称
 *  customs_place: 'HANGZHOU',海关编号
 *  is_split: 'f', //是否拆单,T/t
 *  sub_out_biz_no: '0000000' //商户子订单号,拆单时必须传入
 * }
 */
router.get('/alipay_acquire_customs', function(req, res, next) {
	let e = req.query;
	console.info('alipay alipay_acquire_customs params:', e);
	let args = _.pick(e, PARAM_CONFIG.customs_check);
	if (_.keys(args).length === PARAM_CONFIG.customs_check.length) {
		try {
			alipay.alipay_acquire_customs(e).then(function(trade_no) {
				return utils.response(res, 200, {
					trade_no: trade_no
				});
			}, function(error) {
				console.error('alipay_acquire_customs error:', error);
				return res.status(500).json({
					'message': '服务端错误'
				})
			});
		} catch (error) {
			console.error('alipay_acquire_customs error:', error);
			return res.status(500).json({
				'message': '服务端错误'
			})
		}
	} else {
		return res.status(400).json({
			'message': '参数错误'
		})
	}
});

module.exports = router;