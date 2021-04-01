import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_TOOLS } from 'src/app/services/enum/select-tool';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import { PenOptionComponent } from './pen-option.component';

// Use specific numbers to test edge cases
// tslint:disable: no-magic-numbers
// tslint:disable: prefer-const
// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('PenOptionComponent', () => {
  let component: PenOptionComponent;
  let fixture: ComponentFixture<PenOptionComponent>;
  let matDialog: MatDialog;
  let managerSpy: jasmine.Spy<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenOptionComponent ],
      providers: [{provide: MatDialog, useValue: matDialog}, DrawingAreaComponent, ToolManagerService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    const manager = TestBed.get(ToolManagerService);
    managerSpy = spyOn(manager, 'selectTool');
    fixture = TestBed.createComponent(PenOptionComponent);
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

  it('setFrequency should change radius and ShapeDescription frequency', () => {
    const frequency = 0;
    component.setFrequency(frequency);
    expect(component['frequency']).toBe(frequency);
    expect(ShapeDescription.frequency).toBe(frequency);
  });

  it('setnbTexture should change nbSide and ShapeDescription texture', () => {
    const texture = 0;
    component.setTexture(texture);
    expect(ShapeDescription.texture).toBe(texture);
  });

  it('brush() should change currentTool value', () => {
    component.brush();
    expect(component['currentTool']).toBe(SELECT_TOOLS.BRUSH);
  });

  it('eraser() should change the currentTool value', () => {

    component.eraser();
    expect(component['currentTool']).toBe(SELECT_TOOLS.ERASE);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('pen() should change the currentTool value', () => {

    component.pen();
    expect(component['currentTool']).toBe(SELECT_TOOLS.PENCIL);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('spray() should change the currentTool value', () => {

    component.spray();
    expect(component['currentTool']).toBe(SELECT_TOOLS.SPRAY);
    expect(managerSpy).toHaveBeenCalled();
  });

});
