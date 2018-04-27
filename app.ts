
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


enum Action { Stay, East, South, West, North };

interface IAction { }

interface IActionSelector<a extends IAction> {

}

class ActionSelector {
    stay: HTMLAnchorElement;
    north: HTMLAnchorElement;
    east: HTMLAnchorElement;
    south: HTMLAnchorElement;
    west: HTMLAnchorElement;

    activeElem: HTMLAnchorElement;

    action: Action;

    actionid: number = ActionSelector.actionidcnt++;

    static actionidcnt: number = 0;

    setAction(a: Action) {
        this.stay.className = "actionlink";
        this.north.className = "actionlink";
        this.east.className = "actionlink";
        this.south.className = "actionlink";
        this.west.className = "actionlink";
        this.action = a;
        switch (a) {
            case Action.Stay:
                this.activeElem = this.stay;
                break;
            case Action.North:
                this.activeElem = this.north;
                break;
            case Action.East:
                this.activeElem = this.east;
                break;
            case Action.South:
                this.activeElem = this.south;
                break;
            case Action.West:
                this.activeElem = this.west;
                break;
        }
        this.activeElem.className = "activeactionlink";
    }

    constructor(parent: HTMLElement) {

        var selector = this;

        var acta = document.createElement("a");
        acta.className = "actionlink";
        acta.href = "javascript:void()";
        acta.onclick = function () {
            selector.setAction(Action.Stay);
        }
        var actimg = document.createElement("img");
        actimg.src = "stop.png";
        actimg.title = "Stay";
        acta.appendChild(actimg);
        //acta.appendChild(document.createTextNode("Stay"));
        this.stay = acta;
        parent.appendChild(acta);

        acta = document.createElement("a");
        acta.className = "actionlink";
        acta.href = "javascript:void()";
        acta.onclick = function () {
            selector.setAction(Action.North);
        }
        actimg = document.createElement("img");
        actimg.src = "north.png";
        actimg.title = "North";
        acta.appendChild(actimg);
        //acta.appendChild(document.createTextNode("Up"));
        this.north = acta;
        parent.appendChild(acta);

        acta = document.createElement("a");
        acta.className = "actionlink";
        acta.href = "javascript:void()";
        acta.onclick = function () {
            selector.setAction(Action.East);
        }
        var actimg = document.createElement("img");
        actimg.src = "east.png";
        actimg.title = "East";
        acta.appendChild(actimg);
        //acta.appendChild(document.createTextNode("Right"));
        this.east = acta;
        parent.appendChild(acta);

        acta = document.createElement("a");
        acta.className = "actionlink";
        acta.href = "javascript:void()";
        acta.onclick = function () {
            selector.setAction(Action.West);
        }
        var actimg = document.createElement("img");
        actimg.src = "west.png";
        actimg.title = "West";
        acta.appendChild(actimg);
        //acta.appendChild(document.createTextNode("Left"));
        this.west = acta;
        parent.appendChild(acta);

        acta = document.createElement("a");
        acta.className = "actionlink";
        acta.href = "javascript:void()";
        acta.onclick = function () {
            selector.setAction(Action.South);
        }
        var actimg = document.createElement("img");
        actimg.src = "south.png";
        actimg.title = "South";
        acta.appendChild(actimg);
        //acta.appendChild(document.createTextNode("Down"));
        this.south = acta;
        parent.appendChild(acta);
        
        this.setAction(Action.Stay);
        this.stay.click();
    }

    actionString(): String {
        switch (this.action) {
            case Action.Stay:
                return "X";
            case Action.North:
                return "N";
            case Action.South:
                return "S";
            case Action.West:
                return "W";
            case Action.East:
                return "E";
        }
    }
}

class WPC {
    Cases: Array<WorldPattern> = new Array<WorldPattern>(
        new WorldPattern(FieldState.Empty, FieldState.Empty, FieldState.Empty, FieldState.Empty),
        new WorldPattern(FieldState.Empty, FieldState.Empty, FieldState.Empty, FieldState.Wall),
        new WorldPattern(FieldState.Empty, FieldState.Empty, FieldState.Wall, FieldState.Empty),
        new WorldPattern(FieldState.Empty, FieldState.Empty, FieldState.Wall, FieldState.Wall),
        new WorldPattern(FieldState.Empty, FieldState.Wall, FieldState.Empty, FieldState.Empty),
        new WorldPattern(FieldState.Empty, FieldState.Wall, FieldState.Empty, FieldState.Wall),
        new WorldPattern(FieldState.Empty, FieldState.Wall, FieldState.Wall, FieldState.Empty),
        new WorldPattern(FieldState.Empty, FieldState.Wall, FieldState.Wall, FieldState.Wall),
        new WorldPattern(FieldState.Wall, FieldState.Empty, FieldState.Empty, FieldState.Empty),
        new WorldPattern(FieldState.Wall, FieldState.Empty, FieldState.Empty, FieldState.Wall),
        new WorldPattern(FieldState.Wall, FieldState.Empty, FieldState.Wall, FieldState.Empty),
        new WorldPattern(FieldState.Wall, FieldState.Empty, FieldState.Wall, FieldState.Wall),
        new WorldPattern(FieldState.Wall, FieldState.Wall, FieldState.Empty, FieldState.Empty),
        new WorldPattern(FieldState.Wall, FieldState.Wall, FieldState.Empty, FieldState.Wall),
        new WorldPattern(FieldState.Wall, FieldState.Wall, FieldState.Wall, FieldState.Empty),
        new WorldPattern(FieldState.Wall, FieldState.Wall, FieldState.Wall, FieldState.Wall)
    );
}

