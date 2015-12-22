(function() {

    App.WX_OPENID = Amour.storage.get('WX_OPENID');
    // App.WX_OPENID = 'oQyIgtyKQH-8irY-H_JVwIdMWK4E';

    var authWechat = function() {
        var redirect_uri = location.href;
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
        var url = Amour.APIRootSecure + 'beacon/pay/getopenIdByWx.do';
        App.securePost(url, {
            code: code
        }, function(data) {
            console.log(data);
            alert(JSON.stringify(data));
            App.WX_OPENID = data.openid;
            Amour.storage.set('WX_OPENID', data.openid);
            location.search = '';
        });
    };

    if (location.query.code) {
        getOpenIDbyCode();
    } else if (!App.WX_OPENID) {
        if (/^\/order\/?$/.test(location.pathname)) {
            authWechat();
        }
    }

})();
