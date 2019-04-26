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
var StartLevel = /** @class */ (function (_super) {
    __extends(StartLevel, _super);
    function StartLevel() {
        var _this = _super.call(this) || this;
        _this.generator = new StartMapGenerator();
        _this.robot = new ActionRobot(_this, _this.resetWorld());
        return _this;
    }
    StartLevel.prototype.getName = function () { return "A First Program"; };
    StartLevel.prototype.resetWorld = function () {
        var map = this.generator.getStandardMap();
        return this.makeWorld(map);
    };
    StartLevel.prototype.makeWorld = function (map) {
        return new StartWorld(Direction.North, 12, 14, new Array(), map);
    };
    StartLevel.prototype.getRobot = function () {
        return this.robot;
    };
    StartLevel.prototype.getTestMaps = function () {
        var _this = this;
        return this.generator.getTestMaps().map(function (mm) { return _this.makeWorld(mm); });
    };
    return StartLevel;
}(ALevel));
var StartMapGenerator = /** @class */ (function (_super) {
    __extends(StartMapGenerator, _super);
    function StartMapGenerator() {
        return _super.call(this) || this;
    }
    StartMapGenerator.prototype.getStandardMap = function () {
        return new StartMap(25, 25);
    };
    return StartMapGenerator;
}(AMapGenerator));
var StartMap = /** @class */ (function (_super) {
    __extends(StartMap, _super);
    function StartMap(width, height) {
        var _this = _super.call(this, width, height) || this;
        _this.walls[11][12] = true;
        _this.walls[12][12] = true;
        _this.walls[13][12] = true;
        return _this;
    }
    StartMap.prototype.getGoalZones = function () {
        return [{ sx: 11, sy: 8, ex: 13, ey: 10 }];
    };
    return StartMap;
}(AGoalMap));
var StartWorld = /** @class */ (function (_super) {
    __extends(StartWorld, _super);
    function StartWorld(direction, x, y, memories, map) {
        var _this = _super.call(this, direction, x, y, memories) || this;
        _this.map = map;
        return _this;
    }
    StartWorld.prototype.copyWith = function (direction, x, y, memories) {
        return new StartWorld(direction, x, y, memories, this.map);
    };
    StartWorld.prototype.getGoalMap = function () { return this.map; };
    return StartWorld;
}(GoalWorld));
//# sourceMappingURL=StartRoom.js.map