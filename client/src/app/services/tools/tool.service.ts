import { Injectable } from '@angular/core';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_DRAWING_TYPE } from '../enum/drawing-type';
import { Coordinate } from '../interfaces/coordinate';

@Injectable({
    providedIn: 'root'
})

export class Tool {

    coordinates: Coordinate[] = [];
    isDrawing: boolean;
    isShiftDown: boolean;
    isAltDown: boolean;
    lineWidth: number;
    drawingType: SELECT_DRAWING_TYPE;

    constructor() {
        this.coordinates = [];
        this.isDrawing = false;
        this.isShiftDown = false;
        this.isAltDown = false;

        this.lineWidth = 1;
        this.drawingType = SELECT_DRAWING_TYPE.BORDER_FILL;
    }

    // tslint:disable: no-empty
    start(drawingArea: DrawingAreaComponent): void { drawingArea.newShape(new ShapeModification()); }

    finish(drawingArea: DrawingAreaComponent): void { drawingArea.saveShape(); }

    onMouseDown(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {}

    onMouseOut(drawingArea: DrawingAreaComponent): void {}

    onMouseMove(coordinate: Coordinate, drawingArea: DrawingAreaComponent, mouseIsOut: boolean): void {}

    onMouseUp(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {}

    onMouseClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {}

    onMouseDoubleClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {}

    updateCoordinates(drawingArea: DrawingAreaComponent): void {}

    onEscapeKey(drawingArea: DrawingAreaComponent): void {}

    onBackspaceKey(drawingArea: DrawingAreaComponent): void {}

    onControlAKey(drawingArea: DrawingAreaComponent): void {}

    setupSelectionCoords(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {}

    onKeyPress(event: KeyboardEvent, drawingArea: DrawingAreaComponent): void {}

    onRightClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {}

    onKeyUp(event: KeyboardEvent, drawingArea: DrawingAreaComponent): void {}

    onWheelScroll(event: WheelEvent, drawingArea: DrawingAreaComponent): void {}
}
