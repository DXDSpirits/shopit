(function() {

    var pageRouter = App.pageRouter;

    App.router = new (Backbone.Router.extend({
        navigate: function(fragment, options) {
            options = options || {};
            options.trigger = !(options.trigger === false);
            options.replace && pageRouter.pop();
            pageRouter.pushNext = true;
            Backbone.Router.prototype.navigate.call(this, fragment, options);
        },
        initialize: function(){
            this.route('*path', 'index');
            this.route(/^neworder\/(\d+)$/, 'neworder');
            this.route(/^order\/(\d+)$/, 'orderDetail');
            this.route('order', 'order');
        },
        index: function(path) {
            // this.navigate('home', { replace: true });
            this.navigate('address', { replace: true });
        },
        neworder: function(pid) {
            pageRouter.goTo('NewOrder', { productId: pid });
        },
        order: function() {
            pageRouter.goTo('MyOrders');
        },
        orderDetail: function(oid) {
            pageRouter.goTo('OrderDetail', { orderId: oid });
        }
    }))();

})();
