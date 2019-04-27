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
var ActionRobot = /** @class */ (function () {
    function ActionRobot(level, world) {
        var _this = this;
        this.factories = {};
        this.firstload = true;
        this.isTesting = false;
        this.isRunning = false;
        this.level = level;
        var rm = new RulesManager(this, this.isMultiRule());
        var moveForwardFactory = new MoveForwardActionFactory();
        var turnLeftFactory = new TurnLeftActionFactory();
        var turnRightFactory = new TurnRightActionFactory();
        this.rulesManager = rm;
        this.currentStep = this.getInitStep(world);
        this.firstStep = this.currentStep;
        this.addFactory(moveForwardFactory);
        this.addFactory(turnLeftFactory);
        this.addFactory(turnRightFactory);
        //rm.actionrepoul.appendChild(moveForwardFactory.actionli);
        //rm.actionrepoul.appendChild(turnLeftFactory.actionli);
        //rm.actionrepoul.appendChild(turnRightFactory.actionli);
        var rundiv = document.createElement("div");
        rundiv.classList.add("runcontrols");
        var stepforwardbutton = document.createElement("button");
        stepforwardbutton.classList.add("stepforwardbutton");
        var stepbackbutton = document.createElement("button");
        stepbackbutton.classList.add("stepbackbutton");
        stepbackbutton.disabled = true;
        var pausebutton = document.createElement("button");
        pausebutton.classList.add("pausebutton");
        pausebutton.disabled = true;
        var tostartbutton = document.createElement("button");
        tostartbutton.classList.add("tostartbutton");
        tostartbutton.disabled = true;
        var runbutton = document.createElement("button");
        runbutton.classList.add("runbutton");
        var fastforwardbutton = document.createElement("button");
        fastforwardbutton.classList.add("fastforwardbutton");
        var resetbutton = document.createElement("button");
        resetbutton.innerText = "Reset";
        resetbutton.classList.add("resetbutton");
        this.resetButton = resetbutton;
        var testbutton = document.createElement("button");
        testbutton.innerText = "Test";
        testbutton.classList.add("testbutton");
        this.testButton = testbutton;
        var robot = this;
        $(tostartbutton).on("click", function () { return _this.toStart(); });
        $(stepforwardbutton).on("click", function () { return _this.stepNext(); });
        $(stepbackbutton).on("click", function () { return _this.stepBack(); });
        $(pausebutton).on("click", function () { return _this.pause(); });
        $(runbutton).on("click", function () { return _this.run(); });
        $(fastforwardbutton).on("click", function () { return _this.runfast(); });
        $(resetbutton).on("click", function () { return _this.reset(); });
        $(testbutton).on("click", function () { return _this.test(); });
        rundiv.appendChild(tostartbutton);
        rundiv.appendChild(stepbackbutton);
        rundiv.appendChild(pausebutton);
        rundiv.appendChild(stepforwardbutton);
        rundiv.appendChild(runbutton);
        rundiv.appendChild(fastforwardbutton);
        rundiv.appendChild(resetbutton);
        rundiv.appendChild(testbutton);
        this.toStartButton = tostartbutton;
        this.backButton = stepbackbutton;
        this.pauseButton = pausebutton;
        this.stepButton = stepforwardbutton;
        this.runButton = runbutton;
        this.ffwdButton = fastforwardbutton;
        this.runDiv = rundiv;
        this.rulesDiv = document.createElement("div");
        var menuDiv = document.createElement("div");
        menuDiv.classList.add("robotmenu");
        this.rulesDiv.appendChild(menuDiv);
        this.rulesDiv.appendChild(this.rulesManager.getRulesDiv());
        var savebutton = document.createElement("button");
        savebutton.innerText = "Save";
        var loadbutton = document.createElement("button");
        loadbutton.innerText = "Load";
        loadbutton.disabled = (localStorage.getItem("mapcode:" + robot.level.getName()) == null);
        $(savebutton).on("click", function () {
            localStorage.setItem("mapcode:" + robot.level.getName(), robot.toText());
            loadbutton.disabled = false;
        });
        menuDiv.appendChild(savebutton);
        $(loadbutton).on("click", function () {
            robot.rulesManager.clear();
            robot.loadFromText(new StringStream(localStorage.getItem("mapcode:" + robot.level.getName())));
        });
        menuDiv.appendChild(loadbutton);
    }
    ActionRobot.prototype.isMultiRule = function () { return false; };
    ActionRobot.prototype.addFactory = function (factory) {
        if (!this.factories[factory.getId()]) {
            this.rulesManager.actionrepoul.appendChild(factory.getElement());
            this.factories[factory.getId()] = factory;
        }
    };
    ActionRobot.prototype.toBackground = function () {
        window.clearInterval(this.autosaveinterval);
        this.pause();
        this.guiDiv.removeChild(this.rulesDiv);
        this.guiDiv.removeChild(this.rulesManager.getActionRepoDiv());
        this.controlDiv.removeChild(this.runDiv);
    };
    ActionRobot.prototype.toForeground = function (guiDiv, controlDiv, mapcanvas) {
        var _this = this;
        if (this.firstload) {
            this.firstload = false;
            if (localStorage.getItem("automap:" + this.level.getName()) != null) {
                this.loadFromText(new StringStream(localStorage.getItem("automap:" + this.level.getName())));
            }
        }
        this.guiDiv = guiDiv;
        this.controlDiv = controlDiv;
        this.currentStep.getWorld().draw(mapcanvas);
        this.mapcanvas = mapcanvas;
        guiDiv.appendChild(this.rulesDiv);
        guiDiv.appendChild(this.rulesManager.getActionRepoDiv());
        controlDiv.appendChild(this.runDiv);
        if (this.getRules().length == 0) {
            this.rulesManager.addRule(this.addRule());
        }
        this.autosaveinterval = window.setInterval(function () {
            localStorage.setItem("automap:" + _this.level.getName(), _this.toText());
        }, 10000);
    };
    ActionRobot.prototype.getRules = function () { return this.rulesManager.getRules(); };
    ActionRobot.prototype.addRule = function () {
        var rule = new ActionRule();
        return rule;
    };
    ActionRobot.prototype.getInitStep = function (world) {
        return new SimpleInitStep(this, world);
    };
    ActionRobot.prototype.getWorld = function () {
        return this.currentStep.getWorld();
    };
    ActionRobot.prototype.setWorld = function (world) {
        this.firstStep = this.getInitStep(world);
        this.toStart();
    };
    ActionRobot.prototype.setCurrentStep = function (step) {
        if (step != this.currentStep) {
            this.currentStep.exit();
            this.currentStep = step;
            this.updateButtons();
            this.currentStep.enter();
        }
    };
    ActionRobot.prototype.getFactory = function (key) {
        return this.factories[key];
    };
    ActionRobot.prototype.reset = function () {
        this.isRunning = false;
        this.isTesting = false;
        this.setWorld(this.level.resetWorld());
    };
    ActionRobot.prototype.test = function () {
        var _this = this;
        if (this.isRunning) {
            this.isRunning = false;
            window.clearInterval(this.runInterval);
        }
        this.isTesting = true;
        this.updateButtons();
        var testbanner = document.createElement("div");
        var testbannermsgdiv = document.createElement("div");
        var testbannerspan = document.createElement("span");
        testbannerspan.innerText = "Running tests ...";
        testbanner.classList.add("testbanner");
        testbannermsgdiv.appendChild(testbannerspan);
        var testabortbutton = document.createElement("button");
        testabortbutton.innerText = "Abort";
        $(testabortbutton).on("click", function () {
            window.clearInterval(_this.runInterval);
            _this.isTesting = false;
            testbanner.parentNode.removeChild(testbanner);
            _this.updateButtons();
        });
        testbannermsgdiv.appendChild(testabortbutton);
        testbanner.appendChild(testbannermsgdiv);
        document.body.appendChild(testbanner);
        var testmaps = this.level.getTestMaps();
        var testmapindex = 0;
        this.setWorld(testmaps[0]);
        this.runInterval = window.setInterval(function () {
            if (!_this.isTesting) {
                window.clearInterval(_this.runInterval);
            }
            if (testmapindex < testmaps.length) {
                if (_this.currentStep.hasSuccessor()) {
                    var steps = 0;
                    var curx = _this.currentStep.getWorld().getX();
                    var cury = _this.currentStep.getWorld().getY();
                    var curdir = _this.currentStep.getWorld().getDirection();
                    while (_this.currentStep.hasSuccessor() && steps < 1000 && curx == _this.currentStep.getWorld().getX() && cury == _this.currentStep.getWorld().getY() && curdir == _this.currentStep.getWorld().getDirection()) {
                        _this.setCurrentStep(_this.currentStep.getSuccessor());
                        _this.currentStep.getWorld().draw(_this.mapcanvas);
                        steps++;
                    }
                    if (steps == 1000) {
                        window.clearInterval(_this.runInterval);
                        _this.isTesting = false;
                        testbanner.parentNode.removeChild(testbanner);
                        var dialogdiv = document.createElement("div");
                        dialogdiv.innerText = "Test ran too long without any movement!";
                        document.body.appendChild(dialogdiv);
                        $(dialogdiv).dialog({ modal: true, close: function () { dialogdiv.parentNode.removeChild(dialogdiv); } });
                        _this.updateButtons();
                    }
                }
                else {
                    if (_this.currentStep.isError()) {
                        window.clearInterval(_this.runInterval);
                        _this.isTesting = false;
                        testbanner.parentNode.removeChild(testbanner);
                        var dialogdiv = document.createElement("div");
                        dialogdiv.innerText = "Test failed!";
                        document.body.appendChild(dialogdiv);
                        $(dialogdiv).dialog({ modal: true, close: function () { dialogdiv.parentNode.removeChild(dialogdiv); } });
                        _this.updateButtons();
                    }
                    else {
                        testmapindex++;
                        if (testmapindex < testmaps.length) {
                            _this.setWorld(testmaps[testmapindex]);
                        }
                    }
                }
            }
            else {
                window.clearInterval(_this.runInterval);
                _this.isTesting = false;
                testbanner.parentNode.removeChild(testbanner);
                var successdialog = document.createElement("div");
                successdialog.innerText = "All tests succeeded!";
                document.body.appendChild(successdialog);
                $(successdialog).dialog({
                    resizable: false, height: "auto", width: 400, modal: true, buttons: {
                        "Go to Next Level": function () {
                            $(successdialog).dialog("close");
                            Pico.getInstance().nextLevel();
                        },
                        Cancel: function () {
                            $(successdialog).dialog("close");
                        }
                    },
                    close: function () { successdialog.parentNode.removeChild(successdialog); }
                });
                _this.updateButtons();
            }
        }, 1);
    };
    ActionRobot.prototype.updateButtons = function () {
        this.toStartButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasPredecessor();
        this.backButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasPredecessor();
        this.pauseButton.disabled = !this.isRunning;
        this.stepButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasSuccessor();
        this.runButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasSuccessor();
        this.ffwdButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasSuccessor();
        this.testButton.disabled = this.isTesting;
        if (this.isRunning || this.isTesting) {
            $(".guicontainer .ui-sortable").sortable("disable");
            $(".guicontainer .ui-draggable").draggable("disable");
            $(".guicontainer button").each(function (i, elem) {
                elem.disabled = true;
            });
            $(".guicontainer .ui-sortable").each(function (i, elem) {
                elem.classList.add("disabledwhilerunning");
            });
            $(".guicontainer .ui-draggable").each(function (i, elem) {
                elem.classList.add("disabledwhilerunning");
            });
        }
        else {
            $(".guicontainer .ui-sortable").sortable("enable");
            $(".guicontainer .ui-draggable").draggable("enable");
            $(".guicontainer button").each(function (i, elem) {
                elem.disabled = false;
            });
            $(".guicontainer .ui-sortable").each(function (i, elem) {
                elem.classList.remove("disabledwhilerunning");
            });
            $(".guicontainer .ui-draggable").each(function (i, elem) {
                elem.classList.remove("disabledwhilerunning");
            });
        }
    };
    ActionRobot.prototype.toStart = function () {
        this.setCurrentStep(this.firstStep);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return this.currentStep;
    };
    ActionRobot.prototype.stepBack = function () {
        var next = this.currentStep.getPredecessor();
        this.setCurrentStep(next);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return next;
    };
    ActionRobot.prototype.stepNext = function () {
        var next = this.currentStep.getSuccessor();
        this.setCurrentStep(next);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return next;
    };
    ActionRobot.prototype.pause = function () {
        if (this.isRunning) {
            this.isRunning = false;
            window.clearInterval(this.runInterval);
        }
        this.updateButtons();
    };
    ActionRobot.prototype.runAtSpeed = function (speed) {
        var _this = this;
        this.isRunning = true;
        this.updateButtons();
        this.runInterval = window.setInterval(function () {
            if (_this.isRunning) {
                var next = _this.currentStep.getSuccessor();
                if (next.isError() || !next.hasSuccessor()) {
                    _this.pause();
                }
                _this.setCurrentStep(next);
                _this.currentStep.getWorld().draw(_this.mapcanvas);
            }
            else {
                window.clearInterval(_this.runInterval);
                _this.updateButtons();
            }
        }, speed);
    };
    ActionRobot.prototype.run = function () {
        this.runAtSpeed(200);
    };
    ActionRobot.prototype.runfast = function () {
        this.runAtSpeed(20);
    };
    ActionRobot.prototype.toText = function () { return this.rulesManager.toText(); };
    ActionRobot.prototype.loadFromText = function (stream) { this.rulesManager.loadFromText(stream, this); };
    ;
    return ActionRobot;
}());
var SensorRobot = /** @class */ (function (_super) {
    __extends(SensorRobot, _super);
    function SensorRobot(level, world) {
        var _this = _super.call(this, level, world) || this;
        _this.sensorDiv = document.createElement("div");
        _this.sensorDiv.classList.add("robotcontrolsensor");
        var sensordivheading = document.createElement("span");
        sensordivheading.innerText = "Robot sees:";
        _this.sensorDiv.appendChild(sensordivheading);
        _this.sensorCanvas = document.createElement("canvas");
        _this.sensorCanvas.width = 144;
        _this.sensorCanvas.height = 96;
        _this.sensorDiv.appendChild(_this.sensorCanvas);
        return _this;
    }
    SensorRobot.prototype.getInitStep = function (world) {
        return new InitStep(this, world);
    };
    SensorRobot.prototype.isMultiRule = function () { return true; };
    SensorRobot.prototype.addRule = function () {
        var rule = new SensorRule();
        return rule;
    };
    SensorRobot.prototype.toBackground = function () {
        _super.prototype.toBackground.call(this);
        this.controlDiv.removeChild(this.sensorDiv);
    };
    SensorRobot.prototype.toForeground = function (guiDiv, controlDiv, mapcanvas) {
        _super.prototype.toForeground.call(this, guiDiv, controlDiv, mapcanvas);
        this.controlDiv.appendChild(this.sensorDiv);
        this.currentStep.getWorld().drawSensorStatus(this.sensorCanvas);
    };
    SensorRobot.prototype.setCurrentStep = function (step) {
        _super.prototype.setCurrentStep.call(this, step);
        step.getWorld().drawSensorStatus(this.sensorCanvas);
    };
    return SensorRobot;
}(ActionRobot));
var MemoryRobot = /** @class */ (function (_super) {
    __extends(MemoryRobot, _super);
    function MemoryRobot(level, world) {
        var _this = _super.call(this, level, world) || this;
        _this.memories = [new MemoryLabel("m1", "Memory 1"),
            new MemoryLabel("m2", "Memory 2"),
            new MemoryLabel("m3", "Memory 3"),
            new MemoryLabel("m4", "Memory 4"),
            new MemoryLabel("m5", "Memory 5"),
            new MemoryLabel("m6", "Memory 6"),
            new MemoryLabel("m7", "Memory 7"),
            new MemoryLabel("m8", "Memory 8")];
        _this.memories.forEach(function (mem) { return _this.addFactory(new MemoryActionFactory(mem)); });
        _this.memoryDiv = document.createElement("div");
        _this.memoryDiv.classList.add("robotcontrolmemorylist");
        var memoryheader = document.createElement("span");
        memoryheader.innerText = "Robot remembers:";
        _this.memoryUl = document.createElement("ul");
        _this.memoryDiv.appendChild(memoryheader);
        _this.memoryDiv.appendChild(_this.memoryUl);
        return _this;
    }
    MemoryRobot.prototype.addRule = function () {
        var rule = new MemoryRule();
        return rule;
    };
    MemoryRobot.prototype.toText = function () {
        var ret = "";
        for (var _i = 0, _a = this.memories; _i < _a.length; _i++) {
            var mem = _a[_i];
            ret += mem.getName().replace("|", "||") + "#|#";
        }
        return ret + _super.prototype.toText.call(this);
    };
    MemoryRobot.prototype.loadFromText = function (stream) {
        for (var i = 0; i < this.memories.length; i++) {
            var name = stream.readUntil("#|#");
            this.memories[i].setName(name.replace("||", "|"));
            $(this.getFactory("M" + this.memories[i].getId()).getElement()).find("input").val(this.memories[i].getName());
        }
        _super.prototype.loadFromText.call(this, stream);
    };
    ;
    MemoryRobot.prototype.toBackground = function () {
        _super.prototype.toBackground.call(this);
        this.controlDiv.removeChild(this.memoryDiv);
    };
    MemoryRobot.prototype.toForeground = function (guiDiv, controlDiv, mapcanvas) {
        _super.prototype.toForeground.call(this, guiDiv, controlDiv, mapcanvas);
        this.controlDiv.appendChild(this.memoryDiv);
        this.currentStep.getWorld().updateMemoryUL(this.memoryUl);
    };
    MemoryRobot.prototype.setCurrentStep = function (step) {
        _super.prototype.setCurrentStep.call(this, step);
        step.getWorld().updateMemoryUL(this.memoryUl);
    };
    return MemoryRobot;
}(SensorRobot));
//# sourceMappingURL=Robot.js.map