
class DiamondRoomLevel extends ALevel<DiamondRoomWorld> {
    generator: DiamondRoomMapGenerator;
    robot: IRobot<DiamondRoomWorld>;
    constructor() {
        super();
        this.generator = new DiamondRoomMapGenerator();
        this.robot = new MemoryRobot<DiamondRoomWorld>(this, this.resetWorld());
    }
    getName(): string { return "Diamond Room"; }
    resetWorld(): DiamondRoomWorld {
        var map: DiamondRoomMap = this.generator.getStandardMap();
        return this.makeWorld(map);
    }
    makeWorld(map: DiamondRoomMap) {
        var x: number = (Math.floor(Math.random() * ((map.getWidth() - 2)))) + 1;
        var y: number = (Math.floor(Math.random() * ((map.getHeight() - 2)))) + 1;
        while (map.isWall(x, y)) {
            x = (Math.floor(Math.random() * ((map.getWidth() - 2)))) + 1;
            y = (Math.floor(Math.random() * ((map.getHeight() - 2)))) + 1;
        }
        return new DiamondRoomWorld(randomDirection(), x, y, new Array<MemoryLabel>(), map, this.getNewvac(map, x, y));
    }
    getRobot(): IRobot<DiamondRoomWorld> {
        return this.robot;
    }
    getNewvac(map : IMap, x : number, y: number): boolean[][] {
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
    getTestMaps(): DiamondRoomWorld[] {
        var map = this.generator.getStandardMap();
        var upx = Math.floor(map.getWidth() / 2);
        var upy = 1;
        while (map.isWall(upx, upy)) {
            upy++;
        }
        return [new DiamondRoomWorld(Direction.North, upx, upy, [], map, this.getNewvac(map, upx, upy)),
            new DiamondRoomWorld(Direction.East, upx, upy, [], map, this.getNewvac(map, upx, upy)),
            new DiamondRoomWorld(Direction.West, upx, upy, [], map, this.getNewvac(map, upx, upy)),
            new DiamondRoomWorld(Direction.South, upx, upy, [], map, this.getNewvac(map, upx, upy)),
            new DiamondRoomWorld(Direction.North, upx+5, upy+5, [], map, this.getNewvac(map, upx+5, upy+5)),
            new DiamondRoomWorld(Direction.East, upx+5, upy+5, [], map, this.getNewvac(map, upx+5, upy+5)),
            new DiamondRoomWorld(Direction.West, upx+5, upy+5, [], map, this.getNewvac(map, upx+5, upy+5)),
            new DiamondRoomWorld(Direction.South, upx+5, upy+5, [], map, this.getNewvac(map, upx+5, upy+5)),
            new DiamondRoomWorld(Direction.North, upx, upy + Math.floor(map.getHeight() / 2), [], map, this.getNewvac(map, upx, upy + Math.floor(map.getHeight()/2))),
            new DiamondRoomWorld(Direction.East, upx, upy + Math.floor(map.getHeight() / 2), [], map, this.getNewvac(map, upx, upy + Math.floor(map.getHeight() / 2))),
            new DiamondRoomWorld(Direction.West, upx, upy + Math.floor(map.getHeight() / 2), [], map, this.getNewvac(map, upx, upy + Math.floor(map.getHeight() / 2))),
            new DiamondRoomWorld(Direction.South, upx, upy + Math.floor(map.getHeight() / 2), [], map, this.getNewvac(map, upx, upy + Math.floor(map.getHeight() / 2)))];
    }
}

class DiamondRoomMapGenerator extends AMapGenerator<DiamondRoomMap> {
    constructor() {
        super();
    }
    getStandardMap(): DiamondRoomMap {
        return new DiamondRoomMap(25, 25);
    }
    getTestMaps(): DiamondRoomMap[] {
        return [this.getStandardMap()];
    }
}

class DiamondRoomMap extends AVacuumMap {
    startx: number;
    starty: number;

    constructor(width: number, height: number) {
        super(width, height);
        var middlex = Math.floor(width / 2);
        var middley = Math.floor(height / 2);
        for (var x = 0; x < width; x++) {
            var dist = Math.ceil(Math.abs(x - middlex) * (middley / middlex));
            for (var y = 1; y <= dist; y++) {
                this.walls[x][y] = true;
                this.walls[x][height - 1 - y] = true;
            }
        }
    }
}

class DiamondRoomWorld extends VacuumWorld<DiamondRoomWorld> {
    map: DiamondRoomMap;
    constructor(direction: Direction, x: number, y: number, memories: MemoryLabel[], map: DiamondRoomMap, vacuumed: boolean[][]) {
        super(direction, x, y, memories, vacuumed);
        this.map = map;
    }

    copyWithVacuumed(direction: Direction, x: number, y: number, memories: MemoryLabel[], vacuumed: boolean[][]): DiamondRoomWorld {
        return new DiamondRoomWorld(direction, x, y, memories, this.map, vacuumed);
    }
    getVacuumMap(): AVacuumMap { return this.map; }

}