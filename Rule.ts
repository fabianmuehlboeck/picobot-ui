
interface IRule<W extends IWorld<W>> {
    getCondition(): ICondition<W>;
    getActions(): Array<IAction<W>>;
    getElement(): HTMLLIElement;
    loadFromText(stream: StringStream, robot: IRobot<W>): void;
    toText(): string;
}

function addActionDeleteButton(actionli: HTMLElement) {
    var delbutton = document.createElement("button");
    delbutton.classList.add("actiondeletebutton");
    $(delbutton).on("click", function () {
        actionli.parentElement.removeChild(actionli);
        var anyelem: any = actionli;
        anyelem.Action.delete();
    });
    actionli.appendChild(delbutton);
}

class ActionRule<W extends IWorld<W>> implements IRule<W> {
    ruleli: HTMLLIElement;
    actionul: HTMLUListElement;
    actiondiv: HTMLDivElement;
    constructor() {
        var ruleli: HTMLLIElement = document.createElement("li");
        this.ruleli = ruleli;
        ruleli.classList.add("rule");
        var actiondiv: HTMLDivElement = document.createElement("div");
        actiondiv.classList.add("ruleactions");
        ruleli.appendChild(actiondiv);
        var actionul: HTMLUListElement = document.createElement("ul");
        this.actionul = actionul;
        actionul.classList.add("ruleactionlist");
        actiondiv.append(actionul);
        this.actiondiv = actiondiv;
        $(actionul).sortable({ receive: (event, ui) => this.processReceive(event, ui), remove: (event, ui) => this.processRemove(event, ui), revert: "invalid" });
    }
    processReceive(event: JQueryEventObject, ui: JQueryUI.SortableUIParams): void {
        $(this.actionul).find("li").css('width', '').css('height', '');
    }
    processRemove(event: JQueryEventObject, ui: JQueryUI.SortableUIParams): void {
    }
    getCondition(): ICondition<W> {
        return FalseCondition.getInstance();
    }
    makeCondition(): ICondition<W> {
        return new SensorCondition<W>();
    }
    getActions(): IAction<W>[] {
        var ret: IAction<W>[] = [];
        for (var i = 0; i < this.actionul.childElementCount; i++) {
            var anyelem: any = this.actionul.childNodes.item(i);
            ret.push(anyelem.Action);
        }
        return ret;
    }


    toText(): string {
        var ret: string = "";
        for (let action of this.getActions()) {
            ret += action.toText() + ";";
        }
        return ret + "#";
    }
    loadFromText(stream: StringStream, robot: IRobot<W>): void {
        this.loadActions(stream, robot);
    }
    loadActions(stream: StringStream, robot: IRobot<W>): void {
        var actions = stream.readUntil("#");
        for (let a of actions.split(";")) {
            if (a.length > 0) {
                var actionli = robot.getFactory(a).construct();
                addActionDeleteButton(actionli);
                this.actionul.appendChild(actionli);
            }
        }
    }
    getElement(): HTMLLIElement { return this.ruleli; }
}

class SensorRule<W extends IWorld<W>> extends ActionRule<W> {
    condition: ICondition<W>;

    constructor() {
        super();
        var conditiondiv: HTMLDivElement = document.createElement("div");
        conditiondiv.classList.add("ruleconditions");
        var rulesplitdiv: HTMLDivElement = document.createElement("div");
        rulesplitdiv.classList.add("rulesplit");
        var condition: ICondition<W> = this.makeCondition();
        this.condition = condition;
        this.ruleli.insertBefore(conditiondiv, this.actiondiv);
        this.ruleli.insertBefore(rulesplitdiv, this.actiondiv);
        conditiondiv.appendChild(condition.getElement());
        var ruledeletebutton = document.createElement("button");
        ruledeletebutton.classList.add("ruledeletebutton");
        this.ruleli.appendChild(ruledeletebutton);
        $(ruledeletebutton).on("click", () => this.ruleli.parentNode.removeChild(this.ruleli));
    }

    makeCondition(): ICondition<W> {
        return new SensorCondition<W>();
    }

    //indexOfElem(elem: HTMLElement): number {
    //    for (var i = 0; i < this.actionul.childNodes.length; i++) {
    //        if (elem == this.actionul.childNodes.item(i)) {
    //            return i;
    //        }
    //    }
    //    return -1;
    //}


    toText(): string {
        var ret: string = this.getCondition().toText();
        return ret + super.toText();
    }
    loadFromText(stream: StringStream, robot: IRobot<W>): void {
        this.condition.loadFromText(stream, robot);
        super.loadFromText(stream, robot);
    }

    getCondition(): ICondition<W> {
        return this.condition;
    }
}

class MemoryRule<W extends IWorld<W>> extends SensorRule<W> {

    memcondition: MemoryCondition<W>;
    constructor() {
        super();
        this.actionul.classList.add("memorydroppable");
        $(this.memcondition.memoryul).sortable({ receive: (event, ui) => this.processMemoryReceive(event, ui), remove: (event, ui) => this.processMemoryRemove(event, ui), revert: "invalid" });
    }

    makeCondition(): ICondition<W> {
        this.memcondition = new MemoryCondition<W>();
        return this.memcondition;
    }

