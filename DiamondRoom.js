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
var DiamondRoomLevel = /** @class */ (function (_super) {
    __extends(DiamondRoomLevel, _super);
    function DiamondRoomLevel() {
        var _this = _super.call(this) || this;
        _this.generator = new DiamondRoomMapGenerator();
        _this.robot = new MemoryRobot(_this, _this.resetWorld());
        return _this;
    }
    DiamondRoomLevel.prototype.getName = function () { return "Diamond Room"; };
    DiamondRoomLevel.prototype.resetWorld = function () {
        var map = this.generator.getStandardMap();
        return this.makeWorld(map);
    };
    DiamondRoomLevel.prototype.makeWorld = function (map) {
        var x = (Math.floor(Math.random() * ((map.getWidth() - 2)))) + 1;
        var y = (Math.floor(Math.random() * ((map.getHeight() - 2)))) + 1;
        while (map.isWall(x, y)) {
            x = (Math.floor(Math.random() * ((map.getWidth() - 2)))) + 1;
            y = (Math.floor(Math.random() * ((map.getHeight() - 2)))) + 1;
        }
        return new DiamondRoomWorld(randomDirection(), x, y, new Array(), map, this.getNewvac(map, x, y));
    };
    DiamondRoomLevel.prototype.getRobot = function () {
        return this.robot;
    };
    DiamondRoomLevel.prototype.getNewvac = function (map, x, y) {
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
    DiamondRoomLevel.prototype.getTestMaps = function () {
        var map = this.generator.getTestMaps()[0];
        var upx = Math.floor(map.getWidth() / 2);
        var upy = 1;
        while (map.isWall(upx, upy)) {
            upy++;
        }
        return [new DiamondRoomWorld(Direction.North, upx, upy, [], map, this.getNewvac(map, upx, upy)),
            new DiamondRoomWorld(Direction.East, upx, upy, [], map, this.getNewvac(map, upx, upy)),
            new DiamondRoomWorld(Direction.West, upx, upy, [], map, this.getNewvac(map, upx, upy)),
            new DiamondRoomWorld(Direction.South, upx, upy, [], map, this.getNewvac(map, upx, upy)),
            new DiamondRoomWorld(Direction.North, upx + 3, upy + 3, [], map, this.getNewvac(map, upx + 3, upy + 3)),
            new DiamondRoomWorld(Direction.East, upx + 3, upy + 3, [], map, this.getNewvac(map, upx + 3, upy + 3)),
            new DiamondRoomWorld(Direction.West, upx + 3, upy + 3, [], map, this.getNewvac(map, upx + 3, upy + 3)),
            new DiamondRoomWorld(Direction.South, upx + 3, upy + 3, [], map, this.getNewvac(map, upx + 3, upy + 3)),
            new DiamondRoomWorld(Direction.North, upx, upy + Math.floor(map.getHeight() / 2), [], map, this.getNewvac(map, upx, upy + Math.floor(map.getHeight() / 2))),
            new DiamondRoomWorld(Direction.East, upx, upy + Math.floor(map.getHeight() / 2), [], map, this.getNewvac(map, upx, upy + Math.floor(map.getHeight() / 2))),
            new DiamondRoomWorld(Direction.West, upx, upy + Math.floor(map.getHeight() / 2), [], map, this.getNewvac(map, upx, upy + Math.floor(map.getHeight() / 2))),
            new DiamondRoomWorld(Direction.South, upx, upy + Math.floor(map.getHeight() / 2), [], map, this.getNewvac(map, upx, upy + Math.floor(map.getHeight() / 2)))];
    };
    return DiamondRoomLevel;
}(ALevel));
var DiamondRoomMapGenerator = /** @class */ (function (_super) {
    __extends(DiamondRoomMapGenerator, _super);
    function DiamondRoomMapGenerator() {
        return _super.call(this) || this;
    }
    DiamondRoomMapGenerator.prototype.getStandardMap = function () {
        return new DiamondRoomMap(25, 25);
    };
    DiamondRoomMapGenerator.prototype.getTestMaps = function () {
        return [new DiamondRoomMap(11, 11)];
    };
    return DiamondRoomMapGenerator;
}(AMapGenerator));
var DiamondRoomMap = /** @class */ (function (_super) {
    __extends(DiamondRoomMap, _super);
    function DiamondRoomMap(width, height) {
        var _this = _super.call(this, width, height) || this;
        var middlex = Math.floor(width / 2);
        var middley = Math.floor(height / 2);
        for (var x = 0; x < width; x++) {
            var dist = Math.ceil(Math.abs(x - middlex) * (middley / middlex));
            for (var y = 1; y <= dist; y++) {
                _this.walls[x][y] = true;
                _this.walls[x][height - 1 - y] = true;
            }
        }
        return _this;
    }
    return DiamondRoomMap;
}(AVacuumMap));
var DiamondRoomWorld = /** @class */ (function (_super) {
    __extends(DiamondRoomWorld, _super);
    function DiamondRoomWorld(direction, x, y, memories, map, vacuumed) {
        var _this = _super.call(this, direction, x, y, memories, vacuumed) || this;
        _this.map = map;
        return _this;
    }
    DiamondRoomWorld.prototype.copyWithVacuumed = function (direction, x, y, memories, vacuumed) {
        return new DiamondRoomWorld(direction, x, y, memories, this.map, vacuumed);
    };
    DiamondRoomWorld.prototype.getVacuumMap = function () { return this.map; };
    return DiamondRoomWorld;
}(VacuumWorld));
//# sourceMappingURL=DiamondRoom.js.map