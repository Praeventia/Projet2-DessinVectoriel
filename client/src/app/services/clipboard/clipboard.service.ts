import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { SelectMovementService } from '../select-movement/select-movement.service';
import { EraserToolService } from '../tools/eraser-tool.service';
import { SelectionToolService } from '../tools/selection-tool.service';

const SHIFTING_START = 1;
const SHIFTING = 5;

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  protected shapeStack: ShapeDescription[];
  protected modification: ShapeModification;
  protected selectionShape: string;
  times: number;
  protected shapeMemory: ShapeDescription[];

  constructor(private selectionMovement: SelectMovementService, private eraser: EraserToolService) {
    this.shapeStack = [];
    this.selectionMovement.getEmittedValueShapeStack().subscribe((item: ShapeDescription[]) => this.shapeStack = item );
    this.times = SHIFTING_START;
  }

  copy(drawingArea: DrawingAreaComponent): void {

    this.times = SHIFTING_START;
    this.selectionShape = JSON.stringify(drawingArea.newShapeStack[drawingArea.newShapeStack.length - 1 ]);
    const selectionShapeString =  JSON.stringify(this.shapeStack);

    navigator.clipboard.writeText('');
    navigator.clipboard.writeText(selectionShapeString).then().catch((error) => {
      console.error('Erreur dans l\'écriture du presse-papier: ', error);
    });
  }

  paste(drawing: DrawingAreaComponent, selectionTool: SelectionToolService): void {
    navigator.clipboard.readText().then((infos) => { this.pasteInStack(drawing, infos, selectionTool);
    }).catch((error) => {
      console.error('Erreur dans la lecture du presse-papier: ', error);
    });
  }

  duplicate(drawing: DrawingAreaComponent, selectionTool: SelectionToolService): void {
    if (!this.shapeMemory) {
      this.selectionShape = JSON.stringify(drawing.newShapeStack[drawing.newShapeStack.length - 1 ]);
      this.shapeMemory = JSON.parse(JSON.stringify(this.shapeStack));
    }
    for (let i = 0; i < this.shapeStack.length; i++) {
      for (let j = 0; j < this.shapeStack[i].coordinates.length; j++) {
        if ((this.shapeStack[i].coordinates[j].x - (SHIFTING * (this.times - 1))) !== this.shapeMemory[i].coordinates[j].x) {
          this.selectionShape = JSON.stringify(drawing.newShapeStack[drawing.newShapeStack.length - 1 ]);
          this.shapeMemory = this.shapeStack;
          this.times = SHIFTING_START;
        }
      }
    }
    const informations = JSON.stringify(this.shapeMemory);
    this.pasteInStack(drawing, informations, selectionTool);
  }

  delete(drawingArea: DrawingAreaComponent): void {
    for (const shape of this.shapeStack) {
      for (const shapeDrawing of drawingArea.getDescriptionStack(true)) {
        if (shape === shapeDrawing) {
          shapeDrawing.isRed = true;
        }
      }
    }
    this.eraser.start(drawingArea);
    this.eraser.delete(drawingArea);
    this.eraser.finish(drawingArea);
  }

  cut(drawingArea: DrawingAreaComponent): void {
    this.copy(drawingArea);
    this.delete(drawingArea);
  }

  pasteInStack(drawingArea: DrawingAreaComponent, informations: string, selectionTool: SelectionToolService): void {
    if ((selectionTool.coordinates[1].x + SHIFTING) >= drawingArea.screenWidth) {
      this.times = SHIFTING_START;
    }
    selectionTool.resetSelection(drawingArea);
    this.start(drawingArea);
    const shapesFromClip = JSON.parse(informations);
    const shapesStack = shapesFromClip as ShapeDescription[];
    for (const shape of shapesStack) {
      this.copyShape(shape, drawingArea.getShape());
      selectionTool.addSelectedShape(drawingArea.getShape());
      this.modification.modifications.push([drawingArea.getShape(), 'none', 'none']);
      drawingArea.saveShape();
    }
    this.finish(drawingArea);
    selectionTool.setupTotalSelectionSize(drawingArea);
    selectionTool.changeTotalSelectionSize(drawingArea);
    this.copyShape(JSON.parse(this.selectionShape), drawingArea.getShape());
    this.times++;
  }

  copyShape(copy: ShapeDescription, drawingShape: ShapeDescription): void {
    for (let i = 0; i < copy.coordinates.length; i++) {
      drawingShape.coordinates[i] = {x: 0, y: 0};
      drawingShape.coordinates[i].x = copy.coordinates[i].x + (SHIFTING * this.times);
      drawingShape.coordinates[i].y = copy.coordinates[i].y;
    }
    for (let i = 0; i < copy.originCoords.length; i++) {
      drawingShape.originCoords[i] = {x: 0, y: 0};
      drawingShape.originCoords[i].x = copy.originCoords[i].x + (SHIFTING * this.times);
      drawingShape.originCoords[i].y = copy.originCoords[i].y;
    }

    for (let i = 0; i < copy.firstOriginCoords.length; i++) {
      drawingShape.firstOriginCoords[i] = {x: 0, y: 0};
      drawingShape.firstOriginCoords[i].x = copy.firstOriginCoords[i].x + (SHIFTING * this.times);
      drawingShape.firstOriginCoords[i].y = copy.firstOriginCoords[i].y;
    }

    drawingShape.moveCoords.x = copy.moveCoords.x + (SHIFTING * this.times);
    drawingShape.moveCoords.y = copy.moveCoords.y;

    drawingShape.shiftOrigin.x = copy.shiftOrigin.x + (SHIFTING * this.times);
    drawingShape.shiftOrigin.y = copy.shiftOrigin.y;

    drawingShape.origin.x = copy.origin.x + (SHIFTING * this.times);
    drawingShape.origin.y = copy.origin.y;

    drawingShape.width = copy.width ;
    drawingShape.height = copy.height;
    drawingShape.modificaton = copy.modificaton;
    drawingShape.rotateAngle = copy.rotateAngle;
    drawingShape.shiftRotateAngle = copy.shiftRotateAngle;

    drawingShape.fillColor = copy.fillColor;
    drawingShape.strokeColor = copy.strokeColor;
    drawingShape.drawType = copy.drawType;
    drawingShape.shapeType = copy.shapeType;
    drawingShape.dotRadius = copy.dotRadius;
    drawingShape.texture = copy.texture;
    drawingShape.lineWidth = copy.lineWidth;

    drawingShape.isRed = false;
  }

  start(drawingArea: DrawingAreaComponent): void {
    this.modification = new ShapeModification();
    this.modification.shapeType = SELECT_SHAPE_TYPE.SELECTION;
    drawingArea.setModification(this.modification);
  }

  finish(drawingArea: DrawingAreaComponent): void {
    drawingArea.setModification(new ShapeModification());
    this.modification.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    drawingArea.newShape(this.modification);
  }
}
