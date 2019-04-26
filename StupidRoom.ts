
class StupidLevel extends ALevel<StupidWorld> {
    generator: StupidMapGenerator;
    robot: IRobot<StupidWorld>;
    constructor() {
        super();
        this.generator = new StupidMapGenerator();
        this.robot = new ActionRobot<StupidWorld>(this, this.resetWorld());
    }
    getName(): string { return "A Long Program"; }
    resetWorld(): StupidWorld {
        var map: StupidMap = this.generator.getStandardMap();
        return this.makeWorld(map);
    }
    makeWorld(map: StupidMap) {
        return new StupidWorld(Direction.North, 12, 14, new Array<MemoryLabel>(), map);
    }
    getRobot(): IRobot<StupidWorld> {
        return this.robot;
    }
    getTestMaps(): StupidWorld[] {
        return this.generator.getTestMaps().map((mm) => this.makeWorld(mm));
    }
}

class StupidMapGenerator extends AMapGenerator<StupidMap> {
    constructor() {
        super();
    }
    getStandardMap(): StupidMap {
        return new StupidMap(25, 25);
    }
}

class StupidMap extends AGoalMap {
    startx: number;
    starty: number;

    constructor(width: number, height: number) {
        super(width, height);
        this.walls[10][12] = true;
        this.walls[11][12] = true;
        this.walls[12][12] = true;
        this.walls[13][12] = true;
        this.walls[14][12] = true;
        this.walls[10][13] = true;
        this.walls[14][13] = true;
        this.walls[10][14] = true;
        this.walls[14][14] = true;
        this.walls[9][14] = true;
        this.walls[8][14] = true;
        this.walls[15][14] = true;
        this.walls[16][14] = true;

        this.walls[7][11] = true;
        this.walls[6][11] = true;
        this.walls[5][11] = true;
        this.walls[5][12] = true;
        this.walls[5][13] = true;
        this.walls[5][14] = true;
        this.walls[5][15] = true;

        this.walls[17][11] = true;
        this.walls[18][11] = true;
        this.walls[19][11] = true;
        this.walls[19][12] = true;
        this.walls[19][13] = true;
        this.walls[19][14] = true;
        this.walls[19][15] = true;
    }
    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        return [{ sx: 11, sy: 8, ex: 13, ey: 10 }];
    }
}

class StupidWorld extends GoalWorld<StupidWorld> {
    map: StupidMap;
    constructor(direction: Direction, x: number, y: number, memories: MemoryLabel[], map: StupidMap) {
        super(direction, x, y, memories);
        this.map = map;
    }

    copyWith(direction: Direction, x: number, y: number, memories: MemoryLabel[]): StupidWorld {
        return new StupidWorld(direction, x, y, memories, this.map);
    }
    getGoalMap(): GoalMap { return this.map; }

}