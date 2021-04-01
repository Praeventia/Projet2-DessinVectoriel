import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeHandler } from 'src/app/classes/shape-handler';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { GridService } from '../grid-service/grid.service';
import { SelectionToolService } from '../tools/selection-tool.service';
import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
  let service: UndoRedoService;
  let selection: SelectionToolService;
  let drawing: DrawingAreaComponent;
  // tslint:disable-next-line: prefer-const
  let matDialog: MatDialog;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingAreaComponent, GridService, {provide: MatDialog, useValue: matDialog}]
  }));

  beforeEach(() => {
    service = TestBed.get(UndoRedoService);
    selection = TestBed.get(SelectionToolService);
    drawing = TestBed.get(DrawingAreaComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('resetFuture should reset the future and emit a bool', () => {
    service.futureIsEmpty = false;
    service.future.push(new ShapeHandler());
    const futureSpy = spyOn (service, 'changeFutureIsEmpty').and.callThrough();

    service.resetFuture();
    expect(service.future).toEqual([]);
    expect(futureSpy).toHaveBeenCalled();
  });

  it('undo should pop the last shapeDescription and send it to future', () => {
    let shapeStack: ShapeHandler[] = [];
    const futureSpy = spyOn (service, 'changeFutureIsEmpty').and.callThrough();
    const reverseSpy = spyOn (service, 'reverseShapeModif').and.callThrough();
    const shapeLvl = 2;

    let returnValue = service.undo(shapeStack, shapeLvl, selection, drawing );
    expect(returnValue).toEqual([]);

    shapeStack.push(new ShapeDescription());
    shapeStack.push(new ShapeDescription());
    returnValue = service.undo(shapeStack, shapeLvl, selection, drawing );
    expect(futureSpy).toHaveBeenCalled();
    expect(service.pastIsEmpty).toBe(true);
    expect(returnValue).toEqual(shapeStack);

    shapeStack = [];
    const shapeMod: ShapeModification = new ShapeModification();
    shapeStack.push(shapeMod);
    shapeStack.push(shapeMod);
    service.undo(shapeStack, shapeLvl, selection, drawing );
    expect(reverseSpy).toHaveBeenCalled();
  });

  it('redo should  pop the last shapeDescription and send it to the shapeStack', () => {
    let shapeStack: ShapeHandler[] = [];
    const futureSpy = spyOn (service, 'changeFutureIsEmpty').and.callThrough();
    const reverseSpy = spyOn (service, 'reverseShapeModif').and.callThrough();
    const shapeLvl = 2;

    service.futureIsEmpty = true;
    let returnValue = service.redo(shapeStack, shapeLvl, selection, drawing );
    expect(returnValue).toEqual([]);

    service.futureIsEmpty = false;
    shapeStack.push(new ShapeDescription());
    shapeStack.push(new ShapeDescription());
    returnValue = service.redo(shapeStack, shapeLvl, selection, drawing );
    expect(futureSpy).toHaveBeenCalled();
    expect(service.pastIsEmpty).toBe(false);
    expect(returnValue).toEqual(shapeStack);

    shapeStack = [];
    const shapeMod: ShapeModification = new ShapeModification();
    service.future.push(shapeMod);
    shapeStack.push(shapeMod);
    service.futureIsEmpty = false;
    service.redo(shapeStack, shapeLvl, selection, drawing );
    expect(reverseSpy).toHaveBeenCalled();
  });

  it('reverseShapeModif should exchange infomartion between the shape and the shapeMod', () => {
    const shapeMod: ShapeModification = new ShapeModification();
    const shapeStack: ShapeHandler[] = [];
    shapeStack.push(new ShapeDescription());
    shapeMod.modifications.push([shapeStack[0] as ShapeDescription, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']);
    service.reverseShapeModif(shapeMod, shapeStack);

    const shape = shapeStack[0] as ShapeDescription;
    expect(shape.fillColor).toBe('rgba(0,0,0,0)');
    expect(shape.strokeColor).toBe('rgba(0,0,0,0)');
    expect(shapeMod.modifications[0][1]).toBe('rgba(0,0,0,0)');
    expect(shapeMod.modifications[0][2]).toBe('rgba(0,0,0,0)');

    const shapeDes = new ShapeDescription();
    const spy = spyOn(service, 'reverseMovement').and.callThrough();
    shapeMod.modifications[0] = [shapeStack[0] as ShapeDescription, 'allo', 'allo', shapeDes];
    service.reverseShapeModif(shapeMod, shapeStack);
    expect(spy).toHaveBeenCalled();
  });

  it('getEmittedValuePastIsEmpty should return the undoObserver', () => {
    service.changePastIsEmpty();
    const returnValue = service.getEmittedValuePastIsEmpty();
    expect(returnValue).toBe(service.undoObserver);
  });

  it('getEmittedValueFutureIsEmpty should return the redoObserver', () => {
    service.changeFutureIsEmpty();
    const returnValue = service.getEmittedValueFutureIsEmpty();
    expect(returnValue).toBe(service.redoObserver);
  });

  it('reverseMovement should reverse the infomartion in shapeModif', () => {
    const shapeMod = new ShapeModification();
    const shapeDes = new ShapeDescription();
    shapeMod.modifications[0] = [shapeDes, 'allo', 'allo', shapeDes];
    const jsonSpy = spyOn (JSON, 'parse').and.callThrough();
    service.reverseMovement(shapeMod.modifications[0], shapeDes);
    expect(jsonSpy).toHaveBeenCalled();
  });
});
