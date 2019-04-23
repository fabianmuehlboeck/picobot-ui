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
var AMap = /** @class */ (function () {
    function AMap(width, height) {
        this.width = width;
        this.height = height;
        this.walls = emptybools(width, height);
        this.surroundingWalls();
    }
    AMap.prototype.surroundingWalls = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1) {
                    this.walls[x][y] = true;
                }
            }
        }
    };
    AMap.prototype.getWidth = function () { return this.width; };
    AMap.prototype.getHeight = function () { return this.height; };
    AMap.prototype.canMoveTo = function (x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height && !(this.walls[x][y]);
    };
    AMap.prototype.isWall = function (x, y) {
        return x < 0 || y < 0 || x >= this.width || y >= this.height || (this.walls[x][y]);
    };
    AMap.prototype.draw = function (ctx, cellwidth, cellheight) {
        ctx.fillStyle = WALLCOLOR;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var sy = y;
                while (this.walls[x][y]) {
                    y++;
                }
                if (sy != y) {
                    ctx.fillRect(x * cellwidth, sy * cellheight, cellwidth, (y - sy) * cellheight);
                }
            }
        }
    };
    return AMap;
}());
var AGoalMap = /** @class */ (function (_super) {
    __extends(AGoalMap, _super);
    function AGoalMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AGoalMap.prototype.isGoal = function (x, y) {
        var gzs = this.getGoalZones();
        for (var _i = 0, gzs_1 = gzs; _i < gzs_1.length; _i++) {
            var gz = gzs_1[_i];
            if (x >= gz.sx && x <= gz.ex && y >= gz.sy && y <= gz.ey) {
                return true;
            }
        }
        return false;
    };
    AGoalMap.prototype.draw = function (ctx, cellwidth, cellheight) {
        _super.prototype.draw.call(this, ctx, cellwidth, cellheight);
        ctx.fillStyle = "#000000";
        for (var _i = 0, _a = this.getGoalZones(); _i < _a.length; _i++) {
            var gz = _a[_i];
            drawFinish(ctx, gz.sx * cellwidth, gz.sy * cellheight, (gz.ex + 1) * cellwidth, (gz.ey + 1) * cellheight);
        }
    };
    return AGoalMap;
}(AMap));
var AVacuumMap = /** @class */ (function (_super) {
    __extends(AVacuumMap, _super);
    function AVacuumMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AVacuumMap;
}(AMap));
//# sourceMappingURL=Map.js.map