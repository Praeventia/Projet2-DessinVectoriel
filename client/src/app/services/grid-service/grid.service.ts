import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class GridService {

  @Output() gridSize: EventEmitter<number> = new EventEmitter();
  @Output() opacity: EventEmitter<number> = new EventEmitter();
  @Output() gridToggle: EventEmitter<boolean> = new EventEmitter();
  @Output() selectionFillToggle: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.changeSelectionFillToggle(false);
  }

  changeGridSize(size: number): void {
    this.gridSize.emit(size);
  }

  changeGridOpacity(opacity: number): void {
    this.opacity.emit(opacity);
  }

  changeGridToggle(option: boolean): void {
    this.gridToggle.emit(option);
  }

  changeSelectionFillToggle(option: boolean): void {
    this.selectionFillToggle.emit(option);
  }

  getEmittedValueGridSize(): EventEmitter<number> {
    return this.gridSize;
  }

  getEmittedValueOpacity(): EventEmitter<number> {
    return this.opacity;
  }

  getEmittedValueGridToggle(): EventEmitter<boolean> {
    return this.gridToggle;
  }

  getEmittedValueSelectionFillToggle(): EventEmitter<boolean> {
    return this.selectionFillToggle;
  }
}
