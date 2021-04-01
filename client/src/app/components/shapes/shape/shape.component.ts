import { Component, Input} from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { SELECT_SHAPE_TYPE } from 'src/app/services/enum/shape-type';

const RED = 'rgb(255,0,0)';
const DARK_RED = 'rgb(200,0,0)';

const MAX_COLOR = 223;
const MIN_COLOR = 32;

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.scss']
})

export class ShapeComponent {

  @Input() description: ShapeDescription;

  paint(left: boolean): boolean {

    if (this.description.modificaton.shapeType === SELECT_SHAPE_TYPE.FILL) {

      this.description.modificaton.modifications.push([this.description, this.description.fillColor, this.description.strokeColor]);

      if (left && this.description.drawType !== SELECT_DRAWING_TYPE.BORDER ) {
        this.description.updateFill();
      } else if (!left) {
        this.description.updateStroke();
      }

    }

    return left;

  }

  isRed(): boolean {
    return this.description.isRed;
  }

  getRed(): string {

    let red: number;
    let green: number;
    let blue: number;

    let temp: string;

    if (this.description.drawType === SELECT_DRAWING_TYPE.BORDER
     || this.description.drawType === SELECT_DRAWING_TYPE.BORDER_FILL) {
      temp = this.description.strokeColor;
    } else {
      temp = this.description.fillColor;
    }

    // tslint:disable: radix
    temp = temp.slice(temp.indexOf('(') + 1);
    red = parseInt(temp.slice(0, temp.indexOf(',')));
    temp = temp.slice(temp.indexOf(',') + 1);
    green = parseInt(temp.slice(0, temp.indexOf(',')));
    temp = temp.slice(temp.indexOf(',') + 1);
    blue = parseInt(temp.slice(0, temp.indexOf(',')));

    if (red > MAX_COLOR && green < MIN_COLOR && blue < MIN_COLOR) {
      return DARK_RED;
    } else {
      return RED;
    }

  }

  isErase(): boolean {
    if (this.description.modificaton) {
      return this.description.modificaton.shapeType === SELECT_SHAPE_TYPE.ERASER;
    } else { return false; }
  }

  over(): void {
    this.description.isRed = true;
  }

  leave(): void {
    this.description.isRed = false;
  }

  isVisible(): boolean {
    if (!this.description) {
      return false;
    } else if (this.description.fillColor === 'none' && this.description.strokeColor === 'none') {
      return false;
    } else {
      return true;
    }
  }

  getEtra(): number {
    return this.description.modificaton.lineWidth;
  }

  getEvent(): string {
    if (this.description.drawType === SELECT_DRAWING_TYPE.BORDER) {
      return 'stroke';
    } else if (this.description.drawType === SELECT_DRAWING_TYPE.FILL) {
      return 'fill';
    } else {
      return 'all';
    }
  }

  shapeIsClicked(): void {
    this.description.shapeClicked = true;
  }

}
