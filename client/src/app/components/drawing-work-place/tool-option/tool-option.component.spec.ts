import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { SELECT_TOOLS } from 'src/app/services/enum/select-tool';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import { ToolOptionComponent } from './tool-option.component';

// Use specific numbers to test edge cases
// tslint:disable: no-magic-numbers
// tslint:disable: prefer-const
// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('ToolOptionComponent', () => {

  let component: ToolOptionComponent;
  let fixture: ComponentFixture<ToolOptionComponent>;
  let matDialog: MatDialog;
  let managerSpy: jasmine.Spy<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolOptionComponent ],
      providers: [{provide: MatDialog, useValue: matDialog}, DrawingAreaComponent, ToolManagerService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    const manager = TestBed.get(ToolManagerService);
    managerSpy = spyOn(manager, 'selectTool');
    fixture = TestBed.createComponent(ToolOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setWitdh should change width and ShapeDescription width', () => {
    const width = 0;
    component.setWidth(width);
    expect(component['width']).toBe(width);
    expect(ShapeDescription.lineWidth).toBe(width);
  });

  it('setRadius should change radius and ShapeDescription width', () => {
    const radius = 0;
    component.setRadius(radius);
    expect(component['radius']).toBe(radius);
    expect(ShapeDescription.dotRadius).toBe(radius);
  });

  it('setnbSide should change nbSide and ShapeDescription nbSide', () => {
    const nbSide = '0';
    component.setNbSide(nbSide);
    expect(component['nbSide']).toBe(0);
    expect(ShapeDescription.nbSide).toBe(0);
  });

  it('setDrawType should change drawType and ShapeDescription drawType', () => {
    let drawType = SELECT_DRAWING_TYPE.BORDER_FILL;
    component.setDrawType(drawType);
    expect(ShapeDescription.drawType).toBe(drawType);

    drawType = SELECT_DRAWING_TYPE.FILL;
    component.setDrawType(drawType);
    expect(ShapeDescription.drawType).toBe(drawType);

    drawType = SELECT_DRAWING_TYPE.BORDER;
    component.setDrawType(drawType);
    expect(ShapeDescription.drawType).toBe(drawType);

    drawType = SELECT_DRAWING_TYPE.NO_DOT;
    component.setDrawType(drawType);
    expect(ShapeDescription.drawType).toBe(drawType);

    drawType = SELECT_DRAWING_TYPE.DOT;
    component.setDrawType(drawType);
    expect(ShapeDescription.drawType).toBe(drawType);
  });

  it('polygon() should change the currentTool value', () => {

    component.polygone();
    expect(component['currentShape']).toBe(SELECT_TOOLS.POLYGONE);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('ellipse() should change the currentTool value', () => {

    component.ellipse();
    expect(component['currentShape']).toBe(SELECT_TOOLS.ELLIPSE);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('rectengle() should change the currentTool value', () => {

    component.rectangle();
    expect(component['currentShape']).toBe(SELECT_TOOLS.RECTANGLE);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('line() should change the currentTool value', () => {

    component.line();
    expect(component['currentShape']).toBe(SELECT_TOOLS.LINE);
    expect(managerSpy).toHaveBeenCalled();
  });

});
