(function() {

    var order = new (Amour.Model.extend({
        //
    }))({
        openId: App.WX_OPENID,
        count: 1
    });

    var ProductModel = Amour.Model.extend({
        url: Amour.APIRoot + 'beacon/data/getItemBycityName.do'
    });

    var QualityView = Amour.ModelView.extend({
        model: order,
        events: {
            'click .plus': 'increaseQuality',
            'click .minus': 'decreaseQuality'
        },
        increaseQuality: function() {
            order.set('count', Math.min(order.get('count') + 1, 10));
        },
        decreaseQuality: function() {
            order.set('count', Math.max(order.get('count') - 1, 0));
        },
        render: function() {
            this.$('.quality').text(order.get('count'));
        }
    });

    App.Pages.NewOrder = new (App.PageView.extend({
        events: {
            'click .input-item.menu > .input-content': 'expandInput',
            'click .input-item.menu.expand > .fa': 'unExpandInput'
        },
        initPage: function() {
            this.product = new ProductModel();
            this.order = order;
            this.views = {
                quality: new QualityView({ el: this.$('.input-item-quality') })
            };
            this.$('.input-item').on('expand', function() {
                $(this).addClass('expand').siblings().addClass('hidden');
            }).on('unexpand', function() {
                $(this).removeClass('expand').siblings().removeClass('hidden');;
            });
        },
        expandInput: function(e) {
            $(e.currentTarget).closest('.input-item').trigger('expand');
        },
        unExpandInput: function(e) {
            $(e.currentTarget).closest('.input-item').trigger('unexpand');
        },
        render: function() {
            var productId = this.options.productId;
            this.product.fetch({
                dataType: 'jsonp',
                data: { id: productId }
            });
        }
    }))({el: $('#view-new-order')});

})();
