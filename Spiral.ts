
class SpiralLevel extends ALevel<SpiralWorld> {
    generator: SpiralMapGenerator;
    robot: IRobot<SpiralWorld>;
    constructor() {
        super();
        this.generator = new SpiralMapGenerator();
        this.robot = new BasicRobot<SpiralWorld>(this, this.resetWorld());
    }
    getName(): string { return "Spiral"; }
    resetWorld(): SpiralWorld {
        var map: SpiralMap = this.generator.getStandardMap();
        return this.makeWorld(map);
    }
    makeWorld(map: SpiralMap) {
        var x: number = 1;
        var y: number = map.getHeight() - 2;
        return new SpiralWorld(Direction.East, x, y, new Array<MemoryLabel>(), map);
    }
    getRobot(): IRobot<SpiralWorld> {
        return this.robot;
    }
    getTestMaps(): SpiralWorld[] {
        return this.generator.getTestMaps().map((mm) => this.makeWorld(mm));
    }
}

class SpiralMapGenerator extends AMapGenerator<SpiralMap> {
    constructor() {
        super();
    }
    getStandardMap(): SpiralMap {
        return new SpiralMap(25, 25);
    }
}

class SpiralMap extends AGoalMap {
    startx: number;
    starty: number;

    constructor(width: number, height: number) {
        super(width, height);
        var swidth = 3;
        var curx = 1;
        var cury = height - 2 - swidth;
        var dir = 1;
        while (Math.abs(curx - width / 2) > 2 && Math.abs(cury - height / 2) > 2) {
            while (!this.walls[curx + swidth * dir][cury]) {
                this.walls[curx][cury] = true;
                curx+=dir;
            }
            curx -= dir;
            dir = dir * -1;
            while (!this.walls[curx][cury + swidth *dir]) {
                this.walls[curx][cury] = true;
                cury+=dir;
            }
            cury -= dir;
        }
    }
    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        return [{ sx: 9, sy: 9, ex: 12, ey: 12 }];
    }
}

class SpiralWorld extends GoalWorld<SpiralWorld> {
    map: SpiralMap;
    constructor(direction: Direction, x: number, y: number, memories: MemoryLabel[], map: SpiralMap) {
        super(direction, x, y, memories);
        this.map = map;
    }

    copyWith(direction: Direction, x: number, y: number, memories: MemoryLabel[]): SpiralWorld {
        return new SpiralWorld(direction, x, y, memories, this.map);
    }
    getGoalMap(): GoalMap { return this.map; }

}