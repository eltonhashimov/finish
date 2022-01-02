jQuery(document).ready(function($) {

    if( pixsettingsVars.is_sticky_sidebar && $(window).width() >= 1360){
        $('.pix-sidebar-sticky').stickySidebar({
            containerSelector: '.pix-sidebar-container',
            innerWrapperSelector: '.pix-sidebar-inner',
            topSpacing: 60,
            bottomSpacing: 30
        });
    }

    // init vanillaSelectBox
    function pixVanillaSelectBox() {
        var pixMultiSelectBox = $('select.pix-multi-select'),
            pixMultiSelect = [];

        pixMultiSelectBox.each(function () {
            var id = $(this).attr('id'),
                placeholder = $(this).data('placeholder');

            pixMultiSelect[id] = new vanillaSelectBox('#' + id, {
                placeHolder: placeholder,
                search: false
            });
        });
    }
    pixVanillaSelectBox();

    function getSelectValues(id) {
        let result = [];
        let collection = document.querySelectorAll("#" + id + " option");
        collection.forEach(function (x) {
            if (x.selected) {
                result.push(x.value);
            }
        });
        return result;
    }

    function getSelectTotal(id) {
        var total = 0,
            select = document.getElementById(id),
            collection = document.querySelectorAll("#" + id + " option");
        
        collection.forEach(function (x) {
            if (x.selected) {
                if(total === 0){
                    total = parseFloat(x.dataset.price);
                } else {
                    total = select.dataset.operation === 'multi' ? total * parseFloat(x.dataset.price) : total + parseFloat(x.dataset.price);
                }
            }
        });
        return total;
    }
    
    $('.pix-calculator [data-dependency]').each(function () {
        var $name = $(this).attr('data-dependency'),
            $value = $(this).attr('data-dependency-val');
        if ($('[name="' + $name + '"]').val() !== $value && !$('[name="' + $name + '"]').hasClass('hide')) {
            $(this).addClass('hide');
            $(this).closest('.pix-calculator-field').addClass('hide');
        }
    });
    
    function set_dependency_fields(el) {
        $('[data-dependency='+el.attr('name')+']').each(function () {
            if ( $(this).attr('data-dependency-val') !== el.find(':selected').attr('value')  ) {
                $(this).addClass('hide');
                $(this).closest('.pix-calculator-field').addClass('hide');
            } else {
                $(this).removeClass('hide');
                $(this).closest('.pix-calculator-field').removeClass('hide');
            }
        });
    }

    function pix_calc_get_total($parent){
        var $total = 0,
            $out = '',
            $decimals = $('.pix-calc-total-price', $parent).attr('data-decimals');
        $('.pix-calc-value:not(.hide)', $parent).each(function() {
            var operation = $(this).data('operation');
            if($(this).is('.pix-multi-select')){
                var str = (getSelectValues($(this).attr('id'))).join(','),
                    sum = getSelectTotal($(this).attr('id'));
                if($total === 0){
                    $total = parseFloat(sum);
                } else {
                    $total = operation === 'multi' ? $total * parseFloat(sum) : $total + parseFloat(sum);
                }
                $out = $out + $(this).attr('data-title') + ': ' + str + ' - ' + sum + "\n";
            } else if($(this).is('select') && $(this).find(':selected').attr('value') !== ''){
                if($total === 0){
                    $total = parseFloat($(this).find(':selected').attr('data-price'));
                } else {
                    $total = operation === 'multi' ? $total * parseFloat($(this).find(':selected').attr('data-price')) : $total + parseFloat($(this).find(':selected').attr('data-price'));
                }
                $out = $out + $(this).attr('data-title') + ': ' + $(this).val() + ' - ' + $(this).find(':selected').attr('data-price') + "\n";
            } else if($(this).is('input[type="number"]') ){
                var value = $(this).val();
                if( $(this).attr('data-formula') !== '' ){
                    var formula = $(this).attr('data-formula');
                    value = eval(formula.replace('$val', value));
                }
                if($total === 0){
                    $total = parseFloat(value);
                } else {
                    $total = operation === 'multi' ? $total * parseFloat(value) : $total + parseFloat(value);
                }
                $out = $out + $(this).attr('data-title') + ': ' + $(this).val() + ' - ' + value + "\n";
            } else {
                if($(this).prop('checked')){
                    if($total === 0){
                        $total = parseFloat($(this).attr('data-price'));
                    } else {
                        $total = operation === 'multi' ? $total * parseFloat($(this).attr('data-price')) : $total + parseFloat($(this).attr('data-price'));
                    }
                    $out = $out + $(this).attr('data-title') + ': ' + $(this).val() + ' - ' + $(this).attr('data-price') + "\n";
                }
            }
        });
        
        if($decimals > 0){
            $total = $total.toFixed($decimals);
        }
        $('.pix-calc-total-price span', $parent).html($total);

        if($('.pix-form-container', $parent).length){
            $out = $out + $total;
            $('.pix-form-container .pix-calculator-data', $parent).html($out);
        }
    }

    $('.pix-calc-value').on('change', function () {
        pix_calc_get_total($(this).closest('.pix-calculator'));
    });

    $('.pix-calc-total-btn a').on('click', function () {
        if ( $( '.pix-form-container' ).first().is( ":hidden" ) ) {
            $( '.pix-form-container' ).slideDown( 700 );
        } else {
            $( '.pix-form-container' ).slideUp( 700 );
        }
    });

    $('.pix-reset a').on('click', function () {
        var $parent = $(this).closest('.pix-calculator-fields'),
            $fields = $(this).closest('.pix-calculator-field');

        $('.pix-calc-value', $fields).each(function() {
            if($(this).is('select')){
                $(this).prop('selectedIndex', 0);
            } else {
                $(this).prop('checked', false);
            }
        });

        pix_calc_get_total($parent);
    });

});