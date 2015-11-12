(function() {

    var mediaSize = 4;

    var TopicModel = Amour.Model.extend({
        url: Amour.APIRoot + 'beacon/admin/getTopic.do'
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
            className: 'media-item',
            template: '<div class="img" data-bg-src="{{apiFullpath img}}"></div>' +
                      '<div class="content">' +
                      '<div><span class="brand">{{brand.name}}</span></div>' +
                      '<div class="name">{{name}}</div>' +
                      '<div class="text-success">{{price}}</div>' +
                      '</div>',
            viewDetail: function() {
                App.router.navigate('product/' + this.model.id);
            }
        })
    });

    var CommentsListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            className: 'comment-item',
            template: '<div class="avatar img" data-bg-src="{{apiFullpath user.img}}"></div>' +
                      '<div class="like">{{like}}</div>' +
                      '<div class="name">{{user.nickname}}</div>' +
                      '<div class="time">{{formatted_date}}</div>' +
                      '<div class="reply">{{reply}}</div>',
            serializeData: function() {
                var data = Amour.ModelView.prototype.serializeData.call(this);
                data.formatted_date = moment(data.createTime).format('MM月DD日 HH:mm');
                data.like = data.like || '';
                return data;
            }
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
                    el: this.$('.topic-products .media-list')
                }),
                comments: new CommentsListView({
                    collection: this.comments,
                    el: this.$('.comments-list')
                })
            };
        },
        render: function() {
            var topicId = this.options.topicId;
            this.topic.fetch({
                data: { id: topicId }
            });
            this.products.fetch({
                data: { id: topicId, start: 0, size: mediaSize }
            });
            this.comments.fetch({
                data: { tid: topicId, size: 10, max_id: null }
            });
        }
    }))({el: $('#view-topic')});

})();
