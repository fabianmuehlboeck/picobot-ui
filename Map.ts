
interface IMap {
    updateWorldState(ws: IWorldState, x: number, y: number): void;
    isValidPos(x: number, y: number): boolean;
    draw(): void;
    getRobot(): Robot;
    setRobot(robot: Robot);
    step(ws: IWorldState, options?: StepOptions): boolean;
    vstep(ws: IWorldState, options: StepOptions, thenCont: () => void, elseCont: () => void): void;
    getCanvas(): HTMLCanvasElement;
    getStepOptions(): StepOptions;
    reset(): void;
    test(refreshcb: () => void, ws: IWorldState, donecb: (success: boolean) => void, finishedcb: () => void): (cont: () => void) => void;
    vtest(refreshcb: () => void, ws: IWorldState, donecb: (success: boolean) => void, finishedcb: () => void): (cont: () => void) => void;
    hasWon(): boolean;
    showWinningMessage(runtests: () => void, nextmap: () => void): void;
    getName(): string;
    isStateless(): boolean;
    getPicoCodeBox(): HTMLTextAreaElement;
    getPicoErrorTextBox(): HTMLTextAreaElement;
    save(): void;
    load(): boolean;
    clear(): void;
}

class StepOptions {
}

var FOGDIST: number = 4;

