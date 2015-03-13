define('m/box', function(require, exports, module) {

    var tool = require('u/tool'),
        $ = require('jquery');

    function Box(content, style) {
        this.content = content || '';
        this.style_class = style || Box.css_class_name;
        this.index = Box.index ++;
    }

    module.exports = Box;

    Box.index = 0;
    Box.css_class_name = 'box';
    Box.template = require('t/dialog.html');
    Box.parent = $('body');

    Box.prototype.show = function() {
        var $obj = $(Box.template.format(this.content));
        var class_name = Box.css_class_name + '-' + this.index;
        $obj.addClass(class_name);

        this.class = class_name;
        Box.parent.append($obj);
        this.me = $('.' + class_name);
        this.me.addClass(Box.css_class_name);
        this.me.css(this.style_class);
        return this;
    };

});