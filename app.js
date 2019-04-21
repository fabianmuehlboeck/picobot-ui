var WALLCOLOR = "#B31B1B";
var ROBOTCOLOR = "#6EB43F";
function isAncestor(descendant, ancestor) {
    if (descendant == null) {
        return false;
    }
    if (descendant == ancestor) {
        return true;
    }
    else {
        return isAncestor(descendant.parentNode, ancestor);
    }
}
var Pico = /** @class */ (function () {
    function Pico() {
        this.levels = [];
        this.levels.push(new MazeLevel());
        this.levels.push(new HardMazeLevel());
    }
    Pico.createCanvas = function () {
        var canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        return canvas;
    };
    Pico.prototype.init = function () {
        var _this = this;
        this.mapcanvas = Pico.createCanvas();
        document.getElementById("mapcanvas").appendChild(this.mapcanvas);
        this.guidiv = document.createElement("div");
        this.guidiv.classList.add("guicontainer");
        document.getElementById("gui").appendChild(this.guidiv);
        this.controldiv = document.createElement("div");
        document.getElementById("mapdata").appendChild(this.controldiv);
        this.header = document.getElementById("header");
        var leftbutton = document.createElement("button");
        leftbutton.classList.add("mapleft");
        leftbutton.addEventListener("click", function () {
            _this.previousLevel();
        });
        this.header.appendChild(leftbutton);
        var mapselectdiv = document.createElement("div");
        mapselectdiv.classList.add("mapselect");
        this.mapspan = document.createElement("span");
        mapselectdiv.appendChild(this.mapspan);
        this.header.appendChild(mapselectdiv);
        var rightbutton = document.createElement("button");
        rightbutton.classList.add("mapright");
        rightbutton.addEventListener("click", function () {
            _this.nextLevel();
        });
        this.header.appendChild(rightbutton);
        this.changeLevel(this.levels[0]);
    };
    Pico.prototype.changeLevel = function (level) {
        if (this.currentLevel) {
            this.currentLevel.toBackground();
        }
        this.currentLevel = level;
        this.mapspan.innerText = level.getName();
        level.toForeground(this.mapcanvas, this.controldiv, this.guidiv);
    };
    Pico.prototype.nextLevel = function () {
        var index = this.levels.indexOf(this.currentLevel) + 1;
        while (index >= this.levels.length) {
            index -= this.levels.length;
        }
        this.changeLevel(this.levels[index]);
    };
    Pico.prototype.previousLevel = function () {
        var index = this.levels.indexOf(this.currentLevel) - 1;
        while (index < 0) {
            index += this.levels.length;
        }
        this.changeLevel(this.levels[index]);
    };
    return Pico;
}());
//# sourceMappingURL=app.js.map