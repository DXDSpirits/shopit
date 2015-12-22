(function() {

    var OrderView = Amour.ModelView.extend({
        template: App.getTemplate('order-detail'),
        serializeData: function() {
            var data = this.model.toJSON();
            data.statusName = ['等待付款', '已付款/代收货', '取消订单', '退款中', '退款成功'][data.status];
            data.amount = data.total / 100;
            data.imageFullpath = Amour.APIRootSecure + data.item.img;
            data.createTimeFormat = moment(data.createTime).format('YYYY.MM.DD HH:mm::ss');
            data.payTimeFormat = moment(data.payTime).format('YYYY.MM.DD HH:mm:ss');
            return data;
        }
    });

    App.Pages.OrderDetail = new (App.PageView.extend({
        initPage: function() {
            this.order = new Amour.Model();
            this.orderView = new OrderView({
                model: this.order,
                el: this.$('.order-detail')
            });
        },
        render: function() {
            var orderId = this.options.orderId;
            var url = Amour.APIRootSecure + 'beacon/pay/getOrderDetailByWx.do';
            App.securePost(url, {
                id: orderId
            }, function(data) {
                console.log(data);
                this.order.set(data, { parse: true });
            }, this);
        }
    }))({
        el: $('#view-order-detail')
    });

})();
