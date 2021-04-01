import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_DRAWING_TYPE } from '../enum/drawing-type';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from './tool.service';

const TEMP = 0;
const FIRST = 1;
// We use mathematics formula to calculate the good angle
// tslint:disable: no-magic-numbers
enum ANGLES_TO_RAD {
  ANGLE_0 = 0,
  ANGLE_45 = Math.PI / 4,
  ANGLE_90 = Math.PI / 2,
  ANGLE_135 = 3 * Math.PI / 4,
  ANGLE_180 = Math.PI,
  ANGLE_225 = 5 * Math.PI / 4,
  ANGLE_270 = 3 * Math.PI / 2,
  ANGLE_315 = 7 * Math.PI / 4,
  ANGLE_360 = 2 * Math.PI
}

@Injectable({
    providedIn: 'root'
})

export class LineTool extends Tool {

  private lastMousePosition: Coordinate;

  borderPoints: Coordinate[] = [];

  constructor() {
    super();
    this.lastMousePosition = {x: 0, y: 0};
  }

  onMouseClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

  if (!this.isDrawing) {
    this.isDrawing = true;
    this.lastMousePosition = coordinate;
    drawingArea.getShape().coordinates[TEMP] = coordinate;
    drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.LINE;
    drawingArea.getShape().update();
  }

