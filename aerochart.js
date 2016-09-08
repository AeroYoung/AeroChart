(function($) {

    'use strict';

    // PROGRESSBAR CLASS DEFINITION

    var Progressbar = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Progressbar.defaults, options);
    };

    Progressbar.defaults = {
        transition_delay: 300,
        refresh_speed: 50,
        display_text: 'fill',
        max_value:100,
        min_value:0,
        current_value:80,
        text_format:'$now/$max',
            /*进度条显示文本 通配符替换规则
            * $now: 当前值
            * $max,$min:最大最小值
            * $per:当前百分比
            * $rem:剩余值
            * */
        percent_format: function(percent) { return percent + '%'; },
        amount_format: function(amount_part, amount_max, amount_min) { return amount_part + ' / ' + amount_max; },
        update: $.noop,
        done: $.noop,
        fail: $.noop
    };

    Progressbar.prototype.transition = function() {
        var $this = this.$element;
        var $parent = $this.parent();
        var $back_text = this.$back_text;
        var $front_text = this.$front_text;
        var options = this.options;
        var aria_valuemin = parseInt($this.attr('aria-valuemin')) || 0;
        var aria_valuemax = parseInt($this.attr('aria-valuemax')) || 100;
        var update = options.update && typeof options.update === 'function' ? options.update : Progressbar.defaults.update;
        var done = options.done && typeof options.done === 'function' ? options.done : Progressbar.defaults.done;
        var fail = options.fail && typeof options.fail === 'function' ? options.fail : Progressbar.defaults.fail;
        var height = $this.height;
        var fontSize = $this.css("font-size");

        $this.css('min-width','20px');

        //百分比 100 * (data_transitiongoal - aria_valuemin) / (aria_valuemax - aria_valuemin)
        var percentage = Math.round(100 * (options.current_value - options.min_value) / (options.max_value - options.min_value));

        if (options.display_text === 'center' && !$back_text && !$front_text) {
            this.$back_text = $back_text = $('<span>').addClass('progressbar-back-text').prependTo($parent);
            this.$front_text = $front_text = $('<span>').addClass('progressbar-front-text').prependTo($this);

            $back_text.css("vertical-align","center");
            $front_text.css("vertical-align","center");
            $back_text.css("text-align","center");
            $front_text.css("text-align","center");
            $back_text.css("font-size",fontSize);
            $front_text.css("font-size",fontSize);

            var parent_size;

            parent_size = $parent.css('width');
            $front_text.css({width: parent_size});

            $(window).resize(function() {
                parent_size = $parent.css('width');
                $front_text.css({width: parent_size});
            }); // normal resizing would brick the structure because width is in px
        }

        setTimeout(function() {
            var current_percentage;
            var current_value;
            var this_size;
            var parent_size;
            var text;

            $this.css('width', percentage + '%');

            var progress = setInterval(function() {
                this_size = $this.width();
                parent_size = $parent.width();

                current_percentage = Math.round(100 * this_size / parent_size);
                current_value = Math.round(options.min_value + this_size / parent_size * (options.max_value - options.min_value));

                if (current_percentage >= percentage) {
                    current_percentage = percentage;
                    current_value = options.current_value;
                    done($this);
                    clearInterval(progress);
                }

                if (options.display_text !== 'none') {
                    text = options.text_format;
                    //importent 修改content
                    text = text.replace("$now",current_value);
                    text = text.replace("$max",options.max_value);
                    text = text.replace("$min",options.min_value);
                    text = text.replace("$per",current_percentage);
                    text = text.replace("$rem",options.max_value-current_value);

                    if (options.display_text === 'fill') {
                        $this.text(text);
                    }
                    else if (options.display_text === 'center') {
                        if(current_percentage<50){
                            $back_text.text(text);
                            $front_text.text("");
                        }else{
                            $front_text.text(text);
                            $back_text.text("");
                        }
                    }
                }
                $this.attr('aria-valuenow', current_value);

                update(current_percentage, $this);
            }, options.refresh_speed);
        }, options.transition_delay);
    };


    // PROGRESSBAR PLUGIN DEFINITION

    var old = $.fn.progressbar;

    $.fn.progressbar = function(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('bs.progressbar');
            var options = typeof option === 'object' && option;

            if (data && options) {
                $.extend(data.options, options);
            }

            if (!data) {
                $this.data('bs.progressbar', (data = new Progressbar(this, options)));
            }
            data.transition();
        });
    };

    $.fn.progressbar.Constructor = Progressbar;


    // PROGRESSBAR NO CONFLICT

    $.fn.progressbar.noConflict = function () {
        $.fn.progressbar = old;
        return this;
    };

})(window.jQuery);
