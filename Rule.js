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
        var condition = new SensorCondition();
        this.condition = condition;
        ruleli.appendChild(conditiondiv);
        ruleli.appendChild(rulesplitdiv);
        ruleli.appendChild(actiondiv);
        conditiondiv.appendChild(condition.getElement());
        actiondiv.append(actionul);
        $(actionul).sortable({ receive: function (event, ui) { return _this.processReceive(event, ui); }, remove: function (event, ui) { return _this.processRemove(event, ui); }, revert: "invalid" });
        this.actions = [];
    }
    BasicRule.prototype.indexOfElem = function (elem) {
        for (var i = 0; i < this.actionul.childNodes.length; i++) {
            if (elem == this.actionul.childNodes.item(i)) {
                return i;
            }
        }
        return -1;
    };
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