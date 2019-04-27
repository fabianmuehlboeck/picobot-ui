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
var SnakeLevel = /** @class */ (function (_super) {
    __extends(SnakeLevel, _super);
    function SnakeLevel() {
        var _this = _super.call(this) || this;
        _this.generator = new SnakeMapGenerator();
        _this.robot = new SensorRobot(_this, _this.resetWorld());
        return _this;
    }
    SnakeLevel.prototype.getName = function () { return "Snake"; };
    SnakeLevel.prototype.resetWorld = function () {
        var map = this.generator.getStandardMap();
        return this.makeWorld(map);
    };
    SnakeLevel.prototype.makeWorld = function (map) {
        var x = 1;
        var y = 1;
        return new SnakeWorld(Direction.East, x, y, new Array(), map);
    };
    SnakeLevel.prototype.getRobot = function () {
        return this.robot;
    };
    SnakeLevel.prototype.getTestMaps = function () {
        var _this = this;
        return this.generator.getTestMaps().map(function (mm) { return _this.makeWorld(mm); });
    };
    return SnakeLevel;
}(ALevel));
var SnakeMapGenerator = /** @class */ (function (_super) {
    __extends(SnakeMapGenerator, _super);
    function SnakeMapGenerator() {
        return _super.call(this) || this;
    }
    SnakeMapGenerator.prototype.getStandardMap = function () {
        return new SnakeMap(25, 25);
    };
    return SnakeMapGenerator;
}(AMapGenerator));
var SnakeMap = /** @class */ (function (_super) {
    __extends(SnakeMap, _super);
    function SnakeMap(width, height) {
        var _this = _super.call(this, width, height) || this;
        var swidth = 1;
        var cury = 1 + swidth;
        var dir = 1;
        var row = 0;
        while (cury <= height - swidth - 2) {
            if (row % 2 == 0) {
                var curx = 1;
                while (curx < width - swidth - 1) {
                    _this.walls[curx][cury] = true;
                    curx++;
                }
            }
            else {
                var curx = width - 2;
                while (curx > swidth) {
                    _this.walls[curx][cury] = true;
                    curx--;
                }
            }
            row++;
            cury += swidth + 1;
        }
        return _this;
    }
    SnakeMap.prototype.getGoalZones = function () {
        return [{ sx: 1, sy: this.height - 2, ex: 1, ey: this.height - 2 }];
    };
    return SnakeMap;
}(AGoalMap));
var SnakeWorld = /** @class */ (function (_super) {
    __extends(SnakeWorld, _super);
    function SnakeWorld(direction, x, y, memories, map) {
        var _this = _super.call(this, direction, x, y, memories) || this;
        _this.map = map;
        return _this;
    }
    SnakeWorld.prototype.copyWith = function (direction, x, y, memories) {
        return new SnakeWorld(direction, x, y, memories, this.map);
    };
    SnakeWorld.prototype.getGoalMap = function () { return this.map; };
    return SnakeWorld;
}(GoalWorld));
//# sourceMappingURL=Snake.js.map