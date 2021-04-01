import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface Color {
  value: number;
  code: string;
}

const INIT_A_VALUE = 100;

// We are using hexadecimal and decimal value to determine the colors
// tslint:disable: no-magic-numbers

@Component({
  selector: 'app-color-maker',
  templateUrl: './color-maker.component.html',
  styleUrls: ['./color-maker.component.scss']
})
export class ColorMakerComponent implements OnInit {

  private aValue: number;

  red: Color = {value: 0, code: ''};
  green: Color = {value: 0, code: ''};
  blue: Color = {value: 0, code: ''};

  constructor(public dialogRef: MatDialogRef<ColorMakerComponent>,
              // Can't be a specific value since it can have many attributes
              // tslint:disable-next-line: no-any
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.aValue = INIT_A_VALUE;
              } // Should stay there to display correctly

  ngOnInit(): void {
    if (!this.data.color) { this.data.color = [0, 0, 0, 100]; }
    this.setValue(this.red, this.data.color[0]);
    this.setValue(this.green, this.data.color[1]);
    this.setValue(this.blue, this.data.color[2]);
    this.aValue = this.data.color[3];

  }

  setCode(color: Color, code: string): string {
    color.value = this.hexToValue(code);
    color.code = this.valueToHex(color.value);
    return color.code;
  }

  setValue(color: Color, value: number): void {
    color.value = value;
    color.code = this.valueToHex(value);
  }

  setA(value: number): void {
    if (isNaN(value)) { value = 100; }
    if (value > 100) { value = 100; }
    if (value < 0) { value = 0; }
    this.aValue = value;
  }

  getRGB(): string {
    return 'rgba(' + this.red.value + ',' + this.green.value + ',' + this.blue.value + ',1)';
  }

  getRGBA(): string {
    return 'rgba(' + this.red.value + ',' + this.green.value + ',' + this.blue.value + ',' + this.aValue / 100 + ')';
  }

  getOpacity(): number {
    return this.aValue / 100;
  }

  saveColor(): void {
    this.data.service.setColor(this.data.primary, this.getRGB(), this.aValue / 100);
  }

  valueToHex(value: number): string {

    if (value < 0) { value = 0; }
    if (value > 255) { value = 255; }

    return Math.floor(value).toString(16).toUpperCase();

  }

  hexToValue(code: string): number {

    let value = parseInt(code, 16);

    if (value < 0) { value = 0; }
    if (value > 255) { value = 255; }
    if (isNaN(value)) { value = 0; }

    return value;

  }

}
