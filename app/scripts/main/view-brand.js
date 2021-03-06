(function() {

    var BrandModel = Amour.Model.extend({
        url: Amour.APIRoot + 'shopit/data/getBrand.do'
    });

    var Collection = Amour.Collection.extend({
        fetch: function(options) {
            options = options || {};
            var data = options.data || {};
            this.queryData = {
                id: data.id,
                start: data.start,
                size: data.size
            };
            Amour.Collection.prototype.fetch.call(this, options);
        },
        fetchNext: function(options) {
            options = options || {};
            var data = {};
            data.id = this.queryData.id;
            data.start = (this.queryData.start || 0) + (this.queryData.size || 10);
            data.size = this.queryData.size;
            _.extend(options, {
                // global: false,
                // dataType: 'jsonp',
                data: data
            });
            this.fetch(options);
        }
    });

    var ProductsCollection = Collection.extend({
        url: Amour.APIRoot + 'shopit/data/listItemByBid.do'
    });

    var TopicsCollection = Collection.extend({
        url: Amour.APIRoot + 'shopit/data/listTopicByBid.do'
    });

    var BrandView = Amour.ModelView.extend({
        events: {
            'click .more': 'showMore'
        },
        template: App.getTemplate('brand-detail'),
        render: function() {
            Amour.ModelView.prototype.render.call(this);
            var h = this.$('.description').height();
            if (h > 50) {
                var count = $(window).width() / 10;
                var description = this.model.get('description');
                var desc = '';
                for (var i=0; i<description.length; i++) {
                    var c = description[i];
                    desc += c;
                    count -= c.charCodeAt() < 256 ? 0.5 : 1;
                    if (count <= 0) break;
                }
                this.$('.desc').text(desc + ' ......');
                this.$('.description').addClass('ellipsis');
            }
            return this;
        },
        showMore: function() {
            $('#desc-full')
            .find('h4').text('品牌介绍').end()
            .find('article').text(this.model.get('description')).end()
            .removeClass('invisible')
            .one('click', function() {
                $(this).addClass('invisible');
            });
        }
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
            template: App.getTemplate('product-media-item'),
            viewDetail: function() {
                App.router.navigate('product/' + this.model.id);
            }
        })
    });

    App.Pages.Brand = new (App.PageView.extend({
        events: {
            'click .store .btn': 'viewStores'
        },
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
            this.$('.wrapper').on('scroll', _.bind(this.throttleLoading, this));
        },
        throttleLoading: _.throttle(function() {
            if (this.fetching) return;
            var scrollTop = this.$('.wrapper').scrollTop();
            var height = this.$('.wrapper').height();
            if (scrollTop + height >= this.$('.media-carousel').height()) {
                this.fetchMore();
            }
        }, 200),
        fetchMore: function() {
            this.fetching = true;
            var delayReset = _.bind(function() {
                this.fetching = false;
            }, this);
            var which = this.$('.brand-products').hasClass('active') ? this.products : this.topics;
            _.delay(function() {
                which.fetchNext({
                    remove: false,
                    success: delayReset,
                    error: delayReset
                });
            }, 200);
        },
        viewStores: function() {
            App.router.navigate(['brand', this.brand.id, 'address'].join('/'));
        },
        render: function() {
            var brandId = this.options.brandId;
            this.brand.fetch({
                // dataType: 'jsonp',
                data: { id: brandId }
            });
            this.products.fetch({
                // global: false,
                // dataType: 'jsonp',
                data: { id: brandId, start: 0, size: 10 }
            });
            this.topics.fetch({
                // global: false,
                // dataType: 'jsonp',
                data: { id: brandId, start: 0, size: 10 }
            });
        }
    }))({el: $('#view-brand')});

})();
