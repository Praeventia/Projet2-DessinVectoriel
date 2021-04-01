import { Component, Input } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./../shape/shape.component.scss']
})
export class EraserComponent {

  @Input() description: ShapeDescription;

}
