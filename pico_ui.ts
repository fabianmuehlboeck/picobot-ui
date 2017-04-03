// JavaScript source code

//function handler() {
//    if (oReq.readyState == 4 /* complete */) {
//        if (oReq.status == 200) {
//            oReq.responseBody
//        }
//    }
//}

//var oReq = new XMLHttpRequest();
//if (oReq != null) {
//    oReq.open("GET", "https://www.cs.hmc.edu/picobot/", true);
//    oReq.onreadystatechange = handler;
//    oReq.send();
//}
//else {
//    window.console.log("AJAX (XMLHTTP) not supported.");
//}

class Pico {
    states: { [name: string]: State } = {};
    statenames: Array<string> = new Array<string>();

    static Instance: Pico = new Pico();

    constructor() {
        this.getState("State 0");
    }

    getState(name: string): State {
        if (!this.states[name]) {
            this.states[name] = new State(name);
            this.statenames.push(name);
        }
        return this.states[name];
    }

    namechange(oldname: string, newname: string): boolean {
        if (this.states[oldname] && !this.states[newname]) {
            this.states[newname] = this.states[oldname];
            delete this.states[oldname];
            this.statenames.splice(this.statenames.indexOf(oldname), 1, newname);
            return true;
        }
        return false;
    }
}

class State {

    div: HTMLDivElement;
    name: string;
    options: Array<HTMLOptionElement> = new Array<HTMLOptionElement>();
    body: HTMLTableSectionElement;
    rules: Array<Rule> = new Array<Rule>();

    constructor(name: string) {
        this.name = name;
        this.div = new HTMLDivElement();
        var table = new HTMLTableElement();
        var header = table.createTHead();

        this.body = table.createTBody();
        var s = this;
        var row = this.body.insertRow();
        var cell = row.insertCell();
        cell.colSpan = 3;
        var button = new HTMLButtonElement();
        button.value = "New State";
        button.onclick = function () {
            s.rules.push(new Rule(s));
        }
    }

    makeOption(state : State): HTMLOptionElement {
        var option = new HTMLOptionElement();
        option.value = this.name;
        option.innerText = this.name;
        if (this == state) {
            option.selected = true;
        } else {
            option.selected = false;
        }
        this.options.push(option);
        return option;
    }

    changeName(newName: string): void {
        this.name = newName;
        this.options.forEach(function (val, index, array) {
            val.value = newName;
            val.innerText = newName;
        });
    }
}

enum Action { Stay, East, South, West, North };

class ActionSelector {
    stay: HTMLInputElement;
    north: HTMLInputElement;
    east: HTMLInputElement;
    south: HTMLInputElement;
    west: HTMLInputElement;

    action: Action;

    actionid: number = ActionSelector.actionidcnt++;

    static actionidcnt: number = 0;

    setAction(a: Action) {
        this.action = a;
    }

    constructor(parent: HTMLElement) {

        var selector = this;

        var div = new HTMLDivElement();
        div.className = "actiondiv";
        this.stay = new HTMLInputElement();
        this.stay.type = "radio";
        this.stay.name = "action" + String(this.actionid);
        this.stay.value = "stay";
        this.stay.onselect = function () {
            selector.setAction(Action.Stay);
        }
        div.appendChild(this.stay);
        parent.appendChild(div);
        div = new HTMLDivElement();
        div.className = "actiondiv";
        div.innerText = "Stay";
        div.appendChild(this.stay);
        parent.appendChild(div);

        div = new HTMLDivElement();
        div.className = "actiondiv";
        this.north = new HTMLInputElement();
        this.north.type = "radio";
        this.north.name = "action" + String(this.actionid);
        this.north.value = "north";
        this.north.onselect = function () {
            selector.setAction(Action.North);
        }
        div.appendChild(this.north);
        parent.appendChild(div);
        div = new HTMLDivElement();
        div.className = "actiondiv";
        div.innerText = "Up";
        div.appendChild(this.stay);
        parent.appendChild(div);

        div = new HTMLDivElement();
        div.className = "actiondiv";
        this.east = new HTMLInputElement();
        this.east.type = "radio";
        this.east.name = "action" + String(this.actionid);
        this.east.value = "east";
        this.east.onselect = function () {
            selector.setAction(Action.East);
        }
        div.appendChild(this.east);
        parent.appendChild(div);
        div = new HTMLDivElement();
        div.className = "actiondiv";
        div.innerText = "Right";
        div.appendChild(this.stay);
        parent.appendChild(div);

        div = new HTMLDivElement();
        div.className = "actiondiv";
        this.south = new HTMLInputElement();
        this.south.type = "radio";
        this.south.name = "action" + String(this.actionid);
        this.south.value = "south";
        this.south.onselect = function () {
            selector.setAction(Action.South);
        }
        div.appendChild(this.south);
        parent.appendChild(div);
        div = new HTMLDivElement();
        div.className = "actiondiv";
        div.innerText = "Down";
        div.appendChild(this.stay);
        parent.appendChild(div);

        div = new HTMLDivElement();
        div.className = "actiondiv";
        this.west = new HTMLInputElement();
        this.west.type = "radio";
        this.west.name = "action" + String(this.actionid);
        this.west.value = "west";
        this.west.onselect = function () {
            selector.setAction(Action.West);
        }
        div.appendChild(this.west);
        parent.appendChild(div);
        div = new HTMLDivElement();
        div.className = "actiondiv";
        div.innerText = "Left";
        div.appendChild(this.stay);
        parent.appendChild(div);
    }
}

