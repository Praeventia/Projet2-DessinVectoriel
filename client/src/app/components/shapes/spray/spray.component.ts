import { Component} from '@angular/core';
import { ShapeComponent } from '../shape/shape.component';

@Component({
  selector: 'app-spray',
  templateUrl: './spray.component.html',
  styleUrls: ['./../shape/shape.component.scss']
})

export class SprayComponent extends ShapeComponent {

  constructor() {
    super();
  }

}
