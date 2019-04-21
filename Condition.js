var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ElementConditionFailure = /** @class */ (function () {
    function ElementConditionFailure(element) {
        this.element = element;
    }
    ElementConditionFailure.prototype.getAnimateables = function () { return [this.element]; };
    return ElementConditionFailure;
}());
var SensorCondition = /** @class */ (function () {
    function SensorCondition() {
        this.sensor = new RobotSensorSelector();
    }
    SensorCondition.prototype.check = function (world) {
        var x = world.getX();
        var y = world.getY();
        var dir = world.getDirection();
        var map = world.getMap();
        var ret = [];
        switch (this.sensor.frontSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
                    ret.push(new ElementConditionFailure(this.sensor.frontSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
                    ret.push(new ElementConditionFailure(this.sensor.frontSensor.button));
                }
                break;
        }
        var ldir = dirTurnLeft(dir);
        switch (this.sensor.leftSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(ldir), y + dirYadjust(ldir))) {
                    ret.push(new ElementConditionFailure(this.sensor.leftSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(ldir), y + dirYadjust(ldir))) {
                    ret.push(new ElementConditionFailure(this.sensor.leftSensor.button));
                }
                break;
        }
        var rdir = dirTurnRight(dir);
        switch (this.sensor.rightSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(rdir), y + dirYadjust(rdir))) {
                    ret.push(new ElementConditionFailure(this.sensor.rightSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(rdir), y + dirYadjust(rdir))) {
                    ret.push(new ElementConditionFailure(this.sensor.rightSensor.button));
                }
                break;
        }
        return ret;
    };
    SensorCondition.prototype.enter = function (failures) {
        if (failures.length > 0) {
            var elems = [];
            for (var _i = 0, failures_1 = failures; _i < failures_1.length; _i++) {
                var failure = failures_1[_i];
                elems = elems.concat(failure.getAnimateables());
            }
            $(elems).stop(true).animate({ backgroundColor: "#ff0000" }, 100);
        }
        else {
            $([this.sensor.frontSensor.button, this.sensor.leftSensor.button, this.sensor.rightSensor.button]).stop(true).animate({ backgroundColor: "#00ff00" }, 100);
        }
    };
    SensorCondition.prototype.exit = function (failures) {
        if (failures.length > 0) {
            var elems = [];
            for (var _i = 0, failures_2 = failures; _i < failures_2.length; _i++) {
                var failure = failures_2[_i];
                elems = elems.concat(failure.getAnimateables());
            }
            $(elems).stop(true).animate({ backgroundColor: "" }, 100);
        }
        else {
            $([this.sensor.frontSensor.button, this.sensor.leftSensor.button, this.sensor.rightSensor.button]).stop(true).animate({ backgroundColor: "" }, 100);
        }
    };
    SensorCondition.prototype.getElement = function () {
        return this.sensor.getElement();
    };
    return SensorCondition;
}());
var MemoryCondition = /** @class */ (function (_super) {
    __extends(MemoryCondition, _super);
    function MemoryCondition() {
        var _this = _super.call(this) || this;
        _this.element = document.createElement("div");
        _this.memorydiv = document.createElement("div");
        _this.memoryul = document.createElement("ul");
        _this.memorydiv.appendChild(_this.memoryul);
        _this.element.appendChild(_super.prototype.getElement.call(_this));
        _this.element.appendChild(_this.memorydiv);
        _this.memoryul.classList.add("memorycondlist");
        _this.memoryul.classList.add("memorydroppable");
        _this.memorydiv.classList.add("memoryconddiv");
        _this.element.classList.add("memoryconditiondiv");
        return _this;
    }
    MemoryCondition.prototype.check = function (world) {
        var ret = _super.prototype.check.call(this, world);
        var memories = [];
        for (var i = 0; i < this.memoryul.childNodes.length; i++) {
            var memory = ((this.memoryul.childNodes.item(i)).Action);
            memories.push(memory);
        }
        ret = ret.concat(world.remembers(memories, this.memoryul));
        return ret;
    };
    MemoryCondition.prototype.getElement = function () {
        return this.element;
    };
    return MemoryCondition;
}(SensorCondition));
//# sourceMappingURL=Condition.js.map