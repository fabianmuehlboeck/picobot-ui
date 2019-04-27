
class SquareRoomLevel extends ALevel<SquareRoomWorld> {
    generator: SquareRoomMapGenerator;
    robot: IRobot<SquareRoomWorld>;
    constructor() {
        super();
        this.generator = new SquareRoomMapGenerator();
        this.robot = new MemoryRobot<SquareRoomWorld>(this, this.resetWorld());
    }
    getName(): string { return "Square Room"; }
    resetWorld(): SquareRoomWorld {
        var map: SquareRoomMap = this.generator.getStandardMap();
        return this.makeWorld(map);
    }
    makeWorld(map: SquareRoomMap) {
        var x: number = (Math.floor(Math.random() * ((map.getWidth() - 2)))) + 1;
        var y: number = (Math.floor(Math.random() * ((map.getHeight() - 2)))) + 1;
        return new SquareRoomWorld(randomDirection(), x, y, new Array<MemoryLabel>(), map, this.getNewvac(map, x, y));
    }
    getNewvac(map: IMap, x: number, y: number): boolean[][] {
        var newvac: boolean[][] = [];
        for (var vx = 0; vx < map.getWidth(); vx++) {
            newvac.push([]);
            for (var vy = 0; vy < map.getHeight(); vy++) {
                newvac[vx].push(false);
            }
        }
        newvac[x][y] = true;
        return newvac;
    }
    getRobot(): IRobot<SquareRoomWorld> {
        return this.robot;
    }
    getTestMaps(): SquareRoomWorld[] {
        var map = this.generator.getTestMaps()[0];
        return [new SquareRoomWorld(Direction.East, 1, 1, [], map, this.getNewvac(map, 1, 1)),
            new SquareRoomWorld(Direction.West, 1, 1, [], map, this.getNewvac(map, 1, 1)),
            new SquareRoomWorld(Direction.North, 1, 1, [], map, this.getNewvac(map, 1, 1)),
            new SquareRoomWorld(Direction.South, 1, 1, [], map, this.getNewvac(map, 1, 1)),
            new SquareRoomWorld(Direction.East, 5, 5, [], map, this.getNewvac(map, 5, 5)),
            new SquareRoomWorld(Direction.West, 5, 5, [], map, this.getNewvac(map, 5, 5)),
            new SquareRoomWorld(Direction.North, 5, 5, [], map, this.getNewvac(map, 5, 5)),
            new SquareRoomWorld(Direction.South, 5, 5, [], map, this.getNewvac(map, 5, 5)),
            new SquareRoomWorld(Direction.East, 1, 5, [], map, this.getNewvac(map, 1, 5)),
            new SquareRoomWorld(Direction.West, 1, 5, [], map, this.getNewvac(map, 1, 5)),
            new SquareRoomWorld(Direction.North, 1, 5, [], map, this.getNewvac(map, 1, 5)),
            new SquareRoomWorld(Direction.South, 1, 5, [], map, this.getNewvac(map, 1, 5))]
    }
}

class SquareRoomMapGenerator extends AMapGenerator<SquareRoomMap> {
    constructor() {
        super();
    }
    getStandardMap(): SquareRoomMap {
        return new SquareRoomMap(25, 25);
    }
    getTestMaps(): SquareRoomMap[] {
        return [new SquareRoomMap(11,11)];
    }
}

class SquareRoomMap extends AVacuumMap {
    startx: number;
    starty: number;

    constructor(width: number, height: number) {
        super(width, height);
    }
}

class SquareRoomWorld extends VacuumWorld<SquareRoomWorld> {
    map: SquareRoomMap;
    constructor(direction: Direction, x: number, y: number, memories: MemoryLabel[], map: SquareRoomMap, vacuumed : boolean[][]) {
        super(direction, x, y, memories, vacuumed);
        this.map = map;
    }

    copyWithVacuumed(direction: Direction, x: number, y: number, memories: MemoryLabel[], vacuumed: boolean[][]): SquareRoomWorld {
        return new SquareRoomWorld(direction, x, y, memories, this.map, vacuumed);
    }
    getVacuumMap(): AVacuumMap { return this.map; }

}