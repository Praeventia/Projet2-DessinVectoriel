import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShapeHandler } from 'src/app/classes/shape-handler';
import { AutoSavedDrawing } from '../../../../../common/communication/auto-saved-drawing';
import { Drawing } from '../../../../../common/communication/drawing';
import { AutoSaveService } from '../auto-save/auto-save.service';
import { ColorService } from '../color-service/color.service';

@Injectable({
  providedIn: 'root'
})

export class InteractionFormDrawingService {

  private width: BehaviorSubject<number> = new BehaviorSubject<number>(window.innerWidth);
  currentWidth: Observable<number> = this.width.asObservable();

  private height: BehaviorSubject<number> = new BehaviorSubject<number>(window.innerHeight);
  currentHeight: Observable<number> = this.height.asObservable();

  private backgroundColor: BehaviorSubject<string> = new BehaviorSubject<string>(this.colorService.getPrimaryColor());
  currentBackgroundColor: Observable<string> = this.backgroundColor.asObservable();

  private shapeStack: BehaviorSubject<ShapeHandler[]> = new BehaviorSubject<ShapeHandler[]>([]);
  currentShapeStack: Observable<ShapeHandler[]> = this.shapeStack.asObservable();

  constructor(private colorService: ColorService, private autoSaveService: AutoSaveService) {
    if (this.canLoadAutoSavedDrawing()) {
      this.loadAutoSavedDrawing();
    }
  }

  sendWidth(width: number): void {
    this.width.next(width);
    this.autoSaveService.saveWidth(width);
  }

  sendHeight(height: number): void {
    this.height.next(height);
    this.autoSaveService.saveHeight(height);
  }

  sendBackgroundColor(color: string): void {
    this.backgroundColor.next(color);
    this.autoSaveService.saveBackgroundColor(color);
  }

  sendShapeStack(stack: ShapeHandler[]): void {
    this.shapeStack.next(stack);
  }

  saveShape(stack: ShapeHandler[]): void {
    this.autoSaveService.saveShapes(JSON.stringify(stack));
  }

  isShapeStackEmpty(): boolean {
    return this.shapeStack.value.length <= 1;
  }

  loadDrawingFromServer(drawing: Drawing): void {
    this.sendBackgroundColor(drawing.backgroundColor);
    this.sendWidth(drawing.width);
    this.sendHeight(drawing.height);
    this.sendShapeStack(JSON.parse(drawing.shapes));
    this.saveShape(JSON.parse(drawing.shapes));
  }

  loadNewDrawing(backgroundColor: string, width: number, height: number): void {
    this.sendBackgroundColor(backgroundColor);
    this.sendWidth(width);
    this.sendHeight(height);
    this.sendShapeStack([]);
    this.saveShape([]);
  }

  canLoadAutoSavedDrawing(): boolean {
    return !this.autoSaveService.isEmpty();
  }

  loadAutoSavedDrawing(): void {
    const drawing: AutoSavedDrawing = this.autoSaveService.getAutoSavedDrawing();
    this.sendBackgroundColor(drawing.backgroundColor);
    this.sendWidth(drawing.width);
    this.sendHeight(drawing.height);
    if (drawing.shapes === '') {
      this.sendShapeStack([]);
      this.saveShape([]);
    } else {
      this.sendShapeStack(JSON.parse(drawing.shapes));
      this.saveShape(JSON.parse(drawing.shapes));
    }
  }

}