function drawFog(ctx: CanvasRenderingContext2D, sx: number, sy: number, ex: number, ey: number) {
    var x: number = sx;
    var y: number = sy;
    ctx.strokeStyle = "#000000";
    if (x % FOGDIST != 0) {
        x += FOGDIST - (x % FOGDIST);
    }
    if (y % FOGDIST != 0) {
        x -= y % FOGDIST;
    }
    var d: number;
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

function drawFinish(ctx: CanvasRenderingContext2D, sx: number, sy: number, ex: number, ey: number) {
    var x: number = sx - (sx % (FINISHSIZE * 2));
    var y: number = sy - (sy % (FINISHSIZE * 2));
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


class MapControls {
    editorDiv: HTMLDivElement;
    codeDiv: HTMLDivElement;
    helpDiv: HTMLDivElement;
    controlDiv: HTMLDivElement;
    canvasParent: HTMLDivElement;
    upButton: HTMLAnchorElement;
    rightButton: HTMLAnchorElement;
    downButton: HTMLAnchorElement;
    leftButton: HTMLAnchorElement;
    testSuccessDialog: HTMLDivElement;

    stepfastbutton: HTMLButtonElement;
    runfastbutton: HTMLButtonElement;
    testfastbutton: HTMLButtonElement;
    stepvisualbutton: HTMLButtonElement;
    runvisualbutton: HTMLButtonElement;
    testvisualbutton: HTMLButtonElement;
    stopbutton: HTMLButtonElement;

    pico: Pico;
    map: IMap;
    worldState: DrawWorldState;
    _isrunning: boolean = false;
    testabort: (cont: () => void) => void = null;
    get running(): boolean { return this._isrunning; }
    set running(b: boolean) {
        this._isrunning = b;
        if (b == false) {
            $(".runningbutton").removeClass("runningbutton");
        }
    }
    runinterval: number;
    robotstatediv: HTMLDivElement;

    getMap(): IMap { return this.map; }

    updateMapUI() : void {
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
        addstatebutton.classList.add("addstatebutton");
        addstatebutton.addEventListener("click", () => {
            var state = this.map.getRobot().addState();
            $('html, body').animate({
                scrollTop: Math.max(0, $(state.div).offset().top - 96)
            }, 300);
            var namefield = state.namefield;
            namefield.selectionStart = 0;
            namefield.selectionEnd = namefield.value.length;
            namefield.focus();
        });
        menudiv.appendChild(addstatebutton);

        var loadbutton = document.createElement("button");
        loadbutton.appendChild(document.createTextNode("Load Program"));
        loadbutton.addEventListener("click", () => {
            if (this.map.load()) {
                this.updateMapUI();
            }
        });
        menudiv.appendChild(loadbutton);

        var savebutton = document.createElement("button");
        savebutton.appendChild(document.createTextNode("Save Program"));
        savebutton.addEventListener("click", () => {
            this.map.save();
        });
        menudiv.appendChild(savebutton);

        var savebutton = document.createElement("button");
        savebutton.appendChild(document.createTextNode("Clear Program"));
        savebutton.addEventListener("click", () => {
            this.map.clear();
            this.updateMapUI();
        });
        menudiv.appendChild(savebutton);

        this.editorDiv.appendChild(menudiv);

        while (this.robotstatediv.childNodes.length > 0) {
            this.robotstatediv.removeChild(this.robotstatediv.childNodes[0]);
        }
        this.robotstatediv.appendChild(this.map.getRobot().stateselector.div);
        this.editorDiv.appendChild(this.map.getRobot().programdiv);
        this.canvasParent.appendChild(this.map.getCanvas());

        if (this.map.isStateless()) {
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
        this.codeDiv.appendChild(this.map.getPicoCodeBox());
        this.codeDiv.appendChild(this.map.getPicoErrorTextBox());

        this.refresh();
    }

    setMap(map: IMap) : void {
        this.map = map;
        this.updateMapUI();
    }

    constructor(pico: Pico, canvasParent: HTMLDivElement, controlParent: HTMLDivElement, editorDiv: HTMLDivElement, codeDiv: HTMLDivElement, helpDiv: HTMLDivElement) {
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
        loadbutton.addEventListener("click", () => {
            var pp: { program: PicoProgram, errors: Error[] } = PicoProgram.fromEditor(this.map.getRobot());
            this.map.getPicoCodeBox().value = pp.program.toText().join("\n");
            this.map.getPicoErrorTextBox().value = pp.errors.map((e, n, a) => e.message).join("\n");
        });
        codecontroldiv.appendChild(loadbutton);

        var compilebutton = document.createElement("button");
        compilebutton.appendChild(document.createTextNode("Compile to Editor"));
        compilebutton.addEventListener("click", () => {
            var pp: { program: PicoProgram, errors: Error[] } = PicoProgram.parse(this.map.getPicoCodeBox().value.split("\n"));
            if (pp.errors.length == 0) {
                var robot = pp.program.toEditor();
                robot.setPos(this.map.getRobot().getX(), this.map.getRobot().getY());
                this.map.setRobot(robot);
                this.updateMapUI();
                this.map.getPicoErrorTextBox().value = "Program successfully loaded to the robot.";
            } else {
                this.map.getPicoErrorTextBox().value = "There were errors, so the program has not been loaded to the robot.\n\n" + pp.errors.map((e, n, a) => e.message).join("\n");
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
        this.stepfastbutton.addEventListener("click", () => {
            this.stepFast();
        });
        simplerundiv.appendChild(this.stepfastbutton);
        this.runfastbutton = document.createElement("button");
        this.runfastbutton.appendChild(document.createTextNode("Run"));
        this.runfastbutton.addEventListener("click", () => {
            this.runFast();
        });
        simplerundiv.appendChild(this.runfastbutton);

        this.testfastbutton = document.createElement("button");
        this.testfastbutton.appendChild(document.createTextNode("Test"));
        this.testfastbutton.addEventListener("click", () => {
            this.testFast();
        });
        simplerundiv.appendChild(this.testfastbutton);

        var visualizerundiv = document.createElement("div");
        visualizerundiv.appendChild(document.createTextNode("VISUALIZE"));
        this.stepvisualbutton = document.createElement("button");
        this.stepvisualbutton.appendChild(document.createTextNode("Step"));
        this.stepvisualbutton.addEventListener("click", () => {
            this.stepVisual();
        });
        visualizerundiv.appendChild(this.stepvisualbutton);
        this.runvisualbutton = document.createElement("button");
        this.runvisualbutton.appendChild(document.createTextNode("Run"));
        this.runvisualbutton.addEventListener("click", () => {
            this.runVisual();
        })
        visualizerundiv.appendChild(this.runvisualbutton);
        this.testvisualbutton = document.createElement("button");
        this.testvisualbutton.appendChild(document.createTextNode("Test"));
        this.testvisualbutton.addEventListener("click", () => {
            this.testVisual();
        });
        visualizerundiv.appendChild(this.testvisualbutton);

        runProgramDiv.appendChild(simplerundiv);
        runProgramDiv.appendChild(visualizerundiv);

        var stopbutton = document.createElement("button");
        stopbutton.appendChild(document.createTextNode("Stop"));
        stopbutton.addEventListener("click", () => {
            this.stopRun();
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

        (<any>$(fogcheckbox)).checkboxradio();

        this.testSuccessDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("All tests succeeded!"));
        this.testSuccessDialog.appendChild(winp);

    }

    stepFast(): void {
        if (this.running == false) {
            if (this.map.hasWon()) {
                this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
            }
            else {
                this.step();
                if (this.map.hasWon()) {
                    this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
                }
            }
        }
    }

    runFast(): void {
        if (this.running == false) {
            if (this.map.hasWon()) {
                this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
            }
            else {
                this.running = true;
                this.runfastbutton.classList.add("runningbutton");
                this.runinterval = window.setInterval(() => { this.run(); }, 20);
            }
        }
    }

    testFast(): void {
        if (!this.running) {
            this.running = true;
            this.testfastbutton.classList.add("runningbutton");
            this.testabort = this.map.test(() => { this.refresh(); }, this.worldState, (success: boolean) => { if (success) { this.showTestSuccessMessage(); } else { alert("Test failed! Robot is stuck!"); } }, () => {
                this.running = false;
                this.testabort = null;
            });
            if (!this.running) {
                this.testabort = null;
            }
        }
    }

    stepVisual(): void {
        if (this.running == false) {
            if (this.map.hasWon()) {
                this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
            }
            else {
                this.running = true;
                this.stepvisualbutton.classList.add("runningbutton");
                this.vstep();
            }
        }
    }

    runVisual(): void {
        if (this.running == false) {
            if (this.map.hasWon()) {
                this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
            }
            else {
                this.running = true;
                this.runvisualbutton.classList.add("runningbutton");
                this.vrun();
            }
        }
    }

    testVisual(): void {
        if (!this.running) {
            this.running = true;
            this.testvisualbutton.classList.add("runningbutton");
            this.testabort = this.map.vtest(() => { this.refresh(); }, this.worldState, (success: boolean) => { if (success) { this.showTestSuccessMessage(); } else { alert("Test failed! Robot is stuck!"); } }, () => {
                this.running = false;
                this.testabort = null;
            });
            if (!this.running) {
                this.testabort = null;
            }
        }
    }

    stopRun(cont: () => void = () => { }): void {
        if (this.running == true) {
            if (this.testabort != null) {
                this.testabort(cont);
                this.testabort = null;
            } else {
                this.running = false;
            }
        } else {
            cont();
        }
    }

    showTestSuccessMessage(): void {
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
    }

    refresh(): void {
        this.map.draw();
        var robot = this.map.getRobot();
        this.map.updateWorldState(this.worldState, robot.getX(), robot.getY());
        this.worldState.draw();
    }

    step(): boolean {
        var result = this.map.step(this.worldState);
        this.refresh();
        return result;
    }

    vstep(): void {
        this.map.vstep(this.worldState, this.map.getStepOptions(),
            () => {
                this.refresh();
                this.running = false;
                if (this.map.hasWon()) {
                    this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
                }
            },
            () => {
                this.refresh();
                this.running = false;
                if (this.map.hasWon()) {
                    this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
                }
            });
    }

    run(): boolean {
        if (this.running && !this.step()) {
            this.running = false;
            window.clearInterval(this.runinterval);
            return false;
        }
        if (this.running) {
            if (this.map.hasWon()) {
                this.running = false;
                window.clearInterval(this.runinterval);
                this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
            }
        }
        return true;
    }

    vrun(): void {
        if (this.running) {
            this.map.vstep(this.worldState, this.map.getStepOptions,
                () => {
                    this.refresh();
                    if (this.map.hasWon()) {
                        this.running = false;
                        this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
                    } else {
                        this.vrun();
                    }
                },
                () => {
                    this.refresh();
                    this.running = false;
                    if (this.map.hasWon()) {
                        this.map.showWinningMessage(() => { this.stopRun(() => this.testFast()); }, () => { this.pico.nextMap(); });
                    }
                });
        }
    }
}

enum StateEvent { NameChange, Removed };

interface StateEventListener {
    notify(s: State, se: StateEvent): void;
}

abstract class Map implements IMap {
    name: string;
    width: number;
    height: number;
    robot: Robot;
    canvas: HTMLCanvasElement;
    picocodebox: HTMLTextAreaElement = document.createElement("textarea");
    picocodeerrorbox: HTMLTextAreaElement = document.createElement("textarea");


    constructor(width: number, height: number, canvas: HTMLCanvasElement, name: string) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.name = name;
        this.picocodebox.classList.add("picocode");
        this.picocodeerrorbox.classList.add("picoerrors");
        this.picocodeerrorbox.readOnly = true;
        this.initRobot();
    }

    save(): void {
        var pp = PicoProgram.fromEditor(this.robot);
        localStorage.setItem("mapcode:" + this.name, pp.program.toText().join("\n"));
    }
    load(): boolean {
        var code = localStorage.getItem("mapcode:" + this.name);
        if (code) {
            var pp = PicoProgram.parse(code.split("\n"));
            var robot = pp.program.toEditor();
            robot.setPos(this.robot.getX(), this.robot.getY());
            this.setRobot(robot);
            return true;
        }
        return false;
    }
    clear() {
        var robot = new Robot(this.robot.getX(), this.robot.getY());
        this.setRobot(robot);
        if (localStorage.getItem("mapcode:" + this.name)) {
            localStorage.removeItem("mapcode:" + this.name);
        }
    }

    isStateless(): boolean {
        return false;
    }

    hasWon(): boolean {
        return false;
    }

    initRobot() {
        var start = this.generateRobotStart();
        this.robot = new Robot(start.x, start.y);
    }


    getPicoCodeBox(): HTMLTextAreaElement {
        return this.picocodebox;
    }
    getPicoErrorTextBox(): HTMLTextAreaElement {
        return this.picocodeerrorbox;
    }

    generateRobotStart(): { x: number, y: number } {
        var rx = Math.floor(Math.random() * (this.width - 2)) + 1;
        var ry = Math.floor(Math.random() * (this.height - 2)) + 1;
        return { x: rx, y: ry };
    }

    step(ws: IWorldState, options?: StepOptions): boolean {
        this.updateWorldState(ws, this.robot.getX(), this.robot.getY());
        if (!options) {
            options = this.getStepOptions();
        }
        return this.robot.step(this, ws, options);
    }

    vstep(ws: IWorldState, options: StepOptions, thenCont: () => void, elseCont: () => void): void {
        this.updateWorldState(ws, this.robot.getX(), this.robot.getY());
        if (!options) {
            options = this.getStepOptions();
        }
        return this.robot.vstep(this, ws, options, thenCont, elseCont);
    }

    getRobot(): Robot {
        return this.robot;
    }

    setRobot(robot: Robot) {
        this.robot = robot;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    updateWorldState(ws: IWorldState, x: number, y: number): void {
        var north: FieldState = FieldState.Empty;
        if (y <= 1) {
            north = FieldState.Wall;
        }
        ws.setNorth(north);
        var east: FieldState = FieldState.Empty;
        if (x >= this.width - 2) {
            east = FieldState.Wall;
        }
        ws.setEast(east);
        var south: FieldState = FieldState.Empty;
        if (y >= this.height - 2) {
            south = FieldState.Wall;
        }
        ws.setSouth(south);
        var west: FieldState = FieldState.Empty;
        if (x <= 1) {
            west = FieldState.Wall;
        }
        ws.setWest(west);
    }

    isValidPos(x: number, y: number): boolean {
        return (x >= 1 && y >= 1 && x < this.width - 1 && y < this.height - 1);
    }

    draw() {
        var fog = (<HTMLInputElement>document.getElementById("fogcheckbox")).checked;
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
    }

    drawContent(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
        //var canvas = this.canvas;
        //ctx.fillStyle = WALLCOLOR;
        //ctx.fillRect(0, 0, canvas.width, cellheight);
        //ctx.fillRect(0, 0, cellwidth, canvas.height);
        //ctx.fillRect(0, cellheight * (this.height - 1), canvas.width, canvas.height - (cellheight * (this.height - 1)));
        //ctx.fillRect(cellwidth * (this.width - 1), 0, canvas.width - (cellwidth * (this.width - 1)), canvas.height);
    }

    getStepOptions(): StepOptions {
        return new StepOptions();
    }

    reset(): void {
        var start = this.generateRobotStart();
        this.robot.setPos(start.x, start.y);
        this.robot.reset();
        this.draw();
    }

    private testInterval: number;
    private testing: boolean = false;
    private testingDone: boolean = true;
    private testRun = 0;

    isTesting(): boolean { return this.testing; }

    abstract handleTestWin(): boolean;

    abstract setupTest(): boolean;

    test(refreshcb: () => void, ws: IWorldState, donecb: (success: boolean) => void, finishedcb: () => void): (cont: () => void) => void {
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
            return (cont: () => void) => { cont(); };
        }
        refreshcb();
        this.draw();
        var options: StepOptions = this.getStepOptions();
        this.testInterval = window.setInterval(() => {
            if (this.testing == true && runid == this.testRun) {
                this.updateWorldState(ws, this.robot.getX(), this.robot.getY());
                if (this.hasWon()) {
                    if (!this.handleTestWin()) {
                        window.clearInterval(this.testInterval);
                        this.testing = false;
                        this.testingDone = true;
                        donecb(true);
                        finishedcb();
                        return;
                    }
                }
                if (!this.step(ws, options)) {
                    window.clearInterval(this.testInterval);
                    this.testing = false;
                    this.testingDone = true;
                    refreshcb();
                    donecb(false);
                    finishedcb();
                }
                else {
                    refreshcb();
                }
            }
        }, 10);
        return (cont: () => void) => {
            this.testing = false;
            this.testingDone = true;
            window.clearInterval(this.testInterval);
            finishedcb();
            cont();
        };
    }

    vtest(refreshcb: () => void, ws: IWorldState, donecb: (success: boolean) => void, finishedcb: () => void): (cont: () => void) => void {
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
        var continuation: () => void = () => { };
        var options: StepOptions = this.getStepOptions();
        var vstepfun = () => {
            refreshcb();
            if (this.hasWon()) {
                if (!this.handleTestWin()) {
                    this.testing = false;
                    this.testingDone = true;
                    donecb(true);
                    finishedcb();
                    continuation();
                    return;
                }
            }
            if (this.testing == true && runid == this.testRun) {
                this.vstep(ws, options, vstepfun,
                    () => {
                        this.testing = false;
                        this.testingDone = true;
                        donecb(false);
                        finishedcb();
                        continuation();
                    });
            } else {
                this.testingDone = true;
                finishedcb();
                continuation();
            }
        };
        vstepfun();
        return (cont: () => void) => { continuation = cont; this.testing = false; }
    }

    abstract showWinningMessage(runtests: () => void, nextmap: () => void): void;


    getName(): string {
        return this.name;
    }
}

function emptybools(width: number, height: number): boolean[][] {
    var bools: boolean[][] = [];
    for (var x = 0; x < width; x++) {
        bools[x] = [];
        for (var y = 0; y < height; y++) {
            bools[x][y] = false;
        }
    }
    return bools;
}

abstract class WallMap extends Map {

    walls: boolean[][];

    constructor(width: number, height: number, canvas: HTMLCanvasElement, name: string) {
        super(width, height, canvas, name);
        this.initWalls();
    }

    initWalls(): void {
        this.walls = emptybools(this.width, this.height);
    }

    surroundingWalls(): void {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1) {
                    this.walls[x][y] = true;
                }
            }
        }
    }

    reset(): void {
        this.initWalls();
        super.reset();
    }

    drawContent(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
        var canvas = this.canvas;
        ctx.fillStyle = WALLCOLOR;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (this.walls[x][y]) {
                    ctx.fillRect(x * cellwidth, y * cellheight, cellwidth, cellheight);
                }
            }
        }
    }

    isValidPos(x: number, y: number) {
        return super.isValidPos(x, y) && !this.walls[x][y];
    }

    updateWorldState(ws: IWorldState, x: number, y: number): void {
        var north: FieldState = FieldState.Empty;
        if (y>0&&this.walls[x][y - 1]) {
            north = FieldState.Wall;
        }
        ws.setNorth(north);
        var east: FieldState = FieldState.Empty;
        if (x<this.width-1&&this.walls[x + 1][y]) {
            east = FieldState.Wall;
        }
        ws.setEast(east);
        var south: FieldState = FieldState.Empty;
        if (y<this.height-1&&this.walls[x][y + 1]) {
            south = FieldState.Wall;
        }
        ws.setSouth(south);
        var west: FieldState = FieldState.Empty;
        if (x>0&&this.walls[x - 1][y]) {
            west = FieldState.Wall;
        }
        ws.setWest(west);
    }

    abstract getTestSetups(): (() => void)[];

    private testNumber = 99;

    setupTest(): boolean {
        this.robot.reset();
        this.testNumber = 0;
        var tss = this.getTestSetups();
        if (tss.length > 0) {
            tss[0]();
            return true;
        } else {
            return false;
        }
    }

    handleTestWin(): boolean {
        this.testNumber++;
        var tss = this.getTestSetups();
        if (this.testNumber < tss.length) {
            this.robot.reset();
            tss[this.testNumber]();
            return true;
        }
        return false;
    }
}

abstract class CleanMap extends WallMap {

    winningDialog: HTMLDivElement;
    cleanedSquares: boolean[][];

    constructor(width: number, height: number, canvas: HTMLCanvasElement, name: string) {
        super(width, height, canvas, name);
        this.cleanedSquares = emptybools(width, height);
        this.winningDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("You cleaned the whole room! Run tests to see if your program can handle some different starting locations for the robot, or go on to the next level!"));
        this.winningDialog.appendChild(winp);
    }


    step(ws: IWorldState, options?: StepOptions): boolean {
        this.cleanedSquares[this.robot.getX()][this.robot.getY()] = true;
        var ret: boolean = super.step(ws, options);
        this.cleanedSquares[this.robot.getX()][this.robot.getY()] = true;
        return ret;
    }
    vstep(ws: IWorldState, options: StepOptions, thenCont: () => void, elseCont: () => void): void {
        this.cleanedSquares[this.robot.getX()][this.robot.getY()] = true;
        super.vstep(ws, options,
            () => {
            this.cleanedSquares[this.robot.getX()][this.robot.getY()] = true;
            thenCont();
            }, () => {
            this.cleanedSquares[this.robot.getX()][this.robot.getY()] = true;
            elseCont();
        });
    }

    allCleaned(): boolean {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (!(this.cleanedSquares[i][j] || this.walls[i][j])) {
                    return false;
                }
            }
        }
        return true;
    }

    reset() {
        super.reset();
        this.cleanedSquares = emptybools(this.width, this.height);
    }

    setupTest(): boolean {
        this.cleanedSquares = emptybools(this.width, this.height);
        return super.setupTest();
    }

    handleTestWin(): boolean {
        if (super.handleTestWin()) {
            this.cleanedSquares = emptybools(this.width, this.height);
            return true;
        }
        return false;
    }

    drawContent(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
        super.drawContent(ctx, cellwidth, cellheight);
        ctx.fillStyle = "#dddddd";
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.cleanedSquares[i][j]) {
                    ctx.fillRect(i * cellwidth, j * cellheight, cellwidth, cellheight);
                }
            }
        }
    }

    hasWon(): boolean {
        return this.allCleaned();
    }
    showWinningMessage(runtests: () => void, nextmap: () => void): void {
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
    }
}

