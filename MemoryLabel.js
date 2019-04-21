var MemoryLabel = /** @class */ (function () {
    function MemoryLabel(name) {
        this.nameChangeHandlers = [];
        this.name = name;
    }
    MemoryLabel.prototype.getName = function () { return this.name; };
    MemoryLabel.prototype.setName = function (name) {
        this.name = name;
        this.nameChangeHandlers.forEach(function (handler) { handler(name); });
    };
    MemoryLabel.prototype.addNameChangeHandler = function (handler) {
        this.nameChangeHandlers.push(handler);
    };
    MemoryLabel.prototype.removeNameChangeHandler = function (handler) {
        var index = this.nameChangeHandlers.indexOf(handler);
        if (index >= 0) {
            this.nameChangeHandlers.splice(index, 1);
        }
    };
    return MemoryLabel;
}());
//# sourceMappingURL=MemoryLabel.js.map