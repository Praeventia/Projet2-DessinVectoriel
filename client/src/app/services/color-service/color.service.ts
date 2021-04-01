import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ColorMakerComponent } from '../../components/color/color-maker/color-maker.component';

const NUMBER_COLOR = 10;
const PIMARY_COLOR = 10;
const SECONDARY_COLOR = 11;
const A_VALUE = 3;
const NUMBER_TO_PERCENTAGE = 100;

@Injectable({
  providedIn: 'root'
})

export class ColorService {

  private primary: string ;
  private primOpacity: number;
  private secondary: string;
  private secOpacity: number;

  previousColors: string[] = [];

  constructor(public dialog: MatDialog) {
    this.primary = 'rgba(255,255,255,1)';
    ShapeDescription.fillColor = this.primary;
    this.secondary = 'rgba(0,0,0,1)';
    ShapeDescription.strokeColor = this.secondary;
    this.primOpacity = 1;
    this.secOpacity = 1;

    for (let i = 0; i < NUMBER_COLOR; i++) {
      this.previousColors[i] = 'rgba(0,0,0,1)';
    }
  }

  reset(): void {
    this.primary = 'rgba(255,255,255,1)';
    this.secondary = 'rgba(0,0,0,1)';
    this.primOpacity = 1;
    this.secOpacity = 1;

    for (let i = 0; i < NUMBER_COLOR; i++) {
      this.previousColors[i] = 'none';
    }
  }

  pickPrimary(): void {
    this.dialog.open(ColorMakerComponent, {
          width: '525px',
          height: '215px',
          data: {
            service: this,
            primary: true,
            color: this.colorToValues(true)}
      });
  }

  pickSecondary(): void {
    this.dialog.open(ColorMakerComponent, {
          width: '525px',
          height: '215px',
          data: {
            service: this,
            primary: false,
            color: this.colorToValues(false)}
      });
  }

  getColor(pos: number): string {
    if (pos === PIMARY_COLOR) { return this.primary; }
    if (pos === SECONDARY_COLOR) { return this.secondary; }
    return this.previousColors[pos];
  }

  getPrimaryColor(): string {
    return this.primary;
  }

  getRGBA(primary: boolean): string {
    let temp = primary ? this.primary : this.secondary;
    temp =
      temp.slice(0, temp.length - A_VALUE) +
      ',' + (primary ? this.primOpacity : this.secOpacity) +
      temp.slice(temp.length - 1);

    return temp;
  }

  setColor(primary: boolean, color: string, opacity: number): void {
    let temp: string;
    let colorChanged: boolean;

    if (primary) {
      colorChanged = this.primary !== color;
      temp = this.primary;
      this.primary = color;
      this.primOpacity = opacity;
      ShapeDescription.fillColor = this.getRGBA(true);
    } else {
      colorChanged = this.secondary !== color;
      temp = this.secondary;
      this.secondary = color;
      this.secOpacity = opacity;
      ShapeDescription.strokeColor = this.getRGBA(false);
    }
    if (colorChanged) {
      for (let i = 10; i > 0; i--) {
        this.previousColors[i] = this.previousColors[i - 1];
      }
      this.previousColors[0] = temp;
    }

  }

  switchColor(): void {
    const temp = this.primary;
    this.primary = this.secondary;
    this.secondary = temp;

    ShapeDescription.fillColor = this.primary;
    ShapeDescription.strokeColor = this.secondary;
  }

  switchOldColor(primary: boolean, pos: number): void {
    this.setColor(primary, this.previousColors[pos], 1);
  }

  colorToValues(primary: boolean): number[] {

    const values = [];
    let temp = primary ? this.primary : this.secondary;

    // tslint:disable: radix
    temp = temp.slice(temp.indexOf('(') + 1);
    values[0] = parseInt(temp.slice(0, temp.indexOf(',')));
    temp = temp.slice(temp.indexOf(',') + 1);
    values[1] = parseInt(temp.slice(0, temp.indexOf(',')));
    temp = temp.slice(temp.indexOf(',') + 1);
    values[2] = parseInt(temp.slice(0, temp.indexOf(',')));

    values[A_VALUE] = primary ? this.primOpacity * NUMBER_TO_PERCENTAGE : this.secOpacity * NUMBER_TO_PERCENTAGE;

    return values;
  }

}
