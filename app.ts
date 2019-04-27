
var WALLCOLOR = "#B31B1B";
var ROBOTCOLOR = "#6EB43F";

function isAncestor(descendant: Node, ancestor: Node): boolean {
    if (descendant == null) {
        return false;
    }
    if (descendant == ancestor) {
        return true;
    }
    else {
        return isAncestor(descendant.parentNode, ancestor);
    }
}

class Pico {
    mapcanvas: HTMLCanvasElement;
    guidiv: HTMLDivElement;
    controldiv: HTMLDivElement;
    levels: Array<ILevel>;
    header: HTMLDivElement;
    mapspan: HTMLSpanElement;
    currentLevel: ILevel;

    static createCanvas(): HTMLCanvasElement {
        var canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        return canvas;
    }

    constructor() {
        this.levels = [];
        this.levels.push(new StartLevel());
        this.levels.push(new StupidLevel());
        this.levels.push(new SpiralLevel());
        this.levels.push(new SnakeLevel());
        this.levels.push(new MazeLevel());
        this.levels.push(new SquareRoomLevel());
        this.levels.push(new DiamondRoomLevel());
        this.levels.push(new HardMazeLevel());
    }

    static instance: Pico = new Pico();
    static getInstance(): Pico { return Pico.instance; }

    init(): void {
        this.mapcanvas = Pico.createCanvas();
        document.getElementById("mapcanvas").appendChild(this.mapcanvas);
        this.guidiv = document.createElement("div");
        this.guidiv.classList.add("guicontainer");
        document.getElementById("gui").appendChild(this.guidiv);
        this.controldiv = document.createElement("div");
        document.getElementById("mapdata").appendChild(this.controldiv);
        this.header = <HTMLDivElement>document.getElementById("header");
        var leftbutton = document.createElement("button");
        leftbutton.classList.add("mapleft");
        leftbutton.addEventListener("click", () => {
            this.previousLevel();
        })

        this.header.appendChild(leftbutton);

        var mapselectdiv = document.createElement("div");
        mapselectdiv.classList.add("mapselect");
        this.mapspan = document.createElement("span");
        mapselectdiv.appendChild(this.mapspan);


        this.header.appendChild(mapselectdiv);


        var rightbutton = document.createElement("button");
        rightbutton.classList.add("mapright");
        rightbutton.addEventListener("click", () => {
            this.nextLevel();
        })

        this.header.appendChild(rightbutton);

        this.changeLevel(this.levels[0]);
    }

    changeLevel(level: ILevel) {
        if (this.currentLevel) {
            this.currentLevel.toBackground();
        }
        this.currentLevel = level;
        this.mapspan.innerText = level.getName();
        level.toForeground(this.mapcanvas, this.controldiv, this.guidiv);
    }

    nextLevel() {
        var index = this.levels.indexOf(this.currentLevel) + 1;
        while (index >= this.levels.length) {
            index -= this.levels.length;
        }
        this.changeLevel(this.levels[index]);
    }

    previousLevel() {
        var index = this.levels.indexOf(this.currentLevel) - 1;
        while (index < 0) {
            index += this.levels.length;
        }
        this.changeLevel(this.levels[index]);
    }
}