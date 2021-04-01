import { Injectable } from '@angular/core';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { ColorService } from '../color-service/color.service';
import { SELECT_FILTER_TYPE } from '../enum/filters';
import { ImageTransformationService } from '../image-transformation/image-transformation.service';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from './tool.service';

const RED = 0;
const GREEN = 1;
const BLUE = 2;
const OPACITY = 3;
const MAX_OPACITY = 255;

@Injectable({
  providedIn: 'root'
})

export class DropperToolService extends Tool {

  private image: HTMLImageElement;

  constructor(private imageTransformation: ImageTransformationService, private colorService: ColorService) { super(); }

  start( drawingArea: DrawingAreaComponent): void {
    this.image = this.imageTransformation.svgToImage(drawingArea.getSvgNodesString(), drawingArea.backgroundColor,
      drawingArea.screenHeight, drawingArea.screenWidth, SELECT_FILTER_TYPE.NONE);
  }

  onMouseClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    this.changeColor(coordinate, true);
  }

  onRightClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {
    this.changeColor(coordinate, false);
  }

  changeColor(coordinate: Coordinate, left: boolean): void {

    const canvas = document.createElement('canvas');
    canvas.width = this.image.width;
    canvas.height = this.image.height;
    const context: CanvasRenderingContext2D = canvas.getContext('2d', {static: false}) as CanvasRenderingContext2D;
    context.drawImage(this.image, 0, 0);
    const data = context.getImageData(coordinate.x, coordinate.y, 1, 1).data;

    let color = 'rgb(';
    color += data[RED] + ',';
    color += data[GREEN] + ',';
    color += data[BLUE] + ',1)';

    this.colorService.setColor(left, color, data[OPACITY] / MAX_OPACITY);

  }

}
