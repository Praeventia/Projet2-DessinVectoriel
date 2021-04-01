import { Component} from '@angular/core';
import { SELECT_DRAWING_TYPE } from '../../../services/enum/drawing-type';
import { ShapeComponent } from '../shape/shape.component';

@Component({
  selector: 'app-ellipse',
  templateUrl: './ellipse.component.html',
  styleUrls: ['./../shape/shape.component.scss']
})

export class EllipseComponent extends ShapeComponent {

  constructor() {
    super();
  }

  getLineWidth(): number {

    if (this.description.drawType === SELECT_DRAWING_TYPE.BORDER
      || this.description.drawType === SELECT_DRAWING_TYPE.BORDER_FILL) {
        return this.description.lineWidth;
    } else {
      return 0;
    }

  }

  getFill(): string {
    if (this.description.drawType === SELECT_DRAWING_TYPE.FILL
      || this.description.drawType === SELECT_DRAWING_TYPE.BORDER_FILL) {
        return this.description.fillColor;
    } else {
      return 'none';
    }
  }

}
