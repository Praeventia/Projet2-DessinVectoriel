import { TestBed } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { Coordinate } from '../interfaces/coordinate';
import { SprayTool } from './spray-tool.service';

describe('SprayTool', () => {
  let service: SprayTool;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [DrawingAreaComponent, SprayTool],
  }));

  beforeEach(() => {
    service = TestBed.get(SprayTool);
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseDown() should start a new spray', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const serviceSpy = spyOn(service, 'paint').and.callThrough();

    service.isDrawing = false;
    service.onMouseDown(coordinate, drawingArea);
    expect(service.coordinates[0]).toBe(coordinate);
    expect(service.drawingArea).toBe(drawingArea);
    expect(serviceSpy).toHaveBeenCalled();
    expect(drawingSpy).toHaveBeenCalled();
  });

  it('onMouseMove() should move the spray', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};

    service.isDrawing = true;
    service.onMouseMove(coordinate, drawingArea, true);
    expect(service.coordinates[0]).toBe(coordinate);
  });

  it('onMouseUp() should stop the spray', () => {
    const position = 100;
    let coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().originCoords[0] = coordinate;
    drawingArea.getShape().originCoords[1] = coordinate;

    service.isDrawing = true;
    service.onMouseUp(coordinate, drawingArea);
    expect(service.isDrawing).toBe(false);

    coordinate = {x: 200, y: 200};
    service.onMouseUp(coordinate, drawingArea);
    expect(service.isDrawing).toBe(false);
  });

  it('paint() should calculate points randomly', () => {
    service.drawingArea = drawingArea;
    const drawingSpy = spyOn(drawingArea, 'saveShape').and.callThrough();
    const drawingGetShapeSpy = spyOn(service.drawingArea, 'getShape').and.callThrough();
    const serviceSpy = spyOn(service, 'paint').and.callThrough();

    service.lineWidth = 2;
    service.coordinates[0] = {x: 0, y: 0 };

    service.isDrawing = true;
    service.paint();
    expect(drawingGetShapeSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();

    service.isDrawing = false;
    service.paint();
    expect(drawingGetShapeSpy).toHaveBeenCalled();
    expect(drawingSpy).toHaveBeenCalled();
  });

  it('setupSelectionCoords should setup the coordinate for the selection', () => {
    const position = 0;
    const coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().originCoords[0] = coordinate;
    drawingArea.getShape().originCoords[1] = coordinate;

    const selectCoordinate: Coordinate = {x: 10, y: 10};

    service.setupSelectionCoords(selectCoordinate, drawingArea);
    const value = drawingArea.getShape().originCoords;
    expect(value).toEqual([{x: 0, y: 0}, {x: 10, y: 10}]);

  });

});
