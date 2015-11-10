(function() {

    var ProductModel = Amour.Model.extend({
        url: Amour.APIRoot + 'beacon/data/getItemBycityName.do'
    });

    var ProductSimilarCollection = Amour.Collection.extend({
        url: Amour.APIRoot + 'beacon/data/listSameCategoryItemsByid.do'
    });

    var ProductBrandCollection = Amour.Collection.extend({
        url: Amour.APIRoot + 'beacon/data/listItemByBid.do'
    });

    var ProductView = Amour.ModelView.extend({
        className: 'product-detail',
        template: App.getTemplate('product-detail')
    });

    var ProductsListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            className: 'product-list-item',
            template: '<div class="img" data-bg-src="{{apiFullpath img}}"></div><div>{{name}}</div><div>{{price}}</div>'
        })
    });

    App.Pages.Product = new (App.PageView.extend({
        initPage: function() {
            this.product = new ProductModel();
            this.similarProducts = new ProductSimilarCollection();
            this.brandProducts = new ProductBrandCollection();
            this.views = {
                product: new ProductView({
                    model: this.product,
                    el: this.$('.product-wrapper')
                }),
                similarProducts: new ProductsListView({
                    collection: this.similarProducts,
                    el: this.$('.similar-products')
                }),
                brandProducts: new ProductsListView({
                    collection: this.brandProducts,
                    el: this.$('.brand-products')
                })
            };
        },
        render: function() {
            var productId = this.options.productId;
            var self = this;
            this.product.fetch({
                data: { id: productId },
                success: function(model) {
                    var brandId = self.product.get('brand').id;
                    self.brandProducts.fetch({
                        data: {
                            id: brandId,
                            start: 0,
                            size: 9
                        }
                    })
                }
            });
            this.similarProducts.fetch({
                data: {
                    id: productId,
                    size: 7
                }
            });
        }
    }))({el: $('#view-product')});

})();
