var xmlBuilder = require("xmlbuilder");

//创建内容：<param><value></value></param>
function createParamEle(parent) {
    var paramEle = parent.ele("param");
    return paramEle.ele("value");
}

//创建内容：<member><name>xxx</name><value><string>xxx</string></value></member>
//或者
//创建内容：<member><name>xxx</name><value></value></member>
function createMemberStringEle(parent, nameValue, valueContent) {
    if (valueContent) {
        var memberEle = parent.ele("member");
        memberEle.ele("name", nameValue);
        var valueEle = memberEle.ele("value");
        if (nameValue == "post_content") {//如果是发布的文章内容，要加上cdata
            valueEle.ele("string").cdata(valueContent);
        } else {
            valueEle.ele("string", valueContent);
        }
    }
}


//创建内容：<member><name>xxx</name><value><int>xxx</int></value></member>
//或者
//创建内容：<member><name>xxx</name><value></value></member>
function createMemberIntEle(parent, nameValue, valueContent) {
    if (valueContent) {
        var memberEle = parent.ele("member");
        memberEle.ele("name", nameValue);
        var valueEle = memberEle.ele("value");
        valueEle.ele("int", valueContent);
    }
}
//创建内容：<member><name>xxx</name><value><string>xxx</string></value></member>
//或者
//创建内容：<member><name>xxx</name><value></value></member>
function createMemberBase64Ele(parent, nameValue, valueContent) {
    if (valueContent) {
        var memberEle = parent.ele("member");
        memberEle.ele("name", nameValue);
        var valueEle = memberEle.ele("value");
        valueEle.ele("base64", valueContent);
    }
}

//创建标签和分类的父标签
function createTagCategoryEle(parent, tags, categorys) {
    // console.log(tags instanceof Array);
    if ((tags instanceof Array && tags.length > 0) || categorys) {
        var structMemberEle = parent.ele("member");
        structMemberEle.ele("name", "terms_names");
        var structMemberValueEle = structMemberEle.ele("value").ele("struct");
        createTagEle(structMemberValueEle, tags);
        createCategoryEle(structMemberValueEle, categorys);
    }
}

//创建标签
function createTagEle(parent, tags) {
    if (tags instanceof Array && tags.length > 0) {
        var structMemberEle = parent.ele("member");
        structMemberEle.ele("name", "post_tag");
        var tagDataArray = structMemberEle.ele("value").ele("array").ele("data");
        tags.forEach(element => {
            tagDataArray.ele("value").ele("string", (element));
        });
    }
}

//创建分类
function createCategoryEle(parent, categorys) {
    if (categorys) {
        var structMemberEle = parent.ele("member");
        structMemberEle.ele("name", "category");
        var tagDataArray = structMemberEle.ele("value").ele("array").ele("data");
        var cArray = categorys.split(",");
        cArray.forEach(element => {
            tagDataArray.ele("value").ele("string", (element));
        });
    }
}

/**
 * 将Base64转换成WordPress的XML数据
 * @param {*} data base64编码数据
 */
function coverBase64Xml(data) {
    var account = data.account;
    var password = data.password;
    var fileName = data.fileName;
    var base64Data = data.base64Data;

    //base64加上这些字符WordPress网站接口无法解析，所以要去掉
    base64Data = base64Data
        .replace("data:image/jpeg;base64,", "")
        .replace("data:image/jpg;base64,", "")
        .replace("data:image/png;base64,", "");

    var methodCall = xmlBuilder.create("methodCall", {
        encoding: 'utf-8'
    }); //root
    // methodCall.com("注释测试");
    methodCall.ele("methodName", "wp.uploadFile"); //调用WordPress的函数名字
    var paramsEle = methodCall.ele("params"); //参数结构体
    createParamEle(paramsEle).ele("int", 0); //(int) Blog ID (unused).
    createParamEle(paramsEle).ele("string", account); //Username
    createParamEle(paramsEle).ele("string", password); //Password

    //文章详情参数：通用参数
    var structEle = createParamEle(paramsEle).ele("struct"); //文章详情参数结构体
    createMemberStringEle(structEle, "name", fileName);
    createMemberStringEle(structEle, "type", "image/jpeg");
    createMemberBase64Ele(structEle, "bits", base64Data); //base64标签

    //root结束
    var e = methodCall.end({
        pretty: true //格式化
    });

    // console.log(e.toString);
    return e.toString();
}

