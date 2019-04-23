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
        var newvac = [];
        for (var vx = 0; vx < map.getWidth(); vx++) {
            newvac.push([]);
            for (var vy = 0; vy < map.getHeight(); vy++) {
                newvac[vx].push(false);
            }
        }
        newvac[x][y] = true;
        return new SquareRoomWorld(randomDirection(), x, y, new Array(), map, newvac);
    };
    SquareRoomLevel.prototype.getRobot = function () {
        return this.robot;
    };
    SquareRoomLevel.prototype.getTestMaps = function () {
        var _this = this;
        return this.generator.getTestMaps().map(function (mm) { return _this.makeWorld(mm); });
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
        return [this.getStandardMap(), this.getStandardMap(), this.getStandardMap(), this.getStandardMap(), this.getStandardMap()];
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
    SquareRoomWorld.prototype.copyWith = function (direction, x, y, memories) {
        var newvac = [];
        for (var vx = 0; vx < this.vacuumed.length; vx++) {
            newvac.push([]);
            for (var vy = 0; vy < this.vacuumed[vx].length; vy++) {
                newvac[vx].push(this.vacuumed[vx][vy]);
            }
        }
        newvac[x][y] = true;
        return new SquareRoomWorld(direction, x, y, memories, this.map, newvac);
    };
    SquareRoomWorld.prototype.getVacuumMap = function () { return this.map; };
    SquareRoomWorld.prototype.drawWorldBackground = function (ctx, cellwidth, cellheight) {
        for (var x = 0; x < this.getMap().getWidth(); x++) {
            for (var y = 0; y < this.getMap().getHeight(); y++) {
                if (this.vacuumed[x][y]) {
                    ctx.fillStyle = "#BBBBBB";
                    ctx.fillRect(x * cellwidth, y * cellheight, cellwidth, cellheight);
                }
            }
        }
    };
    return SquareRoomWorld;
}(VacuumWorld));
//# sourceMappingURL=SquareRoom.js.map