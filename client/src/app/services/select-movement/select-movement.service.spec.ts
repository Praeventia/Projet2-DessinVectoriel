import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_DRAWING_TYPE } from '../enum/drawing-type';
import { KEY_CODE } from '../enum/key-code';
import { GridService } from '../grid-service/grid.service';
import { Coordinate } from '../interfaces/coordinate';
import { SelectionToolService } from '../tools/selection-tool.service';
import { SelectMovementService } from './select-movement.service';

// tslint:disable: prefer-const
// tslint:disable: no-magic-numbers
describe('SelectMovementService', () => {
  let service: SelectMovementService;
  let drawingArea: DrawingAreaComponent;
  let matDialog: MatDialog;
  let selection: SelectionToolService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingAreaComponent, {provide: MatDialog, useValue: matDialog}, GridService],
  }));

  beforeEach(() => {
    service = TestBed.get(SelectMovementService);
    drawingArea = TestBed.get(DrawingAreaComponent);
    selection = TestBed.get(SelectionToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('finish should set the shapeModif', () => {
    const shapeModif = new ShapeModification();
    shapeModif.modifications[0] = [new ShapeDescription(), 'allo', 'test', new ShapeDescription()];
    const setSpy = spyOn (drawingArea, 'setModification');

    service.finish(drawingArea, shapeModif);
    expect(setSpy).toHaveBeenCalled();
  });

  it('start should set the shapeModif', () => {
    const shapeModif = new ShapeModification();
    const setSpy = spyOn (drawingArea, 'setModification');
    service.start(drawingArea, shapeModif);
    expect(setSpy).toHaveBeenCalled();
  });

  it('checkIfShapeInStack should return true if the shape is in the stack', () => {
    const shape = new ShapeDescription();
    const shapeStack: ShapeDescription[] = [];
    let returnValue = service.checkIfShapeInStack(shape, 0, shapeStack);
    expect(returnValue).toBe(false);

    shapeStack.push(shape);
    returnValue = service.checkIfShapeInStack(shape, 1, shapeStack);
    expect(returnValue).toBe(true);
  });

  it('setupTotalSelectionSize should set up the coordinate for the selection', () => {
    const totalSelectionCoordinates: Coordinate[] = [{x: 0, y: 0}];
    const newSelectionStack: ShapeDescription[] = [];
    let returnValue = service.setupTotalSelectionSize(drawingArea, totalSelectionCoordinates, 0, false, newSelectionStack);
    expect(returnValue).toEqual([{x: 0, y: 0}, {x: 0, y: 0}]);

    const shape = new ShapeDescription();
    shape.originCoords = [{x: 10 , y: 10}, {x: 0, y: 0}];
    newSelectionStack[0] = shape;
    const shape2 = new ShapeDescription();
    shape2.originCoords = [{x: 0 , y: 0}, {x: 10, y: 10}];
    newSelectionStack[1] = shape2;
    returnValue = service.setupTotalSelectionSize(drawingArea, totalSelectionCoordinates, 2, false, newSelectionStack);
    expect(returnValue).toEqual([{x: 0 , y: 0}, {x: 10, y: 10}]);
  });

  it('setupSelectionConditions should return a boolean', () => {
    let coordinates: Coordinate[] = [{x: 0, y: 0}, {x: 0, y: 10} ];
    const shape = new ShapeDescription();
    shape.originCoords = [{x: 0, y: 0}, {x: 0, y: 10}];

    let returnValue = service.setupSelectionConditions(shape, coordinates, false);
    expect(returnValue).toBe(true);

    returnValue = service.setupSelectionConditions(shape, coordinates, true);
    expect(returnValue).toBe(false);

    coordinates = [{x: 0, y: 0}, {x: 15, y: 0} ];
    shape.originCoords = [{x: 0, y: 0}, {x: 10, y: 0}];

    returnValue = service.setupSelectionConditions(shape, coordinates, false);
    expect(returnValue).toBe(true);

    returnValue = service.setupSelectionConditions(shape, coordinates, true);
    expect(returnValue).toBe(false);

    coordinates = [{x: 0, y: 0}, {x: 0, y: 0} ];
    shape.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];

    returnValue = service.setupSelectionConditions(shape, coordinates, false);
    expect(returnValue).toBe(false);

    returnValue = service.setupSelectionConditions(shape, coordinates, true);
    expect(returnValue).toBe(true);
  });

  it('changeState should change the state in the map', () => {
    service.changeSate(KEY_CODE.ARROW_UP, true);
    const value = service.arrowHandler.get(KEY_CODE.ARROW_UP);
    expect(value).toBe(true);
  });

  it('handleArrow should return a coordinate', () => {
    service.arrowHandler.set(KEY_CODE.ARROW_UP, true);
    service.arrowHandler.set(KEY_CODE.ARROW_LEFT, true);
    let value = service.handleArrow();
    expect(value).toEqual({x: -3, y: -3});

    service.arrowHandler.set(KEY_CODE.ARROW_DOWN, true);
    service.arrowHandler.set(KEY_CODE.ARROW_RIGHT, true);
    service.arrowHandler.set(KEY_CODE.ARROW_UP, false);
    service.arrowHandler.set(KEY_CODE.ARROW_LEFT, false);
    value = service.handleArrow();
    expect(value).toEqual({x: 3, y: 3});
  });

  it('onKeyUp should call the changeSate method', () => {
    let key = new KeyboardEvent('keyup', {key: KEY_CODE.ARROW_UP});
    const spy = spyOn(service, 'changeSate').and.callThrough();
    service.onKeyUp(key);
    expect(spy).toHaveBeenCalled();

    key = new KeyboardEvent('keyup', {key: KEY_CODE.ARROW_DOWN});
    service.onKeyUp(key);
    expect(spy).toHaveBeenCalled();

    key = new KeyboardEvent('keyup', {key: KEY_CODE.ARROW_LEFT});
    service.onKeyUp(key);
    expect(spy).toHaveBeenCalled();

    key = new KeyboardEvent('keyup', {key: KEY_CODE.ARROW_RIGHT});
    service.onKeyUp(key);
    expect(spy).toHaveBeenCalled();

  });

  it('onKeyPress should call the changeSate method', () => {
    let key = new KeyboardEvent('keypress', {key: KEY_CODE.ARROW_UP});
    const spy = spyOn(service, 'changeSate').and.callThrough();
    const handleSpy = spyOn(service, 'handleArrow').and.callThrough();
    service.onKeyPress(key);
    expect(spy).toHaveBeenCalled();
    expect(handleSpy).toHaveBeenCalled();

    key = new KeyboardEvent('keypress', {key: KEY_CODE.ARROW_DOWN});
    service.onKeyPress(key);
    expect(spy).toHaveBeenCalled();

    key = new KeyboardEvent('keypress', {key: KEY_CODE.ARROW_LEFT});
    service.onKeyPress(key);
    expect(spy).toHaveBeenCalled();

    key = new KeyboardEvent('keypress', {key: KEY_CODE.ARROW_RIGHT});
    service.onKeyPress(key);
    expect(spy).toHaveBeenCalled();
  });

  it('isMoving should return a boolean if one of the arrow is true', () => {
    let returnValue = service.isMoving();
    expect(returnValue).toBe(false);

    service.arrowHandler.set(KEY_CODE.ARROW_DOWN, true);
    returnValue = service.isMoving();
    expect(returnValue).toBe(true);
  });

  it('moveSelectedShapes should move the shapes', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.firstOriginCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.moveCoords = {x: 0, y: 0};
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;
    selection.newSelectionStack[0] = shapeDes;
    selection.newSelectionStack[1] = shapeDes;
    let position = 50;
    const coordinate: Coordinate = {x: position, y: position};
    selection.coordinates[0] = {x: 0, y: 0};
    selection.coordinates[1] = {x: 100, y: 100};
    const updateSpy = spyOn (selection, 'updateCoordinates').and.callThrough();
    service.moveSelectedShapes(coordinate, drawingArea, 0 , 0, selection);
    expect(updateSpy).toHaveBeenCalled();
    expect(selection.moved).toBe(true);

    service.moveSelectedShapes(coordinate, drawingArea, 3 , 0, selection);
    expect(selection.coordinates[0]).toEqual({x: 53, y: 50});
  });

  it('getEmittedValueShapeStackEmpty should return the event', () => {
    service.changeShapeStackEmpty(true);
    const returnValue = service.getEmittedValueShapeStackEmpty();
    expect(returnValue).toBe(service.isSelectionStackEmpty);
  });

});