    processMemoryReceive(event: JQueryEventObject, ui: JQueryUI.SortableUIParams): void {
        $(this.memcondition.memoryul).find("li").css('width', '').css('height', '');
    }
    processMemoryRemove(event: JQueryEventObject, ui: JQueryUI.SortableUIParams): void {
    }
}

class RulesManager<W extends IWorld<W>> {
    rulesdiv: HTMLDivElement;
    rulesul: HTMLUListElement;
    actionrepodiv: HTMLDivElement;
    actionrepoul: HTMLUListElement;
    addrulebutton: HTMLButtonElement;
    //rules: IRule<W>[] = [];

    constructor(robot: IRobot<W>, isMultiRule : boolean) {
        var rulesdiv: HTMLDivElement = document.createElement("div");
        var actionrepodiv: HTMLDivElement = document.createElement("div");
        var rulesul: HTMLUListElement = document.createElement("ul");
        var actionrepoul: HTMLUListElement = document.createElement("ul");
        var actionrepoheader: HTMLSpanElement = document.createElement("span");
        actionrepoheader.innerText = "Actions";
        actionrepodiv.appendChild(actionrepoheader);

        rulesdiv.classList.add("rules");
        actionrepodiv.classList.add("actionrepo");

        this.rulesdiv = rulesdiv;
        this.actionrepodiv = actionrepodiv;
        this.rulesul = rulesul;
        this.actionrepoul = actionrepoul;

        var addrulebutton: HTMLButtonElement = document.createElement("button");
        this.addrulebutton = addrulebutton;

        rulesdiv.appendChild(rulesul);
        if (isMultiRule) {
            rulesdiv.appendChild(addrulebutton);
            var plusimg = document.createElement("img");
            plusimg.src = "plus.png";
            addrulebutton.appendChild(plusimg);
            var addruletext = document.createElement("span");
            addruletext.innerText = "Add Rule";
            addrulebutton.appendChild(addruletext);
            addrulebutton.classList.add("addrulebutton");

            var rm = this;

            $(addrulebutton).on("click", function () {
                var rule = robot.addRule();
                rm.addRule(rule);
            });
        }
        actionrepodiv.appendChild(actionrepoul);


        $(rulesul).sortable({
            revert: "invalid"
        });
        //$(rulesul).sortable({
        //    update: (event, ui) => {
        //        var ruleelem = ui.item[0];
        //        for (var i = 0; i < rm.rules.length; i++) {
        //            if (rm.rules[i].getElement() == ruleelem) {
        //                var rule = rm.rules[i];
        //                rm.rules.splice(i, 1);
        //                for (var j = 0; j < rm.rulesul.childElementCount; j++) {
        //                    if (rm.rulesul.childNodes.item(j) == ruleelem) {
        //                        rm.rules.splice(j, 0, rule);
        //                        break;
        //                    }
        //                }
        //                break;
        //            }
        //        }
        //    }
        //});
    }

    clear(): void {
        while (this.rulesul.childNodes.length > 0) {
            this.rulesul.removeChild(this.rulesul.childNodes.item(0));
        }
    }

    addRule(rule: IRule<W>): void {
        var anyrule = <any>rule.getElement();
        anyrule.Rule = rule;
        //rm.rules.push(rule);
        this.rulesul.appendChild(rule.getElement());
        $(".ruleactionlist").sortable({ connectWith: ".ruleactionlist" });
        $(this.actionrepoul).find("li").draggable({ connectToSortable: ".ruleactionlist" });
        $(this.actionrepoul).find(".memory").draggable({ connectToSortable: ".memorydroppable" });
        $(".memorycondlist").sortable({ connectWith: ".memorycondlist" });
    }

    toText(): string {
        var ret: string = "";
        for (let rule of this.getRules()) {
            ret += rule.toText();
        }
        return ret;
    }
    loadFromText(stream: StringStream, robot: IRobot<W>): void {
        while (!stream.atEnd()) {
            var rule = robot.addRule();
            rule.loadFromText(stream, robot);
            this.addRule(rule);
        }
    }
    //static ruleFromText<W extends IWorld<W>>(stream: StringStream, robot: IRobot<W>): IRule<W> {
    //    var tag = stream.peekFront(2);
    //    stream.move(2);
    //    switch (tag) {robot.addRule();
    //        case "BR":
    //            var basicRule = new BasicRule<W>();
    //            basicRule.loadFromText(stream, robot);
    //            return basicRule;
    //        case "MR":
    //            var memoryRule = new MemoryRule<W>();
    //            memoryRule.loadFromText(stream, robot);
    //            return memoryRule;
    //        default: throw new Error("Unknown Rule Type");
    //    }
    //}

    getRulesDiv(): HTMLDivElement {
        return this.rulesdiv;
    }
    getActionRepoDiv(): HTMLDivElement {
        return this.actionrepodiv;
    }

    getRules(): IRule<W>[] {
        var ret: IRule<W>[] = [];
        for (var i = 0; i < this.rulesul.childNodes.length; i++) {
            var anyrule = <any>this.rulesul.childNodes.item(i);
            ret.push(<IRule<W>>anyrule.Rule);
        }
        return ret;
    }
}