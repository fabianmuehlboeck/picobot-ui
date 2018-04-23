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
var StepOptions = /** @class */ (function () {
    function StepOptions() {
    }
    return StepOptions;
}());
var FOGDIST = 4;
function drawFog(ctx, sx, sy, ex, ey) {
    var x = sx;
    var y = sy;
    ctx.strokeStyle = "#000000";
    if (x % FOGDIST != 0) {
        x += FOGDIST - (x % FOGDIST);
    }
    if (y % FOGDIST != 0) {
        x -= y % FOGDIST;
    }
    var d;
    while (x < ex) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        d = Math.min(x - sx, ey - y);
        ctx.lineTo(x - d, y + d);
        ctx.stroke();
        ctx.closePath();
        x += FOGDIST;
    }
    y += x - ex;
    x = ex;
    while (y <= ey) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        d = Math.min(x - sx, ey - y);
        ctx.lineTo(x - d, y + d);
        ctx.stroke();
        ctx.closePath();
        y += FOGDIST;
    }
}
var FINISHSIZE = 8;
function drawFinish(ctx, sx, sy, ex, ey) {
    var x = sx - (sx % (FINISHSIZE * 2));
    var y = sy - (sy % (FINISHSIZE * 2));
    ctx.fillStyle = "#000000";
    while (x < ex) {
        var ax = Math.max(x, sx);
        y = sy - (sy % (FINISHSIZE * 2));
        if (x % (FINISHSIZE * 2) == 0) {
            y += FINISHSIZE;
        }
        while (y < ey) {
            if (x + FINISHSIZE <= sx) {
                break;
            }
            if (y + FINISHSIZE > sy) {
                var ay = Math.max(y, sy);
                ctx.fillRect(ax, ay, (x + FINISHSIZE) - ax, (y + FINISHSIZE) - ay);
            }
            y += FINISHSIZE * 2;
        }
        x += FINISHSIZE;
    }
}
var MapControls = /** @class */ (function () {
    function MapControls(canvasParent, controlParent, editorDiv, codeDiv, helpDiv) {
        this._isrunning = false;
        var mc = this;
        this.running = false;
        this.canvasParent = canvasParent;
        this.editorDiv = editorDiv;
        this.codeDiv = codeDiv;
        this.helpDiv = helpDiv;
        this.controlDiv = document.createElement("div");
        var teleportDiv = document.createElement("div");
        teleportDiv.className = "controlteleportdiv";
        this.upButton = document.createElement("a");
        this.upButton.className = "controlupbutton";
        this.upButton.addEventListener("click", function () {
            mc.map.getRobot().moveNorth(mc.map, mc.map.getStepOptions());
            mc.refresh();
        });
        teleportDiv.appendChild(this.upButton);
        this.rightButton = document.createElement("a");
        this.rightButton.className = "controlrightbutton";
        this.rightButton.addEventListener("click", function () {
            mc.map.getRobot().moveEast(mc.map, mc.map.getStepOptions());
            mc.refresh();
        });
        teleportDiv.appendChild(this.rightButton);
        this.downButton = document.createElement("a");
        this.downButton.className = "controldownbutton";
        this.downButton.addEventListener("click", function () {
            mc.map.getRobot().moveSouth(mc.map, mc.map.getStepOptions());
            mc.refresh();
        });
        teleportDiv.appendChild(this.downButton);
        this.leftButton = document.createElement("a");
        this.leftButton.className = "controlleftbutton";
        this.leftButton.addEventListener("click", function () {
            mc.map.getRobot().moveWest(mc.map, mc.map.getStepOptions());
            mc.refresh();
        });
        teleportDiv.appendChild(this.leftButton);
        this.controlDiv.appendChild(teleportDiv);
        var movetext = document.createElement("div");
        movetext.appendChild(document.createTextNode("MOVE"));
        teleportDiv.appendChild(movetext);
        var worldStateDiv = document.createElement("div");
        worldStateDiv.className = "worldstatediv";
        this.controlDiv.appendChild(worldStateDiv);
        var wscanvas = document.createElement("canvas");
        wscanvas.width = 120;
        wscanvas.height = 120;
        this.worldState = new DrawWorldState(wscanvas);
        var wsheaderdiv = document.createElement("div");
        wsheaderdiv.appendChild(document.createTextNode("ROBOT SEES:"));
        worldStateDiv.appendChild(wsheaderdiv);
        worldStateDiv.appendChild(wscanvas);
        var runProgramDiv = document.createElement("div");
        runProgramDiv.className = "runprogramdiv";
        var simplerundiv = document.createElement("div");
        simplerundiv.appendChild(document.createTextNode("FAST"));
        var stepbutton = document.createElement("button");
        stepbutton.appendChild(document.createTextNode("Step"));
        stepbutton.addEventListener("click", function () {
            if (mc.running == false) {
                if (mc.map.hasWon()) {
                    mc.map.showWinningMessage();
                }
                else {
                    mc.step();
                    if (mc.map.hasWon()) {
                        mc.map.showWinningMessage();
                    }
                }
            }
        });
        simplerundiv.appendChild(stepbutton);
        var runfastbutton = document.createElement("button");
        runfastbutton.appendChild(document.createTextNode("Run"));
        runfastbutton.addEventListener("click", function () {
            if (mc.running == false) {
                if (mc.map.hasWon()) {
                    mc.map.showWinningMessage();
                }
                else {
                    mc.running = true;
                    runfastbutton.classList.add("runningbutton");
                    mc.runinterval = window.setInterval(function () { mc.run(); }, 50);
                }
            }
        });
        simplerundiv.appendChild(runfastbutton);
        var visualizerundiv = document.createElement("div");
        visualizerundiv.appendChild(document.createTextNode("VISUALIZE"));
        stepbutton = document.createElement("button");
        stepbutton.appendChild(document.createTextNode("Step"));
        stepbutton.addEventListener("click", function () {
            if (mc.running == false) {
                if (mc.map.hasWon()) {
                    mc.map.showWinningMessage();
                }
                else {
                    mc.running = true;
                    stepbutton.classList.add("runningbutton");
                    mc.vstep();
                }
            }
        });
        visualizerundiv.appendChild(stepbutton);
        var runbutton = document.createElement("button");
        runbutton.appendChild(document.createTextNode("Run"));
        runbutton.addEventListener("click", function () {
            if (mc.running == false) {
                if (mc.map.hasWon()) {
                    mc.map.showWinningMessage();
                }
                else {
                    mc.running = true;
                    runbutton.classList.add("runningbutton");
                    mc.vrun();
                }
            }
        });
        visualizerundiv.appendChild(runbutton);
        runProgramDiv.appendChild(simplerundiv);
        runProgramDiv.appendChild(visualizerundiv);
        var stopbutton = document.createElement("button");
        stopbutton.appendChild(document.createTextNode("Stop"));
        stopbutton.addEventListener("click", function () {
            if (mc.running == true) {
                mc.running = false;
                window.clearInterval(mc.runinterval);
            }
        });
        runProgramDiv.appendChild(stopbutton);
        var scenariodiv = document.createElement("div");
        scenariodiv.classList.add("scenariocontrol");
        var scdtext = document.createElement("div");
        scdtext.appendChild(document.createTextNode("MAP CONTROL"));
        scenariodiv.appendChild(scdtext);
        var resetbutton = document.createElement("button");
        resetbutton.appendChild(document.createTextNode("Reset Map"));
        resetbutton.addEventListener("click", function () {
            mc.map.reset();
            mc.refresh();
        });
        scenariodiv.appendChild(resetbutton);
        var testbutton = document.createElement("button");
        testbutton.appendChild(document.createTextNode("Test Robot"));
        testbutton.addEventListener("click", function () {
            mc.map.test(function () { mc.refresh(); });
        });
        scenariodiv.appendChild(testbutton);
        var fogcheckbox = document.createElement("input");
        fogcheckbox.type = "checkbox";
        fogcheckbox.id = "fogcheckbox";
        fogcheckbox.addEventListener("change", function () { mc.refresh(); });
        var fogcheckboxlabel = document.createElement("label");
        fogcheckboxlabel.htmlFor = "fogcheckbox";
        fogcheckboxlabel.appendChild(document.createTextNode("Draw Fog on Map"));
        scenariodiv.appendChild(fogcheckbox);
        scenariodiv.appendChild(fogcheckboxlabel);
        runProgramDiv.appendChild(scenariodiv);
        this.controlDiv.appendChild(runProgramDiv);
        this.robotstatediv = document.createElement("div");
        this.robotstatediv.classList.add("controlrobotstatediv");
        this.controlDiv.appendChild(this.robotstatediv);
        controlParent.appendChild(this.controlDiv);
        $(fogcheckbox).checkboxradio();
    }
    Object.defineProperty(MapControls.prototype, "running", {
        get: function () { return this._isrunning; },
        set: function (b) {
            this._isrunning = b;
            if (b == false) {
                $(".runningbutton").removeClass("runningbutton");
            }
        },
        enumerable: true,
        configurable: true
    });
    MapControls.prototype.getMap = function () { return this.map; };
    MapControls.prototype.setMap = function (map) {
        this.map = map;
        while (this.editorDiv.childNodes.length > 0) {
            this.editorDiv.removeChild(this.editorDiv.childNodes[0]);
        }
        while (this.canvasParent.childNodes.length > 0) {
            this.canvasParent.removeChild(this.canvasParent.childNodes[0]);
        }
        var menudiv = document.createElement("div");
        menudiv.classList.add("editormenu");
        var addstatebutton = document.createElement("button");
        addstatebutton.appendChild(document.createTextNode("Add State"));
        addstatebutton.addEventListener("click", function () {
            var state = map.getRobot().addState();
            $('html, body').animate({
                scrollTop: Math.max(0, $(state.div).offset().top - 96)
            }, 300);
            var namefield = state.namefield;
            namefield.selectionStart = 0;
            namefield.selectionEnd = namefield.value.length;
            namefield.focus();
        });
        menudiv.appendChild(addstatebutton);
        this.editorDiv.appendChild(menudiv);
        while (this.robotstatediv.childNodes.length > 0) {
            this.robotstatediv.removeChild(this.robotstatediv.childNodes[0]);
        }
        this.robotstatediv.appendChild(map.getRobot().stateselector.div);
        this.editorDiv.appendChild(map.getRobot().programdiv);
        this.canvasParent.appendChild(this.map.getCanvas());
        if (map.isStateless()) {
            this.editorDiv.classList.add("stateless");
            this.robotstatediv.classList.add("stateless");
        }
        else {
            this.editorDiv.classList.remove("stateless");
            this.robotstatediv.classList.remove("stateless");
        }
        this.refresh();
    };
    MapControls.prototype.refresh = function () {
        this.map.draw();
        var robot = this.map.getRobot();
        this.map.updateWorldState(this.worldState, robot.getX(), robot.getY());
        this.worldState.draw();
    };
    MapControls.prototype.step = function () {
        var result = this.map.step(this.worldState);
        this.refresh();
        return result;
    };
    MapControls.prototype.vstep = function () {
        var _this = this;
        this.map.vstep(this.worldState, this.map.getStepOptions(), function () {
            _this.refresh();
            _this.running = false;
            if (_this.map.hasWon()) {
                _this.map.showWinningMessage();
            }
        }, function () {
            _this.refresh();
            if (_this.map.hasWon()) {
                _this.map.showWinningMessage();
            }
            _this.running = false;
        });
    };
    MapControls.prototype.run = function () {
        if (this.running && !this.step()) {
            this.running = false;
            window.clearInterval(this.runinterval);
            return false;
        }
        if (this.map.hasWon()) {
            this.map.showWinningMessage();
            this.running = false;
            window.clearInterval(this.runinterval);
        }
        return true;
    };
    MapControls.prototype.vrun = function () {
        var _this = this;
        if (this.running) {
            this.map.vstep(this.worldState, this.map.getStepOptions, function () {
                _this.refresh();
                if (_this.map.hasWon()) {
                    _this.map.showWinningMessage();
                    _this.running = false;
                }
                else {
                    _this.vrun();
                }
            }, function () {
                _this.refresh();
                _this.running = false;
                if (_this.map.hasWon()) {
                    _this.map.showWinningMessage();
                }
            });
        }
    };
    return MapControls;
}());
var StateEvent;
(function (StateEvent) {
    StateEvent[StateEvent["NameChange"] = 0] = "NameChange";
    StateEvent[StateEvent["Removed"] = 1] = "Removed";
})(StateEvent || (StateEvent = {}));
;
var Map = /** @class */ (function () {
    function Map(width, height, canvas) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.initRobot();
    }
    Map.prototype.isStateless = function () {
        return false;
    };
    Map.prototype.hasWon = function () {
        return false;
    };
    Map.prototype.initRobot = function () {
        var start = this.generateRobotStart();
        this.robot = new Robot(start.x, start.y);
    };
    Map.prototype.generateRobotStart = function () {
        var rx = Math.floor(Math.random() * (this.width - 2)) + 1;
        var ry = Math.floor(Math.random() * (this.height - 2)) + 1;
        return { x: rx, y: ry };
    };
    Map.prototype.step = function (ws, options) {
        this.updateWorldState(ws, this.robot.getX(), this.robot.getY());
        if (!options) {
            options = this.getStepOptions();
        }
        return this.robot.step(this, ws, options);
    };
    Map.prototype.vstep = function (ws, options, thenCont, elseCont) {
        this.updateWorldState(ws, this.robot.getX(), this.robot.getY());
        if (!options) {
            options = this.getStepOptions();
        }
        return this.robot.vstep(this, ws, options, thenCont, elseCont);
    };
    Map.prototype.getRobot = function () {
        return this.robot;
    };
    Map.prototype.getCanvas = function () {
        return this.canvas;
    };
    Map.prototype.updateWorldState = function (ws, x, y) {
        var north = FieldState.Empty;
        if (y <= 1) {
            north = FieldState.Wall;
        }
        ws.setNorth(north);
        var east = FieldState.Empty;
        if (x >= this.width - 2) {
            east = FieldState.Wall;
        }
        ws.setEast(east);
        var south = FieldState.Empty;
        if (y >= this.height - 2) {
            south = FieldState.Wall;
        }
        ws.setSouth(south);
        var west = FieldState.Empty;
        if (x <= 1) {
            west = FieldState.Wall;
        }
        ws.setWest(west);
    };
    Map.prototype.isValidPos = function (x, y) {
        return (x >= 1 && y >= 1 && x < this.width - 1 && y < this.height - 1);
    };
    Map.prototype.draw = function () {
        var fog = document.getElementById("fogcheckbox").checked;
        var canvas = this.canvas;
        var ctx = canvas.getContext("2d");
        var cellwidth = Math.floor(canvas.width / this.width);
        var cellheight = Math.floor(canvas.height / this.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawContent(ctx, cellwidth, cellheight);
        ctx.fillStyle = ROBOTCOLOR;
        ctx.beginPath();
        var rx = this.robot.getX() * cellwidth;
        var ry = this.robot.getY() * cellheight;
        ctx.ellipse(rx + cellwidth / 2, ry + cellheight / 2, cellwidth / 2, cellheight / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        if (fog == true) {
            drawFog(ctx, 0, 0, rx, ry);
            drawFog(ctx, 0, ry + cellheight, rx, canvas.height);
            drawFog(ctx, rx + cellwidth, 0, canvas.width, ry);
            drawFog(ctx, rx + cellwidth, ry + cellheight, canvas.width, canvas.height);
            drawFog(ctx, rx, 0, rx + cellwidth, ry - cellheight);
            drawFog(ctx, rx + cellwidth * 2, ry, canvas.width, ry + cellheight);
            drawFog(ctx, rx, ry + cellheight * 2, rx + cellwidth, canvas.height);
            drawFog(ctx, 0, ry, rx - cellwidth, ry + cellheight);
        }
    };
    Map.prototype.drawContent = function (ctx, cellwidth, cellheight) {
        //var canvas = this.canvas;
        //ctx.fillStyle = WALLCOLOR;
        //ctx.fillRect(0, 0, canvas.width, cellheight);
        //ctx.fillRect(0, 0, cellwidth, canvas.height);
        //ctx.fillRect(0, cellheight * (this.height - 1), canvas.width, canvas.height - (cellheight * (this.height - 1)));
        //ctx.fillRect(cellwidth * (this.width - 1), 0, canvas.width - (cellwidth * (this.width - 1)), canvas.height);
    };
    Map.prototype.getStepOptions = function () {
        return new StepOptions();
    };
    Map.prototype.reset = function () {
        var start = this.generateRobotStart();
        this.robot.setPos(start.x, start.y);
        this.robot.setState(this.robot.states[this.robot.statenames[0]]);
        this.draw();
    };
    Map.prototype.test = function (rcb) {
    };
    Map.prototype.showWinningMessage = function () {
    };
    Map.prototype.getName = function () {
        return "INVALID MAP";
    };
    return Map;
}());
var WallMap = /** @class */ (function (_super) {
    __extends(WallMap, _super);
    function WallMap(width, height, canvas, walls) {
        var _this = _super.call(this, width, height, canvas) || this;
        _this.walls = walls;
        return _this;
    }
    WallMap.prototype.drawContent = function (ctx, cellwidth, cellheight) {
        var canvas = this.canvas;
        ctx.fillStyle = WALLCOLOR;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.walls[x][y]) {
                    ctx.fillRect(x * cellwidth, y * cellheight, cellwidth, cellheight);
                }
            }
        }
    };
    WallMap.prototype.isValidPos = function (x, y) {
        return _super.prototype.isValidPos.call(this, x, y) && !this.walls[x][y];
    };
    WallMap.prototype.updateWorldState = function (ws, x, y) {
        var north = FieldState.Empty;
        if (this.walls[x][y - 1]) {
            north = FieldState.Wall;
        }
        ws.setNorth(north);
        var east = FieldState.Empty;
        if (this.walls[x + 1][y]) {
            east = FieldState.Wall;
        }
        ws.setEast(east);
        var south = FieldState.Empty;
        if (this.walls[x][y + 1]) {
            south = FieldState.Wall;
        }
        ws.setSouth(south);
        var west = FieldState.Empty;
        if (this.walls[x - 1][y]) {
            west = FieldState.Wall;
        }
        ws.setWest(west);
    };
    return WallMap;
}(Map));
var EmptyMap = /** @class */ (function (_super) {
    __extends(EmptyMap, _super);
    function EmptyMap(width, height, canvas) {
        var _this = this;
        var walls = [];
        for (var x = 0; x < width; x++) {
            walls[x] = [];
            for (var y = 0; y < height; y++) {
                if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
                    walls[x][y] = true;
                }
                else {
                    walls[x][y] = false;
                }
            }
        }
        _this = _super.call(this, width, height, canvas, walls) || this;
        return _this;
    }
    return EmptyMap;
}(WallMap));
function emptybools(width, height) {
    var bools = [];
    for (var x = 0; x < width; x++) {
        bools[x] = [];
        for (var y = 0; y < height; y++) {
            bools[x][y] = false;
        }
    }
    return bools;
}
var StartMap = /** @class */ (function (_super) {
    __extends(StartMap, _super);
    function StartMap(width, height, canvas, walls) {
        var _this = this;
        if (!walls) {
            walls = emptybools(width, height);
        }
        var maxdim = Math.min(width - 2, height) - 3;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
                    walls[x][y] = true;
                }
                else if ((x < width - 3 && x >= width - 3 - maxdim && y >= height - 1 - (x - (width - 3 - maxdim)))) {
                    walls[x][y] = true;
                }
            }
        }
        _this = _super.call(this, width, height, canvas, walls) || this;
        _this.winningDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("You reached the goal! Run tests to see if your program can handle some variations of this map, or go on to the next level!"));
        _this.winningDialog.appendChild(winp);
        return _this;
    }
    StartMap.prototype.isStateless = function () {
        return true;
    };
    StartMap.prototype.generateRobotStart = function () {
        var rx = Math.floor(Math.random() * 5) + 1;
        var ry = Math.floor(Math.random() * (6 - rx)) + 1;
        ry = Math.min(ry, 5);
        return { x: rx, y: this.height - 6 + ry };
    };
    StartMap.prototype.drawContent = function (ctx, cellwidth, cellheight) {
        _super.prototype.drawContent.call(this, ctx, cellwidth, cellheight);
        drawFinish(ctx, (this.width - 3) * cellwidth, (this.height - 2) * cellheight, (this.width - 2) * cellwidth, (this.height - 1) * cellheight);
    };
    StartMap.prototype.hasWon = function () {
        return this.robot.getX() == this.width - 3 && this.robot.getY() == this.height - 2;
    };
    StartMap.prototype.showWinningMessage = function () {
        if (this.winningDialog.parentNode == null) {
            document.body.appendChild(this.winningDialog);
        }
        $(this.winningDialog).dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Run Tests": function () {
                    $(this).dialog("close");
                },
                "Go to Next Level": function () {
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    };
    StartMap.prototype.getName = function () {
        return "First Steps";
    };
    return StartMap;
}(WallMap));
var DoorMap = /** @class */ (function (_super) {
    __extends(DoorMap, _super);
    function DoorMap(width, height, canvas, walls) {
        var _this = _super.call(this, width, height, canvas, DoorMap.doorwalls(width, height, walls)) || this;
        _this.winningDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("You reached the goal! Run tests to see if your program can handle some variations of this map, or go on to the next level!"));
        _this.winningDialog.appendChild(winp);
        return _this;
    }
    DoorMap.doorwalls = function (width, height, walls) {
        if (!walls) {
            walls = emptybools(width, height);
        }
        var doorheight = Math.floor(Math.random() * (height - 2)) + 1;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (x == 0 || y == 0 || y == height - 1) {
                    walls[x][y] = true;
                }
                else if (x == width - 3 && y != doorheight) {
                    walls[x][y] = true;
                }
            }
        }
        return walls;
    };
    DoorMap.prototype.generateRobotStart = function () {
        var rx = 3;
        var ry = Math.floor(this.height / 2) + 1;
        return { x: rx, y: ry };
    };
    DoorMap.prototype.reset = function () {
        this.walls = DoorMap.doorwalls(this.width, this.height);
        _super.prototype.reset.call(this);
    };
    DoorMap.prototype.drawContent = function (ctx, cellwidth, cellheight) {
        _super.prototype.drawContent.call(this, ctx, cellwidth, cellheight);
        drawFinish(ctx, this.canvas.width - cellwidth * 2, cellheight, this.canvas.width, this.canvas.height - cellheight);
    };
    DoorMap.prototype.hasWon = function () {
        return this.robot.getX() > this.width - 3;
    };
    DoorMap.prototype.showWinningMessage = function () {
        if (this.winningDialog.parentNode == null) {
            document.body.appendChild(this.winningDialog);
        }
        $(this.winningDialog).dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Run Tests": function () {
                    $(this).dialog("close");
                },
                "Go to Next Level": function () {
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    };
    DoorMap.prototype.getName = function () {
        return "Find the Door";
    };
    return DoorMap;
}(WallMap));
function mirror_set_v(walls, x, y, height) {
    walls[x][y] = true;
    walls[x][height - y - 1] = true;
}
var StateDoorMap = /** @class */ (function (_super) {
    __extends(StateDoorMap, _super);
    function StateDoorMap(width, height, canvas) {
        var _this = this;
        var walls = emptybools(width, height);
        mirror_set_v(walls, 5, 5, height);
        mirror_set_v(walls, 5, 4, height);
        mirror_set_v(walls, 5, 3, height);
        mirror_set_v(walls, 6, 3, height);
        mirror_set_v(walls, 7, 3, height);
        mirror_set_v(walls, 8, 3, height);
        mirror_set_v(walls, 8, 4, height);
        mirror_set_v(walls, 8, 5, height);
        mirror_set_v(walls, 5, 6, height);
        mirror_set_v(walls, 5, 7, height);
        mirror_set_v(walls, 5, 8, height);
        mirror_set_v(walls, 6, 8, height);
        mirror_set_v(walls, 7, 8, height);
        mirror_set_v(walls, 8, 8, height);
        mirror_set_v(walls, 9, 8, height);
        mirror_set_v(walls, 10, 8, height);
        mirror_set_v(walls, 11, 8, height);
        mirror_set_v(walls, 12, 8, height);
        mirror_set_v(walls, 12, 7, height);
        mirror_set_v(walls, 12, 6, height);
        mirror_set_v(walls, 12, 5, height);
        mirror_set_v(walls, 12, 4, height);
        mirror_set_v(walls, 12, 3, height);
        mirror_set_v(walls, 12, 2, height);
        mirror_set_v(walls, 12, 1, height);
        _this = _super.call(this, width, height, canvas, walls) || this;
        return _this;
    }
    return StateDoorMap;
}(DoorMap));
var MazeMap = /** @class */ (function (_super) {
    __extends(MazeMap, _super);
    function MazeMap(width, height, canvas) {
        var _this = this;
        if (width % 2 == 0) {
            width++;
        }
        if (height % 2 == 0) {
            height++;
        }
        var sws = MazeMap.mazewalls(width, height);
        _this = _super.call(this, width, height, canvas, sws.walls) || this;
        _this.starty = sws.starty;
        return _this;
    }
    MazeMap.mazewalls = function (width, height) {
        var walls = emptybools(width, height);
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (x % 2 == 0 || y % 2 == 0) {
                    walls[x][y] = true;
                }
            }
        }
        var inmaze = emptybools(width, height);
        var starty = Math.floor(Math.random() * Math.floor(height / 2)) * 2 + 1;
        var walllist = [];
        walls[0][starty] = false;
        inmaze[1][starty] = true;
        if (starty > 1) {
            walllist.push({ x: 1, y: starty - 1, cx: 1, cy: starty - 2 });
        }
        if (starty < height - 2) {
            walllist.push({ x: 1, y: starty + 1, cx: 1, cy: starty + 2 });
        }
        walllist.push({ x: 2, y: starty, cx: 3, cy: starty });
        while (walllist.length > 0) {
            var index = Math.floor(Math.random() * walllist.length);
            var x = walllist[index].x;
            var y = walllist[index].y;
            var cx = walllist[index].cx;
            var cy = walllist[index].cy;
            walllist.splice(index, 1);
            if (!inmaze[cx][cy]) {
                inmaze[cx][cy] = true;
                walls[x][y] = false;
                if (walls[cx + 1][cy] && cx < width - 2) {
                    walllist.push({ x: cx + 1, y: cy, cx: cx + 2, cy: cy });
                }
                if (walls[cx - 1][cy] && cx > 1) {
                    walllist.push({ x: cx - 1, y: cy, cx: cx - 2, cy: cy });
                }
                if (walls[cx][cy + 1] && cy < height - 2) {
                    walllist.push({ x: cx, y: cy + 1, cx: cx, cy: cy + 2 });
                }
                if (walls[cx][cy - 1] && cy > 1) {
                    walllist.push({ x: cx, y: cy - 1, cx: cx, cy: cy - 2 });
                }
            }
        }
        return { walls: walls, starty: starty };
    };
    MazeMap.prototype.reset = function () {
        var sws = MazeMap.mazewalls(this.width, this.height);
        this.walls = sws.walls;
        this.starty = sws.starty;
        _super.prototype.reset.call(this);
    };
    MazeMap.prototype.generateRobotStart = function () {
        var rx = (Math.floor(Math.random() * Math.floor(this.width / 2)) * 2) + 1;
        var ry = (Math.floor(Math.random() * Math.floor(this.height / 2)) * 2) + 1;
        return { x: rx, y: ry };
    };
    MazeMap.prototype.drawContent = function (ctx, cellwidth, cellheight) {
        _super.prototype.drawContent.call(this, ctx, cellwidth, cellheight);
        drawFinish(ctx, 0, this.starty * cellwidth, cellwidth, this.starty * cellwidth + cellheight);
    };
    MazeMap.prototype.hasWon = function () {
        return this.robot.getX() == 0;
    };
    MazeMap.prototype.getName = function () {
        return "Maze";
    };
    return MazeMap;
}(WallMap));
//# sourceMappingURL=Map.js.map