abstract class GoalMap extends WallMap {
    winningDialog: HTMLDivElement;

    constructor(width: number, height: number, canvas: HTMLCanvasElement, name: string) {
        super(width, height, canvas, name);
        this.winningDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("You reached the goal! Run tests to see if your program can handle all requirements of the map, or go on to the next level!"));
        this.winningDialog.appendChild(winp);
    }

    abstract getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[];

    hasWon(): boolean {
        var gz = this.getGoalZones();
        var rx = this.robot.getX();
        var ry = this.robot.getY();
        for (var i = 0; i < gz.length; i++) {
            if (rx >= gz[i].sx && rx <= gz[i].ex && ry >= gz[i].sy && ry <= gz[i].ey) {
                return true;
            }
        }
        return false;
    }

    drawContent(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
        super.drawContent(ctx, cellwidth, cellheight);
        var gz = this.getGoalZones();
        for (var i = 0; i < gz.length; i++) {
            drawFinish(ctx, gz[i].sx * cellwidth, gz[i].sy * cellheight, (gz[i].ex + 1) * cellwidth, (gz[i].ey + 1) * cellheight);
        }
    }
    showWinningMessage(runtests: () => void, nextmap: () => void): void {
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
    }
}

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


class SpiralMap extends GoalMap {
    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        super(width, height, canvas, "Spirals");
        this.robot.addState("State");
    }
    left: number;
    right: number;
    top: number;
    bottom: number;

    initWalls() {
        super.initWalls();
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
    }

    isStateless(): boolean {
        return true;
    }

    generateRobotStart() {
        var rx = 1;
        var ry = this.height - 2;
        return { x: rx, y: ry };
    }

    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        return [{ sx: this.left, sy: this.top, ex: this.right, ey: this.bottom }];
    }

    getTestSetups(): (() => void)[] {
        return [() => { this.robot.setPos(1, this.height - 2); }];
    }
}

