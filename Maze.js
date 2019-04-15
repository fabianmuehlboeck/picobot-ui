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
        _this.robot = new BasicRobot(_this.resetWorld());
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
        var vertical = Math.random() * 2 >= 1;
        var farside = Math.random() * 2 >= 1;
        var inmaze = emptybools(_this.width, _this.height);
        var walllist = [];
        if (vertical) {
            _this.startx = farside ? _this.width - 1 : 0;
            _this.starty = Math.floor(Math.random() * Math.floor(_this.height / 2)) * 2 + 1;
            inmaze[farside ? _this.width - 2 : 1][_this.starty] = true;
            if (_this.starty > 1) {
                walllist.push({ x: farside ? _this.width - 2 : 1, y: _this.starty - 1, cx: farside ? _this.width - 2 : 1, cy: _this.starty - 2 });
            }
            if (_this.starty < _this.height - 2) {
                walllist.push({ x: farside ? _this.width - 2 : 1, y: _this.starty + 1, cx: farside ? _this.width - 2 : 1, cy: _this.starty + 2 });
            }
            walllist.push({ x: farside ? _this.width - 3 : 2, y: _this.starty, cx: farside ? _this.width - 4 : 3, cy: _this.starty });
        }
        else {
            _this.startx = Math.floor(Math.random() * Math.floor(_this.width / 2)) * 2 + 1;
            _this.starty = farside ? _this.height - 1 : 0;
            inmaze[_this.startx][farside ? _this.height - 2 : 1] = true;
            if (_this.startx > 1) {
                walllist.push({ x: _this.startx - 1, y: farside ? _this.height - 2 : 1, cx: _this.startx - 2, cy: farside ? _this.height - 2 : 1 });
            }
            if (_this.startx < _this.width - 2) {
                walllist.push({ x: _this.startx + 1, y: farside ? _this.height - 2 : 1, cx: _this.startx + 2, cy: farside ? _this.height - 2 : 1 });
            }
            walllist.push({ x: _this.startx, y: farside ? _this.height - 3 : 2, cx: _this.startx, cy: farside ? _this.height - 4 : 3 });
        }
        _this.walls[_this.startx][_this.starty] = false;
        while (walllist.length > 0) {
            var index = Math.floor(Math.random() * walllist.length);
            var x = walllist[index].x;
            var y = walllist[index].y;
            var cx = walllist[index].cx;
            var cy = walllist[index].cy;
            walllist.splice(index, 1);
            if (!inmaze[cx][cy]) {
                inmaze[cx][cy] = true;
                _this.walls[x][y] = false;
                if (_this.walls[cx + 1][cy] && cx < _this.width - 2) {
                    walllist.push({ x: cx + 1, y: cy, cx: cx + 2, cy: cy });
                }
                if (_this.walls[cx - 1][cy] && cx > 1) {
                    walllist.push({ x: cx - 1, y: cy, cx: cx - 2, cy: cy });
                }
                if (_this.walls[cx][cy + 1] && cy < _this.height - 2) {
                    walllist.push({ x: cx, y: cy + 1, cx: cx, cy: cy + 2 });
                }
                if (_this.walls[cx][cy - 1] && cy > 1) {
                    walllist.push({ x: cx, y: cy - 1, cx: cx, cy: cy - 2 });
                }
            }
        }
        return _this;
    }
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