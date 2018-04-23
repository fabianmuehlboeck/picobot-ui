
interface IMap {
    updateWorldState(ws: IWorldState, x: number, y: number): void;
    isValidPos(x: number, y: number): boolean;
    draw(): void;
    getRobot(): Robot;
    step(ws: IWorldState, options?: StepOptions): boolean;
    vstep(ws: IWorldState, options: StepOptions, thenCont: () => void, elseCont: () => void): void;
    getCanvas(): HTMLCanvasElement;
    getStepOptions(): StepOptions;
    reset(): void;
    test(rcb: () => void): void;
    hasWon(): boolean;
    showWinningMessage(): void;
    getName(): string;
    isStateless(): boolean;
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
    map: IMap;
    worldState: DrawWorldState;
    _isrunning: boolean = false;
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
    setMap(map: IMap) {
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
    }

    constructor(canvasParent: HTMLDivElement, controlParent: HTMLDivElement, editorDiv: HTMLDivElement, codeDiv: HTMLDivElement, helpDiv: HTMLDivElement) {
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
                    mc.runinterval = window.setInterval(() => { mc.run(); }, 50);
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
        })
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
            mc.map.test(() => { mc.refresh(); });
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

        (<any>$(fogcheckbox)).checkboxradio();
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
                    this.map.showWinningMessage();
                }
            },
            () => {
                this.refresh();
                if (this.map.hasWon()) {
                    this.map.showWinningMessage();
                }
                this.running = false;
            });
    }

    run(): boolean {
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
    }

    vrun(): void {
        if (this.running) {
            this.map.vstep(this.worldState, this.map.getStepOptions,
                () => {
                    this.refresh();
                    if (this.map.hasWon()) {
                        this.map.showWinningMessage();
                        this.running = false;
                    } else {
                        this.vrun();
                    }
                },
                () => {
                    this.refresh();
                    this.running = false;
                    if (this.map.hasWon()) {
                        this.map.showWinningMessage();
                    }
                });
        }
    }
}

enum StateEvent { NameChange, Removed };

interface StateEventListener {
    notify(s: State, se: StateEvent): void;
}

class Map implements IMap {
    width: number;
    height: number;
    robot: Robot;
    canvas: HTMLCanvasElement;

    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.initRobot();
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
        this.robot.setState(this.robot.states[this.robot.statenames[0]]);
        this.draw();
    }

    test(rcb: () => void): void {

    }

    showWinningMessage(): void {

    }

    getName(): string {
        return "INVALID MAP";
    }
}

class WallMap extends Map {

    walls: boolean[][];

    constructor(width: number, height: number, canvas: HTMLCanvasElement, walls: boolean[][]) {
        super(width, height, canvas);
        this.walls = walls;
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
        if (this.walls[x][y - 1]) {
            north = FieldState.Wall;
        }
        ws.setNorth(north);
        var east: FieldState = FieldState.Empty;
        if (this.walls[x + 1][y]) {
            east = FieldState.Wall;
        }
        ws.setEast(east);
        var south: FieldState = FieldState.Empty;
        if (this.walls[x][y + 1]) {
            south = FieldState.Wall;
        }
        ws.setSouth(south);
        var west: FieldState = FieldState.Empty;
        if (this.walls[x - 1][y]) {
            west = FieldState.Wall;
        }
        ws.setWest(west);
    }
}

class EmptyMap extends WallMap {
    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        var walls: boolean[][] = [];
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
        super(width, height, canvas, walls);
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

class StartMap extends WallMap {
    winningDialog: HTMLDivElement;
    constructor(width: number, height: number, canvas: HTMLCanvasElement, walls?: boolean[][]) {
        if (!walls) {
            walls = emptybools(width, height);
        }
        var maxdim: number = Math.min(width - 2, height) - 3;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
                    walls[x][y] = true;
                } else if ((x < width - 3 && x >= width - 3 - maxdim && y >= height - 1 - (x - (width - 3 - maxdim)))) {
                    walls[x][y] = true;
                }
            }
        }
        super(width, height, canvas, walls);
        this.winningDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("You reached the goal! Run tests to see if your program can handle some variations of this map, or go on to the next level!"));
        this.winningDialog.appendChild(winp);
    }

    isStateless(): boolean {
        return true;
    }

    generateRobotStart() {
        var rx = Math.floor(Math.random() * 5) + 1;
        var ry = Math.floor(Math.random() * (6 - rx)) + 1;
        ry = Math.min(ry, 5);
        return { x: rx, y: this.height-6+ry };
    }

    drawContent(ctx: CanvasRenderingContext2D, cellwidth : number, cellheight :number) {
        super.drawContent(ctx, cellwidth, cellheight);
        drawFinish(ctx, (this.width - 3) * cellwidth, (this.height - 2) * cellheight, (this.width - 2) * cellwidth, (this.height - 1) * cellheight);
    }

    hasWon(): boolean {
        return this.robot.getX() == this.width - 3 && this.robot.getY() == this.height-2;
    }
    showWinningMessage(): void {
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
    }

    getName(): string {
        return "First Steps";
    }
}

