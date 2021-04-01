import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_TOOLS } from '../../../services/enum/select-tool';
import { ToolManagerService } from '../../../services/tool-manager/tool-manager.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import { DrawingViewToolBoxComponent } from './drawing-view-tool-box.component';

// Use specific numbers to test edge cases
// tslint:disable: no-magic-numbers
// tslint:disable: prefer-const
// tslint:disable: no-string-literal
describe('DrawingViewToolBoxComponent', () => {
  let component: DrawingViewToolBoxComponent;
  let fixture: ComponentFixture<DrawingViewToolBoxComponent>;
  let matDialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingViewToolBoxComponent ],
      providers: [{provide: MatDialog, useValue: matDialog}, DrawingAreaComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewToolBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#drawPen() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.drawPen();
    expect(component['currentTool']).toBe(SELECT_TOOLS.PENCIL);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#stamp() should change the boolean value', () => {
    component.stamp();
    expect(component['currentTool']).toBe(SELECT_TOOLS.STAMP);
  });

  it('#feather() should change the boolean value', () => {
    component.feather();
    expect(component['currentTool']).toBe(SELECT_TOOLS.FEATHER);
  });

  it('#dropper() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');
    component.dropper();
    expect(component['currentTool']).toBe(SELECT_TOOLS.DROPPER);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#spray() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.spray();
    expect(component['currentTool']).toBe(SELECT_TOOLS.SPRAY);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#fill() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.fill();
    expect(component['currentTool']).toBe(SELECT_TOOLS.FILL);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#brush() should change the boolean value', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.brush();
    expect(component['currentTool']).toBe(SELECT_TOOLS.BRUSH);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('#setwidth() should change the width', () => {
    component.setWidthValue(10);
    expect(component['inputWidthValue']).toBe(10);
  });

  it('#setTexture() should change the texture', () => {
    component.setTexture(10);
    expect(ShapeDescription.texture).toBe(10);
  });

  it('#setFrequency() should change the width', () => {
    component.setFrequency(10);
    expect(component['frequency']).toBe(10);
    expect(ShapeDescription.frequency).toBe(10);
  });

  it('bucket should set the tool to bucket', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.bucket();
    expect(component['currentTool']).toBe(SELECT_TOOLS.BUCKET);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('erase should set the eraser', () => {
    const manager = TestBed.get(ToolManagerService);
    const managerSpy = spyOn(manager, 'selectTool');

    component.erase();
    expect(component['currentTool']).toBe(SELECT_TOOLS.ERASE);
    expect(managerSpy).toHaveBeenCalled();

  });
});
