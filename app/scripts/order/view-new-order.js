(function() {

    var order = new (Amour.Model.extend({
        //
    }))({
        openId: App.WX_OPENID,
        channel: 'wx_pub',
        count: 1
    });

    var product = new (Amour.Model.extend({
        url: Amour.APIRoot + 'beacon/data/getItemBycityName.do'
    }))();

    var addresses = new (Amour.Collection.extend({
        url: Amour.APIRootSecure + 'beacon/um/listAddressByWx.do',
        addAddress: function(addressData) {
            addressData.openId = App.WX_OPENID;
            var address = new Amour.Model(addressData);
            var queryString = _.map(addressData, function(val, key) {
                return key + '=' + val;
            }).join('&');
            var self = this;
            address.save({}, {
                url: Amour.APIRootSecure + 'beacon/um/addAddressByWx.do?' + queryString,
                success: function() {
                    self.add(address);
                }
            });
        }
    }))();

    var OrderInputView = Amour.ModelView.extend({ model: order });

    var sizeView = new (OrderInputView.extend({
        events: {
            'click .circle': 'chooseSize'
        },
        initModelView: function() {
            var $circles = _.map(['XS', 'S', 'M', 'X', 'XL'], function(size) {
                return $('<span class="circle"></span>').attr('data-size', size).text(size);
            });
            this.$('.circles').html($circles);
        },
        filterSizes: function() {
            var sizes = (product.get('size') || '').split(',');
            this.$('.circle').each(function() {
                $(this).toggleClass('available', _.contains(sizes, $(this).attr('data-size')));
            })
        },
        chooseSize: function(e) {
            var $circle = $(e.currentTarget);
            if ($circle.hasClass('available')) {
                var size = $circle.attr('data-size');
                $circle.addClass('selected').siblings().removeClass('selected');
                order.set('size', size);
                this.$el.trigger('unexpand');
            }
        },
        render: function() {
            this.$('.input-content').text(order.get('size'));
        }
    }))({
        el: $('#order-input-size')
    });

    var qualityView = new (OrderInputView.extend({
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
            this.$('.input-content .quality').text(order.get('count'));
        }
    }))({
        el: $('#order-input-quality')
    });

    var addressView = new (OrderInputView.extend({
        events: {
            'click .address-add': 'showNewAddr',
            'click .menu-new-addr .btn-confirm': 'addAddress',
            'click .menu-new-addr .btn-cancel': 'closeNewAddr'
        },
        initModelView: function() {
            this.addressesView = new (Amour.CollectionView.extend({
                ModelView: Amour.ModelView.extend({
                    events: { 'click': 'chooseAddress' },
                    className: 'address-item',
                    template: '<div>{{receiver}} {{phone}}</div>' +
                              '<div>{{province}} {{city}} {{area}}</div>' +
                              '<div>{{address}}</div>' +
                              '<span class="check fa fa-check"></span>',
                    chooseAddress: function() {
                        this.addClass('selected').siblings().removeClass('selected');
                        order.set({
                            'receiver': this.model.get('receiver'),
                            'phone': this.model.get('phone'),
                            'address': this.model.get('address')
                        });
                    }
                })
            }))({
                collection: addresses
            });
        },
        addAddress: function() {
            var newAddr = {};
            newAddr.receiver = this.$('input[name="receiver"]').val();
            newAddr.phone = this.$('input[name="phone"]').val();
            newAddr.province = this.$('input[name="province"]').val();
            newAddr.city = this.$('input[name="city"]').val();
            newAddr.area = this.$('input[name="area"]').val();
            newAddr.address = this.$('input[name="address"]').val();
            addresses.addAddress(newAddr);
        },
        showNewAddr: function() {
            this.$('.menu-new-addr').removeClass('invisible');
        },
        hideNewAddr: function() {
            this.$('.menu-new-addr').addClass('invisible');
        },
        render: function() {}
    }))({
        el: $('#order-input-address')
    });

    var paymentView = new (OrderInputView.extend({
        events: {
            'click .channel': 'choosePayment'
        },
        initModelView: function() {
            this.channels = [{
                name: 'wx_pub', title: '微信钱包'
            }, {
                name: 'alipay_wap', title: '支付宝'
            }];
        },
        choosePayment: function(e) {
            var $channel = $(e.currentTarget);
            var channel = $channel.attr('data-channel');
            $channel.addClass('selected').siblings().removeClass('selected');
            order.set('channel', channel);
            this.$el.trigger('unexpand');
        },
        render: function() {
            var channel = order.get('channel');
            this.$('.input-content').text(_.findWhere(this.channels, {name: channel}).title);
        }
    }))({
        el: $('#order-input-payment')
    });

    var remarkView = new (OrderInputView.extend({
        events: {
            'unexpand': 'saveRemark'
        },
        initModelView: function() {},
        saveRemark: function() {
            order.set('remark', this.$('textarea').val() || '');
        },
        render: function() {
            this.$('.input-content').text(order.get('remark'));
        }
    }))({
        el: $('#order-input-remark')
    });

    App.Pages.NewOrder = new (App.PageView.extend({
        events: {
            'click .input-item.menu > .input-content, .input-item.menu > .fa': 'toggleInput'
        },
        initPage: function() {
            this.$('.input-item').on('expand', function() {
                $(this).addClass('expand').siblings().addClass('hidden');
            }).on('unexpand', function() {
                $(this).removeClass('expand').siblings().removeClass('hidden');
            });
        },
        toggleInput: function(e) {
            var $input = $(e.currentTarget).closest('.input-item');
            if ($input.hasClass('expand')) {
                $input.trigger('unexpand');
            } else {
                $input.trigger('expand');
            }
        },
        render: function() {
            var productId = this.options.productId;
            product.fetch({
                // dataType: 'jsonp',
                data: { id: productId },
                success: function() {
                    sizeView.filterSizes();
                }
            });
            addresses.fetch({
                // dataType: 'jsonp',
                data: { openId: App.WX_OPENID }
            });
        }
    }))({el: $('#view-new-order')});

})();
