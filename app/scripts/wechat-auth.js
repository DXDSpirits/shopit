(function() {

    App.WX_OPENID = Amour.storage.get('WX_OPENID') || location.query.openid;

    var authWechat = function() {
        var redirect_uri = encodeURIComponent(location.href);
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
        var url = Amour.APIRootSecure + 'shopit/pay/getopenIdByWx.do';
        App.securePost(url, {
            code: code
        }, function(data) {
            console.log(data);
            // alert(JSON.stringify(data));
            if (+data.code == 1 && data.response && data.response.openid) {
                var openid = data.response.openid;
                App.WX_OPENID = openid;
                Amour.storage.set('WX_OPENID', openid);
                var href = location.href.split('?')[0] + ('?openid=' + openid);
                location.replace(href);
            }
        });
    };

    if (location.query.code) {
        getOpenIDbyCode();
    } else if (!App.WX_OPENID || App.WX_OPENID == 'undefined') {
        if (/order/.test(location.pathname)) {
            authWechat();
        }
    }

})();
