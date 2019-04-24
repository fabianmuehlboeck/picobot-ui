
interface IStep<W extends IWorld<W>> {
    getRobot(): IRobot<W>;
    getWorld(): W;
    getSuccessor(): IStep<W>;
    getPredecessor(): IStep<W>;
    isError(): boolean;
    hasPredecessor(): boolean;
    hasSuccessor(): boolean;
    enter(): void;
    exit(): void;
}

abstract class AStep<W extends IWorld<W>> implements IStep<W> {
    robot: IRobot<W>;
    world: W;
    successor: IStep<W> = null;
    predecessor: IStep<W> = null;
    getRobot(): IRobot<W> {
        return this.robot;
    }
    getWorld(): W {
        return this.world;
    }
    getSuccessor(): IStep<W> {
        //if (this.successor == null) {
        this.successor = this.computeSuccessor();
        //}
        return this.successor;
    }
    getPredecessor(): IStep<W> { return this.predecessor; }
    hasPredecessor(): boolean { return this.predecessor != null; }
    abstract computeSuccessor(): IStep<W>;
    abstract hasSuccessor(): boolean;
    abstract isError(): boolean;
    constructor(robot: IRobot<W>, world: W, predecessor: IStep<W>) {
        this.robot = robot; this.world = world; this.predecessor = predecessor;
    }
    abstract enter(): void;
    abstract exit(): void;
}

class InitStep<W extends IWorld<W>> extends AStep<W> {
    constructor(robot: IRobot<W>, world: W) {
        super(robot, world, null);
    }
    computeSuccessor(): IStep<W> {
        return new RuleMatchStep<W>(this.robot, this.world, this, 0);
    }
    hasSuccessor(): boolean { return !this.world.isFinal(); }
    isError(): boolean { return false; }
    enter(): void { }
    exit(): void { }
}
class SimpleInitStep<W extends IWorld<W>> extends AStep<W> {
    constructor(robot: IRobot<W>, world: W) {
        super(robot, world, null);
    }
    computeSuccessor(): IStep<W> {
        return new RuleActionStep<W>(this.robot, this.world, this, this.robot.getRules()[0], 0);
    }
    hasSuccessor(): boolean { return !this.world.isFinal(); }
    isError(): boolean { return false; }
    enter(): void { }
    exit(): void { }
}
class RuleMatchStep<W extends IWorld<W>> extends AStep<W> {
    ruleIndex: number = 0;
    failures: Array<IConditionFailure>;
    rule: IRule<W>;
    condition: ICondition<W>;
    totalFailure: boolean = false;
    constructor(robot: IRobot<W>, world: W, predecessor: IStep<W>, ruleIndex: number) {
        super(robot, world, predecessor);
        this.ruleIndex = ruleIndex;
        if (this.ruleIndex < this.robot.getRules().length) {
            var rule = this.robot.getRules()[this.ruleIndex];
            this.rule = rule;
            this.condition = rule.getCondition();
            this.failures = this.condition.check(world);
        } else {
            this.totalFailure = true;
        }
    }
    hasSuccessor(): boolean { return (!this.world.isFinal()); }
    computeSuccessor(): IStep<W> {
        if (!this.totalFailure) {
            if (this.failures.length == 0) {
                return new RuleActionStep<W>(this.robot, this.world.clearMemory(), this, this.rule, 0);
            }
            return new RuleMatchStep<W>(this.robot, this.world, this, this.ruleIndex + 1);
        }
        return new ErrorStep<W>(this.robot, this.world, this);
    }
    isError(): boolean { return false; }
    enter(): void {
        if (this.condition) {
            this.condition.enter(this.failures);
        }
    }
    exit(): void {
        if (this.condition) {
            this.condition.exit(this.failures);
        }
    }
}
class RuleActionStep<W extends IWorld<W>> extends AStep<W> {
    actionIndex: number;
    rule: IRule<W>;
    action: IAction<W>;
    totalFailure: boolean = false;
    runnable: boolean;
    constructor(robot: IRobot<W>, world: W, predecessor: IStep<W>, rule: IRule<W>, actionIndex: number) {
        super(robot, world, predecessor);
        this.rule = rule;
        this.actionIndex = actionIndex;
        var actions = this.rule.getActions();
        if (this.actionIndex < actions.length) {
            this.action = actions[this.actionIndex];
            this.runnable = this.action.runnable(this.world);
        } else {
            this.totalFailure = true;
        }
    }
    hasSuccessor(): boolean { return !this.world.isFinal(); }
    computeSuccessor(): IStep<W> {
        var actions = this.rule.getActions();
        if (!this.totalFailure) {
            var action = this.action;
            if (!this.runnable) {
                return new ErrorStep<W>(this.robot, this.world, this);
            }
            if (this.actionIndex + 1 < actions.length) {
                return new RuleActionStep<W>(this.robot, action.run(this.world), this, this.rule, this.actionIndex + 1);
            }
            var newworld = action.run(this.world);
            if (newworld.isFinal()) {
                return new FinalStep<W>(this.robot, newworld, this);
            } else {
                return new RuleMatchStep<W>(this.robot, action.run(this.world), this, 0);
            }
        } else {
            return new RuleMatchStep<W>(this.robot, this.world, this, 0);
        }
    }
    enter(): void {
        if (this.action) {
            this.action.enter(this.runnable);
        }
    }
    exit(): void {
        if (this.action) {
            this.action.exit();
        }
    }
    isError(): boolean { return false; }
}
class ErrorStep<W extends IWorld<W>> extends AStep<W> {
    constructor(robot: IRobot<W>, world: W, predecessor: IStep<W>) {
        super(robot, world, predecessor);
    }
    computeSuccessor(): IStep<W> {
        return this;
    }
    hasSuccessor(): boolean { return false; }
    isError(): boolean { return true; }
    enter(): void { this.predecessor.enter(); }
    exit(): void { this.predecessor.exit(); }
}
class FinalStep<W extends IWorld<W>> extends AStep<W> {
    constructor(robot: IRobot<W>, world: W, predecessor: IStep<W>) {
        super(robot, world, predecessor);
    }
    computeSuccessor(): IStep<W> {
        return this;
    }
    hasSuccessor(): boolean { return false; }
    isError(): boolean { return false; }
    enter(): void { }
    exit(): void { }
}