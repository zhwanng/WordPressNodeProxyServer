var express = require('express');
var fxp = require("fast-xml-parser");
var toWPXml = require('../utils/covertToWPXml');
var request = require('request');
var errorUtils = require("../utils/errorUtils");
var uuid = require('uuid');
var router = express.Router();

router.post('/post', function (req, res, next) {
    console.log(req.body);
    var domain = req.body.domain;
    
    var reqBody = toWPXml.coverToXml(req.body);
    var u = domain + "/xmlrpc.php";
    // console.log(reqBody);

    sendRequest(req, res, u, reqBody);
});

router.post("/update", function (req, res, next) {
    var domain = req.body.domain;
    var u = domain + "/xmlrpc.php";
    var reqBody = toWPXml.coverToXmlForEditPost(req.body);
    reqBody = replaceUnusedChar(reqBody);

    request({
        url: u,
        method: "POST",
        headers: {
            "Accept": "*/*",
            "content-type": "text/xml",
            "User-Agent": "nodejs-xmlrpc-1.0"
        },
        body: reqBody
    }, function (error, response, body) {
        console.log(body);
        // <?xml version="1.0" encoding="UTF-8"?>
        // <methodResponse>
        //     <params>
        //         <param>
        //             <value>
        //                 <boolean>1</boolean>
        //             </value>
        //         </param>
        //     </params>
        // </methodResponse>
        var xml2json = fxp.parse(body);
        if (xml2json.methodResponse.fault) {
            var mbr = xml2json.methodResponse.fault.value.struct.member;
            var errCode = mbr[0].value.int;
            var errString = mbr[1].value.string;
            console.log("wordpress响应出错内: " + errString + ", code = " + errCode);
            res.json({
                code: errCode,
                message: errString
            });
        } else if (xml2json.methodResponse.params) {
            var resString = xml2json.methodResponse.params.param.value.boolean;
            console.log("wordpress响应正常");
            if(resString){//1
                res.json(errorUtils.success(null,"updated"));
            }
        } else {
            console.log(xml2json);
            res.json(errorUtils.internalServerErr());
        }
    });
});

function sendRequest(req, res, u, reqBody) {
    request({
        url: u,
        method: "POST",
        headers: {
            "Accept": "*/*",
            "content-type": "text/xml",
            "User-Agent": "nodejs-xmlrpc-1.0"
        },
        body: reqBody
    }, function (error, response, body) {
        console.log(body);
        var xml2json = fxp.parse(body);
        if (xml2json.methodResponse.fault) {
            var mbr = xml2json.methodResponse.fault.value.struct.member;
            var errCode = mbr[0].value.int;
            var errString = mbr[1].value.string;
            console.log("wordpress响应出错内: " + errString + ", code = " + errCode);
            res.json({
                code: errCode,
                message: errString
            });
        } else if (xml2json.methodResponse.params) {
            var resString = xml2json.methodResponse.params.param.value.string;
            console.log("wordpress响应正常");
            console.log(resString);
            res.json({
                code: 200,
                data: {
                    "articleId": resString
                },
                message: ""
            });
        } else {
            console.log(xml2json);
            res.json(errorUtils.internalServerErr());
        }
    });
}

/**
 * 上传媒体图片 
 */
router.post("/uploadImg", function (req, res, next) {
    var domain = req.body.domain;
    var account = req.body.account;
    var password = req.body.password;
    var imageBase64Data = req.body.imageBase64Data;
    var fileName = uuid.v1() + ".jpg";

    const covertData = {
        account: account,
        password: password,
        fileName: fileName,
        base64Data: imageBase64Data
    }

    var reqBody = toWPXml.coverBase64Xml(covertData);
    // console.log(reqBody);

    var u = domain + "/xmlrpc.php";
    request({
        url: u,
        method: "POST",
        headers: {
            // "Accept-Encoding":"gzip",
            "Accept": "*/*",
            "content-type": "text/xml",
            "User-Agent": "nodejs-xmlrpc-1.0"
        },
        body: reqBody
    }, function (error, response, body) {
        // console.log(body);
        var xml2json = fxp.parse(body);
        if (xml2json.methodResponse.fault) {
            var mbr = xml2json.methodResponse.fault.value.struct.member;
            var errCode = mbr[0].value.int;
            var errString = mbr[1].value.string;
            console.log("wordpress响应出错内: " + errString + ", code = " + errCode);
            res.json({
                "code": errCode,
                "message": errString
            });
        } else if (xml2json.methodResponse.params) {
            console.log("wordpress响应正常");
            var responseData = xml2json.methodResponse.params.param.value.struct.member;
            // console.log(JSON.stringify(responseData));
            var data = {};
            for (let i = 0; i < responseData.length; i++) {
                const element = responseData[i];
                if (element.name == "attachment_id") {
                    data.attachmentId = element.value.string;
                } else if (element.name == "link") {
                    data.link = element.value.string;
                } else if (element.name == "title") {
                    data.title = element.value.string;
                } else if (element.name == "type") {
                    data.type = element.value.string;
                } else if (element.name == "thumbnail") {
                    data.thumbnail = element.value.string;
                } else if (element.name == "id") {
                    data.id = element.value.string;
                } else if (element.name == "file") {
                    data.file = element.value.string;
                } else if (element.name == "url") {
                    data.url = element.value.string;
                }
            }
            console.log(data);
            res.json(errorUtils.success(data));
        } else {
            console.log(xml2json);
            res.json(errorUtils.internalServerErr());
        }
    });
});

function replaceUnusedChar(r){
   return r
    .replace(/\\\\\n/g, "")
    .replace(/\\\\n/g, "")
    .replace(/\\\n/g, "")
    .replace(/\\n/g, "")
    .replace(/\n/g, "")
    .replace(/\\\\\'/g, "\'")
    .replace(/\\\\'/g, "\'")
    .replace(/\\\'/g, "\'")
    .replace(/\\'/g, "\'")
    .replace(/\\\\\\\"/g, "\"")
    .replace(/\\\\\\"/g, "\"")
    .replace(/\\\\\"/g, "\"")
    .replace(/\\\\"/g, "\"")
    .replace(/\\\"/g, "\"")
    .replace(/\\"/g, "\"");
}



module.exports = router;