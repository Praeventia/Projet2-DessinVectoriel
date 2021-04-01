import { Injectable } from '@angular/core';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from './tool.service';

@Injectable({
  providedIn: 'root'
})
export class FillToolService extends Tool {

  modification: ShapeModification;

  start(drawingArea: DrawingAreaComponent): void {
    this.modification = new ShapeModification();
    this.modification.shapeType = SELECT_SHAPE_TYPE.FILL;
    drawingArea.setModification(this.modification);
  }

  finish(drawingArea: DrawingAreaComponent): void {
    drawingArea.setModification(new ShapeModification());
    this.modification.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    drawingArea.newShape(this.modification);
  }

  onMouseClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    this.finish(drawingArea);
    this.start(drawingArea);
  }

}
