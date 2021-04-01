import { Component } from '@angular/core';
import { faExchangeAlt, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { ColorService } from '../../../services/color-service/color.service';

interface Color {
  r: number;
  g: number;
  b: number;
}

const SLOT_NUMBER = 10;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})

export class ColorPickerComponent {

  protected faExchangeAlt: IconDefinition = faExchangeAlt;
  previousColors: Color[] = [];

  constructor(private colorService: ColorService) {
    for (let i = 0; i < SLOT_NUMBER; i++) {
      this.previousColors.push({r: 0, g: 0, b: 0});
    }
  }

  getRGB(index: number): string {
    return 'rgb(' +
    this.previousColors[index].r + ',' +
    this.previousColors[index].g + ',' +
    this.previousColors[index].b + ')';
  }

  pickPrimary(): void {
    this.colorService.pickPrimary();
  }

  pickSecondary(): void {
    this.colorService.pickSecondary();
  }

  switchColor(): void {
    this.colorService.switchColor();
  }

  switchOldColor(left: boolean, pos: number): boolean {
    this.colorService.switchOldColor(left, pos);
    return left;
  }

}
