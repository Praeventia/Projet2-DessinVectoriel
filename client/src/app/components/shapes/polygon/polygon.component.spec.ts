import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_DRAWING_TYPE } from 'src/app/services/enum/drawing-type';
import { PolygonComponent } from './polygon.component';

describe('PolygonComponent', () => {
  let component: PolygonComponent;
  let fixture: ComponentFixture<PolygonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonComponent);
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

  it('coordinatesToString should return a string', () => {
    component.description.coordinates.push({x: 0, y: 0});
    const returnValue = component.coordinatesToString();
    expect(returnValue).toBe('0,0 ');
  });
});
