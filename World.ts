
enum Direction { East, South, West, North };

interface IWorld<W extends IWorld<W>> {
    turnLeft(): W;
    turnRight(): W;
    moveForward(): W;
    remember(memory: MemoryLabel): W;
    remembers(memories: Memory<W>[], memul: HTMLUListElement): IConditionFailure[];
    clearMemory(): W;

    getX(): number;
    getY(): number;
    getDirection(): Direction;
    getMap(): IMap;

    setDirection(dir: Direction): W;
    setX(x: number): W;
    setY(y: number): W;

    isFinal(): boolean;
    draw(mapcanvas: HTMLCanvasElement);
}

abstract class AWorld<W extends IWorld<W>> implements IWorld<W> {
    direction: Direction;
    x: number;
    y: number;
    memories: Array<MemoryLabel>;

    abstract copyWith(direction: Direction, x: number, y: number, memories: Array<MemoryLabel>): W;

    constructor(direction: Direction, x: number, y: number, memories: Array<MemoryLabel>) {
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.memories = memories;
    }

    remembers(memories: Memory<W>[], memul: HTMLUListElement): IConditionFailure[] {
        var tempmems = this.memories.map((l) => l);
        var ret: IConditionFailure[] = [];
        while (memories.length > 0 ) {
            var index = tempmems.indexOf(memories[0].memory);
            if (index < 0) {
                ret.push(new ElementConditionFailure(memories[0].actionli));
            }
            else {
                tempmems.splice(index, 1);
            }
            memories.splice(0, 1);
        }
        if (tempmems.length > 0) {
            ret.push(new ElementConditionFailure(memul));
        }
        return ret;
    }

    turnLeft(): W {
        switch (this.direction) {
            case Direction.East:
                return this.copyWith(Direction.North, this.x, this.y, this.memories);
            case Direction.South:
                return this.copyWith(Direction.East, this.x, this.y, this.memories);
            case Direction.West:
                return this.copyWith(Direction.South, this.x, this.y, this.memories);
            case Direction.North:
                return this.copyWith(Direction.West, this.x, this.y, this.memories);
        }
    }
    turnRight(): W {
        switch (this.direction) {
            case Direction.East:
                return this.copyWith(Direction.South, this.x, this.y, this.memories);
            case Direction.South:
                return this.copyWith(Direction.West, this.x, this.y, this.memories);
            case Direction.West:
                return this.copyWith(Direction.North, this.x, this.y, this.memories);
            case Direction.North:
                return this.copyWith(Direction.East, this.x, this.y, this.memories);
        }
    }
    moveForward(): W {
        var newx = this.x;
        var newy = this.y;
        switch (this.direction) {
            case Direction.East:
                newx++;
                break;
            case Direction.South:
                newy++;
                break;
            case Direction.West:
                newx--;
                break;
            case Direction.North:
                newy--;
                break;
        }
        if (this.getMap().canMoveTo(newx, newy)) {
            return this.copyWith(this.direction, newx, newy, this.memories);
        }
        throw new Error("Can't move forward.");
    }
    remember(memory: MemoryLabel): W {
        if (this.memories.indexOf(memory) < 0) {
            var newmems = Array<MemoryLabel>();
            for (let l of this.memories) {
                newmems.push(l);
            }
            newmems.push(memory);
            return this.copyWith(this.direction, this.x, this.y, newmems);
        }
        return this.copyWith(this.direction, this.x, this.y, this.memories);
    }
    clearMemory(): W {
        return this.copyWith(this.direction, this.x, this.y, new Array<MemoryLabel>());
    }
    getX(): number {
        return this.x;
    }
    getY(): number {
        return this.y;
    }
    getDirection(): Direction {
        return this.direction;
    }
    abstract getMap(): IMap;
    setDirection(dir: Direction): W {
        return this.copyWith(dir, this.x, this.y, this.memories);
    }
    setX(x: number): W {
        return this.copyWith(this.direction, x, this.y, this.memories);
    }
    setY(y: number): W {
        return this.copyWith(this.direction, this.x, y, this.memories);
    }
    abstract isFinal(): boolean;
    drawWorldBackground(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {

    }
    draw(mapcanvas: HTMLCanvasElement) {
        var ctx = mapcanvas.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var map = this.getMap();
        var cellwidth = mapcanvas.width / map.getWidth();
        var cellheight = mapcanvas.height / map.getHeight();
        this.getMap().draw(ctx, cellwidth, cellheight);
        this.drawWorldBackground(ctx, cellwidth, cellheight);
        var xt: number = (this.getX() * cellwidth) + cellwidth / 2;
        var yt: number = (this.getY() * cellheight) + cellheight / 2;
        ctx.translate(xt, yt);
        var rotation: number = 0;
        switch (this.getDirection()) {
            case Direction.East:
                rotation = Math.PI / 2;
                break;
            case Direction.South:
                rotation = Math.PI;
                break;
            case Direction.West:
                rotation = Math.PI * 1.5;
                break;
            case Direction.North:
                break;
        }
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(-cellwidth / 2, cellheight / 2);
        ctx.lineTo(0, -cellheight / 2);
        ctx.lineTo(cellwidth / 2, cellheight / 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = ROBOTCOLOR;
        ctx.fill();
        //ctx.fillRect(-cellwidth / 2, -cellheight / 2, cellwidth, cellheight);
        ctx.rotate(-rotation);
        ctx.translate(-xt, -yt);
    }
}

abstract class GoalWorld<W extends IWorld<W>> extends AWorld<W> {
    abstract getGoalMap(): GoalMap;
    getMap(): IMap { return this.getGoalMap(); }
    isFinal(): boolean { return this.getGoalMap().isGoal(this.getX(), this.getY()); }
}

abstract class VacuumWorld<W extends IWorld<W>> extends AWorld<W> {
    vacuumed: boolean[][];

    constructor(direction : Direction, x : number, y : number, memories : MemoryLabel[], vacuumed : boolean[][]) {
        super(direction, x, y, memories);
        this.vacuumed = vacuumed;
    }
    abstract getVacuumMap(): AVacuumMap;
    getMap(): IMap { return this.getVacuumMap(); }

    drawWorldBackground(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) {
        for (var x = 0; x < this.getMap().getWidth(); x++) {
            for (var y = 0; y < this.getMap().getHeight(); y++) {
                if (this.vacuumed[x][y]) {
                    ctx.fillStyle = "#BBBBBB";
                    ctx.fillRect(x * cellwidth, y * cellheight, cellwidth, cellheight);
                }
            }
        }
    }

    abstract copyWithVacuumed(direction: Direction, x: number, y: number, memories: MemoryLabel[], vacuumed: boolean[][]) : W;
    copyWith(direction: Direction, x: number, y: number, memories: MemoryLabel[]): W {
        var newvac: boolean[][] = [];
        for (var vx = 0; vx < this.vacuumed.length; vx++) {
            newvac.push([]);
            for (var vy = 0; vy < this.vacuumed[vx].length; vy++) {
                newvac[vx].push(this.vacuumed[vx][vy]);
            }
        }
        newvac[x][y] = true;
        return this.copyWithVacuumed(direction, x, y, memories, newvac);
    }

    isFinal(): boolean {
        for (var x = 0; x < this.getMap().getWidth(); x++) {
            for (var y = 0; y < this.getMap().getHeight(); y++) {
                if ((!this.getMap().canMoveTo(x, y)) || this.vacuumed[x][y]) {
                    continue;
                }
                return false;
            }
        }
        return true;
    }
}