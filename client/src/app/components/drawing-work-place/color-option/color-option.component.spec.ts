import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_TOOLS } from 'src/app/services/enum/select-tool';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import { ColorOptionComponent } from './color-option.component';

// to test and spy on private method
// tslint:disable: no-any
// tslint:disable: prefer-const
describe('ColorOptionComponent', () => {
  let component: ColorOptionComponent;
  let fixture: ComponentFixture<ColorOptionComponent>;
  let matDialog: MatDialog;
  let managerSpy: jasmine.Spy<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorOptionComponent ],
      providers: [{provide: MatDialog, useValue: matDialog}, DrawingAreaComponent, ToolManagerService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    const manager = TestBed.get(ToolManagerService);
    managerSpy = spyOn(manager, 'selectTool');
    fixture = TestBed.createComponent(ColorOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setFrequency should change width and ShapeDescription width', () => {
    const frequency = 0;
    component.setFrequency(frequency);
    expect(component.frequency).toBe(frequency);
    expect(ShapeDescription.frequency).toBe(frequency);
  });

  it('setBackGroundColor should call interaction service sendBackgroundColor()', () => {
    const spy = spyOn(component.interactionService, 'sendBackgroundColor');
    component.setBackgroundcolor();
    expect(spy).toHaveBeenCalled();
  });

  it('polygon() should change the currentTool value', () => {

    component.fill();
    expect(component.currentTool).toBe(SELECT_TOOLS.FILL);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('polygon() should change the currentTool value', () => {

    component.bucket();
    expect(component.currentTool).toBe(SELECT_TOOLS.BUCKET);
    expect(managerSpy).toHaveBeenCalled();
  });

  it('polygon() should change the currentTool value', () => {

    component.dropper();
    expect(component.currentTool).toBe(SELECT_TOOLS.DROPPER);
    expect(managerSpy).toHaveBeenCalled();
  });

});
