import { Injectable } from '@angular/core';
import { AutoSavedDrawing } from '../../../../../common/communication/auto-saved-drawing';

@Injectable({
    providedIn: 'root'
})

export class AutoSaveService {

    private readonly BGCOLOR: string = 'backgroundColor';
    private readonly WIDTH: string = 'width';
    private readonly HEIGHT: string = 'height';
    private readonly SHAPES: string = 'shapeStack';

    private readonly BASE_10: number = 10;

    isEmpty(): boolean {
        const backgroundColor = localStorage.getItem(this.BGCOLOR);
        return backgroundColor === null || backgroundColor === '';
    }

    private getBackgroundColor(): string {
        const backgroundColor = localStorage.getItem(this.BGCOLOR);
        return backgroundColor === null ? '' : backgroundColor;
    }

    saveBackgroundColor(backgroundColor: string): void {
        localStorage.setItem(this.BGCOLOR, backgroundColor);
    }

    private getWidth(): number {
        const width = localStorage.getItem(this.WIDTH);
        return width === null ? 0 : parseInt(width, this.BASE_10);
    }

    saveWidth(width: number): void {
        localStorage.setItem(this.WIDTH, width.toString());
    }

    private getHeight(): number {
        const height = localStorage.getItem(this.HEIGHT);
        return height === null ? 0 : parseInt(height, this.BASE_10);
    }

    saveHeight(height: number): void {
        localStorage.setItem(this.HEIGHT, height.toString());
    }

    private getShapes(): string {
        const shapes = localStorage.getItem(this.SHAPES);
        return shapes === null ? '' : shapes;
    }

    saveShapes(shapes: string): void {
        localStorage.setItem(this.SHAPES, shapes);
    }

    getAutoSavedDrawing(): AutoSavedDrawing {
        const drawing: AutoSavedDrawing = {
            backgroundColor: this.getBackgroundColor(),
            width: this.getWidth(),
            height: this.getHeight(),
            shapes: this.getShapes()
        };
        return drawing;
    }

    autoSaveDrawing(drawing: AutoSavedDrawing): void {
        this.saveBackgroundColor(drawing.backgroundColor);
        this.saveWidth(drawing.width);
        this.saveHeight(drawing.height);
        this.saveShapes(drawing.shapes);
    }

}
