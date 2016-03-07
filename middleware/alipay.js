 'use strict';

 let qs = require('querystring');
 let alipay = {};

 alipay.Decode = function(req, res, next) {
     let buf = '';
     req.setEncoding('utf8');
     req.on('data', function(chunk) {
         buf += chunk;
     });
     req.on('end', function() {
         if (buf) {
             try {
                 let ob = qs.decode(buf);
                 req.body = ob;
             } catch (e) {
                 console.log('taobao body parser fail!');
                 console.log(e);
             }
         }
         next();
     });
 };

 module.exports = alipay;
