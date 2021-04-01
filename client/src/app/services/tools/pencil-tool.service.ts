import { Injectable } from '@angular/core';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from './tool.service';

@Injectable({
    providedIn: 'root'
})

export class PencilTool extends Tool {

  constructor() {
    super();
  }

  onMouseDown(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    drawingArea.getShape().coordinates.push(coordinate);
    drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.PENCIL;
    drawingArea.getShape().update();
    drawingArea.getShape().originCoords[0] = coordinate;
    drawingArea.getShape().originCoords[1] = coordinate;
    this.isDrawing = true;

  }

  onMouseOut(drawingArea: DrawingAreaComponent): void {
    if (this.isDrawing) {
      this.ajustSelectionCoords(drawingArea);
      this.isDrawing = false;
      drawingArea.saveShape();
    }
  }

  onMouseMove(coordinate: Coordinate, drawingArea: DrawingAreaComponent, mouseIsOut: boolean): void {

    if (mouseIsOut) {
      this.isDrawing = false;
      drawingArea.getShape().coordinates = [];
    } else if (this.isDrawing) {
      drawingArea.getShape().coordinates.push(coordinate);
      this.setupSelectionCoords(coordinate, drawingArea);
    }

  }

  onMouseUp(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    drawingArea.getShape().coordinates.push(coordinate);
    this.ajustSelectionCoords(drawingArea);
    this.isDrawing = false;
    drawingArea.saveShape();
  }

  setupSelectionCoords(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    let minX = drawingArea.getShape().originCoords[0].x;
    let maxX = drawingArea.getShape().originCoords[1].x;
    let minY = drawingArea.getShape().originCoords[0].y;
    let maxY = drawingArea.getShape().originCoords[1].y;

    const currentX = coordinate.x;
    const currentY = coordinate.y;

    if (currentX < minX) { minX = currentX;
    } else if (currentX > maxX) { maxX = currentX; }
    if (currentY < minY) { minY = currentY;
    } else if (currentY > maxY) { maxY = currentY; }

    drawingArea.getShape().originCoords = [{x: minX, y: minY}, {x: maxX, y: maxY}];
  }

  ajustSelectionCoords(drawingArea: DrawingAreaComponent): void {
    const lineWidth = drawingArea.getShape().lineWidth;

    const currentMinX = drawingArea.getShape().originCoords[0].x - lineWidth / 2;
    const currentMaxX = drawingArea.getShape().originCoords[1].x + lineWidth / 2;
    const currentMinY = drawingArea.getShape().originCoords[0].y - lineWidth / 2;
    const currentMaxY = drawingArea.getShape().originCoords[1].y + lineWidth / 2;

    drawingArea.getShape().originCoords = [{x: currentMinX, y: currentMinY}, {x: currentMaxX, y: currentMaxY}];
    drawingArea.getShape().firstOriginCoords = [{x: currentMinX, y: currentMinY}, {x: currentMaxX, y: currentMaxY}];
  }

}
