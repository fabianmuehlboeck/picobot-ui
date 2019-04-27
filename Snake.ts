
class SnakeLevel extends ALevel<SnakeWorld> {
    generator: SnakeMapGenerator;
    robot: IRobot<SnakeWorld>;
    constructor() {
        super();
        this.generator = new SnakeMapGenerator();
        this.robot = new SensorRobot<SnakeWorld>(this, this.resetWorld());
    }
    getName(): string { return "Snake"; }
    resetWorld(): SnakeWorld {
        var map: SnakeMap = this.generator.getStandardMap();
        return this.makeWorld(map);
    }
    makeWorld(map: SnakeMap) {
        var x: number = 1;
        var y: number = 1;
        return new SnakeWorld(Direction.East, x, y, new Array<MemoryLabel>(), map);
    }
    getRobot(): IRobot<SnakeWorld> {
        return this.robot;
    }
    getTestMaps(): SnakeWorld[] {
        return this.generator.getTestMaps().map((mm) => this.makeWorld(mm));
    }
}

class SnakeMapGenerator extends AMapGenerator<SnakeMap> {
    constructor() {
        super();
    }
    getStandardMap(): SnakeMap {
        return new SnakeMap(25, 25);
    }
}

class SnakeMap extends AGoalMap {
    startx: number;
    starty: number;

    constructor(width: number, height: number) {
        super(width, height);
        var swidth = 1;
        var cury = 1+ swidth;
        var dir = 1;
        var row = 0;
        while (cury <= height - swidth - 2) {
            if (row % 2 == 0) {
                var curx = 1;
                while (curx < width - swidth - 1) {
                    this.walls[curx][cury] = true;
                    curx++;
                }
            } else {
                var curx = width - 2;
                while (curx > swidth) {
                    this.walls[curx][cury] = true;
                    curx--;
                }
            }
            row++;
            cury += swidth + 1;
        }
    }
    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        return [{ sx: 1, sy: this.height - 2, ex: 1, ey: this.height - 2  }];
    }
}

class SnakeWorld extends GoalWorld<SnakeWorld> {
    map: SnakeMap;
    constructor(direction: Direction, x: number, y: number, memories: MemoryLabel[], map: SnakeMap) {
        super(direction, x, y, memories);
        this.map = map;
    }

    copyWith(direction: Direction, x: number, y: number, memories: MemoryLabel[]): SnakeWorld {
        return new SnakeWorld(direction, x, y, memories, this.map);
    }
    getGoalMap(): GoalMap { return this.map; }

}