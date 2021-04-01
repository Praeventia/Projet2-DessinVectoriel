import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_DRAWING_TYPE } from '../enum/drawing-type';
import { KEY_CODE } from '../enum/key-code';
import { GridService } from '../grid-service/grid.service';
import { Coordinate } from '../interfaces/coordinate';
import { RotationService } from '../rotation/rotation.service';
import { SelectMovementService } from '../select-movement/select-movement.service';
import { SelectionToolService } from './selection-tool.service';

// Using Specefic value for the test
// tslint:disable: no-magic-numbers
// Can't initialize matdialog with specific value
// tslint:disable: prefer-const
// tslint:disable: max-file-line-count
describe('SelectionToolService', () => {
  let service: SelectionToolService;
  let drawingArea: DrawingAreaComponent;
  let matDialog: MatDialog;
  let selectMovement: SelectMovementService;
  let rotation: RotationService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingAreaComponent, {provide: MatDialog, useValue: matDialog}, GridService],
  }));

  beforeEach(() => {
    service = TestBed.get(SelectionToolService);
    drawingArea = TestBed.get(DrawingAreaComponent);
    selectMovement = TestBed.get(SelectMovementService);
    rotation = TestBed.get(RotationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onKeyPress should handle the arrow keys', () => {
    const keyPress = new KeyboardEvent('keypress', {key: KEY_CODE.ARROW_UP});
    const selectSpy = spyOn (selectMovement, 'onKeyPress').and.callThrough();
    const movingSpy = spyOn (selectMovement, 'isMoving').and.callThrough();
    const jsonSpy = spyOn (JSON, 'parse').and.callThrough();
    const spy = spyOn (window, 'setTimeout').and.callThrough();
    service.newSelectionStack.push(new ShapeDescription());
    service.onKeyPress(keyPress, drawingArea);
    expect(movingSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
    expect(jsonSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('onKeyUp should call selectMovement.onKeyUp and send ShapeModfi', () => {
    const keyPress = new KeyboardEvent('keyup', {key: KEY_CODE.ARROW_UP});
    const selectSpy = spyOn (selectMovement, 'onKeyUp').and.callThrough();
    const movingSpy = spyOn (selectMovement, 'isMoving').and.callThrough();
    const spy = spyOn (service, 'sendShapeModif').and.callThrough();
    service.onKeyUp(keyPress, drawingArea);
    expect(movingSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(service.firstTime).toBe(true);
  });

  it('onControlAKey should call three methods', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    drawingArea.newShapeStack[0] = shapeDes;
    const resetSpy = spyOn (service, 'resetSelection').and.callThrough();
    const selectSpy = spyOn (service, 'selectShapes').and.callThrough();
    const spy = spyOn (service, 'changeTotalSelectionSize').and.callThrough();
    service.onControlAKey(drawingArea);
    expect(resetSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('onMouseDown should verify if a shape is clicked', () => {
    service.isDrawing = false;
    service.inversion = true;
    const position = 0;
    const coordinate: Coordinate = {x: position, y: position};
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;

    const unselectSpy = spyOn (service, 'checkIfUnselectedShapeClicked').and.callThrough();
    const drawSpy = spyOn (drawingArea, 'getShape').and.callThrough();
    const selectionSpy = spyOn (service, 'checkIfSelectionClicked').and.callThrough();

    service.onMouseDown(coordinate, drawingArea);
    expect(unselectSpy).toHaveBeenCalled();
    expect(drawSpy).toHaveBeenCalledTimes(2);
    expect(selectionSpy).toHaveBeenCalled();

    service.inversion = false;
    service.isDrawing = false;
    const resetspy = spyOn (service, 'resetSelection').and.callThrough();
    service.onMouseDown(coordinate, drawingArea);
    expect(resetspy).toHaveBeenCalled();

    service.isDrawing = true;
    service.selectionClicked = true;
    service.newSelectionStack[0] = shapeDes;
    const jsonSpy = spyOn (JSON, 'parse').and.callThrough();
    service.onMouseDown(coordinate, drawingArea);
    expect(jsonSpy).toHaveBeenCalled();
  });

  it('onMouseMove should update the coordinate or move the shape', () => {
    service.isDrawing = true;
    service.inversion = true;
    const position = 0;
    const coordinate: Coordinate = {x: position, y: position};
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;

    const resetSpy = spyOn (service, 'resetSelection').and.callThrough();
    const updateSpy = spyOn (service, 'updateCoordinates').and.callThrough();
    service.onMouseMove(coordinate, drawingArea, false);
    expect(resetSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();

    service.isDrawing = false;
    service.selectionClicked = true;
    const moveSpy = spyOn (service, 'moveSelectedShapes').and.callThrough();
    service.onMouseMove(coordinate, drawingArea, false);
    expect(moveSpy).toHaveBeenCalled();
  });

  it('onMouseUp should set up the next shape', () => {
    service.isDrawing = true;
    service.inversion = false;
    const position = 0;
    const coordinate: Coordinate = {x: position, y: position};
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;

    const mathSpy = spyOn(Math, 'round').and.callThrough();
    const resetSpy = spyOn (service, 'resetSelection').and.callThrough();
    const setUpSpy = spyOn (service, 'setupSelectionOrigin').and.callThrough();
    const selectSpy = spyOn (service, 'selectShapes').and.callThrough();
    const changeSpy = spyOn (service, 'changeTotalSelectionSize').and.callThrough();

    const shape = drawingArea.newShapeStack[0] as ShapeDescription;
    service.onMouseUp(coordinate, drawingArea);
    expect(mathSpy).toHaveBeenCalledTimes(4);
    expect(resetSpy).toHaveBeenCalled();
    expect(setUpSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
    expect(changeSpy).toHaveBeenCalled();
    expect(shape.shapeClicked).toBe(false);

    service.selectionClicked = true;
    service.inversion = true;
    const sendSpy = spyOn(service, 'sendShapeModif').and.callThrough();
    service.onMouseUp(coordinate, drawingArea);
    expect(sendSpy).toHaveBeenCalled();

    service.totalShapesSelected = 0;
    service.onMouseUp(coordinate, drawingArea);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('checkIfUnselectedShapeClicked should check if a unselectedShape is clicked', () => {
    service.inversion = false;
    const position = 0;
    const coordinate: Coordinate = {x: position, y: position};
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;

    const addSpy = spyOn (service, 'addSelectedShape').and.callThrough();
    const setUpSpy = spyOn (service, 'setupTotalSelectionSize').and.callThrough();
    const totalSpy = spyOn (service, 'changeTotalSelectionSize').and.callThrough();

    let returnValue = service.checkIfUnselectedShapeClicked(coordinate, drawingArea);
    expect(addSpy).toHaveBeenCalled();
    expect(setUpSpy).toHaveBeenCalled();
    expect(totalSpy).toHaveBeenCalled();
    expect(returnValue).toBe(true);

    service.inversion = true;
    const inverseSpy = spyOn (service, 'inverseClickFillStack').and.callThrough();
    returnValue = service.checkIfUnselectedShapeClicked(coordinate, drawingArea);
    expect(inverseSpy).toHaveBeenCalled();
    expect(setUpSpy).toHaveBeenCalled();
    expect(totalSpy).toHaveBeenCalled();
    expect(returnValue).toBe(true);

    service.inversion = true;
    shapeDes.shapeClicked = false;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;
    returnValue = service.checkIfUnselectedShapeClicked(coordinate, drawingArea);
    expect(returnValue).toBe(true);

    service.inversion = false;
    shapeDes.shapeClicked = false;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;
    returnValue = service.checkIfUnselectedShapeClicked(coordinate, drawingArea);
    expect(returnValue).toBe(false);
  });

  it('inverseClickFillStack should add the unclicked shape', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;

    const addSpy = spyOn (service, 'addSelectedShape').and.callThrough();
    service.inverseClickFillStack(new ShapeDescription(), drawingArea);
    expect(addSpy).toHaveBeenCalled();
  });

  it('checkIfSelectionClicked should check if we have clicked in the selection region', () => {
    let position = 50;
    const coordinate: Coordinate = {x: position, y: position};

    let returnValue = service.checkIfSelectionClicked(coordinate);
    expect(returnValue).toBe(false);
    service.coordinates[0] = {x: 0, y: 0};
    service.coordinates[1] = {x: 100, y: 100};
    returnValue = service.checkIfSelectionClicked(coordinate);
    expect(returnValue).toBe(true);

  });

  it('moveSelectedShapes should call selectMovement.moveSelectedShapes ', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.firstOriginCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.moveCoords = {x: 0, y: 0};
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;
    service.newSelectionStack[0] = shapeDes;
    service.newSelectionStack[1] = shapeDes;
    let position = 50;
    const coordinate: Coordinate = {x: position, y: position};
    service.coordinates[0] = {x: 0, y: 0};
    service.coordinates[1] = {x: 100, y: 100};

    const moveSpy = spyOn (selectMovement, 'moveSelectedShapes').and.callThrough();
    service.moveSelectedShapes(coordinate, drawingArea, 0 , 0);
    expect(moveSpy).toHaveBeenCalled();

  });

  it('selectShapes should should add the shape in the shapestack', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;
    service.coordinates[0] = {x: 0, y: 0};
    service.coordinates[1] = {x: 1, y: 1};

    const setUpSpy = spyOn (service, 'setupSelectionConditions').and.callThrough();
    const totalSpy = spyOn (service, 'setupTotalSelectionSize').and.callThrough();
    const addSpy = spyOn (service, 'addSelectedShape').and.callThrough();

    service.inversion = true;
    service.selectShapes(drawingArea, false);
    expect(setUpSpy).toHaveBeenCalled();
    expect(totalSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();

    service.inversion = false;
    service.selectShapes(drawingArea, true);
    expect(addSpy).toHaveBeenCalled();
  });

  it('selectOneShape should add the shape in the stack', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;

    const addSpy = spyOn (service, 'addSelectedShape').and.callThrough();
    service.selectOneShape(drawingArea);
    expect(addSpy).toHaveBeenCalled();
  });

  it('setupSelectionConditions should return a boolean', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;

    const spy = spyOn (selectMovement, 'setupSelectionConditions').and.callThrough();

    service.setupSelectionConditions(shapeDes);
    expect(spy).toHaveBeenCalled();
  });

  it('addSelectedShape should add the select shape in the stack', () => {
    const shapeDes = new ShapeDescription();
    service.addSelectedShape(shapeDes);
    expect(service.totalShapesSelected).toBe(1);
  });

  it('setupTotalSelectionSize should set up the selection value', () => {
    const spy = spyOn (selectMovement, 'setupTotalSelectionSize').and.callThrough();
    service.setupTotalSelectionSize(drawingArea);
    expect(spy).toHaveBeenCalled();
  });

  it('changeTotalSelectionSize should setup the totalselectionsize and update the coordinate', () => {
    const spy = spyOn (service, 'updateCoordinates').and.callThrough();
    service.changeTotalSelectionSize(drawingArea);
    expect(spy).toHaveBeenCalled();
  });

  it('setupSelectionOrigin should setup the selection origin', () => {
    service.coordinates = [{x: 100, y: 100}, {x: 0, y: 0}];
    service.setupSelectionOrigin();
    expect(service.coordinates[1]).toEqual({x: 100, y: 100});
  });

  it('onRightClick should setup inversion to true', () => {
    const position = 0;
    const coordinate: Coordinate = {x: position, y: position};
    service.onRightClick(coordinate, drawingArea);
    expect(service.inversion).toBe(true);
  });

  it('reset should reset the attributs', () => {
    service.resetSelection(drawingArea);
    expect(service.coordinates).toEqual([{x: 0, y: 0}, {x: 0, y: 0}]);
    expect(service.newSelectionStack).toEqual([]);
    expect(service.totalShapesSelected).toBe(0);
    expect(service.selectionClickCoord).toEqual({x: 0, y: 0});
  });

  it('sendShapeModif should setup the shapeModif for the undo/redo', () => {
    service.moved = true;
    service.modification = new ShapeModification();
    service.newSelectionStack[0] = new ShapeDescription();
    service.oldPositionSelectionStack[0] = new ShapeDescription();
    const finishSpy = spyOn (service, 'finish').and.callThrough();
    const startSpy = spyOn (service, 'start').and.callThrough();
    service.sendShapeModif(drawingArea);
    expect(finishSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalled();
  });

  it('onWheelScroll should call rotation.onWheelScroll', () => {
    const wheelEvent = new WheelEvent('up', {deltaY: 100});
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.firstOriginCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.moveCoords = {x: 0, y: 0};
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    service.newSelectionStack[0] = shapeDes;
    service.modification = new ShapeModification();
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;

    const rotateSpy = spyOn(rotation, 'onWheelScroll').and.callThrough();
    service.onWheelScroll(wheelEvent, drawingArea);
    expect(rotateSpy).toHaveBeenCalled();
    service.isAltDown = true;
    service.onWheelScroll(wheelEvent, drawingArea);
    expect(rotateSpy).toHaveBeenCalled();
  });

});
