(function() {

    var orders = new Amour.Collection();

    var OrdersListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: { 'click': 'viewDetail' },
            className: 'order-item',
            template: App.getTemplate('order-item'),
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
        }
    }))({el: $('#view-my-orders')});

})();
