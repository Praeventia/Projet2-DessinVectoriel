import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { SELECT_DRAWING_TYPE } from '../enum/drawing-type';
import { GridService } from '../grid-service/grid.service';
import { SelectionToolService } from '../tools/selection-tool.service';
import { RotationService } from './rotation.service';

// Using Specefic value for the test
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// Can't initialize matdialog with specific value
// tslint:disable: prefer-const
describe('RotationService', () => {
  let service: RotationService;
  let drawingArea: DrawingAreaComponent;
  let matDialog: MatDialog;
  let selection: SelectionToolService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingAreaComponent, {provide: MatDialog, useValue: matDialog}, GridService],
  }));

  beforeEach(() => {
    service = TestBed.get(RotationService);
    drawingArea = TestBed.get(DrawingAreaComponent);
    selection = TestBed.get(SelectionToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('rotateShapes should rotate the shape', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.firstOriginCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.moveCoords = {x: 0, y: 0};
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    selection.newSelectionStack[0] = shapeDes;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;

    service['rotateShapes'](15, drawingArea, selection);
    expect(selection.moved).toBe(false);

    selection.isShiftDown = true;

    service['rotateShapes'](15, drawingArea, selection);
    expect(shapeDes).toEqual(shapeDes);
  });

  it('shapeSelectionCoordsRotate should translate and rotate', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.firstOriginCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.moveCoords = {x: 0, y: 0};
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    selection.newSelectionStack[0] = shapeDes;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;

    shapeDes.firstOriginCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    let retunrValue = service['shapeSelectionCoordsRotate'](shapeDes, 1, 1, selection);
    expect(retunrValue).toEqual([{x: 0, y: 0}, {x: 0, y: 0}]);

    shapeDes.firstOriginCoords = [{x: 1, y: 0}, {x: 0, y: 1}];
    retunrValue = service['shapeSelectionCoordsRotate'](shapeDes, 1, 1, selection);
    expect(retunrValue).toEqual([{x: 0, y: 0}, {x: 1, y: 1}]);

    shapeDes.firstOriginCoords = [{x: 0, y: 1}, {x: 1, y: 0}];
    retunrValue = service['shapeSelectionCoordsRotate'](shapeDes, 1, 1, selection);
    expect(retunrValue).toEqual([{x: 0, y: 0}, {x: 1, y: 1}]);
  });
});
