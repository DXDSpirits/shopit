(function() {

    var encodeQueryString = function(data) {
        return _.map(data, function(val, key) {
            return key + '=' + val;
        }).join('&');
    };

    var order = new (Amour.Model.extend({
        submitOrder: function() {
            var amount = (product.get('offPrice') || product.get('price')) * this.get('count') * 100 + 10 * 100;
            this.set({
                subject: product.get('name'),
                body: product.get('name'),
                item_id: product.get('id'),
                amount: amount
            }, {
                silent: true
            });
            var url = Amour.APIRootSecure + 'beacon/pay/submitOrderByWx.do';
            App.securePost(url, this.toJSON(), function(data) {
                console.log(data);
            });
        }
    }))({
        openId: App.WX_OPENID,
        client_ip: '0.0.0.0',
        channel: 'wx_pub',
        count: 1
    });

    var product = new (Amour.Model.extend({
        url: Amour.APIRoot + 'beacon/data/getItemBycityName.do'
    }))();

    var addresses = new (Amour.Collection.extend({
        url: Amour.APIRootSecure + 'beacon/um/listAddressByWx.do?openId=' + App.WX_OPENID
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

    var AddressModelView = Amour.ModelView.extend({
        events: {
            'click': 'editAddress',
            'click .check-wrapper': 'chooseAddress'
        },
        className: 'address-item',
        template: App.getTemplate('address-item'),
        chooseAddress: function(e) {
            e.stopPropagation && e.stopPropagation();
            this.$el.addClass('selected').siblings().removeClass('selected');
            order.set('address_id', this.model.get('id'));
        },
        editAddress: function() {
            newAddressView.readyToEditAddress(this.model);
        }
    });

    var addressView = new (OrderInputView.extend({
        events: {
            'unexpand': 'hideNewAddr',
            'click .address-add': 'showNewAddr',
            'click .btn-confirm': 'confirmAddress'
        },
        initModelView: function() {
            this.addressesView = new (Amour.CollectionView.extend({
                ModelView: AddressModelView
            }))({
                collection: addresses,
                el: this.$('.address-list')
            });
        },
        showNewAddr: function() {
            this.$('.menu-new-addr').removeClass('invisible');
        },
        hideNewAddr: function() {
            this.$('.menu-new-addr').addClass('invisible');
        },
        confirmAddress: function() {
            this.$el.trigger('unexpand');
        },
        render: function() {
            var address = addresses.get(order.get('address_id'));
            if (address) {
                this.$('.input-content').text(address.get('area') + address.get('address'));
            }
        }
    }))({
        el: $('#order-input-address')
    });

    var newAddressView = new (Amour.View.extend({
        events: {
            'click .btn-delete': 'deleteAddress',
            'click .btn-save': 'saveAddress'
        },
        initView: function() {
            this.initCityList();
        },
        initCityList: function() {
            var fillProvinces = function(provinces) {
                var $provinces = _.map(provinces, function(item) {
                    return $('<option></option>').text(item.name).attr('val', item.name).data('cities', item.cities);
                });
                this.$('select[name="province"]').html($provinces).prepend('<option>省</option>');
            }
            var fillCities = function(cities) {
                var $cities = _.map(cities, function(item) {
                    return $('<option></option>').text(item.name).attr('val', item.name).data('areas', item.areas);
                });
                this.$('select[name="city"]').html($cities); //.prepend('<option>市</option>');
            }
            var fillAreas = function(areas) {
                var $areas = _.map(areas, function(item) {
                    return $('<option></option>').text(item.name).attr('val', item.name);
                });
                this.$('select[name="area"]').html($areas); //.prepend('<option>区</option>');
            }
            this.$('select[name="province"]').on('change', function() {
                var cities = $(this).find('option:selected').data('cities') || [];
                fillCities(cities);
                $(this).siblings('select[name="city"]').trigger('change');
            });
            this.$('select[name="city"]').on('change', function() {
                var areas = $(this).find('option:selected').data('areas') || [];
                fillAreas(areas);
            });
            fillProvinces(App.CityData.provinces);
        },
        readyToEditAddress: function(address) {
            this.editing = address;
            this.$('input[name="receiver"]').val(address.get('receiver'));
            this.$('input[name="phone"]').val(address.get('phone'));
            this.$('input[name="address"]').val(address.get('address'));
            this.$('select[name="province"]').val(address.get('province')).trigger('change');
            this.$('select[name="city"]').val(address.get('city')).trigger('change');
            this.$('select[name="area"]').val(address.get('area'));
            addressView.showNewAddr();
        },
        getAddressData: function() {
            var newAddr = {};
            newAddr.receiver = this.$('input[name="receiver"]').val()  || '收件人';
            newAddr.phone    = this.$('input[name="phone"]').val()     || '手机';
            newAddr.address  = this.$('input[name="address"]').val()   || '地址';
            newAddr.province = this.$('select[name="province"]').val() || '省';
            newAddr.city     = this.$('select[name="city"]').val()     || '市';
            newAddr.area     = this.$('select[name="area"]').val()     || '区';
            return newAddr;
        },
        saveAddress: function() {
            var addressData = this.getAddressData();
            addressData.openId = App.WX_OPENID;
            if (this.editing) {
                addressData.id = this.editing.get('id');
                this.editing.set(addressData);
                this.editing = null;
                var addressModel = new Amour.Model();
                var queryString = encodeQueryString(addressData);
                addressModel.save({}, {
                    url: Amour.APIRootSecure + 'beacon/um/updateAddressByWx.do?' + queryString,
                });
            } else {
                var addressModel = new Amour.Model(addressData);
                var queryString = encodeQueryString(addressData);
                addressModel.save({}, {
                    url: Amour.APIRootSecure + 'beacon/um/addAddressByWx.do?' + queryString,
                    success: function() {
                        addresses.fetch({ reset: true })
                    }
                });
            }
            addressView.hideNewAddr();
        },
        deleteAddress: function() {
            if (this.editing) {
                var id = this.editing.get('id');
                this.editing = null;
                var addressModel = new Amour.Model();
                addressModel.save({}, {
                    url: Amour.APIRootSecure + 'beacon/um/deleteAddressByWx.do?id=' + id,
                    success: function() {
                        addresses.fetch({ reset: true })
                    }
                });
            }
            addressView.hideNewAddr();
        },
    }))({
        el: $('#order-input-address .menu-new-addr')
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
            order.set('remarks', this.$('textarea').val() || '无');
        },
        render: function() {
            this.$('.input-content').text(order.get('remarks'));
        }
    }))({
        el: $('#order-input-remark')
    });

    App.Pages.NewOrder = new (App.PageView.extend({
        events: {
            'click .input-item.menu > .input-content, .input-item.menu > .fa': 'toggleInput',
            'click .btn-payable': 'payable'
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
        payable: function() {
            order.submitOrder();
        },
        render: function() {
            var productId = this.options.productId;
            product.fetch({
                dataType: 'jsonp',
                data: { id: productId },
                success: function() {
                    sizeView.filterSizes();
                }
            });
            addresses.fetch({
                // dataType: 'jsonp'
            });
        }
    }))({el: $('#view-new-order')});

})();
