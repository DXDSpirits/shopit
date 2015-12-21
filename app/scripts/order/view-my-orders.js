(function() {

    var orders = new Amour.Collection();

    var OrdersListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: { 'click': 'viewDetail' },
            className: 'order-item',
            template: App.getTemplate('order-item'),
            serializeData: function() {
                var data = this.model.toJSON();
                data.statusName = ['等待付款', '已付款/代收货', '取消订单', '退款中', '退款成功'][data.status];
                return data;
            },
            viewDetail: function() {
                App.router.navigate('order/' + this.model.id);
            }
        })
    });

    App.Pages.MyOrders = new (App.PageView.extend({
        initPage: function() {
            this.ordersListView = new OrdersListView({
                collection: orders,
                el: this.$('.orders-list')
            })
        },
        render: function() {
            var url = Amour.APIRootSecure + 'beacon/pay/getOrderListByWx.do';
            App.securePost(url, {
                openId: App.WX_OPENID
            }, function(data) {
                orders.reset(data, { parse: true });
            });
            orders.reset([{
                id: 3385, title: '复古牛仔背长裤', size: 'M', count: 3, amount: '999', status: 0,
                image: 'http://123.57.253.146/images/a88bd3f1765faca77aa4edf910619bb3.jpg',
            }, {
                id: 3386, title: '复古牛仔背长裤', size: 'M', count: 3, amount: '999', status: 1,
                image: 'http://123.57.253.146/images/a88bd3f1765faca77aa4edf910619bb3.jpg',
            }]);
        }
    }))({el: $('#view-my-orders')});

})();
