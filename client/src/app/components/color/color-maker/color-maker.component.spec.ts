import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ColorService } from 'src/app/services/color-service/color.service';
import { ColorMakerComponent } from './color-maker.component';

// Testing edge cases where we need specific values or acces to private attributs
// tslint:disable: prefer-const
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
describe('ColorMakerComponent', () => {
  let component: ColorMakerComponent;
  let fixture: ComponentFixture<ColorMakerComponent>;
  let matDialogRef: MatDialogRef<ColorMakerComponent>;
  const injecterToken = MAT_DIALOG_DATA;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorMakerComponent ],
      providers: [{provide: MatDialogRef, useValue: matDialogRef},
                  {provide: MAT_DIALOG_DATA, useValue: injecterToken},
                  {provide: ColorService}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should call setValue()', () => {
    const componentSpy = spyOn(component, 'setValue').and.callThrough();
    component.ngOnInit();
    expect(componentSpy).toHaveBeenCalled();
  });

  it('#setCode() should return a string', () => {
    const hexToValueSpy = spyOn(component, 'hexToValue').and.callThrough();
    const valueToHex = spyOn(component, 'valueToHex').and.callThrough();
    const returnValue = component.setCode(component.red, 'F4');
    expect(hexToValueSpy).toHaveBeenCalled();
    expect(valueToHex).toHaveBeenCalled();
    expect(returnValue).toBe('F4');
  });

  it('#setValue() should change the value of color.value and color.code', () => {
    component.setValue(component.red, 132);
    expect(component.red.value).toBe(132);
    expect(component.red.code).toBe('84');
  });

  it('#setA() should change the #aValue', () => {
    component.setA(56);
    expect(component['aValue']).toBe(56);
    component.setA(-23);
    expect(component['aValue']).toBe(0);
    component.setA(145);
    expect(component['aValue']).toBe(100);
    component.setA(327e2);
    expect(component['aValue']).toBe(100);

  });

  it('#getRGB() should return a string', () => {
    let returnValue = component.getRGB();
    expect(returnValue).toBe('rgba(0,0,0,1)');
  });

  it('#getRGBA() should return a string', () => {
    let returnValue = component.getRGB();
    expect(returnValue).toBe('rgba(0,0,0,1)');
  });

  it('#getOpacity() should return a number', () => {
    const returnValue = component.getOpacity();
    expect(returnValue).toBe(1);
  });

  it('#valueToHex() should return a sting', () => {
    let returnValue = component.valueToHex(65);
    expect(returnValue).toBe('41');
    returnValue = component.valueToHex(-65);
    expect(returnValue).toBe('0');
    returnValue = component.valueToHex(265);
    expect(returnValue).toBe('FF');
  });

  it('#hexToValue() should return a number', () => {
    let returnValue = component.hexToValue('41');
    expect(returnValue).toBe(65);
    returnValue = component.hexToValue('FFF');
    expect(returnValue).toBe(255);
    returnValue = component.hexToValue('GHT');
    expect(returnValue).toBe(0);
    returnValue = component.hexToValue('-41');
    expect(returnValue).toBe(0);
  });
});
