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
var HardMazeLevel = /** @class */ (function (_super) {
    __extends(HardMazeLevel, _super);
    function HardMazeLevel() {
        var _this = _super.call(this) || this;
        _this.generator = new HardMazeMapGenerator();
        _this.robot = new MemoryRobot(_this, _this.resetWorld());
        return _this;
    }
    HardMazeLevel.prototype.getName = function () { return "Tricky Maze"; };
    HardMazeLevel.prototype.resetWorld = function () {
        var map = this.generator.getStandardMap();
        //var x: number = (Math.floor(Math.random() * ((map.getWidth() - 1) / 2)) * 2) + 1;
        //var y: number = (Math.floor(Math.random() * ((map.getHeight() - 1) / 2)) * 2) + 1;
        //return new HardMazeWorld(randomDirection(), x, y, new Array<MemoryLabel>(), map);
        return new HardMazeWorld(Direction.North, 9, 8, [], map);
    };
    HardMazeLevel.prototype.getRobot = function () {
        return this.robot;
    };
    return HardMazeLevel;
}(ALevel));
var HardMazeMapGenerator = /** @class */ (function (_super) {
    __extends(HardMazeMapGenerator, _super);
    function HardMazeMapGenerator() {
        return _super.call(this) || this;
    }
    HardMazeMapGenerator.prototype.getStandardMap = function () {
        return new HardMazeMap(25, 25);
    };
    return HardMazeMapGenerator;
}(AMapGenerator));
var HardMazeMap = /** @class */ (function (_super) {
    __extends(HardMazeMap, _super);
    function HardMazeMap(width, height) {
        var _this = _super.call(this, width, height) || this;
        for (var _i = 0, _a = _this.trickWalls; _i < _a.length; _i++) {
            var coords = _a[_i];
            _this.walls[coords.x - 1][coords.y] = false;
            _this.walls[coords.x + 1][coords.y] = false;
            _this.walls[coords.x][coords.y - 1] = false;
            _this.walls[coords.x][coords.y + 1] = false;
        }
        return _this;
    }
    HardMazeMap.prototype.initCells = function (width, height) {
        this.trickWalls = [];
        var cells = _super.prototype.initCells.call(this, width, height);
        for (var x = 8; x < width - 1; x += 8) {
            for (var y = 8; y < height - 1; y += 8) {
                this.trickWalls.push({ x: x, y: y });
                var mergecells = cells.filter(function (cell) { return cell.neighbors.some(function (nb) { return (nb.wallx == x && Math.abs(nb.wally - y) == 1) || (nb.wally == y && Math.abs(nb.wallx - x) == 1); }); });
                var newcell = new MazeCell();
                mergecells.forEach(function (mc) { newcell.neighbors = newcell.neighbors.concat(mc.neighbors.filter(function (nb) { return !mergecells.some(function (mcnb) { return mcnb == nb.cell; }); })); });
                newcell.neighbors.forEach(function (nb) {
                    for (var _i = 0, _a = nb.cell.neighbors; _i < _a.length; _i++) {
                        var nbnb = _a[_i];
                        if (mergecells.indexOf(nbnb.cell) >= 0) {
                            nbnb.cell = newcell;
                        }
                    }
                });
            }
        }
        return cells;
    };
    HardMazeMap.prototype.draw = function (ctx, cellwidth, cellheight) {
        _super.prototype.draw.call(this, ctx, cellwidth, cellheight);
        ctx.fillStyle = "#0000ff";
        for (var _i = 0, _a = this.trickWalls; _i < _a.length; _i++) {
            var coords = _a[_i];
            ctx.fillRect(coords.x * cellwidth, coords.y * cellheight, cellwidth, cellheight);
        }
    };
    return HardMazeMap;
}(MazeMap));
var HardMazeWorld = /** @class */ (function (_super) {
    __extends(HardMazeWorld, _super);
    function HardMazeWorld(direction, x, y, memories, map) {
        var _this = _super.call(this, direction, x, y, memories) || this;
        _this.map = map;
        return _this;
    }
    HardMazeWorld.prototype.copyWith = function (direction, x, y, memories) {
        return new HardMazeWorld(direction, x, y, memories, this.map);
    };
    HardMazeWorld.prototype.getGoalMap = function () { return this.map; };
    return HardMazeWorld;
}(GoalWorld));
//# sourceMappingURL=HardMaze.js.map