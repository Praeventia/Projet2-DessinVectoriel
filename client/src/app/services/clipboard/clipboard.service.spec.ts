import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { DrawingAreaComponent } from 'src/app/components/drawing-work-place/drawing-area/drawing-area.component';
import { GridService } from '../grid-service/grid.service';
import { SelectionToolService } from '../tools/selection-tool.service';
import { ClipboardService } from './clipboard.service';

// To test specific edge case
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: prefer-const
describe('ClipboardService', () => {
  let service: ClipboardService;
  let drawingArea: DrawingAreaComponent;
  let selection: SelectionToolService;
  let matDialog: MatDialog;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingAreaComponent, GridService, {provide: MatDialog, useValue: matDialog}],
  }));

  beforeEach(() => {
    service = TestBed.get(ClipboardService);
    drawingArea = TestBed.get(DrawingAreaComponent);
    selection = TestBed.get(SelectionToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('copy should copy the selection in the clipboard', () => {
    const jsonSpy = spyOn(JSON, 'stringify').and.callThrough();
    const clipboardSpy = spyOn (navigator.clipboard, 'writeText').and.callThrough();
    service.copy(drawingArea);
    expect(jsonSpy).toHaveBeenCalledTimes(2);
    expect(clipboardSpy).toHaveBeenCalledTimes(2);
  });

  it('paste should read the clipboard and send the info to pasteInStack', () => {
    const clipboardSpy = spyOn (navigator.clipboard, 'readText').and.returnValue(Promise.resolve('abs'));
    service.paste(drawingArea, selection);
    expect(clipboardSpy).toHaveBeenCalled();
  });

  it('dupliacte should define shapeMemory and call pastInStack', () => {
    const jsonSpy = spyOn(JSON, 'stringify').and.callThrough();
    const parseSpy = spyOn(JSON, 'parse').and.callThrough();
    const serviceSpy = spyOn (service, 'pasteInStack').and.callThrough();
    const shape = new ShapeDescription();
    shape.coordinates = [{x: 0, y: 0}, {x: 10, y: 10}];
    shape.originCoords = [{x: 0, y: 0}, {x: 10, y: 10}];
    service['shapeStack'].push(shape);
    service['shapeStack'].push(shape);
    selection.coordinates[1] = {x: 10, y: 10};

    service.duplicate(drawingArea, selection);
    expect(jsonSpy).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();

    const shapeMem = new ShapeDescription();
    shapeMem.coordinates = [{x: 10, y: 10}, {x: 0, y: 0}];
    service['shapeMemory'] = [];
    service['shapeMemory'].push(shapeMem);
    service['times'] = 3;
    drawingArea.screenWidth = 3;

    service.duplicate(drawingArea, selection);
    expect(jsonSpy).toHaveBeenCalled();
    expect(service['times']).toBe(2);
  });

  it('delete should call eraser.delete', () => {
    const deleteSpy = spyOn(service['eraser'], 'delete').and.callThrough();
    const startSpy = spyOn(service['eraser'], 'start').and.callThrough();
    const finishSpy = spyOn (service['eraser'], 'finish').and.callThrough();
    const shape = new ShapeDescription();
    shape.coordinates = [{x: 0, y: 0}, {x: 10, y: 10}];
    shape.originCoords = [{x: 0, y: 0}, {x: 10, y: 10}];
    service['shapeStack'].push(shape);
    drawingArea.newShapeStack.push(shape);
    drawingArea.newShapeStack.push(shape);

    service.delete(drawingArea);
    expect(deleteSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalled();
    expect(finishSpy).toHaveBeenCalled();
  });

  it('cut should call copy and delete', () => {
    const deleteSpy = spyOn(service, 'delete').and.callThrough();
    const copySpy = spyOn(service, 'copy').and.callThrough();

    service.cut(drawingArea);
    expect(deleteSpy).toHaveBeenCalled();
    expect(copySpy).toHaveBeenCalled();
  });
});
