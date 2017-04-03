//class Greeter {
//    element: HTMLElement;
//    span: HTMLElement;
//    timerToken: number;

//    constructor(element: HTMLElement) {
//        this.element = element;
//        this.element.innerHTML += "The time is: ";
//        this.span = document.createElement('span');
//        this.element.appendChild(this.span);
//        this.span.innerText = new Date().toUTCString();
//    }

//    start() {
//        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
//    }

//    stop() {
//        clearTimeout(this.timerToken);
//    }

//}

//window.onload = () => {
//    var el = document.getElementById('content');
//    var greeter = new Greeter(el);
//    greeter.start();
//};

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

class State {

    div: HTMLDivElement;
    name: string;
    options: Array<HTMLOptionElement> = new Array<HTMLOptionElement>();
    body: HTMLTableSectionElement;
    rules: Array<Rule> = new Array<Rule>();
    heading: HTMLHeadingElement;
    tempid: number;

    constructor(name: string) {
        var s = this;
        Pico.Instance.statenames.push(name);
        Pico.Instance.states[name] = this;
        this.name = name;
        this.div = document.createElement("div");
        this.heading = document.createElement("h1");
        this.heading.innerText = name;
        this.div.appendChild(this.heading);
        var namebutton = document.createElement("button");
        namebutton.innerText = "Change State Name";
        namebutton.onclick = function () {
            var newname = prompt("Please enter a new name for this state", name);
            if (Pico.Instance.namechange(s.name, newname)) {
                s.changeName(newname);
            } else {
                alert("Name \"" + newname + "\" is already in use!");
            }
        }
        this.div.appendChild(namebutton);
        var delbutton = document.createElement("button");
        delbutton.innerText = "Delete State";
        delbutton.onclick = function () {
            Pico.Instance.deleteState(s);
        }
        this.div.appendChild(delbutton);
        var table = document.createElement("table");
        var header = table.createTHead();
        var hrow = header.insertRow();
        var hcell = hrow.insertCell();
        hcell = hrow.insertCell();
        hcell.innerText = "Case";
        hcell = hrow.insertCell();
        hcell.innerText = "Move to";
        hcell = hrow.insertCell();
        hcell.innerText = "Switch to State";
        hcell = hrow.insertCell();
        this.body = table.createTBody();
        var row = this.body.insertRow();
        var cell = row.insertCell();
        cell.colSpan = 3;
        var button = document.createElement("button");
        button.value = "New Rule";
        button.innerText = "New Rule";
        button.onclick = function () {
            var rule = new Rule(s);
            s.rules.push(rule);
        }
        cell.appendChild(button);
        this.div.appendChild(table);
    }

    init(): void {
        var rule = new Rule(this);
        this.rules.push(rule);
    }

    makeOption(state: State): HTMLOptionElement {
        var option = document.createElement("option");
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
        this.heading.innerText = newName;
        this.name = newName;
        this.options.forEach(function (val, index, array) {
            val.value = newName;
            val.innerText = newName;
        });
    }

    delete(): void {
        this.options.forEach(function (val, index, array) {
            val.parentNode.removeChild(val);
        });
        this.rules.forEach(function (val, index, array) {
            val.delete();
        });
    }

    removeRule(r: Rule) {
        var index = this.rules.indexOf(r);
        if (index == 0 && this.rules.length > 1) {
            this.rules[1].upbutton.disabled = true;
        }
        if (index == this.rules.length - 1 && this.rules.length > 1) {
            this.rules[index - 1].downbutton.disabled = true;
        }
        r.delete();
        this.rules.splice(index, 1);
    }

    moveUpRule(r: Rule) : void {
        var index = this.rules.indexOf(r);
        if (index > 0) {
            var swapper = this.rules[index - 1];
            this.rules.splice(index - 1, 2, r, swapper);
            var rrow = this.body.rows.item(index);
            var srow = this.body.rows.item(index - 1);
            this.body.removeChild(rrow);
            this.body.insertBefore(rrow, srow);
            swapper.upbutton.disabled = false;
            swapper.downbutton.disabled = index + 1 >= this.rules.length;
            r.upbutton.disabled = index - 1 == 0;
            r.downbutton.disabled = false;
        }
    }

    moveDownRule(r: Rule): void {
        var index = this.rules.indexOf(r);
        if (index >= 0 && index + 1 < this.rules.length) {
            var swapper = this.rules[index + 1];
            this.rules.splice(index, 2, swapper, r);
            var rrow = this.body.rows.item(index);
            var srow = this.body.rows.item(index + 1);
            this.body.removeChild(srow);
            this.body.insertBefore(srow, rrow);
            swapper.downbutton.disabled = false;
            swapper.upbutton.disabled = index == 0;
            r.upbutton.disabled = false;
            r.downbutton.disabled = index + 2 >= this.rules.length;
        }
    }

