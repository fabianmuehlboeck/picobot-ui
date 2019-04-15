
interface IAction<W extends IWorld<W>> {
    runnable(world: W): boolean;
    run(world: W): W;
    enter(success: boolean) : void;
    exit(): void;
}

abstract class AAction<W extends IWorld<W>> implements IAction<W> {
    actionli: HTMLLIElement;
    constructor(actionli: HTMLLIElement) {
        this.actionli = actionli;
    }
    enter(success: boolean): void {
        $(this.actionli).stop(true).animate({ backgroundColor: (success ? "#00ff00" : "#ff0000") }, 100);
    }
    exit(): void {
        $(this.actionli).stop(true).animate({ backgroundColor: "" }, 100);
    }
    abstract runnable(world: W): boolean;
    abstract run(world: W): W;
}

interface IActionFactory<W extends IWorld<W>> {
    getElement(): HTMLLIElement;
}

class MoveForwardAction<W extends IWorld<W>> extends AAction<W> {
    actionli: HTMLLIElement;

    constructor(actionli: HTMLLIElement) {
        super(actionli);
    }

    runnable(world: W): boolean {
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
    }
    run(world: W): W {
        return world.moveForward();
    }
}

class MoveForwardActionFactory<W extends IWorld<W>> implements IActionFactory<W> {

    actionli: HTMLLIElement;

    constructor() {
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
                var anyelem: any = ui.helper[0];
                anyelem.Action = new MoveForwardAction(<HTMLLIElement>ui.helper[0]);
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

    getElement(): HTMLLIElement {
        return this.actionli;
    }
}

class TurnLeftAction<W extends IWorld<W>> extends AAction<W> {
    actionli: HTMLLIElement;

    constructor(actionli: HTMLLIElement) {
        super(actionli);
    }
    runnable(world: W): boolean {
        return true;
    }
    run(world: W): W {
        return world.turnLeft();
    }
}

class TurnLeftActionFactory<W extends IWorld<W>> implements IActionFactory<W> {

    actionli: HTMLLIElement;

    constructor() {
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
                var anyelem: any = ui.helper[0];
                anyelem.Action = new TurnLeftAction(<HTMLLIElement>ui.helper[0]);
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

    getElement(): HTMLLIElement {
        return this.actionli;
    }
}

class TurnRightAction<W extends IWorld<W>> extends AAction<W> {
    actionli: HTMLLIElement;

    constructor(actionli: HTMLLIElement) {
        super(actionli);
    }
    runnable(world: W): boolean {
        return true;
    }
    run(world: W): W {
        return world.turnRight();
    }
}

class TurnRightActionFactory<W extends IWorld<W>> implements IActionFactory<W> {

    actionli: HTMLLIElement;

    constructor() {
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
                var anyelem: any = ui.helper[0];
                anyelem.Action = new TurnRightAction(<HTMLLIElement>ui.helper[0]);
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

    getElement(): HTMLLIElement {
        return this.actionli;
    }
}

class RememberAction<W extends IWorld<W>> extends AAction<W> {
    constructor(actionli: HTMLLIElement) {
        super(actionli);
    }
    memory: IMemoryLabel;
    runnable(world: W): boolean {
        return true;
    }
    run(world: W): W {
        return world.remember(this.memory);
    }
}