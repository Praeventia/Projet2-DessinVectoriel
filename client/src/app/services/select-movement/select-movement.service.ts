import { EventEmitter, Injectable, Output } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { KEY_CODE } from '../enum/key-code';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { SelectionToolService } from '../tools/selection-tool.service';

const FIRST = 0;
const LAST = 1;
const PIXEL_MOVING = 3;

@Injectable({
  providedIn: 'root'
})
export class SelectMovementService {

  arrowHandler: Map<string, boolean>;
  @Output() isSelectionStackEmpty: EventEmitter<boolean> = new EventEmitter();
  @Output() selectionStack: EventEmitter<ShapeDescription[]> = new EventEmitter();

  constructor() {
    this.arrowHandler = new Map();
    this.arrowHandler.set(KEY_CODE.ARROW_UP, false);
    this.arrowHandler.set(KEY_CODE.ARROW_DOWN, false);
    this.arrowHandler.set(KEY_CODE.ARROW_RIGHT, false);
    this.arrowHandler.set(KEY_CODE.ARROW_LEFT, false);
  }

  onKeyPress(event: KeyboardEvent): Coordinate {
    switch (event.key) {
      case 'ArrowUp':
            this.changeSate(KEY_CODE.ARROW_UP, true);
            break;

      case 'ArrowDown':
              this.changeSate(KEY_CODE.ARROW_DOWN, true);
              break;

      case 'ArrowLeft':
              this.changeSate(KEY_CODE.ARROW_LEFT, true);
              break;

      case 'ArrowRight':
              this.changeSate(KEY_CODE.ARROW_RIGHT, true);
              break;
    }
    return this.handleArrow();
  }

  handleArrow(): Coordinate {
    const movingProperties = {x: 0, y: 0};
    if (this.arrowHandler.get(KEY_CODE.ARROW_UP) && !this.arrowHandler.get(KEY_CODE.ARROW_DOWN)) { movingProperties.y = -PIXEL_MOVING; }
    if (this.arrowHandler.get(KEY_CODE.ARROW_DOWN) && !this.arrowHandler.get(KEY_CODE.ARROW_UP)) { movingProperties.y = PIXEL_MOVING; }
    if (this.arrowHandler.get(KEY_CODE.ARROW_RIGHT) && !this.arrowHandler.get(KEY_CODE.ARROW_LEFT)) { movingProperties.x = PIXEL_MOVING; }
    if (this.arrowHandler.get(KEY_CODE.ARROW_LEFT) && !this.arrowHandler.get(KEY_CODE.ARROW_RIGHT)) { movingProperties.x = -PIXEL_MOVING; }
    return movingProperties;
  }

  isMoving(): boolean {
    let isMoving;
    if (this.arrowHandler.get(KEY_CODE.ARROW_UP) || this.arrowHandler.get(KEY_CODE.ARROW_DOWN)
      || this.arrowHandler.get(KEY_CODE.ARROW_RIGHT) || this.arrowHandler.get(KEY_CODE.ARROW_LEFT)) {
        isMoving = true;
    } else {
      isMoving = false;
    }
    return isMoving;
  }

  onKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
            this.changeSate(KEY_CODE.ARROW_UP, false);
            break;

      case 'ArrowDown':
              this.changeSate(KEY_CODE.ARROW_DOWN, false);
              break;

      case 'ArrowLeft':
              this.changeSate(KEY_CODE.ARROW_LEFT, false);
              break;

