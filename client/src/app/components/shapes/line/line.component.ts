import { Component } from '@angular/core';
import { SELECT_DRAWING_TYPE } from '../../../services/enum/drawing-type';
import { ShapeComponent } from '../shape/shape.component';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./../shape/shape.component.scss']
})

export class LineComponent extends ShapeComponent {

  constructor() {
    super();
  }

  coordinatesToString(): string {

    let points = '';
    for (let i = 1; i < this.description.coordinates.length; i++) {
      points = points.concat(this.description.coordinates[i].x.toString(), ',', this.description.coordinates[i].y.toString(), ' ');
    }
    points = points.concat(this.description.coordinates[0].x.toString(), ',', this.description.coordinates[0].y.toString());

    return points;

  }

  getRadius(): number {
    if (this.description.drawType === SELECT_DRAWING_TYPE.DOT) {
      return this.description.dotRadius;
    } else {
      return 0;
    }
  }

}
