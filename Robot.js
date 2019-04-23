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
var BasicRobot = /** @class */ (function () {
    function BasicRobot(level, world) {
        var _this = this;
        this.factories = {};
        this.isTesting = false;
        this.isRunning = false;
        this.level = level;
        this.currentStep = new InitStep(this, world);
        this.firstStep = this.currentStep;
        var rm = new RulesManager(this);
        var moveForwardFactory = new MoveForwardActionFactory();
        var turnLeftFactory = new TurnLeftActionFactory();
        var turnRightFactory = new TurnRightActionFactory();
        this.rulesManager = rm;
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
    BasicRobot.prototype.addFactory = function (factory) {
        if (!this.factories[factory.getId()]) {
            this.rulesManager.actionrepoul.appendChild(factory.getElement());
            this.factories[factory.getId()] = factory;
        }
    };
    BasicRobot.prototype.toBackground = function () {
        this.pause();
        this.guiDiv.removeChild(this.rulesDiv);
        this.guiDiv.removeChild(this.rulesManager.getActionRepoDiv());
        this.controlDiv.removeChild(this.runDiv);
    };
    BasicRobot.prototype.toForeground = function (guiDiv, controlDiv, mapcanvas) {
        this.guiDiv = guiDiv;
        this.controlDiv = controlDiv;
        this.currentStep.getWorld().draw(mapcanvas);
        this.mapcanvas = mapcanvas;
        guiDiv.appendChild(this.rulesDiv);
        guiDiv.appendChild(this.rulesManager.getActionRepoDiv());
        controlDiv.appendChild(this.runDiv);
    };
    BasicRobot.prototype.getRules = function () { return this.rulesManager.getRules(); };
    BasicRobot.prototype.addRule = function () {
        var rule = new BasicRule();
        return rule;
    };
    BasicRobot.prototype.getWorld = function () {
        return this.currentStep.getWorld();
    };
    BasicRobot.prototype.setWorld = function (world) {
        this.firstStep = new InitStep(this, world);
        this.toStart();
    };
    BasicRobot.prototype.setCurrentStep = function (step) {
        if (step != this.currentStep) {
            this.currentStep.exit();
            this.currentStep = step;
            this.updateButtons();
            this.currentStep.enter();
        }
    };
    BasicRobot.prototype.getFactory = function (key) {
        return this.factories[key];
    };
    BasicRobot.prototype.reset = function () {
        this.isRunning = false;
        this.isTesting = false;
        this.setWorld(this.level.resetWorld());
    };
    BasicRobot.prototype.test = function () {
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
    BasicRobot.prototype.updateButtons = function () {
        this.toStartButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasPredecessor();
        this.backButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasPredecessor();
        this.pauseButton.disabled = !this.isRunning;
        this.stepButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasSuccessor();
        this.runButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasSuccessor();
        this.ffwdButton.disabled = this.isRunning || this.isTesting || !this.currentStep.hasSuccessor();
        this.testButton.disabled = this.isTesting;
    };
    BasicRobot.prototype.toStart = function () {
        this.setCurrentStep(this.firstStep);
        //this.toStartButton.disabled = true;
        //this.backButton.disabled = true;
        //this.pauseButton.disabled = true;
        //this.stepButton.disabled = false;
        //this.runButton.disabled = false;
        //this.ffwdButton.disabled = false;
        this.currentStep.getWorld().draw(this.mapcanvas);
        return this.currentStep;
    };
    BasicRobot.prototype.stepBack = function () {
        var next = this.currentStep.getPredecessor();
        //if (!next.hasPredecessor()) {
        //    this.backButton.disabled = true;
        //    this.toStartButton.disabled = true;
        //    this.pauseButton.disabled = true;
        //}
        //this.stepButton.disabled = false;
        //this.runButton.disabled = false;
        //this.ffwdButton.disabled = false;
        this.setCurrentStep(next);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return next;
    };
    BasicRobot.prototype.stepNext = function () {
        var next = this.currentStep.getSuccessor();
        //if (next.isError() || !next.hasSuccessor()) {
        //    this.stepButton.disabled = true;
        //    this.runButton.disabled = true;
        //    this.pauseButton.disabled = true;
        //    this.ffwdButton.disabled = true;
        //}
        //this.backButton.disabled = false;
        //this.toStartButton.disabled = false;
        this.setCurrentStep(next);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return next;
    };
    BasicRobot.prototype.pause = function () {
        if (this.isRunning) {
            this.isRunning = false;
            window.clearInterval(this.runInterval);
        }
        this.updateButtons();
        //this.pauseButton.disabled = true;
        //this.runButton.disabled = !this.currentStep.hasSuccessor();
        //this.ffwdButton.disabled = !this.currentStep.hasSuccessor();
        //this.stepButton.disabled = !this.currentStep.hasSuccessor();
        //this.backButton.disabled = !this.currentStep.hasPredecessor();
        //this.toStartButton.disabled = !this.currentStep.hasPredecessor();
    };
    BasicRobot.prototype.runAtSpeed = function (speed) {
        var _this = this;
        this.isRunning = true;
        this.updateButtons();
        //this.runButton.disabled = true;
        //this.stepButton.disabled = true;
        //this.ffwdButton.disabled = true;
        //this.backButton.disabled = true;
        //this.toStartButton.disabled = true;
        //this.pauseButton.disabled = false;
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
    BasicRobot.prototype.run = function () {
        this.runAtSpeed(200);
    };
    BasicRobot.prototype.runfast = function () {
        this.runAtSpeed(20);
    };
    BasicRobot.prototype.toText = function () { return this.rulesManager.toText(); };
    BasicRobot.prototype.loadFromText = function (stream) { this.rulesManager.loadFromText(stream, this); };
    ;
    return BasicRobot;
}());
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
    return MemoryRobot;
}(BasicRobot));
//# sourceMappingURL=Robot.js.map