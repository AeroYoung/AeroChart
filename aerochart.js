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
        text_format:'$now/$max',
            /*进度条显示文本 通配符替换规则
            * $now: 当前值
            * $max,$min:最大最小值
            * $per:当前百分比
            * $rem:剩余值
            * */
        percent_format: function(percent) { return percent + '%'; },
        amount_format: function(amount_part, amount_max, amount_min) { return amount_part + ' / ' + amount_max; },
        auto_theme:true,
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
        var data_transitiongoal = parseFloat($this.attr('data_c')) || 100 ;
        var aria_valuemin = parseFloat($this.attr('aria-valuemin')) || 0;
        var aria_valuemax = parseFloat($this.attr('aria-valuemax')) || 100;
        var update = options.update && typeof options.update === 'function' ? options.update : Progressbar.defaults.update;
        var done = options.done && typeof options.done === 'function' ? options.done : Progressbar.defaults.done;
        var fail = options.fail && typeof options.fail === 'function' ? options.fail : Progressbar.defaults.fail;
        var fontSize = $this.css("font-size");

        $this.css('min-width','25px');

        var percentage = Math.round(100 * (data_transitiongoal - aria_valuemin) / (aria_valuemax - aria_valuemin));

        if (options.display_text === 'center' && !$back_text && !$front_text) {
            this.$back_text = $back_text = $('<span>').addClass('progressbar-back-text').prependTo($parent);
            this.$front_text = $front_text = $('<span>').addClass('progressbar-front-text').prependTo($this);

            var parent_size;

            parent_size = $parent.css('width');
            $front_text.css({width: parent_size});

            $(window).resize(function() {
                parent_size = $parent.css('width');
                $front_text.css({width: parent_size});
            }); // normal resizing would brick the structure because width is in px
        }

        if(options.auto_theme === true){
            if(percentage==100) $this.addClass("progress-bar-success");
            else if(percentage<100 && percentage >= 70) $this.addClass("progress-bar-info");
            else if(percentage<70 && percentage >= 35) $this.addClass("progress-bar-warning");
            else $this.addClass("progress-bar-danger");
        }

        setTimeout(function() {
            var current_percentage;
            var current_value;
            var this_size;
            var parent_size;
            var text;

            $this.css('width', percentage + '%');

            var progress = setInterval(function() {
                /*this_size = $this.width();
                parent_size = $parent.width();

                current_percentage = Math.round(100 * this_size / parent_size);
                current_value = Math.round(aria_valuemin + this_size / parent_size * (aria_valuemax - aria_valuemin));*/

                current_value = parseFloat($this.attr('aria-valuenow')) || 0;
                current_percentage = current_value / (aria_valuemax-aria_valuemin);

                if (current_percentage >= percentage) {
                    current_percentage = percentage;
                    current_value = data_transitiongoal;
                    done($this);
                    clearInterval(progress);
                }

                text = options.text_format;
                text = text.replace("$now",data_transitiongoal);
                text = text.replace("$max",aria_valuemax);
                text = text.replace("$min",aria_valuemin);
                text = text.replace("$per",percentage);
                text = text.replace("$rem",aria_valuemax-current_value);

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
                else if(options.display_text==='left'){
                    $this.text(text);
                    $this.css('text-align','left');
                    $this.css('padding-left','10px');
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
            var options = typeof option === 'object' && option;
            var data_transitiongoal = parseFloat($this.attr('data_c')) || 100 ;
            var aria_valuemin = parseFloat($this.attr('aria-valuemin')) || 0;
            var aria_valuemax = parseFloat($this.attr('aria-valuemax')) || 100;
            var content = $this.text();
            var height = $this.height();
            $this.text('');

            //添加子元素
            var $row = $("<div class='row'></div>").appendTo($this);
            var $colbar = $("<div class='col-md-9'></div>").appendTo($row);
            var $collbl = $("<div class='col-md-3'>"+content+"</div>").appendTo($row);
            var $progress = $("<div class='progress'></div>").appendTo($colbar);
            $progress.css('height',height);
            $progress.css('font-size','inherit');
            var $progress_bar = $("<div class='progress-bar' role='progressbar'></div>").appendTo($progress);
            $progress_bar.attr('data_c',data_transitiongoal);
            $progress_bar.attr('aria_valuemin',aria_valuemin);
            $progress_bar.attr('aria_valuemax',aria_valuemax);
            $progress_bar.css('font-size','inherit');

            var data = $progress_bar.data('bs.progressbar');
            if (!data) $this.data('bs.progressbar', (data = new Progressbar($progress_bar, options)));
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
