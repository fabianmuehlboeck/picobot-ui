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
var SensorCondition = /** @class */ (function (_super) {
    __extends(SensorCondition, _super);
    function SensorCondition() {
        return _super.call(this) || this;
    }
    SensorCondition.prototype.check = function (world) {
        var x = world.getX();
        var y = world.getY();
        var dir = world.getDirection();
        var map = world.getMap();
        var ret = [];
        switch (this.frontSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
                    ret.push(new ElementConditionFailure(this.frontSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
                    ret.push(new ElementConditionFailure(this.frontSensor.button));
                }
                break;
        }
        var ldir = dirTurnLeft(dir);
        switch (this.leftSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(ldir), y + dirYadjust(ldir))) {
                    ret.push(new ElementConditionFailure(this.leftSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(ldir), y + dirYadjust(ldir))) {
                    ret.push(new ElementConditionFailure(this.leftSensor.button));
                }
                break;
        }
        var rdir = dirTurnRight(dir);
        switch (this.rightSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(rdir), y + dirYadjust(rdir))) {
                    ret.push(new ElementConditionFailure(this.rightSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(rdir), y + dirYadjust(rdir))) {
                    ret.push(new ElementConditionFailure(this.rightSensor.button));
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
            $([this.frontSensor.button, this.leftSensor.button, this.rightSensor.button]).stop(true).animate({ backgroundColor: "#00ff00" }, 100);
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
            $([this.frontSensor.button, this.leftSensor.button, this.rightSensor.button]).stop(true).animate({ backgroundColor: "" }, 100);
        }
    };
    return SensorCondition;
}(RobotSensorSelector));
//# sourceMappingURL=Condition.js.map