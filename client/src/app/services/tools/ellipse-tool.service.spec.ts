import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { Coordinate } from '../interfaces/coordinate';
import { EllipseTool } from './ellipse-tool.service';

  // Use specific numbers to test edge cases
  // tslint:disable: no-magic-numbers
describe('EllipseTool', () => {
  let service: EllipseTool;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [DrawingAreaComponent, EllipseTool],
  }));

  beforeEach(() => {
    service = TestBed.get(EllipseTool);
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseDown() should start drawing the ellipse', () => {
    service.isDrawing = false;

    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const serviceSpy = spyOn(service, 'updateCoordinates').and.callThrough();

    service.isDrawing = false;
    service.onMouseDown(coordinate, drawingArea);
    expect(service.coordinates[0]).toBe(coordinate);
    expect(service.coordinates[1]).toBe(coordinate);
    expect(serviceSpy).toHaveBeenCalled();
    expect(drawingSpy).toHaveBeenCalledTimes(6);
 });

  it('onMouseMove() should update the ellipse', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};

    const serviceSpy = spyOn(service, 'updateCoordinates').and.callThrough();

    service.isDrawing = true;
    service.onMouseMove(coordinate, drawingArea, true);
    expect(service.coordinates[1]).toBe(coordinate);
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('onMouseUp() should stop to update the ellipse', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().coordinates[0] = coordinate;
    const drawingSpy = spyOn(drawingArea, 'saveShape').and.callThrough();

    service.onMouseUp(coordinate, drawingArea);
    expect(drawingSpy).toHaveBeenCalled();
    expect(service.isDrawing).toBe(false);
    expect(service.coordinates).toEqual([{x: 0, y: 0}, {x: 0, y: 0}]);
  });

  it('calculateSignedWidth() should return a number ', () => {
    const position1 = 100;
    const position2 =  200;
    const coordinateStart: Coordinate = {x: position1, y: position1};
    const coordinateEnd: Coordinate = {x: position2, y: position2};

    service.coordinates[0] = coordinateStart;
    service.coordinates[1] = coordinateEnd;
    const returnValue = service.calculateSignedWidth();
    expect(returnValue).toBe(100);
  });

  it('calculateSignedHeight() should return a number ', () => {
    const position1 = 100;
    const position2 =  200;
    const coordinateStart: Coordinate = {x: position1, y: position1};
    const coordinateEnd: Coordinate = {x: position2, y: position2};

    service.coordinates[0] = coordinateStart;
    service.coordinates[1] = coordinateEnd;
    const returnValue = service.calculateSignedHeight();
    expect(returnValue).toBe(100);
  });

  it('updateCoordinates() should calculate width and height', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};

    service.coordinates[0] = coordinate;
    service.coordinates[1] = coordinate;

    const serviceHeightSpy = spyOn(service, 'calculateSignedWidth').and.callThrough();
    const serviceWidthSpy = spyOn(service, 'calculateSignedHeight').and.callThrough();
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();

    service.isShiftDown = false;
    service.updateCoordinates(drawingArea);
    expect(serviceWidthSpy).toHaveBeenCalled();
    expect(serviceHeightSpy).toHaveBeenCalled();
    expect(drawingSpy).toHaveBeenCalledTimes(4);
  });

});
