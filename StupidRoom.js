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
var StupidLevel = /** @class */ (function (_super) {
    __extends(StupidLevel, _super);
    function StupidLevel() {
        var _this = _super.call(this) || this;
        _this.generator = new StupidMapGenerator();
        _this.robot = new ActionRobot(_this, _this.resetWorld());
        return _this;
    }
    StupidLevel.prototype.getName = function () { return "A Long Program"; };
    StupidLevel.prototype.resetWorld = function () {
        var map = this.generator.getStandardMap();
        return this.makeWorld(map);
    };
    StupidLevel.prototype.makeWorld = function (map) {
        return new StupidWorld(Direction.North, 12, 14, new Array(), map);
    };
    StupidLevel.prototype.getRobot = function () {
        return this.robot;
    };
    StupidLevel.prototype.getTestMaps = function () {
        var _this = this;
        return this.generator.getTestMaps().map(function (mm) { return _this.makeWorld(mm); });
    };
    return StupidLevel;
}(ALevel));
var StupidMapGenerator = /** @class */ (function (_super) {
    __extends(StupidMapGenerator, _super);
    function StupidMapGenerator() {
        return _super.call(this) || this;
    }
    StupidMapGenerator.prototype.getStandardMap = function () {
        return new StupidMap(25, 25);
    };
    return StupidMapGenerator;
}(AMapGenerator));
var StupidMap = /** @class */ (function (_super) {
    __extends(StupidMap, _super);
    function StupidMap(width, height) {
        var _this = _super.call(this, width, height) || this;
        _this.walls[10][12] = true;
        _this.walls[11][12] = true;
        _this.walls[12][12] = true;
        _this.walls[13][12] = true;
        _this.walls[14][12] = true;
        _this.walls[10][13] = true;
        _this.walls[14][13] = true;
        _this.walls[10][14] = true;
        _this.walls[14][14] = true;
        _this.walls[9][14] = true;
        _this.walls[8][14] = true;
        _this.walls[15][14] = true;
        _this.walls[16][14] = true;
        _this.walls[7][11] = true;
        _this.walls[6][11] = true;
        _this.walls[5][11] = true;
        _this.walls[5][12] = true;
        _this.walls[5][13] = true;
        _this.walls[5][14] = true;
        _this.walls[5][15] = true;
        _this.walls[17][11] = true;
        _this.walls[18][11] = true;
        _this.walls[19][11] = true;
        _this.walls[19][12] = true;
        _this.walls[19][13] = true;
        _this.walls[19][14] = true;
        _this.walls[19][15] = true;
        return _this;
    }
    StupidMap.prototype.getGoalZones = function () {
        return [{ sx: 11, sy: 8, ex: 13, ey: 10 }];
    };
    return StupidMap;
}(AGoalMap));
var StupidWorld = /** @class */ (function (_super) {
    __extends(StupidWorld, _super);
    function StupidWorld(direction, x, y, memories, map) {
        var _this = _super.call(this, direction, x, y, memories) || this;
        _this.map = map;
        return _this;
    }
    StupidWorld.prototype.copyWith = function (direction, x, y, memories) {
        return new StupidWorld(direction, x, y, memories, this.map);
    };
    StupidWorld.prototype.getGoalMap = function () { return this.map; };
    return StupidWorld;
}(GoalWorld));
//# sourceMappingURL=StupidRoom.js.map