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
        events: {
            'click .btn-purchase': 'readyToPay'
        },
        initPage: function() {
            this.order = new Amour.Model();
            this.orderView = new OrderView({
                model: this.order,
                el: this.$('.order-detail')
            });
        },
        payOrder: function(charge) {
            console.log(charge);
            pingpp.createPayment(charge, function(result, error){
                if (result == "success") {
                    location.reload();
                } else if (result == "fail") {
                    alert('支付失败');
                } else if (result == "cancel") {
                    alert('取消');
                }
            });
        },
        readyToPay: function() {
            var url = Amour.APIRootSecure + 'shopit/pay/payByWx.do';
            App.securePost(url, {
                id: this.order.get('id'),
                order_No: this.order.get('order_No')
            }, function(data) {
                console.log(data);
                this.payOrder(data);
            }, this);
        },
        render: function() {
            var orderId = this.options.orderId;
            var url = Amour.APIRootSecure + 'shopit/pay/getOrderDetailByWx.do';
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
