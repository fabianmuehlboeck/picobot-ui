
interface IAction<W extends IWorld<W>> {
    runnable(world: W): boolean;
    run(world: W): W;
    enter(success: boolean): void;
    exit(): void;
    delete(): void;
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
    delete(): void { }
    abstract runnable(world: W): boolean;
    abstract run(world: W): W;
}

interface IActionFactory<W extends IWorld<W>> {
    getElement(): HTMLLIElement;
}

abstract class AActionFactory<W extends IWorld<W>> implements IActionFactory<W> {

    actionli: HTMLLIElement;
    text: string;
    imgname: string;
    clsnames: string[];

    constructor(clsnames: string[], imgname: string, text: string) {
        this.clsnames = clsnames;
        this.imgname = imgname;
        this.text = text;
        var actionli = document.createElement("li");
        clsnames.forEach((clsname) => { actionli.classList.add(clsname); });
        var actionimg = document.createElement("img");
        actionimg.src = imgname;
        actionli.appendChild(actionimg);
        var actiontext = document.createElement("span");
        actiontext.innerText = text;
        actionli.appendChild(actiontext);
        this.actionli = actionli;

        this.actionli = actionli;
        $(actionli).draggable({
            helper: () => this.construct(),
            revert: "invalid",
            //start: function (event, ui) {
            //    var anyelem: any = ui.helper[0];
            //    anyelem.Action = construct(<HTMLLIElement>ui.helper[0]);
            //},
            stop: function (event, ui) {
                var delbutton = document.createElement("button");
                delbutton.classList.add("actiondeletebutton");
                $(delbutton).on("click", function () {
                    ui.helper[0].parentElement.removeChild(ui.helper[0]);
                    var anyelem: any = ui.helper[0];
                    anyelem.Action.delete();
                });
                ui.helper[0].appendChild(delbutton);
            }
        });
    }

    construct(): HTMLLIElement {
        var actionli = document.createElement("li");
        this.clsnames.forEach((clsname) => { actionli.classList.add(clsname); });
        var actionimg = document.createElement("img");
        actionimg.src = this.imgname;
        actionli.appendChild(actionimg);
        var actiontext = document.createElement("span");
        actiontext.innerText = this.text;
        actionli.appendChild(actiontext);
        (<any>actionli).Action = this.makeAction(actionli);
        return actionli;
    }

    abstract makeAction(actionli: HTMLLIElement): IAction<W>;

    getElement(): HTMLLIElement {
        return this.actionli;
    }
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

class MoveForwardActionFactory<W extends IWorld<W>> extends AActionFactory<W> {

    constructor() {
        super(["actionmoveforward"], "forward.png", "Forward");
    }
    makeAction(li: HTMLLIElement): IAction<W> { return new MoveForwardAction(li); }
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

class TurnLeftActionFactory<W extends IWorld<W>> extends AActionFactory<W> {

    constructor() {
        super(["actionturnleft"], "turnleft.png", "Turn Left");
    }
    makeAction(li: HTMLLIElement): IAction<W> { return new TurnLeftAction(li); }
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

class TurnRightActionFactory<W extends IWorld<W>> extends AActionFactory<W> {

    constructor() {
        super(["actionturnright"], "turnright.png", "Turn Right");
    }
    makeAction(li: HTMLLIElement): IAction<W> { return new TurnRightAction(li); }
}

class RememberAction<W extends IWorld<W>> extends AAction<W> {
    constructor(actionli: HTMLLIElement) {
        super(actionli);
    }
    memory: MemoryLabel;
    runnable(world: W): boolean {
        return true;
    }
    run(world: W): W {
        return world.remember(this.memory);
    }
}

class Memory<W extends IWorld<W>> extends AAction<W>  {
    memory: MemoryLabel;
    nameChangeHandler: (string) => void;
    constructor(memory: MemoryLabel, actionli: HTMLLIElement) {
        super(actionli);
        this.memory = memory;
        var span: HTMLSpanElement = <HTMLSpanElement><any>($(this.actionli).find("span")[0]);
        //var input: HTMLInputElement = <HTMLInputElement><any>($(actionli).find("input")[0]);
        //var span = document.createElement("span");
        //span.innerText = input.value;
        //input.parentNode.insertBefore(span, input);
        //input.parentNode.removeChild(input);
        this.nameChangeHandler = (name) => span.innerText = name;
        this.memory.addNameChangeHandler(this.nameChangeHandler);
        //$(this.actionli).draggable({ connectToSortable: ".memorydroppable", revert: "invalid" });
    }

    runnable(world: W): boolean {
        return true;
    }
    run(world: W): W {
        return world.remember(this.memory);
    }
    //check(world: W): IConditionFailure[] {
    //    if (!world.remembers(this.memory)) {
    //        return [new ElementConditionFailure(this.actionli)];
    //    }
    //    return [];
    //}
    delete() {
        this.memory.removeNameChangeHandler(this.nameChangeHandler);
    }

}

class MemoryActionFactory<W extends IWorld<W>> extends AActionFactory<W> {
    memory: MemoryLabel;
    constructor(memory: MemoryLabel) {
        super(["memory", memory.getName().replace(" ", "").toLowerCase()], "memory.png", memory.getName());
        this.memory = memory;
        //var span: HTMLSpanElement = <HTMLSpanElement><any>($(this.actionli).find("span")[0]);
        //var input: HTMLInputElement = document.createElement("input");
        //input.type = "text";
        //input.maxLength = 15;
        //input.onchange = () => { memory.setName(input.value) };
        //this.actionli.insertBefore(input, span);
        //this.actionli.removeChild(span);
    }
    makeAction(li: HTMLLIElement): IAction<W> {
        $(li).draggable({ connectToSortable: ".memorydroppable", revert: "invalid" });
        return new Memory(this.memory, li);
    }
}