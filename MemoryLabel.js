var MemoryLabel = /** @class */ (function () {
    function MemoryLabel(id, name) {
        this.nameChangeHandlers = [];
        this.id = id;
        this.name = name;
        this.statusli = document.createElement("li");
        this.statusli.innerText = name;
        this.statusli.classList.add("robotmemory");
    }
    MemoryLabel.prototype.getName = function () { return this.name; };
    MemoryLabel.prototype.getId = function () { return this.id; };
    MemoryLabel.prototype.getElement = function () { return this.statusli; };
    MemoryLabel.prototype.setName = function (name) {
        this.name = name;
        this.nameChangeHandlers.forEach(function (handler) { handler(name); });
        this.statusli.innerText = name;
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