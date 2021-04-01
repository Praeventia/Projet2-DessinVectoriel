import { Component, OnInit } from '@angular/core';
import { ShapeComponent } from '../shape/shape.component';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./../shape/shape.component.scss']
})

export class PencilComponent extends ShapeComponent implements OnInit {

  filter: string;
  constructor() {
    super();
    this.filter = 'pencilPattern';
  }

  ngOnInit(): void {
    // Not a magic number, but an enum based on the choice
    // tslint:disable: no-magic-numbers
    if (this.description) {
    switch (this.description.texture) {
      case 1: this.filter = 'url(#pattern1)';
              break;
      case 2: this.filter = 'url(#pattern2)';
              break;
      case 3: this.filter = 'url(#pattern3)';
              break;
      case 4: this.filter = 'url(#pattern4)';
              break;
      case 5: this.filter = 'url(#pattern5)';
              break;
              default: this.filter = '';
    }}
  }

  coordinatesToString(): string {
    let points = '';
    // We need the x value and the y value to create a specfic string
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.description.coordinates.length; i++) {
      points = points.concat(this.description.coordinates[i].x.toString(), ',', this.description.coordinates[i].y.toString(), ' ');
    }
    return points;
  }

}
