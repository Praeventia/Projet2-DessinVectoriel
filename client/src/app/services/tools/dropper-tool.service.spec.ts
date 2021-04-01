import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { ColorService } from '../color-service/color.service';
import { GridService } from '../grid-service/grid.service';
import { Coordinate } from '../interfaces/coordinate';
import { DropperToolService } from './dropper-tool.service';

// Need acces to private attribute for test
// tslint:disable: no-string-literal
describe('DropperToolService', () => {
  let service: DropperToolService;
  let drawingArea: DrawingAreaComponent;
  // tslint:disable-next-line: prefer-const
  let matDialog: MatDialog;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: MatDialog, useValue: matDialog}, DrawingAreaComponent, GridService]
  }));

  beforeEach(() => {
    service = TestBed.get(DropperToolService);
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('start should set the image atrribute', () => {
    const spy = spyOn (service['imageTransformation'], 'svgToImage');
    try {
      service.start(drawingArea);
      expect(spy).toHaveBeenCalled();
    } catch (error) {
      console.log(error);
    }
  });

  it('onMouseClick should call changeColor', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const spy = spyOn (service, 'changeColor');
    service.onMouseClick(coordinate, drawingArea);
    expect(spy).toHaveBeenCalled();
  });

  it('onRightClick should call changeColor', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const spy = spyOn (service, 'changeColor');
    service.onRightClick(coordinate, drawingArea);
    expect(spy).toHaveBeenCalled();
  });

  it('changeColor should set the color to the new color', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const color = TestBed.get(ColorService);
    const colorSpy = spyOn (color, 'setColor').and.callThrough();

    service['image'] = new Image(1, 1);
    service.changeColor(coordinate, true);
    expect(colorSpy).toHaveBeenCalled();
  });

});
