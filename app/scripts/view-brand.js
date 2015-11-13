(function() {

    var BrandModel = Amour.Model.extend({
        url: Amour.APIRoot + 'beacon/data/getBrand.do'
    });

    var ProductsCollection = Amour.Collection.extend({
        url: Amour.APIRoot + 'beacon/data/listItemByBid.do'
    });

    var TopicsCollection = Amour.Collection.extend({
        url: Amour.APIRoot + 'beacon/data/listTopicByBid.do'
    });

    var BrandView = Amour.ModelView.extend({
        template: App.getTemplate('brand-detail')
    });

    var TopicsListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: { 'click': 'viewDetail' },
            className: 'topic-media-item',
            template: '<div class="img" data-bg-src="{{apiFullpath img}}"><div class="title">{{title}}</div></div>',
            viewDetail: function() {
                App.router.navigate('topic/' + this.model.id);
            }
        })
    });

    var ProductsListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: { 'click': 'viewDetail' },
            className: 'product-media-item',
            template: '<div class="img" data-bg-src="{{apiFullpath img}}"></div>' +
                      '<div class="content">' +
                      '<div><span class="brand">{{brand.name}}</span></div>' +
                      '<div class="name">{{name}}</div>' +
                      '<div>{{#if isDiscount}}<span class="discount">￥{{price}}</span>{{/if}}<span class="text-success">￥{{offPrice}}</span></div>' +
                      '</div>',
            viewDetail: function() {
                App.router.navigate('product/' + this.model.id);
            }
        })
    });

    App.Pages.Brand = new (App.PageView.extend({
        initPage: function() {
            this.brand = new BrandModel();
            this.products = new ProductsCollection();
            this.topics = new TopicsCollection();
            this.views = {
                brand: new BrandView({
                    model: this.brand,
                    el: this.$('.brand-wrapper')
                }),
                products: new ProductsListView({
                    collection: this.products,
                    el: this.$('.brand-products .media-list')
                }),
                topics: new TopicsListView({
                    collection: this.topics,
                    el: this.$('.brand-topics .media-list')
                })
            };
        },
        render: function() {
            var brandId = this.options.brandId;
            this.brand.fetch({
                dataType: 'jsonp',
                data: { id: brandId }
            });
            this.products.fetch({
                dataType: 'jsonp',
                data: { id: brandId, start: 0, size: 6 }
            });
            this.topics.fetch({
                dataType: 'jsonp',
                data: { id: brandId, start: 0, size: 9 }
            });
        }
    }))({el: $('#view-brand')});

})();
