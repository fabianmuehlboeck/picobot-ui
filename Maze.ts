
class MazeLevel extends ALevel<MazeWorld> {
    generator: MazeMapGenerator;
    robot: IRobot<MazeWorld>;
    constructor() {
        super();
        this.generator = new MazeMapGenerator();
        this.robot = new BasicRobot<MazeWorld>(this, this.resetWorld());
    }
    getName(): string { return "Maze"; }
    resetWorld(): MazeWorld {
        var map: MazeMap = this.generator.getStandardMap();
        return this.makeWorld(map);
    }
    makeWorld(map: MazeMap) {
        var x: number = (Math.floor(Math.random() * ((map.getWidth() - 1) / 2)) * 2) + 1;
        var y: number = (Math.floor(Math.random() * ((map.getHeight() - 1) / 2)) * 2) + 1;
        return new MazeWorld(randomDirection(), x, y, new Array<MemoryLabel>(), map);
    }
    getRobot(): IRobot<MazeWorld> {
        return this.robot;
    }
    getTestMaps(): MazeWorld[] {
        return this.generator.getTestMaps().map((mm) => this.makeWorld(mm));
    }
}

class MazeMapGenerator extends AMapGenerator<MazeMap> {
    constructor() {
        super();
    }
    getStandardMap(): MazeMap {
        return new MazeMap(25, 25);
    }
    getTestMaps(): MazeMap[] {
        return [this.getStandardMap(), this.getStandardMap(), this.getStandardMap(), this.getStandardMap(), this.getStandardMap()];
    }
}

class MazeCell {
    outerwalls: { wallx: number, wally: number }[] = [];
    neighbors: { cell: MazeCell, wallx: number, wally: number }[] = [];
    inMaze: boolean = false;
}

class MazeMap extends AGoalMap {
    startx: number;
    starty: number;

    initCells(width: number, height: number): MazeCell[] {
        var lastCol: MazeCell[] = null;
        var cells: MazeCell[] = [];
        for (var x = 1; x < width; x += 2) {
            var currentCol: MazeCell[] = [];
            for (var y = 1; y < height; y += 2) {
                var cell = new MazeCell();
                cells.push(cell);
                if (x > 1) {
                    lastCol[currentCol.length].neighbors.push({ cell: cell, wallx: x - 1, wally: y });
                    cell.neighbors.push({ cell: lastCol[currentCol.length], wallx: x - 1, wally: y });
                }
                if (y > 1) {
                    currentCol[currentCol.length - 1].neighbors.push({ cell: cell, wallx: x, wally: y - 1 });
                    cell.neighbors.push({ cell: currentCol[currentCol.length - 1], wallx: x, wally: y - 1 });
                }
                if (x == 1) {
                    cell.outerwalls.push({ wallx: 0, wally: y });
                }
                if (y == 1) {
                    cell.outerwalls.push({ wallx: x, wally: 0 });
                }
                if (x >= width-2) {
                    cell.outerwalls.push({ wallx: width-1, wally: y });
                }
                if (y >= height-2) {
                    cell.outerwalls.push({ wallx: x, wally: height-1 });
                }
                currentCol.push(cell);
            }
            lastCol = currentCol;
        }
        return cells;
    }

    constructor(width: number, height: number) {
        super(width, height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x % 2 == 0 || y % 2 == 0) {
                    this.walls[x][y] = true;
                }
            }
        }
        var cells: MazeCell[] = this.initCells(width, height);
        var outercells: MazeCell[] = [];
        for (let cell of cells) {
            if (cell.outerwalls.length > 0) {
                outercells.push(cell);
            }
        }
        var startcell = outercells[Math.floor(Math.random() * outercells.length)];
        var startwall = startcell.outerwalls[Math.floor(Math.random() * startcell.outerwalls.length)];
        this.startx = startwall.wallx;
        this.starty = startwall.wally;
        this.walls[this.startx][this.starty] = false;

        startcell.inMaze = true;
        var wallist = startcell.neighbors;

        while (wallist.length > 0) {
            var index = Math.floor(Math.random() * wallist.length);
            var next = wallist[index];
            wallist.splice(index, 1);
            if (next.cell.inMaze) {
                continue;
            }
            wallist = wallist.concat(next.cell.neighbors);
            next.cell.inMaze = true;
            this.walls[next.wallx][next.wally] = false;
        }
    }
    getGoalZones(): { sx: number; sy: number; ex: number; ey: number; }[] {
        return [{ sx: this.startx, sy: this.starty, ex: this.startx, ey: this.starty }];
    }
}

class MazeWorld extends GoalWorld<MazeWorld> {
    map: MazeMap;
    constructor(direction: Direction, x: number, y: number, memories: MemoryLabel[], map: MazeMap) {
        super(direction, x, y, memories);
        this.map = map;
    }

    copyWith(direction: Direction, x: number, y: number, memories: MemoryLabel[]): MazeWorld {
        return new MazeWorld(direction, x, y, memories, this.map);
    }
    getGoalMap(): GoalMap { return this.map; }

}