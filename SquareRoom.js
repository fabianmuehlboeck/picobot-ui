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
var SquareRoomLevel = /** @class */ (function (_super) {
    __extends(SquareRoomLevel, _super);
    function SquareRoomLevel() {
        var _this = _super.call(this) || this;
        _this.generator = new SquareRoomMapGenerator();
        _this.robot = new MemoryRobot(_this, _this.resetWorld());
        return _this;
    }
    SquareRoomLevel.prototype.getName = function () { return "Square Room"; };
    SquareRoomLevel.prototype.resetWorld = function () {
        var map = this.generator.getStandardMap();
        return this.makeWorld(map);
    };
    SquareRoomLevel.prototype.makeWorld = function (map) {
        var x = (Math.floor(Math.random() * ((map.getWidth() - 2)))) + 1;
        var y = (Math.floor(Math.random() * ((map.getHeight() - 2)))) + 1;
        return new SquareRoomWorld(randomDirection(), x, y, new Array(), map, this.getNewvac(map, x, y));
    };
    SquareRoomLevel.prototype.getNewvac = function (map, x, y) {
        var newvac = [];
        for (var vx = 0; vx < map.getWidth(); vx++) {
            newvac.push([]);
            for (var vy = 0; vy < map.getHeight(); vy++) {
                newvac[vx].push(false);
            }
        }
        newvac[x][y] = true;
        return newvac;
    };
    SquareRoomLevel.prototype.getRobot = function () {
        return this.robot;
    };
    SquareRoomLevel.prototype.getTestMaps = function () {
        var map = this.generator.getTestMaps()[0];
        return [new SquareRoomWorld(Direction.East, 1, 1, [], map, this.getNewvac(map, 1, 1)),
            new SquareRoomWorld(Direction.West, 1, 1, [], map, this.getNewvac(map, 1, 1)),
            new SquareRoomWorld(Direction.North, 1, 1, [], map, this.getNewvac(map, 1, 1)),
            new SquareRoomWorld(Direction.South, 1, 1, [], map, this.getNewvac(map, 1, 1)),
            new SquareRoomWorld(Direction.East, 5, 5, [], map, this.getNewvac(map, 5, 5)),
            new SquareRoomWorld(Direction.West, 5, 5, [], map, this.getNewvac(map, 5, 5)),
            new SquareRoomWorld(Direction.North, 5, 5, [], map, this.getNewvac(map, 5, 5)),
            new SquareRoomWorld(Direction.South, 5, 5, [], map, this.getNewvac(map, 5, 5)),
            new SquareRoomWorld(Direction.East, 1, 5, [], map, this.getNewvac(map, 1, 5)),
            new SquareRoomWorld(Direction.West, 1, 5, [], map, this.getNewvac(map, 1, 5)),
            new SquareRoomWorld(Direction.North, 1, 5, [], map, this.getNewvac(map, 1, 5)),
            new SquareRoomWorld(Direction.South, 1, 5, [], map, this.getNewvac(map, 1, 5))];
    };
    return SquareRoomLevel;
}(ALevel));
var SquareRoomMapGenerator = /** @class */ (function (_super) {
    __extends(SquareRoomMapGenerator, _super);
    function SquareRoomMapGenerator() {
        return _super.call(this) || this;
    }
    SquareRoomMapGenerator.prototype.getStandardMap = function () {
        return new SquareRoomMap(25, 25);
    };
    SquareRoomMapGenerator.prototype.getTestMaps = function () {
        return [new SquareRoomMap(11, 11)];
    };
    return SquareRoomMapGenerator;
}(AMapGenerator));
var SquareRoomMap = /** @class */ (function (_super) {
    __extends(SquareRoomMap, _super);
    function SquareRoomMap(width, height) {
        return _super.call(this, width, height) || this;
    }
    return SquareRoomMap;
}(AVacuumMap));
var SquareRoomWorld = /** @class */ (function (_super) {
    __extends(SquareRoomWorld, _super);
    function SquareRoomWorld(direction, x, y, memories, map, vacuumed) {
        var _this = _super.call(this, direction, x, y, memories, vacuumed) || this;
        _this.map = map;
        return _this;
    }
    SquareRoomWorld.prototype.copyWithVacuumed = function (direction, x, y, memories, vacuumed) {
        return new SquareRoomWorld(direction, x, y, memories, this.map, vacuumed);
    };
    SquareRoomWorld.prototype.getVacuumMap = function () { return this.map; };
    return SquareRoomWorld;
}(VacuumWorld));
//# sourceMappingURL=SquareRoom.js.map