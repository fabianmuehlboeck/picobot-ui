var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
    Color[Color["Yellow"] = 3] = "Yellow";
    Color[Color["Purple"] = 4] = "Purple";
    Color[Color["Pink"] = 5] = "Pink";
    Color[Color["Brown"] = 6] = "Brown";
    Color[Color["Orange"] = 7] = "Orange";
})(Color || (Color = {}));
;
var IMemoryLabel = /** @class */ (function () {
    function IMemoryLabel(name, color) {
        this.name = name;
        this.color = color;
    }
    IMemoryLabel.prototype.getName = function () { return this.name; };
    IMemoryLabel.prototype.getColor = function () { return this.color; };
    IMemoryLabel.prototype.setName = function (name) { this.name = name; };
    IMemoryLabel.prototype.setColor = function (color) { this.color = color; };
    return IMemoryLabel;
}());
//# sourceMappingURL=MemoryLabel.js.map