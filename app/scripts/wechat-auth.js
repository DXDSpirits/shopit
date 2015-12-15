(function() {

    App.WX_OPENID = Amour.storage.get('WX_OPENID');
    App.WX_OPENID = 'oQyIgtyKQH-8irY-H_JVwIdMWK4E';

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
        var data = App.encryptJSON({
            code: code
        });
        var auth = new(Amour.Model.extend({
            url: Amour.APIRootSecure + 'beacon/pay/getopenIdByWx.do'
        }))();
        auth.save({
            data: data
        }, {
            // dataType: 'jsonp',
            success: function(model) {
                alert(model.toJSON());
            }
        });
    };

    if (location.query.code) {
        getOpenIDbyCode();
    } else if (!App.WX_OPENID) {
        App.WX_OPENID = '00000000000000000000000000000000';
        if (/^\/order\/?$/.test(location.pathname)) {
            authWechat();
        }
    }

})();
