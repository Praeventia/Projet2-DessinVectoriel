import { ShapeDescription } from './shape-description';

describe('ShapeDescription', () => {

  const component = new ShapeDescription();

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateFill should update the fillcolor', () => {
    component.updateFill();
    expect(component.fillColor).toBe(ShapeDescription.fillColor);
  });

  it('updateStroke should update the the stroke color', () => {
    component.updateStroke();
    expect(component.strokeColor).toBe(ShapeDescription.strokeColor);
  });

  it('copy should return a copy of the shapeDescription', () => {
    const copyShape = new ShapeDescription();
    const returnValue = component.copy(copyShape);
    expect(returnValue).toEqual(copyShape);
  });

});
