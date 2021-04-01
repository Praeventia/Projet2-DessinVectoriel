import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ShapeDescription } from 'src/app/classes/shape-description';
import { Coordinate } from 'src/app/services/interfaces/coordinate';
import { PencilComponent } from './pencil.component';

// Testing specific values for test
// tslint:disable: no-magic-numbers
describe('PencilComponent', () => {
  let component: PencilComponent;
  let fixture: ComponentFixture<PencilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilComponent ],
      providers: [{provide: MatDialog}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.description = new ShapeDescription();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('coordinatesToString() should return transform Coordinates object into string', () => {
    const position = 100;
    const coordinate: Coordinate = {x: position, y: position};

    component.description.coordinates.push(coordinate);
    component.description.coordinates.push(coordinate);

    const returnValue = component.coordinatesToString();
    expect(returnValue).toBe('100,100 100,100 ');
  });

  it('ngOnInit() should set the filter', () => {
    component.description.texture = 1;
    component.ngOnInit();
    expect(component.filter).toBe('url(#pattern1)');

    component.description.texture = 2;
    component.ngOnInit();
    expect(component.filter).toBe('url(#pattern2)');

    component.description.texture = 3;
    component.ngOnInit();
    expect(component.filter).toBe('url(#pattern3)');

    component.description.texture = 4;
    component.ngOnInit();
    expect(component.filter).toBe('url(#pattern4)');

    component.description.texture = 5;
    component.ngOnInit();
    expect(component.filter).toBe('url(#pattern5)');

    component.description.texture = 6;
    component.ngOnInit();
    expect(component.filter).toBe('');
  });

});
