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
                data.amount = data.total / 100;
                data.imageFullpath = Amour.APIRootSecure + data.item.img;
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
            var url = Amour.APIRootSecure + 'shopit/pay/getOrderListByWx.do';
            App.securePost(url, {
                openId: App.WX_OPENID
            }, function(data) {
                console.log(data);
                orders.reset(data, { parse: true });
            });
        }
    }))({el: $('#view-my-orders')});

})();
