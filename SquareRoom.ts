
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
        var newvac: boolean[][] = [];
        for (var vx = 0; vx < map.getWidth(); vx++) {
            newvac.push([]);
            for (var vy = 0; vy < map.getHeight(); vy++) {
                newvac[vx].push(false);
            }
        }
        newvac[x][y] = true;
        return new SquareRoomWorld(randomDirection(), x, y, new Array<MemoryLabel>(), map, newvac);
    }
    getRobot(): IRobot<SquareRoomWorld> {
        return this.robot;
    }
    getTestMaps(): SquareRoomWorld[] {
        return this.generator.getTestMaps().map((mm) => this.makeWorld(mm));
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
        return [this.getStandardMap(), this.getStandardMap(), this.getStandardMap(), this.getStandardMap(), this.getStandardMap()];
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

    copyWith(direction: Direction, x: number, y: number, memories: MemoryLabel[]): SquareRoomWorld {
        var newvac: boolean[][] = [];
        for (var vx = 0; vx < this.vacuumed.length; vx++) {
            newvac.push([]);
            for (var vy = 0; vy < this.vacuumed[vx].length; vy++) {
                newvac[vx].push(this.vacuumed[vx][vy]);
            }
        }
        newvac[x][y] = true;
        return new SquareRoomWorld(direction, x, y, memories, this.map, newvac);
    }
    getVacuumMap(): AVacuumMap { return this.map; }
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

}