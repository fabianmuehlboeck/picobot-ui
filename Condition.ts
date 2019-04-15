
interface IConditionFailure {
    getAnimateables(): HTMLElement[];
}

interface ICondition<W extends IWorld<W>> {
    check(world: W): Array<IConditionFailure>;
    enter(failures: Array<IConditionFailure>): void;
    exit(failures: Array<IConditionFailure>): void;
}


class ElementConditionFailure implements IConditionFailure {
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    getAnimateables(): HTMLElement[] { return [this.element]; }
}

class SensorCondition<W extends IWorld<W>> extends RobotSensorSelector implements ICondition<W> {
    check(world: W): Array<IConditionFailure> {
        var x: number = world.getX();
        var y: number = world.getY();
        var dir: Direction = world.getDirection();
        var map: IMap = world.getMap();
        var ret: Array<IConditionFailure> = [];
        switch (this.frontSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
                    ret.push(new ElementConditionFailure(this.frontSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
                    ret.push(new ElementConditionFailure(this.frontSensor.button));
                }
                break;
        }
        var ldir: Direction = dirTurnLeft(dir);
        switch (this.leftSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(ldir), y + dirYadjust(ldir))) {
                    ret.push(new ElementConditionFailure(this.leftSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(ldir), y + dirYadjust(ldir))) {
                    ret.push(new ElementConditionFailure(this.leftSensor.button));
                }
                break;
        }
        var rdir: Direction = dirTurnRight(dir);
        switch (this.rightSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(rdir), y + dirYadjust(rdir))) {
                    ret.push(new ElementConditionFailure(this.rightSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(rdir), y + dirYadjust(rdir))) {
                    ret.push(new ElementConditionFailure(this.rightSensor.button));
                }
                break;
        }
        return ret;
    }
    constructor() {
        super();
    }
    enter(failures: Array<IConditionFailure>): void {
        if (failures.length > 0) {
            var elems: Array<HTMLElement> = [];
            for (let failure of failures) {
                elems = elems.concat(failure.getAnimateables());
            }
            $(elems).stop(true).animate({ backgroundColor: "#ff0000" }, 100);
        } else {
            $([this.frontSensor.button, this.leftSensor.button, this.rightSensor.button]).stop(true).animate({ backgroundColor: "#00ff00" }, 100);
        }
    }
    exit(failures: Array<IConditionFailure>): void {
        if (failures.length > 0) {
            var elems: Array<HTMLElement> = [];
            for (let failure of failures) {
                elems = elems.concat(failure.getAnimateables());
            }
            $(elems).stop(true).animate({ backgroundColor: "" }, 100);
        } else {
            $([this.frontSensor.button, this.leftSensor.button, this.rightSensor.button]).stop(true).animate({ backgroundColor: "" }, 100);
        }
    }
}