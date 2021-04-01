import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { SELECT_TOOLS } from '../../../services/enum/select-tool';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';
import { DrawingViewShapeBoxComponent } from './drawing-view-shape-box.component';

// Using specefic number for tests
// tslint:disable: no-magic-numbers
// tslint:disable: prefer-const
describe('DrawingViewShapeBoxComponent', () => {
  let component: DrawingViewShapeBoxComponent;
  let fixture: ComponentFixture<DrawingViewShapeBoxComponent>;
  let matDialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingViewShapeBoxComponent ],
      providers: [{provide: MatDialog, useValue: matDialog}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewShapeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#drawRectangle() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.drawRectangle();
    expect(component.currentShape).toBe(SELECT_TOOLS.RECTANGLE);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#drawLine() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.drawLine();
    expect(component.currentShape).toBe(SELECT_TOOLS.LINE);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#drawEllispe() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.drawEllispe();
    expect(component.currentShape).toBe(SELECT_TOOLS.ELLIPSE);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#drawPolygone() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.drawPolygone();
    expect(component.currentShape).toBe(SELECT_TOOLS.POLYGONE);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#setDrawTyp() should change the select_Drawing_type', () => {
    component.setDrawType(SELECT_DRAWING_TYPE.BORDER);
    expect(ShapeDescription.drawType).toBe(SELECT_DRAWING_TYPE.BORDER);
    component.setDrawType(SELECT_DRAWING_TYPE.BORDER_FILL);
    expect(ShapeDescription.drawType).toBe(SELECT_DRAWING_TYPE.BORDER_FILL);
    component.setDrawType(SELECT_DRAWING_TYPE.DOT);
    expect(ShapeDescription.drawType).toBe(SELECT_DRAWING_TYPE.DOT);
    component.setDrawType(SELECT_DRAWING_TYPE.FILL);
    expect(ShapeDescription.drawType).toBe(SELECT_DRAWING_TYPE.FILL);
    component.setDrawType(SELECT_DRAWING_TYPE.NO_DOT);
    expect(ShapeDescription.drawType).toBe(SELECT_DRAWING_TYPE.NO_DOT);

  });

  it('#setRadius() should change the dot radius', () => {
    component.setRadius(10);
    expect(component.inputRadius).toBe(10);
  });

  it('#setwidth() should change the width', () => {
    component.setWidthValue(10);
    expect(component.inputWidthValue).toBe(10);
  });

});
