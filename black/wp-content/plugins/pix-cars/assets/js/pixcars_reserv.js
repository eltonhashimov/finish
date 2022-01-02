jQuery(function ($) {

    'use strict';
    
    if(pixcars_reserv_Ajax.datepicker) {
        moment.locale(pixcars_reserv_Ajax.locale);
        var pickup = moment(),
            dropoff = moment();
    }
    
    // var locale = pixcars_reserv_Ajax.locale.split('-');
    // $('.daterange').dateRangePicker({
    //     language:locale[0],
    //     startOfWeek: pixcars_reserv_Ajax.start_of_week,
    //     separator : ' - ',
    //     format: pixcars_reserv_Ajax.format,
    //     autoClose: false,
    //     stickyMonths: true,
    //     startDate: moment('12', 'HH'),
    //     defaultTime: moment({hour: 12, minute: 0}),
    //     defaultEndTime: moment({hour: 12, minute: 0}),
    // })

    $('a.pix-button[data-target="#pix-car-modal"]').on('click', function (e) {
        e.preventDefault();
        
        $('#pix-car-modal form.pix-reservation input[name="pixcars_reservation_car"]').val($(this).data('car'));
        $('#pix-car-modal form.pix-reservation input[name="pixcars_reservation_car_id"]').val($(this).data('car-id'));
        $('#pix-car-modal form.pix-reservation input[name="pixcars_reservation_car_img"]').val($(this).data('img'));
        $('#pix-car-modal form.pix-reservation input[name="pixcars_reservation_car_price"]').val($(this).data('price'));
        $('#pix-car-modal form.pix-reservation input[name="pixcars_reservation_type"]').val($(this).data('type'));
        
        if($(this).data('type') == 'widget' && $(this).data('is-rental') === 'on') {
            $('.daterange').removeClass('hide');
            $('.daterange').prop('required', true);
            $('.daterange').parent().removeClass('mb-0');
        } else if($(this).data('type') == 'widget' && $(this).data('is-rental') == 'off'){
            if( !$('.daterange').hasClass('hide') ){
                $('.daterange').addClass('hide');
            }
            if(!$('.daterange').parent().hasClass('mb-0')) {
                $('.daterange').parent().addClass('mb-0');
            }
            $('.daterange').prop('required', false);
            
        }
        
        var reservedObj = $(this).data('reserved');
        //console.log(reservedObj);
        if($('.pix-car-cf7 .wpcf7-reserv_car').length) {
            $('.pix-car-cf7 .wpcf7-reserv_car').val($(this).data('car'));
        }
        if($('.pix-car-cf7 .wpcf7-reserv_car_price').length) {
            $('.pix-car-cf7 .wpcf7-reserv_car_price').val($(this).data('price'));
        }
        
        if(pixcars_reserv_Ajax.datepicker && $('.daterange').length) {
            
            var locale = pixcars_reserv_Ajax.locale.split('-');
            
            if(pixcars_reserv_Ajax.time) {
    
                var timeStr = '12',
                    start = moment(timeStr, 'HH'),
                    end = moment(timeStr, 'HH').add(1, 'd');
                // console.log(moment(timeStr, 'HH').diff(moment(), 'minutes'));
    
                if (moment(timeStr, 'HH').diff(moment(), 'minutes') < 0) {
                    start = moment(timeStr, 'HH').add(1, 'd');
                    end = moment(timeStr, 'HH').add(2, 'd');
                }
    
                $('.daterange').dateRangePicker({
                    language: locale[0],
                    startOfWeek: pixcars_reserv_Ajax.start_of_week,
                    separator: ' - ',
                    format: pixcars_reserv_Ajax.format,
                    autoClose: false,
                    stickyMonths: true,
                    time: {
                        enabled: true
                    },
                    startDate: start,
                    getValue: function () {
                        return (start + ' - ' + end);
                    },
                    defaultTime: moment({hour: 12, minute: 0}),
                    defaultEndTime: moment({hour: 12, minute: 0}),
                    beforeShowDay: function (t) {
                        var valid = true;
                        $.each(reservedObj, function (key, val) {
                            if (moment.utc(t).isSameOrAfter(moment.unix(val.from).utc()) && moment.utc(t).isSameOrBefore(moment.unix(val.to).endOf('day').utc())) {
                                valid = false;
                                return false;
                            }
                        });
                        var _class = '';
                        var _tooltip = valid ? '' : 'reserved';
                        return [valid, _class, _tooltip];
                    }
                })
                .on('datepicker-change', function (ev, picker) {
                    pickup = picker.date1;
                    dropoff = picker.date2;
                    // console.log(pickup);
                    // console.log(dropoff);
                    //cb(picker.date1, picker.date2);
                });
            } else {
                $('.daterange').dateRangePicker({
                    language: locale[0],
                    startOfWeek: pixcars_reserv_Ajax.start_of_week,
                    separator: ' - ',
                    format: pixcars_reserv_Ajax.format,
                    autoClose: false,
                    stickyMonths: true,
                    startDate: start,
                    getValue: function () {
                        return (start + ' - ' + end);
                    },
                    beforeShowDay: function (t) {
                        var valid = true;
                        $.each(reservedObj, function (key, val) {
                            if (moment.utc(t).isSameOrAfter(moment.unix(val.from).utc()) && moment.utc(t).isSameOrBefore(moment.unix(val.to).endOf('day').utc())) {
                                valid = false;
                                return false;
                            }
                        });
                        var _class = '';
                        var _tooltip = valid ? '' : 'reserved';
                        return [valid, _class, _tooltip];
                    }
                })
                .on('datepicker-change', function (ev, picker) {
                    pickup = picker.date1;
                    dropoff = picker.date2;
                    // console.log(pickup);
                    // console.log(dropoff);
                    //cb(picker.date1, picker.date2);
                });
            }
        }
        
        if($(this).data('slider') == 'on') {

            var data = {
                action: 'pixcars_reservation_modal',
                nonce_reserv: pixcars_reserv_Ajax.nonce_reserv,
                pix_car_id: $(this).data('car-id')
            };

            $.post(pixcars_reserv_Ajax.url, data, function (response) {

                $('#pix-car-modal .pix-single.pix-modal-slider').html(response.data);

                //-------car modal-------//
                var singleSlider = $('#pix-car-modal .pix-single-slider');
                var miniatureSlider = $('#pix-car-modal .pix-miniature-slider');
                var slidesPerPage = 5; //globaly define number of elements per page
                var syncedSecondary = false;

                //init single slider
                singleSlider.owlCarousel({
                    items: 1,
                    dots: false,
                    nav: true,
                    loop: false,
                    autoHeight: false,
                    onInitialized: function (event) {
                        $('.pix-slider-count-slides').text('1/' + event.item.count);
                    },
                    onChanged: function (event) {
                        var items = event.item.count,
                            item = event.item.index;
                        $('.pix-slider-count-slides').text((item + 1) + '/' + items);
                    }
                }).on('changed.owl.carousel', syncPosition);
                //------------------------------------------------

                //init miniature slider
                miniatureSlider.owlCarousel({
                    items: slidesPerPage,
                    dots: false,
                    nav: false,
                    loop: false,
                    slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
                    onInitialized: function (event) {
                        miniatureSlider.find(".owl-item").eq(0).addClass("current");
                    }
                }).on('changed.owl.carousel', syncPosition2);


                function syncPosition(el) {
                    //if you set loop to false, you have to restore this next line
                    var current = el.item.index;

                    miniatureSlider
                        .find(".owl-item")
                        .removeClass("current")
                        .eq(current)
                        .addClass("current");
                    var onscreen = miniatureSlider.find('.owl-item.active').length - 1;
                    var start = miniatureSlider.find('.owl-item.active').first().index();
                    var end = miniatureSlider.find('.owl-item.active').last().index();

                    if (current > end) {
                        miniatureSlider.data('owl.carousel').to(current, 100, true);
                    }
                    if (current < start) {
                        miniatureSlider.data('owl.carousel').to(current - onscreen, 100, true);
                    }
                }

                function syncPosition2(el) {
                    if (syncedSecondary) {
                        var number = el.item.index;
                        singleSlider.data('owl.carousel').to(number, 100, true);
                    }
                }

                miniatureSlider.on("click", ".owl-item", function (e) {
                    e.preventDefault();
                    var number = $(this).index();
                    singleSlider.data('owl.carousel').to(number, 300, true);
                });

            });

        } else {
            var $car_title = $(this).data('car');
            $('#pix-car-modal .pix-single.pix-modal-slider').html('<div class="pix-modal-title">'+$car_title+'</div>');
        }
        
        //console.log('reservedObj');
        $('#pix-car-modal').modal('toggle');

    });

    $('form.pix-reservation').on('submit', function (e) {
        e.preventDefault();

        var data = {
                action: 'pixcars_reservation',
                nonce_reserv: pixcars_reserv_Ajax.nonce_reserv
            },
            inputs = $(':input', this),
            car_id = 0,
            page_type = '',
            button = $('.pix-button', this);
        
        button.addClass('loading');

        inputs.each(function() {
            if(this.name != ''){
                data[this.name] = $(this).val();
                if(this.name == 'pixcars_reservation_car_id'){
                    car_id = $(this).val();
                }
                if(this.name == 'pixcars_reservation_type'){
                    page_type = $(this).val();
                }
            }
        });

        if(pixcars_reserv_Ajax.datepicker) {
            data['pixcars_reservation_from'] = moment(pickup).format('YYYY-MM-DD hh:mm:ss');
            data['pixcars_reservation_to'] = moment(dropoff).format('YYYY-MM-DD hh:mm:ss');
        }

        //console.log('Reserv data : ',data);

        $.post(pixcars_reserv_Ajax.url, data, function (response) {
            // console.log(response);
            var car_box = $('#carID-' + car_id),
                price = $('a.pix-reservation-btn span:first-child', car_box).html();
            if(page_type == 'single'){
                $('.pix-single .pix-slider-wrapper', car_box).before('<div class="pix-product-box-sticker pix-dark-sticker '+pixcars_reserv_Ajax.sticker_size+'">'+pixcars_reserv_Ajax.reserv_sticker+'</div>');
                $('.pix-sidebar-submit', car_box).html('<a class="pix-button pix-v-l pix-reservation-btn pix-disable-btn"><span>' + price + '</span><span>'+pixcars_reserv_Ajax.reserv_btn+'</span></a>');
            } else if(page_type == 'widget') {
                $('.pix-sale-box-img img', car_box).before('<div class="pix-sale-box-sticker pix-dark-sticker '+pixcars_reserv_Ajax.sticker_size+'">'+pixcars_reserv_Ajax.reserv_sticker+'</div>');
                $('.pix-sale-box-price', car_box).html('<a class="pix-button pix-v-s pix-h-s pix-reservation-btn pix-disable-btn"><span>' + price + '</span><span>'+pixcars_reserv_Ajax.reserv_btn+'</span></a>');
            } else {
                $('.pix-product-show-boxes', car_box).before('<div class="pix-product-box-sticker pix-dark-sticker '+pixcars_reserv_Ajax.sticker_size+'">'+pixcars_reserv_Ajax.reserv_sticker+'</div>');
                if(pixcars_reserv_Ajax.is_rent_single === 'off' ){
                    $('.pix-product-box-price', car_box).html('<a class="pix-button pix-v-xs pix-disable-btn"><span>'+pixcars_reserv_Ajax.reserv_btn+'</span></a>');
                } else {
                    $('.pix-product-box-price', car_box).html('<a class="pix-button pix-v-s pix-reservation-btn pix-disable-btn"><span>' + price + '</span><span>'+pixcars_reserv_Ajax.reserv_btn+'</span></a>');
                }
            }
            button.removeClass('loading');
            $('#pix-car-modal').modal('toggle');
            $('#pix-success-modal').modal('toggle');
        });

    });

    $('.pix-car-cf7 form').on('submit', function (e) {
        var wpcf7Elm = document.querySelector( '.wpcf7' );

        // wpcf7Elm.addEventListener( 'wpcf7invalid', function( event ) {
        //     console.log( "Опачки, wpcf7invalid..." );
        // }, false );
        // wpcf7Elm.addEventListener( 'wpcf7mailfailed', function( event ) {
        //     console.log( "Опачки, wpcf7mailfailed..." );
        // }, false );
        
        wpcf7Elm.addEventListener( 'wpcf7mailsent', function( event ) {
            $('#pix-car-modal').modal('toggle');
            $('#pix-success-modal').modal('toggle');
        }, false );
    });


});