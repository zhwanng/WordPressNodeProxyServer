//1001 - 1999,系统逻辑错误
//2000 - ？其他状态错误

module.exports = {
    success: function (d, m) {
        return {
            code: 200,
            message: m ? m : "",
            data: d
        }
    },
    autoReturnErr: function (code, message) {
        if (code == 1001) {
            return internalServerErr();
        } else if (code == 1002) {
            return headerErr();
        } else if (code == 1003) {
            return bodyParamsErr();
        } else if (code == 1004) {
            return paramsErr();
        } else if (code == 1005) {
            return forbiddenErr();
        } else {
            return this.err(code, message);
        }
    },

    err: function (code, message) {
        console.error("错误工具类打印：" + JSON.stringify({
            data: null,
            message: message,
            code: code
        }));
        return result;
    },

    //内部服务器错误
    internalServerErr: function (err) { //服务器内部错误
        console.error("错误工具类打印：" + JSON.stringify(err));
        const result = {
            data: null,
            message: '服务器内部错误',
            code: 500
        };
        return result;
    },

    headerErr: function () { //请求头参数错误
        console.error("错误工具类打印：请求头参数错误");
        const result = {
            data: null,
            message: '请求头参数错误',
            code: 403
        };
        return result;
    },
    bodyParamsErr: function () { //请求体参数错误
        console.error("错误工具类打印：请求体参数错误");
        const result = {
            data: null,
            message: '请求体参数错误',
            code: 403
        };
        return result;
    },
    paramsErr: function () { //请求参数错误
        console.error("错误工具类打印：请求参数错误");
        const result = {
            data: null,
            message: '请求参数错误',
            code: 403
        };
        return result;
    },
    forbiddenErr: function (message) { //服务器内部错误
        console.error("错误工具类打印：请求未完成");
        const result = {
            data: null,
            message: message,
            code: 403
        };
        return result;
    }
};