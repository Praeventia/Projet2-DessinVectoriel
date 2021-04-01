import { TestBed } from '@angular/core/testing';
import { HotkeysService } from './hotkeys.service';

// Necessary for tests
// tslint:disable: no-empty
describe('HotkeysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    expect(service).toBeTruthy();
  });

  it('#listen should return the unlisten method and setup the listener', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    // To spy on a private method
    // tslint:disable-next-line: no-any
    const serviceSpy = spyOn<any>(service, 'addListener').and.callThrough();
    const returnValue = service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100} );
    expect(serviceSpy).toHaveBeenCalled();
    expect(returnValue).toBe(returnValue);
  });

  it('normalizeTerminalWhitelist should return the normalized key', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    // To spy on a private method
    // tslint:disable-next-line: no-any
    const serviceSpy = spyOn<any>(service, 'normalizeKey').and.callThrough();
    service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100} );
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    expect(service['listeners'][0].terminalWhitelist[0]).toBeUndefined();
    service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100, terminalWhitelist: ['control.g']} );
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('removeListener should remove the listener to remove', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    // To spy on a private attribut method
    // tslint:disable-next-line: no-string-literal
    const serviceSpy = spyOn(service['listeners'], 'filter').and.callThrough();
    const returnValue = service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100} );
    returnValue();
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('normalizeTerminal should normalize the terminal option', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100} );
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    expect(service['listeners'][0].terminal).toBe(true);
    service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100, terminal: true} );
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    expect(service['listeners'][0].terminal).toBe(true);
  });

  it('normalizeInputs should normalize the inputs', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100} );
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    expect(service['listeners'][0].terminal).toBe(true);
    service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100, inputs: false} );
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    expect(service['listeners'][0].terminal).toBe(true);
  });

  it('handleKeyboardEvent should return the good terminal section', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    const spyZone = spyOn (service['zone'], 'runGuarded').and.callThrough();
    const keyboard = new KeyboardEvent('keydown', {key: 'c'});
    service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100} );
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    service['handleKeyboardEvent'](keyboard);
    expect(spyZone).toHaveBeenCalled();
  });

  it('isEventFromInput should return a bool', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    const keyboard =  new KeyboardEvent('keydown', { code: 'KeyL' });
    service.listen( {c: ( event: KeyboardEvent): void => {} }, { priority: 100} );
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    const returnValue = service['isEventFromInput'](keyboard);
    expect(returnValue).toBe(false);
  });

  it('getKeyFromEvent should return the normalized keys', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    let keyboard =  new KeyboardEvent('keydown', { key: 'l' });
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    let returnValue = service['getKeyFromEvent'](keyboard);
    expect(returnValue).toBe('l');
    keyboard =  new KeyboardEvent('keydown', { key: 'Alt+u' });
    // To test a private method with a private attribut
    // tslint:disable-next-line: no-string-literal
    returnValue = service['getKeyFromEvent'](keyboard);
    expect(returnValue).toBe('alt+u');
  });
});
