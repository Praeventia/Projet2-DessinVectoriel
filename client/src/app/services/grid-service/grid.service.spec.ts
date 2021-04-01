import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';

// Specific values for tests
// tslint:disable: no-magic-numbers
describe('GridService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [GridService, EventEmitter],
  }));

  it('should be created', () => {
    const service: GridService = TestBed.get(GridService);
    expect(service).toBeTruthy();
  });

  it('changeGridSize should emit the number', () => {
    const service: GridService = TestBed.get(GridService);
    const eventSpy = spyOn(service.gridSize, 'emit').and.callThrough();

    // tslint:disable-next-line: no-magic-numbers
    service.changeGridSize(10);
    expect(eventSpy).toHaveBeenCalled();
  });

  it('changeGridOpacity should emit the number', () => {
    const service: GridService = TestBed.get(GridService);
    const eventSpy = spyOn(service.opacity, 'emit').and.callThrough();

    service.changeGridOpacity(10);
    expect(eventSpy).toHaveBeenCalled();
  });

  it('changeGridToggle should emit a boolean', () => {
    const service: GridService = TestBed.get(GridService);
    const eventSpy = spyOn(service.gridToggle, 'emit').and.callThrough();

    service.changeGridToggle(true);
    expect(eventSpy).toHaveBeenCalled();
  });

  it('getEmittedValueGridSize should return the event', () => {
    const service: GridService = TestBed.get(GridService);

    service.changeGridSize(10);
    const returnValue = service.getEmittedValueGridSize();
    expect(returnValue).toBe(service.gridSize);
  });

  it('getEmittedValueOpacity should return the event', () => {
    const service: GridService = TestBed.get(GridService);

    service.changeGridOpacity(10);
    const returnValue = service.getEmittedValueOpacity();
    expect(returnValue).toBe(service.opacity);
  });

  it('getEmittedValueGridToggle should return the event', () => {
    const service: GridService = TestBed.get(GridService);

    service.changeGridToggle(true);
    const returnValue = service.getEmittedValueGridToggle();
    expect(returnValue).toBe(service.gridToggle);
  });
});
