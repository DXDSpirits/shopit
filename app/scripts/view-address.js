(function() {

    var AddressCollection = Amour.Collection.extend({});

    var AddressListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            className: 'address-item',
            template: App.getTemplate('address-item'),
            serializeData: function() {
                var data = Amour.ModelView.prototype.serializeData.call(this);
                data.distance = 120;
                return data;
            }
        })
    });

    App.Pages.Address = new (App.PageView.extend({
        initPage: function() {
            this.address = new AddressCollection();
            this.views = {
                address: new AddressListView({
                    collection: this.address,
                    el: this.$('.address-list')
                })
            };
        },
        render: function() {
            var brandId = this.options.brandId;
            var url = Amour.APIRoot + 'beacon/data/listBrandStores.do';
            this.address.fetch({
                dataType: 'jsonp',
                url: url,
                data: { id: brandId }
            });
        }
    }))({el: $('#view-address')});

})();
