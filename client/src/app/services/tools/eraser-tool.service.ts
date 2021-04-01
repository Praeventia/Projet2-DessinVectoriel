import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { Coordinate } from '../../services/interfaces/coordinate';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Tool } from '../tools/tool.service';

@Injectable({
  providedIn: 'root'
})

export class EraserToolService extends Tool {

  modification: ShapeModification;
  isActive: boolean;
  erased: boolean;

  constructor() {
    super();
    this.erased = false;
  }

  start(drawingArea: DrawingAreaComponent): void {
    this.modification = new ShapeModification();
    this.modification.shapeType = SELECT_SHAPE_TYPE.ERASER;
    this.isActive = false;
    drawingArea.setModification(this.modification);
  }

  finish(drawingArea: DrawingAreaComponent): void {
    drawingArea.setModification(new ShapeModification());
    this.modification.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    drawingArea.newShape(this.modification);
  }

  onMouseDown(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    this.isActive = true;
  }

  onMouseMove(coordinate: Coordinate, drawingArea: DrawingAreaComponent, mouseIsOut: boolean): void {

    drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.ERASER;
    drawingArea.getShape().origin = coordinate;
    drawingArea.getShape().lineWidth = ShapeDescription.lineWidth;
    this.modification.lineWidth = ShapeDescription.lineWidth;

    if (this.isActive) {
      this.delete(drawingArea);
    }

  }

  onMouseClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    this.delete(drawingArea);
    if (this.erased) {
      this.finish(drawingArea);
      this.start(drawingArea);
    }
  }

  onMouseUp(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    this.isActive = false;

    if (this.erased) {
      this.finish(drawingArea);
      this.start(drawingArea);
    }
  }

  delete(drawingArea: DrawingAreaComponent): void {

    for (const shape of drawingArea.newShapeStack) {
      if (shape instanceof ShapeDescription) {
        if (shape.isRed) {

          this.erased = true;

          this.modification.modifications.push([shape, shape.fillColor, shape.strokeColor]);
          shape.isRed = false;

          shape.fillColor = 'none';
          shape.strokeColor = 'none';

        }
      }
    }

  }
}
