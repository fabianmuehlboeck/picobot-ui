
class Robot {
    programdiv: HTMLDivElement;
    //state: State;
    x: number;
    y: number;
    initialstate: State = null;
    states: { [name: string]: State } = {};
    statenames: Array<string> = new Array<string>();
    stateselector: StateSelector;

    statelisteners: Array<StateEventListener>;

    statemenu: HTMLUListElement;
    currentStateSelector: StateSelector;

    registerStateListener(sel: StateEventListener): void {
        this.statelisteners.push(sel);
    }
    unregisterStateListener(sel: StateEventListener): void {
        while (this.statelisteners.indexOf(sel) >= 0) {
            this.statelisteners.splice(this.statelisteners.indexOf(sel), 1);
        }
    }

    get state() : State { return this.stateselector.value; };
    set state(s: State) { this.stateselector.setState(s); };
    
    constructor(x: number, y: number) {
        var rbt = this;
        this.statelisteners = [];
        this.programdiv = document.createElement("div");
        this.programdiv.classList.add("programdiv");
        var rmc = this.programdiv.removeChild;
        //this.programdiv.removeChild = function (node) {
        //    rmc(node);
        //    return node;
        //}
        this.x = x;
        this.y = y;
        this.statemenu = document.createElement("ul");
        this.statemenu.classList.add("statemenu");
        $(this.statemenu).menu({
            select: function (event, ui) {
                rbt.currentStateSelector.setState(rbt.states[ui.item[0].innerText]);
                rbt.statemenu.parentNode.removeChild(rbt.statemenu);
            }
            //blur: function (event, ui) {
            //    //rbt.statemenu.parentNode.removeChild(rbt.statemenu);
            //    rbt = rbt;
            //}
        });
        this.states = {};
        this.statenames = [];
        ;
        this.stateselector = new StateSelector(this, null);
    }

    setInitial(state: State): void {
        if (this.initialstate != null) {
            this.initialstate.div.classList.remove("startstate");
        }
        state.div.classList.add("startstate");
        this.initialstate = state;
    }

    addState(name: string = undefined) : State {
        if (!name) {
            var i = 1;
            while (this.statenames.indexOf("State " + String(i)) >= 0) {
                i++;
            }
            name = "State " + String(i);
        }
        var state = new State(name, this);
        this.states[name] = state;
        this.statenames.push(name);
        this.programdiv.appendChild(state.div);
        this.statemenu.appendChild(state.menuItem);
        if (this.state == null) {
            this.state = state;
            this.setInitial(state);
        }
        return state;
    }

    reset(): void {
        this.state = this.initialstate;
    }

    renameState(s: State, oldName: string) {
        this.statenames.splice(this.statenames.indexOf(oldName), 1);
        this.statenames.push(s.name);
        delete this.states[oldName];
        this.states[s.name] = s;
        this.statelisteners.forEach((v, i, a) => { v.notify(s, StateEvent.NameChange); });
    }

    removeState(s : State): void {
        this.statelisteners.forEach((v, i, a) => { v.notify(s, StateEvent.Removed); });
        delete this.states[s.name];
        if (s == this.state) {
            this.state = null;
        }
        if (s == this.initialstate) {
            var index = this.statenames.indexOf(s.name);
            if (index - 1 >= 0) {
                this.setInitial(this.states[this.statenames[index - 1]]);
            } else if (this.statenames.length > index + 1) {
                this.setInitial(this.states[this.statenames[index + 1]]);
            } else {
                this.initialstate = null;
            }
        }
        this.statenames.splice(this.statenames.indexOf(s.name), 1);
        this.programdiv.removeChild(s.div);
        this.statemenu.removeChild(s.menuItem);
    }

    getStateMenu(selector: StateSelector): HTMLUListElement {
        if (this.statemenu.parentNode) {
            this.statemenu.parentNode.removeChild(this.statemenu);
        }
        this.currentStateSelector = selector;
        return this.statemenu;
    }

