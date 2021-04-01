import { Injectable } from '@angular/core';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_DRAWING_TYPE } from '../enum/drawing-type';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from './tool.service';

const FIRST = 0;
const LAST = 1;
const THIRD_POINT = 3;

@Injectable({
    providedIn: 'root'
})

export class RectangleTool extends Tool {

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
      drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.RECTANGLE;
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
    this.addCornerCoords(drawingArea);
    drawingArea.saveShape();
    this.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];

  }

  addCornerCoords(drawingArea: DrawingAreaComponent): void {
    const firstX = drawingArea.getShape().coordinates[FIRST].x;
    const firstY = drawingArea.getShape().coordinates[FIRST].y;
    const width = drawingArea.getShape().width;
    const height = drawingArea.getShape().height;

    drawingArea.getShape().coordinates[1] = {x: firstX + width, y: firstY};
    drawingArea.getShape().coordinates[2] = {x: firstX, y: firstY + height};
    drawingArea.getShape().coordinates[THIRD_POINT] = {x: firstX + width, y: firstY + height};
    this.updateCoordinates(drawingArea);
  }

  updateCoordinates(drawingArea: DrawingAreaComponent): void {

    let width: number = this.calculateSignedWidth();
    let height: number = this.calculateSignedHeight();

    const isWidthPositive: boolean = width >= 0;
    const isHeightPositive: boolean = height >= 0;

    const min: number = Math.min(Math.abs(width), Math.abs(height));

    if (drawingArea.getShape().drawType !== SELECT_DRAWING_TYPE.SELECTION) {
      width = this.isShiftDown ? min : Math.abs(width);
      height = this.isShiftDown ? min : Math.abs(height);
    } else {
      width = Math.abs(width);
      height = Math.abs(height);
    }

    const x: number = isWidthPositive ? this.coordinates[FIRST].x : this.coordinates[FIRST].x - width;
    const y: number = isHeightPositive ? this.coordinates[FIRST].y : this.coordinates[FIRST].y - height;

    drawingArea.getShape().coordinates.pop();
    drawingArea.getShape().coordinates.push({x, y});
    drawingArea.getShape().width = width;
    drawingArea.getShape().height = height;

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

    drawingArea.getShape().originCoords = [{x: minX, y: minY}, {x: minX + width , y: minY + height}];
    drawingArea.getShape().firstOriginCoords = [{x: minX, y: minY}, {x: minX + width , y: minY + height}];
  }

}
