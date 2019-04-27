interface IRobotProgram {
    toBackground(): void;
    toForeground(guiDiv: HTMLDivElement, controlDiv: HTMLDivElement, mapcanvas: HTMLCanvasElement): void;
}
interface IRobot<W extends IWorld<W>> extends IRobotProgram {
    getRules(): Array<IRule<W>>;
    addRule(): IRule<W>;
    getFactory(key: string): IActionFactory<W>;
    loadFromText(stream: StringStream): void;
    toText(): string;
}

class ActionRobot<W extends IWorld<W>> implements IRobot<W> {
    currentStep: IStep<W>;
    firstStep: IStep<W>;
    rulesManager: RulesManager<W>;
    guiDiv: HTMLDivElement;
    controlDiv: HTMLDivElement;
    runDiv: HTMLDivElement;
    mapcanvas: HTMLCanvasElement;
    rulesDiv: HTMLDivElement;

    toStartButton: HTMLButtonElement;
    backButton: HTMLButtonElement;
    pauseButton: HTMLButtonElement;
    stepButton: HTMLButtonElement;
    runButton: HTMLButtonElement;
    ffwdButton: HTMLButtonElement;

    resetButton: HTMLButtonElement;
    testButton: HTMLButtonElement;

    factories: StringMap<IActionFactory<W>> = {};
    level: ALevel<W>;


    constructor(level: ALevel<W>, world: W) {
        this.level = level;
        var rm: RulesManager<W> = new RulesManager<W>(this, this.isMultiRule());
        var moveForwardFactory = new MoveForwardActionFactory<W>();
        var turnLeftFactory = new TurnLeftActionFactory<W>();
        var turnRightFactory = new TurnRightActionFactory<W>();
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
        $(tostartbutton).on("click", () => this.toStart());
        $(stepforwardbutton).on("click", () => this.stepNext());
        $(stepbackbutton).on("click", () => this.stepBack());
        $(pausebutton).on("click", () => this.pause());
        $(runbutton).on("click", () => this.run());
        $(fastforwardbutton).on("click", () => this.runfast());
        $(resetbutton).on("click", () => this.reset());
        $(testbutton).on("click", () => this.test());

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

    isMultiRule(): boolean { return false; }

    addFactory(factory: IActionFactory<W>): void {
        if (!this.factories[factory.getId()]) {
            this.rulesManager.actionrepoul.appendChild(factory.getElement());
            this.factories[factory.getId()] = factory;
        }
    }

    autosaveinterval: number;
    toBackground(): void {
        window.clearInterval(this.autosaveinterval);
        this.pause();
        this.guiDiv.removeChild(this.rulesDiv);
        this.guiDiv.removeChild(this.rulesManager.getActionRepoDiv());
        this.controlDiv.removeChild(this.runDiv);
    }
    firstload: boolean = true;
    toForeground(guiDiv: HTMLDivElement, controlDiv: HTMLDivElement, mapcanvas: HTMLCanvasElement): void {
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
        this.autosaveinterval = window.setInterval(() => {
            localStorage.setItem("automap:" + this.level.getName(), this.toText());
        }, 10000);
    }
    getRules(): Array<IRule<W>> { return this.rulesManager.getRules(); }
    addRule(): IRule<W> {
        var rule = new ActionRule<W>();
        return rule;
    }
    getInitStep(world: W): IStep<W> {
        return new SimpleInitStep(this, world);
    }

    getWorld(): W {
        return this.currentStep.getWorld();
    }
    setWorld(world: W) {
        this.firstStep = this.getInitStep(world);
        this.toStart();
    }

    setCurrentStep(step: IStep<W>): void {
        if (step != this.currentStep) {
            this.currentStep.exit();
            this.currentStep = step;
            this.updateButtons();
            this.currentStep.enter();
        }
    }

    getFactory(key: string): IActionFactory<W> {
        return this.factories[key];
    }

    reset(): void {
        this.isRunning = false;
        this.isTesting = false;
        this.setWorld(this.level.resetWorld());
    }

    isTesting: boolean = false;
    test(): void {
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
        $(testabortbutton).on("click", () => {
            window.clearInterval(this.runInterval);
            this.isTesting = false;
            testbanner.parentNode.removeChild(testbanner);
            this.updateButtons();
        });
        testbannermsgdiv.appendChild(testabortbutton);
        testbanner.appendChild(testbannermsgdiv);
        document.body.appendChild(testbanner);
        var testmaps = this.level.getTestMaps();
        var testmapindex = 0;
        this.setWorld(testmaps[0]);
        this.runInterval = window.setInterval(() => {
            if (!this.isTesting) {
                window.clearInterval(this.runInterval);
            }
            if (testmapindex < testmaps.length) {
                if (this.currentStep.hasSuccessor()) {
                    var steps = 0;
                    var curx = this.currentStep.getWorld().getX();
                    var cury = this.currentStep.getWorld().getY();
                    var curdir = this.currentStep.getWorld().getDirection();
                    while (this.currentStep.hasSuccessor() && steps < 1000 && curx == this.currentStep.getWorld().getX() && cury == this.currentStep.getWorld().getY() && curdir == this.currentStep.getWorld().getDirection()) {
                        this.setCurrentStep(this.currentStep.getSuccessor());
                        this.currentStep.getWorld().draw(this.mapcanvas);
                        steps++;
                    }
                    if (steps == 1000) {
                        window.clearInterval(this.runInterval);
                        this.isTesting = false;
                        testbanner.parentNode.removeChild(testbanner);
                        var dialogdiv = document.createElement("div");
                        dialogdiv.innerText = "Test ran too long without any movement!";
                        document.body.appendChild(dialogdiv);
                        $(dialogdiv).dialog({ modal: true, close: function () { dialogdiv.parentNode.removeChild(dialogdiv); } });
                        this.updateButtons();
                    }
                } else {
                    if (this.currentStep.isError()) {
                        window.clearInterval(this.runInterval);
                        this.isTesting = false;
                        testbanner.parentNode.removeChild(testbanner);
                        var dialogdiv = document.createElement("div");
                        dialogdiv.innerText = "Test failed!";
                        document.body.appendChild(dialogdiv);
                        $(dialogdiv).dialog({ modal: true, close: function () { dialogdiv.parentNode.removeChild(dialogdiv); } });
                        this.updateButtons();
                    } else {
                        testmapindex++;
                        if (testmapindex < testmaps.length) {
                            this.setWorld(testmaps[testmapindex]);
                        }
                    }
                }
            } else {
                window.clearInterval(this.runInterval);
                this.isTesting = false;
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
                this.updateButtons();
            }
        }, 1);
    }

    updateButtons(): void {
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
            $(".guicontainer button").each((i, elem) => {
                (<HTMLButtonElement>elem).disabled = true;
            });
        } else {
            $(".guicontainer .ui-sortable").sortable("enable");
            $(".guicontainer .ui-draggable").draggable("enable");
            $(".guicontainer button").each((i, elem) => {
                (<HTMLButtonElement>elem).disabled = false;
            });
        }
    }

