import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { SELECT_DRAWING_TYPE } from '../../../services/enum/drawing-type';
import { Coordinate } from '../../../services/interfaces/coordinate';
import { LineComponent } from './line.component';

// Can't assign matDialog since it changes depending of the component
// tslint:disable: prefer-const
describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;
  let matDialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineComponent ],
      providers: [{provide: MatDialog, useValue: matDialog}]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.description = new ShapeDescription();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('coordinatesToString() should set a string to #points', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};

    component.description.coordinates.push(coordinate);
    component.description.coordinates.push(coordinate);

    const returnValue = component.coordinatesToString();
    expect(returnValue).toBe('100,100 100,100');
  });

  it('getRadius() should return dotRadius or 0', () => {
    component.description.drawType = SELECT_DRAWING_TYPE.DOT;
    let returnValue = component.getRadius();

    expect(returnValue).toBe(component.description.dotRadius);

    component.description.drawType = SELECT_DRAWING_TYPE.NO_DOT;
    returnValue = component.getRadius();

    expect(returnValue).toBe(0);
  });

});
