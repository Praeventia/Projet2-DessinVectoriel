import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeModification } from '../../classes/shape-modification';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import SpyObj = jasmine.SpyObj;
import { SELECT_SHAPE_TYPE } from '../enum/shape-type';
import { GridService } from '../grid-service/grid.service';
import { Coordinate } from '../interfaces/coordinate';
import { EraserToolService } from './eraser-tool.service';

// Number to specified the test
// tslint:disable: no-magic-numbers
// tslint:disable: prefer-const
describe('EraserToolService', () => {
  let drawingSpy: SpyObj<DrawingAreaComponent>;
  let service: EraserToolService;
  let matdialog: MatDialog;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingAreaComponent, {provide: MatDialog, useValue: matdialog}, GridService],
   }));

  beforeEach(() => {
    service = TestBed.get(EraserToolService);
    drawingSpy = jasmine.createSpyObj('DrawingAreaComponent', ['setModification', 'newShape', 'getShape']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('start should setup the Shapemodification to eraser', () => {
    service.start(drawingSpy);
    const obj = new ShapeModification();
    obj.shapeType = SELECT_SHAPE_TYPE.ERASER;
    expect(service.modification).toEqual(obj);
    expect(service.isActive).toBe(false);
    expect(drawingSpy.setModification).toHaveBeenCalled();
  });

  it('finish should setup the Shapemodification to modification', () => {
    const obj = new ShapeModification();
    obj.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    service.modification = obj;
    service.finish(drawingSpy);
    expect(service.modification).toEqual(obj);
    expect(drawingSpy.setModification).toHaveBeenCalled();
    expect(drawingSpy.newShape).toHaveBeenCalled();
  });

  it('onMouseDown should set isActive to true', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    service.onMouseDown(coordinate, drawingSpy);
    expect(service.isActive).toBe(true);
  });

  it('onMMove should get the shape and change the attributes', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const obj = new ShapeModification();
    obj.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    service.modification = obj;
    drawingSpy = TestBed.get(DrawingAreaComponent);

    const spy = spyOn(service, 'delete').and.callThrough();
    const spyShape = spyOn (drawingSpy, 'getShape').and.callThrough();

    service.isActive = true;
    service.onMouseMove(coordinate, drawingSpy, false);
    expect(spyShape).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalled();
  });

  it('onMouseClick should delete', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const obj = new ShapeModification();
    obj.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    service.modification = obj;
    drawingSpy = TestBed.get(DrawingAreaComponent);

    const spyDelete = spyOn(service, 'delete').and.callThrough();
    const spyFinish = spyOn(service, 'finish').and.callThrough();
    const spyStart = spyOn(service, 'start').and.callThrough();

    service.erased = true;
    service.onMouseClick(coordinate, drawingSpy);
    expect(spyDelete).toHaveBeenCalled();
    expect(spyFinish).toHaveBeenCalled();
    expect(spyStart).toHaveBeenCalled();

  });

  it('onMouseUp should change isActive and start a new shapeModf', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};
    const obj = new ShapeModification();
    obj.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    service.modification = obj;

    const spyFinish = spyOn(service, 'finish').and.callThrough();
    const spyStart = spyOn(service, 'start').and.callThrough();

    service.erased = true;
    service.onMouseUp(coordinate, drawingSpy);
    expect(spyFinish).toHaveBeenCalled();
    expect(spyStart).toHaveBeenCalled();
    expect(service.isActive).toBe(false);
  });

  it('delete should change the fillColor and strokeColor of shapes', () => {
    const obj = new ShapeModification();
    obj.shapeType = SELECT_SHAPE_TYPE.MODIFICATION;
    service.modification = obj;
    drawingSpy = TestBed.get(DrawingAreaComponent);
    drawingSpy.getShape().isRed = true;

    service.delete(drawingSpy);
    expect(service.erased).toBe(true);
    expect(drawingSpy.getShape().fillColor).toBe('none');
  });
});
