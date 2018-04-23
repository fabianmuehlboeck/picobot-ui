
class State {
    div: HTMLDivElement;
    header: HTMLDivElement;
    body: HTMLDivElement;
    ruleslist: HTMLUListElement;
    name: string;
    rules: Array<Rule> = new Array<Rule>();
    parent: Robot;
    menuItem: HTMLLIElement;
    namefield: HTMLInputElement;

    constructor(name: string, parent: Robot) {
        this.parent = parent;
        var s = this;
        this.name = name;
        this.div = document.createElement("div");
        this.div.classList.add("statediv");
        this.header = document.createElement("div");
        this.header.classList.add("stateheader");
        this.body = document.createElement("div");
        this.body.classList.add("statebody");
        this.menuItem = document.createElement("li");
        this.menuItem.appendChild(document.createElement("div"));
        (<HTMLDivElement>this.menuItem.firstChild).innerText = this.name;

        var expander = document.createElement("button");
        expander.classList.add("expander");
        expander.addEventListener("click", function () {
            s.toggleVisibility();
        });
        this.header.appendChild(expander);

        var namefield = document.createElement("input");
        namefield.type = "text";
        namefield.maxLength = 30;
        namefield.value = this.name;
        namefield.addEventListener("change", function () {
            if (namefield.value.length == 0) {
                alert("State name cannot be empty!");
                namefield.value = s.name;
                namefield.selectionStart = 0;
                namefield.selectionEnd = s.name.length;
                namefield.focus();
            } else if (namefield.value != name && parent.statenames.indexOf(namefield.value) >= 0) {
                alert('There already is another state named "' + namefield.value + '"!');
                namefield.value = s.name;
                namefield.value = s.name;
                namefield.selectionStart = 0;
                namefield.selectionEnd = s.name.length;
                namefield.focus();
            } else {
                s.changeName(namefield.value);
            }
        });
        this.namefield = namefield;
        this.header.appendChild(namefield);

        var delbutton = document.createElement("button");
        delbutton.appendChild(document.createTextNode("Delete"));
        this.header.appendChild(delbutton);
       
        //var table = document.createElement("table");
        //var header = table.createTHead();
        //var hrow = header.insertRow();
        //var hcell = hrow.insertCell();
        //hcell.innerText = "Priority";
        //hcell = hrow.insertCell();
        //hcell.innerText = "Case";
        //hcell = hrow.insertCell();
        //hcell.innerText = "Move to";
        //hcell = hrow.insertCell();
        //hcell.innerText = "Switch to State";
        //hcell = hrow.insertCell();
        //var body = table.createTBody();
        //var row = body.insertRow();
        //var cell = row.insertCell();
        //cell.colSpan = 3;
        //var button = document.createElement("button");
        //button.value = "New Rule";
        //button.innerText = "New Rule";
        //button.onclick = function () {
        //    var rule = new Rule(s);
        //    s.rules.push(rule);
        //}
        //cell.appendChild(button);
        this.ruleslist = document.createElement("ul");
        this.body.appendChild(this.ruleslist);

        var addrulebutton = document.createElement("button");
        addrulebutton.innerText = "Add Rule";
        addrulebutton.addEventListener("click", function () {
            s.addRule();
        })
        this.body.appendChild(addrulebutton);
        this.div.appendChild(this.header);
        this.div.appendChild(this.body);
        $(this.ruleslist).sortable({
            update: function (event, ui) {
                var item = ui.item[0];
                for (var i = 0; i < s.rules.length; i++) {
                    if (item == s.rules[i].elem) {
                        var rule = s.rules[i];
                        s.rules.splice(i, 1);
                        for (var j = 0; j < s.ruleslist.children.length; j++) {
                            if (s.ruleslist.children[j] == item) {
                                s.rules.splice(j, 0, rule);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        });
    }

    expand() {
        if (this.div.classList.contains("collapsed")) {
            this.div.classList.remove("collapsed");
            //$(this.body).show("drop", { direction: "down" }, "fast");
        }
    }

    collapse() {
        if (!this.div.classList.contains("collapsed")) {
            this.div.classList.add("collapsed");
            //$(this.body).hide("drop", { direction: "down" }, "slow");
        }
    }

    toggleVisibility() {
        if (this.div.classList.contains("collapsed")) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    //init(): void {
    //    var rule = new Rule(this);
    //    this.rules.push(rule);
    //}


    changeName(newName: string): void {
        var oldName = this.name;
        this.name = newName;
        (<HTMLDivElement>this.menuItem.firstChild).innerText = this.name;
        this.parent.renameState(this, oldName);
    }

    delete(): void {
        this.rules.forEach(function (val, index, array) {
            val.delete();
        });
        this.parent.removeState(this);
    }

    addRule() : Rule {
        var rule = new Rule(this);
        this.rules.push(rule);
        this.ruleslist.appendChild(rule.elem);
        $(this.ruleslist).sortable("refresh");
        var ly = $('html, body').scrollTop() + jQuery(window).height() - 120;
        if ($(rule.elem).offset().top + $(rule.elem).outerHeight() > ly) {
            var nst = $('html, body').scrollTop() + ($(rule.elem).offset().top + $(rule.elem).outerHeight() - ly);
            $('html, body').animate({
                scrollTop: nst
            }, 300);
        }
        return rule;
    }

    removeRule(r: Rule) {
        var index = this.rules.indexOf(r);
        if (index == 0 && this.rules.length > 1) {
            this.rules[1].upbutton.disabled = true;
        }
        if (index == this.rules.length - 1 && this.rules.length > 1) {
            this.rules[index - 1].downbutton.disabled = true;
        }
        r.delete();
        this.rules.splice(index, 1);
        this.ruleslist.removeChild(r.elem);
        $(this.ruleslist).sortable("refresh");
        $('.ui-tooltip').remove();
    }

    moveUpRule(r: Rule): void {
        var index = this.rules.indexOf(r);
        if (index > 0) {
            var swapper = this.rules[index - 1];
            this.rules.splice(index - 1, 2, r, swapper);
            var rrow = this.ruleslist.childNodes.item(index);
            var srow = this.ruleslist.childNodes.item(index - 1);
            this.ruleslist.removeChild(rrow);
            this.ruleslist.insertBefore(rrow, srow);
            swapper.upbutton.disabled = false;
            swapper.downbutton.disabled = index + 1 >= this.rules.length;
            r.upbutton.disabled = index - 1 == 0;
            r.downbutton.disabled = false;
            this.rules.splice(index, 2, this.rules[index], this.rules[index - 1]);
        }
    }

    moveDownRule(r: Rule): void {
        var index = this.rules.indexOf(r);
        if (index >= 0 && index + 1 < this.rules.length) {
            var swapper = this.rules[index + 1];
            this.rules.splice(index, 2, swapper, r);
            var rrow = this.ruleslist.childNodes.item(index);
            var srow = this.ruleslist.childNodes.item(index + 1);
            this.ruleslist.removeChild(srow);
            this.ruleslist.insertBefore(srow, rrow);
            swapper.downbutton.disabled = false;
            swapper.upbutton.disabled = index == 0;
            r.upbutton.disabled = false;
            r.downbutton.disabled = index + 2 >= this.rules.length;
            this.rules.splice(index, 2, this.rules[index + 1], this.rules[index]);
        }
    }

    //toCode(): Array<string> {
    //    var s = this;
    //    var ret = new Array<string>();
    //    var cases = new WPC();
    //    this.rules.forEach(function (rule, index, array) {
    //        var matches = cases.Cases.filter(function (pattern, i, a) {
    //            return pattern.matches(rule.getWorldState().getPattern());
    //        });
    //        matches.forEach(function (pattern, i, a) {
    //            cases.Cases.splice(cases.Cases.indexOf(pattern), 1);
    //            ret.push(String(s.tempid) + " " + pattern.toString() + " -> " + rule.actionSelector.actionString() + " " + String(rule.getState().tempid));
    //        });
    //    });
    //    return ret;
    //}
}
