enum FieldState { Empty, Unknown, Wall };

interface IWorldState {
    getNorth(): FieldState;
    getEast(): FieldState;
    getSouth(): FieldState;
    getWest(): FieldState;
    matches(ws: IWorldState): boolean;
    copyFrom(ws: IWorldState): void;
    setNorth(fs: FieldState): void;
    setEast(fs: FieldState): void;
    setSouth(fs: FieldState): void;
    setWest(fs: FieldState): void;
    vmatches(ws: IWorldState, thencont: () => void, elsecont: () => void): void;
    vvmatches(ws: IWorldState, thencont: () => void, elsecont: () => void, canvas?: HTMLCanvasElement): void;
}

function fieldStateCompare(left: FieldState, right: FieldState): boolean {
    return (left == right) || (right == FieldState.Unknown);
}

class WorldState implements IWorldState {

    constructor(north: FieldState, east: FieldState, south: FieldState, west: FieldState) {
        this.north = north;
        this.east = east;
        this.south = south;
        this.west = west;
    }

    north: FieldState;
    south: FieldState;
    west: FieldState;
    east: FieldState;

    getNorth(): FieldState { return this.north; }
    getEast(): FieldState { return this.east; }
    getSouth(): FieldState { return this.south; }
    getWest(): FieldState { return this.west; }

    setNorth(fs: FieldState): void { this.north = fs; }
    setEast(fs: FieldState): void { this.east = fs; }
    setSouth(fs: FieldState): void { this.south = fs; }
    setWest(fs: FieldState): void { this.west = fs; }

    matches(template: IWorldState): boolean {
        return fieldStateCompare(this.north, template.getNorth()) && fieldStateCompare(this.east, template.getEast()) && fieldStateCompare(this.south, template.getSouth()) && fieldStateCompare(this.west, template.getWest());
    }

    vmatches(template: IWorldState, thencont: () => void, elsecont: () => void): void {
        template.vvmatches(this, thencont, elsecont);
    }

    vvmatches(ws: IWorldState, thencont: () => void, elsecont: () => void, canvas?: HTMLCanvasElement): void {
        if (canvas) {
            if (ws.matches(this)) {
                $(canvas).animate({ backgroundColor: "#00ff00" }, { duration: 200, easing: "easeOutCirc" }).promise().always(function () {
                    $(canvas).animate({ backgroundColor: "#ffffff" }, { duration: 300, easing: "easeOutCirc" }).promise().always(thencont);
                });
            } else {
                $(canvas).animate({ backgroundColor: "#ff0000" }, { duration: 200, easing: "easeOutCirc" }).promise().always(function () {
                    $(canvas).animate({ backgroundColor: "#ffffff" }, { duration: 300, easing: "easeOutCirc" }).promise().always(elsecont);
                    thencont();
                });
            }
        }
        else {
            if (ws.matches(this)) {
                thencont();
            }
            else {
                elsecont();
            }
        }
    }

    getPattern(): WorldPattern {
        return new WorldPattern(this.north, this.south, this.west, this.east);
    }

    copyFrom(ws: IWorldState): void {
        this.north = ws.getNorth();
        this.east = ws.getEast();
        this.south = ws.getSouth();
        this.west = ws.getWest();
    }
}

class DrawWorldState extends WorldState {
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        super(FieldState.Unknown, FieldState.Unknown, FieldState.Unknown, FieldState.Unknown);
        this.canvas = canvas;
        if (!canvas.classList.contains("worldstatecanvas")) {
            canvas.classList.add("worldstatecanvas");
        }

