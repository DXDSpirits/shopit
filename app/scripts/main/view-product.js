(function() {

    var mediaSize = 9;

    var ProductModel = Amour.Model.extend({
        url: Amour.APIRoot + 'shopit/data/getItemBycityName.do'
    });

    var ProductSimilarCollection = Amour.Collection.extend({
        url: Amour.APIRoot + 'shopit/data/listSameCategoryItemsByid.do'
    });

    var ProductBrandCollection = Amour.Collection.extend({
        url: Amour.APIRoot + 'shopit/data/listItemByBid.do'
    });

    var ProductView = Amour.ModelView.extend({
        template: App.getTemplate('product-detail'),
        serializeData: function() {
            var data = this.model.toJSON();
            data.images = data.img1.split(',');
            return data;
        }
    });

    var MediasListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: { 'click': 'viewDetail' },
            className: 'media-item',
            template: '<div class="img" data-bg-src="{{apiFullpath img}}"></div><div class="name">{{name}}</div><div>￥{{offPrice}}</div>',
            viewDetail: function() {
                App.router.navigate('product/' + this.model.id);
            }
        })
    });

    App.Pages.Product = new (App.PageView.extend({
        events: {
            'click .store .btn': 'viewStores'
        },
        initPage: function() {
            this.product = new ProductModel();
            this.similarProducts = new ProductSimilarCollection();
            this.brandProducts = new ProductBrandCollection();
            this.views = {
                product: new ProductView({
                    model: this.product,
                    el: this.$('.product-wrapper')
                }),
                similarProducts: new MediasListView({
                    collection: this.similarProducts,
                    el: this.$('.similar-products .media-list')
                }),
                brandProducts: new MediasListView({
                    collection: this.brandProducts,
                    el: this.$('.brand-products .media-list')
                })
            };
        },
        viewStores: function() {
            App.router.navigate(['product', this.product.id, 'address'].join('/'));
        },
        carousel: function() {
            var self = this;
            var $cur = this.$('.carousel-item.active');
            var $next = $cur.next();
            if (!$next.length) {
                $next = $($cur.siblings()[0]);
            }
            $next.removeClass('invisible').addClass('active');
            $cur.removeClass('active');
            setTimeout(function() {
                $cur.addClass('invisible');
            }, 500);
            this.carouselTimer = setTimeout(function() {
                self.carousel();
            }, 2000);
        },
        leave: function() {
            clearTimeout(this.carouselTimer);
        },
        render: function() {
            var productId = this.options.productId;
            var self = this;
            this.product.fetch({
                dataType: 'jsonp',
                data: { id: productId },
                success: function(model) {
                    self.carousel();
                    var brandId = self.product.get('brand').id;
                    self.brandProducts.fetch({
                        dataType: 'jsonp',
                        data: { id: brandId, start: 0, size: mediaSize }
                    });
                    self.$('.store').toggleClass('hidden', model.get('online') == 1);
                }
            });
            this.similarProducts.fetch({
                dataType: 'jsonp',
                data: { id: productId, size: mediaSize }
            });
        }
    }))({el: $('#view-product')});

})();
