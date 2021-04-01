import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { RotationService } from '../rotation/rotation.service';
import { SelectMovementService } from '../select-movement/select-movement.service';
import { RectangleTool } from './rectangle-tool.service';

const FIRST = 0;
const LAST = 1;
const WAITING_TIME = 100;

@Injectable({
  providedIn: 'root'
})

export class SelectionToolService extends RectangleTool {

  totalSelectionCoordinates: Coordinate[];
  modification: ShapeModification;

  newSelectionStack: ShapeDescription[];
  oldPositionSelectionStack: ShapeDescription[];

  totalShapesSelected: number;

  inversion: boolean;
  selectionClicked: boolean;
  shiftToggle: boolean;

  selectionClickCoord: Coordinate;
  tempCoordinate: Coordinate;

  moved: boolean;
  hasRotated: boolean;
  firstTime: boolean;

  constructor(private selectMovement: SelectMovementService, private rotate: RotationService) {
    super();
    this.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    this.totalSelectionCoordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    this.newSelectionStack = [];
    this.oldPositionSelectionStack = [];
    this.totalShapesSelected = 0;
    this.inversion = false;
    this.selectionClicked = false;
    this.selectionClickCoord = {x: 0, y: 0};
    this.tempCoordinate = {x: 0, y: 0};
    this.moved = false;
    this.firstTime = true;
    this.hasRotated = false;
    this.shiftToggle = !this.isShiftDown;
  }

  onKeyPress(event: KeyboardEvent, drawingArea: DrawingAreaComponent): void {
    let xMove = 0;
    let yMove = 0;
    const moving = this.selectMovement.onKeyPress(event);
    if (this.selectMovement.isMoving()) {
      if (this.firstTime) {
        this.firstTime = false;
        for (let i = 0; i < this.newSelectionStack.length; i ++) {
          this.oldPositionSelectionStack[i] = JSON.parse(JSON.stringify(this.newSelectionStack[i]));
        }
      }
    }
    xMove = moving.x;
    yMove = moving.y;
    setTimeout(() => this.moveSelectedShapes({x: 0, y: 0}, drawingArea, xMove, yMove), WAITING_TIME );
  }

  onKeyUp(event: KeyboardEvent, drawingArea: DrawingAreaComponent): void {
    this.selectMovement.onKeyUp(event);
    if (!this.selectMovement.isMoving()) {
      this.sendShapeModif(drawingArea);
      this.firstTime = true;
    }
  }

  onControlAKey(drawingArea: DrawingAreaComponent): void {
    this.resetSelection(drawingArea);
    this.selectShapes(drawingArea, true);
    this.changeTotalSelectionSize(drawingArea);
  }

  onMouseDown(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    if (!this.isDrawing) {
      drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.RECTANGLE;
      drawingArea.getShape().update();
      const checkIfShapeClicked = this.checkIfUnselectedShapeClicked(coordinate, drawingArea);
      if (!checkIfShapeClicked || this.inversion) {
        if (!this.checkIfSelectionClicked(coordinate) || this.inversion) {
          if (!checkIfShapeClicked && !this.inversion) {
            this.resetSelection(drawingArea); }
          this.isDrawing = true;
          this.selectionClicked = false;
          this.coordinates[FIRST] = coordinate;
          this.coordinates[LAST] = coordinate;
          this.tempCoordinate = coordinate;
        }
      }
    }
    if (this.selectionClicked) {
      for (let i = 0; i < this.newSelectionStack.length; i ++) {
        this.oldPositionSelectionStack[i] = JSON.parse(JSON.stringify(this.newSelectionStack[i]));
      }
    }
  }

  onMouseMove(coordinate: Coordinate, drawingArea: DrawingAreaComponent, mouseIsOut: boolean): void {
    if (this.isDrawing) {
      if ((coordinate !== this.tempCoordinate) && this.inversion) {
        this.resetSelection(drawingArea);
        this.coordinates = [this.tempCoordinate, this.tempCoordinate];
        this.totalSelectionCoordinates = this.coordinates;
      }
      this.coordinates[LAST] = coordinate;
      this.updateCoordinates(drawingArea);
    } else if (this.selectionClicked) {
      this.moveSelectedShapes(coordinate, drawingArea, 0, 0);
    }

  }

