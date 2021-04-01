import { Component } from '@angular/core';
import { faBrush, faEraser, faEyeDropper, faFeatherAlt, faFillDrip, faOilCan,
   faPenNib, faSprayCan, faStamp, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ShapeDescription } from '../../../classes/shape-description';
import { SELECT_TOOLS } from '../../../services/enum/select-tool';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';

const INIT_WIDTH = 10;
const INIT_FREQUENCY = 50;
const INIT_ERASE = 3;

@Component({
  selector: 'app-drawing-view-tool-box',
  templateUrl: './drawing-view-tool-box.component.html',
  styleUrls: ['./drawing-view-tool-box.component.scss']
})

export class DrawingViewToolBoxComponent  {

  /*Icons*/
  protected faStamp: IconDefinition = faStamp;
  protected faFeatherAlt: IconDefinition = faFeatherAlt;
  protected faEyeDropper: IconDefinition = faEyeDropper;
  protected faSprayCan: IconDefinition = faSprayCan;
  protected faFillDrip: IconDefinition = faFillDrip;
  protected faEraser: IconDefinition = faEraser;
  protected faPenNib: IconDefinition = faPenNib;
  protected faBrush: IconDefinition = faBrush;
  protected faOilCan: IconDefinition = faOilCan;

  protected currentTool: number;
  protected frequency: number;
  protected inputWidthValue: number;

  constructor( private toolManager: ToolManagerService) {
    this.currentTool = SELECT_TOOLS.NONE;
    this.frequency = 0;
    this.inputWidthValue = 0;
    this.toolManager.getEmittedTool().subscribe((item: number) => this.currentTool = item );
  }

  setWidthValue(value: number): void {
    this.inputWidthValue = value;
    ShapeDescription.lineWidth = value;
  }

  setTexture(value: number): void {
    ShapeDescription.texture = value;
  }

  setFrequency(value: number): void {
    this.frequency = value;
    ShapeDescription.frequency = value;
  }

  drawPen(): void {
    this.currentTool = SELECT_TOOLS.PENCIL;
    this.toolManager.selectTool(this.currentTool);
    this.setTexture(0);
    this.setWidthValue(1);
    this.toolManager.changeTool(SELECT_TOOLS.PENCIL);
  }

  brush(): void {
    this.currentTool = SELECT_TOOLS.BRUSH;
    this.toolManager.selectTool(this.currentTool);
    this.setTexture(1);
    this.setWidthValue(1);
    this.toolManager.changeTool(SELECT_TOOLS.BRUSH);
  }

  erase(): void {
    this.currentTool = SELECT_TOOLS.ERASE;
    this.toolManager.selectTool(this.currentTool);
    this.setWidthValue(INIT_ERASE);
    this.toolManager.changeTool(SELECT_TOOLS.ERASE);
  }

  fill(): void {
    this.currentTool = SELECT_TOOLS.FILL;
    this.toolManager.selectTool(this.currentTool);
    this.toolManager.changeTool(SELECT_TOOLS.FILL);
  }

  dropper(): void {
    this.currentTool = SELECT_TOOLS.DROPPER;
    this.toolManager.selectTool(this.currentTool);
    this.toolManager.changeTool(SELECT_TOOLS.DROPPER);
  }

  spray(): void {
    this.currentTool = SELECT_TOOLS.SPRAY;
    this.toolManager.selectTool(this.currentTool);
    this.setWidthValue(INIT_WIDTH);
    this.setFrequency(INIT_FREQUENCY);
    this.toolManager.changeTool(SELECT_TOOLS.SPRAY);
  }

  feather(): void {
    this.currentTool = SELECT_TOOLS.FEATHER;
  }

  stamp(): void {
    this.currentTool = SELECT_TOOLS.STAMP;
  }

  bucket(): void {
    this.currentTool = SELECT_TOOLS.BUCKET;
    this.toolManager.selectTool(this.currentTool);
    this.setFrequency(0);
  }

}
