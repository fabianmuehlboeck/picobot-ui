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
        var y = map.getHeight() - 2;
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
        var swidth = 3;
        var curx = 1;
        var cury = height - 2 - swidth;
        var dir = 1;
        while (Math.abs(curx - width / 2) > 2 && Math.abs(cury - height / 2) > 2) {
            while (!_this.walls[curx + swidth * dir][cury]) {
                _this.walls[curx][cury] = true;
                curx += dir;
            }
            curx -= dir;
            dir = dir * -1;
            while (!_this.walls[curx][cury + swidth * dir]) {
                _this.walls[curx][cury] = true;
                cury += dir;
            }
            cury -= dir;
        }
        return _this;
    }
    SnakeMap.prototype.getGoalZones = function () {
        return [{ sx: 9, sy: 9, ex: 12, ey: 12 }];
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