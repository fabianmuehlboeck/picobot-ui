
function emptybools(width: number, height: number): boolean[][] {
    var bools: boolean[][] = [];
    for (var x = 0; x < width; x++) {
        bools[x] = [];
        for (var y = 0; y < height; y++) {
            bools[x][y] = false;
        }
    }
    return bools;
}

var FINISHSIZE = 8;

function drawFinish(ctx: CanvasRenderingContext2D, sx: number, sy: number, ex: number, ey: number) {
    var x: number = sx - (sx % (FINISHSIZE * 2));
    var y: number = sy - (sy % (FINISHSIZE * 2));
    ctx.fillStyle = "#000000";
    while (x < ex) {
        var ax = Math.max(x, sx);
        y = sy - (sy % (FINISHSIZE * 2));
        if (x % (FINISHSIZE * 2) == 0) {
            y += FINISHSIZE;
        }
        while (y < ey) {
            if (x + FINISHSIZE <= sx) {
                break;
            }
            if (y + FINISHSIZE > sy) {
                var ay = Math.max(y, sy);
                ctx.fillRect(ax, ay, (x + FINISHSIZE) - ax, (y + FINISHSIZE) - ay);
            }
            y += FINISHSIZE * 2;
        }
        x += FINISHSIZE;
    }
}

function randomDirection(): Direction {
    var r = Math.random() * 4;
    if (r >= 3) {
        return Direction.East;
    } else if (r >= 2) {
        return Direction.South;
    } else if (r >= 1) {
        return Direction.West;
    } else {
        return Direction.North;
    }
}

function dirTurnLeft(dir: Direction): Direction {
    switch (dir) {
        case Direction.East:
            return Direction.North;
        case Direction.South:
            return Direction.East;
        case Direction.West:
            return Direction.South;
        case Direction.North:
            return Direction.West;
    }
}

function dirTurnRight(dir: Direction): Direction {
    switch (dir) {
        case Direction.East:
            return Direction.South;
        case Direction.South:
            return Direction.West;
        case Direction.West:
            return Direction.North;
        case Direction.North:
            return Direction.East;
    }
}

function dirXadjust(dir: Direction): number {
    switch (dir) {
        case Direction.East:
            return 1;
        case Direction.West:
            return -1;
        default:
            return 0;
    }
}

function dirYadjust(dir: Direction): number {
    switch (dir) {
        case Direction.South:
            return 1;
        case Direction.North:
            return -1;
        default:
            return 0;
    }
}

function wallStateToString(ws: WallState): string {
    switch (ws) {
        case WallState.Any: return "A";
        case WallState.Free: return "F";
        case WallState.Wall: return "W";
    }
}

function stringToWallState(s: string): WallState {
    switch (s) {
        case "A": return WallState.Any;
        case "F": return WallState.Free;
        case "W": return WallState.Wall;
        default: throw new Error("Invalid Wall State");
    }
}

interface StringMap<T> {
    [K: string]: T;
}

function drawWall(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#B31B1B";
    ctx.fillRect(0, 0, 48, 48);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#ffffff";
    ctx.strokeText("W", 24, 24);
}
function drawFree(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText("F", 24, 24);
}