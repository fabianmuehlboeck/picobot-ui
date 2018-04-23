
class Rule {
    elem: HTMLLIElement;

    worldState: ControlWorldState;
    actionSelector: ActionSelector;
    stateSelector: StateSelector;

    parent: State;

    upbutton: HTMLButtonElement;
    downbutton: HTMLButtonElement;

    constructor(state: State) {
        this.parent = state;
        this.elem = document.createElement("li");
        this.elem.classList.add("rule");
        var r = this;

        var movdiv = document.createElement("div");
        movdiv.classList.add("rulemovebuttons");
        var upbutton = document.createElement("button");
        //upbutton.innerText = "Move rule up";
        upbutton.onclick = function () {
            state.moveUpRule(r);
        }
        upbutton.disabled = state.rules.length <= 2;
        upbutton.className = "upbutton";
        this.upbutton = upbutton;
        movdiv.appendChild(upbutton);

        var downbutton = document.createElement("button");
        //downbutton.innerText = "Move rule down";
        downbutton.disabled = true;
        downbutton.className = "downbutton";
        downbutton.onclick = function () {
            state.moveDownRule(r);
        }
        if (state.rules.length > 0) {
            state.rules[state.rules.length - 1].downbutton.disabled = false;
        }
        this.downbutton = downbutton;
        movdiv.appendChild(downbutton);

        //this.elem.appendChild(movdiv);
        var grabimg = document.createElement("img");
        grabimg.src = "updown.png";
        var grablink = document.createElement("a");
        grablink.className = "grabimg";
        grablink.appendChild(grabimg);
        this.elem.appendChild(grablink);

        var wsdiv = document.createElement("div");
        wsdiv.classList.add("ruleworldstate");
        var canvas = document.createElement("canvas");
        canvas.width = 48;
        canvas.height = 48;
        wsdiv.appendChild(canvas);
        this.worldState = new ControlWorldState(canvas);
        this.elem.appendChild(wsdiv);

        var todiv = document.createElement("div");
        todiv.classList.add("rulemapstodiv");
        todiv.appendChild(document.createTextNode("=>"));
        this.elem.appendChild(todiv);

        var actiondiv = document.createElement("div");
        actiondiv.classList.add("ruleactiondiv");
        this.actionSelector = new ActionSelector(actiondiv);
        this.elem.appendChild(actiondiv);

        var statediv = document.createElement("div");
        statediv.classList.add("rulestatediv");
        this.stateSelector = new StateSelector(state.parent, state, state);
        statediv.appendChild(this.stateSelector.div);
        this.elem.appendChild(statediv);

        var enddiv = document.createElement("div");
        enddiv.classList.add("ruleenddiv");
        var delbutton = document.createElement("button");
        //delbutton.innerText = "Delete rule";
        delbutton.className = "deletebutton";
        delbutton.addEventListener("click", function () {
            r.parent.removeRule(r);
        });
        delbutton.title = "Delete Rule";
        enddiv.appendChild(delbutton);
        this.elem.appendChild(enddiv);
    }

    getWorldState(): ControlWorldState {
        return this.worldState;
    }

    getAction(): Action {
        return this.actionSelector.action;
    }

    getState(): State {
        return this.stateSelector.value;
    }

    delete(): void {
    }

    matches(ws: IWorldState, options: StepOptions) {
        return ws.matches(this.worldState);
    }

    vmatches(ws: IWorldState, options: StepOptions, thenCont: () => void, elseCont: () => void) {
        return ws.vmatches(this.worldState, thenCont, elseCont);
    }
}
