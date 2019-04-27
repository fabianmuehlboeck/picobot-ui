
class HardMazeLevel extends ALevel<HardMazeWorld> {
    generator: HardMazeMapGenerator;
    robot: IRobot<HardMazeWorld>;
    constructor() {
        super();
        this.generator = new HardMazeMapGenerator();
        this.robot = new MemoryRobot<HardMazeWorld>(this, this.resetWorld());
    }
    getName(): string { return "Tricky Maze"; }
    resetWorld(): HardMazeWorld {
        var map: HardMazeMap = this.generator.getStandardMap();
        return this.makeWorld(map);
        //return new HardMazeWorld(Direction.North, 9, 8, [], map);
    }
    makeWorld(map: HardMazeMap): HardMazeWorld {
        var x: number = (Math.floor(Math.random() * ((map.getWidth() - 1) / 2)) * 2) + 1;
        var y: number = (Math.floor(Math.random() * ((map.getHeight() - 1) / 2)) * 2) + 1;
        return new HardMazeWorld(randomDirection(), x, y, new Array<MemoryLabel>(), map);
    }
    getRobot(): IRobot<HardMazeWorld> {
        return this.robot;
    }
    getTestMaps(): HardMazeWorld[] {
        var map = this.generator.getStandardMap();
        var firsttrick = map.trickWalls[0];
        return [new HardMazeWorld(Direction.North, firsttrick.x + 1, firsttrick.y, [], map),
            new HardMazeWorld(Direction.North, firsttrick.x - 1, firsttrick.y, [], map),
            new HardMazeWorld(Direction.North, firsttrick.x, firsttrick.y+1, [], map),
            new HardMazeWorld(Direction.North, firsttrick.x, firsttrick.y - 1, [], map),
            new HardMazeWorld(Direction.North, firsttrick.x+3, firsttrick.y, [], map),
            new HardMazeWorld(Direction.North, firsttrick.x-3, firsttrick.y, [], map)
        ]
    }
}

class HardMazeMapGenerator extends AMapGenerator<HardMazeMap> {
    constructor() {
        super();
    }
    getStandardMap(): HardMazeMap {
        return new HardMazeMap(25, 25);
    }

}

class HardMazeMap extends MazeMap {
    trickWalls: { x: number, y: number }[];
    initCells(width: number, height: number): MazeCell[] {
        this.trickWalls = [];
        var cells = super.initCells(width, height);
        for (var x = 8; x < width-1; x += 8) {
            for (var y = 8; y < height - 1; y += 8) {
                this.trickWalls.push({ x: x, y: y });
                var mergecells = cells.filter((cell) => cell.neighbors.some((nb) => (nb.wallx == x && Math.abs(nb.wally - y) == 1) || (nb.wally == y && Math.abs(nb.wallx - x) == 1)));
                var newcell = new MazeCell();
                mergecells.forEach((mc) => { newcell.neighbors = newcell.neighbors.concat(mc.neighbors.filter((nb) => !mergecells.some((mcnb) => mcnb == nb.cell))) });
                newcell.neighbors.forEach((nb) =>
                {
                    for (let nbnb of nb.cell.neighbors) {
                        if (mergecells.indexOf(nbnb.cell) >= 0) {
                            nbnb.cell = newcell;
                        }
                    }
                });
            }
        }
        return cells;
    }
    constructor(width: number, height: number) {
        super(width, height);
        for (let coords of this.trickWalls) {
            this.walls[coords.x - 1][coords.y] = false;
            this.walls[coords.x + 1][coords.y] = false;
            this.walls[coords.x][coords.y - 1] = false;
            this.walls[coords.x][coords.y + 1] = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number): void {
        super.draw(ctx, cellwidth, cellheight);
        ctx.fillStyle = "#0000ff";
        for (let coords of this.trickWalls) {
            ctx.fillRect(coords.x * cellwidth, coords.y * cellheight, cellwidth, cellheight);
        }
    }
}

class HardMazeWorld extends GoalWorld<HardMazeWorld> {
    map: HardMazeMap;
    constructor(direction: Direction, x: number, y: number, memories: MemoryLabel[], map: HardMazeMap) {
        super(direction, x, y, memories);
        this.map = map;
    }

    copyWith(direction: Direction, x: number, y: number, memories: MemoryLabel[]): HardMazeWorld {
        return new HardMazeWorld(direction, x, y, memories, this.map);
    }
    getGoalMap(): GoalMap { return this.map; }

}