  onMouseUp(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    const verification: boolean = ((Math.round(this.tempCoordinate.x) === Math.round(coordinate.x)) &&
    (Math.round(this.tempCoordinate.y) === Math.round(coordinate.y)) && !this.inversion);
    if (!this.selectionClicked || verification) {
      if (verification) {
        this.resetSelection(drawingArea);
        this.coordinates = [coordinate, coordinate];
      }
      this.isDrawing = false;
      this.selectionClicked = false;
      this.setupSelectionOrigin();
      this.selectShapes(drawingArea, false);
      this.changeTotalSelectionSize(drawingArea);
      this.inversion = false;
      this.tempCoordinate = {x: 0, y: 0};
    } else {
      this.selectionClicked = false;
      this.sendShapeModif(drawingArea);
    }

    if (this.totalShapesSelected === 0) {
      this.resetSelection(drawingArea);
    }

    for (const currentShape of drawingArea.getDescriptionStack(true)) {
      currentShape.shapeClicked = false;
    }
  }

  checkIfUnselectedShapeClicked(coordinate: Coordinate, drawingArea: DrawingAreaComponent): boolean {
    for (const currentShape of drawingArea.getDescriptionStack(true)) {
      if (currentShape.shapeType !== SELECT_SHAPE_TYPE.SELECTION) {
        if (currentShape.shapeClicked && !this.inversion && !this.checkIfShapeInStack(currentShape)) {
          this.newSelectionStack = [];
          this.oldPositionSelectionStack = [];
          this.totalShapesSelected = 0;
          this.addSelectedShape(currentShape);
          this.setupTotalSelectionSize(drawingArea);
          this.changeTotalSelectionSize(drawingArea);
          this.selectionClicked = true;
          this.selectionClickCoord = coordinate;
          this.tempCoordinate = coordinate;
          return true;
        } else if (currentShape.shapeClicked && this.inversion) {
          this.inverseClickFillStack(currentShape, drawingArea);
          this.setupTotalSelectionSize(drawingArea);
          this.changeTotalSelectionSize(drawingArea);
          return true;
        }
      }
    }
    if (this.inversion) {
      this.coordinates = this.totalSelectionCoordinates;
      this.selectionClicked = true; // used so that the selection isnt reset if the inverse select click is used on nothing
      return true;
    }
    return false;
  }

  checkIfShapeInStack(shape: ShapeDescription): boolean {
    return this.selectMovement.checkIfShapeInStack(shape, this.totalShapesSelected, this.newSelectionStack);
  }

  inverseClickFillStack(selectedShape: ShapeDescription, drawingArea: DrawingAreaComponent): void {
    this.newSelectionStack = [];
    this.selectMovement.changeShapeStackEmpty(true);
    this.oldPositionSelectionStack = [];
    this.totalShapesSelected = 0;
    for (const currentShape of drawingArea.getDescriptionStack(true)) {
      if (currentShape !== selectedShape) {
        this.addSelectedShape(currentShape);
      }
    }
  }

  checkIfSelectionClicked(coordinate: Coordinate): boolean {
    for (let checkY  = this.coordinates[0].y; checkY < this.coordinates[1].y; checkY++) {
      for (let checkX = this.coordinates[0].x; checkX < this.coordinates[1].x; checkX++) {
        const currentPoint = {x: checkX, y: checkY};
        if ((Math.round(currentPoint.x) === coordinate.x) && (Math.round(currentPoint.y) === coordinate.y)) {
          this.selectionClicked = true;
          this.selectionClickCoord = coordinate;
          this.tempCoordinate = coordinate;
          return true;
        }
      }
    }
    return false;
  }

  moveSelectedShapes(coordinate: Coordinate, drawingArea: DrawingAreaComponent, arrowXMove: number, arrowYMove: number): void {
    this.selectMovement.moveSelectedShapes(coordinate, drawingArea, arrowXMove, arrowYMove, this);
  }

