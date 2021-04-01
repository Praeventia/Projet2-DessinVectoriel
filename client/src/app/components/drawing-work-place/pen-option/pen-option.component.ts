import { Component } from '@angular/core';
import { faAngleDown, faBrush, faEraser,
  faPenNib, faSprayCan, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_TOOLS } from 'src/app/services/enum/select-tool';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';

const INIT_WIDTH = 10;
const INIT_FREQUENCY = 50;
const INIT_ERASE = 3;

@Component({
  selector: 'app-pen-option',
  templateUrl: './pen-option.component.html',
  styleUrls: ['../drawing-view-ux/drawing-view-ux.component.scss']
})
export class PenOptionComponent {

  protected currentTool: SELECT_TOOLS;
  protected width: number;
  protected frequency: number;

  protected faSprayCan: IconDefinition = faSprayCan;
  protected faEraser: IconDefinition = faEraser;
  protected faPenNib: IconDefinition = faPenNib;
  protected faBrush: IconDefinition = faBrush;
  protected faAngleDown: IconDefinition = faAngleDown;

  constructor(protected toolManager: ToolManagerService) {
    this.width = INIT_WIDTH;
    this.frequency = INIT_FREQUENCY;
    this.pen();
  }

  setWidth(width: number): void {
    this.width = width;
    ShapeDescription.lineWidth = width;
  }

  setFrequency(frequency: number): void {
    this.frequency = frequency;
    ShapeDescription.frequency = frequency;
  }

  setTexture(value: number): void {
    ShapeDescription.texture = value;
  }

  pen(): void {
    this.currentTool = SELECT_TOOLS.PENCIL;
    this.toolManager.selectTool(SELECT_TOOLS.BRUSH);
    this.setTexture(0);
    this.setWidth(INIT_WIDTH);
    this.toolManager.changeTool(SELECT_TOOLS.BRUSH);
  }

  brush(): void {
    this.currentTool = SELECT_TOOLS.BRUSH;
    this.toolManager.selectTool(SELECT_TOOLS.BRUSH);
    this.setTexture(1);
    this.setWidth(INIT_WIDTH);
    this.toolManager.changeTool(SELECT_TOOLS.BRUSH);
  }

  spray(): void {
    this.currentTool = SELECT_TOOLS.SPRAY;
    this.toolManager.selectTool(SELECT_TOOLS.SPRAY);
    this.setFrequency(INIT_FREQUENCY);
    this.setWidth(INIT_WIDTH);
    this.toolManager.changeTool(SELECT_TOOLS.SPRAY);
  }

  eraser(): void {
    this.currentTool = SELECT_TOOLS.ERASE;
    this.toolManager.selectTool(SELECT_TOOLS.ERASE);
    this.setWidth(INIT_ERASE);
    this.toolManager.changeTool(SELECT_TOOLS.ERASE);
  }

}