  drawingArea.getShape().coordinates.push(drawingArea.getShape().coordinates[TEMP]);
 }

  onMouseMove(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    if (this.isDrawing) {
      drawingArea.getShape().coordinates[TEMP] = coordinate;
      this.lastMousePosition = coordinate;
      this.updateCoordinates(drawingArea);
    }
  }

  onMouseDoubleClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    drawingArea.getShape().coordinates.pop(); // Cancels second click

    const isClosingX: boolean = (drawingArea.getShape().coordinates[TEMP].x >= drawingArea.getShape().coordinates[FIRST].x - 3) &&
    (drawingArea.getShape().coordinates[TEMP].x <= drawingArea.getShape().coordinates[FIRST].x + 3);
    const isClosingY: boolean = (drawingArea.getShape().coordinates[TEMP].y >= drawingArea.getShape().coordinates[FIRST].y - 3) &&
    (drawingArea.getShape().coordinates[TEMP].y <= drawingArea.getShape().coordinates[FIRST].y + 3);
    const isClosing: boolean = isClosingX && isClosingY;

    drawingArea.getShape().coordinates.pop(); // Removes last coordinate, must maybe go in the next if
    if (isClosing) {
      drawingArea.getShape().coordinates[TEMP] = drawingArea.getShape().coordinates[FIRST];
    }
    this.setupSelectionCoords(coordinate, drawingArea);
    drawingArea.saveShape();
    this.isDrawing = false;

  }

  setupSelectionCoords(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    const firstPoint = drawingArea.getShape().coordinates[0];
    let minX = firstPoint.x;
    let maxX = minX;
    let minY = firstPoint.y;
    let maxY = minY;
    this.borderPoints = [firstPoint, firstPoint, firstPoint, firstPoint];

    for (let i = 1; i < drawingArea.getShape().coordinates.length; i++) {
      const currentPoint = drawingArea.getShape().coordinates[i];
      const newX = currentPoint.x;
      const newY = currentPoint.y;
      if (newX < minX) { minX = newX; this.borderPoints[0] = currentPoint ;
      } else if (newX > maxX) { maxX = newX; this.borderPoints[1] = currentPoint; }
      if (newY < minY) { minY = newY; this.borderPoints[2] = currentPoint;
      } else if (newY > maxY) { maxY = newY; this.borderPoints[3] = currentPoint; }
    }
    drawingArea.getShape().originCoords = [{x: minX, y: minY}, {x: maxX, y: maxY}];
    drawingArea.getShape().firstOriginCoords = [{x: minX, y: minY}, {x: maxX, y: maxY}];
  }

  updateCoordinates(drawingArea: DrawingAreaComponent): void {

    const LAST: number = drawingArea.getShape().coordinates.length - 1;
    const deltaX: number = drawingArea.getShape().coordinates[TEMP].x - drawingArea.getShape().coordinates[LAST].x;
    const deltaY: number = drawingArea.getShape().coordinates[TEMP].y - drawingArea.getShape().coordinates[LAST].y;

    if (this.isShiftDown) {

      let angle: number = Math.atan2(deltaY, deltaX);
      if (angle < 0) {
        angle += ANGLES_TO_RAD.ANGLE_360;
      }
      angle = ANGLES_TO_RAD.ANGLE_360 - angle;
      angle = this.calculateDesiredAngle(angle);

      switch (angle) {

        case (ANGLES_TO_RAD.ANGLE_0 ):
        case (ANGLES_TO_RAD.ANGLE_180):
          drawingArea.getShape().coordinates[TEMP] = {x: this.lastMousePosition.x, y: drawingArea.getShape().coordinates[LAST].y};
          break;

        case (ANGLES_TO_RAD.ANGLE_90):
        case (ANGLES_TO_RAD.ANGLE_270):
          drawingArea.getShape().coordinates[TEMP] = {x: drawingArea.getShape().coordinates[LAST].x, y: this.lastMousePosition.y};
          break;

        case (ANGLES_TO_RAD.ANGLE_135):
        case (ANGLES_TO_RAD.ANGLE_315):
          drawingArea.getShape().coordinates[TEMP] = {x: this.lastMousePosition.x, y: this.lastMousePosition.y - deltaY + deltaX};
          break;

        case (ANGLES_TO_RAD.ANGLE_225):
        case (ANGLES_TO_RAD.ANGLE_45):
          drawingArea.getShape().coordinates[TEMP] = {x: this.lastMousePosition.x, y: this.lastMousePosition.y - deltaY - deltaX};
          break;

      }

    } else {
      drawingArea.getShape().coordinates[TEMP] = this.lastMousePosition;
    }

  }

  // To desactivate the line to see something
  // tslint:disable-next-line: cyclomatic-complexity
  calculateDesiredAngle(angle: number): number {

    const HALF_ANGLE_45_TO_RAD: number = ANGLES_TO_RAD.ANGLE_45 / 2;

    if ((angle > ANGLES_TO_RAD.ANGLE_0) && (angle < HALF_ANGLE_45_TO_RAD)) {
      return ANGLES_TO_RAD.ANGLE_0;
    } else if ((angle >= HALF_ANGLE_45_TO_RAD) && (angle < ANGLES_TO_RAD.ANGLE_45 + HALF_ANGLE_45_TO_RAD)) {
      return ANGLES_TO_RAD.ANGLE_45;
    } else if ((angle >= ANGLES_TO_RAD.ANGLE_90 - HALF_ANGLE_45_TO_RAD) && (angle < ANGLES_TO_RAD.ANGLE_90 + HALF_ANGLE_45_TO_RAD)) {
      return ANGLES_TO_RAD.ANGLE_90;
    } else if ((angle >= ANGLES_TO_RAD.ANGLE_135 - HALF_ANGLE_45_TO_RAD) && (angle < ANGLES_TO_RAD.ANGLE_135 + HALF_ANGLE_45_TO_RAD)) {
      return ANGLES_TO_RAD.ANGLE_135;
    } else if ((angle >= ANGLES_TO_RAD.ANGLE_180 - HALF_ANGLE_45_TO_RAD) && (angle < ANGLES_TO_RAD.ANGLE_180 + HALF_ANGLE_45_TO_RAD)) {
      return ANGLES_TO_RAD.ANGLE_180;
    } else if ((angle >= ANGLES_TO_RAD.ANGLE_225 - HALF_ANGLE_45_TO_RAD) && (angle < ANGLES_TO_RAD.ANGLE_225 + HALF_ANGLE_45_TO_RAD)) {
      return ANGLES_TO_RAD.ANGLE_225;
    } else if ((angle >= ANGLES_TO_RAD.ANGLE_270 - HALF_ANGLE_45_TO_RAD) && (angle < ANGLES_TO_RAD.ANGLE_270 + HALF_ANGLE_45_TO_RAD)) {
      return ANGLES_TO_RAD.ANGLE_270;
    } else if ((angle >= ANGLES_TO_RAD.ANGLE_315 - HALF_ANGLE_45_TO_RAD) && (angle < ANGLES_TO_RAD.ANGLE_315 + HALF_ANGLE_45_TO_RAD)) {
      return ANGLES_TO_RAD.ANGLE_315;
    } else if (angle >= ANGLES_TO_RAD.ANGLE_315 + HALF_ANGLE_45_TO_RAD) {
      return ANGLES_TO_RAD.ANGLE_0;
    }
    return ANGLES_TO_RAD.ANGLE_0;
  }

  onEscapeKey(drawingArea: DrawingAreaComponent): void {

    this.isDrawing = false;
    drawingArea.getShape().coordinates = [];
    drawingArea.getShape().coordinates.push({x: 0, y: 0});
    this.updateCoordinates(drawingArea);

  }

  onBackspaceKey(drawingArea: DrawingAreaComponent): void {

    if (this.isDrawing) {
      if (drawingArea.getShape().coordinates.length > 2) {
        drawingArea.getShape().coordinates.pop();
      }
      this.updateCoordinates(drawingArea);
    }

  }

  calculateBounds(description: ShapeDescription): void {
    description.origin = description.coordinates[0];
    const max = {x: 0, y: 0};

    for (const coord of description.coordinates) {
      if (coord.x < description.origin.x) {
        description.origin.x = coord.x;
      }
      if (coord.y < description.origin.y) {
        description.origin.y = coord.y;
      }
      if (coord.x > max.x) {
        max.x = coord.x;
      }
      if (coord.y > max.y) {
        max.y = coord.y;
      }
    }

    if (description.drawType === SELECT_DRAWING_TYPE.DOT) {
      description.width = max.x - description.origin.x + description.dotRadius;
      description.height = max.y - description.origin.y + description.dotRadius;
    } else {
      description.width = max.x - description.origin.x;
      description.height = max.y - description.origin.y;
    }

  }

}
