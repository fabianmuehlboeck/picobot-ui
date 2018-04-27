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
    function MapControls(pico, canvasParent, controlParent, editorDiv, codeDiv, helpDiv) {
        var _this = this;
        this._isrunning = false;
        this.testabort = null;
        var mc = this;
        this.pico = pico;
        this.running = false;
        this.canvasParent = canvasParent;
        this.editorDiv = editorDiv;
        this.codeDiv = document.createElement("div");
        var codecontroldiv = document.createElement("div");
        codecontroldiv.classList.add("codecontrol");
        var loadbutton = document.createElement("button");
        loadbutton.appendChild(document.createTextNode("Load from Editor"));
        loadbutton.addEventListener("click", function () {
            var pp = PicoProgram.fromEditor(_this.map.getRobot());
            _this.map.getPicoCodeBox().textContent = pp.program.toText().join("\n");
            _this.map.getPicoErrorTextBox().textContent = pp.errors.map(function (e, n, a) { return e.message; }).join("\n");
        });
        codecontroldiv.appendChild(loadbutton);
        var compilebutton = document.createElement("button");
        compilebutton.appendChild(document.createTextNode("Compile to Editor"));
        compilebutton.addEventListener("click", function () {
            var pp = PicoProgram.parse(_this.map.getPicoCodeBox().textContent.split("\n"));
            if (pp.errors.length == 0) {
                var robot = pp.program.toEditor();
                robot.setPos(_this.map.getRobot().getX(), _this.map.getRobot().getY());
                _this.map.setRobot(robot);
                _this.setMap(_this.map);
                _this.map.getPicoErrorTextBox().textContent = "Program successfully loaded to the robot.";
            }
            else {
                _this.map.getPicoErrorTextBox().textContent = "There were errors, so the program has not been loaded to the robot.\n\n" + pp.errors.map(function (e, n, a) { return e.message; }).join("\n");
            }
        });
        codecontroldiv.appendChild(compilebutton);
        codeDiv.appendChild(codecontroldiv);
        codeDiv.appendChild(this.codeDiv);
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
        this.stepfastbutton = document.createElement("button");
        this.stepfastbutton.appendChild(document.createTextNode("Step"));
        this.stepfastbutton.addEventListener("click", function () {
            _this.stepFast();
        });
        simplerundiv.appendChild(this.stepfastbutton);
        this.runfastbutton = document.createElement("button");
        this.runfastbutton.appendChild(document.createTextNode("Run"));
        this.runfastbutton.addEventListener("click", function () {
            _this.runFast();
        });
        simplerundiv.appendChild(this.runfastbutton);
        this.testfastbutton = document.createElement("button");
        this.testfastbutton.appendChild(document.createTextNode("Test"));
        this.testfastbutton.addEventListener("click", function () {
            _this.testFast();
        });
        simplerundiv.appendChild(this.testfastbutton);
        var visualizerundiv = document.createElement("div");
        visualizerundiv.appendChild(document.createTextNode("VISUALIZE"));
        this.stepvisualbutton = document.createElement("button");
        this.stepvisualbutton.appendChild(document.createTextNode("Step"));
        this.stepvisualbutton.addEventListener("click", function () {
            _this.stepVisual();
        });
        visualizerundiv.appendChild(this.stepvisualbutton);
        this.runvisualbutton = document.createElement("button");
        this.runvisualbutton.appendChild(document.createTextNode("Run"));
        this.runvisualbutton.addEventListener("click", function () {
            _this.runVisual();
        });
        visualizerundiv.appendChild(this.runvisualbutton);
        this.testvisualbutton = document.createElement("button");
        this.testvisualbutton.appendChild(document.createTextNode("Test"));
        this.testvisualbutton.addEventListener("click", function () {
            _this.testVisual();
        });
        visualizerundiv.appendChild(this.testvisualbutton);
        runProgramDiv.appendChild(simplerundiv);
        runProgramDiv.appendChild(visualizerundiv);
        var stopbutton = document.createElement("button");
        stopbutton.appendChild(document.createTextNode("Stop"));
        stopbutton.addEventListener("click", function () {
            _this.stopRun();
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
        var resetrobotbutton = document.createElement("button");
        resetrobotbutton.appendChild(document.createTextNode("Reset Robot"));
        resetrobotbutton.addEventListener("click", function () {
            mc.map.getRobot().reset();
            mc.refresh();
        });
        scenariodiv.appendChild(resetrobotbutton);
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
        this.testSuccessDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("All tests succeeded!"));
        this.testSuccessDialog.appendChild(winp);
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
        while (this.codeDiv.childNodes.length > 0) {
            this.codeDiv.removeChild(this.codeDiv.childNodes[0]);
        }
        this.codeDiv.appendChild(map.getPicoCodeBox());
        this.codeDiv.appendChild(map.getPicoErrorTextBox());
        this.refresh();
    };
    MapControls.prototype.stepFast = function () {
        var _this = this;
        if (this.running == false) {
            if (this.map.hasWon()) {
                this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
            }
            else {
                this.step();
                if (this.map.hasWon()) {
                    this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
                }
            }
        }
    };
    MapControls.prototype.runFast = function () {
        var _this = this;
        if (this.running == false) {
            if (this.map.hasWon()) {
                this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
            }
            else {
                this.running = true;
                this.runfastbutton.classList.add("runningbutton");
                this.runinterval = window.setInterval(function () { _this.run(); }, 50);
            }
        }
    };
    MapControls.prototype.testFast = function () {
        var _this = this;
        if (!this.running) {
            this.running = true;
            this.testfastbutton.classList.add("runningbutton");
            this.testabort = this.map.test(function () { _this.refresh(); }, this.worldState, function (success) { if (success) {
                _this.showTestSuccessMessage();
            }
            else {
                alert("Test failed! Robot is stuck!");
            } }, function () {
                _this.running = false;
                _this.testabort = null;
            });
            if (!this.running) {
                this.testabort = null;
            }
        }
    };
    MapControls.prototype.stepVisual = function () {
        var _this = this;
        if (this.running == false) {
            if (this.map.hasWon()) {
                this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
            }
            else {
                this.running = true;
                this.stepvisualbutton.classList.add("runningbutton");
                this.vstep();
            }
        }
    };
    MapControls.prototype.runVisual = function () {
        var _this = this;
        if (this.running == false) {
            if (this.map.hasWon()) {
                this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
            }
            else {
                this.running = true;
                this.runvisualbutton.classList.add("runningbutton");
                this.vrun();
            }
        }
    };
    MapControls.prototype.testVisual = function () {
        var _this = this;
        if (!this.running) {
            this.running = true;
            this.testvisualbutton.classList.add("runningbutton");
            this.testabort = this.map.vtest(function () { _this.refresh(); }, this.worldState, function (success) { if (success) {
                _this.showTestSuccessMessage();
            }
            else {
                alert("Test failed! Robot is stuck!");
            } }, function () {
                _this.running = false;
                _this.testabort = null;
            });
            if (!this.running) {
                this.testabort = null;
            }
        }
    };
    MapControls.prototype.stopRun = function (cont) {
        if (cont === void 0) { cont = function () { }; }
        if (this.running == true) {
            if (this.testabort != null) {
                this.testabort(cont);
                this.testabort = null;
            }
            else {
                this.running = false;
            }
        }
        else {
            cont();
        }
    };
    MapControls.prototype.showTestSuccessMessage = function () {
        if (this.testSuccessDialog.parentNode == null) {
            document.body.appendChild(this.testSuccessDialog);
        }
        var mc = this;
        $(this.testSuccessDialog).dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Go to Next Level": function () {
                    mc.pico.nextMap();
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
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
                _this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
            }
        }, function () {
            _this.refresh();
            if (_this.map.hasWon()) {
                _this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
            }
            _this.running = false;
        });
    };
    MapControls.prototype.run = function () {
        var _this = this;
        if (this.running && !this.step()) {
            this.running = false;
            window.clearInterval(this.runinterval);
            return false;
        }
        if (this.map.hasWon()) {
            this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
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
                    _this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
                    _this.running = false;
                }
                else {
                    _this.vrun();
                }
            }, function () {
                _this.refresh();
                _this.running = false;
                if (_this.map.hasWon()) {
                    _this.map.showWinningMessage(function () { _this.stopRun(function () { return _this.testFast(); }); }, function () { _this.pico.nextMap(); });
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
    function Map(width, height, canvas, name) {
        this.picocodebox = document.createElement("textarea");
        this.picocodeerrorbox = document.createElement("textarea");
        this.testing = false;
        this.testingDone = true;
        this.testRun = 0;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.name = name;
        this.picocodebox.classList.add("picocode");
        this.picocodeerrorbox.classList.add("picoerrors");
        this.picocodeerrorbox.readOnly = true;
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
    Map.prototype.getPicoCodeBox = function () {
        return this.picocodebox;
    };
    Map.prototype.getPicoErrorTextBox = function () {
        return this.picocodeerrorbox;
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
    Map.prototype.setRobot = function (robot) {
        this.robot = robot;
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
        this.robot.reset();
        this.draw();
    };
    Map.prototype.isTesting = function () { return this.testing; };
    Map.prototype.test = function (refreshcb, ws, donecb, finishedcb) {
        var _this = this;
        if (this.testingDone == false) {
            alert("Tests still running");
            finishedcb();
            return null;
        }
        this.testingDone = false;
        this.testing = true;
        this.testRun++;
        var runid = this.testRun;
        if (!this.setupTest()) {
            alert("This map has no tests.");
            this.testingDone = true;
            this.testing = false;
            finishedcb();
            return function (cont) { cont(); };
        }
        refreshcb();
        this.draw();
        var options = this.getStepOptions();
        this.testInterval = window.setInterval(function () {
            if (_this.testing == true && runid == _this.testRun) {
                _this.updateWorldState(ws, _this.robot.getX(), _this.robot.getY());
                if (_this.hasWon()) {
                    if (!_this.handleTestWin()) {
                        window.clearInterval(_this.testInterval);
                        _this.testing = false;
                        _this.testingDone = true;
                        donecb(true);
                        finishedcb();
                        return;
                    }
                }
                if (!_this.robot.step(_this, ws, options)) {
                    window.clearInterval(_this.testInterval);
                    _this.testing = false;
                    _this.testingDone = true;
                    donecb(false);
                    finishedcb();
                }
                refreshcb();
            }
        }, 10);
        return function (cont) {
            _this.testing = false;
            _this.testingDone = true;
            window.clearInterval(_this.testInterval);
            finishedcb();
            cont();
        };
    };
    Map.prototype.vtest = function (refreshcb, ws, donecb, finishedcb) {
        var _this = this;
        if (this.testingDone == false) {
            alert("Tests already running");
            finishedcb();
            return null;
        }
        this.testingDone = false;
        this.testing = true;
        this.testRun++;
        var runid = this.testRun;
        if (!this.setupTest()) {
            alert("This map has no tests.");
            this.testingDone = true;
            this.testing = false;
            finishedcb();
            return null;
        }
        var continuation = function () { };
        var options = this.getStepOptions();
        var vstepfun = function () {
            refreshcb();
            if (_this.hasWon()) {
                if (!_this.handleTestWin()) {
                    _this.testing = false;
                    _this.testingDone = true;
                    donecb(true);
                    finishedcb();
                    continuation();
                    return;
                }
            }
            if (_this.testing == true && runid == _this.testRun) {
                _this.vstep(ws, options, vstepfun, function () {
                    _this.testing = false;
                    _this.testingDone = true;
                    donecb(false);
                    finishedcb();
                    continuation();
                });
            }
            else {
                _this.testingDone = true;
                finishedcb();
                continuation();
            }
        };
        vstepfun();
        return function (cont) { continuation = cont; _this.testing = false; };
    };
    Map.prototype.getName = function () {
        return this.name;
    };
    return Map;
}());
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
var WallMap = /** @class */ (function (_super) {
    __extends(WallMap, _super);
    function WallMap(width, height, canvas, name) {
        var _this = _super.call(this, width, height, canvas, name) || this;
        _this.testNumber = 99;
        _this.initWalls();
        return _this;
    }
    WallMap.prototype.initWalls = function () {
        this.walls = emptybools(this.width, this.height);
    };
    WallMap.prototype.surroundingWalls = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1) {
                    this.walls[x][y] = true;
                }
            }
        }
    };
    WallMap.prototype.reset = function () {
        this.initWalls();
        _super.prototype.reset.call(this);
    };
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
    WallMap.prototype.setupTest = function () {
        this.robot.reset();
        this.testNumber = 0;
        var tss = this.getTestSetups();
        if (tss.length > 0) {
            tss[0]();
            return true;
        }
        else {
            return false;
        }
    };
    WallMap.prototype.handleTestWin = function () {
        this.testNumber++;
        var tss = this.getTestSetups();
        if (this.testNumber < tss.length) {
            this.robot.reset();
            tss[this.testNumber]();
            return true;
        }
        return false;
    };
    return WallMap;
}(Map));
var CleanMap = /** @class */ (function (_super) {
    __extends(CleanMap, _super);
    function CleanMap(width, height, canvas, name) {
        var _this = _super.call(this, width, height, canvas, name) || this;
        _this.cleanedSquares = emptybools(width, height);
        _this.winningDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("You cleaned the whole room! Run tests to see if your program can handle some different starting locations for the robot, or go on to the next level!"));
        _this.winningDialog.appendChild(winp);
        return _this;
    }
    CleanMap.prototype.allCleaned = function () {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (!(this.cleanedSquares[i][j] || this.walls[i][j])) {
                    return false;
                }
            }
        }
    };
    CleanMap.prototype.drawContent = function (ctx, cellwidth, cellheight) {
        _super.prototype.drawContent.call(this, ctx, cellwidth, cellheight);
        ctx.fillStyle = "#dddddd";
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.cleanedSquares[i][j]) {
                    ctx.fillRect(i * cellwidth, j * cellheight, cellwidth, cellheight);
                }
            }
        }
    };
    CleanMap.prototype.hasWon = function () {
        return this.allCleaned();
    };
    CleanMap.prototype.showWinningMessage = function (runtests, nextmap) {
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
                    runtests();
                },
                "Go to Next Level": function () {
                    $(this).dialog("close");
                    nextmap();
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    };
    return CleanMap;
}(WallMap));
var GoalMap = /** @class */ (function (_super) {
    __extends(GoalMap, _super);
    function GoalMap(width, height, canvas, name) {
        var _this = _super.call(this, width, height, canvas, name) || this;
        _this.winningDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("You reached the goal! Run tests to see if your program can handle all requirements of the map, or go on to the next level!"));
        _this.winningDialog.appendChild(winp);
        return _this;
    }
    GoalMap.prototype.hasWon = function () {
        var gz = this.getGoalZones();
        var rx = this.robot.getX();
        var ry = this.robot.getY();
        for (var i = 0; i < gz.length; i++) {
            if (rx >= gz[i].sx && rx <= gz[i].ex && ry >= gz[i].sy && ry <= gz[i].ey) {
                return true;
            }
        }
        return false;
    };
    GoalMap.prototype.drawContent = function (ctx, cellwidth, cellheight) {
        _super.prototype.drawContent.call(this, ctx, cellwidth, cellheight);
        var gz = this.getGoalZones();
        for (var i = 0; i < gz.length; i++) {
            drawFinish(ctx, gz[i].sx * cellwidth, gz[i].sy * cellheight, (gz[i].ex + 1) * cellwidth, (gz[i].ey + 1) * cellheight);
        }
    };
    GoalMap.prototype.showWinningMessage = function (runtests, nextmap) {
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
                    runtests();
                },
                "Go to Next Level": function () {
                    $(this).dialog("close");
                    nextmap();
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    };
    return GoalMap;
}(WallMap));
//class EmptyMap extends WallMap {
//    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
//        var walls: boolean[][] = [];
//        for (var x = 0; x < width; x++) {
//            walls[x] = [];
//            for (var y = 0; y < height; y++) {
//                if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
//                    walls[x][y] = true;
//                }
//                else {
//                    walls[x][y] = false;
//                }
//            }
//        }
//        super(width, height, canvas);
//    }
//    initWalls()
//    handleTestWin(): boolean {
//        return false;
//    }
//}
var SpiralMap = /** @class */ (function (_super) {
    __extends(SpiralMap, _super);
    function SpiralMap(width, height, canvas) {
        var _this = _super.call(this, width, height, canvas, "Spirals") || this;
        _this.robot.addState("State");
        return _this;
    }
    SpiralMap.prototype.initWalls = function () {
        _super.prototype.initWalls.call(this);
        this.surroundingWalls();
        var x = 1;
        var y = this.height - 5;
        var left = 0;
        var right = this.width - 1;
        var top = 0;
        var bottom = y;
        while (left <= right && top <= bottom) {
            right -= 4;
            while (x < right) {
                this.walls[x][y] = true;
                x++;
            }
            top += 4;
            while (y > top) {
                this.walls[x][y] = true;
                y--;
            }
            left += 4;
            while (x > left) {
                this.walls[x][y] = true;
                x--;
            }
            bottom -= 4;
            while (y < bottom) {
                this.walls[x][y] = true;
                y++;
            }
        }
        this.left = left - 3;
        this.top = top - 3;
        this.bottom = bottom + 3;
        this.right = right - 1;
    };
    SpiralMap.prototype.isStateless = function () {
        return true;
    };
    SpiralMap.prototype.generateRobotStart = function () {
        var rx = 1;
        var ry = this.height - 2;
        return { x: rx, y: ry };
    };
    SpiralMap.prototype.getGoalZones = function () {
        return [{ sx: this.left, sy: this.top, ex: this.right, ey: this.bottom }];
    };
    SpiralMap.prototype.getTestSetups = function () {
        var _this = this;
        return [function () { _this.robot.setPos(1, _this.height - 2); }];
    };
    return SpiralMap;
}(GoalMap));
var StartMap = /** @class */ (function (_super) {
    __extends(StartMap, _super);
    function StartMap(width, height, canvas) {
        var _this = _super.call(this, width, height, canvas, "First Steps") || this;
        _this.robot.addState("State");
        return _this;
    }
    StartMap.prototype.initWalls = function () {
        _super.prototype.initWalls.call(this);
        this.surroundingWalls();
        var maxdim = Math.min(this.width, this.height) - 3;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if ((x < this.width && x >= this.width - 3 - maxdim && y >= this.height - 1 - (x - (this.width - maxdim)))) {
                    this.walls[x][y] = true;
                }
            }
        }
    };
    StartMap.prototype.isStateless = function () {
        return true;
    };
    StartMap.prototype.generateRobotStart = function () {
        var rx = Math.floor(Math.random() * 5) + 1;
        var ry = Math.floor(Math.random() * (6 - rx)) + 1;
        ry = Math.min(ry, 5);
        return { x: rx, y: this.height - 6 + ry };
    };
    StartMap.prototype.getGoalZones = function () {
        var maxdim = Math.min(this.width, this.height) - 3;
        return [{ sx: this.width - 2, sy: this.height - maxdim, ex: this.width - 2, ey: this.height - maxdim }];
    };
    StartMap.prototype.getTestSetups = function () {
        var _this = this;
        var maxdim = Math.min(this.width, this.height) - 3;
        return [function () { _this.robot.setPos(1, _this.height - 2); }, function () { _this.robot.setPos(2, _this.height - 3), _this.robot.setPos(_this.width - maxdim, _this.height - 4); }];
    };
    return StartMap;
}(GoalMap));
var ObstacleMap = /** @class */ (function (_super) {
    __extends(ObstacleMap, _super);
    function ObstacleMap(width, height, canvas) {
        return _super.call(this, width, height, canvas, "Obstacles") || this;
    }
    ObstacleMap.prototype.initWalls = function () {
        _super.prototype.initWalls.call(this);
        this.surroundingWalls();
        var halfwidth = Math.ceil(this.width / 2);
        var halfheight = Math.floor(this.height / 2);
        var obstacleheight = halfheight - 2;
        for (var i = 1; i < obstacleheight; i++) {
            this.walls[halfwidth][i] = true;
            this.walls[halfwidth][this.height - i - 1] = true;
        }
    };
    ObstacleMap.prototype.generateRobotStart = function () {
        var rx = 1;
        var ry = this.height - 2;
        return { x: rx, y: ry };
    };
    ObstacleMap.prototype.getGoalZones = function () {
        return [{ sx: this.width - 2, sy: this.height - 2, ex: this.width - 2, ey: this.height - 2 }];
    };
    ObstacleMap.prototype.getTestSetups = function () {
        var _this = this;
        return [function () { _this.robot.setPos(1, _this.height - 2); }];
    };
    return ObstacleMap;
}(GoalMap));
var DoorMap = /** @class */ (function (_super) {
    __extends(DoorMap, _super);
    function DoorMap(width, height, canvas) {
        return _super.call(this, width, height, canvas, "Find the Door") || this;
    }
    DoorMap.prototype.initWalls = function () {
        this.initDoorWalls(Math.floor(Math.random() * (this.height - 2)) + 1);
    };
    DoorMap.prototype.initDoorWalls = function (doorheight) {
        this.walls = emptybools(this.width, this.height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x == 0 || y == 0 || y == this.height - 1) {
                    this.walls[x][y] = true;
                }
                else if (x == this.width - 3 && y != doorheight) {
                    this.walls[x][y] = true;
                }
            }
        }
    };
    DoorMap.prototype.generateRobotStart = function () {
        var rx = 3;
        var ry = Math.floor(this.height / 2) + 1;
        return { x: rx, y: ry };
    };
    DoorMap.prototype.getGoalZones = function () {
        return [{ sx: this.width - 2, sy: 1, ex: this.width - 1, ey: this.height - 2 }];
    };
    DoorMap.prototype.getTestSetups = function () {
        var _this = this;
        var rs = this.generateRobotStart();
        return [function () { _this.robot.setPos(rs.x, rs.y); _this.initDoorWalls(1); },
            function () { _this.robot.setPos(rs.x, rs.y); _this.initDoorWalls(rs.y - 3); },
            function () { _this.robot.setPos(rs.x, rs.y); _this.initDoorWalls(rs.y); },
            function () { _this.robot.setPos(rs.x, rs.y); _this.initDoorWalls(rs.y + 3); },
            function () { _this.robot.setPos(rs.x, rs.y); _this.initDoorWalls(_this.height - 2); }];
    };
    return DoorMap;
}(GoalMap));
function mirror_set_v(walls, x, y, height) {
    walls[x][y] = true;
    walls[x][height - y - 1] = true;
}
//class StateDoorMap extends DoorMap {
//    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
//        var walls: boolean[][] = emptybools(width, height);
//        mirror_set_v(walls, 5, 5, height);
//        mirror_set_v(walls, 5, 4, height);
//        mirror_set_v(walls, 5, 3, height);
//        mirror_set_v(walls, 6, 3, height);
//        mirror_set_v(walls, 7, 3, height);
//        mirror_set_v(walls, 8, 3, height);
//        mirror_set_v(walls, 8, 4, height);
//        mirror_set_v(walls, 8, 5, height);
//        mirror_set_v(walls, 5, 6, height);
//        mirror_set_v(walls, 5, 7, height);
//        mirror_set_v(walls, 5, 8, height);
//        mirror_set_v(walls, 6, 8, height);
//        mirror_set_v(walls, 7, 8, height);
//        mirror_set_v(walls, 8, 8, height);
//        mirror_set_v(walls, 9, 8, height);
//        mirror_set_v(walls, 10, 8, height);
//        mirror_set_v(walls, 11, 8, height);
//        mirror_set_v(walls, 12, 8, height);
//        mirror_set_v(walls, 12, 7, height);
//        mirror_set_v(walls, 12, 6, height);
//        mirror_set_v(walls, 12, 5, height);
//        mirror_set_v(walls, 12, 4, height);
//        mirror_set_v(walls, 12, 3, height);
//        mirror_set_v(walls, 12, 2, height);
//        mirror_set_v(walls, 12, 1, height);
//        super(width, height, canvas, walls);
//    }
//}
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
        //var sws = MazeMap.mazewalls(width, height);
        _this = _super.call(this, width, height, canvas, "Maze") || this;
        return _this;
    }
    MazeMap.prototype.initWalls = function () {
        _super.prototype.initWalls.call(this);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x % 2 == 0 || y % 2 == 0) {
                    this.walls[x][y] = true;
                }
            }
        }
        var inmaze = emptybools(this.width, this.height);
        this.starty = Math.floor(Math.random() * Math.floor(this.height / 2)) * 2 + 1;
        var walllist = [];
        this.walls[0][this.starty] = false;
        inmaze[1][this.starty] = true;
        if (this.starty > 1) {
            walllist.push({ x: 1, y: this.starty - 1, cx: 1, cy: this.starty - 2 });
        }
        if (this.starty < this.height - 2) {
            walllist.push({ x: 1, y: this.starty + 1, cx: 1, cy: this.starty + 2 });
        }
        walllist.push({ x: 2, y: this.starty, cx: 3, cy: this.starty });
        while (walllist.length > 0) {
            var index = Math.floor(Math.random() * walllist.length);
            var x = walllist[index].x;
            var y = walllist[index].y;
            var cx = walllist[index].cx;
            var cy = walllist[index].cy;
            walllist.splice(index, 1);
            if (!inmaze[cx][cy]) {
                inmaze[cx][cy] = true;
                this.walls[x][y] = false;
                if (this.walls[cx + 1][cy] && cx < this.width - 2) {
                    walllist.push({ x: cx + 1, y: cy, cx: cx + 2, cy: cy });
                }
                if (this.walls[cx - 1][cy] && cx > 1) {
                    walllist.push({ x: cx - 1, y: cy, cx: cx - 2, cy: cy });
                }
                if (this.walls[cx][cy + 1] && cy < this.height - 2) {
                    walllist.push({ x: cx, y: cy + 1, cx: cx, cy: cy + 2 });
                }
                if (this.walls[cx][cy - 1] && cy > 1) {
                    walllist.push({ x: cx, y: cy - 1, cx: cx, cy: cy - 2 });
                }
            }
        }
    };
    //reset() {
    //    var sws = MazeMap.mazewalls(this.width, this.height);
    //    this.walls = sws.walls;
    //    this.starty = sws.starty;
    //    super.reset();
    //}
    MazeMap.prototype.generateRobotStart = function () {
        var rx = (Math.floor(Math.random() * Math.floor(this.width / 2)) * 2) + 1;
        var ry = (Math.floor(Math.random() * Math.floor(this.height / 2)) * 2) + 1;
        return { x: rx, y: ry };
    };
    //drawContent(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
    //    super.drawContent(ctx, cellwidth, cellheight);
    //    drawFinish(ctx, 0, this.starty * cellwidth, cellwidth, this.starty * cellwidth + cellheight);
    //}
    //hasWon(): boolean {
    //    return this.robot.getX() == 0;
    //}
    MazeMap.prototype.getGoalZones = function () {
        return [{ sx: 0, sy: this.starty, ex: 0, ey: this.starty }];
    };
    MazeMap.prototype.getTestSetups = function () {
        var _this = this;
        return [function () { _this.robot.setPos(_this.width - 6, 5); }, function () { _this.robot.setPos(_this.width - 8, Math.floor(_this.height / 2) + ((Math.floor(_this.height / 2) % 2) - 1)); }];
    };
    return MazeMap;
}(GoalMap));
//# sourceMappingURL=Map.js.map