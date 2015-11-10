(function() {

    var mediaSize = 1;

    var TopicModel = Amour.Model.extend({
        url: Amour.APIRoot + 'beacon/data/getTopic.do'
    });

    var ProductsCollection = Amour.Collection.extend({
        url: Amour.APIRoot + 'beacon/data/listItemByTid.do'
    });

    var CommentsCollection = Amour.Collection.extend({
        url: Amour.APIRoot + 'beacon/data/getAllCommentByTopic.do'
    });

    var TopicView = Amour.ModelView.extend({
        template: App.getTemplate('topic-detail')
    });

    var ProductsListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: { 'click': 'viewDetail' },
            className: 'product-item',
            template: '<div class="img" data-bg-src="{{apiFullpath img}}"></div><div>{{name}}</div>',
            viewDetail: function() {
                App.router.navigate('product/' + this.model.id);
            }
        })
    });

    var CommentsListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            className: 'comment-item',
            template: '<div>{{reply}}</div>'
        })
    });

    App.Pages.Topic = new (App.PageView.extend({
        initPage: function() {
            this.topic = new TopicModel();
            this.products = new ProductsCollection();
            this.comments = new CommentsCollection();
            this.views = {
                topic: new TopicView({
                    model: this.topic,
                    el: this.$('.topic-wrapper')
                }),
                products: new ProductsListView({
                    collection: this.products,
                    el: this.$('.topic-products')
                }),
                comments: new CommentsListView({
                    collection: this.comments,
                    el: this.$('.topic-comments')
                })
            };
        },
        render: function() {
            var topicId = this.options.topicId;
            this.products.fetch({
                data: { id: topicId, start: 0, size: mediaSize }
            });
            this.comments.fetch({
                data: { tid: topicId, size: 10, max_id: null }
            });
        }
    }))({el: $('#view-topic')});

})();
