import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { AppModule } from '../../app.module';
import { ColorService } from './color.service';

// Specific numbers for specific tests
// tslint:disable: no-magic-numbers
describe('ColorService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [MatDialog]
  }));

  it('should be created', () => {
    const service: ColorService = TestBed.get(ColorService);
    expect(service).toBeTruthy();
  });

  it('#reset() should reset all the #value ', () => {
    const service: ColorService = TestBed.get(ColorService);
    service.reset();

    // tslint:disable: no-string-literal
    expect(service['primary']).toBe('rgba(255,255,255,1)');
    expect(service['primOpacity']).toBe(1);
    expect(service['secondary']).toBe('rgba(0,0,0,1)');
    expect(service['secOpacity']).toBe(1);

    for (let i = 0; i < 10; i++) {
      expect(service.previousColors[i]).toBe('none');
    }
  });

  it('#pickPrimary() should call dialog.open', () => {
    const service: ColorService = TestBed.get(ColorService);
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    service.pickPrimary();
    expect(spy).toHaveBeenCalled();
  });

  it('#pickSecondary() should call dialog.open', () => {
    const service: ColorService = TestBed.get(ColorService);
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    service.pickSecondary();
    expect(spy).toHaveBeenCalled();
  });

  it('#getColor() should return a string', () => {
    const service: ColorService = TestBed.get(ColorService);
    service['primary'] = 'rgba(255,255,255,1)';
    service['secondary'] = 'rgba(0,255,255,1)';

    for (let i = 0; i < 10; i++) {
      service.previousColors[i] = 'rgba(0,0,0,1)';
    }

    let returnValue = service.getColor(10);
    expect(returnValue).toBe(service['primary']);
    returnValue = service.getColor(11);
    expect(returnValue).toBe(service['secondary']);

    for (let i = 0; i < 10; i++) {
      returnValue = service.getColor(i);
      expect(returnValue).toBe(service.previousColors[i]);
    }
  });

  it('#getPrimaryColor() should return  #primary', () => {
    const service: ColorService = TestBed.get(ColorService);
    service['primary'] =  'rgba(255,255,255,1)';
    const returnValue = service.getPrimaryColor();
    expect(returnValue).toBe(service['primary']);
  });

  it('#getRGBA() should return a string', () => {
    const service: ColorService = TestBed.get(ColorService);
    service['primary'] =  'rgba(255,255,255,1)';
    service['primOpacity'] =  0.5;
    service['secondary'] =  'rgba(0,255,255,1)';
    service['secOpacity'] =  0.5;

    let returnValue = service.getRGBA(true);
    expect(returnValue).toBe('rgba(255,255,255,0.5)');
    returnValue = service.getRGBA(false);
    expect(returnValue).toBe('rgba(0,255,255,0.5)');
  });

  it('#setColor() should add new colors in #previousColors', () => {
    const service: ColorService = TestBed.get(ColorService);
    service['primary'] =  'rgba(255,255,255,1)';
    service['secondary'] =  'rgba(0,255,255,1)';
    for (let i = 0; i < 10; i++) {
      service.previousColors[i] = 'rgba(0,0,0,1)';
    }

    service.setColor(true, '0,0,0,0', 1);
    expect(service.previousColors[0]).toBe('rgba(255,255,255,1)');
    service.setColor(false, '0,0,0,0', 1);
    expect(service.previousColors[0]).toBe('rgba(0,255,255,1)');
  });

  it('#switchColor() should switch the primary and the secondary color', () => {
    const service: ColorService = TestBed.get(ColorService);
    service['primary'] =  'rgba(255,255,255,1)';
    service['secondary'] =  'rgba(0,255,255,1)';

    service.switchColor();
    expect(service['primary']).toBe('rgba(0,255,255,1)');
    expect(service['secondary']).toBe('rgba(255,255,255,1)');
  });

  it('#switchOldColor() should call setColor()', () => {
    const service: ColorService = TestBed.get(ColorService);
    const spy = spyOn(service, 'setColor').and.callThrough();
    service.switchOldColor(true, 5);
    expect(spy).toHaveBeenCalled();
  });

  it('#colorToValues() should return a number[]', () => {
    const service: ColorService = TestBed.get(ColorService);
    service['primary'] =  'rgba(255,255,255,1)';
    service['secondary'] =  'rgba(0,255,255,1)';

    let returnValue = service.colorToValues(true);
    expect(returnValue[0]).toBe(255);
    expect(returnValue[1]).toBe(255);
    expect(returnValue[2]).toBe(255);
    expect(returnValue[3]).toBe(100);

    returnValue = service.colorToValues(false);
    expect(returnValue[0]).toBe(0);
    expect(returnValue[1]).toBe(255);
    expect(returnValue[2]).toBe(255);
    expect(returnValue[3]).toBe(100);
  });

});
