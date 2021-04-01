import { TestBed } from '@angular/core/testing';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeComponent } from 'src/app/components/shapes/shape/shape.component';
import { AppModule } from '../../app.module';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { LineComponent } from '../../components/shapes/line/line.component';
import { Coordinate } from '../../services/interfaces/coordinate';
import { SELECT_DRAWING_TYPE } from '../enum/drawing-type';
import { LineTool } from './line-tool.service';

// Use to test the line tools
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
describe('LineTool', () => {
  let service: LineTool;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [DrawingAreaComponent, LineComponent, ShapeComponent]
  }));

  beforeEach(() => {
    service = TestBed.get(LineTool);
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseClick() should setShape() and update() the line', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    service.isDrawing = false;

    const drawingAreaSpy = spyOn(drawingArea, 'getShape').and.callThrough();

    service.onMouseClick(coordinate, drawingArea);
    expect(drawingAreaSpy).toHaveBeenCalledTimes(5);
  });

  it('onMouseMove() should setShape() and update() the line', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    service.isDrawing = true;

    const drawingAreaSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const serviceSpy = spyOn(service, 'updateCoordinates').and.callThrough();

    service.onMouseMove(coordinate, drawingArea);
    expect(serviceSpy).toHaveBeenCalled();
    expect(drawingAreaSpy).toHaveBeenCalled();
    expect(service['lastMousePosition']).toEqual(coordinate);
  });

  it('onMouseDoubleClick() should saveShape() and update() the line', () => {
    const position = 100;
    const  coordinateTmp: Coordinate = {x: position, y: position};
    const drawingAreaGetShapeSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const drawingAreaSaveSpy = spyOn(drawingArea, 'saveShape').and.callThrough();

    drawingArea.getShape().coordinates.push(coordinateTmp);
    drawingArea.getShape().coordinates.push(coordinateTmp);
    drawingArea.getShape().coordinates.push(coordinateTmp);
    drawingArea.getShape().coordinates.push(coordinateTmp);
    service.onMouseDoubleClick(coordinateTmp, drawingArea);

    expect(drawingAreaGetShapeSpy).toHaveBeenCalledTimes(22);
    expect(drawingAreaSaveSpy).toHaveBeenCalled();
    expect(service.isShiftDown).toBe(false);
  });

  it('onMouseDoubleClick() should saveShape() and update() the line', () => {
    const position = 100;
    const  coordinateTmp: Coordinate = {x: position, y: position};
    const drawingAreaGetShapeSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const drawingAreaSaveSpy = spyOn(drawingArea, 'saveShape').and.callThrough();
    const serviceSetUpSpy = spyOn(service, 'setupSelectionCoords').and.callThrough();
    service.isShiftDown = true;

    drawingArea.getShape().coordinates.push(coordinateTmp);
    drawingArea.getShape().coordinates.push(coordinateTmp);
    drawingArea.getShape().coordinates.push(coordinateTmp);
    drawingArea.getShape().coordinates.push(coordinateTmp);
    service.onMouseDoubleClick(coordinateTmp, drawingArea);

    expect(drawingAreaGetShapeSpy).toHaveBeenCalledTimes(22);
    expect(drawingAreaSaveSpy).toHaveBeenCalled();
    expect(serviceSetUpSpy).toHaveBeenCalled();
  });

  it('updateCoordinates() should calculate the angle', () => {

    const position = 100;
    const  coordinateTmp: Coordinate = {x: position, y: position};

    const coordinateFirst: Coordinate = {x: position - 100, y: position - 100};
    // Acces to a private method
    // tslint:disable-next-line: no-any
    const serviceSpy = spyOn<any>(service, 'calculateDesiredAngle').and.callThrough();
    const mathSpy = spyOn(Math, 'atan2').and.callThrough();

    service.isShiftDown = false;
    drawingArea.getShape().coordinates[0] = coordinateTmp;
    drawingArea.getShape().coordinates[1] = coordinateFirst;
    service.updateCoordinates(drawingArea);

    expect(drawingArea.getShape().coordinates[0]).toBe(service['lastMousePosition']);

    service.isShiftDown = true;
    drawingArea.getShape().coordinates[0] = {x: 0, y: 0};
    drawingArea.getShape().coordinates[1] = {x: 1, y: 0};
    service.updateCoordinates(drawingArea);
    expect(mathSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
    expect(drawingArea.getShape().coordinates[0]).toEqual({x: 0, y: 0});

    service.isShiftDown = true;
    drawingArea.getShape().coordinates[0] = {x: 0, y: 0};
    drawingArea.getShape().coordinates[1] = {x: 0, y: 1};
    service.updateCoordinates(drawingArea);
    expect(mathSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
    expect(drawingArea.getShape().coordinates[0]).toEqual({x: 0, y: 0});

    service.isShiftDown = true;
    drawingArea.getShape().coordinates[0] = {x: 0, y: 0};
    drawingArea.getShape().coordinates[1] = {x: -1, y: 1};
    service.updateCoordinates(drawingArea);
    expect(mathSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
    expect(drawingArea.getShape().coordinates[0]).toEqual({x: 0, y: 0});

    service.isShiftDown = true;
    drawingArea.getShape().coordinates[0] = {x: 1, y: 1};
    drawingArea.getShape().coordinates[1] = {x: 1, y: 1};
    service.updateCoordinates(drawingArea);
    expect(mathSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
    expect(drawingArea.getShape().coordinates[0]).toEqual({x: 0, y: 1});
  });

  it('calculateDesiredAngle should calcul the good angle', () => {

    let returnValue = service.calculateDesiredAngle(-1);
    expect(returnValue).toBe(0);

    returnValue = service.calculateDesiredAngle(0.1);
    expect(returnValue).toBe(0);

    returnValue = service.calculateDesiredAngle(Math.PI / 4);
    expect(returnValue).toBe(Math.PI / 4);

    returnValue = service.calculateDesiredAngle(Math.PI / 2);
    expect(returnValue).toBe( Math.PI / 2);

    returnValue = service.calculateDesiredAngle(3 * Math.PI / 4);
    expect(returnValue).toBe( 3 * Math.PI / 4);

    returnValue = service.calculateDesiredAngle(Math.PI);
    expect(returnValue).toBe( Math.PI);

    returnValue = service.calculateDesiredAngle(5 * Math.PI / 4);
    expect(returnValue).toBe(  5 * Math.PI / 4);

    returnValue = service.calculateDesiredAngle(3 * Math.PI / 2);
    expect(returnValue).toBe( 3 * Math.PI / 2);

    returnValue = service.calculateDesiredAngle(7 * Math.PI / 4);
    expect(returnValue).toBe( 7 * Math.PI / 4);

    returnValue = service.calculateDesiredAngle(2 * Math.PI - 0.25);
    expect(returnValue).toBe( 0 );

  });

  it('onEscapeKey should stop the drawing', () => {
    service.isDrawing = true;

    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const serviceSpy = spyOn(service, 'updateCoordinates').and.callThrough();

    service.onEscapeKey(drawingArea);
    expect(service.isDrawing).toBe(false);
    expect(drawingArea.getShape().coordinates[0]).toEqual({x: 0, y: 0});
    expect(drawingSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('onBackspaceKey should erase the last segment', () => {
    service.isDrawing = true;
    const position = 100;
    const coordinateTmp: Coordinate = {x: position, y: position};

    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const serviceSpy = spyOn(service, 'updateCoordinates').and.callThrough();
    drawingArea.getShape().coordinates.push(coordinateTmp);
    drawingArea.getShape().coordinates.push(coordinateTmp);
    drawingArea.getShape().coordinates.push(coordinateTmp);

    service.onBackspaceKey(drawingArea);
    expect(drawingSpy).toHaveBeenCalledTimes(11);
    expect(serviceSpy).toHaveBeenCalled();

  });

  it('calculateBounds should calculate the drawing area borders', () => {
    const description = new ShapeDescription();
    description.coordinates.push({x: 10, y: 10} );
    description.coordinates.push({x: 0, y: 0} );
    description.coordinates.push({x: -10, y: -10} );
    description.coordinates.push({x: 0, y: 0} );
    description.drawType = SELECT_DRAWING_TYPE.DOT;

    service.calculateBounds(description);
    expect(description.width).toBe(20);
    expect(description.height).toBe(20);

    description.drawType = SELECT_DRAWING_TYPE.BORDER;
    service.calculateBounds(description);
    expect(description.width).toBe(10);
    expect(description.height).toBe(10);
  });

});
