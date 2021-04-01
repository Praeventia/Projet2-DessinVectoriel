import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ColorService } from '../../services/color-service/color.service';
import { InteractionFormDrawingService } from '../../services/interaction-form-drawing/interaction-form-drawing.service';

const MAX_VALUE = 10000;
const PADDING = 300;
const MARGIN = 10;

@Component({
  selector: 'app-new-draw-form',
  templateUrl: './new-draw-form.component.html',
  styleUrls: ['./new-draw-form.component.scss']
})

export class NewDrawFormComponent implements OnInit {

  screenHeight: number;
  screenWidth: number;

  toggleChange: boolean;
  toggleCreate: boolean;

  dimensionChange: boolean; // false = width, true = height

  constructor(public dialogRef: MatDialogRef<NewDrawFormComponent>,
              // Can't be a specific value since it can have many attributes
              // tslint:disable-next-line: no-any
              @Inject(MAT_DIALOG_DATA) public data: any,
              private interactionService: InteractionFormDrawingService,
              private colorService: ColorService,
              private router: Router) {
                this.toggleChange = false;
                this.toggleCreate = true;
               }

  ngOnInit(): void {
    this.screenHeight = window.innerHeight - MARGIN;
    this.screenWidth = window.innerWidth - PADDING - MARGIN;

    this.colorService.setColor(true, 'rgba(255, 255, 255, 1)', 1);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize($event?: number): void {
    if (!this.toggleChange) {
      this.screenHeight = window.innerHeight - MARGIN;
      this.screenWidth = window.innerWidth - MARGIN - PADDING;
    }
  }

  @HostListener('input', ['$event'])
  changeDrawingSize($event?: number): void {
    this.toggleChange = true;
  }

  verifyInput(dimensionChoice: boolean, value: string): number {

    let numberValue: number;

    // we don't use the radix here
    // tslint:disable-next-line: radix
    numberValue = parseInt(value);
    if (isNaN(numberValue)) { numberValue = 0; }

    numberValue = Math.floor(numberValue);

    numberValue = Math.max(0, numberValue);
    numberValue = Math.min(MAX_VALUE, numberValue);

    if (!dimensionChoice) { this.screenWidth = numberValue; }
    if (dimensionChoice) { this.screenHeight = numberValue; }

    return numberValue;
  }

  goToDrawingWorkPlace(): void {
    this.interactionService.loadNewDrawing(this.colorService.getPrimaryColor(), this.screenWidth, this.screenHeight);
    this.toggleChange = false;
    this.router.navigateByUrl('/dessin');
  }

  newColor(): void {
    this.colorService.pickPrimary();
  }
}
