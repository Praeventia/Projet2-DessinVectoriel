import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from './tool.service';

const MOUSE = 0;
const DENSITY = 0.1;

@Injectable({
    providedIn: 'root'
})

export class SprayTool extends Tool {

  delay: number;
  drawingArea: DrawingAreaComponent;
  firstDot: boolean;

  constructor() {
    super();
    this.delay = ShapeDescription.frequency;
    this.firstDot = true;
  }

  onMouseDown(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    this.lineWidth = ShapeDescription.lineWidth;
    this.delay = ShapeDescription.frequency;
    this.isDrawing = true;
    this.coordinates[MOUSE] = coordinate;
    this.drawingArea = drawingArea;
    this.firstDot = true;
    drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.SPRAY;
    drawingArea.getShape().update();
    this.paint();

  }

  onMouseMove(coordinate: Coordinate, drawingArea: DrawingAreaComponent, mouseIsOut: boolean): void {

    if (this.isDrawing) {
        this.coordinates[MOUSE] = coordinate;
    }

  }

  onMouseUp(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    this.ajustSelectionCoords(drawingArea);
    this.isDrawing = false;

  }

  paint(): void {

    for (let i = 0; i < DENSITY * this.lineWidth; i++) {

      const angle = Math.random() * Math.PI * 2;
      const random = Math.random();
      const radius = random * random;

      const x = this.coordinates[MOUSE].x + Math.cos(angle) * radius * this.lineWidth;
      const y = this.coordinates[MOUSE].y + Math.sin(angle) * radius * this.lineWidth;

      this.drawingArea.getShape().coordinates.push({x, y});
      if (this.firstDot) {
        this.firstDot = false;
        this.drawingArea.getShape().originCoords = [{x, y}, {x, y}];
      } else { this.setupSelectionCoords({x, y}, this.drawingArea); }
    }

    if (this.isDrawing) {
        setTimeout(() => this.paint(), this.delay);
    } else {
        this.drawingArea.saveShape();
    }
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

    const dotRadius = 6;

    const currentMinX = drawingArea.getShape().originCoords[0].x - dotRadius;
    const currentMaxX = drawingArea.getShape().originCoords[1].x + dotRadius;
    const currentMinY = drawingArea.getShape().originCoords[0].y - dotRadius;
    const currentMaxY = drawingArea.getShape().originCoords[1].y + dotRadius;

    drawingArea.getShape().originCoords = [{x: currentMinX, y: currentMinY}, {x: currentMaxX, y: currentMaxY}];
    drawingArea.getShape().firstOriginCoords = [{x: currentMinX, y: currentMinY}, {x: currentMaxX, y: currentMaxY}];
  }

}