class WorldPattern {
    north: FieldState;
    south: FieldState;
    west: FieldState;
    east: FieldState;

    constructor(north: FieldState, south: FieldState, west: FieldState, east: FieldState) {
        this.north = north;
        this.south = south;
        this.west = west;
        this.east = east;
    }

    matches(other: WorldPattern): boolean {
        var northmatch = other.north == this.north || other.north == FieldState.Unknown;
        var southmatch = other.south == this.south || other.south == FieldState.Unknown;
        var westmatch = other.west == this.west || other.west == FieldState.Unknown;
        var easthmatch = other.east == this.east || other.east == FieldState.Unknown;
        return northmatch && southmatch && westmatch && easthmatch;
    }

    toString(): string {
        return WorldPattern.fieldStateString(this.north, "N") + WorldPattern.fieldStateString(this.east, "E") + WorldPattern.fieldStateString(this.west, "W") + WorldPattern.fieldStateString(this.south, "S");
    }

    static fieldStateString(fs: FieldState, dir : string): string {
        switch (fs) {
            case FieldState.Empty:
                return "x";
            case FieldState.Unknown:
                return "*";
            case FieldState.Wall:
                return dir;
        }
    }
}


interface ILevel {
    getMap(): IMap;
}


class Pico {
    root: HTMLElement;
    mapcanvas: HTMLCanvasElement;
    statelist: HTMLSelectElement;
    maps: Array<IMap>;
    mapcontrols: MapControls;
    header: HTMLDivElement;
    mapspan: HTMLSpanElement;
   
    static createCanvas(): HTMLCanvasElement {
        var canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        return canvas;
    }

    constructor() {
        this.maps = [];
        this.maps.push(new SpiralMap(25, 25, Pico.createCanvas()));
        this.maps.push(new ObstacleMap(15, 15, Pico.createCanvas()));
        this.maps.push(new SquareRoomMap(25, Pico.createCanvas()));
        this.maps.push(new DiamondRoomMap(25, Pico.createCanvas()));
        this.maps.push(new StartMap(15, 15, Pico.createCanvas()));
        this.maps.push(new DoorMap(25, 25, Pico.createCanvas()));
        this.maps.push(new MazeMap(25, 25, Pico.createCanvas()));
        var pico = this;
    }
    
    init(): void {
        this.mapcontrols = new MapControls(
            this,
            <HTMLDivElement>document.getElementById("mapcanvas"),
            <HTMLDivElement>document.getElementById("mapdata"),
            <HTMLDivElement>document.getElementById("gui"),
            <HTMLDivElement>document.getElementById("code"),
            <HTMLDivElement>document.getElementById("help"));
        this.header = <HTMLDivElement>document.getElementById("header");
        var leftbutton = document.createElement("button");
        leftbutton.classList.add("mapleft");
        leftbutton.addEventListener("click", () => {
            this.previousMap();
        })

        this.header.appendChild(leftbutton);

        var mapselectdiv = document.createElement("div");
        mapselectdiv.classList.add("mapselect");
        this.mapspan = document.createElement("span");
        mapselectdiv.appendChild(this.mapspan);

        //var mapselectbutton = document.createElement("button");
        //mapselectbutton.classList.add("mapselect");
        //mapselectdiv.appendChild(mapselectbutton);

        this.header.appendChild(mapselectdiv);


        var rightbutton = document.createElement("button");
        rightbutton.classList.add("mapright");
        rightbutton.addEventListener("click", () => {
            this.nextMap();
        })

        this.header.appendChild(rightbutton);

        this.changeMap(this.maps[0]);
    }

    changeMap(map : IMap) {
        this.mapcontrols.setMap(map);
        this.mapspan.innerText = map.getName();
    }

    nextMap() {
        var index = this.maps.indexOf(this.mapcontrols.getMap()) + 1;
        while (index >= this.maps.length) {
            index -= this.maps.length;
        }
        this.changeMap(this.maps[index]);
    }

    previousMap() {
        var index = this.maps.indexOf(this.mapcontrols.getMap()) - 1;
        while (index < 0) {
            index += this.maps.length;
        }
        this.changeMap(this.maps[index]);
    }
}