    toStart(): IStep<W> {
        this.setCurrentStep(this.firstStep);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return this.currentStep;
    }

    stepBack(): IStep<W> {
        var next = this.currentStep.getPredecessor();
        this.setCurrentStep(next);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return next;
    }

    stepNext(): IStep<W> {
        var next = this.currentStep.getSuccessor();
        this.setCurrentStep(next);
        this.currentStep.getWorld().draw(this.mapcanvas);
        return next;
    }

    runInterval: number;
    isRunning: boolean = false;

    pause(): void {
        if (this.isRunning) {
            this.isRunning = false;
            window.clearInterval(this.runInterval);
        }
        this.updateButtons();
    }

    runAtSpeed(speed: number) {
        this.isRunning = true;
        this.updateButtons();
        this.runInterval = window.setInterval(() => {
            if (this.isRunning) {
                var next = this.currentStep.getSuccessor();
                if (next.isError() || !next.hasSuccessor()) {
                    this.pause();
                }
                this.setCurrentStep(next);
                this.currentStep.getWorld().draw(this.mapcanvas);
            } else {
                window.clearInterval(this.runInterval);
                this.updateButtons();
            }
        }, speed);
    }

    run(): void {
        this.runAtSpeed(200);
    }

    runfast(): void {
        this.runAtSpeed(20);
    }
    toText(): string { return this.rulesManager.toText(); }
    loadFromText(stream: StringStream): void { this.rulesManager.loadFromText(stream, this); };
}


