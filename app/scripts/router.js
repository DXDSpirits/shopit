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
            this.route(/product\/(\d+)/, 'product');
            this.route(/brand\/(\d+)/, 'brand');
            this.route(/topic\/(\d+)/, 'topic');
        },
        index: function(path) {
            // this.navigate('home', { replace: true });
            this.navigate('topic/96', { replace: true });
        },
        product: function(pid) {
            pageRouter.goTo('Product', { productId: pid });
        },
        brand: function(bid) {
            pageRouter.goTo('Brand', { brandId: bid });
        },
        topic: function(tid) {
            pageRouter.goTo('Topic', { topicId: tid });
        }
    }))();

})();
