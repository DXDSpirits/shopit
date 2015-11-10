(function() {

    var mediaSize = 9;

    var BrandModel = Amour.Model.extend({
        url: Amour.APIRoot + 'beacon/data/getBrand.do'
    });

    var ProductsCollection = Amour.Collection.extend({
        mediaType: 'product',
        url: Amour.APIRoot + 'beacon/data/listItemByBid.do'
    });

    var TopicsCollection = Amour.Collection.extend({
        mediaType: 'topic',
        url: Amour.APIRoot + 'beacon/data/listTopicByBid.do'
    });

    var BrandView = Amour.ModelView.extend({
        template: App.getTemplate('brand-detail')
    });

    var MediasListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: { 'click': 'viewDetail' },
            className: 'media-item',
            template: '<div class="img" data-bg-src="{{apiFullpath img}}"></div><div>{{name}}</div>',
            viewDetail: function() {
                if (this.model.collection.mediaType == 'product') {
                    App.router.navigate('product/' + this.model.id);
                } else {
                    App.Pages.Topic.topic.set(this.model.toJSON());
                    App.router.navigate('topic/' + this.model.id);
                }
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
                products: new MediasListView({
                    collection: this.products,
                    el: this.$('.brand-products')
                }),
                topics: new MediasListView({
                    collection: this.topics,
                    el: this.$('.brand-topics')
                })
            };
        },
        render: function() {
            var brandId = this.options.brandId;
            this.brand.fetch({
                data: { id: brandId }
            });
            this.products.fetch({
                data: { id: brandId, start: 0, size: mediaSize }
            });
            this.topics.fetch({
                data: { id: brandId, start: 0, size: mediaSize }
            });
        }
    }))({el: $('#view-brand')});

})();
