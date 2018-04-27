
enum AFieldState { Empty, Wall };

function ActionToStr(action: Action): string {
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

function WorldStateToPicoStr(ws: IWorldState): string {
    return FieldStateToPicoStr(ws.getNorth(), "N") + FieldStateToPicoStr(ws.getEast(), "E") + FieldStateToPicoStr(ws.getWest(), "W") + FieldStateToPicoStr(ws.getSouth(), "S");
}

function FieldStateToPicoStr(fs: FieldState, wallstr: string): string {
    switch (fs) {
        case FieldState.Empty:
            return "x";
        case FieldState.Unknown:
            return "*";
        case FieldState.Wall:
            return wallstr;
    }
}

function AFieldStateToFieldState(fs: AFieldState): FieldState {
    switch (fs) {
        case AFieldState.Empty:
            return FieldState.Empty;
        case AFieldState.Wall:
            return FieldState.Wall;
    }
}

function MergeFieldStates(l: FieldState, r: FieldState): FieldState {
    if (l == r) {
        return l;
    }
    if (r == FieldState.Unknown) {
        return l;
    }
    return FieldState.Unknown;
}

function FieldStateContains(l: FieldState, r: FieldState): boolean {
    if (l == FieldState.Unknown) {
        return true;
    }
    return l == r;
}

function WorldStateContains(l: IWorldState, r: IWorldState): boolean {
    return FieldStateContains(l.getNorth(), r.getNorth()) &&
        FieldStateContains(l.getEast(), r.getEast()) &&
        FieldStateContains(l.getWest(), r.getWest()) &&
        FieldStateContains(l.getSouth(), r.getSouth());
}

function FieldStatesMatch(l: FieldState, r: FieldState): boolean {
    /*if (r == FieldState.Unknown) {
        return true;
    }*/
    return l == r;
}

function FieldStatesMergeable(l: FieldState, r: FieldState): boolean {
    return l != FieldState.Unknown && l != r;
}

function AllAWS(): AWorldState[] {
    return [new AWorldState(),
        new AWorldState(AFieldState.Empty, AFieldState.Empty, AFieldState.Empty, AFieldState.Wall),
        new AWorldState(AFieldState.Empty, AFieldState.Empty, AFieldState.Wall),
        new AWorldState(AFieldState.Empty, AFieldState.Empty, AFieldState.Wall, AFieldState.Wall),
        new AWorldState(AFieldState.Empty, AFieldState.Wall),
        new AWorldState(AFieldState.Empty, AFieldState.Wall, AFieldState.Empty, AFieldState.Wall),
        new AWorldState(AFieldState.Empty, AFieldState.Wall, AFieldState.Wall),
        new AWorldState(AFieldState.Empty, AFieldState.Wall, AFieldState.Wall, AFieldState.Wall),
        new AWorldState(AFieldState.Wall),
        new AWorldState(AFieldState.Wall, AFieldState.Wall),
        new AWorldState(AFieldState.Wall, AFieldState.Wall, AFieldState.Wall),
        new AWorldState(AFieldState.Wall, AFieldState.Wall, AFieldState.Wall, AFieldState.Wall),
        new AWorldState(AFieldState.Wall, AFieldState.Wall, AFieldState.Empty, AFieldState.Wall),
        new AWorldState(AFieldState.Wall, AFieldState.Empty, AFieldState.Wall, AFieldState.Wall),
        new AWorldState(AFieldState.Wall, AFieldState.Empty, AFieldState.Wall),
        new AWorldState(AFieldState.Wall, AFieldState.Empty, AFieldState.Empty, AFieldState.Wall)
    ];
}

class AWorldState {
    north: AFieldState = AFieldState.Empty;
    east: AFieldState = AFieldState.Empty;
    south: AFieldState = AFieldState.Empty;
    west: AFieldState = AFieldState.Empty;

    constructor(north: AFieldState = AFieldState.Empty, east: AFieldState = AFieldState.Empty, west: AFieldState = AFieldState.Empty, south: AFieldState = AFieldState.Empty) {
        this.north = north;
        this.east = east;
        this.west = west;
        this.south = south;
    }

    equals(other: AWorldState) {
        return this.north == other.north && this.east == other.east && this.south == other.south && this.west == other.west;
    }

    static Copy(aws: AWorldState): AWorldState {
        return new AWorldState().setNorth(aws.north).setEast(aws.east).setSouth(aws.south).setWest(aws.west);
    }

    static FromWorldState(ws: IWorldState) {
        return AWorldState.FromPicoStr(WorldStateToPicoStr(ws));
    }

    static FromPicoStr(str: String): AWorldState[] {
        var ret: AWorldState[] = AllAWS();
        str = str.toLowerCase();
        if (str.length < 4) {
            throw new SyntaxError("missing parts in surroundings descriptor '" + str + "' - needs 4");
        }
        if (str[0] == "*") {
            //var nret: AWorldState[] = [];
            //for (var i = 0; i < ret.length; i++) {
            //    nret.push(ret[i].setNorth(AFieldState.Empty));
            //    nret.push(AWorldState.Copy(ret[i]).setNorth(AFieldState.Wall));
            //}
            //ret = nret;
        } else if (str[0] == "n") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].north == AFieldState.Empty) {
                    ret.splice(i, 1);
                    i--;
                }
                //ret[i].setNorth(AFieldState.Wall);
            }
        } else if (str[0] == "x") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].north == AFieldState.Wall) {
                    ret.splice(i, 1);
                    i--;
                }
                //ret[i].setNorth(AFieldState.Empty);
            }
        } else {
            throw new SyntaxError("unexpected symbol '" + str[0] + "' in north position");
        }
        if (str[1] == "*") {
            //var nret: AWorldState[] = [];
            //for (var i = 0; i < ret.length; i++) {
            //    nret.push(ret[i].setEast(AFieldState.Empty));
            //    nret.push(AWorldState.Copy(ret[i]).setEast(AFieldState.Wall));
            //}
            //ret = nret;
        } else if (str[1] == "e") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].east == AFieldState.Empty) {
                    ret.splice(i, 1);
                    i--;
                }
                //ret[i].setEast(AFieldState.Wall);
            }
        } else if (str[1] == "x") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].east == AFieldState.Wall) {
                    ret.splice(i, 1);
                    i--;
                }
                //ret[i].setEast(AFieldState.Empty);
            }
        } else {
            throw new SyntaxError("unexpected symbol '" + str[1] + "' in east position");
        }
        if (str[2] == "*") {
            //var nret: AWorldState[] = [];
            //for (var i = 0; i < ret.length; i++) {
            //    nret.push(ret[i].setWest(AFieldState.Empty));
            //    nret.push(AWorldState.Copy(ret[i]).setWest(AFieldState.Wall));
            //}
            //ret = nret;
        } else if (str[2] == "w") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].west == AFieldState.Empty) {
                    ret.splice(i, 1);
                    i--;
                }
                //ret[i].setWest(AFieldState.Wall);
            }
        } else if (str[2] == "x") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].west == AFieldState.Wall) {
                    ret.splice(i, 1);
                    i--;
                }
                //ret[i].setWest(AFieldState.Empty);
            }
        } else {
            throw new SyntaxError("unexpected symbol '" + str[2] + "' in west position");
        }
        if (str[3] == "*") {
            //var nret: AWorldState[] = [];
            //for (var i = 0; i < ret.length; i++) {
            //    nret.push(ret[i].setSouth(AFieldState.Empty));
            //    nret.push(AWorldState.Copy(ret[i]).setSouth(AFieldState.Wall));
            //}
            //ret = nret;
        } else if (str[3] == "s") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].south == AFieldState.Empty) {
                    ret.splice(i, 1);
                    i--;
                }
                //ret[i].setSouth(AFieldState.Wall);
            }
        } else if (str[3] == "x") {
            for (var i = 0; i < ret.length; i++) {
                if (ret[i].south == AFieldState.Wall) {
                    ret.splice(i, 1);
                    i--;
                }
                //ret[i].setSouth(AFieldState.Empty);
            }
        } else {
            throw new SyntaxError("unexpected symbol '" + str[3] + "' in south position");
        }
        if (str.length > 4) {
            throw new SyntaxError("unexpected symbol '" + str[4] + "' after surroundings descriptor");
        }
        return ret;
    }

    setNorth(fs: AFieldState = AFieldState.Wall): AWorldState {
        this.north = fs;
        return this;
    }

    setEast(fs: AFieldState = AFieldState.Wall): AWorldState {
        this.east = fs;
        return this;
    }

    setSouth(fs: AFieldState = AFieldState.Wall): AWorldState {
        this.south = fs;
        return this;
    }

    setWest(fs: AFieldState = AFieldState.Wall): AWorldState {
        this.west = fs;
        return this;
    }

    toString() {
        return FieldStateToPicoStr(AFieldStateToFieldState(this.north), "N") +
            FieldStateToPicoStr(AFieldStateToFieldState(this.east), "E") +
            FieldStateToPicoStr(AFieldStateToFieldState(this.west), "W") +
            FieldStateToPicoStr(AFieldStateToFieldState(this.south), "S");
    }
}

