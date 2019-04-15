var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AAction = /** @class */ (function () {
    function AAction(actionli) {
        this.actionli = actionli;
    }
    AAction.prototype.enter = function (success) {
        $(this.actionli).stop(true).animate({ backgroundColor: (success ? "#00ff00" : "#ff0000") }, 100);
    };
    AAction.prototype.exit = function () {
        $(this.actionli).stop(true).animate({ backgroundColor: "" }, 100);
    };
    return AAction;
}());
var MoveForwardAction = /** @class */ (function (_super) {
    __extends(MoveForwardAction, _super);
    function MoveForwardAction(actionli) {
        return _super.call(this, actionli) || this;
    }
    MoveForwardAction.prototype.runnable = function (world) {
        var newx = world.getX();
        var newy = world.getY();
        switch (world.getDirection()) {
            case Direction.East:
                newx++;
                break;
            case Direction.South:
                newy++;
                break;
            case Direction.West:
                newx--;
                break;
            case Direction.North:
                newy--;
                break;
        }
        return world.getMap().canMoveTo(newx, newy);
    };
    MoveForwardAction.prototype.run = function (world) {
        return world.moveForward();
    };
    return MoveForwardAction;
}(AAction));
var MoveForwardActionFactory = /** @class */ (function () {
    function MoveForwardActionFactory() {
        var actionli = document.createElement("li");
        actionli.classList.add("actionforward");
        var actionimg = document.createElement("img");
        actionimg.src = "forward.png";
        actionli.appendChild(actionimg);
        var actiontext = document.createElement("span");
        actiontext.innerText = "Forward";
        actionli.appendChild(actiontext);
        $(actionli).draggable({
            helper: "clone",
            revert: "invalid",
            start: function (event, ui) {
                var anyelem = ui.helper[0];
                anyelem.Action = new MoveForwardAction(ui.helper[0]);
            },
            stop: function (event, ui) {
                var delbutton = document.createElement("button");
                delbutton.classList.add("actiondeletebutton");
                $(delbutton).on("click", function () {
                    ui.helper[0].parentElement.removeChild(ui.helper[0]);
                });
                ui.helper[0].appendChild(delbutton);
            }
        });
        this.actionli = actionli;
    }
    MoveForwardActionFactory.prototype.getElement = function () {
        return this.actionli;
    };
    return MoveForwardActionFactory;
}());
var TurnLeftAction = /** @class */ (function (_super) {
    __extends(TurnLeftAction, _super);
    function TurnLeftAction(actionli) {
        return _super.call(this, actionli) || this;
    }
    TurnLeftAction.prototype.runnable = function (world) {
        return true;
    };
    TurnLeftAction.prototype.run = function (world) {
        return world.turnLeft();
    };
    return TurnLeftAction;
}(AAction));
var TurnLeftActionFactory = /** @class */ (function () {
    function TurnLeftActionFactory() {
        var actionli = document.createElement("li");
        actionli.classList.add("actionturnleft");
        var actionimg = document.createElement("img");
        actionimg.src = "turnleft.png";
        actionli.appendChild(actionimg);
        var actiontext = document.createElement("span");
        actiontext.innerText = "Turn Left";
        actionli.appendChild(actiontext);
        $(actionli).draggable({
            helper: "clone",
            revert: "invalid",
            start: function (event, ui) {
                var anyelem = ui.helper[0];
                anyelem.Action = new TurnLeftAction(ui.helper[0]);
            },
            stop: function (event, ui) {
                var delbutton = document.createElement("button");
                delbutton.classList.add("actiondeletebutton");
                $(delbutton).on("click", function () {
                    ui.helper[0].parentElement.removeChild(ui.helper[0]);
                });
                ui.helper[0].appendChild(delbutton);
            }
        });
        this.actionli = actionli;
    }
    TurnLeftActionFactory.prototype.getElement = function () {
        return this.actionli;
    };
    return TurnLeftActionFactory;
}());
var TurnRightAction = /** @class */ (function (_super) {
    __extends(TurnRightAction, _super);
    function TurnRightAction(actionli) {
        return _super.call(this, actionli) || this;
    }
    TurnRightAction.prototype.runnable = function (world) {
        return true;
    };
    TurnRightAction.prototype.run = function (world) {
        return world.turnRight();
    };
    return TurnRightAction;
}(AAction));
var TurnRightActionFactory = /** @class */ (function () {
    function TurnRightActionFactory() {
        var actionli = document.createElement("li");
        actionli.classList.add("actionturnright");
        var actionimg = document.createElement("img");
        actionimg.src = "turnright.png";
        actionli.appendChild(actionimg);
        var actiontext = document.createElement("span");
        actiontext.innerText = "Turn Right";
        actionli.appendChild(actiontext);
        $(actionli).draggable({
            helper: "clone",
            revert: "invalid",
            start: function (event, ui) {
                var anyelem = ui.helper[0];
                anyelem.Action = new TurnRightAction(ui.helper[0]);
            },
            stop: function (event, ui) {
                var delbutton = document.createElement("button");
                delbutton.classList.add("actiondeletebutton");
                $(delbutton).on("click", function () {
                    ui.helper[0].parentElement.removeChild(ui.helper[0]);
                });
                ui.helper[0].appendChild(delbutton);
            }
        });
        this.actionli = actionli;
    }
    TurnRightActionFactory.prototype.getElement = function () {
        return this.actionli;
    };
    return TurnRightActionFactory;
}());
var RememberAction = /** @class */ (function (_super) {
    __extends(RememberAction, _super);
    function RememberAction(actionli) {
        return _super.call(this, actionli) || this;
    }
    RememberAction.prototype.runnable = function (world) {
        return true;
    };
    RememberAction.prototype.run = function (world) {
        return world.remember(this.memory);
    };
    return RememberAction;
}(AAction));
//# sourceMappingURL=Action.js.map