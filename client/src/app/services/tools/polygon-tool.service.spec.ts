import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { Coordinate } from '../interfaces/coordinate';
import { PolygonTool } from './polygon-tool.service';

// Number are use to test specific points
// tslint:disable: no-magic-numbers

describe('PolygonTool', () => {
  let service: PolygonTool;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [DrawingAreaComponent],
  }));

  beforeEach(() => {
    service = new PolygonTool(3);
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseDown() should start drawing the polygon', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();

    service.isDrawing = false;
    service.onMouseDown(coordinate, drawingArea);
    expect(service.coordinates[0]).toEqual({x: 0, y: 0});
    expect(drawingSpy).toHaveBeenCalledTimes(2);
  });

  it('onMouseMove() should update polygon coordinate', () => {
    service.isDrawing = true;

    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const serviceSpy = spyOn(service, 'updateCoordinates').and.callThrough();

    service.temporary[0] = (coordinate);
    service.temporary[1] = (coordinate);
    service.temporary[2] = (coordinate);

    service.onMouseMove(coordinate, drawingArea, true);
    expect(service.coordinates[2]).toBeUndefined();
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('onMouseUp() should save the polygon', () => {

    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().coordinates[0] = {x: position, y: position};
    drawingArea.getShape().coordinates[1] = {x: position, y: position};
    drawingArea.getShape().coordinates[2] = {x: position, y: position};
    const drawingSpy = spyOn(drawingArea, 'saveShape').and.callThrough();

    service.isDrawing = false;
    service.onMouseUp(coordinate, drawingArea);
    expect(drawingSpy).toHaveBeenCalled();
  });

  it('updateCoordinates() should update the coordinates the polygon', () => {

    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().coordinates[0] = {x: position, y: position};
    drawingArea.getShape().coordinates[1] = {x: position, y: position};
    drawingArea.getShape().coordinates[2] = {x: position, y: position};
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();

    service.nbSide = 3;

    service.temporary[0] = coordinate;
    service.temporary[1] = coordinate;
    service.temporary[2] = coordinate;
    service.matrix[0] = {x: 0, y: 0};
    service.matrix[1] = {x: 0, y: 0};
    service.matrix[2] = {x: 0, y: 0};

    service.updateCoordinates(drawingArea);
    expect(service.temporary[1]).toEqual({x: 100, y: 100});
    expect(drawingSpy).toHaveBeenCalledTimes(3);
  });

  it('setMatrix should set the matrix for the polygon', () => {
    ShapeDescription.nbSide = 3;
    service.setMatrix();
    expect(service.ajustY).toBe(0.49999999999999956);
    expect(service.shapeWidth).toBe(1.7320508075688772);
    expect(service.shapeHeight).toBe(1.5000000000000004);
  });

  it('setupSelectionCoords should setup the selection coords', () => {
    const position = 100;
    service.nbSide = 3;
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().lineWidth = 10;
    for (let i = 0; i <= service.nbSide; i++) {
      drawingArea.getShape().coordinates[i] = coordinate;
    }

    service.setupSelectionCoords(coordinate, drawingArea);
    expect(drawingSpy).toHaveBeenCalledTimes(15);

    service.nbSide = 7;
    drawingArea.getShape().lineWidth = 10;
    for (let i = 0; i <= service.nbSide; i++) {
      drawingArea.getShape().coordinates[i] = coordinate;
    }
    service.setupSelectionCoords(coordinate, drawingArea);
    expect(drawingSpy).toHaveBeenCalledTimes(42);

    service.nbSide = 14;
    drawingArea.getShape().lineWidth = 10;
    for (let i = 0; i <= service.nbSide; i++) {
      drawingArea.getShape().coordinates[i] = coordinate;
    }
    service.setupSelectionCoords(coordinate, drawingArea);
    expect(drawingSpy).toHaveBeenCalledTimes(90);

  });

});
