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
        actionul.classList.add("memorydroppable");
        var condition = this.makeCondition();
        this.condition = condition;
        ruleli.appendChild(conditiondiv);
        ruleli.appendChild(rulesplitdiv);
        ruleli.appendChild(actiondiv);
        conditiondiv.appendChild(condition.getElement());
        actiondiv.append(actionul);
        $(actionul).sortable({ receive: function (event, ui) { return _this.processReceive(event, ui); }, remove: function (event, ui) { return _this.processRemove(event, ui); }, revert: "invalid" });
        this.actions = [];
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
    return BasicRule;
}());
var MemoryRule = /** @class */ (function (_super) {
    __extends(MemoryRule, _super);
    function MemoryRule() {
        var _this = _super.call(this) || this;
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
    function RulesManager(robot) {
        this.rules = [];
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
            rm.rules.push(rule);
            rulesul.appendChild(rule.getElement());
            $(".ruleactionlist").sortable({ connectWith: ".ruleactionlist" });
            $(actionrepoul).find("li").draggable({ connectToSortable: ".ruleactionlist" });
            $(actionrepoul).find(".memory").draggable({ connectToSortable: ".memorydroppable" });
            $(".memorycondlist").sortable({ connectWith: ".memorycondlist" });
        });
        $(rulesul).sortable({
            update: function (event, ui) {
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
        });
    }
    RulesManager.prototype.getRulesDiv = function () {
        return this.rulesdiv;
    };
    RulesManager.prototype.getActionRepoDiv = function () {
        return this.actionrepodiv;
    };
    RulesManager.prototype.getRules = function () {
        return this.rules;
    };
    return RulesManager;
}());
//# sourceMappingURL=Rule.js.map