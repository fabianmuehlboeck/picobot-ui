
interface IAction<W extends IWorld<W>> {
    runnable(world: W): boolean;
    run(world: W): W;
    enter(success: boolean): void;
    exit(): void;
    delete(): void;
    toText(): string;
}

abstract class AAction<W extends IWorld<W>> implements IAction<W> {
    actionli: HTMLLIElement;
    actionid: string;
    constructor(actionid: string, actionli: HTMLLIElement) {
        this.actionid = actionid;
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
    toText() { return this.actionid; }
}

interface IActionFactory<W extends IWorld<W>> {
    getElement(): HTMLLIElement;
    getId(): string;
    construct(): HTMLLIElement;
}

abstract class AActionFactory<W extends IWorld<W>> implements IActionFactory<W> {
    actionid: string;
    actionli: HTMLLIElement;
    text: string;
    imgname: string;
    clsnames: string[];

    getId() : string { return this.actionid; }

    constructor(actionid: string, clsnames: string[], imgname: string, text: string) {
        this.actionid = actionid;
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
                addActionDeleteButton(ui.helper[0]);
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
        super("FWD", actionli);
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
        super("FWD", ["actionmoveforward"], "forward.png", "Forward");
    }
    makeAction(li: HTMLLIElement): IAction<W> { return new MoveForwardAction(li); }
}

class TurnLeftAction<W extends IWorld<W>> extends AAction<W> {
    actionli: HTMLLIElement;

    constructor(actionli: HTMLLIElement) {
        super("TNL", actionli);
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
        super("TNL", ["actionturnleft"], "turnleft.png", "Turn Left");
    }
    makeAction(li: HTMLLIElement): IAction<W> { return new TurnLeftAction(li); }
}

class TurnRightAction<W extends IWorld<W>> extends AAction<W> {
    actionli: HTMLLIElement;

    constructor(actionli: HTMLLIElement) {
        super("TNR", actionli);
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
        super("TNR", ["actionturnright"], "turnright.png", "Turn Right");
    }
    makeAction(li: HTMLLIElement): IAction<W> { return new TurnRightAction(li); }
}

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

class Memory<W extends IWorld<W>> extends AAction<W>  {
    memory: MemoryLabel;
    nameChangeHandler: (string) => void;
    constructor(memory: MemoryLabel, actionli: HTMLLIElement) {
        super("M"+memory.getId(), actionli);
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
        super("M"+memory.getId(), ["memory", memory.getName().replace(" ", "").toLowerCase()], "memory.png", memory.getName());
        this.memory = memory;
        var span: HTMLSpanElement = <HTMLSpanElement><any>($(this.actionli).find("span")[0]);
        var input: HTMLInputElement = document.createElement("input");
        input.type = "text";
        input.maxLength = 15;
        input.onkeyup = () => { this.text = input.value; memory.setName(input.value) };
        input.value = span.innerText;
        this.actionli.insertBefore(input, span);
        this.actionli.removeChild(span);
    }
    makeAction(li: HTMLLIElement): IAction<W> {
        $(li).draggable({ connectToSortable: ".memorydroppable", revert: "invalid" });
        return new Memory(this.memory, li);
    }
}