import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { EllipseComponent } from './ellipse.component';

describe('EllipseComponent', () => {
  let component: EllipseComponent;
  let fixture: ComponentFixture<EllipseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.description = new ShapeDescription();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getLineWitdh should return a number', () => {
    component.description.drawType = SELECT_DRAWING_TYPE.BORDER;
    let returnValue = component.getLineWidth();
    expect(returnValue).toBe(component.description.lineWidth);

    component.description.drawType = SELECT_DRAWING_TYPE.SELECTION;
    returnValue = component.getLineWidth();
    expect(returnValue).toBe(0);
  });

  it('getFill should return a string', () => {
    component.description.drawType = SELECT_DRAWING_TYPE.FILL;
    let returnValue = component.getFill();
    expect(returnValue).toBe(component.description.fillColor);

    component.description.drawType = SELECT_DRAWING_TYPE.SELECTION;
    returnValue = component.getFill();
    expect(returnValue).toBe('none');
  });

});