class StartMap extends GoalMap {
    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        super(width, height, canvas, "First Steps");
        this.robot.addState("State");
    }

    initWalls() {
        super.initWalls();
        this.surroundingWalls();
        var maxdim: number = Math.min(this.width, this.height) - 3;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if ((x < this.width && x >= this.width - 3 - maxdim && y >= this.height - 1 - (x - (this.width - maxdim)))) {
                    this.walls[x][y] = true;
                }
            }
        }
    }

    isStateless(): boolean {
        return true;
    }

    generateRobotStart() {
        var rx = Math.floor(Math.random() * 5) + 1;
        var ry = Math.floor(Math.random() * (6 - rx)) + 1;
        ry = Math.min(ry, 5);
        return { x: rx, y: this.height - 6 + ry };
    }

    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        var maxdim: number = Math.min(this.width, this.height) - 3;
        return [{ sx: this.width - 2, sy: this.height - maxdim, ex: this.width - 2, ey: this.height - maxdim }];
    }

    getTestSetups(): (() => void)[] {
        var maxdim: number = Math.min(this.width, this.height) - 3;
        return [() => { this.robot.setPos(1, this.height - 2); }, () => { this.robot.setPos(2, this.height - 3), this.robot.setPos(this.width - maxdim, this.height - 4); }];
    }

}

