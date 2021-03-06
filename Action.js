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
    function AAction(actionid, actionli) {
        this.actionid = actionid;
        this.actionli = actionli;
    }
    AAction.prototype.enter = function (success) {
        $(this.actionli).stop(true).animate({ backgroundColor: (success ? "#00ff00" : "#ff0000") }, 100);
    };
    AAction.prototype.exit = function () {
        $(this.actionli).stop(true).animate({ backgroundColor: "" }, 100);
    };
    AAction.prototype.delete = function () { };
    AAction.prototype.toText = function () { return this.actionid; };
    return AAction;
}());
var AActionFactory = /** @class */ (function () {
    function AActionFactory(actionid, clsnames, imgname, text) {
        var _this = this;
        this.actionid = actionid;
        this.clsnames = clsnames;
        this.imgname = imgname;
        this.text = text;
        var actionli = document.createElement("li");
        clsnames.forEach(function (clsname) { actionli.classList.add(clsname); });
        var actionimg = document.createElement("img");
        actionimg.src = imgname;
        actionli.appendChild(actionimg);
        var actiontext = document.createElement("span");
        actiontext.innerText = text;
        actionli.appendChild(actiontext);
        this.actionli = actionli;
        this.actionli = actionli;
        $(actionli).draggable({
            helper: function () { return _this.construct(); },
            revert: "invalid",
            //start: function (event, ui) {
            //    var anyelem: any = ui.helper[0];
            //    anyelem.Action = construct(<HTMLLIElement>ui.helper[0]);
            //},
            stop: function (event, ui) {
                addActionDeleteButton(ui.helper[0]);
            }
        });
    }
    AActionFactory.prototype.getId = function () { return this.actionid; };
    AActionFactory.prototype.construct = function () {
        var actionli = document.createElement("li");
        this.clsnames.forEach(function (clsname) { actionli.classList.add(clsname); });
        var actionimg = document.createElement("img");
        actionimg.src = this.imgname;
        actionli.appendChild(actionimg);
        var actiontext = document.createElement("span");
        actiontext.innerText = this.text;
        actionli.appendChild(actiontext);
        actionli.Action = this.makeAction(actionli);
        return actionli;
    };
    AActionFactory.prototype.getElement = function () {
        return this.actionli;
    };
    return AActionFactory;
}());
var MoveForwardAction = /** @class */ (function (_super) {
    __extends(MoveForwardAction, _super);
    function MoveForwardAction(actionli) {
        return _super.call(this, "FWD", actionli) || this;
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
var MoveForwardActionFactory = /** @class */ (function (_super) {
    __extends(MoveForwardActionFactory, _super);
    function MoveForwardActionFactory() {
        return _super.call(this, "FWD", ["actionmoveforward"], "forward.png", "Forward") || this;
    }
    MoveForwardActionFactory.prototype.makeAction = function (li) { return new MoveForwardAction(li); };
    return MoveForwardActionFactory;
}(AActionFactory));
var TurnLeftAction = /** @class */ (function (_super) {
    __extends(TurnLeftAction, _super);
    function TurnLeftAction(actionli) {
        return _super.call(this, "TNL", actionli) || this;
    }
    TurnLeftAction.prototype.runnable = function (world) {
        return true;
    };
    TurnLeftAction.prototype.run = function (world) {
        return world.turnLeft();
    };
    return TurnLeftAction;
}(AAction));
var TurnLeftActionFactory = /** @class */ (function (_super) {
    __extends(TurnLeftActionFactory, _super);
    function TurnLeftActionFactory() {
        return _super.call(this, "TNL", ["actionturnleft"], "turnleft.png", "Turn Left") || this;
    }
    TurnLeftActionFactory.prototype.makeAction = function (li) { return new TurnLeftAction(li); };
    return TurnLeftActionFactory;
}(AActionFactory));
var TurnRightAction = /** @class */ (function (_super) {
    __extends(TurnRightAction, _super);
    function TurnRightAction(actionli) {
        return _super.call(this, "TNR", actionli) || this;
    }
    TurnRightAction.prototype.runnable = function (world) {
        return true;
    };
    TurnRightAction.prototype.run = function (world) {
        return world.turnRight();
    };
    return TurnRightAction;
}(AAction));
var TurnRightActionFactory = /** @class */ (function (_super) {
    __extends(TurnRightActionFactory, _super);
    function TurnRightActionFactory() {
        return _super.call(this, "TNR", ["actionturnright"], "turnright.png", "Turn Right") || this;
    }
    TurnRightActionFactory.prototype.makeAction = function (li) { return new TurnRightAction(li); };
    return TurnRightActionFactory;
}(AActionFactory));
//class RememberAction<W extends IWorld<W>> extends AAction<W> {
//    constructor(actionli: HTMLLIElement) {
//        super(actionli);
//    }
//    memory: MemoryLabel;
//    runnable(world: W): boolean {
//        return true;
//    }
//    run(world: W): W {
//        return world.remember(this.memory);
//    }
//}
var Memory = /** @class */ (function (_super) {
    __extends(Memory, _super);
    function Memory(memory, actionli) {
        var _this = _super.call(this, "M" + memory.getId(), actionli) || this;
        _this.memory = memory;
        var span = ($(_this.actionli).find("span")[0]);
        //var input: HTMLInputElement = <HTMLInputElement><any>($(actionli).find("input")[0]);
        //var span = document.createElement("span");
        //span.innerText = input.value;
        //input.parentNode.insertBefore(span, input);
        //input.parentNode.removeChild(input);
        _this.nameChangeHandler = function (name) { return span.innerText = name; };
        _this.memory.addNameChangeHandler(_this.nameChangeHandler);
        return _this;
        //$(this.actionli).draggable({ connectToSortable: ".memorydroppable", revert: "invalid" });
    }
    Memory.prototype.runnable = function (world) {
        return true;
    };
    Memory.prototype.run = function (world) {
        return world.remember(this.memory);
    };
    //check(world: W): IConditionFailure[] {
    //    if (!world.remembers(this.memory)) {
    //        return [new ElementConditionFailure(this.actionli)];
    //    }
    //    return [];
    //}
    Memory.prototype.delete = function () {
        this.memory.removeNameChangeHandler(this.nameChangeHandler);
    };
    return Memory;
}(AAction));
var MemoryActionFactory = /** @class */ (function (_super) {
    __extends(MemoryActionFactory, _super);
    function MemoryActionFactory(memory) {
        var _this = _super.call(this, "M" + memory.getId(), ["memory", memory.getName().replace(" ", "").toLowerCase()], "memory.png", memory.getName()) || this;
        _this.memory = memory;
        var span = ($(_this.actionli).find("span")[0]);
        var input = document.createElement("input");
        input.type = "text";
        input.maxLength = 15;
        input.onkeyup = function () { _this.text = input.value; memory.setName(input.value); };
        input.value = span.innerText;
        _this.actionli.insertBefore(input, span);
        _this.actionli.removeChild(span);
        return _this;
    }
    MemoryActionFactory.prototype.makeAction = function (li) {
        $(li).draggable({ connectToSortable: ".memorydroppable", revert: "invalid" });
        return new Memory(this.memory, li);
    };
    MemoryActionFactory.prototype.construct = function () {
        var actionli = _super.prototype.construct.call(this);
        var span = ($(actionli).find("span")[0]);
        span.innerText = this.memory.getName();
        return actionli;
    };
    return MemoryActionFactory;
}(AActionFactory));
//# sourceMappingURL=Action.js.map