class Rule {

    row: HTMLTableRowElement;
    worldState: WorldState;
    actionSelector: ActionSelector;
    stateSelector: StateSelector;

    constructor(state: State) {
        this.row = state.body.insertRow(state.body.rows.length-1);
        var canvas = new HTMLCanvasElement();
        var cell = this.row.insertCell();
        cell.appendChild(canvas);
        this.worldState = new WorldState(canvas);
        cell = this.row.insertCell();
        this.actionSelector = new ActionSelector(cell);
        cell = this.row.insertCell();
        this.stateSelector = new StateSelector(cell, state);
    }

    getWorldState(): WorldState {
        return this.worldState;
    }

    getAction(): Action {
        return this.actionSelector.action;
    }

    getState(): State {
        return this.stateSelector.selectedState;
    }
}

class StateSelector {

    selector: HTMLSelectElement;
    selectedState: State;

    constructor(cell: HTMLTableCellElement, state : State) {
        var selector = new HTMLSelectElement();
        var ss = this;
        this.selectedState = state;
        Pico.Instance.statenames.forEach(function (val, index, array) {
            selector.add(Pico.Instance.getState(val).makeOption(state));
        });
        this.selector = selector;
        cell.appendChild(selector);
        selector.onchange = function () {
            ss.selectedState = Pico.Instance.getState(selector.value);
        };
    }
}

enum FieldState { Empty, Unknown, Wall };

class WorldState {

    north: FieldState;
    south: FieldState;
    west: FieldState;
    east: FieldState;
    canvas: HTMLCanvasElement;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        var ws = this;
        canvas.onclick = function (e) { ws.clicked(e); };
        this.north = FieldState.Unknown;
        this.south = FieldState.Unknown;
        this.west = FieldState.Unknown;
        this.east = FieldState.Unknown;
        this.draw();
    }

    draw() {
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(16, 16, 16, 16)
        WorldState.drawColor(ctx, this.north, 16, 0);
        WorldState.drawColor(ctx, this.south, 16, 32);
        WorldState.drawColor(ctx, this.west, 0, 16);
        WorldState.drawColor(ctx, this.east, 32, 16);
    }

    clicked(e: MouseEvent) {
        var posx = 0;
        var posy = 0;
        posx = e.offsetX;
        posy = e.offsetY;

        if (posx >= 0 && posx < 16 && posy >= 16 && posy < 32) {
            this.west = WorldState.cycle(this.west);
            this.draw();
        }
        if (posx >= 16 && posx < 32) {
            if (posy >= 0 && posy < 16) {
                this.north = WorldState.cycle(this.north);
                this.draw();
            }
            if (posy >= 32 && posy < 48) {
                this.south = WorldState.cycle(this.south);
                this.draw();
            }
        }
        if (posx >= 32 && posx < 48 && posy >= 16 && posy < 32) {
            this.east = WorldState.cycle(this.east);
            this.draw();
        }
    }

    static cycle(status: FieldState): FieldState {
        switch (status) {
            case FieldState.Empty:
                return FieldState.Unknown;
            case FieldState.Unknown:
                return FieldState.Wall;
            case FieldState.Wall:
                return FieldState.Empty;
        }
    }

    static drawColor(ctx: CanvasRenderingContext2D, state: FieldState, x: number, y: number) {
        switch (state) {
            case FieldState.Empty:
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(x, y, 16, 16);
                break;
            case FieldState.Unknown:
                ctx.fillStyle = "#000000";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("?", x + 8, y + 8);
                break;
            case FieldState.Wall:
                ctx.fillStyle = "#0000ff";
                ctx.fillRect(x, y, 16, 16);
                break;
        }
    }
}