class ObstacleMap extends GoalMap {

    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        super(width, height, canvas, "Obstacles");
    }

    initWalls() {
        super.initWalls();
        this.surroundingWalls();
        var halfwidth = Math.ceil(this.width / 2);
        var halfheight = Math.floor(this.height / 2);
        var obstacleheight = halfheight - 2;
        for (var i = 1; i < obstacleheight; i++) {
            this.walls[halfwidth][i] = true;
            this.walls[halfwidth][this.height - i - 1] = true;
        }
    }

    generateRobotStart() {
        var rx = 1;
        var ry = this.height - 2;
        return { x: rx, y: ry };
    }

    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        return [{ sx: this.width - 2, sy: this.height - 2, ex: this.width - 2, ey: this.height - 2 }];
    }

    getTestSetups(): (() => void)[] {
        return [() => { this.robot.setPos(1, this.height - 2); }];
    }
}

class DoorMap extends GoalMap {

    initWalls() {
        this.initDoorWalls(Math.floor(Math.random() * (this.height - 2)) + 1);
    }

    initDoorWalls(doorheight: number) {
        this.walls = emptybools(this.width, this.height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x == 0 || y == 0 || y == this.height - 1) {
                    this.walls[x][y] = true;
                } else if (x == this.width - 3 && y != doorheight) {
                    this.walls[x][y] = true;
                }
            }
        }
    }


    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        super(width, height, canvas, "Find the Door");
    }

    generateRobotStart() {
        var rx = 3;
        var ry = Math.floor(this.height / 2) + 1;
        return { x: rx, y: ry };
    }

    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        return [{ sx: this.width - 2, sy: 1, ex: this.width - 1, ey: this.height - 2 }];
    }

    getTestSetups(): (() => void)[] {
        var rs = this.generateRobotStart();
        return [() => { this.robot.setPos(rs.x, rs.y); this.initDoorWalls(1); },
        () => { this.robot.setPos(rs.x, rs.y); this.initDoorWalls(rs.y - 3); },
        () => { this.robot.setPos(rs.x, rs.y); this.initDoorWalls(rs.y); },
        () => { this.robot.setPos(rs.x, rs.y); this.initDoorWalls(rs.y + 3); },
        () => { this.robot.setPos(rs.x, rs.y); this.initDoorWalls(this.height - 2); }];
    }

}

