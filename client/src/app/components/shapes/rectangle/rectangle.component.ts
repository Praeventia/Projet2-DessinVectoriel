import { Component} from '@angular/core';
import { GridService } from 'src/app/services/grid-service/grid.service';
import { SELECT_DRAWING_TYPE } from '../../../services/enum/drawing-type';
import { ShapeComponent } from '../shape/shape.component';

const SELECTION_FILL_COLOR = 'rgba(108,108,108,0.3)';
const SELECTION_BORDER_COLOR = 'rgba(108,108,108,1.0)';
const SELECTION_BORDER_WIDTH = 2;
const SELECTION_DASH = '4 3';
const RECTANGLE_DASH = '0 0';
const NO_COLOR = 'none';
const NO_BORDER = 0;

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./../shape/shape.component.scss']
})

export class RectangleComponent extends ShapeComponent {

  isSelectionFilled: boolean;

  constructor(private gridService: GridService) {
    super();
    this.gridService.getEmittedValueSelectionFillToggle().subscribe((item: boolean) => this.isSelectionFilled = item);
  }

  getLineWidth(): number {
    if (this.description.drawType === SELECT_DRAWING_TYPE.SELECTION) {
      return SELECTION_BORDER_WIDTH;
    } else if (this.description.drawType === SELECT_DRAWING_TYPE.FILL) {
      return NO_BORDER;
    } else {
      return this.description.lineWidth;
    }
  }

  getFill(): string {
    if (this.description.drawType === SELECT_DRAWING_TYPE.SELECTION && this.isSelectionFilled) {
      return SELECTION_FILL_COLOR;
    } else if (this.description.drawType === SELECT_DRAWING_TYPE.SELECTION && !this.isSelectionFilled) {
      return NO_COLOR;
    } else if (this.description.drawType === SELECT_DRAWING_TYPE.BORDER) {
      return NO_COLOR;
    } else {
      return this.description.fillColor;
    }
  }

  getStroke(): string {
    if (this.description.drawType === SELECT_DRAWING_TYPE.SELECTION) {
      return SELECTION_BORDER_COLOR;
    } else {
      return this.description.strokeColor;
    }
  }

  getDash(): string {
    if (this.description.drawType === SELECT_DRAWING_TYPE.SELECTION) {
      return SELECTION_DASH;
    }
    return RECTANGLE_DASH;
  }

}