        this.draw();
    }

    vmatches(template: IWorldState, thencont: () => void, elsecont: () => void) : void {
        template.vvmatches(this, thencont, elsecont, this.canvas);
    }

    vvmatches(ws: IWorldState, thencont: () => void, elsecont: () => void, canvas?: HTMLCanvasElement): void {
        var jq : JQuery<HTMLElement>;
        if (canvas) {
            jq = $([this.canvas, canvas]);
        }
        else {
            jq = $(this.canvas);
        }
        if (ws.matches(this)) {
            jq.animate({ backgroundColor: "#00ff00" }, { duration: 200, easing: "easeOutCirc" }).promise().always(() => {
                jq.animate({ backgroundColor: "#ffffff" }, { duration: 300, easing: "easeOutCirc" }).promise().always(thencont);
            });
        } else {
            jq.animate({ backgroundColor: "#ff0000" }, { duration: 200, easing: "easeOutCirc" }).promise().always(() => {
                jq.animate({ backgroundColor: "#ffffff" }, { duration: 300, easing: "easeOutCirc" }).promise().always(elsecont);
            });
        }
    }

    setNorth(fs: FieldState) { super.setNorth(fs); this.draw(); }
    setEast(fs: FieldState) { super.setEast(fs); this.draw(); }
    setSouth(fs: FieldState) { super.setSouth(fs); this.draw(); }
    setWest(fs: FieldState) { super.setWest(fs); this.draw(); }

    draw() {
        var ctx = this.canvas.getContext("2d");
        //ctx.fillStyle = "#ffffff";
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var cw = this.canvas.width / 3;
        var ch = this.canvas.height / 3;
        ctx.fillStyle = ROBOTCOLOR;
        ctx.beginPath();
        ctx.ellipse(cw + cw / 2, ch + ch / 2, cw / 2, ch / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        drawFog(ctx, 0, 0, cw, ch);
        drawFog(ctx, 0, ch * 2, cw, ch * 3);
        drawFog(ctx, cw * 2, 0, cw * 3, ch);
        drawFog(ctx, cw * 2, ch * 2, ch * 3, ch * 3);
        DrawWorldState.drawColor(ctx, this.north, cw, 0, cw, ch);
        DrawWorldState.drawColor(ctx, this.south, cw, ch * 2, cw, ch);
        DrawWorldState.drawColor(ctx, this.west, 0, ch, cw, ch);
        DrawWorldState.drawColor(ctx, this.east, cw * 2, ch, cw, ch);
    }

    static drawColor(ctx: CanvasRenderingContext2D, state: FieldState, x: number, y: number, w: number, h: number) {
        switch (state) {
            case FieldState.Empty:
                //ctx.fillStyle = "#ffffff";
                //ctx.fillRect(x, y, w, h);
                break;
            case FieldState.Unknown:
                ctx.fillStyle = "#000000";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("?", x + w / 2, y + h / 2);
                break;
            case FieldState.Wall:
                ctx.fillStyle = WALLCOLOR;
                ctx.fillRect(x, y, w, h);
                break;
        }
    }
}

class ControlWorldState extends DrawWorldState {

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        var ws = this;
        canvas.onclick = function (e) { ws.clicked(e); };
    }

    clicked(e: MouseEvent) {
        var posx = 0;
        var posy = 0;
        posx = e.offsetX;
        posy = e.offsetY;
        var cw = this.canvas.width / 3;
        var ch = this.canvas.height / 3;

        if (posx >= 0 && posx < cw && posy >= ch && posy < ch * 2) {
            this.west = ControlWorldState.cycle(this.west);
            this.draw();
        }
        if (posx >= cw && posx < cw * 2) {
            if (posy >= 0 && posy < ch) {
                this.north = ControlWorldState.cycle(this.north);
                this.draw();
            }
            if (posy >= ch * 2 && posy < ch * 3) {
                this.south = ControlWorldState.cycle(this.south);
                this.draw();
            }
        }
        if (posx >= cw * 2 && posx < cw * 3 && posy >= ch && posy < ch * 2) {
            this.east = ControlWorldState.cycle(this.east);
            this.draw();
        }
    }

    static cycle(status: FieldState): FieldState {
        switch (status) {
            case FieldState.Empty:
                return FieldState.Unknown;
            case FieldState.Unknown:
                return FieldState.Wall;
            case FieldState.Wall:
                return FieldState.Empty;
        }
    }
}
