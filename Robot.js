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
    function BasicRobot(world) {
        var _this = this;
        this.isRunning = false;
        this.currentStep = new InitStep(this, world);
        var rm = new RulesManager(this);
        var moveForwardFactory = new MoveForwardActionFactory();
        var turnLeftFactory = new TurnLeftActionFactory();
        var turnRightFactory = new TurnRightActionFactory();
        rm.actionrepoul.appendChild(moveForwardFactory.actionli);
        rm.actionrepoul.appendChild(turnLeftFactory.actionli);
        rm.actionrepoul.appendChild(turnRightFactory.actionli);
        this.rulesManager = rm;
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
        var robot = this;
        $(tostartbutton).on("click", function () { return _this.toStart(); });
        $(stepforwardbutton).on("click", function () { return _this.stepNext(); });
        $(stepbackbutton).on("click", function () { return _this.stepBack(); });
        $(pausebutton).on("click", function () { return _this.pause(); });
        $(runbutton).on("click", function () { return _this.run(); });
        $(fastforwardbutton).on("click", function () { return _this.runfast(); });
        rundiv.appendChild(tostartbutton);
        rundiv.appendChild(stepbackbutton);
        rundiv.appendChild(pausebutton);
        rundiv.appendChild(stepforwardbutton);
        rundiv.appendChild(runbutton);
        rundiv.appendChild(fastforwardbutton);
        this.toStartButton = tostartbutton;
        this.backButton = stepbackbutton;
        this.pauseButton = pausebutton;
        this.stepButton = stepforwardbutton;
        this.runButton = runbutton;
        this.ffwdButton = fastforwardbutton;
        this.runDiv = rundiv;
    }
    BasicRobot.prototype.toBackground = function () {
        this.guiDiv.removeChild(this.rulesManager.getActionRepoDiv());
        this.guiDiv.removeChild(this.rulesManager.getRulesDiv());
        this.controlDiv.removeChild(this.runDiv);
    };
    BasicRobot.prototype.toForeground = function (guiDiv, controlDiv, mapcanvas) {
        this.guiDiv = guiDiv;
        this.controlDiv = controlDiv;
        this.currentStep.getWorld().draw(mapcanvas);
        this.mapcanvas = mapcanvas;
        guiDiv.appendChild(this.rulesManager.getRulesDiv());
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
            this.currentStep.enter();
        }
    };
    BasicRobot.prototype.toStart = function () {
        this.setCurrentStep(this.firstStep);
        this.toStartButton.disabled = true;
        this.backButton.disabled = true;
        this.pauseButton.disabled = true;
        this.stepButton.disabled = false;
        this.runButton.disabled = false;
        this.ffwdButton.disabled = false;
        this.currentStep.getWorld().draw(this.mapcanvas);
        return this.currentStep;
    };
    BasicRobot.prototype.stepBack = function () {
        var next = this.currentStep.getPredecessor();
        if (!next.hasPredecessor()) {
            this.backButton.disabled = true;
            this.toStartButton.disabled = true;
            this.pauseButton.disabled = true;
        }
        this.stepButton.disabled = false;
        this.runButton.disabled = false;
        this.ffwdButton.disabled = false;
        this.setCurrentStep(next);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return next;
    };
    BasicRobot.prototype.stepNext = function () {
        var next = this.currentStep.getSuccessor();
        if (next.isError() || !next.hasSuccessor()) {
            this.stepButton.disabled = true;
            this.runButton.disabled = true;
            this.pauseButton.disabled = true;
            this.ffwdButton.disabled = true;
        }
        this.backButton.disabled = false;
        this.toStartButton.disabled = false;
        this.setCurrentStep(next);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return next;
    };
    BasicRobot.prototype.pause = function () {
        if (this.isRunning) {
            this.isRunning = false;
            window.clearInterval(this.runInterval);
        }
        this.pauseButton.disabled = true;
        this.runButton.disabled = !this.currentStep.hasSuccessor();
        this.ffwdButton.disabled = !this.currentStep.hasSuccessor();
        this.stepButton.disabled = !this.currentStep.hasSuccessor();
        this.backButton.disabled = !this.currentStep.hasPredecessor();
        this.toStartButton.disabled = !this.currentStep.hasPredecessor();
    };
    BasicRobot.prototype.runAtSpeed = function (speed) {
        var _this = this;
        this.isRunning = true;
        this.runButton.disabled = true;
        this.stepButton.disabled = true;
        this.ffwdButton.disabled = true;
        this.backButton.disabled = true;
        this.toStartButton.disabled = true;
        this.pauseButton.disabled = false;
        window.setInterval(function () {
            if (_this.isRunning) {
                var next = _this.currentStep.getSuccessor();
                if (next.isError() || !next.hasSuccessor()) {
                    _this.pause();
                }
                _this.setCurrentStep(next);
                _this.currentStep.getWorld().draw(_this.mapcanvas);
            }
        }, speed);
    };
    BasicRobot.prototype.run = function () {
        this.runAtSpeed(200);
    };
    BasicRobot.prototype.runfast = function () {
        this.runAtSpeed(20);
    };
    return BasicRobot;
}());
var MemoryRobot = /** @class */ (function (_super) {
    __extends(MemoryRobot, _super);
    function MemoryRobot(world) {
        var _this = _super.call(this, world) || this;
        var memory1 = new MemoryActionFactory(new MemoryLabel("Memory 1"));
        var memory2 = new MemoryActionFactory(new MemoryLabel("Memory 2"));
        var memory3 = new MemoryActionFactory(new MemoryLabel("Memory 3"));
        var memory4 = new MemoryActionFactory(new MemoryLabel("Memory 4"));
        var memory5 = new MemoryActionFactory(new MemoryLabel("Memory 5"));
        var memory6 = new MemoryActionFactory(new MemoryLabel("Memory 6"));
        var memory7 = new MemoryActionFactory(new MemoryLabel("Memory 7"));
        var memory8 = new MemoryActionFactory(new MemoryLabel("Memory 8"));
        _this.rulesManager.actionrepoul.appendChild(memory1.getElement());
        _this.rulesManager.actionrepoul.appendChild(memory2.getElement());
        _this.rulesManager.actionrepoul.appendChild(memory3.getElement());
        _this.rulesManager.actionrepoul.appendChild(memory4.getElement());
        _this.rulesManager.actionrepoul.appendChild(memory5.getElement());
        _this.rulesManager.actionrepoul.appendChild(memory6.getElement());
        _this.rulesManager.actionrepoul.appendChild(memory7.getElement());
        _this.rulesManager.actionrepoul.appendChild(memory8.getElement());
        return _this;
    }
    MemoryRobot.prototype.addRule = function () {
        var rule = new MemoryRule();
        return rule;
    };
    return MemoryRobot;
}(BasicRobot));
//# sourceMappingURL=Robot.js.map