    toCode(): Array<string> {
        var s = this;
        var ret = new Array<string>();
        var cases = new WPC();
        this.rules.forEach(function (rule, index, array) {
            var matches = cases.Cases.filter(function (pattern, i, a) {
                return pattern.matches(rule.getWorldState().getPattern());
            });
            matches.forEach(function (pattern, i, a) {
                cases.Cases.splice(cases.Cases.indexOf(pattern), 1);
                ret.push(String(s.tempid) + " " + pattern.toString() + " -> " + rule.actionSelector.actionString() + " " + String(rule.getState().tempid));
            });
        });
        return ret;
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

        var div = document.createElement("div");
        div.className = "actiondiv";
        this.stay = document.createElement("input");
        this.stay.type = "radio";
        this.stay.name = "action" + String(this.actionid);
        this.stay.value = "stay";
        this.stay.onselect = function () {
            selector.setAction(Action.Stay);
        }
        div.appendChild(this.stay);
        parent.appendChild(div);
        div = document.createElement("div");
        div.className = "actiondiv";
        div.innerText = "Stay";
        parent.appendChild(div);

        div = document.createElement("div");
        div.className = "actiondiv";
        this.north = document.createElement("input");
        this.north.type = "radio";
        this.north.name = "action" + String(this.actionid);
        this.north.value = "north";
        this.north.onclick = function () {
            selector.setAction(Action.North);
        }
        div.appendChild(this.north);
        parent.appendChild(div);
        div = document.createElement("div");
        div.className = "actiondiv";
        div.innerText = "Up";
        parent.appendChild(div);

        div = document.createElement("div");
        div.className = "actiondiv";
        this.east = document.createElement("input");
        this.east.type = "radio";
        this.east.name = "action" + String(this.actionid);
        this.east.value = "east";
        this.east.onclick = function () {
            selector.setAction(Action.East);
        }
        div.appendChild(this.east);
        parent.appendChild(div);
        div = document.createElement("div");
        div.className = "actiondiv";
        div.innerText = "Right";
        parent.appendChild(div);

        div = document.createElement("div");
        div.className = "actiondiv";
        this.south = document.createElement("input");
        this.south.type = "radio";
        this.south.name = "action" + String(this.actionid);
        this.south.value = "south";
        this.south.onclick = function () {
            selector.setAction(Action.South);
        }
        div.appendChild(this.south);
        parent.appendChild(div);
        div = document.createElement("div");
        div.className = "actiondiv";
        div.innerText = "Down";
        parent.appendChild(div);

        div = document.createElement("div");
        div.className = "actiondiv";
        this.west = document.createElement("input");
        this.west.type = "radio";
        this.west.name = "action" + String(this.actionid);
        this.west.value = "west";
        this.west.onclick = function () {
            selector.setAction(Action.West);
        }
        div.appendChild(this.west);
        parent.appendChild(div);
        div = document.createElement("div");
        div.className = "actiondiv";
        div.innerText = "Left";
        parent.appendChild(div);
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

class Rule {

    row: HTMLTableRowElement;
    worldState: WorldState;
    actionSelector: ActionSelector;
    stateSelector: StateSelector;

    upbutton: HTMLButtonElement;
    downbutton: HTMLButtonElement;

    constructor(state: State) {
        var r = this;
        this.row = state.body.insertRow(state.body.rows.length - 1);
        var canvas = document.createElement("canvas");
        var cell = this.row.insertCell();
        var upbutton = document.createElement("button");
        upbutton.innerText = "Move rule up";
        upbutton.onclick = function () {
            state.moveUpRule(r);
        }
        upbutton.disabled = state.body.rows.length <= 2;
        cell.appendChild(upbutton);
        this.upbutton = upbutton;
        var downbutton = document.createElement("button");
        downbutton.innerText = "Move rule down";
        downbutton.disabled = true;
        downbutton.onclick = function () {
            state.moveDownRule(r);
        }
        if (state.rules.length > 0) {
            state.rules[state.rules.length - 1].downbutton.disabled = false;
        }
        this.downbutton = downbutton;
        cell.appendChild(downbutton);
        cell = this.row.insertCell();
        cell.appendChild(canvas);
        canvas.width = 48;
        canvas.height = 48;
        this.worldState = new WorldState(canvas);
        cell = this.row.insertCell();
        this.actionSelector = new ActionSelector(cell);
        cell = this.row.insertCell();
        this.stateSelector = new StateSelector(cell, state);
        cell = this.row.insertCell();
        var delbutton = document.createElement("button");
        delbutton.innerText = "Delete rule";
        delbutton.onclick = function () {
            state.removeRule(r);
        }
        cell.appendChild(delbutton);
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

    delete(): void {
        this.row.parentNode.removeChild(this.row);
        Pico.Instance.stateselectors.splice(Pico.Instance.stateselectors.indexOf(this.stateSelector));
    }
}

class StateSelector {

    selector: HTMLSelectElement;
    selectedState: State;

    constructor(cell: HTMLTableCellElement, state: State) {
        var selector = document.createElement("select");
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
        Pico.Instance.stateselectors.push(this);
    }

    addState(state: State) {
        this.selector.add(state.makeOption(this.selectedState));
    }
}

enum FieldState { Empty, Unknown, Wall };

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

    getPattern(): WorldPattern {
        return new WorldPattern(this.north, this.south, this.west, this.east);
    }

    draw() {
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 48, 48);
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

class Pico {
    root: HTMLElement;
    statediv: HTMLDivElement;
    statelist: HTMLSelectElement;
    states: { [name: string]: State } = {};
    statenames: Array<string> = new Array<string>();
    stateselectors: Array<StateSelector> = new Array<StateSelector>();

    static Instance: Pico = new Pico();

    constructor() {
        var pico = this;
        var table = document.createElement("table");
        var body = table.createTBody();
        var row = body.insertRow();
        var cell = row.insertCell();
        this.root = table;
        var statediv = document.createElement("div");
        statediv.className = "statediv";
        cell.appendChild(statediv);
        this.statediv = statediv;
        var listdiv = document.createElement("div");
        var statelist = document.createElement("select");
        statelist.size = 2;
        statelist.className = "statelist";
        this.statelist = statelist;
        statelist.onchange = function () {
            if (statelist.value.length > 0) {
                for (var i = 0; i < pico.statediv.childElementCount; i++) {
                    pico.statediv.children.item(i).classList.add("hidden");
                }
                pico.getState(statelist.value).div.classList.remove("hidden");
            }
        };
        listdiv.appendChild(statelist);
        var button = document.createElement("button");
        button.className = "newButton";
        button.innerText = "New State";
        button.onclick = function () {
            for (var i = 0; i < pico.statediv.childElementCount; i++) {
                pico.statediv.children.item(i).classList.add("hidden");
            }
            var index = pico.statenames.length;
            while (pico.statenames.indexOf("State " + String(index)) >= 0) {
                index++;
            }
            pico.getState("State " + String(index));
        };
        listdiv.appendChild(button);
        button = document.createElement("button");
        button.innerText = "Compile";
        button.onclick = function () {
            document.getElementById("rules").textContent = Pico.Instance.toCode().join("\n");
            document.getElementById("enterrulesbutton").click();
        }
        listdiv.appendChild(button);
        cell = row.insertCell();
        cell.appendChild(listdiv);
    }

    init(): void {
        this.getState("State 0");
    }

    getState(name: string): State {
        if (!this.states[name]) {
            var state = new State(name);
            this.stateselectors.forEach(function (val, index, array) {
                val.addState(state);
            });
            state.init();
            this.statediv.appendChild(state.div);
            this.statelist.add(state.makeOption(state));
        }
        return this.states[name];
    }

    namechange(oldname: string, newname: string): boolean {
        if (this.statenames.indexOf(oldname) >= 0 && this.statenames.indexOf(newname) < 0) {
            this.states[newname] = this.states[oldname];
            delete this.states[oldname];
            this.statenames.splice(this.statenames.indexOf(oldname), 1, newname);
            return true;
        }
        return false;
    }

    toCode(): Array<string> {
        this.statenames.forEach(function (val, index, array) {
            Pico.Instance.states[val].tempid = index;
        });
        return this.statenames.reduce(function (arr: Array<string>, statename, index, array) {
            return arr.concat(Pico.Instance.states[statename].toCode());
            }, new Array<string>());
    }

    deleteState(s: State): void {
        if (this.statenames.length > 1) {
            if (this.statenames.indexOf(s.name) > 0) {
                this.statelist.selectedIndex = this.statenames.indexOf(s.name) - 1;
            } else {
                this.statelist.selectedIndex = this.statenames.indexOf(s.name) + 1;
            }
            this.statelist.onchange(null);
            s.delete();
            this.statenames.splice(this.statenames.indexOf(s.name), 1);
            delete this.states[s.name];
        } else {
            alert("Cannot delete last state!");
        }
    }
}