class SensorRobot<W extends IWorld<W>> extends ActionRobot<W> {

    sensorDiv: HTMLDivElement;
    sensorCanvas: HTMLCanvasElement;

    constructor(level: ALevel<W>, world: W) {
        super(level, world);
        this.sensorDiv = document.createElement("div");
        this.sensorDiv.classList.add("robotcontrolsensor");
        var sensordivheading = document.createElement("span");
        sensordivheading.innerText = "Robot sees:";
        this.sensorDiv.appendChild(sensordivheading);
        this.sensorCanvas = document.createElement("canvas");
        this.sensorCanvas.width = 144;
        this.sensorCanvas.height = 96;
        this.sensorDiv.appendChild(this.sensorCanvas);
    }
    getInitStep(world: W) {
        return new InitStep(this, world);
    }
    isMultiRule(): boolean { return true; }
    addRule(): IRule<W> {
        var rule = new SensorRule<W>();
        return rule;
    }
    toBackground(): void {
        super.toBackground();
        this.controlDiv.removeChild(this.sensorDiv);
    }
    toForeground(guiDiv: HTMLDivElement, controlDiv: HTMLDivElement, mapcanvas: HTMLCanvasElement): void {
        super.toForeground(guiDiv, controlDiv, mapcanvas);
        this.controlDiv.appendChild(this.sensorDiv);
        this.currentStep.getWorld().drawSensorStatus(this.sensorCanvas);
    }
    setCurrentStep(step: IStep<W>): void {
        super.setCurrentStep(step);
        step.getWorld().drawSensorStatus(this.sensorCanvas);
    }
}

class MemoryRobot<W extends IWorld<W>> extends SensorRobot<W> {
    memories: MemoryLabel[];
    memoryDiv: HTMLDivElement;
    memoryUl: HTMLUListElement;
    constructor(level: ALevel<W>, world: W) {
        super(level, world);
        this.memories = [new MemoryLabel("m1", "Memory 1"),
        new MemoryLabel("m2", "Memory 2"),
        new MemoryLabel("m3", "Memory 3"),
        new MemoryLabel("m4", "Memory 4"),
        new MemoryLabel("m5", "Memory 5"),
        new MemoryLabel("m6", "Memory 6"),
        new MemoryLabel("m7", "Memory 7"),
        new MemoryLabel("m8", "Memory 8")]
        this.memories.forEach((mem) => this.addFactory(new MemoryActionFactory<W>(mem)));
        this.memoryDiv = document.createElement("div");
        this.memoryDiv.classList.add("robotcontrolmemorylist");
        var memoryheader = document.createElement("span");
        memoryheader.innerText = "Robot remembers:";
        this.memoryUl = document.createElement("ul");
        this.memoryDiv.appendChild(memoryheader);
        this.memoryDiv.appendChild(this.memoryUl);
    }

    addRule(): IRule<W> {
        var rule = new MemoryRule<W>();
        return rule;
    }

    toText(): string {
        var ret = "";
        for (let mem of this.memories) {
            ret += mem.getName().replace("|", "||") + "#|#";
        }
        return ret + super.toText();
    }

    loadFromText(stream: StringStream): void {
        for (var i = 0; i < this.memories.length; i++) {
            var name = stream.readUntil("#|#");
            this.memories[i].setName(name.replace("||", "|"));
            $(this.getFactory("M" + this.memories[i].getId()).getElement()).find("input").val(this.memories[i].getName());
        }
        super.loadFromText(stream);
    };
    toBackground(): void {
        super.toBackground();
        this.controlDiv.removeChild(this.memoryDiv);
    }
    toForeground(guiDiv: HTMLDivElement, controlDiv: HTMLDivElement, mapcanvas: HTMLCanvasElement): void {
        super.toForeground(guiDiv, controlDiv, mapcanvas);
        this.controlDiv.appendChild(this.memoryDiv);
        this.currentStep.getWorld().updateMemoryUL(this.memoryUl);
    }
    setCurrentStep(step: IStep<W>): void {
        super.setCurrentStep(step);
        step.getWorld().updateMemoryUL(this.memoryUl);
    }
}