      case 'ArrowRight':
              this.changeSate(KEY_CODE.ARROW_RIGHT, false);
              break;
    }
  }

  changeSate(eventKey: string, option: boolean): void {
    this.arrowHandler.set(eventKey, option);
  }

  // can't do more simple then that
  // tslint:disable-next-line: cyclomatic-complexity
  setupSelectionConditions(shape: ShapeDescription, coordinates: Coordinate[], inversion: boolean): boolean {
    const selectionStartX = coordinates[FIRST].x;
    const selectionStartY = coordinates[FIRST].y;
    const selectionEndX = coordinates[LAST].x;
    const selectionEndY = coordinates[LAST].y;

    const shapeStartX = shape.originCoords[FIRST].x;
    const shapeStartY = shape.originCoords[FIRST].y;
    const shapeEndX = shape.originCoords[LAST].x;
    const shapeEndY = shape.originCoords[LAST].y;

    for (let checkY = shapeStartY; checkY < shapeEndY; checkY++) {
      if (((checkY >= selectionStartY) && (checkY <= selectionEndY)) &&
          (( ((shapeStartX >= selectionStartX) && (shapeStartX <= selectionEndX)) ||
             ((shapeEndX >= selectionStartX) && (shapeEndX <= selectionEndX)) ))) {
          if (!inversion) { return true;
          } else {  return false; }
      }
    }
    for (let checkX = shapeStartX; checkX < shapeEndX; checkX++) {
      if (((checkX >= selectionStartX) && (checkX <= selectionEndX)) &&
          (( ((shapeStartY >= selectionStartY) && (shapeStartY <= selectionEndY)) ||
             ((shapeEndY >= selectionStartY) && (shapeEndY <= selectionEndY)) ))) {
          if (!inversion) { return true;
          } else {  return false; }
      }
    }
    if (inversion) {
      return true;
    }
    return false; // Nothing was selected
  }

  setupTotalSelectionSize(drawingArea: DrawingAreaComponent, totalSelectionCoordinates: Coordinate[], totalShapesSelected: number,
                          inversion: boolean, newSelectionStack: ShapeDescription[]): Coordinate[] {
    if ((totalShapesSelected === 0) || ((totalShapesSelected === (drawingArea.newShapeLvl - 1)) && inversion)) {
      totalSelectionCoordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    } else {
      let xMin = newSelectionStack[FIRST].originCoords[FIRST].x;
      let yMin = newSelectionStack[FIRST].originCoords[FIRST].y;
      let xMax = newSelectionStack[FIRST].originCoords[LAST].x;
      let yMax = newSelectionStack[FIRST].originCoords[LAST].y;

      for (const currentShape of newSelectionStack) {
        if (currentShape.originCoords[FIRST].x < xMin) {
          xMin = currentShape.originCoords[FIRST].x;
        }
        if (currentShape.originCoords[FIRST].y < yMin) {
          yMin = currentShape.originCoords[FIRST].y;
        }
        if ((currentShape.originCoords[LAST].x) > xMax) {
          xMax = currentShape.originCoords[LAST].x;
        }
        if ((currentShape.originCoords[LAST].y) > yMax) {
          yMax = currentShape.originCoords[LAST].y;
        }
      }
      totalSelectionCoordinates = [{x: xMin, y: yMin}, {x: xMax, y: yMax}];
    }
    return totalSelectionCoordinates;
  }

  checkIfShapeInStack(shape: ShapeDescription, totalShapesSelected: number, newSelectionStack: ShapeDescription[] ): boolean {
    if (totalShapesSelected > 0) {
      for (const currentShape of newSelectionStack) {
        if (currentShape === shape) {
          return true;
        }
      }
    }
    return false;
  }

  start(drawingArea: DrawingAreaComponent, modification: ShapeModification): ShapeModification {
    modification = new ShapeModification();
    modification.shapeType = SELECT_SHAPE_TYPE.SELECTION;
    drawingArea.setModification(modification);
    return modification;
  }

  finish(drawingArea: DrawingAreaComponent, modification: ShapeModification): void {
    let selection: ShapeDescription = new ShapeDescription();
    drawingArea.setModification(new ShapeModification());
    modification.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    if (modification.modifications.length > 0) {
      selection  = drawingArea.newShapeStack.pop() as ShapeDescription;
      drawingArea.newShapeStack[drawingArea.newShapeLvl] = modification;
      drawingArea.newShapeLvl++;
    }
    drawingArea.newShapeStack[drawingArea.newShapeLvl] = selection;
  }

  changeShapeStackEmpty(option: boolean): void {
    this.isSelectionStackEmpty.emit(option);
  }

  getEmittedValueShapeStackEmpty(): EventEmitter<boolean> {
    return this.isSelectionStackEmpty;
  }

  changeShapeStack(shapeStack: ShapeDescription[]): void {
    this.selectionStack.emit(shapeStack);
  }

  getEmittedValueShapeStack(): EventEmitter<ShapeDescription[]> {
    return this.selectionStack;
  }

  moveSelectedShapes(coordinate: Coordinate, drawingArea: DrawingAreaComponent, arrowXMove: number,
                     arrowYMove: number, selection: SelectionToolService): void {
    let xDistance = 0;
    let yDistance = 0;

    if ((arrowXMove === 0) && (arrowYMove === 0)) {
      xDistance = (coordinate.x - selection.selectionClickCoord.x);
      yDistance = (coordinate.y - selection.selectionClickCoord.y);
    } else {
      xDistance = arrowXMove;
      yDistance = arrowYMove;
    }

    selection.coordinates[FIRST].x += xDistance;
    selection.coordinates[FIRST].y += yDistance;
    selection.coordinates[LAST].x += xDistance;
    selection.coordinates[LAST].y += yDistance;
    selection.updateCoordinates(drawingArea);
    for (const currentShape of selection.newSelectionStack) {
      for (const movingShape of drawingArea.getDescriptionStack(false)) {
        if (currentShape === movingShape) {
          movingShape.moveCoords.x += xDistance;
          movingShape.moveCoords.y += yDistance;
          movingShape.originCoords[FIRST].x += xDistance;
          movingShape.originCoords[FIRST].y += yDistance;
          movingShape.originCoords[LAST].x += xDistance;
          movingShape.originCoords[LAST].y += yDistance;
          movingShape.firstOriginCoords[FIRST].x += xDistance;
          movingShape.firstOriginCoords[FIRST].y += yDistance;
          movingShape.firstOriginCoords[LAST].x += xDistance;
          movingShape.firstOriginCoords[LAST].y += yDistance;
          currentShape.coordinates = movingShape.coordinates;
          currentShape.originCoords = movingShape.originCoords;
          currentShape.firstOriginCoords = movingShape.firstOriginCoords;
          selection.moved = true;
          break;
        }
      }
    }
    selection.selectionClickCoord = coordinate;
  }

}
