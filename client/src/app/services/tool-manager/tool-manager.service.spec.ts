import { TestBed } from '@angular/core/testing';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { AppModule } from '../../../app/app.module';
import { DrawingAreaComponent } from '../../components/drawing-work-place/drawing-area/drawing-area.component';
import { ShapeComponent } from '../../components/shapes/shape/shape.component';
import { SELECT_DRAWING_TYPE } from '../enum/drawing-type';
import { SELECT_PATTERN } from '../enum/select-pattern';
import { SELECT_TOOLS } from '../enum/select-tool';
import { PolygonTool } from '../tools/polygon-tool.service';
import { Tool } from '../tools/tool.service';
import { ToolManagerService } from './tool-manager.service';

// Use of specific numbers to test edge cases
// tslint:disable: no-magic-numbers
describe('ToolManagerService', () => {
  let service: ToolManagerService;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [DrawingAreaComponent, ShapeComponent]
  }));

  beforeEach(() => {
    service = TestBed.get(ToolManagerService);
    drawingArea = TestBed.get(DrawingAreaComponent);
    service.toolOnUse = jasmine.createSpyObj('ToolManagerService',
    ['onMouseMove', 'onMouseDown', 'onMouseUp', 'onMouseClick', 'onMouseDoubleClick', 'updateCoordinates', 'setupSelectionCoords',
    'onEscapeKey', 'onBackspaceKey', 'onMouseMove', 'onKeyPress', 'onControlAKey', 'onKeyUp', 'onMouseOut', 'onWheelScroll'] );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Mouse Moving should call onMouseMove in the service ', () => {
    service.toolOnUse = service.pencilTool;
    ShapeDescription.texture = 1;
    const serviceSpy = spyOn(service.toolOnUse, 'onMouseMove');
    const  mockMouseEvent = new MouseEvent('mousemove');

    service.onMouseEvent(mockMouseEvent, drawingArea);
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('Mouse down should call onMouseDown in the service', () => {
    // Testing Mouse down
    drawingArea.screenHeight = 1500;
    drawingArea.screenWidth = 1550;
    let mockMouseEvent = new MouseEvent('mousedown');

    service.onMouseEvent(mockMouseEvent, drawingArea);
    expect(service.toolOnUse.onMouseDown).toHaveBeenCalled();

    mockMouseEvent = new MouseEvent('mousedown', {button: 2});
    service.mouseIsOut = false;
    service.toolOnUse = service.selectionTool;
    const serviceSpy = spyOn (service.toolOnUse, 'onRightClick').and.callThrough();
    service.onMouseEvent(mockMouseEvent, drawingArea);
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('Mouse up should call onMouseUp in the service', () => {
    // Testing Mouse Up
    drawingArea.screenHeight = 1500;
    drawingArea.screenWidth = 1550;
    const mockMouseEvent = new MouseEvent('mouseup');

    service.onMouseEvent(mockMouseEvent, drawingArea);
    expect(service.toolOnUse.onMouseUp).toHaveBeenCalled();
  });

  it('Mouse Click should call onMouseClick in the service', () => {
    // Testing Mouse Click
    drawingArea.screenHeight = 1500;
    drawingArea.screenWidth = 1550;
    const mockMouseEvent = new MouseEvent('click');

    service.onMouseEvent(mockMouseEvent, drawingArea);
    expect(service.toolOnUse.onMouseClick).toHaveBeenCalled();
  });

  it('Mouse Double Click should call onMouseDoubleClick in the service', () => {
    // Testing Mouse DoubleClick
    drawingArea.screenHeight = 1500;
    drawingArea.screenWidth = 1550;
    const mockMouseEvent = new MouseEvent('dblclick');

    service.onMouseEvent(mockMouseEvent, drawingArea);
    expect(service.toolOnUse.onMouseDoubleClick).toHaveBeenCalled();
  });

  it('Mouse leave should call onMouseOut in the service', () => {
    // Testing Mouse DoubleClick
    drawingArea.screenHeight = 1500;
    drawingArea.screenWidth = 1550;
    const mockMouseEvent = new MouseEvent('mouseleave');

    service.onMouseEvent(mockMouseEvent, drawingArea);
    expect(service.toolOnUse.onMouseOut).toHaveBeenCalled();
  });

  it('onKeyUpEvent() should call correctly the good method (Escape)', () => {
    const mockKeyEvent = new KeyboardEvent ('keyup', {key: 'Escape'});
    service.onKeyUpEvent(mockKeyEvent, drawingArea);
    expect(service.toolOnUse.onEscapeKey).toHaveBeenCalled();
  });

  it('onKeyUpEvent() should call correctly the good method(Shift)', () => {
    const mockKeyEvent = new KeyboardEvent ('keyup', {key: 'Shift'});

    service.toolOnUse.isShiftDown = true;

    service.onKeyUpEvent(mockKeyEvent, drawingArea);
    expect(service.toolOnUse.isShiftDown).toBe(false);
    expect(service.toolOnUse.updateCoordinates).toHaveBeenCalled();
  });

  it('onKeyUpEvent() should call correctly the good method(ArrowKey)', () => {
    const mockKeyEvent = new KeyboardEvent ('keyup', {key: 'ArrowLeft'});

    service.toolOnUse.isShiftDown = false;

    service.onKeyUpEvent(mockKeyEvent, drawingArea);
    expect(service.toolOnUse.onKeyUp).toHaveBeenCalled();
  });

  it('onKeyDownEvent() should call correctly the good method (BACKSPACE)', () => {
    const mockKeyEvent = new KeyboardEvent ('keyup', {key: 'Backspace'});
    service.onKeyDownEvent(mockKeyEvent, drawingArea);
    expect(service.toolOnUse.onBackspaceKey).toHaveBeenCalled();
  });

  it('onKeyDownEvent() should call correctly the good method(Shift)', () => {
    const mockKeyEvent = new KeyboardEvent ('keydown', {key: 'Shift'});
    service.toolOnUse.isShiftDown = false;

    service.onKeyDownEvent(mockKeyEvent, drawingArea);
    expect(service.toolOnUse.isShiftDown).toBe(true);
    expect(service.toolOnUse.updateCoordinates).toHaveBeenCalled();
  });

  it('onKeyDownEvent() should call correctly the good method(ArrowUp)', () => {
    const mockKeyEvent = new KeyboardEvent ('keydown', {key: 'ArrowUp'});
    const eventSpy = spyOn (mockKeyEvent, 'preventDefault').and.callThrough();

    service.onKeyDownEvent(mockKeyEvent, drawingArea);
    expect(eventSpy).toHaveBeenCalled();
    expect(service.toolOnUse.onKeyPress).toHaveBeenCalled();
  });

  it('onKeyDownEvent() should call correctly the good method(a)', () => {
    const mockKeyEvent = new KeyboardEvent ('keydown', {key: 'a', ctrlKey: true});

    service.onKeyDownEvent(mockKeyEvent, drawingArea);
    expect(service.toolOnUse.onControlAKey).toHaveBeenCalled();
  });

  it('onKeyDownEvent() should call correctly the good method(alt)', () => {
    const mockKeyEvent = new KeyboardEvent ('keydown', {altKey: true});

    service.onKeyDownEvent(mockKeyEvent, drawingArea);
    expect(service.toolOnUse.isAltDown).toBe(true);
  });

  it('selectPattern should select the good pattern', () => {
    let pattern: SELECT_PATTERN = SELECT_PATTERN.PENCIL_PATTERN;
    service.selectPattern(pattern);
    expect(service.brushPattern).toBe('pencilPattern');

    pattern = SELECT_PATTERN.PATTERN1;
    service.selectPattern(pattern);
    expect(service.brushPattern).toBe('pattern1');

    pattern = SELECT_PATTERN.PATTERN2;
    service.selectPattern(pattern);
    expect(service.brushPattern).toBe('pattern2');

    pattern = SELECT_PATTERN.PATTERN3;
    service.selectPattern(pattern);
    expect(service.brushPattern).toBe('pattern3');

    pattern = SELECT_PATTERN.PATTERN4;
    service.selectPattern(pattern);
    expect(service.brushPattern).toBe('pattern4');

    pattern = SELECT_PATTERN.PATTERN5;
    service.selectPattern(pattern);
    expect(service.brushPattern).toBe('pattern5');
  });

  it('selectTool should select the good tool', () => {
    service.toolOnUse = new Tool();
    let tool: SELECT_TOOLS = SELECT_TOOLS.RECTANGLE;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.rectangleTool);

    tool = SELECT_TOOLS.LINE;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.lineTool);

    tool = SELECT_TOOLS.PENCIL;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.pencilTool);

    tool = SELECT_TOOLS.BRUSH;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.pencilTool);

    tool = SELECT_TOOLS.POLYGONE;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.polygoneTool);

    tool = SELECT_TOOLS.SPRAY;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.sprayTool);

    tool = SELECT_TOOLS.ELLIPSE;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.ellipseTool);

    tool = SELECT_TOOLS.FILL;
    service.selectTool(tool);
    expect(service.toolOnUse).toEqual(service.filler);

    tool = SELECT_TOOLS.ERASE;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.eraserTool);

    tool = SELECT_TOOLS.SELECTION;
    service.selectTool(tool);
    expect(service.toolOnUse).toBe(service.selectionTool);
  });

  it('newPolyMatrix should set a new Polygontool', () => {
    service.newPolyMatrix();
    expect(service.toolOnUse).toEqual(new PolygonTool(ShapeDescription.nbSide));
  });

  it('onWheelScroll should call onWheelScroll and setupSelectionCoords', () => {
    const wheelEvent = new WheelEvent('up', {deltaY: 100});
    const shapeDes = new ShapeDescription();
    shapeDes.coordinates = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.originCoords = [{x: 0, y: 0}, {x: 0, y: 0}];
    shapeDes.shapeClicked = true;
    shapeDes.drawType = SELECT_DRAWING_TYPE.BORDER;
    drawingArea.newShapeStack[0] = shapeDes;
    drawingArea.newShapeStack[1] = shapeDes;

    service.onWheelScroll(wheelEvent, drawingArea);
    expect(service.toolOnUse.onWheelScroll).toHaveBeenCalled();
    expect(service.toolOnUse.setupSelectionCoords).toHaveBeenCalled();

  });

  it('getEmittedTool should return the event<number>', () => {
    service.changeTool(4);
    const returnValue = service.getEmittedTool();
    expect(returnValue).toBe(service.activeTool);
  });
});
