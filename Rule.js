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
function addActionDeleteButton(actionli) {
    var delbutton = document.createElement("button");
    delbutton.classList.add("actiondeletebutton");
    $(delbutton).on("click", function () {
        actionli.parentElement.removeChild(actionli);
        var anyelem = actionli;
        anyelem.Action.delete();
    });
    actionli.appendChild(delbutton);
}
var BasicRule = /** @class */ (function () {
    function BasicRule() {
        var _this = this;
        var ruleli = document.createElement("li");
        this.ruleli = ruleli;
        ruleli.classList.add("rule");
        var conditiondiv = document.createElement("div");
        conditiondiv.classList.add("ruleconditions");
        var rulesplitdiv = document.createElement("div");
        rulesplitdiv.classList.add("rulesplit");
        var actiondiv = document.createElement("div");
        actiondiv.classList.add("ruleactions");
        var actionul = document.createElement("ul");
        this.actionul = actionul;
        actionul.classList.add("ruleactionlist");
        var condition = this.makeCondition();
        this.condition = condition;
        ruleli.appendChild(conditiondiv);
        ruleli.appendChild(rulesplitdiv);
        ruleli.appendChild(actiondiv);
        conditiondiv.appendChild(condition.getElement());
        actiondiv.append(actionul);
        $(actionul).sortable({ receive: function (event, ui) { return _this.processReceive(event, ui); }, remove: function (event, ui) { return _this.processRemove(event, ui); }, revert: "invalid" });
        this.actions = [];
        var ruledeletebutton = document.createElement("button");
        ruledeletebutton.classList.add("ruledeletebutton");
        this.ruleli.appendChild(ruledeletebutton);
        $(ruledeletebutton).on("click", function () { return _this.ruleli.parentNode.removeChild(_this.ruleli); });
    }
    BasicRule.prototype.makeCondition = function () {
        return new SensorCondition();
    };
    //indexOfElem(elem: HTMLElement): number {
    //    for (var i = 0; i < this.actionul.childNodes.length; i++) {
    //        if (elem == this.actionul.childNodes.item(i)) {
    //            return i;
    //        }
    //    }
    //    return -1;
    //}
    BasicRule.prototype.getElement = function () { return this.ruleli; };
    BasicRule.prototype.processReceive = function (event, ui) {
        $(this.actionul).find("li").css('width', '').css('height', '');
    };
    BasicRule.prototype.processRemove = function (event, ui) {
    };
    BasicRule.prototype.getCondition = function () {
        return this.condition;
    };
    BasicRule.prototype.getActions = function () {
        var ret = [];
        for (var i = 0; i < this.actionul.childElementCount; i++) {
            var anyelem = this.actionul.childNodes.item(i);
            ret.push(anyelem.Action);
        }
        return ret;
    };
    BasicRule.prototype.toText = function () {
        var ret = "";
        ret += this.getCondition().toText();
        for (var _i = 0, _a = this.getActions(); _i < _a.length; _i++) {
            var action = _a[_i];
            ret += action.toText() + ";";
        }
        return ret + "#";
    };
    BasicRule.prototype.loadFromText = function (stream, robot) {
        this.condition.loadFromText(stream, robot);
        this.loadActions(stream, robot);
    };
    BasicRule.prototype.loadActions = function (stream, robot) {
        var actions = stream.readUntil("#");
        for (var _i = 0, _a = actions.split(";"); _i < _a.length; _i++) {
            var a = _a[_i];
            if (a.length > 0) {
                var actionli = robot.getFactory(a).construct();
                addActionDeleteButton(actionli);
                this.actionul.appendChild(actionli);
            }
        }
    };
    return BasicRule;
}());
var MemoryRule = /** @class */ (function (_super) {
    __extends(MemoryRule, _super);
    function MemoryRule() {
        var _this = _super.call(this) || this;
        _this.actionul.classList.add("memorydroppable");
        $(_this.memcondition.memoryul).sortable({ receive: function (event, ui) { return _this.processMemoryReceive(event, ui); }, remove: function (event, ui) { return _this.processMemoryRemove(event, ui); }, revert: "invalid" });
        return _this;
    }
    MemoryRule.prototype.makeCondition = function () {
        this.memcondition = new MemoryCondition();
        return this.memcondition;
    };
    MemoryRule.prototype.processMemoryReceive = function (event, ui) {
        $(this.memcondition.memoryul).find("li").css('width', '').css('height', '');
    };
    MemoryRule.prototype.processMemoryRemove = function (event, ui) {
    };
    return MemoryRule;
}(BasicRule));
var RulesManager = /** @class */ (function () {
    //rules: IRule<W>[] = [];
    function RulesManager(robot) {
        var rulesdiv = document.createElement("div");
        var actionrepodiv = document.createElement("div");
        var rulesul = document.createElement("ul");
        var actionrepoul = document.createElement("ul");
        var addrulebutton = document.createElement("button");
        var actionrepoheader = document.createElement("span");
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
            rm.addRule(rule);
        });
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
    RulesManager.prototype.clear = function () {
        while (this.rulesul.childNodes.length > 0) {
            this.rulesul.removeChild(this.rulesul.childNodes.item(0));
        }
    };
    RulesManager.prototype.addRule = function (rule) {
        var anyrule = rule.getElement();
        anyrule.Rule = rule;
        //rm.rules.push(rule);
        this.rulesul.appendChild(rule.getElement());
        $(".ruleactionlist").sortable({ connectWith: ".ruleactionlist" });
        $(this.actionrepoul).find("li").draggable({ connectToSortable: ".ruleactionlist" });
        $(this.actionrepoul).find(".memory").draggable({ connectToSortable: ".memorydroppable" });
        $(".memorycondlist").sortable({ connectWith: ".memorycondlist" });
    };
    RulesManager.prototype.toText = function () {
        var ret = "";
        for (var _i = 0, _a = this.getRules(); _i < _a.length; _i++) {
            var rule = _a[_i];
            ret += rule.toText();
        }
        return ret;
    };
    RulesManager.prototype.loadFromText = function (stream, robot) {
        while (!stream.atEnd()) {
            var rule = robot.addRule();
            rule.loadFromText(stream, robot);
            this.addRule(rule);
        }
    };
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
    RulesManager.prototype.getRulesDiv = function () {
        return this.rulesdiv;
    };
    RulesManager.prototype.getActionRepoDiv = function () {
        return this.actionrepodiv;
    };
    RulesManager.prototype.getRules = function () {
        var ret = [];
        for (var i = 0; i < this.rulesul.childNodes.length; i++) {
            var anyrule = this.rulesul.childNodes.item(i);
            ret.push(anyrule.Rule);
        }
        return ret;
    };
    return RulesManager;
}());
//# sourceMappingURL=Rule.js.map