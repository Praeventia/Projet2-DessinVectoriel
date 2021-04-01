import { Component, Input } from '@angular/core';
import { faBorderAll, faBorderStyle, faClone, faCopy,
  faCut, faPaste, faTrash, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { SELECT_TOOLS } from 'src/app/services/enum/select-tool';
import { GridService } from 'src/app/services/grid-service/grid.service';
import { SelectMovementService } from 'src/app/services/select-movement/select-movement.service';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';

const MAX_GRID_SIZE = 750;
const INIT_SIZE = 5;
const INIT_OPACITY = 80;
const MULT_5 = 5;
const NEXT_MULT_5 = 4;
const NUMBER_TO_PERCENTAGE = 100;

@Component({
  selector: 'app-selection-option',
  templateUrl: './selection-option.component.html',
  styleUrls: ['../drawing-view-ux/drawing-view-ux.component.scss']
})
export class SelectionOptionComponent {

  @Input() drawingArea: DrawingAreaComponent;

  protected shapeStackIsEmpty: boolean;
  protected currentTool: SELECT_TOOLS;
  protected gridSize: number;
  protected opacity: number;
  protected gridToggle: boolean;
  protected isSelectionFilled: boolean;

  protected faBorderStyle: IconDefinition = faBorderStyle;
  protected faCopy: IconDefinition = faCopy;
  protected faCut: IconDefinition = faCut;
  protected faPaste: IconDefinition = faPaste;
  protected faClone: IconDefinition = faClone;
  protected faTrash: IconDefinition = faTrash;
  protected faBorderNone: IconDefinition = faBorderAll;

  constructor(private toolManager: ToolManagerService, private clipboard: ClipboardService,
              private selectionMovement: SelectMovementService, private gridService: GridService) {
                this.gridSize = INIT_SIZE;
                this.opacity = INIT_OPACITY;
                this.gridToggle = false;
                this.isSelectionFilled = false;
                this.selection();
                this.selectionMovement.getEmittedValueShapeStackEmpty().subscribe((item: boolean) => this.shapeStackIsEmpty = item );
               }

  copy(): void {
    this.currentTool = SELECT_TOOLS.SELECTION;

    if (!this.shapeStackIsEmpty) {
      this.clipboard.copy( this.drawingArea);
    }
  }

  cut(): void {
    this.currentTool = SELECT_TOOLS.SELECTION;

    if (!this.shapeStackIsEmpty) {
      this.clipboard.cut(this.drawingArea);
    }
  }

  delete(): void {
    this.currentTool = SELECT_TOOLS.SELECTION;

    if (!this.shapeStackIsEmpty) {
      this.clipboard.delete(this.drawingArea);
    }
  }

  paste(): void {
    this.currentTool = SELECT_TOOLS.SELECTION;

    this.clipboard.paste(this.drawingArea, this.toolManager.selectionTool);
  }

  duplicate(): void {
    this.currentTool = SELECT_TOOLS.SELECTION;
    this.clipboard.duplicate(this.drawingArea, this.toolManager.selectionTool);
  }

  grid(): void {
    this.currentTool = SELECT_TOOLS.GRID;
  }

  toggleSelectionFill(): void {
    this.isSelectionFilled = !this.isSelectionFilled;
    this.gridService.changeSelectionFillToggle(this.isSelectionFilled);
  }

  verifyInput( value: string): number {

    let numberValue: number;

    // We don't need the radix here
    // tslint:disable-next-line: radix
    numberValue = parseInt(value);
    if (isNaN(numberValue)) { numberValue = 0; }

    numberValue = Math.floor(numberValue);

    numberValue = Math.max(0, numberValue);
    numberValue = Math.min(MAX_GRID_SIZE, numberValue);

    this.gridSize = numberValue;
    this.gridService.changeGridSize(this.gridSize);

    return numberValue;
  }

  showGrid(): void {
    this.gridToggle = !this.gridToggle;
    this.gridService.changeGridToggle(this.gridToggle);
  }

  increaseGrid(): void {
    this.gridSize = Math.ceil((this.gridSize + NEXT_MULT_5) / MULT_5) * MULT_5;
    if ( this.gridSize >  MAX_GRID_SIZE) {this.gridSize = MAX_GRID_SIZE; }
    this.gridService.changeGridSize(this.gridSize);
  }

  decreaseGrid(): void {
    this.gridSize = Math.ceil((this.gridSize - MULT_5) / MULT_5) * MULT_5;
    if ( this.gridSize < 1 ) { this.gridSize = 1; }
    this.gridService.changeGridSize(this.gridSize);
  }

  setOpacity( opacity: number): void {
    this.opacity = opacity;
    this.gridService.changeGridOpacity(opacity / NUMBER_TO_PERCENTAGE);
  }

  selection(): void {
    this.currentTool = SELECT_TOOLS.SELECTION;
    this.toolManager.selectTool(SELECT_TOOLS.SELECTION);
    ShapeDescription.drawType = SELECT_DRAWING_TYPE.SELECTION;
    this.toolManager.changeTool(SELECT_TOOLS.SELECTION);
  }

}
