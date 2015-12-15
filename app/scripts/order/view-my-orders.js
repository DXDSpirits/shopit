(function() {

    var orders = new Amour.Collection();

    App.Pages.MyOrders = new (App.PageView.extend({
        initPage: function() {},
        render: function() {
            var url = Amour.APIRootSecure + 'beacon/pay/getOrderListByWx.do';
            App.securePost(url, {
                openId: App.WX_OPENID
            }, function(data) {
                orders.reset(data, { parse: true });
            });
        }
    }))({el: $('#view-my-orders')});

})();