class ARule {
    worldstates: AWorldState[];
    action: Action;
    state: AState;
    comments: string[];

    constructor(worldstates: AWorldState[], action: Action, nextState: AState, comments: string[]) {
        this.worldstates = worldstates;
        this.action = action;
        this.state = nextState;
        this.comments = comments;
    }
}

class AState {
    name: string;
    rules: ARule[] = [];

    constructor(name: string) {
        this.name = name;
    }
}

function AWorldState_compress(aws: AWorldState[]): WorldState[] {
    var ret: WorldState[] = [];
    for (var i = 0; i < aws.length; i++) {
        ret.push(new WorldState(AFieldStateToFieldState(aws[i].north),
            AFieldStateToFieldState(aws[i].east),
            AFieldStateToFieldState(aws[i].south),
            AFieldStateToFieldState(aws[i].west)));
    }
    var changed = true;
    while (changed) {
        changed = false;
        for (var i = 0; i < ret.length; i++) {
            var ws: WorldState = ret[i];
            for (var j = 0; j < ret.length; j++) {
                if (j != i) {
                    var ws2: WorldState = ret[j];
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
                        if (WorldStateContains(ws, ws2)) {
                            ret.splice(j, 1);
                            j--;
                            if (j < i) {
                                i--;
                            }
                        }
                        changed = true;
                    }
                }
            }
        }
    }
    return ret;
}

