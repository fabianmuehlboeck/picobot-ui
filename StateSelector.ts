class StateSelector implements StateEventListener {
    div: HTMLDivElement;
    value: State;
    robot: Robot;
    statespan: HTMLSpanElement;
    changebutton: HTMLButtonElement;
    gotobutton: HTMLButtonElement;

    constructor(robot: Robot, state: State) {
        var sel = this;
        this.div = document.createElement("div");
        this.robot = robot;
        this.value = state;
        this.div.classList.add("stateSelector");
        this.statespan = document.createElement("span");
        this.statespan.tabIndex = -1;
        this.statespan.innerText = (state==null?"[CHOOSE STATE]":state.name);
        this.statespan.addEventListener("blur", function () {
            sel.robot.statemenu.parentNode.removeChild(sel.robot.statemenu);
        }
        );
        this.div.appendChild(this.statespan);

        this.changebutton = document.createElement("button");
        this.changebutton.classList.add("changebutton");
        this.changebutton.title = "Change State";
        this.changebutton.addEventListener("click", function () { sel.showMenu(); });
        this.div.appendChild(this.changebutton);

        this.gotobutton = document.createElement("button");
        this.gotobutton.classList.add("gotobutton");
        this.gotobutton.title = "Go to State Definition";
        this.gotobutton.addEventListener("click", function () {
            $('html, body').animate({
                scrollTop: Math.max(0, $(sel.value.div).offset().top - 96)
            }, 1000);
            sel.value.expand();
        });
        this.div.appendChild(this.gotobutton);
        robot.registerStateListener(this);
    }

    getState(): State {
        return this.value;
    }

    showMenu(): void {
        var sel = this;
        var menu = this.robot.getStateMenu(this);
        var h = $(document).outerHeight();
        menu.style.position = "absolute";
        menu.style.left = String(this.div.offsetLeft) + "px";
        if (isAncestor(this.div, this.robot.programdiv)) {
            this.robot.programdiv.appendChild(menu);
        } else {
            this.div.parentNode.appendChild(menu);
        }
        $(menu).menu("refresh");
        var y = $(this.div).offset().top;
        var m = $(menu).outerHeight();
        var offset = this.div.offsetTop + 48;
        if (y + 100 + $(menu).outerHeight() > h) {
            offset -= (y + 100 + $(menu).outerHeight()) - h;
        }
        menu.style.top = String(offset) + "px";
        this.statespan.focus();
    }

    setState(state: State): void {
        this.value = state;
        if (state == null) {
            this.statespan.innerText = "[CHOOSE STATE]";
        } else {
            this.statespan.innerText = state.name;
        }
    }

    notify(s: State, se: StateEvent): void {
        switch (se) {
            case StateEvent.NameChange:
                if (this.value == s) {
                    this.statespan.innerText = s.name;
                }
                break;
            case StateEvent.Removed:
                if (this.value == s) {
                    this.setState(null);
                }
        }
    }

    deactivate() {
        this.robot.unregisterStateListener(this);
    }
}