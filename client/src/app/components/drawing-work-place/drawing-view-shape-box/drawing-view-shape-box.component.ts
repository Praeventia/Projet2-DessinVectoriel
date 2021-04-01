import { Component} from '@angular/core';
import { faCircle, faDrawPolygon, faGripLines, faVectorSquare, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_DRAWING_TYPE } from '../../../services/enum/drawing-type';
import { SELECT_TOOLS } from '../../../services/enum/select-tool';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';

@Component({
  selector: 'app-drawing-view-shape-box',
  templateUrl: './drawing-view-shape-box.component.html',
  styleUrls: ['./drawing-view-shape-box.component.scss']
})

export class DrawingViewShapeBoxComponent {

  faDrawPolygon: IconDefinition = faDrawPolygon;
  faGripLines: IconDefinition = faGripLines;
  faVectorSquare: IconDefinition = faVectorSquare;
  faCircle: IconDefinition = faCircle;

  currentShape: SELECT_TOOLS;
  inputWidthValue: number;
  inputRadius: number;
  nbSide: number;

  constructor(private toolManager: ToolManagerService) {
    this.currentShape = SELECT_TOOLS.NONE;
    this.inputWidthValue = 0;
    this.inputRadius = 0;
    this.nbSide = 0;
    this.toolManager.getEmittedTool().subscribe((item: number) => this.currentShape = item );
  }

  setWidthValue(value: number): void {
    this.inputWidthValue = value;
    ShapeDescription.lineWidth = value;
  }

  setRadius(value: number): void {
    this.inputRadius = value;
    ShapeDescription.dotRadius = value;
  }

  setNbSide(value: string): void {
    this.nbSide = parseInt(value, 10);
    ShapeDescription.nbSide = this.nbSide;
    this.toolManager.newPolyMatrix();
  }

  setDrawType(type: string): void {
    switch (type) {
      case SELECT_DRAWING_TYPE.BORDER_FILL:
        ShapeDescription.drawType = SELECT_DRAWING_TYPE.BORDER_FILL;
        break;
      case SELECT_DRAWING_TYPE.FILL:
        ShapeDescription.drawType = SELECT_DRAWING_TYPE.FILL;
        break;
      case SELECT_DRAWING_TYPE.BORDER:
        ShapeDescription.drawType = SELECT_DRAWING_TYPE.BORDER;
        break;
      case SELECT_DRAWING_TYPE.NO_DOT:
        ShapeDescription.drawType = SELECT_DRAWING_TYPE.NO_DOT;
        break;
      case SELECT_DRAWING_TYPE.DOT:
        ShapeDescription.drawType = SELECT_DRAWING_TYPE.DOT;
        break;
    }
  }

  drawRectangle(): void {
    this.currentShape = SELECT_TOOLS.RECTANGLE;
    this.toolManager.selectTool(this.currentShape);
    this.setDrawType(SELECT_DRAWING_TYPE.BORDER_FILL);
    this.setWidthValue(1);
    this.toolManager.changeTool(SELECT_TOOLS.RECTANGLE);
  }

  drawLine(): void {
    this.currentShape = SELECT_TOOLS.LINE;
    this.toolManager.selectTool(this.currentShape);
    this.setDrawType(SELECT_DRAWING_TYPE.NO_DOT);
    this.setWidthValue(1);
    this.setRadius(1);
    this.toolManager.changeTool(SELECT_TOOLS.LINE);
  }

  drawEllispe(): void {
    this.currentShape = SELECT_TOOLS.ELLIPSE;
    this.toolManager.selectTool(this.currentShape);
    this.setDrawType(SELECT_DRAWING_TYPE.BORDER_FILL);
    this.setWidthValue(1);
    this.toolManager.changeTool(SELECT_TOOLS.ELLIPSE);
  }

  drawPolygone(): void {
    this.currentShape = SELECT_TOOLS.POLYGONE;
    this.toolManager.selectTool(this.currentShape);
    this.setDrawType(SELECT_DRAWING_TYPE.BORDER_FILL);
    this.setWidthValue(1);
    this.setNbSide('3');
    this.toolManager.changeTool(SELECT_TOOLS.POLYGONE);
  }

}
