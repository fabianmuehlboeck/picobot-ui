var Robot = /** @class */ (function () {
    function Robot(x, y) {
        this.states = {};
        this.statenames = new Array();
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
        this.stateselector = new StateSelector(this, this.addState("Initial State"));
        this.programdiv.appendChild(this.state.div);
    }
    Robot.prototype.registerStateListener = function (sel) {
        this.statelisteners.push(sel);
    };
    Robot.prototype.unregisterStateListener = function (sel) {
        while (this.statelisteners.indexOf(sel) >= 0) {
            this.statelisteners.splice(this.statelisteners.indexOf(sel), 1);
        }
    };
    Object.defineProperty(Robot.prototype, "state", {
        get: function () { return this.stateselector.value; },
        set: function (s) { this.stateselector.setState(s); },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Robot.prototype.addState = function (name) {
        if (name === void 0) { name = undefined; }
        if (name) {
        }
        else {
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
        return state;
    };
    Robot.prototype.renameState = function (s, oldName) {
        this.statenames.splice(this.statenames.indexOf(oldName), 1);
        this.statenames.push(s.name);
        delete this.states[oldName];
        this.states[s.name] = s;
        this.statelisteners.forEach(function (v, i, a) { v.notify(s, StateEvent.NameChange); });
    };
    Robot.prototype.removeState = function (s) {
        this.statelisteners.forEach(function (v, i, a) { v.notify(s, StateEvent.Removed); });
        delete this.states[s.name];
        this.statenames.splice(this.statenames.indexOf(s.name), 1);
        this.programdiv.removeChild(s.div);
        this.statemenu.removeChild(s.menuItem);
    };
    Robot.prototype.getStateMenu = function (selector) {
        if (this.statemenu.parentNode) {
            this.statemenu.parentNode.removeChild(this.statemenu);
        }
        this.currentStateSelector = selector;
        return this.statemenu;
    };
    Robot.prototype.setPos = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Robot.prototype.setState = function (state) {
        if (this.statenames.indexOf(state.name) >= 0 && this.states[state.name] == state) {
            this.state = state;
        }
    };
    Robot.prototype.vstep = function (map, ws, options, thenCont, elseCont, index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        this.state.expand();
        if (index >= this.state.rules.length) {
            elseCont();
        }
        else {
            var ly = $('html, body').scrollTop() + jQuery(window).height() - 120;
            var jqr = $(this.state.rules[index].elem);
            if (jqr.offset().top + jqr.outerHeight() > ly) {
                var nst = $('html, body').scrollTop() + (jqr.offset().top + jqr.outerHeight() - ly);
                $('html, body').animate({
                    scrollTop: nst
                }, 300).promise().always(function () {
                    _this.state.rules[index].vmatches(ws, options, function () { _this.executeVStep(_this.state.rules[index], map, options, thenCont, elseCont); }, function () { _this.vstep(map, ws, options, thenCont, elseCont, index + 1); });
                });
            }
            else {
                this.state.rules[index].vmatches(ws, options, function () { _this.executeVStep(_this.state.rules[index], map, options, thenCont, elseCont); }, function () { _this.vstep(map, ws, options, thenCont, elseCont, index + 1); });
            }
        }
    };
    Robot.prototype.executeVStep = function (rule, map, options, thenCont, elseCont) {
        var _this = this;
        var changedState = !(this.state == rule.getState());
        var success = false;
        var jq = $(rule.actionSelector.activeElem);
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
        jq.animate({ backgroundColor: flashcol }, { duration: 300, easing: "easeOutCirc" }).promise().always(function () {
            map.draw();
            jq.animate({ backgroundColor: bgcol }, { duration: 200, easing: "easeOutCirc" }).promise().always(function () {
                jq.css("background-color", '');
                bgcol = window.getComputedStyle(_this.state.namefield, null).getPropertyValue("background-color");
                jq = $([rule.stateSelector.div, _this.stateselector.div, rule.getState().namefield]);
                jq.animate({ backgroundColor: "#00ff00" }, { duration: 300, easing: "easeOutCirc" }).promise().always(function () {
                    _this.setState(rule.getState());
                    jq.animate({ backgroundColor: bgcol }, { duration: 200, easing: "easeOutCirc" }).promise().always(function () {
                        if (success) {
                            thenCont();
                        }
                        else {
                            elseCont();
                        }
                    });
                });
            });
        });
    };
    Robot.prototype.step = function (map, ws, options) {
        for (var i = 0; i < this.state.rules.length; i++) {
            if (this.state.rules[i].matches(ws, options)) {
                return this.executeStep(this.state.rules[i], map, options);
            }
        }
    };
    Robot.prototype.executeStep = function (rule, map, options) {
        var changedState = !(this.state == rule.getState());
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
    };
    Robot.prototype.move = function (xnew, ynew, map, options) {
        if (map.isValidPos(xnew, ynew)) {
            this.x = xnew;
            this.y = ynew;
            return true;
        }
        return false;
    };
    Robot.prototype.moveNorth = function (map, options) {
        var xnew = this.x;
        var ynew = this.y - 1;
        return this.move(xnew, ynew, map, options);
    };
    Robot.prototype.moveEast = function (map, options) {
        var xnew = this.x + 1;
        var ynew = this.y;
        return this.move(xnew, ynew, map, options);
    };
    Robot.prototype.moveSouth = function (map, options) {
        var xnew = this.x;
        var ynew = this.y + 1;
        return this.move(xnew, ynew, map, options);
    };
    Robot.prototype.moveWest = function (map, options) {
        var xnew = this.x - 1;
        var ynew = this.y;
        return this.move(xnew, ynew, map, options);
    };
    Robot.prototype.getX = function () { return this.x; };
    Robot.prototype.getY = function () { return this.y; };
    return Robot;
}());
//# sourceMappingURL=Robot.js.map