define('u/tool', function(require, exports) {

    // 获取时间戳
    exports.getTime = function() {
        return new Date().getTime();
    };

    // 获取对象类型
    exports.getType = function(data) {
        return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
    };

    // 填充模板
    exports.parseTemplate = function(html, data) {

    };

    // 修改模板
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/\{(\d+)\}/g, function() {
            var index = arguments[1];
            return args[index]
        });
    };
});