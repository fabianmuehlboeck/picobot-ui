interface IRobotProgram {
    toBackground(): void;
    toForeground(guiDiv: HTMLDivElement, controlDiv: HTMLDivElement, mapcanvas: HTMLCanvasElement): void;
}
interface IRobot<W extends IWorld<W>> extends IRobotProgram {
    getRules(): Array<IRule<W>>;
    addRule(): IRule<W>;
}

class BasicRobot<W extends IWorld<W>> implements IRobot<W> {
    currentStep: IStep<W>;
    firstStep: IStep<W>;
    rulesManager: RulesManager<W>;
    guiDiv: HTMLDivElement;
    controlDiv: HTMLDivElement;
    runDiv: HTMLDivElement;
    mapcanvas: HTMLCanvasElement;

    toStartButton: HTMLButtonElement;
    backButton: HTMLButtonElement;
    pauseButton: HTMLButtonElement;
    stepButton: HTMLButtonElement;
    runButton: HTMLButtonElement;
    ffwdButton: HTMLButtonElement;
    constructor(world: W) {
        this.currentStep = new InitStep(this, world);
        this.firstStep = this.currentStep;
        var rm: RulesManager<W> = new RulesManager<W>(this);
        var moveForwardFactory = new MoveForwardActionFactory<W>();
        var turnLeftFactory = new TurnLeftActionFactory<W>();
        var turnRightFactory = new TurnRightActionFactory<W>();
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
        $(tostartbutton).on("click", () => this.toStart());
        $(stepforwardbutton).on("click", () => this.stepNext());
        $(stepbackbutton).on("click", () => this.stepBack());
        $(pausebutton).on("click", () => this.pause());
        $(runbutton).on("click", () => this.run());
        $(fastforwardbutton).on("click", () => this.runfast());

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

    toBackground(): void {
        this.guiDiv.removeChild(this.rulesManager.getActionRepoDiv());
        this.guiDiv.removeChild(this.rulesManager.getRulesDiv());
        this.controlDiv.removeChild(this.runDiv);
    }
    toForeground(guiDiv: HTMLDivElement, controlDiv: HTMLDivElement, mapcanvas: HTMLCanvasElement): void {
        this.guiDiv = guiDiv;
        this.controlDiv = controlDiv;
        this.currentStep.getWorld().draw(mapcanvas);
        this.mapcanvas = mapcanvas;
        guiDiv.appendChild(this.rulesManager.getRulesDiv());
        guiDiv.appendChild(this.rulesManager.getActionRepoDiv());
        controlDiv.appendChild(this.runDiv);
    }
    getRules(): Array<IRule<W>> { return this.rulesManager.getRules(); }
    addRule(): IRule<W> {
        var rule = new BasicRule<W>();
        return rule;
    }

    getWorld(): W {
        return this.currentStep.getWorld();
    }
    setWorld(world: W) {
        this.firstStep = new InitStep<W>(this, world);
        this.toStart();
    }

    setCurrentStep(step: IStep<W>): void {
        if (step != this.currentStep) {
            this.currentStep.exit();
            this.currentStep = step;
            this.currentStep.enter();
        }
    }

    toStart(): IStep<W> {
        this.setCurrentStep(this.firstStep);
        this.toStartButton.disabled = true;
        this.backButton.disabled = true;
        this.pauseButton.disabled = true;
        this.stepButton.disabled = false;
        this.runButton.disabled = false;
        this.ffwdButton.disabled = false;
        this.currentStep.getWorld().draw(this.mapcanvas);
        return this.currentStep;
    }

    stepBack(): IStep<W> {
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
    }

    stepNext(): IStep<W> {
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
    }

    runInterval: number;
    isRunning: boolean = false;

    pause(): void {
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
    }

    runAtSpeed(speed: number) {
        this.isRunning = true;
        this.runButton.disabled = true;
        this.stepButton.disabled = true;
        this.ffwdButton.disabled = true;
        this.backButton.disabled = true;
        this.toStartButton.disabled = true;
        this.pauseButton.disabled = false;
        window.setInterval(() => {
            if (this.isRunning) {
                var next = this.currentStep.getSuccessor();
                if (next.isError() || !next.hasSuccessor()) {
                    this.pause();
                }
                this.setCurrentStep(next);
                this.currentStep.getWorld().draw(this.mapcanvas);
            }
        }, speed);
    }

    run(): void {
        this.runAtSpeed(200);
    }

    runfast(): void {
        this.runAtSpeed(20);
    }
}

class MemoryRobot<W extends IWorld<W>> extends BasicRobot<W> {
    constructor(world: W) {
        super(world);
        var memory1 = new MemoryActionFactory<W>(new MemoryLabel("Memory 1"));
        var memory2 = new MemoryActionFactory<W>(new MemoryLabel("Memory 2"));
        var memory3 = new MemoryActionFactory<W>(new MemoryLabel("Memory 3"));
        var memory4 = new MemoryActionFactory<W>(new MemoryLabel("Memory 4"));
        var memory5 = new MemoryActionFactory<W>(new MemoryLabel("Memory 5"));
        var memory6 = new MemoryActionFactory<W>(new MemoryLabel("Memory 6"));
        var memory7 = new MemoryActionFactory<W>(new MemoryLabel("Memory 7"));
        var memory8 = new MemoryActionFactory<W>(new MemoryLabel("Memory 8"));
        this.rulesManager.actionrepoul.appendChild(memory1.getElement());
        this.rulesManager.actionrepoul.appendChild(memory2.getElement());
        this.rulesManager.actionrepoul.appendChild(memory3.getElement());
        this.rulesManager.actionrepoul.appendChild(memory4.getElement());
        this.rulesManager.actionrepoul.appendChild(memory5.getElement());
        this.rulesManager.actionrepoul.appendChild(memory6.getElement());
        this.rulesManager.actionrepoul.appendChild(memory7.getElement());
        this.rulesManager.actionrepoul.appendChild(memory8.getElement());
    }

    addRule(): IRule<W> {
        var rule = new MemoryRule<W>();
        return rule;
    }
}