function mirror_set_v(walls: boolean[][], x: number, y: number, height: number): void {
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

class MazeMap extends GoalMap {

    starty: number;

    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        if (width % 2 == 0) {
            width++;
        }
        if (height % 2 == 0) {
            height++;
        }
        //var sws = MazeMap.mazewalls(width, height);
        super(width, height, canvas, "Maze");
    }

    initWalls() {
        super.initWalls();
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x % 2 == 0 || y % 2 == 0) {
                    this.walls[x][y] = true;
                }
            }
        }
        var inmaze: boolean[][] = emptybools(this.width, this.height);
        this.starty = Math.floor(Math.random() * Math.floor(this.height / 2)) * 2 + 1;
        var walllist: Array<{ x: number, y: number, cx: number, cy: number }> = [];
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
    }

    isValidPos(x: number, y: number): boolean {
        if (x == 0 && y == this.starty) {
            return true;
        }
        return super.isValidPos(x, y);
    }

    //reset() {
    //    var sws = MazeMap.mazewalls(this.width, this.height);
    //    this.walls = sws.walls;
    //    this.starty = sws.starty;
    //    super.reset();
    //}

    generateRobotStart(): { x: number, y: number } {
        var rx = (Math.floor(Math.random() * Math.floor(this.width / 2)) * 2) + 1;
        var ry = (Math.floor(Math.random() * Math.floor(this.height / 2)) * 2) + 1;
        return { x: rx, y: ry };
    }

    //drawContent(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
    //    super.drawContent(ctx, cellwidth, cellheight);
    //    drawFinish(ctx, 0, this.starty * cellwidth, cellwidth, this.starty * cellwidth + cellheight);
    //}

    //hasWon(): boolean {
    //    return this.robot.getX() == 0;
    //}

    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        return [{ sx: 0, sy: this.starty, ex: 0, ey: this.starty }];
    }

    getTestSetups(): (() => void)[] {
        return [() => { this.robot.setPos(this.width - 6, 5); }, () => { this.robot.setPos(this.width - 8, Math.floor(this.height / 2) + ((Math.floor(this.height / 2) % 2) - 1)); }];
    }
}

