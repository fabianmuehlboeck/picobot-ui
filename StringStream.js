var StringStream = /** @class */ (function () {
    function StringStream(str) {
        this.index = 0;
        this.str = str;
    }
    StringStream.prototype.atEnd = function () {
        return this.index >= this.str.length;
    };
    StringStream.prototype.move = function (len) {
        this.index += len;
    };
    StringStream.prototype.peekFront = function (len) {
        return this.str.substr(this.index, len);
    };
    StringStream.prototype.peekUntil = function (separator) {
        var nextpos = this.str.indexOf(separator, this.index);
        return this.str.substring(this.index, nextpos);
    };
    StringStream.prototype.readUntil = function (separator) {
        var nextpos = this.str.indexOf(separator, this.index);
        var curindex = this.index;
        this.index = nextpos + separator.length;
        return this.str.substring(curindex, nextpos);
    };
    return StringStream;
}());
//# sourceMappingURL=StringStream.js.map