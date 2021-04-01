import { EventEmitter, Injectable, Output } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeHandler } from 'src/app/classes/shape-handler';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { SelectionToolService } from '../tools/selection-tool.service';

const OLD_POSITION = 3;
const MAX_LENGHT_MODIF = 4;

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  future: ShapeHandler[];
  futureIsEmpty: boolean;
  pastIsEmpty: boolean;
  floorLvl: number;
  @Output() redoObserver: EventEmitter<boolean> = new EventEmitter();
  @Output() undoObserver: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.future = [];
    this.futureIsEmpty = true;
    this.pastIsEmpty = true;
    this.floorLvl = 0;
  }

  resetFuture(): void {
    this.future = [];
    if (!this.futureIsEmpty) { this.changeFutureIsEmpty(); }
  }

  undo(shapeStack: ShapeHandler[], shapelvl: number, selection: SelectionToolService, drawingArea: DrawingAreaComponent): ShapeHandler[] {
    // It won't be null because we check if the shapeStack is bigger than one so we are sure it will be always define
    // tslint:disable: no-non-null-assertion
    if (shapeStack.length > this.floorLvl + 1) {
      const newEmptyShape = shapeStack.pop();
      const shapePop = shapeStack.pop();

      if (shapePop instanceof ShapeModification ) {
        const shapePopMod = shapePop as ShapeModification;
        this.reverseShapeModif(shapePopMod, shapeStack);
        this.future.push(shapePopMod!);
      } else {
        this.future.push(shapePop!);
      }
      shapeStack[shapelvl] = newEmptyShape!;
      if (this.futureIsEmpty) { this.changeFutureIsEmpty(); }
      if (shapeStack.length === 1) { this.changePastIsEmpty(); }
    }
    selection.setupTotalSelectionSize(drawingArea);
    selection.changeTotalSelectionSize(drawingArea);
    return shapeStack;
  }

  redo(shapeStack: ShapeHandler[], shapelvl: number, selection: SelectionToolService, drawingArea: DrawingAreaComponent): ShapeHandler[] {
    // It won't be null because we check if the shapeStack is bigger than one so we are sure it will be always define
    // tslint:disable-next-line: no-non-null-assertion
    if (!this.futureIsEmpty) {
      const newEmptyShape = shapeStack.pop();
      const futurePop = this.future.pop();
      if (futurePop instanceof ShapeModification ) {
        const shapePopMod = futurePop as ShapeModification;
        this.reverseShapeModif(shapePopMod, shapeStack);
        shapeStack[shapelvl - 1] = shapePopMod!;
      } else {
        shapeStack[shapelvl - 1] = futurePop!;
      }
      shapeStack[shapelvl] = newEmptyShape!;

      if (this.future.length <= 0) { this.changeFutureIsEmpty(); }
      if (this.pastIsEmpty) { this.changePastIsEmpty(); }
    }
    selection.setupTotalSelectionSize(drawingArea);
    selection.changeTotalSelectionSize(drawingArea);
    return shapeStack;
  }

  reverseShapeModif(shapePopMod: ShapeModification, shapeStack: ShapeHandler[]): void {
    for (const shapeFromMod of shapePopMod.modifications) {
      for (let i = 0; i < shapeStack.length; i++) {
        if (shapeStack[i] === shapeFromMod[0]) {

          let shape =  shapeStack[i] as ShapeDescription;

          if (shapeFromMod.length === MAX_LENGHT_MODIF) {
            this.reverseMovement(shapeFromMod, shape);
          } else { shape = shapeFromMod[0]; }

          const fillColortmp = shape.fillColor;
          const strokeColortmp = shape.strokeColor;

          shape.fillColor = shapeFromMod[1];
          shape.strokeColor = shapeFromMod[2];
          shape.isRed = false;
          shapeFromMod[1] = fillColortmp;
          shapeFromMod[2] = strokeColortmp;

          shapeStack[i] = shape;
        }
      }
    }
  }

  reverseMovement(shapeFromMod: [ShapeDescription, string, string, (ShapeDescription | undefined)?], shape: ShapeDescription): void {
    const oldShape = JSON.parse(JSON.stringify(shape));

    shape.coordinates = shapeFromMod[OLD_POSITION]!.coordinates;
    shape.rotateAngle = shapeFromMod[OLD_POSITION]!.rotateAngle;
    shape.originCoords = shapeFromMod[OLD_POSITION]!.originCoords;
    shape.origin =  shapeFromMod[OLD_POSITION]!.origin;
    shape.originCoords =  shapeFromMod[OLD_POSITION]!.originCoords;
    shape.firstOriginCoords =  shapeFromMod[OLD_POSITION]!.firstOriginCoords;
    shape.moveCoords = shapeFromMod[OLD_POSITION]!.moveCoords;
    shape.shiftOrigin = shapeFromMod[OLD_POSITION]!.shiftOrigin;
    shape.shiftRotateAngle = shapeFromMod[OLD_POSITION]!.shiftRotateAngle;

    shapeFromMod[0].coordinates = shape.coordinates;
    shapeFromMod[0].rotateAngle = shape.rotateAngle;
    shapeFromMod[0].originCoords = shape.originCoords;
    shapeFromMod[0].origin = shape.origin;
    shapeFromMod[0].originCoords = shape.originCoords;
    shapeFromMod[0].firstOriginCoords = shape.firstOriginCoords;
    shapeFromMod[0].moveCoords = shape.moveCoords;
    shapeFromMod[0].shiftOrigin = shape.shiftOrigin;
    shapeFromMod[0].shiftRotateAngle = shape.shiftRotateAngle;

    shapeFromMod[OLD_POSITION]!.coordinates = oldShape.coordinates;
    shapeFromMod[OLD_POSITION]!.rotateAngle = oldShape.rotateAngle;
    shapeFromMod[OLD_POSITION]!.originCoords = oldShape.originCoords;
    shapeFromMod[OLD_POSITION]!.origin = oldShape.origin;
    shapeFromMod[OLD_POSITION]!.originCoords = oldShape.originCoords;
    shapeFromMod[OLD_POSITION]!.firstOriginCoords = oldShape.firstOriginCoords;
    shapeFromMod[OLD_POSITION]!.moveCoords = oldShape.moveCoords;
    shapeFromMod[OLD_POSITION]!.shiftOrigin = oldShape.shiftOrigin;
    shapeFromMod[OLD_POSITION]!.shiftRotateAngle = oldShape.shiftRotateAngle;

  }

  changePastIsEmpty(): void {
    this.pastIsEmpty = !this.pastIsEmpty;
    this.undoObserver.emit(this.pastIsEmpty);
  }

  changeFutureIsEmpty(): void {
    this.futureIsEmpty = !this.futureIsEmpty;
    this.redoObserver.emit(this.futureIsEmpty);
  }

  getEmittedValuePastIsEmpty(): EventEmitter<boolean> {
    return this.undoObserver;
  }

  getEmittedValueFutureIsEmpty(): EventEmitter<boolean> {
    return this.redoObserver;
  }

}
