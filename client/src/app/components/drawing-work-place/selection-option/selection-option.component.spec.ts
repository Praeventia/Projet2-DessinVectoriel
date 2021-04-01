import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SELECT_TOOLS } from 'src/app/services/enum/select-tool';
import { GridService } from 'src/app/services/grid-service/grid.service';
import { ModalWindowService } from 'src/app/services/modal-window/modal-window.service';
import { ToolManagerService } from 'src/app/services/tool-manager/tool-manager.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import SpyObj = jasmine.SpyObj;
import { SelectionOptionComponent } from './selection-option.component';

// To have acces to private method and test edge case
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
describe('SelectionOptionComponent', () => {
  let component: SelectionOptionComponent;
  let fixture: ComponentFixture<SelectionOptionComponent>;
  let modalServiceSpy: SpyObj<ModalWindowService>;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => {
    modalServiceSpy = jasmine.createSpyObj('ModalWindowService', ['openGuideModal', 'openGallery', 'openSaveDrawingForm',
    'openNewDrawModal', 'openConfirmationModal']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionOptionComponent],
      providers: [{provide: ModalWindowService, useValue: modalServiceSpy}, DrawingAreaComponent, GridService, ToolManagerService],
      imports: [MatDialogModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.drawingArea = drawingArea;
    expect(component).toBeTruthy();
  });

  it('copy should call clipboard copy', () => {
    const clipboard = TestBed.get(ClipboardService);
    const copySpy = spyOn(clipboard, 'copy');
    component['shapeStackIsEmpty'] = false;

    component.copy();
    expect(copySpy).toHaveBeenCalled();
  });

  it('cut should call the cliboard.cut', () => {
    const clipboard = TestBed.get(ClipboardService);
    const cutSpy = spyOn(clipboard, 'cut');
    component['shapeStackIsEmpty'] = false;

    component.cut();
    expect(cutSpy).toHaveBeenCalled();
  });

  it('delete should call the clipboard delete', () => {
    const clipboard = TestBed.get(ClipboardService);
    const deleteSpy = spyOn(clipboard, 'delete');
    component['shapeStackIsEmpty'] = false;

    component.delete();
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('paste should call the clipboard.paste', () => {
    const clipboard = TestBed.get(ClipboardService);
    const pasteSpy = spyOn(clipboard, 'paste');

    component.paste();
    expect(pasteSpy).toHaveBeenCalled();
  });

  it('duplicate should call the clipboard.duplicate', () => {
    const clipboard = TestBed.get(ClipboardService);
    const duplicateSpy = spyOn(clipboard, 'duplicate');

    component.duplicate();
    expect(duplicateSpy).toHaveBeenCalled();
  });

  it('grid should set the current to to grid', () => {

    component.grid();
    expect(component['currentTool']).toBe(SELECT_TOOLS.GRID);
  });

  it('showGrid should change the boolean', () => {
    component['gridToggle'] = true;
    const spy = spyOn(component['gridService'], 'changeGridToggle').and.callThrough();

    component.showGrid();
    expect(component['gridToggle']).toBe(false);
    expect(spy).toHaveBeenCalled();
  });

  it('increaseGrid should change the gridSize', () => {
    component['gridSize'] = 5;
    const spy = spyOn(component['gridService'], 'changeGridSize').and.callThrough();

    component.increaseGrid();
    expect(component['gridSize']).toBe(10);
    expect(spy).toHaveBeenCalled();
  });

  it('decreaseGrid should change the gridSize', () => {
    component['gridSize'] = 0;
    const spy = spyOn(component['gridService'], 'changeGridSize').and.callThrough();

    component.decreaseGrid();
    expect(component['gridSize']).toBe(1);

    component['gridSize'] = 5;
    component.decreaseGrid();
    expect(component['gridSize']).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('verifyInput should verify the input', () => {
    const spy = spyOn(component['gridService'], 'changeGridSize').and.callThrough();

    component.verifyInput('5');
    expect(component['gridSize']).toBe(5);
    expect(spy).toHaveBeenCalled();

    component.verifyInput('a');
    expect(component['gridSize']).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  it('setOpacity should change the opacity', () => {
    const spy = spyOn(component['gridService'], 'changeGridOpacity').and.callThrough();

    component.setOpacity(5);
    expect(component['opacity']).toBe(5);
    expect(spy).toHaveBeenCalled();
  });

  it('toggleSelectionFill should change selection opacity', () => {
    const spy = spyOn(component['gridService'], 'changeSelectionFillToggle').and.callThrough();

    component.toggleSelectionFill();
    expect(spy).toHaveBeenCalled();
  });

});
