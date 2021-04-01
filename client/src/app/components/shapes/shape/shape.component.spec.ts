import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { ShapeModification } from 'src/app/classes/shape-modification';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { SELECT_SHAPE_TYPE } from 'src/app/services/enum/shape-type';
import { ShapeComponent } from './shape.component';

  // Required to test edge cases
  // tslint:disable: no-magic-numbers
describe('ShapeComponent', () => {
  let component: ShapeComponent;
  let fixture: ComponentFixture<ShapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.description = new ShapeDescription();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('paint should return a boolean and update the fill or the stroke color', () => {
    component.description.modificaton.shapeType = SELECT_SHAPE_TYPE.FILL;
    component.description.drawType = SELECT_DRAWING_TYPE.FILL;
    const fillSpy = spyOn(component.description, 'updateFill').and.callThrough();
    let returnValue = component.paint(true);
    expect(fillSpy).toHaveBeenCalled();
    expect(returnValue).toBe(true);

    component.description.drawType = SELECT_DRAWING_TYPE.FILL;
    const strokeSpy = spyOn(component.description, 'updateStroke').and.callThrough();
    returnValue = component.paint(false);
    expect(strokeSpy).toHaveBeenCalled();
    expect(returnValue).toBe(false);
  });

  it('isRed should return a bool', () => {
    const returnValue = component.isRed();
    expect(returnValue).toBe(false);
  });

  it('getRed should return a red color in string', () => {
    component.description.drawType = SELECT_DRAWING_TYPE.BORDER;
    component.description.strokeColor = 'rgb(225,0,0)';
    let returnValue = component.getRed();
    expect(returnValue).toEqual('rgb(200,0,0)');

    component.description.drawType = SELECT_DRAWING_TYPE.FILL;
    component.description.fillColor = 'rgb(199,0,0)';
    returnValue = component.getRed();
    expect(returnValue).toEqual('rgb(255,0,0)');
  });

  it('isErase should return a bool', () => {
    let returnValue = component.isErase();
    expect(returnValue).toBe(false);
    component.description.modificaton = new ShapeModification();
    returnValue = component.isErase();
    expect(returnValue).toBe(false);
  });

  it('over should change the isRed to true', () => {
    component.description.isRed = false;
    component.over();
    expect(component.description.isRed).toBe(true);
  });

  it('leave should change the isRed to false', () => {
    component.description.isRed = true;
    component.leave();
    expect(component.description.isRed).toBe(false);
  });

  it('isVisible should return a bool', () => {

    let returnValue = component.isVisible();
    expect(returnValue).toBe(true);

    component.description.fillColor = 'none';
    component.description.strokeColor = 'none';
    returnValue = component.isVisible();
    expect(returnValue).toBe(false);

    component.description.fillColor = 'rgb(10,10,10)';
    component.description.strokeColor = 'rgb(10,10,10)';
    returnValue = component.isVisible();
    expect(returnValue).toBe(true);
  });

  it('getEtra should return a number', () => {
    component.description.modificaton = new ShapeModification();
    component.description.modificaton.lineWidth = 10;
    const returnValue = component.getEtra();
    expect(returnValue).toBe(10);
  });

  it('getEvent should return a string', () => {
    component.description.drawType = SELECT_DRAWING_TYPE.BORDER;
    let returnValue = component.getEvent();
    expect(returnValue).toBe('stroke');

    component.description.drawType = SELECT_DRAWING_TYPE.FILL;
    returnValue = component.getEvent();
    expect(returnValue).toBe('fill');

    component.description.drawType = SELECT_DRAWING_TYPE.BORDER_FILL;
    returnValue = component.getEvent();
    expect(returnValue).toBe('all');
  });

  it('shapeIsClicked should set the shapeClicked to true', () => {
    component.shapeIsClicked();
    expect(component.description.shapeClicked).toBe(true);
  });

});
