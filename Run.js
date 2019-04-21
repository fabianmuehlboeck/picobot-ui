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
var AStep = /** @class */ (function () {
    function AStep(robot, world, predecessor) {
        this.successor = null;
        this.predecessor = null;
        this.robot = robot;
        this.world = world;
        this.predecessor = predecessor;
    }
    AStep.prototype.getRobot = function () {
        return this.robot;
    };
    AStep.prototype.getWorld = function () {
        return this.world;
    };
    AStep.prototype.getSuccessor = function () {
        if (this.successor == null) {
            this.successor = this.computeSuccessor();
        }
        return this.successor;
    };
    AStep.prototype.getPredecessor = function () { return this.predecessor; };
    AStep.prototype.hasPredecessor = function () { return this.predecessor != null; };
    return AStep;
}());
var InitStep = /** @class */ (function (_super) {
    __extends(InitStep, _super);
    function InitStep(robot, world) {
        return _super.call(this, robot, world, null) || this;
    }
    InitStep.prototype.computeSuccessor = function () {
        return new RuleMatchStep(this.robot, this.world, this, 0);
    };
    InitStep.prototype.hasSuccessor = function () { return !this.world.isFinal(); };
    InitStep.prototype.isError = function () { return false; };
    InitStep.prototype.enter = function () { };
    InitStep.prototype.exit = function () { };
    return InitStep;
}(AStep));
var RuleMatchStep = /** @class */ (function (_super) {
    __extends(RuleMatchStep, _super);
    function RuleMatchStep(robot, world, predecessor, ruleIndex) {
        var _this = _super.call(this, robot, world, predecessor) || this;
        _this.ruleIndex = 0;
        _this.totalFailure = false;
        _this.ruleIndex = ruleIndex;
        if (_this.ruleIndex < _this.robot.getRules().length) {
            var rule = _this.robot.getRules()[_this.ruleIndex];
            _this.rule = rule;
            _this.condition = rule.getCondition();
            _this.failures = _this.condition.check(world);
        }
        else {
            _this.totalFailure = true;
        }
        return _this;
    }
    RuleMatchStep.prototype.hasSuccessor = function () { return !this.world.isFinal(); };
    RuleMatchStep.prototype.computeSuccessor = function () {
        if (!this.totalFailure) {
            if (this.failures.length == 0) {
                return new RuleActionStep(this.robot, this.world, this, this.rule, 0);
            }
            return new RuleMatchStep(this.robot, this.world, this, this.ruleIndex + 1);
        }
        return new ErrorStep(this.robot, this.world, this);
    };
    RuleMatchStep.prototype.isError = function () { return false; };
    RuleMatchStep.prototype.enter = function () {
        if (this.condition) {
            this.condition.enter(this.failures);
        }
    };
    RuleMatchStep.prototype.exit = function () {
        if (this.condition) {
            this.condition.exit(this.failures);
        }
    };
    return RuleMatchStep;
}(AStep));
var RuleActionStep = /** @class */ (function (_super) {
    __extends(RuleActionStep, _super);
    function RuleActionStep(robot, world, predecessor, rule, actionIndex) {
        var _this = _super.call(this, robot, world, predecessor) || this;
        _this.totalFailure = false;
        _this.rule = rule;
        _this.actionIndex = actionIndex;
        var actions = _this.rule.getActions();
        if (_this.actionIndex < actions.length) {
            _this.action = actions[_this.actionIndex];
            _this.runnable = _this.action.runnable(_this.world);
        }
        else {
            _this.totalFailure = true;
        }
        return _this;
    }
    RuleActionStep.prototype.hasSuccessor = function () { return !this.world.isFinal(); };
    RuleActionStep.prototype.computeSuccessor = function () {
        var actions = this.rule.getActions();
        if (!this.totalFailure) {
            var action = this.action;
            if (!this.runnable) {
                return new ErrorStep(this.robot, this.world, this);
            }
            if (this.actionIndex + 1 < actions.length) {
                return new RuleActionStep(this.robot, action.run(this.world), this, this.rule, this.actionIndex + 1);
            }
            return new RuleMatchStep(this.robot, action.run(this.world), this, 0);
        }
        else {
            return new RuleMatchStep(this.robot, this.world, this, 0);
        }
    };
    RuleActionStep.prototype.enter = function () {
        if (this.action) {
            this.action.enter(this.runnable);
        }
    };
    RuleActionStep.prototype.exit = function () {
        if (this.action) {
            this.action.exit();
        }
    };
    RuleActionStep.prototype.isError = function () { return false; };
    return RuleActionStep;
}(AStep));
var ErrorStep = /** @class */ (function (_super) {
    __extends(ErrorStep, _super);
    function ErrorStep(robot, world, predecessor) {
        return _super.call(this, robot, world, predecessor) || this;
    }
    ErrorStep.prototype.computeSuccessor = function () {
        return this;
    };
    ErrorStep.prototype.hasSuccessor = function () { return false; };
    ErrorStep.prototype.isError = function () { return true; };
    ErrorStep.prototype.enter = function () { };
    ErrorStep.prototype.exit = function () { };
    return ErrorStep;
}(AStep));
//# sourceMappingURL=Run.js.map