    setPos(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    setState(state: State): void {
        if (this.statenames.indexOf(state.name) >= 0 && this.states[state.name] == state) {
            this.state = state;
        }
    }

    vstep(map: IMap, ws: IWorldState, options: StepOptions, thenCont: () => void, elseCont: () => void, index: number = 0): void {
        this.state.expand();
        if (index >= this.state.rules.length) {
            elseCont();
        } else {
            var ly = $('html, body').scrollTop() + jQuery(window).height() - 120;
            var jqr = $(this.state.rules[index].elem);
            if (jqr.offset().top + jqr.outerHeight() > ly) {
                var nst = $('html, body').scrollTop() + (jqr.offset().top + jqr.outerHeight() - ly);
                $('html, body').animate({
                    scrollTop: nst
                }, 300).promise().always(() => {
                    this.state.rules[index].vmatches(ws, options,
                        () => { this.executeVStep(this.state.rules[index], map, options, thenCont, elseCont); },
                        () => { this.vstep(map, ws, options, thenCont, elseCont, index + 1); });
                });
            } else {
                this.state.rules[index].vmatches(ws, options,
                    () => { this.executeVStep(this.state.rules[index], map, options, thenCont, elseCont); },
                    () => { this.vstep(map, ws, options, thenCont, elseCont, index + 1); });
            }
            
        }
    }

    executeVStep(rule: Rule, map: IMap, options: StepOptions, thenCont: () => void, elseCont: () => void) : void {
        var changedState: boolean = !(this.state == rule.getState());
        var success: boolean = false;
        var jq: JQuery<HTMLElement> = $(rule.actionSelector.activeElem);
        var bgcol = window.getComputedStyle(rule.actionSelector.activeElem, null).getPropertyValue("background-color");
        switch (rule.getAction()) {
            case Action.Stay:
                success = changedState;
                break;
            case Action.North:
                success = this.moveNorth(map, options);
                break;
            case Action.East:
                success = this.moveEast(map, options);
                break;
            case Action.South:
                success = this.moveSouth(map, options);
                break;
            case Action.West:
                success = this.moveWest(map, options);
                break;
        }
        var flashcol = (success ? "#00ff00" : "#ff0000");
        jq.animate({ backgroundColor: flashcol }, { duration: 300, easing: "easeOutCirc" }).promise().always(() => {
            map.draw();
             jq.animate({ backgroundColor: bgcol }, { duration: 200, easing: "easeOutCirc" }).promise().always(
                () => {
                    jq.css("background-color", '');
                    bgcol = window.getComputedStyle(this.state.namefield, null).getPropertyValue("background-color");
                    jq = $([rule.stateSelector.div, this.stateselector.div, rule.getState().namefield]);
                    jq.animate({ backgroundColor: "#00ff00" }, { duration: 300, easing: "easeOutCirc" }).promise().always(() => {
                        this.setState(rule.getState());
                        jq.animate({ backgroundColor: bgcol }, { duration: 200, easing: "easeOutCirc" }).promise().always(
                            () => {
                                if (success) {
                                    thenCont();
                                }
                                else {
                                    elseCont();
                                }
                            })
                    });
                }
            );
        });
    }

    step(map: IMap, ws: IWorldState, options: StepOptions): boolean {
        for (var i = 0; i < this.state.rules.length; i++) {
            if (this.state.rules[i].matches(ws, options)) {
                return this.executeStep(this.state.rules[i], map, options);
            }
        }
    }

    executeStep(rule: Rule, map: IMap, options: StepOptions): boolean {
        var changedState: boolean = !(this.state == rule.getState());
        this.state = rule.getState();
        switch (rule.getAction()) {
            case Action.Stay:
                return changedState;
            case Action.North:
                return this.moveNorth(map, options);
            case Action.East:
                return this.moveEast(map, options);
            case Action.South:
                return this.moveSouth(map, options);
            case Action.West:
                return this.moveWest(map, options);
        }
    }

    move(xnew: number, ynew: number, map: IMap, options: StepOptions): boolean {
        if (map.isValidPos(xnew, ynew)) {
            this.x = xnew;
            this.y = ynew;
            return true;
        }
        return false;
    }

    moveNorth(map: IMap, options: StepOptions): boolean {
        var xnew = this.x;
        var ynew = this.y - 1;
        return this.move(xnew, ynew, map, options);
    }

    moveEast(map: IMap, options: StepOptions): boolean {
        var xnew = this.x + 1;
        var ynew = this.y;
        return this.move(xnew, ynew, map, options);
    }

    moveSouth(map: IMap, options: StepOptions): boolean {
        var xnew = this.x;
        var ynew = this.y + 1;
        return this.move(xnew, ynew, map, options);
    }

    moveWest(map: IMap, options: StepOptions): boolean {
        var xnew = this.x - 1;
        var ynew = this.y;
        return this.move(xnew, ynew, map, options);
    }

    getX(): number { return this.x; }
    getY(): number { return this.y; }
}
