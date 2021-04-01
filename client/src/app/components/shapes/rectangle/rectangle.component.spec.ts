import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { GridService } from 'src/app/services/grid-service/grid.service';
import { SELECT_DRAWING_TYPE } from '../../../services/enum/drawing-type';
import { RectangleComponent } from './rectangle.component';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleComponent ],
      providers: [MatDialog, GridService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.description = new ShapeDescription();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getLineWidth() should return retangle width', () => {
    let returnValue;
    component.description.drawType = SELECT_DRAWING_TYPE.SELECTION;
    returnValue = component.getLineWidth();
    expect(returnValue).toBe(2);

    component.description.drawType = SELECT_DRAWING_TYPE.FILL;
    returnValue = component.getLineWidth();
    expect(returnValue).toBe(0);

    component.description.drawType = SELECT_DRAWING_TYPE.BORDER;
    returnValue = component.getLineWidth();
    expect(returnValue).toBe(component.description.lineWidth);
  });

  it('getFill() should return retangle color', () => {
    let returnValue;
    component.isSelectionFilled = true;
    component.description.drawType = SELECT_DRAWING_TYPE.SELECTION;
    returnValue = component.getFill();
    expect(returnValue).toBe('rgba(108,108,108,0.3)');

    component.isSelectionFilled = false;
    returnValue = component.getFill();
    expect(returnValue).toBe('none');

    component.description.drawType = SELECT_DRAWING_TYPE.BORDER;
    returnValue = component.getFill();
    expect(returnValue).toBe('none');

    component.description.drawType = SELECT_DRAWING_TYPE.FILL;
    returnValue = component.getFill();
    expect(returnValue).toBe(component.description.fillColor);
  });

  it('getStroke() should return the stroke color', () => {
    let returnValue;
    component.description.drawType = SELECT_DRAWING_TYPE.SELECTION;
    returnValue = component.getStroke();
    expect(returnValue).toBe('rgba(108,108,108,1.0)');

    component.description.drawType = SELECT_DRAWING_TYPE.BORDER;
    returnValue = component.getStroke();
    expect(returnValue).toBe(component.description.strokeColor);
  });

  it('getDash() should return a string', () => {
    let returnValue;
    component.description.drawType = SELECT_DRAWING_TYPE.SELECTION;
    returnValue = component.getDash();
    expect(returnValue).toBe('4 3');

    component.description.drawType = SELECT_DRAWING_TYPE.BORDER;
    returnValue = component.getDash();
    expect(returnValue).toBe('0 0');
  });

});
