﻿
class StartLevel extends ALevel<StartWorld> {
    generator: StartMapGenerator;
    robot: IRobot<StartWorld>;
    constructor() {
        super();
        this.generator = new StartMapGenerator();
        this.robot = new ActionRobot<StartWorld>(this, this.resetWorld());
    }
    getName(): string { return "A First Program"; }
    resetWorld(): StartWorld {
        var map: StartMap = this.generator.getStandardMap();
        return this.makeWorld(map);
    }
    makeWorld(map: StartMap) {
        return new StartWorld(Direction.North, 12, 14, new Array<MemoryLabel>(), map);
    }
    getRobot(): IRobot<StartWorld> {
        return this.robot;
    }
    getTestMaps(): StartWorld[] {
        return this.generator.getTestMaps().map((mm) => this.makeWorld(mm));
    }
}

class StartMapGenerator extends AMapGenerator<StartMap> {
    constructor() {
        super();
    }
    getStandardMap(): StartMap {
        return new StartMap(25, 25);
    }
}

class StartMap extends AGoalMap {
    startx: number;
    starty: number;

    constructor(width: number, height: number) {
        super(width, height);
        this.walls[11][12] = true;
        this.walls[12][12] = true;
        this.walls[13][12] = true;
        
    }
    getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[] {
        return [{ sx: 11, sy: 8, ex: 13, ey: 10 }];
    }
}

class StartWorld extends GoalWorld<StartWorld> {
    map: StartMap;
    constructor(direction: Direction, x: number, y: number, memories: MemoryLabel[], map: StartMap) {
        super(direction, x, y, memories);
        this.map = map;
    }

    copyWith(direction: Direction, x: number, y: number, memories: MemoryLabel[]): StartWorld {
        return new StartWorld(direction, x, y, memories, this.map);
    }
    getGoalMap(): GoalMap { return this.map; }

}