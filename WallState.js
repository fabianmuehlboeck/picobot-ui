var WallState;
(function (WallState) {
    WallState[WallState["Any"] = 0] = "Any";
    WallState[WallState["Wall"] = 1] = "Wall";
    WallState[WallState["Free"] = 2] = "Free";
})(WallState || (WallState = {}));
var WallStateSelector = /** @class */ (function () {
    function WallStateSelector() {
        this.onChangeState = null;
        this.element = document.createElement("div");
        var wss = this;
        this.element.classList.add("wallstateselector");
        var anyButton = document.createElement("button");
        anyButton.classList.add("wallstateany");
        $(anyButton).on("click", function () {
            wss.changeState(WallState.Any); //$(wss.selectionDiv).hide("clip", {}, 200);
        });
        this.anyButton = anyButton;
        var freeButton = document.createElement("button");
        freeButton.classList.add("wallstatefree");
        $(freeButton).on("click", function () {
            wss.changeState(WallState.Free); //$(wss.selectionDiv).hide("clip", {}, 200);
        });
        this.freeButton = freeButton;
        var wallButton = document.createElement("button");
        wallButton.classList.add("wallstatewall");
        $(wallButton).on("click", function () {
            wss.changeState(WallState.Wall); //$(wss.selectionDiv).hide("clip", {}, 200);
        });
        this.wallButton = wallButton;
        var button = document.createElement("button");
        $(button).on("focus", function () {
            $(wss.selectionDiv).show("clip", {}, 200);
        });
        $(button).blur(function (fe) {
            if (fe.relatedTarget == wss.freeButton || fe.relatedTarget == wss.anyButton || fe.relatedTarget == wss.wallButton) {
                return;
            }
            $(wss.selectionDiv).hide("clip", {}, 200);
        });
        this.button = button;
        this.selectionDiv = document.createElement("div");
        this.selectionDiv.classList.add("wallstateselectiondiv");
        this.selectionDiv.appendChild(this.freeButton);
        this.selectionDiv.appendChild(this.anyButton);
        this.selectionDiv.appendChild(this.wallButton);
        this.element.appendChild(this.selectionDiv);
        this.element.appendChild(this.button);
        this.changeState(WallState.Any);
        $(this.selectionDiv).hide();
    }
    WallStateSelector.prototype.getState = function () {
        return this.state;
    };
    WallStateSelector.prototype.getElement = function () {
        return this.element;
    };
    WallStateSelector.prototype.changeState = function (state) {
        var oldstate = this.state;
        this.state = state;
        switch (state) {
            case WallState.Any:
                this.anyButton.classList.add("active");
                this.wallButton.classList.remove("active");
                this.freeButton.classList.remove("active");
                this.button.className = "wallstateany";
                break;
            case WallState.Free:
                this.anyButton.classList.remove("active");
                this.wallButton.classList.remove("active");
                this.freeButton.classList.add("active");
                this.button.className = "wallstatefree";
                break;
            case WallState.Wall:
                this.anyButton.classList.remove("active");
                this.wallButton.classList.add("active");
                this.freeButton.classList.remove("active");
                this.button.className = "wallstatewall";
                break;
        }
        $(this.selectionDiv).hide("clip", {}, 200);
        if (this.onChangeState != null) {
            this.onChangeState(oldstate, this.state);
        }
    };
    return WallStateSelector;
}());
var RobotSensorSelector = /** @class */ (function () {
    function RobotSensorSelector() {
        this.element = document.createElement("div");
        this.leftSensor = new WallStateSelector();
        this.leftSensor.element.classList.add("wallstateleft");
        this.rightSensor = new WallStateSelector();
        this.rightSensor.element.classList.add("wallstateright");
        this.frontSensor = new WallStateSelector();
        this.frontSensor.element.classList.add("wallstatefront");
        this.canvas = document.createElement("canvas");
        this.canvas.width = 48;
        this.canvas.height = 48;
        this.element.classList.add("robotsensor");
        this.element.appendChild(this.frontSensor.element);
        this.element.appendChild(this.leftSensor.element);
        this.element.appendChild(this.canvas);
        this.element.appendChild(this.rightSensor.element);
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(0, 48);
        ctx.lineTo(24, 0);
        ctx.lineTo(48, 48);
        ctx.closePath();
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.fillStyle = ROBOTCOLOR;
        ctx.fill();
    }
    RobotSensorSelector.prototype.getElement = function () { return this.element; };
    return RobotSensorSelector;
}());
//# sourceMappingURL=WallState.js.map