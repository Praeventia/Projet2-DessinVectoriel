import { TestBed } from '@angular/core/testing';
import { AutoSavedDrawing } from '../../../../../common/communication/auto-saved-drawing';
import { AutoSaveService } from './auto-save.service';

describe('AutoSaveService', () => {

  let autoSaveService: AutoSaveService;
  let fakeLocalStorage: { [x: string]: string; };

  beforeEach(() => {

    TestBed.configureTestingModule({ providers: [AutoSaveService, {provide: fakeLocalStorage, useValue: fakeLocalStorage}] });
    autoSaveService = TestBed.get(AutoSaveService);

    fakeLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string): string => {
        return fakeLocalStorage[key] ? fakeLocalStorage[key] : '';
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
        fakeLocalStorage[key] = value;
    });

  });

  it('should be created', () => {
    expect(autoSaveService).toBeTruthy();
  });

  it('isEmpty should return false if there is a drawing saved', () => {
    const drawing: AutoSavedDrawing = {
        backgroundColor: 'color',
        width: 1,
        height: 1,
        shapes: '{}'
    };
    autoSaveService.autoSaveDrawing(drawing);
    expect(autoSaveService.isEmpty()).toBeFalsy();
  });

  it('isEmpty should return true if there is no drawing saved', () => {
    expect(autoSaveService.isEmpty()).toBeTruthy();
  });

  it('autoSaveDrawing should save the drawing in localStorage', () => {
    const drawing: AutoSavedDrawing = {
        backgroundColor: 'color',
        width: 1,
        height: 1,
        shapes: '{}'
    };
    autoSaveService.autoSaveDrawing(drawing);
    expect(autoSaveService.getAutoSavedDrawing()).toEqual(drawing);
  });

  it('getAutoSaedDrawing should return the drawing saved in localStorage', () => {
    const drawing: AutoSavedDrawing = {
        backgroundColor: 'color',
        width: 1,
        height: 1,
        shapes: '{}'
    };
    autoSaveService.autoSaveDrawing(drawing);
    const drawingSaved: AutoSavedDrawing = autoSaveService.getAutoSavedDrawing();
    expect(drawingSaved.backgroundColor).toEqual(drawing.backgroundColor);
    expect(drawingSaved.width).toEqual(drawing.width);
    expect(drawingSaved.height).toEqual(drawing.height);
    expect(drawingSaved.shapes).toEqual(drawing.shapes);
  });

});
