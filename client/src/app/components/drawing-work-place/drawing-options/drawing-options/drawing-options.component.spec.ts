import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridService } from 'src/app/services/grid-service/grid.service';
import { DrawingOptionsComponent } from './drawing-options.component';

// To test specefic case in the test
// tslint:disable: no-magic-numbers
describe('DrawingOptionsComponent', () => {
  let component: DrawingOptionsComponent;
  let fixture: ComponentFixture<DrawingOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingOptionsComponent ],
      providers: [GridService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showGrid should change the boolean', () => {
    component.gridToggle = true;
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component['gridService'], 'changeGridToggle').and.callThrough();

    component.showGrid();
    expect(component.gridToggle).toBe(false);
    expect(spy).toHaveBeenCalled();
  });

  it('increaseGrid should change the gridSize', () => {
    component.gridSize = 5;
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component['gridService'], 'changeGridSize').and.callThrough();

    component.increaseGrid();
    expect(component.gridSize).toBe(10);
    expect(spy).toHaveBeenCalled();
  });

  it('decreaseGrid should change the gridSize', () => {
    component.gridSize = 0;
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component['gridService'], 'changeGridSize').and.callThrough();

    component.decreaseGrid();
    expect(component.gridSize).toBe(1);

    component.gridSize = 5;
    component.decreaseGrid();
    expect(component.gridSize).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('verifyInput should verify the input', () => {
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component['gridService'], 'changeGridSize').and.callThrough();

    component.verifyInput('5');
    expect(component.gridSize).toBe(5);
    expect(spy).toHaveBeenCalled();

    component.verifyInput('a');
    expect(component.gridSize).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  it('setOpacity should change the opacity', () => {
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component['gridService'], 'changeGridOpacity').and.callThrough();

    component.setOpacity(5);
    expect(component.opacity).toBe(5);
    expect(spy).toHaveBeenCalled();
  });

  it('toggleSelectionFill should change selection opacity', () => {
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(component['gridService'], 'changeSelectionFillToggle').and.callThrough();

    component.toggleSelectionFill();
    expect(spy).toHaveBeenCalled();
  });
});
