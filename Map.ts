
interface IMap {
    canMoveTo(x: number, y: number): boolean;
    isWall(x: number, y: number): boolean;
    getWidth(): number;
    getHeight(): number;
    draw(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number) : void;
}

interface GoalMap extends IMap {
    isGoal(x: number, y: number): boolean;
}

abstract class AMap implements IMap {

    walls: boolean[][];
    width: number;
    height: number;

    surroundingWalls(): void {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                if (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1) {
                    this.walls[x][y] = true;
                }
            }
        }
    }

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.walls = emptybools(width, height);
        this.surroundingWalls();
    }
    getWidth(): number { return this.width; }
    getHeight(): number { return this.height; }
    canMoveTo(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height&&!(this.walls[x][y]);
    }
    isWall(x: number, y: number): boolean {
        return x < 0 || y < 0 || x >= this.width || y >= this.height||(this.walls[x][y]);
    }
    draw(ctx: CanvasRenderingContext2D, cellwidth : number, cellheight : number): void {
        ctx.fillStyle = WALLCOLOR;
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var sy = y;
                while (this.walls[x][y]) {
                    y++;
                }
                if (sy != y) {
                    ctx.fillRect(x * cellwidth, sy * cellheight, cellwidth, (y - sy) * cellheight);
                }
            }
        }
    }
}

abstract class AGoalMap extends AMap implements GoalMap {

    abstract getGoalZones(): { sx: number, sy: number, ex: number, ey: number }[];

    isGoal(x: number, y: number): boolean {
        var gzs = this.getGoalZones();
        for (let gz of gzs) {
            if (x >= gz.sx && x <= gz.ex && y >= gz.sy && y <= gz.ey) {
                return true;
            }
        }
        return false;
    }
    draw(ctx: CanvasRenderingContext2D, cellwidth: number, cellheight: number): void {
        super.draw(ctx, cellwidth, cellheight);
        ctx.fillStyle = "#000000";
        for (let gz of this.getGoalZones()) {
            drawFinish(ctx, gz.sx * cellwidth, gz.sy * cellheight, (gz.ex+1) * cellwidth, (gz.ey+1) * cellheight);
        }
    }
}

abstract class AVacuumMap extends AMap {

}