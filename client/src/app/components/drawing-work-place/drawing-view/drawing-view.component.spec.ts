import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogModule} from '@angular/material/dialog';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SELECT_FILTER_TYPE } from 'src/app/services/enum/filters';
import { SELECT_NAVBAR } from 'src/app/services/enum/select-nav-bar';
import { GridService } from 'src/app/services/grid-service/grid.service';
import { InteractionFormDrawingService } from 'src/app/services/interaction-form-drawing/interaction-form-drawing.service';
import { ColorService } from '../../../services/color-service/color.service';
import SpyObj = jasmine.SpyObj;
import { ModalWindowService } from '../../../services/modal-window/modal-window.service';
import { DrawingAreaComponent } from '../drawing-area/drawing-area.component';
import { DrawingViewComponent } from './drawing-view.component';

// to acces a private attribut
// tslint:disable: no-string-literal
describe('DrawingViewComponent', () => {
  let component: DrawingViewComponent;
  let fixture: ComponentFixture<DrawingViewComponent>;
  let modalServiceSpy: SpyObj<ModalWindowService>;
  let drawingArea: DrawingAreaComponent;

  beforeEach(() => {
    modalServiceSpy = jasmine.createSpyObj('ModalWindowService', ['openGuideModal', 'openGallery', 'openSaveDrawingForm',
    'openNewDrawModal', 'openConfirmationModal']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingViewComponent],
      providers: [{provide: ModalWindowService, useValue: modalServiceSpy}, DrawingAreaComponent, GridService],
      imports: [MatDialogModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    drawingArea = TestBed.get(DrawingAreaComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.drawingArea = drawingArea;
    expect(component).toBeTruthy();
  });

  it('#openNavTools() should change the activeBar value', () => {
    component.openNavTools();
    expect(component['activeNavBar']).toBe(SELECT_NAVBAR.NAV_TOOLS);
  });

  it('#selector() should change the activeBar value', () => {
    component.selector();
    expect(component['activeNavBar']).toBe(SELECT_NAVBAR.NAV_SELECTOR);
    expect(component['pushActive']).toBe(false);
  });

  it('#shape() should change the activeBar value', () => {
    component.shape();
    expect(component['activeNavBar']).toBe(SELECT_NAVBAR.NAV_SHAPES);
    expect(component['pushActive']).toBe(true);
  });

  it('#text() should change the activeBar value', () => {
    component.text();
    expect(component['activeNavBar']).toBe(SELECT_NAVBAR.NAV_TEXT);
    expect(component['pushActive']).toBe(false);
  });

  it('#setBackgroundColor() should call getPrimaryColor() of the color service', () => {
    const colorService: ColorService = TestBed.get(ColorService);
    const colorSpy = spyOn(colorService, 'getPrimaryColor').and.callThrough();
    component.setBackgroundcolor();
    expect(colorSpy).toHaveBeenCalled();
  });

  it('#setBackgroundColor() should call sendBackgroundColor() of the interaction service', () => {
    const interactionService: InteractionFormDrawingService = TestBed.get(InteractionFormDrawingService);
    const sendBackgroundColorSpy = spyOn(interactionService, 'sendBackgroundColor');
    component.setBackgroundcolor();
    expect(sendBackgroundColorSpy).toHaveBeenCalled();
  });

  it('#openHelp() should call the openGuideModal() method', () => {
    component.openHelp();
    expect(modalServiceSpy.openGuideModal).toHaveBeenCalled();
  });

  it('#openOption() should call the activeBar value', () => {
    component.openOption();
    expect(component['activeNavBar']).toBe(SELECT_NAVBAR.NAV_OPTIONS);
    expect(component['pushActive']).toBe(true);
  });

  it('openGallery should open the gallery modal', () => {
    component['modal'].isOpen = false;
    component.openGallery();
    expect(modalServiceSpy.openGallery).toHaveBeenCalled();
  });

  it('openSaveForm should open the save form', async () => {
    component['modal'].isOpen = false;
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    const drawingAreaSpy = spyOn (component.drawingArea, 'getSvgNodesString');
    const imageSpy = spyOn (component['imageTransformation'], 'preview').and.callThrough();
    const drawingFilter: SELECT_FILTER_TYPE = SELECT_FILTER_TYPE.NONE;
    const canvas = document.createElement('canvas');
    (drawingArea.canvas as unknown as HTMLCanvasElement) = canvas;
    component.openSaveForm(drawingArea, drawingFilter);
    expect(drawingAreaSpy).toHaveBeenCalled();
    await expect(imageSpy).toHaveBeenCalled();
  });

  it('openExportForm should open the export form', async () => {
    component['modal'].isOpen = false;
    const imageSpy = spyOn (component['imageTransformation'], 'preview').and.callThrough();
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    const drawingAreaSpy = spyOn (component.drawingArea, 'getSvgNodesString');

    component.openExportForm();

    expect(drawingAreaSpy).toHaveBeenCalled();

    await expect(imageSpy).toHaveBeenCalled();
  });

  it('openGallery should open the drawing form modal', () => {
    component['modal'].isOpen = false;
    component.openNewDrawingForm();
    expect(modalServiceSpy.openNewDrawModal).toHaveBeenCalled();
  });

  it('openConfirmationModal should open the confirmation modal', () => {
    component['drawingArea'].newShapeLvl = 1;
    component['modal'].isOpen = false;
    component.openConfirmationModal();
    expect(modalServiceSpy.openConfirmationModal).toHaveBeenCalled();
    component['drawingArea'].newShapeLvl = 0;
    component.openConfirmationModal();
    expect(modalServiceSpy.openNewDrawModal).toHaveBeenCalled();
  });

  it('undo should call the drawingArea undo', () => {
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    const drawingAreaSpy = spyOn (component.drawingArea, 'undo').and.callThrough();
    component.undo();
    expect(drawingAreaSpy).toHaveBeenCalled();
  });

  it('redo should call the drawingArea redo', () => {
    component.drawingArea = TestBed.get(DrawingAreaComponent);
    const drawingAreaSpy = spyOn (component.drawingArea, 'redo').and.callThrough();
    component.redo();
    expect(drawingAreaSpy).toHaveBeenCalled();
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

});
