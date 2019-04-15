
class MazeLevel extends ALevel<MazeWorld> {
    generator: MazeMapGenerator;
    robot: IRobot<MazeWorld>;
    constructor() {
        super();
        this.generator = new MazeMapGenerator();
        this.robot = new BasicRobot<MazeWorld>(this.resetWorld());
    }
    getName(): string { return "Maze"; }
    resetWorld(): MazeWorld {
        var map: MazeMap = this.generator.getStandardMap();
        var x: number = (Math.floor(Math.random() * ((map.getWidth() - 1) / 2)) * 2) + 1;
        var y: number = (Math.floor(Math.random() * ((map.getHeight() - 1) / 2)) * 2) + 1;
        return new MazeWorld(randomDirection(), x, y, new Array<IMemoryLabel>(), map);
    }
    getRobot(): IRobot<MazeWorld> {
        return this.robot;
    }
}

class MazeMapGenerator extends AMapGenerator<MazeMap> {
    constructor() {
        super();
    }
    getStandardMap(): MazeMap {
        return new MazeMap(25, 25);
    }

}

class MazeMap extends AGoalMap {
    startx: number;
    starty: number;
    constructor(width: number, height: number) {
        super(width, height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x % 2 == 0 || y % 2 == 0) {
                    this.walls[x][y] = true;
                }
            }
        }
        var vertical: boolean = Math.random() * 2 >= 1;
        var farside: boolean = Math.random() * 2 >= 1;
        var inmaze: boolean[][] = emptybools(this.width, this.height);
        var walllist: Array<{ x: number, y: number, cx: number, cy: number }> = [];
        if (vertical) {
            this.startx = farside ? this.width - 1 : 0;
            this.starty = Math.floor(Math.random() * Math.floor(this.height / 2)) * 2 + 1;
            inmaze[farside ? this.width - 2 : 1][this.starty] = true;

            if (this.starty > 1) {
                walllist.push({ x: farside ? this.width - 2 : 1, y: this.starty - 1, cx: farside ? this.width - 2 : 1, cy: this.starty - 2 });
            }
            if (this.starty < this.height - 2) {
                walllist.push({ x: farside ? this.width - 2 : 1, y: this.starty + 1, cx: farside ? this.width - 2 : 1, cy: this.starty + 2 });
            }
            walllist.push({ x: farside ? this.width - 3 : 2, y: this.starty, cx: farside ? this.width - 4 : 3, cy: this.starty });

        } else {
            this.startx = Math.floor(Math.random() * Math.floor(this.width / 2)) * 2 + 1;
            this.starty = farside ? this.height - 1 : 0;
            inmaze[this.startx][farside ? this.height - 2 : 1] = true;

            if (this.startx > 1) {
                walllist.push({ x: this.startx - 1, y: farside ? this.height - 2 : 1, cx: this.startx - 2, cy: farside ? this.height - 2 : 1});
            }
            if (this.startx < this.width - 2) {
                walllist.push({ x: this.startx + 1, y: farside ? this.height - 2 : 1, cx: this.startx + 2, cy: farside ? this.height - 2 : 1 });
            }
            walllist.push({ x: this.startx, y:  farside? this.height - 3 : 2, cx: this.startx, cy: farside ? this.height - 4 : 3 });
        }
        this.walls[this.startx][this.starty] = false;
        
        while (walllist.length > 0) {
            var index = Math.floor(Math.random() * walllist.length);
            var x = walllist[index].x;
            var y = walllist[index].y;
            var cx = walllist[index].cx;
            var cy = walllist[index].cy;
            walllist.splice(index, 1);
            if (!inmaze[cx][cy]) {
                inmaze[cx][cy] = true;
                this.walls[x][y] = false;
                if (this.walls[cx + 1][cy] && cx < this.width - 2) {
                    walllist.push({ x: cx + 1, y: cy, cx: cx + 2, cy: cy });
                }
                if (this.walls[cx - 1][cy] && cx > 1) {
                    walllist.push({ x: cx - 1, y: cy, cx: cx - 2, cy: cy });
                }
                if (this.walls[cx][cy + 1] && cy < this.height - 2) {
                    walllist.push({ x: cx, y: cy + 1, cx: cx, cy: cy + 2 });
                }
                if (this.walls[cx][cy - 1] && cy > 1) {
                    walllist.push({ x: cx, y: cy - 1, cx: cx, cy: cy - 2 });
                }
            }
        }
    }
    getGoalZones(): { sx: number; sy: number; ex: number; ey: number; }[] {
        return [{ sx: this.startx, sy: this.starty, ex: this.startx, ey: this.starty }];
    }
}

class MazeWorld extends GoalWorld<MazeWorld> {
    map: MazeMap;
    constructor(direction: Direction, x: number, y: number, memories: IMemoryLabel[], map: MazeMap) {
        super(direction, x, y, memories);
        this.map = map;
    }

    copyWith(direction: Direction, x: number, y: number, memories: IMemoryLabel[]): MazeWorld {
        return new MazeWorld(direction, x, y, memories, this.map);
    }
    getGoalMap(): GoalMap { return this.map; }

}