  selectShapes(drawingArea: DrawingAreaComponent, selectAll: boolean): void {
    if (!((this.coordinates[FIRST].x === this.coordinates[LAST].x) &&
    (this.coordinates[FIRST].y === this.coordinates[LAST].y)) || selectAll) {
      for (const currentShape of drawingArea.getDescriptionStack(true)) {
        if ((currentShape.shapeType !== SELECT_SHAPE_TYPE.SELECTION) && (currentShape.coordinates.length > 0)) {
          if (!selectAll) {
            if (this.setupSelectionConditions(currentShape)) {
              this.addSelectedShape(currentShape);
            }
          } else { // If ctrl+a is selected
            this.addSelectedShape(currentShape);
          }
        }
      }
    } else {
      this.selectOneShape(drawingArea);
    }
    this.setupTotalSelectionSize(drawingArea);
  }

  selectOneShape(drawingArea: DrawingAreaComponent): void {
    for (const currentShape of drawingArea.getDescriptionStack(false)) {
      if (currentShape.shapeType !== SELECT_SHAPE_TYPE.SELECTION) {
        if (currentShape.shapeClicked) {
          this.addSelectedShape(currentShape);
          break;
        }
      }
    }
  }

  setupSelectionConditions(shape: ShapeDescription): boolean {
    return this.selectMovement.setupSelectionConditions(shape, this.coordinates, this.inversion);
  }

  addSelectedShape(currentShape: ShapeDescription): void {
    this.newSelectionStack[this.totalShapesSelected] = currentShape;
    this.selectMovement.changeShapeStackEmpty(false);
    this.selectMovement.changeShapeStack(this.newSelectionStack);
    this.totalShapesSelected++;
  }

  setupTotalSelectionSize(drawingArea: DrawingAreaComponent): void {
    this.totalSelectionCoordinates = this.selectMovement.setupTotalSelectionSize(drawingArea, this.totalSelectionCoordinates,
                                                              this.totalShapesSelected, this.inversion, this.newSelectionStack);
  }

  changeTotalSelectionSize(drawingArea: DrawingAreaComponent): void {
    this.coordinates = this.totalSelectionCoordinates;
    this.updateCoordinates(drawingArea);
  }

  setupSelectionOrigin(): void { // the origin must be in the top left
    let tempCoord: number;

    if (this.coordinates[FIRST].x > this.coordinates[LAST].x) {
      tempCoord = this.coordinates[FIRST].x;
      this.coordinates[FIRST].x = this.coordinates[LAST].x;
      this.coordinates[LAST].x = tempCoord;
    }
    if (this.coordinates[FIRST].y > this.coordinates[LAST].y) {
      tempCoord = this.coordinates[FIRST].y;
      this.coordinates[FIRST].y = this.coordinates[LAST].y;
      this.coordinates[LAST].y = tempCoord;
    }
  }

  onWheelScroll(event: WheelEvent, drawingArea: DrawingAreaComponent): void {
    this.rotate.onWheelScroll(event, drawingArea, this);
  }

  onRightClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    this.inversion = true;
  }

  resetSelection(drawingArea: DrawingAreaComponent): void {
    this.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    this.newSelectionStack = [];
    this.selectMovement.changeShapeStackEmpty(true);
    this.totalShapesSelected = 0;
    this.selectionClickCoord = {x: 0, y: 0};
  }

  start(drawingArea: DrawingAreaComponent): void {
    this.modification = this.selectMovement.start(drawingArea, this.modification);
  }

  finish(drawingArea: DrawingAreaComponent): void {
    this.selectMovement.finish(drawingArea, this.modification);
  }

  sendShapeModif(drawingArea: DrawingAreaComponent): void {
    if (this.moved) {
      for (let i = 0; i < this.oldPositionSelectionStack.length; i ++) {
        const currentShape =  this.newSelectionStack[i];
        const oldShape = this.oldPositionSelectionStack[i];
        this.modification.modifications.push([currentShape, currentShape.fillColor, currentShape.strokeColor, oldShape]);
      }
      this.finish(drawingArea);
      drawingArea.interactionService.saveShape(drawingArea.newShapeStack);
      this.start(drawingArea);
    }
  }
}
