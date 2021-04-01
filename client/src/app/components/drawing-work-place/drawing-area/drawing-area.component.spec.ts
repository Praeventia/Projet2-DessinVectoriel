import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeHandler } from 'src/app/classes/shape-handler';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { AutoSaveService } from 'src/app/services/auto-save/auto-save.service';
import SpyObj = jasmine.SpyObj;
import { GridService } from 'src/app/services/grid-service/grid.service';
import { SelectionToolService } from 'src/app/services/tools/selection-tool.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { ColorService } from '../../../services/color-service/color.service';
import { InteractionFormDrawingService } from '../../../services/interaction-form-drawing/interaction-form-drawing.service';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';
import { DrawingAreaComponent } from './drawing-area.component';

// to test edge case
// To have acces to private attributs
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: prefer-const
describe('DrawingAreaComponent', () => {
  let component: DrawingAreaComponent;
  let fixture: ComponentFixture<DrawingAreaComponent>;
  let matDialog: MatDialog;
  let toolManagerSpy: SpyObj<ToolManagerService>;
  let interac: InteractionFormDrawingService;
  let autoSave: AutoSaveService;

  beforeEach(() => {
    toolManagerSpy = jasmine.createSpyObj('ToolManagerService', [, 'onMouseEvent', 'onKeyUpEvent', 'onKeyDownEvent', 'onWheelScroll']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingAreaComponent ],
      imports: [],
      providers: [{provide: MatDialog , useValue: matDialog}, {provide: ToolManagerService, useValue: toolManagerSpy}, GridService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    autoSave = TestBed.get(AutoSaveService);
    const shapeHandler: ShapeDescription[] = [];
    const shape = new ShapeDescription();
    shapeHandler.push(shape);
    autoSave.saveShapes(JSON.stringify(shapeHandler));
    interac = TestBed.get(InteractionFormDrawingService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() should subscribe some value', () => {
    const interacHeightSpy = spyOn(interac.currentHeight, 'subscribe').and.callThrough();
    const interacWidthSpy = spyOn(interac.currentWidth, 'subscribe').and.callThrough();
    component.ngOnInit();
    expect(interacHeightSpy).toHaveBeenCalled();
    expect(interacWidthSpy).toHaveBeenCalled();
  });

  it('onMouseEvent() should call toolManager.onMouseEvent()', () => {
    const mockMouseEvent = new MouseEvent ('mouseup');
    component.onMouseEvent(mockMouseEvent);
    expect(toolManagerSpy.onMouseEvent).toHaveBeenCalled();
  });

  it('onKeyUpEvent() should call toolManager.onKeyDownEvent()', () => {
    const mockKeyEvent = new KeyboardEvent ('keyup', {key: 'arrowRight'});
    component.onKeyUpEvent(mockKeyEvent);
    expect(toolManagerSpy.onKeyUpEvent).toHaveBeenCalled();
  });

  it('onKeyDownEvent() should call toolManager.onKeyDownEvent()', () => {
    const mockKeyEvent = new KeyboardEvent ('keydown', {key: 'arrowRight'});
    component.onKeyDownEvent(mockKeyEvent);
    expect(toolManagerSpy.onKeyDownEvent).toHaveBeenCalled();
  });

  it('saveShape should add in the shapeStack if the shapeDescription is not empty', () => {
    const shape = new ShapeDescription();
    shape.coordinates = [{x: 0, y: 0}];
    component.newShapeLvl = 0;
    component.newShapeStack[0] = shape;
    component.saveShape();
    expect(component.newShapeLvl).toBe(1);
    expect(component.newShapeStack[0] as ShapeDescription).toEqual(shape);
  });

  it('getCurrentShape should return the current shape', () => {
    const shape =  new ShapeDescription();
    component.newShapeStack[0] = shape;
    component.newShapeLvl = 0;
    const returnValue = component.getShape();
    expect(returnValue).toEqual(shape);
  });

  it('getPrimaryColor should a rgba string', () => {
    const color = TestBed.get(ColorService);
    const colorSpy = spyOn(color, 'getRGBA').and.callThrough();
    component.getPrimaryColor(true);
    expect(colorSpy).toHaveBeenCalled();
  });

  it('newShape should add a new shape in the shapeStack', () => {
    const shapeDes = new ShapeDescription();
    const shape = new ShapeModification();
    shape.modifications.push([shapeDes, shapeDes.fillColor, shapeDes.fillColor]);
    component.newShapeStack.push(shapeDes);
    component.newShape(shape);
    expect(component.newShapeStack[2]).toBeUndefined();
  });

  it('getDescriptionStack should return the description', () => {
    const shapeDes = new ShapeDescription();
    shapeDes.fillColor = 'rgba(255,255,255,1)';
    shapeDes.strokeColor = 'rgba(255,255,255,1)';
    const returnValue = component.newShapeStack.push(shapeDes);
    component.getDescriptionStack(true);
    expect(returnValue).toBe(2);
  });

  it('setModification should modify the shapeDescription', () => {
    // tslint:disable-next-line: no-any
    component.newShapeStack = [];
    const shapeDes = new ShapeDescription();
    const shapeMod = new ShapeModification();
    shapeMod.modifications.push([shapeDes, shapeDes.fillColor, shapeDes.fillColor]);

    component.newShapeStack.push(shapeDes);
    component.setModification(shapeMod);
  });

  it('undo should call the undo method', () => {
    const undoRedo = TestBed.get(UndoRedoService);
    const selection = TestBed.get(SelectionToolService);
    const undoRedoSpy = spyOn(undoRedo, 'undo').and.callThrough();
    component.newShapeLvl = 1;
    component.newShapeStack.push(new ShapeDescription());
    component.undo(selection);
    expect(component.newShapeLvl).toBe(0);
    expect(undoRedoSpy).toHaveBeenCalled();
  });

  it('redo should call the redo method', () => {
    const undoRedo = TestBed.get(UndoRedoService);
    const selection = TestBed.get(SelectionToolService);
    const undoRedoSpy = spyOn(undoRedo, 'redo').and.callThrough();
    component.newShapeLvl = 1;
    component['undoRedoService'].futureIsEmpty = false;
    component.redo(selection);
    expect(component.newShapeLvl).toBe(2);
    expect(undoRedoSpy).toHaveBeenCalled();
  });

  it('getSvgNodeString should return a string', () => {
    component.newShapeStack = [];
    const noNewSvgElements = 5;
    for (let i = 0; i < noNewSvgElements; i++) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      component.svgContainer.nativeElement.appendChild(svg);
    }
    const svgNodeString = component.getSvgNodesString();
    expect(svgNodeString).toEqual(jasmine.any(String));
  });

  it('onWheelScroll should call toolmanager.onWheelScroll', () => {
    component.newShapeStack = [];
    component.newShapeStack[0] = new ShapeDescription();
    const mockWheelEvent = new WheelEvent ('up');
    component.onWheelScroll(mockWheelEvent);
    expect(toolManagerSpy.onWheelScroll).toHaveBeenCalled();
  });

  it('updateImage should update the shapeSatck', () => {
    component.newShapeStack = [];
    component.newShapeLvl = 0;
    component['updateImage'](component.newShapeStack);
    const value: ShapeHandler[] = [];
    value.push(new ShapeDescription());
    expect(component.newShapeStack).toEqual(value);
    expect(component.newShapeLvl).toBe(0);
  });

});
