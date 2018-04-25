var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FieldState;
(function (FieldState) {
    FieldState[FieldState["Empty"] = 0] = "Empty";
    FieldState[FieldState["Unknown"] = 1] = "Unknown";
    FieldState[FieldState["Wall"] = 2] = "Wall";
})(FieldState || (FieldState = {}));
;
function fieldStateCompare(left, right) {
    return (left == right) || (right == FieldState.Unknown);
}
var WorldState = /** @class */ (function () {
    function WorldState(north, east, south, west) {
        this.north = north;
        this.east = east;
        this.south = south;
        this.west = west;
    }
    WorldState.prototype.getNorth = function () { return this.north; };
    WorldState.prototype.getEast = function () { return this.east; };
    WorldState.prototype.getSouth = function () { return this.south; };
    WorldState.prototype.getWest = function () { return this.west; };
    WorldState.prototype.setNorth = function (fs) { this.north = fs; };
    WorldState.prototype.setEast = function (fs) { this.east = fs; };
    WorldState.prototype.setSouth = function (fs) { this.south = fs; };
    WorldState.prototype.setWest = function (fs) { this.west = fs; };
    WorldState.prototype.matches = function (template) {
        return fieldStateCompare(this.north, template.getNorth()) && fieldStateCompare(this.east, template.getEast()) && fieldStateCompare(this.south, template.getSouth()) && fieldStateCompare(this.west, template.getWest());
    };
    WorldState.prototype.vmatches = function (template, thencont, elsecont) {
        template.vvmatches(this, thencont, elsecont);
    };
    WorldState.prototype.vvmatches = function (ws, thencont, elsecont, canvas) {
        if (canvas) {
            if (ws.matches(this)) {
                $(canvas).animate({ backgroundColor: "#00ff00" }, { duration: 200, easing: "easeOutCirc" }).promise().always(function () {
                    $(canvas).animate({ backgroundColor: "#ffffff" }, { duration: 300, easing: "easeOutCirc" }).promise().always(thencont);
                });
            }
            else {
                $(canvas).animate({ backgroundColor: "#ff0000" }, { duration: 200, easing: "easeOutCirc" }).promise().always(function () {
                    $(canvas).animate({ backgroundColor: "#ffffff" }, { duration: 300, easing: "easeOutCirc" }).promise().always(elsecont);
                    thencont();
                });
            }
        }
        else {
            if (ws.matches(this)) {
                thencont();
            }
            else {
                elsecont();
            }
        }
    };
    WorldState.prototype.getPattern = function () {
        return new WorldPattern(this.north, this.south, this.west, this.east);
    };
    WorldState.prototype.copyFrom = function (ws) {
        this.north = ws.getNorth();
        this.east = ws.getEast();
        this.south = ws.getSouth();
        this.west = ws.getWest();
    };
    return WorldState;
}());
var DrawWorldState = /** @class */ (function (_super) {
    __extends(DrawWorldState, _super);
    function DrawWorldState(canvas) {
        var _this = _super.call(this, FieldState.Unknown, FieldState.Unknown, FieldState.Unknown, FieldState.Unknown) || this;
        _this.canvas = canvas;
        if (!canvas.classList.contains("worldstatecanvas")) {
            canvas.classList.add("worldstatecanvas");
        }
        _this.draw();
        return _this;
    }
    DrawWorldState.prototype.copyFrom = function (ws) {
        _super.prototype.copyFrom.call(this, ws);
        this.draw();
    };
    DrawWorldState.prototype.vmatches = function (template, thencont, elsecont) {
        template.vvmatches(this, thencont, elsecont, this.canvas);
    };
    DrawWorldState.prototype.vvmatches = function (ws, thencont, elsecont, canvas) {
        var jq;
        if (canvas) {
            jq = $([this.canvas, canvas]);
        }
        else {
            jq = $(this.canvas);
        }
        if (ws.matches(this)) {
            jq.animate({ backgroundColor: "#00ff00" }, { duration: 200, easing: "easeOutCirc" }).promise().always(function () {
                jq.animate({ backgroundColor: "#ffffff" }, { duration: 300, easing: "easeOutCirc" }).promise().always(thencont);
            });
        }
        else {
            jq.animate({ backgroundColor: "#ff0000" }, { duration: 200, easing: "easeOutCirc" }).promise().always(function () {
                jq.animate({ backgroundColor: "#ffffff" }, { duration: 300, easing: "easeOutCirc" }).promise().always(elsecont);
            });
        }
    };
    DrawWorldState.prototype.setNorth = function (fs) { _super.prototype.setNorth.call(this, fs); this.draw(); };
    DrawWorldState.prototype.setEast = function (fs) { _super.prototype.setEast.call(this, fs); this.draw(); };
    DrawWorldState.prototype.setSouth = function (fs) { _super.prototype.setSouth.call(this, fs); this.draw(); };
    DrawWorldState.prototype.setWest = function (fs) { _super.prototype.setWest.call(this, fs); this.draw(); };
    DrawWorldState.prototype.draw = function () {
        var ctx = this.canvas.getContext("2d");
        //ctx.fillStyle = "#ffffff";
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var cw = this.canvas.width / 3;
        var ch = this.canvas.height / 3;
        ctx.fillStyle = ROBOTCOLOR;
        ctx.beginPath();
        ctx.ellipse(cw + cw / 2, ch + ch / 2, cw / 2, ch / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        drawFog(ctx, 0, 0, cw, ch);
        drawFog(ctx, 0, ch * 2, cw, ch * 3);
        drawFog(ctx, cw * 2, 0, cw * 3, ch);
        drawFog(ctx, cw * 2, ch * 2, ch * 3, ch * 3);
        DrawWorldState.drawColor(ctx, this.north, cw, 0, cw, ch);
        DrawWorldState.drawColor(ctx, this.south, cw, ch * 2, cw, ch);
        DrawWorldState.drawColor(ctx, this.west, 0, ch, cw, ch);
        DrawWorldState.drawColor(ctx, this.east, cw * 2, ch, cw, ch);
    };
    DrawWorldState.drawColor = function (ctx, state, x, y, w, h) {
        switch (state) {
            case FieldState.Empty:
                //ctx.fillStyle = "#ffffff";
                //ctx.fillRect(x, y, w, h);
                break;
            case FieldState.Unknown:
                ctx.fillStyle = "#000000";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("?", x + w / 2, y + h / 2);
                break;
            case FieldState.Wall:
                ctx.fillStyle = WALLCOLOR;
                ctx.fillRect(x, y, w, h);
                break;
        }
    };
    return DrawWorldState;
}(WorldState));
var ControlWorldState = /** @class */ (function (_super) {
    __extends(ControlWorldState, _super);
    function ControlWorldState(canvas) {
        var _this = _super.call(this, canvas) || this;
        var ws = _this;
        canvas.onclick = function (e) { ws.clicked(e); };
        return _this;
    }
    ControlWorldState.prototype.clicked = function (e) {
        var posx = 0;
        var posy = 0;
        posx = e.offsetX;
        posy = e.offsetY;
        var cw = this.canvas.width / 3;
        var ch = this.canvas.height / 3;
        if (posx >= 0 && posx < cw && posy >= ch && posy < ch * 2) {
            this.west = ControlWorldState.cycle(this.west);
            this.draw();
        }
        if (posx >= cw && posx < cw * 2) {
            if (posy >= 0 && posy < ch) {
                this.north = ControlWorldState.cycle(this.north);
                this.draw();
            }
            if (posy >= ch * 2 && posy < ch * 3) {
                this.south = ControlWorldState.cycle(this.south);
                this.draw();
            }
        }
        if (posx >= cw * 2 && posx < cw * 3 && posy >= ch && posy < ch * 2) {
            this.east = ControlWorldState.cycle(this.east);
            this.draw();
        }
    };
    ControlWorldState.cycle = function (status) {
        switch (status) {
            case FieldState.Empty:
                return FieldState.Unknown;
            case FieldState.Unknown:
                return FieldState.Wall;
            case FieldState.Wall:
                return FieldState.Empty;
        }
    };
    return ControlWorldState;
}(DrawWorldState));
//# sourceMappingURL=WorldState.js.map