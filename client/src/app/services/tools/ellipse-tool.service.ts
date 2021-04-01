import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from '../tools/tool.service';

const FIRST = 0;
const LAST = 1;

@Injectable({
    providedIn: 'root'
})

export class EllipseTool extends Tool {

  constructor() {
    super();
    this.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
  }

  onMouseDown(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    if (!this.isDrawing) {
        this.isDrawing = true;

        this.coordinates[FIRST] = coordinate;
        this.coordinates[LAST] = coordinate;

        this.updateCoordinates(drawingArea);
        drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.ELLIPSE;
        drawingArea.getShape().update();

    }

  }

  onMouseMove(coordinate: Coordinate, drawingArea: DrawingAreaComponent, mouseIsOut: boolean): void {

    if (this.isDrawing) {
        this.coordinates[LAST] = coordinate;
        this.updateCoordinates(drawingArea);
    }

  }

  onMouseUp(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    this.isDrawing = false;
    this.setupSelectionCoords(coordinate, drawingArea);
    drawingArea.saveShape();
    this.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];

  }

  updateCoordinates(drawingArea: DrawingAreaComponent): void {

    let radiusX: number = this.calculateSignedWidth() / 2;
    let radiusY: number = this.calculateSignedHeight() / 2;

    const isRadiusXPositive: boolean = radiusX >= 0;
    const isRadiusYPositive: boolean = radiusY >= 0;

    const min: number = Math.min(Math.abs(radiusX), Math.abs(radiusY));

    radiusX = this.isShiftDown ? min : Math.abs(radiusX);
    radiusY = this.isShiftDown ? min : Math.abs(radiusY);

    let x: number = this.coordinates[FIRST].x;
    x = isRadiusXPositive ? x + radiusX : x - radiusX;
    let y: number = this.coordinates[FIRST].y;
    y = isRadiusYPositive ? y + radiusY : y - radiusY;

    drawingArea.getShape().coordinates.pop();
    drawingArea.getShape().coordinates.push({x: x - radiusX, y: y - radiusY});
    drawingArea.getShape().width = 2 * radiusX;
    drawingArea.getShape().height = 2 * radiusY;

  }

  calculateSignedWidth(): number {
    return (this.coordinates[LAST].x - this.coordinates[FIRST].x);
  }

  calculateSignedHeight(): number {
    return (this.coordinates[LAST].y - this.coordinates[FIRST].y);
  }

  setupSelectionCoords(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    const bordure = (drawingArea.getShape().lineWidth / 2);
    const minX = drawingArea.getShape().coordinates[FIRST].x - bordure;
    const minY = drawingArea.getShape().coordinates[FIRST].y - bordure;
    const width = drawingArea.getShape().width + (bordure * 2);
    const height = drawingArea.getShape().height + (bordure * 2);

    (drawingArea.getShape() as ShapeDescription).originCoords = [{x: minX, y: minY}, {x: minX + width , y: minY + height}];
    drawingArea.getShape().firstOriginCoords = [{x: minX, y: minY}, {x: minX + width , y: minY + height}];
  }

}
