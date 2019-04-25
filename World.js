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
var Direction;
(function (Direction) {
    Direction[Direction["East"] = 0] = "East";
    Direction[Direction["South"] = 1] = "South";
    Direction[Direction["West"] = 2] = "West";
    Direction[Direction["North"] = 3] = "North";
})(Direction || (Direction = {}));
;
var AWorld = /** @class */ (function () {
    function AWorld(direction, x, y, memories) {
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.memories = memories;
    }
    AWorld.prototype.remembers = function (memories, memul) {
        var tempmems = this.memories.map(function (l) { return l; });
        var ret = [];
        while (memories.length > 0) {
            var index = tempmems.indexOf(memories[0].memory);
            if (index < 0) {
                ret.push(new ElementConditionFailure(memories[0].actionli));
            }
            else {
                tempmems.splice(index, 1);
            }
            memories.splice(0, 1);
        }
        if (tempmems.length > 0) {
            ret.push(new ElementConditionFailure(memul));
        }
        return ret;
    };
    AWorld.prototype.turnLeft = function () {
        switch (this.direction) {
            case Direction.East:
                return this.copyWith(Direction.North, this.x, this.y, this.memories);
            case Direction.South:
                return this.copyWith(Direction.East, this.x, this.y, this.memories);
            case Direction.West:
                return this.copyWith(Direction.South, this.x, this.y, this.memories);
            case Direction.North:
                return this.copyWith(Direction.West, this.x, this.y, this.memories);
        }
    };
    AWorld.prototype.turnRight = function () {
        switch (this.direction) {
            case Direction.East:
                return this.copyWith(Direction.South, this.x, this.y, this.memories);
            case Direction.South:
                return this.copyWith(Direction.West, this.x, this.y, this.memories);
            case Direction.West:
                return this.copyWith(Direction.North, this.x, this.y, this.memories);
            case Direction.North:
                return this.copyWith(Direction.East, this.x, this.y, this.memories);
        }
    };
    AWorld.prototype.moveForward = function () {
        var newx = this.x;
        var newy = this.y;
        switch (this.direction) {
            case Direction.East:
                newx++;
                break;
            case Direction.South:
                newy++;
                break;
            case Direction.West:
                newx--;
                break;
            case Direction.North:
                newy--;
                break;
        }
        if (this.getMap().canMoveTo(newx, newy)) {
            return this.copyWith(this.direction, newx, newy, this.memories);
        }
        throw new Error("Can't move forward.");
    };
    AWorld.prototype.remember = function (memory) {
        if (this.memories.indexOf(memory) < 0) {
            var newmems = Array();
            for (var _i = 0, _a = this.memories; _i < _a.length; _i++) {
                var l = _a[_i];
                newmems.push(l);
            }
            newmems.push(memory);
            return this.copyWith(this.direction, this.x, this.y, newmems);
        }
        return this.copyWith(this.direction, this.x, this.y, this.memories);
    };
    AWorld.prototype.clearMemory = function () {
        return this.copyWith(this.direction, this.x, this.y, new Array());
    };
    AWorld.prototype.getX = function () {
        return this.x;
    };
    AWorld.prototype.getY = function () {
        return this.y;
    };
    AWorld.prototype.getDirection = function () {
        return this.direction;
    };
    AWorld.prototype.setDirection = function (dir) {
        return this.copyWith(dir, this.x, this.y, this.memories);
    };
    AWorld.prototype.setX = function (x) {
        return this.copyWith(this.direction, x, this.y, this.memories);
    };
    AWorld.prototype.setY = function (y) {
        return this.copyWith(this.direction, this.x, y, this.memories);
    };
    AWorld.prototype.drawWorldBackground = function (ctx, cellwidth, cellheight) {
    };
    AWorld.prototype.draw = function (mapcanvas) {
        var ctx = mapcanvas.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var map = this.getMap();
        var cellwidth = mapcanvas.width / map.getWidth();
        var cellheight = mapcanvas.height / map.getHeight();
        this.getMap().draw(ctx, cellwidth, cellheight);
        this.drawWorldBackground(ctx, cellwidth, cellheight);
        var xt = (this.getX() * cellwidth) + cellwidth / 2;
        var yt = (this.getY() * cellheight) + cellheight / 2;
        ctx.translate(xt, yt);
        var rotation = 0;
        switch (this.getDirection()) {
            case Direction.East:
                rotation = Math.PI / 2;
                break;
            case Direction.South:
                rotation = Math.PI;
                break;
            case Direction.West:
                rotation = Math.PI * 1.5;
                break;
            case Direction.North:
                break;
        }
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(-cellwidth / 2, cellheight / 2);
        ctx.lineTo(0, -cellheight / 2);
        ctx.lineTo(cellwidth / 2, cellheight / 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = ROBOTCOLOR;
        ctx.fill();
        //ctx.fillRect(-cellwidth / 2, -cellheight / 2, cellwidth, cellheight);
        ctx.rotate(-rotation);
        ctx.translate(-xt, -yt);
    };
    AWorld.prototype.updateMemoryUL = function (ul) {
        $(ul).empty();
        for (var _i = 0, _a = this.memories; _i < _a.length; _i++) {
            var memory = _a[_i];
            ul.appendChild(memory.getElement());
        }
    };
    AWorld.prototype.drawSensorStatus = function (canvas) {
        var x = this.getX();
        var y = this.getY();
        var dir = this.getDirection();
        var map = this.getMap();
        var ctx = canvas.getContext("2d");
        ctx.font = "30px bold sans-serif";
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.translate(48, 48);
        ctx.beginPath();
        ctx.moveTo(0, 48);
        ctx.lineTo(24, 0);
        ctx.lineTo(48, 48);
        ctx.closePath();
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.fillStyle = ROBOTCOLOR;
        ctx.fill();
        ctx.translate(-48, 0);
        if (map.isWall(x + dirXadjust(dirTurnLeft(dir)), y + dirYadjust(dirTurnLeft(dir)))) {
            drawWall(ctx);
        }
        else {
            drawFree(ctx);
        }
        ctx.translate(48, -48);
        if (map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
            drawWall(ctx);
        }
        else {
            drawFree(ctx);
        }
        ctx.translate(48, 48);
        if (map.isWall(x + dirXadjust(dirTurnRight(dir)), y + dirYadjust(dirTurnRight(dir)))) {
            drawWall(ctx);
        }
        else {
            drawFree(ctx);
        }
        ctx.translate(-96, -48);
    };
    return AWorld;
}());
var GoalWorld = /** @class */ (function (_super) {
    __extends(GoalWorld, _super);
    function GoalWorld() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GoalWorld.prototype.getMap = function () { return this.getGoalMap(); };
    GoalWorld.prototype.isFinal = function () { return this.getGoalMap().isGoal(this.getX(), this.getY()); };
    return GoalWorld;
}(AWorld));
var VacuumWorld = /** @class */ (function (_super) {
    __extends(VacuumWorld, _super);
    function VacuumWorld(direction, x, y, memories, vacuumed) {
        var _this = _super.call(this, direction, x, y, memories) || this;
        _this.vacuumed = vacuumed;
        return _this;
    }
    VacuumWorld.prototype.getMap = function () { return this.getVacuumMap(); };
    VacuumWorld.prototype.drawWorldBackground = function (ctx, cellwidth, cellheight) {
        for (var x = 0; x < this.getMap().getWidth(); x++) {
            for (var y = 0; y < this.getMap().getHeight(); y++) {
                if (this.vacuumed[x][y]) {
                    ctx.fillStyle = "#BBBBBB";
                    ctx.fillRect(x * cellwidth, y * cellheight, cellwidth, cellheight);
                }
            }
        }
    };
    VacuumWorld.prototype.copyWith = function (direction, x, y, memories) {
        var newvac = [];
        for (var vx = 0; vx < this.vacuumed.length; vx++) {
            newvac.push([]);
            for (var vy = 0; vy < this.vacuumed[vx].length; vy++) {
                newvac[vx].push(this.vacuumed[vx][vy]);
            }
        }
        newvac[x][y] = true;
        return this.copyWithVacuumed(direction, x, y, memories, newvac);
    };
    VacuumWorld.prototype.isFinal = function () {
        for (var x = 0; x < this.getMap().getWidth(); x++) {
            for (var y = 0; y < this.getMap().getHeight(); y++) {
                if ((!this.getMap().canMoveTo(x, y)) || this.vacuumed[x][y]) {
                    continue;
                }
                return false;
            }
        }
        return true;
    };
    return VacuumWorld;
}(AWorld));
//# sourceMappingURL=World.js.map