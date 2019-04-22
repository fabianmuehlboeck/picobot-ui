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
var MazeLevel = /** @class */ (function (_super) {
    __extends(MazeLevel, _super);
    function MazeLevel() {
        var _this = _super.call(this) || this;
        _this.generator = new MazeMapGenerator();
        _this.robot = new BasicRobot(_this, _this.resetWorld());
        return _this;
    }
    MazeLevel.prototype.getName = function () { return "Maze"; };
    MazeLevel.prototype.resetWorld = function () {
        var map = this.generator.getStandardMap();
        var x = (Math.floor(Math.random() * ((map.getWidth() - 1) / 2)) * 2) + 1;
        var y = (Math.floor(Math.random() * ((map.getHeight() - 1) / 2)) * 2) + 1;
        return new MazeWorld(randomDirection(), x, y, new Array(), map);
    };
    MazeLevel.prototype.getRobot = function () {
        return this.robot;
    };
    return MazeLevel;
}(ALevel));
var MazeMapGenerator = /** @class */ (function (_super) {
    __extends(MazeMapGenerator, _super);
    function MazeMapGenerator() {
        return _super.call(this) || this;
    }
    MazeMapGenerator.prototype.getStandardMap = function () {
        return new MazeMap(25, 25);
    };
    return MazeMapGenerator;
}(AMapGenerator));
var MazeCell = /** @class */ (function () {
    function MazeCell() {
        this.outerwalls = [];
        this.neighbors = [];
        this.inMaze = false;
    }
    return MazeCell;
}());
var MazeMap = /** @class */ (function (_super) {
    __extends(MazeMap, _super);
    function MazeMap(width, height) {
        var _this = _super.call(this, width, height) || this;
        for (var x = 0; x < _this.width; x++) {
            for (var y = 0; y < _this.height; y++) {
                if (x % 2 == 0 || y % 2 == 0) {
                    _this.walls[x][y] = true;
                }
            }
        }
        var cells = _this.initCells(width, height);
        var outercells = [];
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            if (cell.outerwalls.length > 0) {
                outercells.push(cell);
            }
        }
        var startcell = outercells[Math.floor(Math.random() * outercells.length)];
        var startwall = startcell.outerwalls[Math.floor(Math.random() * startcell.outerwalls.length)];
        _this.startx = startwall.wallx;
        _this.starty = startwall.wally;
        _this.walls[_this.startx][_this.starty] = false;
        startcell.inMaze = true;
        var wallist = startcell.neighbors;
        while (wallist.length > 0) {
            var index = Math.floor(Math.random() * wallist.length);
            var next = wallist[index];
            wallist.splice(index, 1);
            if (next.cell.inMaze) {
                continue;
            }
            wallist = wallist.concat(next.cell.neighbors);
            next.cell.inMaze = true;
            _this.walls[next.wallx][next.wally] = false;
        }
        return _this;
    }
    MazeMap.prototype.initCells = function (width, height) {
        var lastCol = null;
        var cells = [];
        for (var x = 1; x < width; x += 2) {
            var currentCol = [];
            for (var y = 1; y < height; y += 2) {
                var cell = new MazeCell();
                cells.push(cell);
                if (x > 1) {
                    lastCol[currentCol.length].neighbors.push({ cell: cell, wallx: x - 1, wally: y });
                    cell.neighbors.push({ cell: lastCol[currentCol.length], wallx: x - 1, wally: y });
                }
                if (y > 1) {
                    currentCol[currentCol.length - 1].neighbors.push({ cell: cell, wallx: x, wally: y - 1 });
                    cell.neighbors.push({ cell: currentCol[currentCol.length - 1], wallx: x, wally: y - 1 });
                }
                if (x == 1) {
                    cell.outerwalls.push({ wallx: 0, wally: y });
                }
                if (y == 1) {
                    cell.outerwalls.push({ wallx: x, wally: 0 });
                }
                if (x >= width - 2) {
                    cell.outerwalls.push({ wallx: width - 1, wally: y });
                }
                if (y >= height - 2) {
                    cell.outerwalls.push({ wallx: x, wally: height - 1 });
                }
                currentCol.push(cell);
            }
            lastCol = currentCol;
        }
        return cells;
    };
    MazeMap.prototype.getGoalZones = function () {
        return [{ sx: this.startx, sy: this.starty, ex: this.startx, ey: this.starty }];
    };
    return MazeMap;
}(AGoalMap));
var MazeWorld = /** @class */ (function (_super) {
    __extends(MazeWorld, _super);
    function MazeWorld(direction, x, y, memories, map) {
        var _this = _super.call(this, direction, x, y, memories) || this;
        _this.map = map;
        return _this;
    }
    MazeWorld.prototype.copyWith = function (direction, x, y, memories) {
        return new MazeWorld(direction, x, y, memories, this.map);
    };
    MazeWorld.prototype.getGoalMap = function () { return this.map; };
    return MazeWorld;
}(GoalWorld));
//# sourceMappingURL=Maze.js.map