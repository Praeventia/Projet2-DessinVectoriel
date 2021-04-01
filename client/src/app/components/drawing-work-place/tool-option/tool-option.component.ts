import { Component } from '@angular/core';
import { faCircle, faDrawPolygon, faGripLines, faVectorSquare, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { SELECT_TOOLS } from 'src/app/services/enum/select-tool';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';

const BASE_WIDTH = 10;
const BASE_NB_SIDE = 3;

@Component({
  selector: 'app-tool-option',
  templateUrl: './tool-option.component.html',
  styleUrls: ['../drawing-view-ux/drawing-view-ux.component.scss']
})
export class ToolOptionComponent {

  protected currentShape: SELECT_TOOLS;
  protected width: number;
  protected nbSide: number;
  protected radius: number;

  protected faDrawPolygon: IconDefinition = faDrawPolygon;
  protected faGripLines: IconDefinition = faGripLines;
  protected faVectorSquare: IconDefinition = faVectorSquare;
  protected faCircle: IconDefinition = faCircle;

  constructor(private toolManager: ToolManagerService) {
    this.line();
   }

  setWidth(value: number): void {
    this.width = value;
    ShapeDescription.lineWidth = value;
  }

  setRadius(value: number): void {
    this.radius = value;
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

  rectangle(): void {
    this.currentShape = SELECT_TOOLS.RECTANGLE;
    this.toolManager.selectTool(this.currentShape);
    this.setDrawType(SELECT_DRAWING_TYPE.BORDER_FILL);
    this.setWidth(BASE_WIDTH);
    this.toolManager.changeTool(SELECT_TOOLS.RECTANGLE);
  }

  line(): void {
    this.currentShape = SELECT_TOOLS.LINE;
    this.toolManager.selectTool(this.currentShape);
    this.setDrawType(SELECT_DRAWING_TYPE.NO_DOT);
    this.setWidth(BASE_WIDTH);
    this.setRadius(BASE_NB_SIDE);
    this.toolManager.changeTool(SELECT_TOOLS.LINE);
  }

  ellipse(): void {
    this.currentShape = SELECT_TOOLS.ELLIPSE;
    this.toolManager.selectTool(this.currentShape);
    this.setDrawType(SELECT_DRAWING_TYPE.BORDER_FILL);
    this.setWidth(BASE_WIDTH);
    this.toolManager.changeTool(SELECT_TOOLS.ELLIPSE);
  }

  polygone(): void {
    this.currentShape = SELECT_TOOLS.POLYGONE;
    this.toolManager.selectTool(this.currentShape);
    this.setDrawType(SELECT_DRAWING_TYPE.BORDER_FILL);
    this.setWidth(BASE_WIDTH);
    this.setNbSide('3');
    this.toolManager.changeTool(SELECT_TOOLS.POLYGONE);
  }

}
