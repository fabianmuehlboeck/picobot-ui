﻿interface ILevel {
    toBackground(): void;
    toForeground(mapcanvas: HTMLCanvasElement, controlDiv: HTMLDivElement, guiDiv: HTMLDivElement) : boolean;
    getName(): string;
}

abstract class ALevel<W extends IWorld<W>> implements ILevel {
    mapcanvas: HTMLCanvasElement;
    controlDiv: HTMLDivElement;
    guiDiv: HTMLDivElement;

    constructor() {
        
    }

    toBackground(): void {
        this.getRobot().toBackground();
    }
    toForeground(mapcanvas: HTMLCanvasElement, controlDiv: HTMLDivElement, guiDiv: HTMLDivElement): boolean {
        this.mapcanvas = mapcanvas;
        this.controlDiv = controlDiv;
        this.guiDiv = guiDiv;
        this.getRobot().toForeground(guiDiv, controlDiv, this.mapcanvas);
        return false;
    }
    abstract getName(): string;
    abstract resetWorld(): W;
    abstract getRobot(): IRobot<W>;
}
