import { Injectable } from '@angular/core';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_FILTER_TYPE } from '../enum/filters';
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { ImageTransformationService } from '../image-transformation/image-transformation.service';
import { Coordinate } from '../interfaces/coordinate';
import { Tool } from './tool.service';

const LINEWIDTH = 5;
const PRECISION = 2;
const DIF_MAX = 7.65;

@Injectable({
  providedIn: 'root'
})
export class PixelFillToolService extends Tool {

  image: HTMLImageElement;
  old: HTMLImageElement;
  color: number[];
  canvas: HTMLCanvasElement;
  hash: Set<string>;
  context: CanvasRenderingContext2D;

  constructor(public imageTransformation: ImageTransformationService) {super(); this.coordinates = []; this.hash = new Set(); }

  start( drawingArea: DrawingAreaComponent): void {
    this.image = this.imageTransformation.svgToImage(drawingArea.getSvgNodesString(),
      drawingArea.backgroundColor,
      drawingArea.screenHeight, drawingArea.screenWidth, SELECT_FILTER_TYPE.NONE);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.old = this.image;
  }

  onMouseClick(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    this.image = this.imageTransformation.svgToImage(drawingArea.getSvgNodesString(),
      drawingArea.backgroundColor,
      drawingArea.screenHeight, drawingArea.screenWidth, SELECT_FILTER_TYPE.NONE);

    this.image.onload = () => {

      this.context = this.canvas.getContext('2d', {static: false}) as CanvasRenderingContext2D;
      this.context.drawImage(this.image, 0, 0);

      this.color = this.getColor(coordinate);

      ShapeDescription.lineWidth = LINEWIDTH;
      drawingArea.getShape().shapeType = SELECT_SHAPE_TYPE.PENCIL;
      drawingArea.getShape().update();

      this.coordinates.push(coordinate);

      while (this.coordinates.length > 0) {
        this.addPixel(this.coordinates[this.coordinates.length - 1], drawingArea);
      }

      drawingArea.saveShape();

      this.old = this.image;

      this.hash.clear();

    };

  }

  addPixel(coordinate: Coordinate, drawingArea: DrawingAreaComponent): void {

    drawingArea.getShape().coordinates.push(coordinate);
    this.hash.add(coordinate.x + '-' + coordinate.y);

    const left = {x: coordinate.x - PRECISION, y: coordinate.y};
    const rigth = {x: coordinate.x + PRECISION, y: coordinate.y};
    const up = {x: coordinate.x, y: coordinate.y - PRECISION};
    const down = {x: coordinate.x, y: coordinate.y + PRECISION};

    this.coordinates.pop();

    if (this.accept(left, drawingArea) ) { this.coordinates.push(left); }
    if (this.accept(rigth, drawingArea) ) { this.coordinates.push(rigth); }
    if (this.accept(up, drawingArea) ) { this.coordinates.push(up); }
    if (this.accept(down, drawingArea) ) { this.coordinates.push(down); }

  }

  accept(coordinate: Coordinate, drawingArea: DrawingAreaComponent): boolean {

    if (this.image.width < coordinate.x || coordinate.x < 0) { return false; }

    if (this.image.height < coordinate.y || coordinate.y < 0) { return false; }

    if (this.hash.has(coordinate.x + '-' + coordinate.y)) { return false; }

    return this.isTolered(this.getColor(coordinate));

  }

  getColor(coordinate: Coordinate): number[] {

    const data = this.context.getImageData(coordinate.x - 1, coordinate.y - 1, 1, 1).data;
    return [data[0], data[1], data[2]];

  }

  isTolered(color: number[]): boolean {
    let differnce = 0;
    for (let i = 0; i < color.length; i++) {
      differnce += Math.abs(color[i] - this.color[i]);
    }

    differnce = differnce / (DIF_MAX);

    return differnce <= ShapeDescription.frequency;
  }

}
