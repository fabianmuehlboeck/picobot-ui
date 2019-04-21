var ALevel = /** @class */ (function () {
    function ALevel() {
    }
    ALevel.prototype.toBackground = function () {
        this.getRobot().toBackground();
    };
    ALevel.prototype.toForeground = function (mapcanvas, controlDiv, guiDiv) {
        this.mapcanvas = mapcanvas;
        this.controlDiv = controlDiv;
        this.guiDiv = guiDiv;
        this.getRobot().toForeground(guiDiv, controlDiv, this.mapcanvas);
        return false;
    };
    return ALevel;
}());
//# sourceMappingURL=Level.js.map