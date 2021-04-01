import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { Coordinate } from '../interfaces/coordinate';
import { SelectionToolService } from '../tools/selection-tool.service';

const CERCLE_ANGLE = 360;
const MOUSE_WHEEL_DELTA = 100;
const HALF_CERCLE = 180;
const FIRST = 0;
const LAST = 1;

@Injectable({
  providedIn: 'root'
})

export class RotationService {

  onWheelScroll(event: WheelEvent, drawingArea: DrawingAreaComponent, selection: SelectionToolService): void {
    event.preventDefault();
    const defaultAngle = 15;
    const altAngle = 1;
    let angle: number;
    if (!selection.isAltDown) { angle = defaultAngle;
    } else { angle = altAngle; }

    if (event.deltaY === MOUSE_WHEEL_DELTA) {
      angle = -angle;
    }

    this.rotateShapes(angle, drawingArea, selection);
    for (let i = 0; i < selection.newSelectionStack.length; i ++) {
      selection.oldPositionSelectionStack[i] = JSON.parse(JSON.stringify(selection.newSelectionStack[i]));
    }
    selection.setupTotalSelectionSize(drawingArea);
    selection.changeTotalSelectionSize(drawingArea);
    selection.sendShapeModif(drawingArea);
  }

  private rotateShapes(angle: number, drawingArea: DrawingAreaComponent, selection: SelectionToolService): void {

    for (let currentShape of selection.newSelectionStack) {
      for (const rotatingShape of drawingArea.getDescriptionStack(false)) {
        if (currentShape === rotatingShape) {
          let selectionAjustX = 0;
          let selectionAjustY = 0;
          if (!selection.isShiftDown) { rotatingShape.rotateAngle = (rotatingShape.rotateAngle + angle) % CERCLE_ANGLE;
          } else { rotatingShape.shiftRotateAngle = (rotatingShape.shiftRotateAngle + angle) % CERCLE_ANGLE; }

          if ((selection.shiftToggle !== selection.isShiftDown) || (!selection.hasRotated)) {
            if (!selection.isShiftDown) {
              rotatingShape.origin.x = ((selection.coordinates[FIRST].x + selection.coordinates[LAST].x) / 2) - rotatingShape.moveCoords.x;
              rotatingShape.origin.y = ((selection.coordinates[FIRST].y + selection.coordinates[LAST].y) / 2) - rotatingShape.moveCoords.y;
            } else {
              rotatingShape.shiftOrigin.x = ((rotatingShape.firstOriginCoords[FIRST].x + rotatingShape.firstOriginCoords[LAST].x) / 2)
                                             - rotatingShape.moveCoords.x;
              rotatingShape.shiftOrigin.y = ((rotatingShape.firstOriginCoords[FIRST].y + rotatingShape.firstOriginCoords[LAST].y) / 2)
                                             - rotatingShape.moveCoords.y;
            }
          }
          if (!selection.isShiftDown) {
            selectionAjustX = rotatingShape.origin.x + rotatingShape.moveCoords.x;
            selectionAjustY = rotatingShape.origin.y + rotatingShape.moveCoords.y;
          } else {
            selectionAjustX = rotatingShape.shiftOrigin.x + rotatingShape.moveCoords.x;
            selectionAjustY = rotatingShape.shiftOrigin.y + rotatingShape.moveCoords.y;
          }
          rotatingShape.originCoords = this.shapeSelectionCoordsRotate(rotatingShape, selectionAjustX, selectionAjustY, selection);
          currentShape = rotatingShape;
          break;
        }
      }
    }
    selection.hasRotated = true;
    if (selection.shiftToggle !== selection.isShiftDown) { selection.shiftToggle = selection.isShiftDown; }
  }

  private shapeSelectionCoordsRotate(rotatingShape: ShapeDescription, centerX: number,
                                     centerY: number, selection: SelectionToolService): Coordinate[] {

    const tempShapeCoords: Coordinate[] = [{x: rotatingShape.firstOriginCoords[FIRST].x,
                                          y: rotatingShape.firstOriginCoords[FIRST].y},
                                         {x: rotatingShape.firstOriginCoords[LAST].x,
                                          y: rotatingShape.firstOriginCoords[FIRST].y},
                                         {x: rotatingShape.firstOriginCoords[FIRST].x,
                                          y: rotatingShape.firstOriginCoords[LAST].y},
                                         {x: rotatingShape.firstOriginCoords[LAST].x,
                                          y: rotatingShape.firstOriginCoords[LAST].y}];
    const newShapeOriginCoords: Coordinate[] = [];
    let angle = 0;
    if (selection.isShiftDown) { angle = rotatingShape.shiftRotateAngle;
    } else { angle = rotatingShape.rotateAngle; }

    let tempCoord: Coordinate = {x: 0, y: 0};
    for (let i = 0; i < tempShapeCoords.length; i++) {
      const coord = tempShapeCoords[i];
      tempCoord = this.translate(coord, -centerX, -centerY);
      tempCoord = this.rotate(tempCoord.x, tempCoord.y, angle);
      tempCoord = this.translate(tempCoord, centerX, centerY);
      newShapeOriginCoords[i] = tempCoord;
    }
    let minX = newShapeOriginCoords[0].x;
    let minY = newShapeOriginCoords[0].y;
    let maxX = newShapeOriginCoords[1].x;
    let maxY = newShapeOriginCoords[1].y;
    for (const coords of newShapeOriginCoords) {
      if (coords.x < minX) {
        minX = coords.x;
      }
      if (coords.y < minY) {
        minY = coords.y;
      }
      if (coords.x > maxX) {
        maxX = coords.x;
      }
      if (coords.y > maxY) {
        maxY = coords.y;
      }
    }
    return [{x: minX, y: minY}, {x: maxX, y: maxY}];
  }

  private translate(coord: Coordinate, xMove: number, yMove: number): Coordinate {
    return {x: coord.x + xMove, y: coord.y + yMove};
  }

  private rotate(currentX: number, currentY: number, angle: number): Coordinate {
    angle = angle * (Math.PI / HALF_CERCLE);
    const newX = (currentX * Math.cos(angle)) - (currentY * Math.sin(angle));
    const newY = (currentX * Math.sin(angle)) + (currentY * Math.cos(angle));

    return {x: newX, y: newY};
  }
}