class PicoProgram {
    startstatename: string;
    states: { [name: string]: AState };
    statenames: Array<string>;
    endcomments: string[];
    private constructor() {

    }

    toEditor(): Robot {
        var robot = new Robot(1, 1);
        var startindex = this.statenames.indexOf(this.startstatename);
        robot.addState(this.statenames[startindex]);
        for (var i = 0; i < this.statenames.length; i++) {
            if (i != startindex) {
                robot.addState(this.statenames[i]);
            }
        }
        for (var i = 0; i < this.statenames.length; i++) {
            var state: State = robot.states[this.statenames[i]];
            var astate: AState = this.states[this.statenames[i]];
            for (var j = 0; j < astate.rules.length; j++) {
                var worldstates: WorldState[] = AWorldState_compress(astate.rules[j].worldstates);
                for (var h = 0; h < worldstates.length; h++) {
                    var rule: Rule = state.addRule();
                    rule.worldState.copyFrom(worldstates[h]);
                    rule.actionSelector.setAction(astate.rules[j].action);
                    rule.stateSelector.setState(robot.states[astate.rules[j].state.name]);
                }
            }
        }
        return robot;
    }

    toText(): string[] {
        var ret: string[] = [];

        var indices: { [name: string]: number } = {};
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
            var state: AState = this.states[this.statenames[i]];
            ret.push("## State " + indices[state.name] + ": " + state.name);
            for (var j = 0; j < state.rules.length; j++) {
                var rule: ARule = state.rules[j];
                if (rule.comments.length > 0) {
                    ret.push("");
                }
                for (var h = 0; h < rule.comments.length; h++) {
                    ret.push(rule.comments[h]);
                }
                var worldstates: WorldState[] = AWorldState_compress(rule.worldstates);
                for (var h = 0; h < worldstates.length; h++) {
                    ret.push(indices[state.name] + " " + WorldStateToPicoStr(worldstates[h]) + " -> " + ActionToStr(rule.action) + " " + indices[rule.state.name]);
                }
            }
            ret.push("");
        }
        ret.push("");
        return ret.concat(this.endcomments);
    }

    static fromEditor(robot: Robot): { program: PicoProgram, errors: Error[] } {
        var comments: string[] = [];
        var errors: Error[] = [];
        var states: { [name: string]: AState } = {};
        var statenames: Array<string> = new Array<string>();
        var startstatename = null;
        for (var i = 0; i < robot.statenames.length; i++) {
            if (robot.states[robot.statenames[i]] == robot.initialstate) {
                startstatename = robot.statenames[i];
            }
            var astate: AState = new AState(robot.statenames[i]);
            statenames.push(robot.statenames[i]);
            states[robot.statenames[i]] = astate;
        }

        for (var i = 0; i < robot.statenames.length; i++) {
            var statename: string = robot.statenames[i];
            var state: State = robot.states[statename];
            var astate = states[statename];
            for (var j = 0; j < state.rules.length; j++) {
                var rule = state.rules[j];
                var worldstates: AWorldState[] = AWorldState.FromWorldState(rule.getWorldState());
                for (var h = 0; h < astate.rules.length; h++) {
                    var arule: ARule = astate.rules[h];
                    for (var k = 0; k < arule.worldstates.length; k++) {
                        for (var l = 0; l < worldstates.length; l++) {
                            if (arule.worldstates[k].equals(worldstates[l])) {
                                worldstates.splice(l, 1);
                                break;
                            }
                        }
                    }
                }
                var action: Action = rule.getAction();
                var nextstate: AState = states[rule.stateSelector.value.name];
                astate.rules.push(new ARule(worldstates, action, nextstate, []));
            }
        }

        var pp: PicoProgram = new PicoProgram();
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

    }

    static parse(lines: string[]): { program: PicoProgram, errors: Error[] } {
        var comments: string[] = [];
        var errors: Error[] = [];
        var states: { [name: string]: AState } = {};
        var statenames: Array<string> = new Array<string>();
        var renames: { [sid: string]: string } = {};
        var renamelist: string[] = [];
        var startstatename: string = "0";
        var rulelist: ARule[] = [];
        var rulelines : { [ruleno : number] : number } = {};
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line.length == 0) {
                continue;
            }
            if (line.charAt(0) == "#") { //Comments
                var parsed = false;
                if ((line.substr(0, 9) == "## State " || line.substr(0,8) == "##State ") && line.indexOf(":") >= 0) {
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
                var aws: AWorldState[] = AWorldState.FromPicoStr(matchstr);

                parts[1] = parts[1].trim();
                var actionstr = parts[1].substr(0, parts[1].indexOf(" ")).toLowerCase();
                var action: Action;
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
                var state: AState = null;
                if (statenames.indexOf(instate) < 0) {
                    state = new AState(instate);
                    statenames.push(instate);
                    states[instate] = state;
                } else {
                    state = states[instate];
                }
                var nextstate: AState = null;
                if (statenames.indexOf(nextstatestr) < 0) {
                    nextstate = new AState(nextstatestr);
                    statenames.push(nextstatestr);
                    states[nextstatestr] = nextstate;
                } else {
                    nextstate = states[nextstatestr];
                }
                var rule: ARule = new ARule(aws, action, nextstate, comments);
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
                errors.push(new Error("In line "+String(i)+" ('"+line+"'): "+e.message));
                comments.push(line);
            }
        }
        var nstates: { [name: string]: AState } = {};
        var nstatenames: string[] = [];
        for (var i = 0; i < statenames.length; i++) {
            var sname = statenames[i];
            if (renamelist.indexOf(sname) >= 0) {
                if (sname == "0") {
                    startstatename = renames[sname];
                }
                nstatenames.push(renames[sname]);
                states[sname].name = renames[sname];
                nstates[renames[sname]] = states[sname];

            } else {
                nstatenames.push(sname);
                nstates[sname] = states[sname];
            }
        }
        var pp: PicoProgram = new PicoProgram();
        pp.statenames = nstatenames;
        pp.states = nstates;
        pp.endcomments = comments;
        pp.startstatename = startstatename;
        return { program: pp, errors: errors };
    }
}