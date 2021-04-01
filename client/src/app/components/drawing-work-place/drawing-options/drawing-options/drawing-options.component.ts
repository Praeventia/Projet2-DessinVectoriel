import { Component} from '@angular/core';
import { GridService } from 'src/app/services/grid-service/grid.service';

const MAX_GRID_SIZE = 750;
const INIT_SIZE = 5;
const INIT_OPACITY = 80;
const MULT_5 = 5;
const NEXT_MULT_5 = 4;
const NUMBER_TO_PERCENTAGE = 100;

@Component({
  selector: 'app-drawing-options',
  templateUrl: './drawing-options.component.html',
  styleUrls: ['./drawing-options.component.scss']
})
export class DrawingOptionsComponent {

  gridSize: number;
  opacity: number;
  gridToggle: boolean;
  isSelectionFilled: boolean;

  constructor(private gridService: GridService) {

    this.gridSize = INIT_SIZE;
    this.opacity = INIT_OPACITY;
    this.gridToggle = false;
    this.isSelectionFilled = false;
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

}
