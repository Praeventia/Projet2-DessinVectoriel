import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, MatDialog } from '@angular/material';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { EllipseComponent } from 'src/app/components/shapes/ellipse/ellipse.component';
import { EraserComponent } from 'src/app/components/shapes/eraser/eraser.component';
import { LineComponent } from 'src/app/components/shapes/line/line.component';
import { PencilComponent } from 'src/app/components/shapes/pencil/pencil.component';
import { PolygonComponent } from 'src/app/components/shapes/polygon/polygon.component';
import { RectangleComponent } from 'src/app/components/shapes/rectangle/rectangle.component';
import { SprayComponent } from 'src/app/components/shapes/spray/spray.component';
import { SELECT_FILE_TYPE } from '../enum/file-type';
import { SELECT_FILTER_TYPE } from '../enum/filters';
import { GridService } from '../grid-service/grid.service';
import { ImageTransformationService } from './image-transformation.service';

describe('ImageTransformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations : [DrawingAreaComponent, PolygonComponent,
                    PencilComponent, RectangleComponent,
                    EllipseComponent, SprayComponent,
                    LineComponent, EraserComponent, GridComponent],
    providers: [DrawingAreaComponent, MatDialog, Overlay, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER, GridService]
  }));

  it('should be created', () => {
    const service: ImageTransformationService = TestBed.get(ImageTransformationService);
    expect(service).toBeTruthy();
  });

  it('svgToImage should return a valid image', () => {
    const service: ImageTransformationService = TestBed.get(ImageTransformationService);
    // tslint:disable-next-line: max-line-length
    const svgNodes = '<filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern1" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.60" result="p1" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p1" scale="35" xChannelSelector="R" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern2" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.08" result="p2" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p2" scale="38" xChannelSelector="R" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern3" primitiveUnits="userSpaceOnUse"><feGaussianBlur _ngcontent-oou-c11="" in="SourceGraphic" stdDeviation="6"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern4" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.93 0.01" result="p4" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p4" scale="45" xChannelSelector="R" yChannelSelector="G"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern5" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.05 0.95" result="p5" seed="4" type="fractalNoise"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p5" scale="20" xChannelSelector="G" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern6" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.60" result="turbulence" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="turbulence" scale="35" xChannelSelector="R" yChannelSelector="B"/></filter><!--bindings={  "ng-reflect-ng-if": "false"}--><polyline xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" class="shape" style="fill: none; stroke-linecap: round; stroke-linejoin: round" points="78,154 79,154 82,154 86,154 95,155 103,155 109,155 115,156 119,156 123,157 126,158 129,158 132,158 134,159 137,159 139,159 144,159 149,159 155,159 160,159 165,159 168,159 170,159 173,159 174,161 175,162 175,163 177,164 178,165 179,165 180,165 180,165 " stroke="rgba(0,0,0,1)" filter="" stroke-width="1"/><!--bindings={  "ng-reflect-ng-if": "false"}-->';

    const height = 851;
    const width = 996;
    const img = service.svgToImage(svgNodes, 'rgba(255,255,255,1)', height, width, SELECT_FILTER_TYPE.NONE);
    expect(img).toBeTruthy();
  });

  it('onLoadManipulation should select the right file type', () => {
    const service: ImageTransformationService = TestBed.get(ImageTransformationService);
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.src = 'abc';
    const width = 500;
    const height = 500;
    image.width = width;
    image.height = height;
    let dataURI = '';
    // svg
    dataURI = service.onLoadManipulation(canvas, image, dataURI, SELECT_FILE_TYPE.SVG);
    expect(dataURI).toBe(image.src);

    // png
    dataURI = '';
    dataURI = service.onLoadManipulation(canvas, image, dataURI, SELECT_FILE_TYPE.PNG);
    expect(dataURI).toContain('image/png');

    // jpg
    dataURI = '';
    dataURI = service.onLoadManipulation(canvas, image, dataURI, SELECT_FILE_TYPE.JPG);
    expect(dataURI).toContain('image/jpeg');
  });

  it('preview should return a valid dataURI', async () => {
    const service: ImageTransformationService = TestBed.get(ImageTransformationService);
    const canvas = document.createElement('canvas');
    const height = 851;
    const width = 996;
    // modified by the preview method
    // tslint:disable-next-line: prefer-const
    let dataURI = '';
    // tslint:disable-next-line: max-line-length
    const svgNodes = '<filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern1" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.60" result="p1" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p1" scale="35" xChannelSelector="R" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern2" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.08" result="p2" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p2" scale="38" xChannelSelector="R" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern3" primitiveUnits="userSpaceOnUse"><feGaussianBlur _ngcontent-oou-c11="" in="SourceGraphic" stdDeviation="6"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern4" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.93 0.01" result="p4" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p4" scale="45" xChannelSelector="R" yChannelSelector="G"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern5" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.05 0.95" result="p5" seed="4" type="fractalNoise"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p5" scale="20" xChannelSelector="G" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern6" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.60" result="turbulence" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="turbulence" scale="35" xChannelSelector="R" yChannelSelector="B"/></filter><!--bindings={  "ng-reflect-ng-if": "false"}--><polyline xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" class="shape" style="fill: none; stroke-linecap: round; stroke-linejoin: round" points="78,154 79,154 82,154 86,154 95,155 103,155 109,155 115,156 119,156 123,157 126,158 129,158 132,158 134,159 137,159 139,159 144,159 149,159 155,159 160,159 165,159 168,159 170,159 173,159 174,161 175,162 175,163 177,164 178,165 179,165 180,165 180,165 " stroke="rgba(0,0,0,1)" filter="" stroke-width="1"/><!--bindings={  "ng-reflect-ng-if": "false"}-->';
    await service.preview(canvas, svgNodes, 'rgba(255,255,255,1)', height, width, SELECT_FILTER_TYPE.NONE, dataURI, SELECT_FILE_TYPE.SVG);
    expect(dataURI).not.toBeNull();
  });
});
