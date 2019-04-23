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
var SpiralLevel = /** @class */ (function (_super) {
    __extends(SpiralLevel, _super);
    function SpiralLevel() {
        var _this = _super.call(this) || this;
        _this.generator = new SpiralMapGenerator();
        _this.robot = new BasicRobot(_this, _this.resetWorld());
        return _this;
    }
    SpiralLevel.prototype.getName = function () { return "Spiral"; };
    SpiralLevel.prototype.resetWorld = function () {
        var map = this.generator.getStandardMap();
        return this.makeWorld(map);
    };
    SpiralLevel.prototype.makeWorld = function (map) {
        var x = 1;
        var y = map.getHeight() - 2;
        return new SpiralWorld(Direction.East, x, y, new Array(), map);
    };
    SpiralLevel.prototype.getRobot = function () {
        return this.robot;
    };
    SpiralLevel.prototype.getTestMaps = function () {
        var _this = this;
        return this.generator.getTestMaps().map(function (mm) { return _this.makeWorld(mm); });
    };
    return SpiralLevel;
}(ALevel));
var SpiralMapGenerator = /** @class */ (function (_super) {
    __extends(SpiralMapGenerator, _super);
    function SpiralMapGenerator() {
        return _super.call(this) || this;
    }
    SpiralMapGenerator.prototype.getStandardMap = function () {
        return new SpiralMap(25, 25);
    };
    return SpiralMapGenerator;
}(AMapGenerator));
var SpiralMap = /** @class */ (function (_super) {
    __extends(SpiralMap, _super);
    function SpiralMap(width, height) {
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
    SpiralMap.prototype.getGoalZones = function () {
        return [{ sx: 9, sy: 9, ex: 12, ey: 12 }];
    };
    return SpiralMap;
}(AGoalMap));
var SpiralWorld = /** @class */ (function (_super) {
    __extends(SpiralWorld, _super);
    function SpiralWorld(direction, x, y, memories, map) {
        var _this = _super.call(this, direction, x, y, memories) || this;
        _this.map = map;
        return _this;
    }
    SpiralWorld.prototype.copyWith = function (direction, x, y, memories) {
        return new SpiralWorld(direction, x, y, memories, this.map);
    };
    SpiralWorld.prototype.getGoalMap = function () { return this.map; };
    return SpiralWorld;
}(GoalWorld));
//# sourceMappingURL=Spiral.js.map