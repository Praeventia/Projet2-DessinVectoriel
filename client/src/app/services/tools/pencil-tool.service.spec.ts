import { TestBed } from '@angular/core/testing';
import { ShapeComponent } from 'src/app/components/shapes/shape/shape.component';
import { AppModule } from '../../app.module';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { PencilComponent } from '../../components/shapes/pencil/pencil.component';
import { Coordinate } from '../interfaces/coordinate';
import { PencilTool } from './pencil-tool.service';

// Number to test specefic case
// tslint:disable: no-magic-numbers
describe('PencilTool', () => {
  let service: PencilTool;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [DrawingAreaComponent, PencilComponent, ShapeComponent]
  }));

  beforeEach(() => {
    service = TestBed.get(PencilTool);
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseDown should start drawing', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    service.isDrawing = false;

    service.onMouseDown(coordinate, drawingArea);
    expect(service.isDrawing).toBe(true);
    // tslint:disable-next-line: no-magic-numbers
    expect(drawingSpy).toHaveBeenCalledTimes(5);
  });

  it('onMouseMove should save or keep drawing', () => {

    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().originCoords[0] = coordinate;
    drawingArea.getShape().originCoords[1] = coordinate;
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    service.setupSelectionCoords(coordinate, drawingArea);

    service.onMouseMove(coordinate, drawingArea, true);
    expect(service.isDrawing).toBe(false);
    expect(drawingSpy).toHaveBeenCalled();

    service.isDrawing = true;
    service.onMouseMove(coordinate, drawingArea, false);
    expect(drawingSpy).toHaveBeenCalled();
  });

  it('onMouseUp should stop drawing', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().originCoords[0] = coordinate;
    drawingArea.getShape().originCoords[1] = coordinate;
    const drawingSpy = spyOn(drawingArea, 'getShape').and.callThrough();
    const drawingSaveSpy = spyOn(drawingArea, 'saveShape').and.callThrough();
    service.isDrawing = true;

    service.onMouseUp(coordinate, drawingArea);
    expect(drawingSpy).toHaveBeenCalled();
    expect(service.isDrawing).toBe(false);
    expect(drawingSaveSpy).toHaveBeenCalled();
  });

  it('onMouseOut should stop the drawing', () => {
    service.isDrawing = true;
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    drawingArea.getShape().originCoords[0] = coordinate;
    drawingArea.getShape().originCoords[1] = coordinate;
    const spy = spyOn(service, 'ajustSelectionCoords').and.callThrough();
    const drawingSaveSpy = spyOn(drawingArea, 'saveShape').and.callThrough();

    service.onMouseOut(drawingArea);
    expect(drawingSaveSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
