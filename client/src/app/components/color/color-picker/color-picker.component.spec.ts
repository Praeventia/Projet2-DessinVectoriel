import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import SpyObj = jasmine.SpyObj;
import { MatDialog } from '@angular/material';
import { ColorService } from '../../../services/color-service/color.service';
import { ColorPickerComponent } from './color-picker.component';

// Use to test specefic value for the test
// tslint:disable: prefer-const
// tslint:disable: no-magic-numbers
describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let matDialog: MatDialog;
  let colorSpy: SpyObj<ColorService>;

  beforeEach(() => {
    colorSpy = jasmine.createSpyObj('ColorService',
    ['pickPrimary', 'pickSecondary', 'reset', 'getColor', 'getRGBA', 'switchColor', 'switchOldColor']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent],
      imports: [],
      providers: [{provide: MatDialog, useValue: matDialog}, {provide: ColorService, useValue: colorSpy}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getRGB() should return a string', () => {
    component.previousColors[0] = {r: 14, g: 35, b: 32};
    const returnValue = component.getRGB(0);
    expect(returnValue).toBe('rgb(14,35,32)');
  });

  it('#pickPrimary() should call colorService.pickPrimary()', () => {
    component.pickPrimary();
    expect(colorSpy.pickPrimary).toHaveBeenCalled();
  });

  it('#pickSecondary() should call colorService.pickSecondary()', () => {
    component.pickSecondary();
    expect(colorSpy.pickSecondary).toHaveBeenCalled();
  });

  it('#switchColor() should call colorService.switchColor()', () => {
    component.switchColor();
    expect(colorSpy.switchColor).toHaveBeenCalled();
  });

  it('#switchOldColor() should call colorService.switchOldColor()', () => {
    component.switchOldColor(true, 4);
    expect(colorSpy.switchOldColor).toHaveBeenCalled();
  });

});