/**
 * 发布文章
 * @param {*} data request data
 */
function coverToXml(data) {
    var account = data.account;//账户
    var password = data.password;//账户密码
    var title = data.title;//标题
    var content = data.content;//文章内容
    var tags = data.tags;//标签
    var postThumbnail = data.featureImg;//封面图
    var categorys = data.categorys;//分类
    var excerpt = data.excerpt;//摘要

    //root
    var methodCall = xmlBuilder.create("methodCall", {
        encoding: 'utf-8'
    }); 

    // methodCall.com("注释测试");
    methodCall.ele("methodName", "wp.newPost"); //调用WordPress的函数名字
    var paramsEle = methodCall.ele("params"); //参数结构体
    createParamEle(paramsEle).ele("int", 0); //(int) Blog ID (unused).
    createParamEle(paramsEle).ele("string", account); //Username
    createParamEle(paramsEle).ele("string", password); //Password

    //文章详情参数：通用参数
    var structEle = createParamEle(paramsEle).ele("struct"); //文章详情参数结构体
    createMemberStringEle(structEle, "post_status", "publish");
    createMemberStringEle(structEle, "post_title", (title));
    createMemberStringEle(structEle, "post_excerpt", (excerpt));
    createMemberStringEle(structEle, "post_content", (content));
    createMemberIntEle(structEle, "post_thumbnail", (postThumbnail));
    // createMemberStringEle(structEle, "terms", 'terms');
    createMemberStringEle(structEle, "post_type", 'post');

    //文章详情参数：标签分类
    createTagCategoryEle(structEle, tags, categorys);

    //root结束
    var e = methodCall.end({
        pretty: true
    });

    // console.log(e.toString);
    return e.toString();
}

/**
 * 修改文章
 * @param {*} data request data
 */
function coverToXmlForEditPost(data) {
    var account = data.account;
    var password = data.password;
    var wpArticleId = data.wpArticleId;
    var title = data.title;
    var tags = data.tags;
    var content = data.content;
    var categorys = data.categorys;
    var excerpt = data.excerpt;

    var methodCall = xmlBuilder.create("methodCall", {
        encoding: 'utf-8'
    }); //root

    // methodCall.com("注释测试");
    methodCall.ele("methodName", "wp.editPost"); //调用WordPress的函数名字
    var paramsEle = methodCall.ele("params"); //参数结构体
    createParamEle(paramsEle).ele("int", 0); //(int) Blog ID (unused).
    createParamEle(paramsEle).ele("string", account); //Username
    createParamEle(paramsEle).ele("string", password); //Password
    createParamEle(paramsEle).ele("int", wpArticleId); //wpArticleId
    //文章详情参数：通用参数
    var structEle = createParamEle(paramsEle).ele("struct"); //文章详情参数结构体
    createMemberStringEle(structEle, "post_title", (title));//标题
    createMemberStringEle(structEle, "post_excerpt", (excerpt));//摘要
    createMemberStringEle(structEle, "post_content", (content));//内容
    // createMemberIntEle(structEle, "post_thumbnail", (postThumbnail));//缩略图

    //文章详情参数：标签分类
    createTagCategoryEle(structEle, tags, categorys);//标签和分类

    //root结束
    var e = methodCall.end({
        pretty: true
    });

    // console.log(e.toString);
    return e.toString();
}

module.exports = {
    coverBase64Xml,
    coverToXml,
    coverToXmlForEditPost
}