class DoorMap extends WallMap {

    static doorwalls(width: number, height: number, walls?: boolean[][]): boolean[][] {
        if (!walls) {
            walls = emptybools(width, height);
        }
        var doorheight = Math.floor(Math.random() * (height - 2)) + 1;
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (x == 0 || y == 0 || y == height - 1) {
                    walls[x][y] = true;
                } else if (x == width - 3 && y != doorheight) {
                    walls[x][y] = true;
                }
            }
        }
        return walls;
    }

    winningDialog: HTMLDivElement;

    constructor(width: number, height: number, canvas: HTMLCanvasElement, walls?: boolean[][]) {
        super(width, height, canvas, DoorMap.doorwalls(width, height, walls));
        this.winningDialog = document.createElement("div");
        var winp = document.createElement("p");
        winp.appendChild(document.createTextNode("You reached the goal! Run tests to see if your program can handle some variations of this map, or go on to the next level!"));
        this.winningDialog.appendChild(winp);
    }

    generateRobotStart() {
        var rx = 3;
        var ry = Math.floor(this.height / 2) + 1;
        return { x: rx, y: ry };
    }

    reset() {
        this.walls = DoorMap.doorwalls(this.width, this.height);
        super.reset();
    }

    drawContent(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
        super.drawContent(ctx, cellwidth, cellheight);
        drawFinish(ctx, this.canvas.width - cellwidth * 2, cellheight, this.canvas.width, this.canvas.height - cellheight);
    }

    hasWon(): boolean {
        return this.robot.getX() > this.width - 3;
    }
    showWinningMessage(): void {
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
    }

    getName(): string {
        return "Find the Door";
    }
}

function mirror_set_v(walls: boolean[][], x: number, y: number, height: number): void {
    walls[x][y] = true;
    walls[x][height - y - 1] = true;
}

class StateDoorMap extends DoorMap {
    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        var walls: boolean[][] = emptybools(width, height);
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
        super(width, height, canvas, walls);
    }
}

class MazeMap extends WallMap {

    static mazewalls(width: number, height: number): { walls: boolean[][], starty: number } {
        var walls: boolean[][] = emptybools(width, height);
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (x % 2 == 0 || y % 2 == 0) {
                    walls[x][y] = true;
                }
            }
        }
        var inmaze: boolean[][] = emptybools(width, height);
        var starty = Math.floor(Math.random() * Math.floor(height / 2)) * 2 + 1;
        var walllist: Array<{ x: number, y: number, cx: number, cy: number }> = [];
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
    }

    starty: number;

    constructor(width: number, height: number, canvas: HTMLCanvasElement) {
        if (width % 2 == 0) {
            width++;
        }
        if (height % 2 == 0) {
            height++;
        }
        var sws = MazeMap.mazewalls(width, height);
        super(width, height, canvas, sws.walls);
        this.starty = sws.starty;
    }

    reset() {
        var sws = MazeMap.mazewalls(this.width, this.height);
        this.walls = sws.walls;
        this.starty = sws.starty;
        super.reset();
    }

    generateRobotStart(): { x: number, y: number } {
        var rx = (Math.floor(Math.random() * Math.floor(this.width / 2)) * 2) + 1;
        var ry = (Math.floor(Math.random() * Math.floor(this.height / 2)) * 2) + 1;
        return { x: rx, y: ry };
    }

    drawContent(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
        super.drawContent(ctx, cellwidth, cellheight);
        drawFinish(ctx, 0, this.starty * cellwidth, cellwidth, this.starty * cellwidth + cellheight);
    }

    hasWon(): boolean {
        return this.robot.getX() == 0;
    }

    getName(): string {
        return "Maze";
    }
}