import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ShapeHandler } from 'src/app/classes/shape-handler';
import { AutoSavedDrawing } from '../../../../../common/communication/auto-saved-drawing';
import { Drawing } from '../../../../../common/communication/drawing';
import { AppModule } from '../../../app/app.module';
import { AutoSaveService } from '../auto-save/auto-save.service';
import { ColorService } from '../color-service/color.service';
import { InteractionFormDrawingService } from './interaction-form-drawing.service';

// to test specific case
// tslint:disable: no-magic-numbers
// tslint:disable: prefer-const
// tslint:disable: no-string-literal
describe('InteractionFormDrawingService', () => {

  let behaviorSubject: BehaviorSubject<number>;
  let interactionService: InteractionFormDrawingService;
  let autoSaveService: AutoSaveService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [InteractionFormDrawingService, ColorService, AutoSaveService, {provide: BehaviorSubject, useValue: behaviorSubject}]});

    interactionService = TestBed.get(InteractionFormDrawingService);
    autoSaveService = TestBed.get(AutoSaveService);

  });

  it('should be created', () => {
    expect(interactionService).toBeTruthy();
  });

  it('#sendWidth() should call the next method', () => {
    const spy = spyOn(interactionService['width'], 'next');
    interactionService.sendWidth(10);
    expect(spy).toHaveBeenCalled();
  });

  it('#sendHeight() should call the next method', () => {
    const spy = spyOn(interactionService['height'], 'next');
    interactionService.sendHeight(10);
    expect(spy).toHaveBeenCalled();
  });

  it('#sendBackgroundColor() should call the next method', () => {
    const spy = spyOn(interactionService['backgroundColor'], 'next');
    interactionService.sendBackgroundColor('I\'m test');
    expect(spy).toHaveBeenCalled();
  });

  it('#sendShapeStack() should call the next method', () => {
    const spy = spyOn(interactionService['shapeStack'], 'next');
    const shapeHandler: ShapeHandler[] = [];
    shapeHandler.push(new ShapeHandler());
    interactionService.sendShapeStack(shapeHandler);
    expect(spy).toHaveBeenCalled();
  });

  it('isShapeStackEmpty should return a boolean', () => {
    const returnValue = interactionService.isShapeStackEmpty();
    expect(returnValue).toBe(false);
  });

  it('#sendWidth() should call the saveWidth() method of AutoSaveService', () => {
    const saveWidthSpy = spyOn(autoSaveService, 'saveWidth');
    interactionService.sendWidth(10);
    expect(saveWidthSpy).toHaveBeenCalled();
  });

  it('#sendHeight() should call the saveHeight() method of AutoSaveService', () => {
    const saveHeightSpy = spyOn(autoSaveService, 'saveHeight');
    interactionService.sendHeight(10);
    expect(saveHeightSpy).toHaveBeenCalled();
  });

  it('#sendBackgroundColor() should call the saveBackgroundColor() method of AutoSaveService', () => {
    const saveBackgroundColorSpy = spyOn(autoSaveService, 'saveBackgroundColor');
    interactionService.sendBackgroundColor('color');
    expect(saveBackgroundColorSpy).toHaveBeenCalled();
  });

  it('#saveShape() should call the saveShapeStack() method of AutoSaveService', () => {
    const saveShapesSpy = spyOn(autoSaveService, 'saveShapes');
    interactionService.saveShape([]);
    expect(saveShapesSpy).toHaveBeenCalled();
  });

  it('#loadDrawingFromServer() should call send methods and saveShape() with the right arguments for each method', () => {
    const sendWidthSpy = spyOn(interactionService, 'sendWidth');
    const sendHeightSpy = spyOn(interactionService, 'sendHeight');
    const sendBackgroundColorSpy = spyOn(interactionService, 'sendBackgroundColor');
    const sendShapeStackSpy = spyOn(interactionService, 'sendShapeStack');
    const saveShapeSpy = spyOn(interactionService, 'saveShape');

    const drawing: Drawing = {
      id: '1',
      name: 'name',
      tags: ['tag1', 'tag2'],
      backgroundColor: 'color',
      width: 1,
      height: 2,
      shapes: '{}',
      drawingURI: 'URI'
    };
    interactionService.loadDrawingFromServer(drawing);
    expect(sendWidthSpy).toHaveBeenCalledWith(drawing.width);
    expect(sendHeightSpy).toHaveBeenCalledWith(drawing.height);
    expect(sendBackgroundColorSpy).toHaveBeenCalledWith(drawing.backgroundColor);
    expect(sendShapeStackSpy).toHaveBeenCalledWith(JSON.parse(drawing.shapes));
    expect(saveShapeSpy).toHaveBeenCalledWith(JSON.parse(drawing.shapes));
  });

  it('#loadNewDrawing() should call send methods and saveShape() with the right arguments for each method', () => {
    const sendWidthSpy = spyOn(interactionService, 'sendWidth');
    const sendHeightSpy = spyOn(interactionService, 'sendHeight');
    const sendBackgroundColorSpy = spyOn(interactionService, 'sendBackgroundColor');
    const sendShapeStackSpy = spyOn(interactionService, 'sendShapeStack');
    const saveShapeSpy = spyOn(interactionService, 'saveShape');

    interactionService.loadNewDrawing('color', 1, 2);
    expect(sendWidthSpy).toHaveBeenCalledWith(1);
    expect(sendHeightSpy).toHaveBeenCalledWith(2);
    expect(sendBackgroundColorSpy).toHaveBeenCalledWith('color');
    expect(sendShapeStackSpy).toHaveBeenCalledWith([]);
    expect(saveShapeSpy).toHaveBeenCalledWith([]);
  });

  it('#loadAutoSavedDrawing() should call getAutoSavedDrawing()', () => {
    const drawing: AutoSavedDrawing = {
      backgroundColor: 'color',
      width: 1,
      height: 2,
      shapes: '{}'
    };
    const getAutoSavedDrawingSpy = spyOn(autoSaveService, 'getAutoSavedDrawing').and.returnValue(drawing); // return value?
    interactionService.loadAutoSavedDrawing();
    expect(getAutoSavedDrawingSpy).toHaveBeenCalled();
  });

  it('#loadAutoSavedDrawing() should call send methods with the right arguments for each method', () => {
    const sendWidthSpy = spyOn(interactionService, 'sendWidth');
    const sendHeightSpy = spyOn(interactionService, 'sendHeight');
    const sendBackgroundColorSpy = spyOn(interactionService, 'sendBackgroundColor');
    const sendShapeStackSpy = spyOn(interactionService, 'sendShapeStack');
    const saveShapeSpy = spyOn(interactionService, 'saveShape');

    const drawing: AutoSavedDrawing = {
      backgroundColor: 'color',
      width: 1,
      height: 2,
      shapes: '{}'
    };
    spyOn(autoSaveService, 'getAutoSavedDrawing').and.returnValue(drawing);
    interactionService.loadAutoSavedDrawing();
    expect(sendWidthSpy).toHaveBeenCalledWith(drawing.width);
    expect(sendHeightSpy).toHaveBeenCalledWith(drawing.height);
    expect(sendBackgroundColorSpy).toHaveBeenCalledWith(drawing.backgroundColor);
    expect(sendShapeStackSpy).toHaveBeenCalledWith(JSON.parse(drawing.shapes));
    expect(saveShapeSpy).toHaveBeenCalledWith(JSON.parse(drawing.shapes));
  });

  it('#canLoadAutoSavedDrawing() should return true if there is a drawing automatically saved', () => {
    spyOn(autoSaveService, 'isEmpty').and.returnValue(false);
    const returnValue = interactionService.canLoadAutoSavedDrawing();
    expect(returnValue).toBe(true);
  });

  it('#canLoadAutoSavedDrawing() should return false if there is no drawing automatically saved', () => {
    spyOn(autoSaveService, 'isEmpty').and.returnValue(true);
    const returnValue = interactionService.canLoadAutoSavedDrawing();
    expect(returnValue).toBe(false);
  });

});