class SquareRoomMap extends CleanMap {

    constructor(sidelength: number, canvas: HTMLCanvasElement) {
        super(sidelength, sidelength, canvas, "Square Room");
    }

    initWalls() {
        super.initWalls();
        this.surroundingWalls();
    }

    getTestSetups(): (() => void)[] {
        return [() => { this.robot.setPos(1, 1); }, () => { this.robot.setPos(4, this.height - 4); }, () => { this.robot.setPos(this.width - 8, Math.floor(this.height / 2)); }];
    }
}

class DiamondRoomMap extends CleanMap {

    constructor(sidelength, canvas: HTMLCanvasElement) {
        super(sidelength, sidelength, canvas, "Diamond Room");
    }

    initWalls() {
        super.initWalls();
        this.surroundingWalls();
        var halfside = Math.floor(this.width / 2);

        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (i == halfside || j == halfside) {
                    continue;
                }
                var x = i;
                var y = j;
                if (i > halfside) {
                    x = this.width - 1 - i;
                }
                if (j > halfside) {
                    y = this.height - 1 - j;
                }
                if (x + y <= halfside) {
                    this.walls[i][j] = true;
                }
            }
        }
    }

    generateRobotStart(): { x: number, y: number } {
        var halfside = Math.floor(this.width / 2);
        var rx = Math.floor(Math.random() * halfside);
        var ry = Math.floor(Math.random() * halfside);
        var x = 1;
        var y = halfside;
        while (rx > 0) {
            x++;
            y--;
            rx--;
        }
        while (ry > 0) {
            x++;
            y++;
            ry--;
        }
        return { x: x, y: y };
    }

    getTestSetups(): (() => void)[] {
        var halfside = Math.floor(this.width / 2);
        return [() => { this.robot.setPos(halfside, halfside); }, () => { this.robot.setPos(1, halfside); }, () => { this.robot.setPos(3, halfside - 2); }];
    }
}