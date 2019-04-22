
interface IConditionFailure {
    getAnimateables(): HTMLElement[];
}

interface ICondition<W extends IWorld<W>> {
    check(world: W): Array<IConditionFailure>;
    enter(failures: Array<IConditionFailure>): void;
    exit(failures: Array<IConditionFailure>): void;
    getElement(): HTMLDivElement;
    toText(): string;
    loadFromText(stream: StringStream, robot: IRobot<W>): void;
}


class ElementConditionFailure implements IConditionFailure {
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    getAnimateables(): HTMLElement[] { return [this.element]; }
}

class SensorCondition<W extends IWorld<W>> implements ICondition<W> {
    sensor: RobotSensorSelector;
    check(world: W): Array<IConditionFailure> {
        var x: number = world.getX();
        var y: number = world.getY();
        var dir: Direction = world.getDirection();
        var map: IMap = world.getMap();
        var ret: Array<IConditionFailure> = [];
        switch (this.sensor.frontSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
                    ret.push(new ElementConditionFailure(this.sensor.frontSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(dir), y + dirYadjust(dir))) {
                    ret.push(new ElementConditionFailure(this.sensor.frontSensor.button));
                }
                break;
        }
        var ldir: Direction = dirTurnLeft(dir);
        switch (this.sensor.leftSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(ldir), y + dirYadjust(ldir))) {
                    ret.push(new ElementConditionFailure(this.sensor.leftSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(ldir), y + dirYadjust(ldir))) {
                    ret.push(new ElementConditionFailure(this.sensor.leftSensor.button));
                }
                break;
        }
        var rdir: Direction = dirTurnRight(dir);
        switch (this.sensor.rightSensor.state) {
            case WallState.Any:
                break;
            case WallState.Free:
                if (map.isWall(x + dirXadjust(rdir), y + dirYadjust(rdir))) {
                    ret.push(new ElementConditionFailure(this.sensor.rightSensor.button));
                }
                break;
            case WallState.Wall:
                if (!map.isWall(x + dirXadjust(rdir), y + dirYadjust(rdir))) {
                    ret.push(new ElementConditionFailure(this.sensor.rightSensor.button));
                }
                break;
        }
        return ret;
    }
    constructor() {
        this.sensor = new RobotSensorSelector();
    }
    enter(failures: Array<IConditionFailure>): void {
        if (failures.length > 0) {
            var elems: Array<HTMLElement> = [];
            for (let failure of failures) {
                elems = elems.concat(failure.getAnimateables());
            }
            $(elems).stop(true).animate({ backgroundColor: "#ff0000" }, 100);
        } else {
            $([this.sensor.frontSensor.button, this.sensor.leftSensor.button, this.sensor.rightSensor.button]).stop(true).animate({ backgroundColor: "#00ff00" }, 100);
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
            $([this.sensor.frontSensor.button, this.sensor.leftSensor.button, this.sensor.rightSensor.button]).stop(true).animate({ backgroundColor: "" }, 100);
        }
    }
    getElement(): HTMLDivElement {
        return this.sensor.getElement();
    }
    toText(): string {
        return wallStateToString(this.sensor.leftSensor.getState()) + wallStateToString(this.sensor.frontSensor.getState()) + wallStateToString(this.sensor.rightSensor.getState());
    }
    loadFromText(stream: StringStream, robot: IRobot<W>): void {
        this.sensor.leftSensor.changeState(stringToWallState(stream.peekFront(1)));
        stream.move(1);
        this.sensor.frontSensor.changeState(stringToWallState(stream.peekFront(1)));
        stream.move(1);
        this.sensor.rightSensor.changeState(stringToWallState(stream.peekFront(1)));
        stream.move(1);
    }
}

class MemoryCondition<W extends IWorld<W>> extends SensorCondition<W> {
    memorydiv: HTMLDivElement;
    memoryul: HTMLUListElement;
    element: HTMLDivElement;
    constructor() {
        super();
        this.element = document.createElement("div");
        this.memorydiv = document.createElement("div");
        this.memoryul = document.createElement("ul");
        this.memorydiv.appendChild(this.memoryul);
        this.element.appendChild(super.getElement());
        this.element.appendChild(this.memorydiv);
        this.memoryul.classList.add("memorycondlist");
        this.memoryul.classList.add("memorydroppable");
        this.memorydiv.classList.add("memoryconddiv");
        this.element.classList.add("memoryconditiondiv");
    }
    check(world: W): IConditionFailure[] {
        var ret = super.check(world);
        var memories: Memory<W>[] = [];
        for (var i = 0; i < this.memoryul.childNodes.length; i++) {
            var memory = <Memory<W>>((<any>(this.memoryul.childNodes.item(i))).Action);
            memories.push(memory);
        }
        ret = ret.concat(world.remembers(memories, this.memoryul));
        return ret;
    }
    getElement(): HTMLDivElement {
        return this.element;
    }
    toText(): string {
        var ret: string = super.toText();
        for (var i = 0; i < this.memoryul.childNodes.length; i++) {
            var memory = <Memory<W>>((<any>(this.memoryul.childNodes.item(i))).Action);
            ret += "M"+memory.memory.getId() + ";";
        }
        return ret+"|";
    }
    loadFromText(stream: StringStream, robot: IRobot<W>): void {
        super.loadFromText(stream, robot);
        var mems = stream.readUntil("|");
        for (let m of mems.split(";")) {
            if (m.length > 0) {
                var memli = robot.getFactory(m).construct();
                addActionDeleteButton(memli);
                this.memoryul.appendChild(memli);
            }
        }
    }
}