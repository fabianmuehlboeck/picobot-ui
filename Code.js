var AFieldState;
(function (AFieldState) {
    AFieldState[AFieldState["Empty"] = 0] = "Empty";
    AFieldState[AFieldState["Wall"] = 1] = "Wall";
})(AFieldState || (AFieldState = {}));
;
function ActionToStr(action) {
    switch (action) {
        case Action.Stay:
            return "X";
        case Action.North:
            return "N";
        case Action.East:
            return "E";
        case Action.West:
            return "W";
        case Action.South:
            return "S";
    }
}
function WorldStateToPicoStr(ws) {
    return FieldStateToPicoStr(ws.getNorth(), "N") + FieldStateToPicoStr(ws.getEast(), "E") + FieldStateToPicoStr(ws.getWest(), "W") + FieldStateToPicoStr(ws.getSouth(), "S");
}
function FieldStateToPicoStr(fs, wallstr) {
    switch (fs) {
        case FieldState.Empty:
            return "x";
        case FieldState.Unknown:
            return "*";
        case FieldState.Wall:
            return wallstr;
    }
}
function AFieldStateToFieldState(fs) {
    switch (fs) {
        case AFieldState.Empty:
            return FieldState.Empty;
        case AFieldState.Wall:
            return FieldState.Wall;
    }
}
function MergeFieldStates(l, r) {
    if (l == r) {
        return l;
    }
    return FieldState.Unknown;
}
function FieldStatesMatch(l, r) {
    if (l == FieldState.Unknown || r == FieldState.Unknown) {
        return true;
    }
    return l == r;
}
var AWorldState = /** @class */ (function () {
    function AWorldState() {
        this.north = AFieldState.Empty;
        this.east = AFieldState.Empty;
        this.south = AFieldState.Empty;
        this.west = AFieldState.Empty;
    }
    AWorldState.prototype.equals = function (other) {
        return this.north == other.north && this.east == other.east && this.south == other.south && this.west == other.west;
    };
    AWorldState.Copy = function (aws) {
        return new AWorldState().setNorth(aws.north).setEast(aws.east).setSouth(aws.south).setWest(aws.west);
    };
    AWorldState.FromWorldState = function (ws) {
        return AWorldState.FromPicoStr(WorldStateToPicoStr(ws));
    };
    AWorldState.FromPicoStr = function (str) {
        var ret = [new AWorldState()];
        str = str.toLowerCase();
        if (str.length < 4) {
            throw new SyntaxError("missing parts in surroundings descriptor '" + str + "' - needs 4");
        }
        if (str[0] == "*") {
            var nret = [];
            for (var i = 0; i < ret.length; i++) {
                nret.push(ret[i].setNorth(AFieldState.Empty));
                nret.push(AWorldState.Copy(ret[i]).setNorth(AFieldState.Wall));
            }
            ret = nret;
        }
        else if (str[0] == "n") {
            for (var i = 0; i < ret.length; i++) {
                ret[i].setNorth(AFieldState.Wall);
            }
        }
        else if (str[0] == "x") {
            for (var i = 0; i < ret.length; i++) {
                ret[i].setNorth(AFieldState.Empty);
            }
        }
        else {
            throw new SyntaxError("unexpected symbol '" + str[0] + "' in north position");
        }
        if (str[1] == "*") {
            var nret = [];
            for (var i = 0; i < ret.length; i++) {
                nret.push(ret[i].setEast(AFieldState.Empty));
                nret.push(AWorldState.Copy(ret[i]).setEast(AFieldState.Wall));
            }
            ret = nret;
        }
        else if (str[1] == "e") {
            for (var i = 0; i < ret.length; i++) {
                ret[i].setEast(AFieldState.Wall);
            }
        }
        else if (str[1] == "x") {
            for (var i = 0; i < ret.length; i++) {
                ret[i].setEast(AFieldState.Empty);
            }
        }
        else {
            throw new SyntaxError("unexpected symbol '" + str[1] + "' in east position");
        }
        if (str[2] == "*") {
            var nret = [];
            for (var i = 0; i < ret.length; i++) {
                nret.push(ret[i].setWest(AFieldState.Empty));
                nret.push(AWorldState.Copy(ret[i]).setWest(AFieldState.Wall));
            }
            ret = nret;
        }
        else if (str[2] == "w") {
            for (var i = 0; i < ret.length; i++) {
                ret[i].setWest(AFieldState.Wall);
            }
        }
        else if (str[2] == "x") {
            for (var i = 0; i < ret.length; i++) {
                ret[i].setWest(AFieldState.Empty);
            }
        }
        else {
            throw new SyntaxError("unexpected symbol '" + str[2] + "' in west position");
        }
        if (str[3] == "*") {
            var nret = [];
            for (var i = 0; i < ret.length; i++) {
                nret.push(ret[i].setSouth(AFieldState.Empty));
                nret.push(AWorldState.Copy(ret[i]).setSouth(AFieldState.Wall));
            }
            ret = nret;
        }
        else if (str[3] == "s") {
            for (var i = 0; i < ret.length; i++) {
                ret[i].setSouth(AFieldState.Wall);
            }
        }
        else if (str[3] == "x") {
            for (var i = 0; i < ret.length; i++) {
                ret[i].setSouth(AFieldState.Empty);
            }
        }
        else {
            throw new SyntaxError("unexpected symbol '" + str[3] + "' in south position");
        }
        if (str.length > 4) {
            throw new SyntaxError("unexpected symbol '" + str[4] + "' after surroundings descriptor");
        }
        return ret;
    };
    AWorldState.prototype.setNorth = function (fs) {
        if (fs === void 0) { fs = AFieldState.Wall; }
        this.north = fs;
        return this;
    };
    AWorldState.prototype.setEast = function (fs) {
        if (fs === void 0) { fs = AFieldState.Wall; }
        this.east = fs;
        return this;
    };
    AWorldState.prototype.setSouth = function (fs) {
        if (fs === void 0) { fs = AFieldState.Wall; }
        this.south = fs;
        return this;
    };
    AWorldState.prototype.setWest = function (fs) {
        if (fs === void 0) { fs = AFieldState.Wall; }
        this.west = fs;
        return this;
    };
    AWorldState.prototype.toString = function () {
        return FieldStateToPicoStr(AFieldStateToFieldState(this.north), "N") +
            FieldStateToPicoStr(AFieldStateToFieldState(this.east), "E") +
            FieldStateToPicoStr(AFieldStateToFieldState(this.west), "W") +
            FieldStateToPicoStr(AFieldStateToFieldState(this.south), "S");
    };
    return AWorldState;
}());
var ARule = /** @class */ (function () {
    function ARule(worldstates, action, nextState, comments) {
        this.worldstates = worldstates;
        this.action = action;
        this.state = nextState;
        this.comments = comments;
    }
    return ARule;
}());
var AState = /** @class */ (function () {
    function AState(name) {
        this.rules = [];
        this.name = name;
    }
    return AState;
}());
function AWorldState_compress(aws) {
    var ret = [];
    for (var i = 0; i < aws.length; i++) {
        ret.push(new WorldState(AFieldStateToFieldState(aws[i].north), AFieldStateToFieldState(aws[i].east), AFieldStateToFieldState(aws[i].south), AFieldStateToFieldState(aws[i].west)));
    }
    var changed = true;
    while (changed) {
        changed = false;
        for (var i = 0; i < ret.length; i++) {
            var ws = ret[i];
            for (var j = i + 1; j < ret.length; j++) {
                var ws2 = ret[j];
                var matches = 0;
                if (FieldStatesMatch(ws.north, ws2.north)) {
                    matches++;
                }
                if (FieldStatesMatch(ws.east, ws2.east)) {
                    matches++;
                }
                if (FieldStatesMatch(ws.south, ws2.south)) {
                    matches++;
                }
                if (FieldStatesMatch(ws.west, ws2.west)) {
                    matches++;
                }
                if (matches >= 3) {
                    ws.setNorth(MergeFieldStates(ws.north, ws2.north));
                    ws.setEast(MergeFieldStates(ws.east, ws2.east));
                    ws.setSouth(MergeFieldStates(ws.south, ws2.south));
                    ws.setWest(MergeFieldStates(ws.west, ws2.west));
                    ret.splice(j, 1);
                    changed = true;
                    j--;
                }
            }
        }
    }
    return ret;
}
var PicoProgram = /** @class */ (function () {
    function PicoProgram() {
    }
    PicoProgram.prototype.toEditor = function () {
        var robot = new Robot(1, 1);
        var startindex = this.statenames.indexOf(this.startstatename);
        robot.addState(this.statenames[startindex]);
        for (var i = 0; i < this.statenames.length; i++) {
            if (i != startindex) {
                robot.addState(this.statenames[i]);
            }
        }
        for (var i = 0; i < this.statenames.length; i++) {
            var state = robot.states[this.statenames[i]];
            var astate = this.states[this.statenames[i]];
            for (var j = 0; j < astate.rules.length; j++) {
                var worldstates = AWorldState_compress(astate.rules[j].worldstates);
                for (var h = 0; h < worldstates.length; h++) {
                    var rule = state.addRule();
                    rule.worldState.copyFrom(worldstates[h]);
                    rule.actionSelector.setAction(astate.rules[j].action);
                    rule.stateSelector.setState(robot.states[astate.rules[j].state.name]);
                }
            }
        }
        return robot;
    };
    PicoProgram.prototype.toText = function () {
        var ret = [];
        var indices = {};
        indices[this.startstatename] = 0;
        {
            var index = 1;
            for (var i = 0; i < this.statenames.length; i++) {
                if (this.statenames[i] != this.startstatename) {
                    indices[this.statenames[i]] = index;
                    index++;
                }
            }
        }
        for (var i = 0; i < this.statenames.length; i++) {
            var state = this.states[this.statenames[i]];
            ret.push("## State " + indices[state.name] + ": " + state.name);
            for (var j = 0; j < state.rules.length; j++) {
                var rule = state.rules[j];
                if (rule.comments.length > 0) {
                    ret.push("");
                }
                for (var h = 0; h < rule.comments.length; h++) {
                    ret.push(rule.comments[h]);
                }
                var worldstates = AWorldState_compress(rule.worldstates);
                for (var h = 0; h < worldstates.length; h++) {
                    ret.push(indices[state.name] + " " + WorldStateToPicoStr(worldstates[h]) + " -> " + ActionToStr(rule.action) + " " + indices[rule.state.name]);
                }
            }
            ret.push("");
        }
        ret.push("");
        return ret.concat(this.endcomments);
    };
    PicoProgram.fromEditor = function (robot) {
        var comments = [];
        var errors = [];
        var states = {};
        var statenames = new Array();
        var startstatename = null;
        for (var i = 0; i < robot.statenames.length; i++) {
            if (robot.states[robot.statenames[i]] == robot.initialstate) {
                startstatename = robot.statenames[i];
            }
            var astate = new AState(robot.statenames[i]);
            statenames.push(robot.statenames[i]);
            states[robot.statenames[i]] = astate;
        }
        for (var i = 0; i < robot.statenames.length; i++) {
            var statename = robot.statenames[i];
            var state = robot.states[statename];
            var astate = states[statename];
            for (var j = 0; j < state.rules.length; j++) {
                var rule = state.rules[j];
                var worldstates = AWorldState.FromWorldState(rule.getWorldState());
                for (var h = 0; h < astate.rules.length; h++) {
                    var arule = astate.rules[h];
                    for (var k = 0; k < arule.worldstates.length; k++) {
                        for (var l = 0; l < worldstates.length; l++) {
                            if (arule.worldstates[k].equals(worldstates[l])) {
                                worldstates.splice(l, 1);
                                break;
                            }
                        }
                    }
                }
                var action = rule.getAction();
                var nextstate = states[rule.stateSelector.value.name];
                astate.rules.push(new ARule(worldstates, action, nextstate, []));
            }
        }
        var pp = new PicoProgram();
        if (statenames.length == 0) {
            statenames.push("Initial State");
            states["Initial State"] = new AState("Initial State");
        }
        pp.statenames = statenames;
        pp.states = states;
        pp.endcomments = comments;
        if (startstatename == null) {
            startstatename = statenames[0];
        }
        pp.startstatename = startstatename;
        return { program: pp, errors: errors };
    };
    PicoProgram.parse = function (lines) {
        var comments = [];
        var errors = [];
        var states = {};
        var statenames = new Array();
        var renames = {};
        var renamelist = [];
        var startstatename = "0";
        var rulelist = [];
        var rulelines = {};
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line.length == 0) {
                continue;
            }
            if (line.charAt(0) == "#") {
                var parsed = false;
                if ((line.substr(0, 9) == "## State " || line.substr(0, 8) == "##State ") && line.indexOf(":") >= 0) {
                    var parts = line.split(":", 2);
                    var sid = parts[0].substr(8).trim();
                    var sname = parts[1].trim();
                    renames[sid] = sname;
                    if (renamelist.indexOf(sid) < 0) {
                        renamelist.push(sid);
                    }
                    parsed = true;
                }
                if (!parsed) {
                    comments.push(line.substr(1));
                }
                continue;
            }
            var parts = line.split("->");
            try {
                if (parts.length != 2) {
                    if (parts.length == 1) {
                        throw new SyntaxError("missing ->");
                    }
                    throw new SyntaxError("too many ->");
                }
                parts[0] = parts[0].trim();
                if (parts[0].indexOf(" ") < 0) {
                    throw new SyntaxError("missing argument before ->");
                }
                if (parts[1].indexOf(" ") < 0) {
                    throw new SyntaxError("missing argument after ->");
                }
                var instate = parts[0].substr(0, parts[0].indexOf(" "));
                if (instate.length == 0) {
                    throw new SyntaxError("no robot state given");
                }
                var matchstr = parts[0].substr(instate.length).trim();
                var aws = AWorldState.FromPicoStr(matchstr);
                parts[1] = parts[1].trim();
                var actionstr = parts[1].substr(0, parts[1].indexOf(" ")).toLowerCase();
                var action;
                switch (actionstr) {
                    case "n":
                        action = Action.North;
                        break;
                    case "e":
                        action = Action.East;
                        break;
                    case "s":
                        action = Action.South;
                        break;
                    case "w":
                        action = Action.West;
                        break;
                    case "x":
                        action = Action.Stay;
                        break;
                    default:
                        throw new SyntaxError("action should be either N, E, S, W, or X, found '" + actionstr + "'");
                }
                var nextstatestr = parts[1].substr(actionstr.length).trim();
                if (nextstatestr.length == 0) {
                    throw new SyntaxError("missing next state");
                }
                var state = null;
                if (statenames.indexOf(instate) < 0) {
                    state = new AState(instate);
                    statenames.push(instate);
                    states[instate] = state;
                }
                else {
                    state = states[instate];
                }
                var nextstate = null;
                if (statenames.indexOf(nextstatestr) < 0) {
                    nextstate = new AState(nextstatestr);
                    statenames.push(nextstatestr);
                    states[nextstatestr] = nextstate;
                }
                else {
                    nextstate = states[nextstatestr];
                }
                var rule = new ARule(aws, action, nextstate, comments);
                rulelist.push(rule);
                rulelines[rulelist.indexOf(rule)] = i;
                for (var j = 0; j < state.rules.length; j++) {
                    for (var h = 0; h < state.rules[j].worldstates.length; h++) {
                        for (var k = 0; k < rule.worldstates.length; k++) {
                            if (state.rules[j].worldstates[h].equals(rule.worldstates[k])) {
                                throw new SyntaxError("Rule collision: the rules on lines " + String(i) + " and " + rulelines[rulelist.indexOf(state.rules[j])] + " both cover the following surroundings: " + rule.worldstates[k].toString() + "\n   Line " + String(i) + ": " + lines[i] + "\n   Line " + String(rulelines[rulelist.indexOf(state.rules[j])]) + ": " + lines[rulelines[rulelist.indexOf(state.rules[j])]]);
                            }
                        }
                    }
                }
                state.rules.push(rule);
                comments = [];
            }
            catch (e) {
                errors.push(new Error("In line " + String(i) + " ('" + line + "'): " + e.message));
                comments.push(line);
            }
        }
        var nstates = {};
        var nstatenames = [];
        for (var i = 0; i < statenames.length; i++) {
            var sname = statenames[i];
            if (renamelist.indexOf(sname) >= 0) {
                if (sname == "0") {
                    startstatename = renames[sname];
                }
                nstatenames.push(renames[sname]);
                states[sname].name = renames[sname];
                nstates[renames[sname]] = states[sname];
            }
            else {
                nstatenames.push(sname);
                nstates[sname] = states[sname];
            }
        }
        var pp = new PicoProgram();
        pp.statenames = nstatenames;
        pp.states = nstates;
        pp.endcomments = comments;
        pp.startstatename = startstatename;
        return { program: pp, errors: errors };
    };
    return PicoProgram;
}());
//# sourceMappingURL=Code.js.map