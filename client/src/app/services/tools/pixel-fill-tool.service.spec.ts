import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { ImageTransformationService } from '../image-transformation/image-transformation.service';
import { InteractionFormDrawingService } from '../interaction-form-drawing/interaction-form-drawing.service';
import { PixelFillToolService } from './pixel-fill-tool.service';

// To test specific case
// tslint:disable: no-magic-numbers
describe('PixelFillToolService', () => {

  let service: PixelFillToolService;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [DrawingAreaComponent, InteractionFormDrawingService]
  }));

  beforeEach(() => {
    service = TestBed.get(PixelFillToolService);
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('start should create a canvas', () => {
    const image = TestBed.get(ImageTransformationService);
    service.imageTransformation = image;
    // To not broke the svg
    // tslint:disable-next-line: max-line-length
    const svgNodes = '<filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern1" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.60" result="p1" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p1" scale="35" xChannelSelector="R" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern2" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.08" result="p2" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p2" scale="38" xChannelSelector="R" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern3" primitiveUnits="userSpaceOnUse"><feGaussianBlur _ngcontent-oou-c11="" in="SourceGraphic" stdDeviation="6"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern4" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.93 0.01" result="p4" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p4" scale="45" xChannelSelector="R" yChannelSelector="G"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern5" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.05 0.95" result="p5" seed="4" type="fractalNoise"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p5" scale="20" xChannelSelector="G" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern6" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.60" result="turbulence" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="turbulence" scale="35" xChannelSelector="R" yChannelSelector="B"/></filter><!--bindings={  "ng-reflect-ng-if": "false"}--><polyline xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" class="shape" style="fill: none; stroke-linecap: round; stroke-linejoin: round" points="78,154 79,154 82,154 86,154 95,155 103,155 109,155 115,156 119,156 123,157 126,158 129,158 132,158 134,159 137,159 139,159 144,159 149,159 155,159 160,159 165,159 168,159 170,159 173,159 174,161 175,162 175,163 177,164 178,165 179,165 180,165 180,165 " stroke="rgba(0,0,0,1)" filter="" stroke-width="1"/><!--bindings={  "ng-reflect-ng-if": "false"}-->';
    spyOn(drawingArea, 'getSvgNodesString').and.returnValue(svgNodes);
    drawingArea.screenHeight = 50;
    drawingArea.screenWidth = 50;
    const imageSpy = spyOn(service.imageTransformation, 'svgToImage').and.callThrough();
    const canvasSpy = spyOn(document, 'createElement').and.callThrough();

    service.start(drawingArea);
    expect(imageSpy).toHaveBeenCalled();
    expect(canvasSpy).toHaveBeenCalled();
  });

  it('onMouseclick should call click addPixel, start and set lineWidth', () => {

    const image = TestBed.get(ImageTransformationService);
    service.imageTransformation = image;
    // To not broke the svg
    // tslint:disable-next-line: max-line-length
    const svgNodes = '<filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern1" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.60" result="p1" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p1" scale="35" xChannelSelector="R" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern2" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.08" result="p2" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p2" scale="38" xChannelSelector="R" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern3" primitiveUnits="userSpaceOnUse"><feGaussianBlur _ngcontent-oou-c11="" in="SourceGraphic" stdDeviation="6"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern4" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.93 0.01" result="p4" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p4" scale="45" xChannelSelector="R" yChannelSelector="G"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern5" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.05 0.95" result="p5" seed="4" type="fractalNoise"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="p5" scale="20" xChannelSelector="G" yChannelSelector="B"/></filter><filter xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" filterUnits="userSpaceOnUse" id="pattern6" primitiveUnits="userSpaceOnUse"><feTurbulence _ngcontent-oou-c11="" baseFrequency="0.60" result="turbulence" seed="4" type="turbulence"/><feDisplacementMap _ngcontent-oou-c11="" in="SourceGraphic" in2="turbulence" scale="35" xChannelSelector="R" yChannelSelector="B"/></filter><!--bindings={  "ng-reflect-ng-if": "false"}--><polyline xmlns="http://www.w3.org/2000/svg" _ngcontent-oou-c11="" class="shape" style="fill: none; stroke-linecap: round; stroke-linejoin: round" points="78,154 79,154 82,154 86,154 95,155 103,155 109,155 115,156 119,156 123,157 126,158 129,158 132,158 134,159 137,159 139,159 144,159 149,159 155,159 160,159 165,159 168,159 170,159 173,159 174,161 175,162 175,163 177,164 178,165 179,165 180,165 180,165 " stroke="rgba(0,0,0,1)" filter="" stroke-width="1"/><!--bindings={  "ng-reflect-ng-if": "false"}-->';
    spyOn(drawingArea, 'getSvgNodesString').and.returnValue(svgNodes);
    drawingArea.screenHeight = 50;
    drawingArea.screenWidth = 50;
    service.start(drawingArea);
    const imageSpy = spyOn(service.imageTransformation, 'svgToImage').and.callThrough();
    service.onMouseClick({x: 0, y: 0}, drawingArea);

    expect(imageSpy).toHaveBeenCalled();
    expect(service.image).not.toBeNull();
  });

  it('isTolered accept only pixel within the marge', () => {

    service.color = [50, 50, 50];
    ShapeDescription.texture = 50;

    const colorIn = service.isTolered([75, 60, 50]);
    const colorInNegative = service.isTolered([25, 60, 50]);
    const colorOut = service.isTolered([75, 100, 150]);
    const colorOutNegative = service.isTolered([0, 0, 150]);

    expect(colorIn).toBeTruthy();
    expect(colorInNegative).toBeTruthy();
    expect(colorOut).toBeFalsy();
    expect(colorOutNegative).toBeFalsy();
  });
});
