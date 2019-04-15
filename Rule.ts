﻿
interface IRule<W extends IWorld<W>> {
    getCondition(): ICondition<W>;
    getActions(): Array<IAction<W>>;
    getElement(): HTMLLIElement;
}


class BasicRule<W extends IWorld<W>> implements IRule<W> {
    ruleli: HTMLLIElement;
    condition: SensorCondition<W>;
    actionul: HTMLUListElement;
    actions: HTMLElement[];

    constructor() {
        var ruleli: HTMLLIElement = document.createElement("li");
        this.ruleli = ruleli;
        ruleli.classList.add("rule");
        var conditiondiv: HTMLDivElement = document.createElement("div");
        conditiondiv.classList.add("ruleconditions");
        var rulesplitdiv: HTMLDivElement = document.createElement("div");
        rulesplitdiv.classList.add("rulesplit");
        var actiondiv: HTMLDivElement = document.createElement("div");
        actiondiv.classList.add("ruleactions");
        var actionul: HTMLUListElement = document.createElement("ul");
        this.actionul = actionul;
        actionul.classList.add("ruleactionlist");
        var condition: SensorCondition<W> = new SensorCondition<W>();
        this.condition = condition;
        ruleli.appendChild(conditiondiv);
        ruleli.appendChild(rulesplitdiv);
        ruleli.appendChild(actiondiv);
        conditiondiv.appendChild(condition.getElement());
        actiondiv.append(actionul);
        $(actionul).sortable({ receive: (event, ui) => this.processReceive(event, ui), remove: (event, ui) => this.processRemove(event, ui), revert: "invalid" });
        this.actions = [];
    }

    indexOfElem(elem: HTMLElement): number {
        for (var i = 0; i < this.actionul.childNodes.length; i++) {
            if (elem == this.actionul.childNodes.item(i)) {
                return i;
            }
        }
        return -1;
    }

    getElement(): HTMLLIElement { return this.ruleli; }

    processReceive(event: JQueryEventObject, ui: JQueryUI.SortableUIParams): void {
        $(this.actionul).find("li").css('width', '').css('height', '');
    }
    processRemove(event: JQueryEventObject, ui: JQueryUI.SortableUIParams): void {
    }

    getCondition(): ICondition<W> {
        return this.condition;
    }
    getActions(): IAction<W>[] {
        var ret: IAction < W > [] =[];
        for (var i = 0; i < this.actionul.childElementCount; i++) {
            var anyelem: any = this.actionul.childNodes.item(i);
            ret.push(anyelem.Action);
        }
        return ret;
    }
    
}

class RulesManager<W extends IWorld<W>> {
    rulesdiv: HTMLDivElement;
    rulesul: HTMLUListElement;
    actionrepodiv: HTMLDivElement;
    actionrepoul: HTMLUListElement;
    addrulebutton: HTMLButtonElement;
    rules: IRule<W>[] = [];

    constructor(robot : IRobot<W>) {
        var rulesdiv: HTMLDivElement = document.createElement("div");
        var actionrepodiv: HTMLDivElement = document.createElement("div");
        var rulesul: HTMLUListElement = document.createElement("ul");
        var actionrepoul: HTMLUListElement = document.createElement("ul");
        var addrulebutton: HTMLButtonElement = document.createElement("button");
        var actionrepoheader: HTMLSpanElement = document.createElement("span");
        actionrepoheader.innerText = "Actions";
        actionrepodiv.appendChild(actionrepoheader);

        rulesdiv.classList.add("rules");
        actionrepodiv.classList.add("actionrepo");

        this.rulesdiv = rulesdiv;
        this.actionrepodiv = actionrepodiv;
        this.rulesul = rulesul;
        this.actionrepoul = actionrepoul;
        this.addrulebutton = addrulebutton;

        rulesdiv.appendChild(rulesul);
        rulesdiv.appendChild(addrulebutton);
        actionrepodiv.appendChild(actionrepoul);

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
            rm.rules.push(rule);
            rulesul.appendChild(rule.getElement());
            $(".ruleactionlist").sortable({ connectWith: ".ruleactionlist" });
            $(actionrepoul).find("li").draggable({ connectToSortable: ".ruleactionlist" });
        });

        $(rulesul).sortable({
            update: (event, ui) => {
                var ruleelem = ui.item[0];
                for (var i = 0; i < rm.rules.length; i++) {
                    if (rm.rules[i].getElement() == ruleelem) {
                        var rule = rm.rules[i];
                        rm.rules.splice(i, 1);
                        for (var j = 0; j < rm.rulesul.childElementCount; j++) {
                            if (rm.rulesul.childNodes.item(j) == ruleelem) {
                                rm.rules.splice(j, 0, rule);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        })
    }

    getRulesDiv(): HTMLDivElement {
        return this.rulesdiv;
    }
    getActionRepoDiv(): HTMLDivElement {
        return this.actionrepodiv;
    }

    getRules(): IRule<W>[] {
        return this.rules;
    }
}