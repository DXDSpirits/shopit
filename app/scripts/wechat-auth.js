(function() {

    App.WX_OPENID = Amour.storage.get('WX_OPENID');

    var authWechat = function() {
        var redirect_uri = 'http://shopit.oatpie.com/order/';
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
        var query = [
            'appid=wx051770c8d3153629',
            'redirect_uri=' + redirect_uri,
            'response_type=code',
            'scope=snsapi_userinfo',
            'state=webapp_order_wechat'
        ].join('&');
        url += query;
        url += '#wechat_redirect';
        location.href = url;
    };

    var getOpenIDbyCode = function() {
        var code = location.query.code;
    };

    if (location.query.code) {
        getOpenIDbyCode();
    } else if (!App.WX_OPENID) {
        if (/^\/order\/?$/.test(location.pathname)) {
            authWechat();
        }
    }

})();
