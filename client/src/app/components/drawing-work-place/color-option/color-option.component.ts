import { Component } from '@angular/core';
import { faBurn, faEyeDropper, faFillDrip, faPaintRoller, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ColorService } from 'src/app/services/color-service/color.service';
import { SELECT_TOOLS } from 'src/app/services/enum/select-tool';
import { InteractionFormDrawingService } from 'src/app/services/interaction-form-drawing/interaction-form-drawing.service';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';

@Component({
  selector: 'app-color-option',
  templateUrl: './color-option.component.html',
  styleUrls: ['../drawing-view-ux/drawing-view-ux.component.scss']
})
export class ColorOptionComponent {

  currentTool: SELECT_TOOLS;
  frequency: number;

  protected faPaintRoller: IconDefinition = faPaintRoller;
  protected faEyeDropper: IconDefinition = faEyeDropper;
  protected faFillDrip: IconDefinition = faFillDrip;
  protected faBurn: IconDefinition = faBurn;

  constructor(private color: ColorService,
              public interactionService: InteractionFormDrawingService,
              private toolManager: ToolManagerService) {
    this.frequency = 0;
    this.dropper();
  }

  setFrequency(frequency: number): void {
    this.frequency = frequency;
    ShapeDescription.frequency = frequency;
  }

  setBackgroundcolor(): void {
    this.interactionService.sendBackgroundColor(this.color.getPrimaryColor());
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

  bucket(): void {
    this.currentTool = SELECT_TOOLS.BUCKET;
    this.toolManager.selectTool(this.currentTool);
    ShapeDescription.texture = 0;
    this.setFrequency(0);
  }

}
