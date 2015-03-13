define('m/app', function(require, exports) {

    var Box = require('m/box'),
        $ = require('jquery');

    $('.btn').on('click', function() {
        var $box = new Box('box');
        $box.show();
    });
});